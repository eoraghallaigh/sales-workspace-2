import { Fragment, useState } from "react";
import { DataWell } from "@/components/ui/data-well";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableToolbar } from "@/components/ui/table-toolbar";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ListFilter,
} from "lucide-react";
import Tag from "@/components/Tag";
import FilterPill from "@/components/FilterPill";
import { SIGNAL_LABELS } from "@/data/signals";

interface CustomerContact {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  signals: Array<{ variant: "green" | "blue" | "orange" | "yellow" | "neutral"; text: string }>;
}

interface CustomerRow {
  id: string;
  name: string;
  portalId: string;
  actionGuidanceCount: number;
  actionGuidanceLabel: string;
  signals: Array<{ variant: "green" | "blue" | "orange" | "yellow" | "neutral"; text: string }>;
  platformMrr: string;
  contacts: CustomerContact[];
}

const customers: CustomerRow[] = [
  {
    id: "cks-packout",
    name: "CKS Packout",
    portalId: "45844085",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Partner Sold: One5MS",
    signals: [],
    platformMrr: "",
    contacts: [],
  },
  {
    id: "chirp",
    name: "Chirp",
    portalId: "23947299",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "C3: Active CM Deal, Cure...",
    signals: [
      { variant: "orange", text: "Prospecting Agent" },
      { variant: "blue", text: "Pre-Renewal Strategic Window" },
    ],
    platformMrr: "",
    contacts: [
      {
        id: "taylor-roberts",
        name: "Taylor Roberts",
        role: "Chief Operating Officer",
        initials: "TR",
        avatarColor: "bg-trellis-orange-500",
        signals: [
          { variant: "green", text: "Primary Contact" },
          { variant: "neutral", text: "General - Executive" },
        ],
      },
      {
        id: "tevi-carvajal",
        name: "Tevi Carvajal",
        role: "",
        initials: "TC",
        avatarColor: "bg-trellis-orange-500",
        signals: [
          { variant: "neutral", text: "Sales - Executive" },
          { variant: "neutral", text: "CMS - Executive" },
        ],
      },
      {
        id: "ryan-peterson",
        name: "Ryan Peterson",
        role: "Partnership Manager",
        initials: "RP",
        avatarColor: "bg-trellis-orange-500",
        signals: [
          { variant: "neutral", text: "Sales - Influencer" },
          { variant: "neutral", text: "CMS - Influencer" },
        ],
      },
    ],
  },
  {
    id: "agentis-consulting",
    name: "Agentis Consulting",
    portalId: "47426205",
    actionGuidanceCount: 2,
    actionGuidanceLabel: "Partner Managed: You...",
    signals: [
      { variant: "orange", text: "Customer Agent" },
      { variant: "blue", text: "Pre-Renewal Strategic Window" },
    ],
    platformMrr: "",
    contacts: [],
  },
  {
    id: "james-immigration-law",
    name: "James Immigration Law",
    portalId: "34201583",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "C5: Active CM Deal, HBC...",
    signals: [
      { variant: "orange", text: "Customer Agent" },
      { variant: "blue", text: "Pre-Renewal Strategic Window" },
    ],
    platformMrr: "",
    contacts: [],
  },
  {
    id: "fenix-usa",
    name: "Fenix USA",
    portalId: "44655774",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "C5: Active CM Deal, CM...",
    signals: [
      { variant: "orange", text: "Customer Agent" },
      { variant: "yellow", text: "Seats Whitespace" },
    ],
    platformMrr: "",
    contacts: [],
  },
  {
    id: "pricebook-digital",
    name: "Pricebook Digital",
    portalId: "4436751",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Partner Sold: New Brand",
    signals: [{ variant: "orange", text: "Customer Agent" }],
    platformMrr: "",
    contacts: [],
  },
];

