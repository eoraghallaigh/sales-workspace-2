import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Columns3,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MAX_BULK_STRATEGY_COMPANIES } from "@/components/CompaniesTableView";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Tag from "@/components/Tag";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import ContactStrip from "@/components/installbase/ContactStrip";
import { useResizableColumns } from "@/hooks/useResizableColumns";
import { ColumnResizeHandle } from "@/components/ColumnResizeHandle";
import { cn } from "@/lib/utils";
import {
  formatMrr,
  getIbMetrics,
  type HubName,
  type IbCompany,
  type IbMetrics,
  type IbTier,
  type Portal,
} from "@/data/installBase";

/*
 * InstallBaseTable — the customer-book table. Each row is a portal: the company
 * row shows its primary (highest-MRR) portal, and expanding reveals the account's
 * remaining portals as sub-rows plus a full-width strip of curated contacts. All
 * columns are portal-scoped (see portalMetrics). The column set comes from a
 * registry with a default subset shown and the rest toggleable via "Edit
 * columns", mirroring the real Full Customer Book. See .context/ib-ppf-design.md.
 */

const HEADER_CELL =
  "px-4 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]";
const BODY_CELL = "border-b border-border px-4 py-3 align-middle";

const TIER_TAG: Record<IbTier, "orange" | "blue" | "yellow" | "neutral"> = {
  P1: "orange",
  P2: "blue",
  P3: "yellow",
  P4: "neutral",
};

const Dash = () => <span className="text-muted-foreground">—</span>;

