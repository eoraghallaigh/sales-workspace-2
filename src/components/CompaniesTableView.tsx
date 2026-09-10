import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { AILoader } from "@/components/ui/ai-loader";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Company } from "@/components/CompanyCard";
import {
  CompanyTable,
  type CompanyTableColumn,
} from "@/components/CompanyTable";
import SequenceEnrollmentModal from "@/components/SequenceEnrollmentModal";
import { SignalChipRow } from "@/components/SignalChip";
import PvsTooltip from "@/components/PvsTooltip";
import CompanyPlayTags from "@/components/CompanyPlayTags";
import ContactOutreachAvatars from "@/components/ContactOutreachAvatars";
import { MiniTouchDots, type TouchStatus } from "@/components/TouchDot";
import { getPlayStatusBadge } from "@/utils/companyStatusUtils";
import { getAdditionalContactsForCompany } from "@/data/allContacts";

/**
 * A rep can bulk-generate strategies for at most this many companies at once.
 * Strategy generation is expensive (minutes + tokens per company in the real
 * product), so we cap each batch rather than let a select-all fan out.
 */
export const MAX_BULK_STRATEGY_COMPANIES = 10;

/** Format a completion time for the "Generated: …" status (e.g. "Sep 10, 2:45 PM"). */
export const formatStrategyTimestamp = (date: Date): string =>
  date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

// Companies that already have a strategy in the seed data don't carry a real
// timestamp. Derive a stable "a few hours ago" one from the id so the column
// reads consistently across renders without editing the seed set.
const hashInt = (s: string) => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(hash);
};
const fallbackGeneratedAt = (id: string) =>
  formatStrategyTimestamp(new Date(Date.now() - (1 + (hashInt(id) % 23)) * 3_600_000));

interface CompaniesTableViewProps {
  companies: Company[];
  onCompanyClick?: (companyId: string) => void;
  onNameClick?: (companyId: string) => void;
  onPreview?: (companyId: string, companyName: string) => void;
  currentPlayId?: string;
  /** Contact-level handlers, forwarded to the ContactCards in an expanded row. */
  onContactClick?: (contactId: string) => void;
  onCallClick?: (contactId: string) => void;
  onEmailClick?: (contactId: string) => void;
  /** Start rows expanded (deep-work tiers like P1/P3). */
  expandByDefault?: boolean;
  /** Kick off bulk strategy generation for the given company ids. */
  onGenerateStrategies?: (companyIds: string[]) => void;
  /** Snooze the given companies (secondary bulk action). */
  onSnoozeCompanies?: (companyIds: string[]) => void;
  /** Dismiss the given companies (tertiary bulk action). */
  onDismissCompanies?: (companyIds: string[]) => void;
  /** Show the strategy-generation status column (used by Recently Generated). */
  showStrategyStatus?: boolean;
}

const getStatusBadge = (
  status: Company["status"],
): {
  label: string;
  variant: "status-orange" | "status-blue" | "status-yellow" | "status-green" | "status-gray";
} => {
  switch (status) {
    case "New":
      return { label: "New", variant: "status-blue" };
    case "Unworked QL":
      return { label: "QL", variant: "status-orange" };
    case "Unworked P1":
      return { label: "Unworked", variant: "status-blue" };
    case "In Progress":
      return { label: "In Progress", variant: "status-yellow" };
    case "Over SLA":
      return { label: "Over SLA", variant: "status-orange" };
    case "Worked":
      return { label: "Worked", variant: "status-green" };
    case "Snoozed":
      return { label: "Snoozed", variant: "status-gray" };
    default:
      return { label: "Dismissed", variant: "status-gray" };
  }
};

const getWhyNow = (company: Company): string =>
  company.conversionTrigger ?? "Ranked by urgency + account potential";

