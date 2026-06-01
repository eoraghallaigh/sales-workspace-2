import { Fragment, useState } from "react";
import { DataWell } from "@/components/ui/data-well";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ListFilter,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import Tag from "@/components/Tag";

interface ProspectContact {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  signals: Array<{ variant: "green" | "blue" | "orange" | "yellow" | "neutral"; text: string }>;
}

interface ProspectRow {
  id: string;
  name: string;
  domain: string;
  actionGuidanceCount: number;
  actionGuidanceLabel: string;
  signals: Array<{ variant: "green" | "blue" | "orange" | "yellow" | "neutral"; text: string }>;
  priority: "P1" | "P2" | "P3" | "P4";
  contacts: ProspectContact[];
}

const prospects: ProspectRow[] = [
  {
    id: "northwind-labs",
    name: "Northwind Labs",
    domain: "northwindlabs.com",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Recent Series B announced",
    signals: [
      { variant: "green", text: "Marketing Hub QL" },
      { variant: "yellow", text: "Recent Funding Round" },
    ],
    priority: "P1",
    contacts: [
      {
        id: "alex-hsu",
        name: "Alex Hsu",
        role: "VP, Demand Generation",
        initials: "AH",
        avatarColor: "bg-trellis-purple-600",
        signals: [
          { variant: "green", text: "Primary Contact" },
          { variant: "neutral", text: "Marketing - Executive" },
        ],
      },
      {
        id: "priya-shah",
        name: "Priya Shah",
        role: "Director of RevOps",
        initials: "PS",
        avatarColor: "bg-trellis-purple-600",
        signals: [
          { variant: "neutral", text: "Operations - Influencer" },
        ],
      },
    ],
  },
  {
    id: "lattice-studios",
    name: "Lattice Studios",
    domain: "latticestudios.io",
    actionGuidanceCount: 2,
    actionGuidanceLabel: "Active competitor renewal window",
    signals: [
      { variant: "green", text: "Competitive Renewal" },
      { variant: "orange", text: "3rd Party Intent Signals" },
    ],
    priority: "P1",
    contacts: [],
  },
  {
    id: "harborline-co",
    name: "Harborline Co.",
    domain: "harborline.co",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Multiple non-QL demand signals",
    signals: [{ variant: "blue", text: "Non-QL Demand" }],
    priority: "P2",
    contacts: [],
  },
  {
    id: "carbon-six",
    name: "Carbon Six",
    domain: "carbonsix.ai",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Inbound demo request",
    signals: [
      { variant: "green", text: "Marketing Hub QL" },
    ],
    priority: "P2",
    contacts: [],
  },
  {
    id: "verdantbio",
    name: "VerdantBio",
    domain: "verdantbio.com",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Hiring sales leadership",
    signals: [
      { variant: "yellow", text: "Recent Funding Round" },
    ],
    priority: "P3",
    contacts: [],
  },
  {
    id: "skyline-finance",
    name: "Skyline Finance",
    domain: "skylinefinance.com",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Inbound contact form submission",
    signals: [{ variant: "blue", text: "Non-QL Demand" }],
    priority: "P3",
    contacts: [],
  },
];