const usd = (n: number) =>
  `US$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const renewalTone = (days: number): string =>
  days <= 30
    ? "text-trellis-red-900 font-medium"
    : days <= 60
      ? "text-trellis-yellow-900 font-medium"
      : "text-muted-foreground";

const usageDot = (score: number): string =>
  score >= 60 ? "bg-trellis-green-800" : score >= 40 ? "bg-trellis-yellow-500" : "bg-trellis-red-800";

const HUB_ORDER: HubName[] = ["Marketing", "Sales", "Service", "Content", "Operations"];

// Every column is portal-scoped: a row represents one portal, so genuinely
// per-portal fields come off the Portal itself while the account-wide metrics
// (success owner, usage, whitespace…) repeat from the company's record. The
// primary (highest-MRR) portal fills the company row; the rest become sub-rows.
const portalMetrics = (c: IbCompany, portal: Portal): IbMetrics => {
  const base = getIbMetrics(c.id);
  return {
    ...base,
    portalId: portal.id,
    platformMrr: portal.mrr,
    ibSignals:
      portal.signals && portal.signals.length > 0 ? portal.signals : base.ibSignals,
    creditsConsumedMtd:
      portal.creditsLimit != null ? (portal.creditsUsed ?? 0) : base.creditsConsumedMtd,
    creditsLimit: portal.creditsLimit != null ? portal.creditsLimit : base.creditsLimit,
  };
};

interface ColumnDef {
  id: string;
  header: string;
  minWidth: number;
  defaultVisible: boolean;
  render: (c: IbCompany, portal: Portal, m: IbMetrics) => ReactNode;
}

// Column registry — the real Full Customer Book field set. Each render receives
// the portal for its row plus that portal's scoped metrics (`m`); Total MRR and
// Next renewal read the portal directly.
const COLUMNS: ColumnDef[] = [
  {
    id: "portalId",
    header: "Portal ID",
    minWidth: 130,
    defaultVisible: true,
    render: (c, portal, m) => {
      return m.portalId ? (
        <button className="inline-flex items-center gap-1 body-100 text-text-interactive hover:text-text-interactive-hover">
          {m.portalId}
          <ExternalLink className="h-3 w-3" />
        </button>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "actionGuidance",
    header: "Action Guidance",
    minWidth: 260,
    defaultVisible: true,
    render: (c, portal, m) => {
      return m.actionGuidance ? (
        <span className="body-100 text-foreground" title={m.actionGuidance.label}>
          <span className="font-medium">
            {m.actionGuidance.count} action{m.actionGuidance.count === 1 ? "" : "s"}
          </span>
          <span className="text-muted-foreground"> · {m.actionGuidance.label}</span>
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "ibSignals",
    header: "Install Base Signals",
    minWidth: 220,
    defaultVisible: true,
    render: (c, portal, m) => {
      return m.ibSignals && m.ibSignals.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {m.ibSignals.map((s) => (
            <Tag key={s.text} variant={s.variant}>
              {s.text}
            </Tag>
          ))}
        </div>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "totalMrr",
    header: "Total MRR",
    minWidth: 130,
    defaultVisible: true,
    render: (_c, portal) => (
      <span className="body-125 text-foreground">{formatMrr(portal.mrr)}</span>
    ),
  },
  {
    id: "platformMrr",
    header: "Platform MRR (USD)",
    minWidth: 160,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.platformMrr != null ? (
        <span className="body-100 text-foreground">{usd(m.platformMrr)}</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "totalHubMrr",
    header: "Total Hub MRR",
    minWidth: 150,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.totalHubMrr != null ? (
        <span className="body-100 text-foreground">{usd(m.totalHubMrr)}</span>
      ) : (
        <Dash />
      );
    },
  },
  ...HUB_ORDER.map<ColumnDef>((hub) => ({
    id: `hub_${hub}`,
    header: hub,
    minWidth: 130,
    defaultVisible: false,
    render: (c, portal, m) => {
      const cell = m.hubMrr?.[hub];
      return cell ? (
        <div className="flex flex-col">
          <span className="body-100 text-foreground">{usd(cell.mrr)}</span>
          <span className="detail-200 text-muted-foreground">{cell.tier}</span>
        </div>
      ) : (
        <Dash />
      );
    },
  })),
  {
    id: "nextRenewal",
    header: "Next renewal",
    minWidth: 160,
    defaultVisible: true,
    render: (_c, portal) => (
      <span className={cn("body-100", renewalTone(portal.renewalInDays))}>
        {portal.renewalDate}{" "}
        <span className="detail-200">({portal.renewalInDays}d)</span>
      </span>
    ),
  },
  {
    id: "discountChanges",
    header: "Discount → Upcoming Changes",
    minWidth: 220,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.discountChanges && m.discountChanges.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {m.discountChanges.map((d) => (
            <span key={d.hub} className="detail-200 text-foreground">
              {d.hub}: {d.from}%
              {d.to != null && (
                <>
                  {" → "}
                  <span className="text-trellis-red-900">{d.to}%</span>
                </>
              )}
            </span>
          ))}
        </div>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "nextCancellation",
    header: "Next Cancellation Date",
    minWidth: 170,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.nextCancellationDate ? (
        <span className="body-100 text-foreground">{m.nextCancellationDate}</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "salesSeats",
    header: "Sales seats assigned",
    minWidth: 160,
    defaultVisible: false,
    render: (c, portal, m) => {
      const s = m.salesSeats;
      return s ? (
        <span className="body-100 text-foreground">
          {s.assigned} / {s.purchased}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "serviceSeats",
    header: "Service seats assigned",
    minWidth: 170,
    defaultVisible: false,
    render: (c, portal, m) => {
      const s = m.serviceSeats;
      return s ? (
        <span className="body-100 text-foreground">
          {s.assigned} / {s.purchased}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "openAlerts",
    header: "Open alerts",
    minWidth: 120,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.openAlerts != null ? (
        <span className="body-100 text-foreground">{m.openAlerts}</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "marketingContacts",
    header: "Marketing Contacts Limit %",
    minWidth: 200,
    defaultVisible: false,
    render: (c, portal, m) => {
      const mc = m.marketingContacts;
      return mc ? (
        <span className="body-100 text-foreground">
          {mc.used.toLocaleString("en-US")} / {mc.limit.toLocaleString("en-US")}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "creditsConsumption",
    header: "HubSpot Credits Consumption %",
    minWidth: 210,
    defaultVisible: true,
    render: (c, portal, m) => {
      if (m.creditsConsumedMtd == null && m.creditsLimit == null) return <Dash />;
      return (
        <span className="body-100 text-foreground">
          {(m.creditsConsumedMtd ?? 0).toLocaleString("en-US")} /{" "}
          {(m.creditsLimit ?? 0).toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    id: "creditsConsumedMtd",
    header: "Credits consumed (MTD)",
    minWidth: 180,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.creditsConsumedMtd != null ? (
        <span className="body-100 text-foreground">
          {m.creditsConsumedMtd.toLocaleString("en-US")}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "includedCredits",
    header: "Included Credits Monthly",
    minWidth: 200,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.includedCreditsMonthly != null ? (
        <span className="body-100 text-foreground">
          {m.includedCreditsMonthly.toLocaleString("en-US")}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "creditsLimit",
    header: "Credits limit",
    minWidth: 140,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.creditsLimit != null ? (
        <span className="body-100 text-foreground">
          {m.creditsLimit.toLocaleString("en-US")}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "activeTrials",
    header: "Active Trials",
    minWidth: 220,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.activeTrials ? (
        <span className="body-100 text-foreground" title={m.activeTrials}>
          {m.activeTrials}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "integrations",
    header: "Count of Integrations",
    minWidth: 160,
    defaultVisible: true,
    render: (c, portal, m) => {
      return m.integrationsCount != null ? (
        <span className="body-100 text-text-interactive">{m.integrationsCount} integrations</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "lastActivityPreview",
    header: "Last Activity Preview",
    minWidth: 260,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.lastActivityPreview ? (
        <span className="body-100 text-muted-foreground line-clamp-2" title={m.lastActivityPreview}>
          {m.lastActivityPreview}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "lastActivityBy",
    header: "Last Activity By",
    minWidth: 170,
    defaultVisible: false,
    render: (c, portal, m) => {
      const a = m.lastActivityBy;
      return a ? (
        <div className="flex flex-col">
          <span className="body-100 text-text-interactive">{a.name}</span>
          <span className="detail-200 text-muted-foreground">{a.role}</span>
        </div>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "nextActivity",
    header: "Next Activity",
    minWidth: 160,
    defaultVisible: false,
    render: (c, portal, m) => {
      const a = m.nextActivity;
      return a ? (
        <div className="flex flex-col">
          <span className="body-100 text-foreground">{a.name}</span>
          <span className="detail-200 text-muted-foreground">{a.when}</span>
        </div>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "usageScore",
    header: "Portal Usage Score",
    minWidth: 160,
    defaultVisible: true,
    render: (c, portal, m) => {
      return m.usageScore != null ? (
        <span className="flex items-center gap-2 body-100 text-foreground">
          <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", usageDot(m.usageScore))} />
          {m.usageScore}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "usageScoreTrend",
    header: "Usage Score Trend",
    minWidth: 150,
    defaultVisible: true,
    render: (c, portal, m) => {
      const t = m.usageScoreTrend;
      if (t == null) return <Dash />;
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 body-100",
            t > 0 ? "text-trellis-green-800" : t < 0 ? "text-trellis-red-800" : "text-muted-foreground",
          )}
        >
          {t > 0 && <ArrowUpRight className="h-3.5 w-3.5" />}
          {t < 0 && <ArrowDownRight className="h-3.5 w-3.5" />}
          {t > 0 ? "+" : ""}
          {t}%
        </span>
      );
    },
  },
  {
    id: "whitespace",
    header: "Whitespace",
    minWidth: 220,
    defaultVisible: true,
    render: (c, portal, m) => {
      const w = m.whitespace;
      return w && w.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {w.map((line) => (
            <span key={line} className="detail-200 text-foreground">
              {line}
            </span>
          ))}
        </div>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "usersLoggedIn30d",
    header: "Users Logged in (30d)",
    minWidth: 170,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.usersLoggedIn30d != null ? (
        <span className="body-100 text-foreground">{m.usersLoggedIn30d}</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "recentSqlDate",
    header: "Recent SQL Submission Date",
    minWidth: 200,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.recentSqlDate ? (
        <span className="body-100 text-foreground">{m.recentSqlDate}</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "primaryPocEmail",
    header: "Primary POC Email",
    minWidth: 220,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.primaryPocEmail ? (
        <span className="body-100 text-text-interactive truncate block" title={m.primaryPocEmail}>
          {m.primaryPocEmail}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "csmNotes",
    header: "CSM Notes",
    minWidth: 220,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.csmNotes ? (
        <span className="body-100 text-muted-foreground line-clamp-2" title={m.csmNotes}>
          {m.csmNotes}
        </span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "successOwnerNextMeeting",
    header: "Success Owner - Next Meeting",
    minWidth: 200,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.successOwnerNextMeeting ? (
        <span className="body-100 text-foreground">{m.successOwnerNextMeeting}</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "successOwner",
    header: "Success Owner",
    minWidth: 170,
    defaultVisible: true,
    render: (c, portal, m) => {
      return m.successOwner ? (
        <span className="body-100 text-foreground">{m.successOwner}</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "contractManager",
    header: "Contract Manager",
    minWidth: 170,
    defaultVisible: true,
    render: (c, portal, m) => {
      return m.contractManager ? (
        <span className="body-100 text-foreground">{m.contractManager}</span>
      ) : (
        <Dash />
      );
    },
  },
  {
    id: "managingPartners",
    header: "Managing Partners",
    minWidth: 180,
    defaultVisible: false,
    render: (c, portal, m) => {
      return m.managingPartners ? (
        <span className="body-100 text-foreground">{m.managingPartners}</span>
      ) : (
        <Dash />
      );
    },
  },
];

const INITIAL_WIDTHS: Record<string, number> = {
  customer: 260,
  tier: 90,
  ...Object.fromEntries(COLUMNS.map((col) => [col.id, col.minWidth])),
};

interface InstallBaseTableProps {
  companies: IbCompany[];
  onWork: (companyId: string) => void;
  onContactClick?: (contactId: string) => void;
  /** Show a Tier column — for the Full Customer Book, which spans all tiers. */
  showTier?: boolean;
  /** Show a search field in the toolbar. */
  searchPlaceholder?: string;
}

const InstallBaseTable = ({
  companies,
  onWork,
  onContactClick,
  showTier = false,
  searchPlaceholder,
}: InstallBaseTableProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState<Set<string>>(
    () => new Set(COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id)),
  );
  const { colStyle, startResize, totalWidth, fit } = useResizableColumns(INITIAL_WIDTHS);

  // Accordion — at most one account's contacts tray open at a time, so the
  // full-width panel never stacks and the table stays scannable.
  const toggle = (id: string) =>
    setExpanded((prev) => (prev.has(id) ? new Set() : new Set([id])));

  const toggleColumn = (id: string) =>
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Company (row) selection for bulk actions.
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const toggleRow = (id: string) =>
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const allSelected =
    companies.length > 0 && companies.every((c) => selectedRows.has(c.id));
  const toggleSelectAll = () =>
    setSelectedRows((prev) =>
      companies.every((c) => prev.has(c.id))
        ? new Set()
        : new Set(companies.map((c) => c.id)),
    );
  const clearSelection = () => setSelectedRows(new Set());

  const visibleColumns = COLUMNS.filter((c) => visible.has(c.id));
  const activeKeys = [
    "customer",
    ...(showTier ? ["tier"] : []),
    ...visibleColumns.map((c) => c.id),
  ];
  const tableWidth = totalWidth(activeKeys, 48); // +48 for the checkbox column

  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (scrollRef.current) {
      fit(activeKeys, scrollRef.current.clientWidth, 48);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastKey = activeKeys[activeKeys.length - 1];

  return (
    <div className="border border-border bg-card rounded-[4px] overflow-hidden">
      <TableToolbar
        searchPlaceholder={searchPlaceholder ?? "Search customers"}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="small"
                className="border border-transparent heading-50 whitespace-nowrap"
              >
                <Columns3 className="h-4 w-4" />
                Edit columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[420px] w-64 overflow-y-auto">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COLUMNS.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={visible.has(col.id)}
                  onCheckedChange={() => toggleColumn(col.id)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {selectedRows.size > 0 && (() => {
        const count = selectedRows.size;
        const noun = count === 1 ? "company" : "companies";
        const overLimit = count > MAX_BULK_STRATEGY_COMPANIES;
        const generateButton = (
          <Button
            variant="primary"
            size="small"
            disabled={overLimit}
            onClick={() => {
              toast.success(`Generating strategies for ${count} ${noun}`);
              clearSelection();
            }}
          >
            <TrellisIcon
              name="artificialIntelligence"
              size={14}
              className="mr-1 brightness-0 invert"
            />
            Generate strategies ({count})
          </Button>
        );
        return (
          <div className="flex items-center gap-3 px-4 py-2 min-h-[44px] border-b border-border bg-[var(--color-fill-surface-recessed)]">
            <span className="body-100 font-medium text-foreground whitespace-nowrap">
              {count} selected
            </span>
            {overLimit ? (
              <Tooltip>
                {/* Wrap in a span — a disabled button emits no pointer events, so
                    the span is what receives hover/focus to open the tooltip. */}
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex">
                    {generateButton}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  You can only generate strategies for {MAX_BULK_STRATEGY_COMPANIES}{" "}
                  companies at a time.
                </TooltipContent>
              </Tooltip>
            ) : (
              generateButton
            )}
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                toast.success(`Snoozed ${count} ${noun}`);
                clearSelection();
              }}
            >
              <TrellisIcon name="snooze" size={14} className="mr-1" />
              Snooze ({count})
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                toast.success(`Dismissed ${count} ${noun}`);
                clearSelection();
              }}
            >
              <TrellisIcon name="remove" size={14} className="mr-1" />
              Dismiss ({count})
            </Button>
            <Button
              variant="link"
              className="body-100 text-foreground h-auto p-0"
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        );
      })()}

      <div className="overflow-x-auto" ref={scrollRef}>
        <Table style={{ tableLayout: "fixed", width: tableWidth, minWidth: tableWidth }}>
          <TableHeader>
            <TableRow className="bg-[var(--color-fill-surface-recessed)] hover:bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
              <TableHead className="w-12 px-4 sticky left-0 z-20 bg-[var(--color-fill-surface-recessed)] table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead
                className={cn(
                  "sticky left-12 z-20 bg-[var(--color-fill-surface-recessed)]",
                  HEADER_CELL,
                )}
                style={colStyle("customer")}
              >
                Customer
                <ColumnResizeHandle onStart={(x) => startResize("customer", x)} />
              </TableHead>
              {showTier && (
                <TableHead className={cn("relative", HEADER_CELL)} style={colStyle("tier")}>
                  Tier
                  <ColumnResizeHandle onStart={(x) => startResize("tier", x)} />
                </TableHead>
              )}
              {visibleColumns.map((col) => (
                <TableHead
                  key={col.id}
                  className={cn(
                    "relative",
                    col.id === lastKey
                      ? HEADER_CELL.replace(
                          " border-r border-[var(--color-border-transitional-core-subtle)]",
                          "",
                        )
                      : HEADER_CELL,
                  )}
                  style={colStyle(col.id)}
                >
                  {col.header}
                  <ColumnResizeHandle onStart={(x) => startResize(col.id, x)} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:last-child>td]:border-b-0">
            {companies.map((company) => {
              const isExpanded = expanded.has(company.id);
              // A row is a portal. The primary (highest-MRR) portal fills the
              // company row; the rest always surface as sub-rows beneath it.
              const sortedPortals = [...company.portals].sort((a, b) => b.mrr - a.mrr);
              const [primaryPortal, ...restPortals] = sortedPortals;
              return (
                <Fragment key={company.id}>
                  {/* Merged company block — the primary and every portal sub-row
                      drop their full-width border so the company column reads as
                      one cell; the last portal row closes and separates the group. */}
                  <TableRow
                    className={cn(
                      "group bg-card hover:bg-fill-surface-recessed",
                      restPortals.length > 0 && "border-b-0",
                    )}
                  >
                    <td className="w-12 sticky left-0 z-10 bg-inherit px-4 py-3 align-middle">
                      <Checkbox
                        checked={selectedRows.has(company.id)}
                        onCheckedChange={() => toggleRow(company.id)}
                      />
                    </td>
                    <td
                      className="sticky left-12 z-10 bg-inherit border-r border-border px-4 py-3 align-middle cursor-pointer"
                      style={colStyle("customer")}
                      onClick={() => onWork(company.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(company.id);
                          }}
                          className="flex items-center justify-center h-5 w-5 flex-shrink-0 rounded hover:bg-trellis-neutral-200 text-muted-foreground"
                          aria-label={isExpanded ? "Collapse contacts" : "Expand contacts"}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <img
                          src={company.logo || companyLogoPlaceholder}
                          alt={`${company.name} logo`}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="body-125 text-text-interactive truncate">
                            {company.name}
                          </span>
                          <span className="detail-100 text-muted-foreground">
                            {company.portals.length}{" "}
                            {company.portals.length === 1 ? "portal" : "portals"}
                          </span>
                        </div>
                      </div>
                    </td>
                    {showTier && (
                      <td className={BODY_CELL} style={colStyle("tier")}>
                        <Tag variant={TIER_TAG[company.tier]}>{company.tier}</Tag>
                      </td>
                    )}
                    {visibleColumns.map((col) => (
                      <td key={col.id} className={BODY_CELL} style={colStyle(col.id)}>
                        {col.render(company, primaryPortal, portalMetrics(company, primaryPortal))}
                      </td>
                    ))}
                  </TableRow>

                  {/* Additional portals — one sub-row each, same columns. */}
                  {restPortals.map((portal, idx) => {
                      const m = portalMetrics(company, portal);
                      return (
                        <TableRow
                          key={`${company.id}-${portal.id}`}
                          className={cn(
                            "bg-card hover:bg-fill-surface-recessed",
                            idx < restPortals.length - 1 && "border-b-0",
                          )}
                        >
                          <td className="w-12 sticky left-0 z-10 bg-inherit px-4 py-3 align-middle" />
                          <td
                            className="sticky left-12 z-10 bg-inherit border-r border-border px-4 py-3 align-middle"
                            style={colStyle("customer")}
                          />
                          {showTier && <td className={BODY_CELL} style={colStyle("tier")} />}
                          {visibleColumns.map((col) => (
                            <td key={col.id} className={BODY_CELL} style={colStyle(col.id)}>
                              {col.render(company, portal, m)}
                            </td>
                          ))}
                        </TableRow>
                      );
                    })}

                  {/* Expanded contacts — revealed by the company-row expander,
                      shown as a panel below the portals. */}
                  {isExpanded && (
                    <TableRow className="bg-card hover:bg-card">
                      <td
                        colSpan={2 + (showTier ? 1 : 0) + visibleColumns.length}
                        className="py-2 pr-6 pl-16 align-top"
                      >
                        <div className="flex flex-col gap-3 mt-2">
                          <span className="heading-50 text-foreground">
                            Recommended contacts
                          </span>
                          <ContactStrip
                            company={company}
                            onWork={() => onWork(company.id)}
                            onContactClick={onContactClick}
                            showHeading={false}
                          />
                        </div>
                      </td>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InstallBaseTable;