const CompaniesTableView = ({
  companies,
  onCompanyClick,
  onNameClick,
  onPreview,
  currentPlayId,
  onContactClick,
  onCallClick,
  onEmailClick,
  expandByDefault = false,
  onGenerateStrategies,
  onSnoozeCompanies,
  onDismissCompanies,
  showStrategyStatus = false,
}: CompaniesTableViewProps) => {
  const [search, setSearch] = useState("");
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(query));
  }, [companies, search]);

  const columns: CompanyTableColumn<Company>[] = [
    ...((showStrategyStatus
      ? [
          {
            key: "strategy",
            header: "Strategy Status",
            minWidth: 210,
            render: (c: Company) => {
              if (c.strategyStatus === "generating") {
                return (
                  <div className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
                    <AILoader size={16} />
                    <span className="reasoning-shimmer">Generating</span>
                  </div>
                );
              }
              if (c.strategyStatus === "failed") {
                return (
                  <div className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
                    <div className="h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                    <span className="text-destructive">Generation Failed</span>
                  </div>
                );
              }
              const generated =
                c.strategyStatus === "generated" || c.hasGeneratedStrategy !== false;
              if (generated) {
                return (
                  <div className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
                    <div className="h-1.5 w-1.5 rounded-full bg-trellis-green-600 flex-shrink-0" />
                    <span className="text-foreground">
                      Generated: {c.strategyGeneratedAt ?? fallbackGeneratedAt(c.id)}
                    </span>
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">Not Generated</span>
                </div>
              );
            },
          },
        ]
      : []) as CompanyTableColumn<Company>[]),
    {
      key: "industry",
      header: "Industry",
      minWidth: 140,
      render: (c) => <span className="body-100 text-foreground">{c.industry ?? "—"}</span>,
    },
    {
      key: "pvs",
      header: "PVS",
      minWidth: 100,
      render: (c) => (
        <PvsTooltip pvsScore={c.pvsScore}>
          <span className="body-100 text-foreground cursor-default">{c.pvsScore ?? "—"}</span>
        </PvsTooltip>
      ),
    },
    {
      key: "signals",
      header: "Signals",
      minWidth: 260,
      render: (c) => {
        const displayed = c.signals.slice(0, 2);
        return displayed.length > 0 ? (
          <SignalChipRow signals={displayed} owner={{ kind: "company", id: c.id, name: c.name }} />
        ) : (
          <span className="body-100 text-muted-foreground">{getWhyNow(c)}</span>
        );
      },
    },
    {
      key: "contacts",
      header: "Sequence Summary",
      minWidth: 160,
      render: (c) => <ContactOutreachAvatars contacts={c.recommendedContacts} align="start" />,
    },
    ...((currentPlayId
      ? []
      : [
          {
            key: "touches",
            header: "Touches",
            minWidth: 180,
            render: (c: Company) => {
              const statuses = [...(c.touches.touchStatuses || [])];
              while (statuses.length < 5) statuses.push("empty");
              return (
                <div className="flex items-center gap-2">
                  <MiniTouchDots statuses={statuses.slice(0, 5) as TouchStatus[]} />
                  <span className="detail-200 text-muted-foreground whitespace-nowrap">
                    due {c.touches.deadline}
                  </span>
                </div>
              );
            },
          },
        ]) as CompanyTableColumn<Company>[]),
    {
      key: "status",
      header: "Status",
      minWidth: 120,
      render: (c) => {
        const badge = currentPlayId ? getPlayStatusBadge(c.status) : getStatusBadge(c.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
  ];

  return (
    <CompanyTable<Company>
      rows={filteredCompanies}
      columns={columns}
      primaryHeader="Company"
      primaryMinWidth={260}
      minTableWidth={1000}
      onNameClick={(c) => (onNameClick ?? onCompanyClick)?.(c.id)}
      onPreview={onPreview ? (c) => onPreview(c.id, c.name) : undefined}
      renderNameExtra={(c) => (
        <CompanyPlayTags companyId={c.id} compact excludePlayId={currentPlayId} />
      )}
      getAvailableContacts={getAdditionalContactsForCompany}
      expandToContactCards
      defaultExpanded={expandByDefault}
      onContactClick={onContactClick}
      onContactCall={onCallClick}
      onContactEmail={onEmailClick}
      toolbar={
        <TableToolbar
          searchPlaceholder="Search companies"
          searchValue={search}
          onSearchChange={setSearch}
        />
      }
      renderRowBulkBar={(selectedRows, clearSelection) => {
        const count = selectedRows.length;
        const overLimit = count > MAX_BULK_STRATEGY_COMPANIES;
        const generateButton = (
          <Button
            variant="primary"
            size="small"
            disabled={overLimit}
            onClick={() => {
              onGenerateStrategies?.(selectedRows.map((c) => c.id));
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
          <>
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
                onSnoozeCompanies?.(selectedRows.map((c) => c.id));
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
                onDismissCompanies?.(selectedRows.map((c) => c.id));
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
          </>
        );
      }}
      renderBulkBar={(selected, clearSelection) => {
        const count = selected.length;
        const label =
          count === 1 ? selected[0]?.contact.name ?? "1 contact" : `${count} contacts`;
        return (
          <>
            <div className="flex items-center gap-3">
              <Button variant="primary" size="small" onClick={() => setIsEnrollOpen(true)}>
                Enrol ({count})
                <TrellisIcon name="sequences" size={14} className="ml-1 brightness-0 invert" />
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  toast.success(`Created call task${count !== 1 ? "s" : ""} for ${label}`);
                  clearSelection();
                }}
              >
                Create Call Task ({count})
                <TrellisIcon name="tasks" size={14} className="ml-1" />
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  toast.success(`Removed ${count} contact${count !== 1 ? "s" : ""}`);
                  clearSelection();
                }}
              >
                Hide ({count})
                <TrellisIcon name="hide" size={14} className="ml-1" />
              </Button>
              <Button
                variant="link"
                className="body-100 text-foreground h-auto p-0"
                onClick={clearSelection}
              >
                Clear
              </Button>
            </div>
            <SequenceEnrollmentModal
              open={isEnrollOpen}
              contacts={selected.map((s) => s.contact)}
              companyLogo={selected[0]?.row.logo}
              onOpenChange={setIsEnrollOpen}
              onEnroll={(_sequenceId, sequenceName) => {
                toast.success(`Enrolled ${label} in ${sequenceName}`);
                setIsEnrollOpen(false);
                clearSelection();
              }}
            />
          </>
        );
      }}
    />
  );
};

export default CompaniesTableView;