const FullProspectBook = () => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["northwind-labs"]));
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
      <div className="grid grid-cols-4 gap-4">
        <DataWell
          label="Total book size"
          value="312"
          tooltip="Total prospects in the net new book"
        />
        <DataWell
          label="Total book worked"
          value="52%"
          tooltip="Share of the prospect book that has been worked"
        />
        <DataWell
          label="Net new deals created"
          value="18"
          tooltip="Net new deals created"
        />
        <DataWell
          label="% prospects with intent"
          value="34%"
          tooltip="Share of prospects with active intent signals"
        />
      </div>

      {/* Title + Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="heading-300">Full Prospect Book</h2>
          <p className="body-100 text-muted-foreground">312 prospects</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPill label="Priority" hasCarat options={["All", "P1", "P2", "P3", "P4"]} />
          <FilterPill label="Industry" hasCarat options={["All industries", "Technology", "Healthcare", "Finance", "Manufacturing"]} />
          <FilterPill label="ICP fit" hasCarat options={["Any", "High", "Medium", "Low"]} />
          <FilterPill label="Intent strength" hasCarat options={["Any", "Strong", "Moderate", "Weak"]} />
          <Button variant="ghost" size="medium" className="border border-transparent heading-50">
            <ListFilter className="h-4 w-4" />
            Advanced filters
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search prospects" className="pl-9 rounded-full bg-card" />
      </div>

      {/* Table */}
      <div className="border border-border bg-card overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="bg-[var(--color-specialty-table-header-default)] hover:bg-[var(--color-specialty-table-header-default)]">
              <TableHead className="w-12 h-11 px-6 py-3 sticky left-0 z-20 bg-[var(--color-specialty-table-header-default)] table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                <Checkbox />
              </TableHead>
              <TableHead className="sticky left-12 z-20 bg-[var(--color-specialty-table-header-default)] min-w-[260px] h-11 px-6 py-3 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                Company
              </TableHead>
              <TableHead className="min-w-[180px] h-11 px-6 py-3 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Domain</TableHead>
              <TableHead className="min-w-[240px] h-11 px-6 py-3 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Action Guidance</TableHead>
              <TableHead className="min-w-[280px] h-11 px-6 py-3 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Intent Signals</TableHead>
              <TableHead className="min-w-[100px] h-11 px-6 py-3 table-header-text align-middle">Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects.map(prospect => {
              const isExpanded = expanded.has(prospect.id);
              const hasContacts = prospect.contacts.length > 0;
              return (
                <Fragment key={prospect.id}>
                  <TableRow className="bg-card hover:bg-fill-surface-recessed">
                    <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border px-4 py-3 align-middle">
                      <Checkbox
                        checked={selected.has(prospect.id)}
                        onCheckedChange={() => toggleSelected(prospect.id)}
                      />
                    </td>
                    <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(prospect.id)}
                          className="flex items-center justify-center h-5 w-5 rounded hover:bg-trellis-neutral-200 text-muted-foreground"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <Button variant="link" className="body-100 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline">
                          {prospect.name}
                        </Button>
                      </div>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <Button variant="link" className="body-100 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline inline-flex items-center gap-1">
                        {prospect.domain}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-foreground">
                        <span className="font-medium">{prospect.actionGuidanceCount} action{prospect.actionGuidanceCount === 1 ? "" : "s"}</span>
                        <span className="text-muted-foreground"> · {prospect.actionGuidanceLabel}</span>
                      </span>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {prospect.signals.map(signal => (
                          <Tag key={signal.text} variant={signal.variant === "neutral" ? "neutral" : signal.variant}>
                            {signal.text}
                          </Tag>
                        ))}
                      </div>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-foreground">{prospect.priority}</span>
                    </td>
                  </TableRow>
                  {isExpanded && hasContacts && prospect.contacts.map(contact => (
                    <TableRow key={`${prospect.id}-${contact.id}`} className="bg-fill-surface-recessed hover:bg-fill-surface-recessed/80">
                      <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border px-4 py-3 align-middle">
                        <Checkbox />
                      </td>
                      <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                        <div className="flex items-center gap-3 pl-7">
                          <Avatar className={`h-7 w-7 ${contact.avatarColor}`}>
                            <AvatarFallback className={`${contact.avatarColor} text-trellis-white detail-100`}>
                              {contact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <Button variant="link" className="body-100 text-[#8B1538] p-0 h-auto justify-start hover:no-underline">
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
  );
};


const FilterPill = ({
  label,
  hasCarat,
  options,
}: {
  label: string;
  hasCarat?: boolean;
  options?: string[];
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="medium" className="border border-transparent heading-50">
        {label}
        {hasCarat && <TrellisIcon name="downCarat" size={12} />}
      </Button>
    </DropdownMenuTrigger>
    {options && options.length > 0 && (
      <DropdownMenuContent>
        {options.map(option => (
          <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    )}
  </DropdownMenu>
);

export default FullProspectBook;