const FullCustomerBook = () => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["chirp"]));
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelected = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <DataWell
          label="Total book size"
          value="185"
          tooltip="Total customers in the install base book"
        />
        <DataWell
          label="IB deals created"
          value="—"
          tooltip="Install base deals created"
        />
        <DataWell
          label="% portals with credit usage"
          value="10%"
          tooltip="Share of portals consuming HubSpot Credits"
        />
      </div>

      {/* Title + Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="heading-300">Full Customer Book</h2>
          <p className="body-100 text-muted-foreground">185 customers</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPill label="Products (Hubs)" hasCarat options={["All Hubs", "Marketing Hub", "Sales Hub", "Service Hub", "Content Hub"]} />
          <FilterPill label="Next renewal date" hasCarat options={["Any", "Next 30 days", "Next 60 days", "Next 90 days"]} />
          <FilterPill label="Total MRR (Local)" hasCarat options={["Any", "< $500", "$500–$2k", "> $2k"]} />
          <FilterPill label="HubSpot Credits Consumption" hasCarat options={["Any", "Low", "Medium", "High"]} />
          <FilterPill label="Signals" hasCarat options={["All signals", ...SIGNAL_LABELS]} />
          <Button variant="ghost" size="medium" className="border border-transparent heading-50">
            <ListFilter className="h-4 w-4" />
            Advanced filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border bg-card rounded-[4px] overflow-hidden">
        <TableToolbar searchPlaceholder="Search portals" />
        <div className="overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="bg-[var(--color-fill-surface-recessed)] hover:bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
              <TableHead className="w-12 px-6 sticky left-0 z-20 bg-[var(--color-fill-surface-recessed)] table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                <Checkbox />
              </TableHead>
              <TableHead className="sticky left-12 z-20 bg-[var(--color-fill-surface-recessed)] min-w-[260px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                Customer
              </TableHead>
              <TableHead className="min-w-[140px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Portal ID</TableHead>
              <TableHead className="min-w-[240px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Action Guidance</TableHead>
              <TableHead className="min-w-[280px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Install Base Signals</TableHead>
              <TableHead className="min-w-[160px] px-6 table-header-text align-middle">Platform MRR (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:last-child>td]:border-b-0">
            {customers.map(customer => {
              const isExpanded = expanded.has(customer.id);
              const hasContacts = customer.contacts.length > 0;
              return (
                <Fragment key={customer.id}>
                  <TableRow className="bg-card hover:bg-fill-surface-recessed">
                    <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border px-4 py-3 align-middle">
                      <Checkbox
                        checked={selected.has(customer.id)}
                        onCheckedChange={() => toggleSelected(customer.id)}
                      />
                    </td>
                    <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(customer.id)}
                          className="flex items-center justify-center h-5 w-5 rounded hover:bg-trellis-neutral-200 text-muted-foreground"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <Button variant="link" className="body-125 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline">
                          {customer.name}
                        </Button>
                      </div>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <Button variant="link" className="body-100 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline inline-flex items-center gap-1">
                        {customer.portalId}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-foreground">
                        <span className="font-medium">{customer.actionGuidanceCount} action{customer.actionGuidanceCount === 1 ? "" : "s"}</span>
                        <span className="text-muted-foreground"> · {customer.actionGuidanceLabel}</span>
                      </span>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {customer.signals.map(signal => (
                          <Tag key={signal.text} variant={signal.variant === "neutral" ? "neutral" : signal.variant}>
                            {signal.text}
                          </Tag>
                        ))}
                      </div>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-muted-foreground">{customer.platformMrr || "—"}</span>
                    </td>
                  </TableRow>
                  {isExpanded && hasContacts && customer.contacts.map(contact => (
                    <TableRow key={`${customer.id}-${contact.id}`} className="bg-card hover:bg-fill-surface-recessed">
                      <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border pl-7 pr-1 py-3 align-middle">
                        <Checkbox />
                      </td>
                      <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                        <div className="flex items-center gap-3 pl-10">
                          <Avatar className={`h-7 w-7 ${contact.avatarColor}`}>
                            <AvatarFallback className={`${contact.avatarColor} text-trellis-white detail-100`}>
                              {contact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <Button variant="link" className="body-125 text-text-interactive hover:text-text-interactive-hover p-0 h-auto justify-start hover:no-underline">
                              {contact.name}
                            </Button>
                            {contact.role && (
                              <span className="detail-100 text-muted-foreground">{contact.role}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-border px-4 py-3 align-middle">
                        <span className="body-100 text-muted-foreground">—</span>
                      </td>
                      <td className="border-b border-border px-4 py-3 align-middle">
                        <Button variant="secondary-alt" size="small" className="heading-50">
                          Enroll in sequence
                        </Button>
                      </td>
                      <td className="border-b border-border px-4 py-3 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {contact.signals.map(signal => (
                            <Tag key={signal.text} variant={signal.variant === "neutral" ? "neutral" : signal.variant}>
                              {signal.text}
                            </Tag>
                          ))}
                        </div>
                      </td>
                      <td className="border-b border-border px-4 py-3 align-middle">
                        <span className="body-100 text-muted-foreground">—</span>
                      </td>
                    </TableRow>
                  ))}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
};


export default FullCustomerBook;
