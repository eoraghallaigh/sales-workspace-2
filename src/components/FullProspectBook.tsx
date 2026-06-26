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
import { SignalChip } from "@/components/SignalChip";
import { sig, SIGNAL_LABELS, type SignalInstance } from "@/data/signals";

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
  industry: string;
  actionGuidanceCount: number;
  actionGuidanceLabel: string;
  signals: SignalInstance[];
  recentConversion: string;
  recentConversionDate: string;
  lastActivityDate: string;
  nextStep: string;
  rating: "High" | "Medium" | "Low" | "Not a Fit";
  priority: "P1" | "P2" | "P3" | "P4";
  contacts: ProspectContact[];
}

const prospects: ProspectRow[] = [
  {
    id: "northwind-labs",
    name: "Northwind Labs",
    domain: "northwindlabs.com",
    industry: "Technology",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Recent Series B announced",
    signals: [sig("funding-round"), sig("recent-ql")],
    recentConversion: "Requested a demo",
    recentConversionDate: "Jun 9, 2026",
    lastActivityDate: "Jun 10, 2026",
    nextStep: "Call Alex Hsu",
    rating: "High",
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
    industry: "Media",
    actionGuidanceCount: 2,
    actionGuidanceLabel: "Active competitor renewal window",
    signals: [sig("former-customer"), sig("viewed-pricing")],
    recentConversion: "Viewed pricing page",
    recentConversionDate: "Jun 7, 2026",
    lastActivityDate: "Jun 8, 2026",
    nextStep: "Re-engage before renewal",
    rating: "High",
    priority: "P1",
    contacts: [],
  },
  {
    id: "harborline-co",
    name: "Harborline Co.",
    domain: "harborline.co",
    industry: "Logistics",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Multiple non-QL demand signals",
    signals: [sig("viewed-pricing")],
    recentConversion: "Pricing page view",
    recentConversionDate: "Jun 3, 2026",
    lastActivityDate: "Jun 5, 2026",
    nextStep: "Send follow-up email",
    rating: "Medium",
    priority: "P2",
    contacts: [],
  },
  {
    id: "carbon-six",
    name: "Carbon Six",
    domain: "carbonsix.ai",
    industry: "Technology",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Inbound demo request",
    signals: [sig("recent-ql")],
    recentConversion: "Inbound demo request",
    recentConversionDate: "Jun 8, 2026",
    lastActivityDate: "Jun 8, 2026",
    nextStep: "Enroll in sequence",
    rating: "High",
    priority: "P2",
    contacts: [],
  },
  {
    id: "verdantbio",
    name: "VerdantBio",
    domain: "verdantbio.com",
    industry: "Biotech",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Hiring sales leadership",
    signals: [sig("hiring-surge")],
    recentConversion: "—",
    recentConversionDate: "—",
    lastActivityDate: "May 30, 2026",
    nextStep: "Research decision makers",
    rating: "Medium",
    priority: "P3",
    contacts: [],
  },
  {
    id: "skyline-finance",
    name: "Skyline Finance",
    domain: "skylinefinance.com",
    industry: "Finance",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Inbound contact form submission",
    signals: [sig("viewed-pricing")],
    recentConversion: "Contact form submission",
    recentConversionDate: "May 28, 2026",
    lastActivityDate: "May 29, 2026",
    nextStep: "Qualify fit on first call",
    rating: "Low",
    priority: "P3",
    contacts: [],
  },
  {
    id: "meridian-health",
    name: "Meridian Health",
    domain: "meridianhealth.io",
    industry: "Healthcare",
    actionGuidanceCount: 2,
    actionGuidanceLabel: "New marketing leader hired",
    signals: [sig("new-hire"), sig("attended-webinar")],
    recentConversion: "Webinar registration",
    recentConversionDate: "Jun 6, 2026",
    lastActivityDate: "Jun 9, 2026",
    nextStep: "Call new VP of Marketing",
    rating: "High",
    priority: "P1",
    contacts: [
      {
        id: "dana-cole",
        name: "Dana Cole",
        role: "VP, Marketing",
        initials: "DC",
        avatarColor: "bg-trellis-teal-600",
        signals: [
          { variant: "green", text: "Primary Contact" },
          { variant: "neutral", text: "Marketing - Executive" },
        ],
      },
      {
        id: "sam-reyes",
        name: "Sam Reyes",
        role: "Head of RevOps",
        initials: "SR",
        avatarColor: "bg-trellis-teal-600",
        signals: [
          { variant: "neutral", text: "Operations - Influencer" },
        ],
      },
    ],
  },
  {
    id: "atlas-manufacturing",
    name: "Atlas Manufacturing",
    domain: "atlasmfg.com",
    industry: "Manufacturing",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Free trial in progress",
    signals: [sig("recent-ql"), sig("tech-stack-change")],
    recentConversion: "Free trial signup",
    recentConversionDate: "Jun 5, 2026",
    lastActivityDate: "Jun 7, 2026",
    nextStep: "Multi-thread to operations",
    rating: "High",
    priority: "P1",
    contacts: [],
  },
  {
    id: "quill-co",
    name: "Quill & Co",
    domain: "quillco.com",
    industry: "E-commerce",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Comparing solutions",
    signals: [sig("viewed-pricing")],
    recentConversion: "Downloaded pricing guide",
    recentConversionDate: "Jun 2, 2026",
    lastActivityDate: "Jun 4, 2026",
    nextStep: "Send case study",
    rating: "Medium",
    priority: "P2",
    contacts: [],
  },
  {
    id: "beacon-analytics",
    name: "Beacon Analytics",
    domain: "beaconanalytics.ai",
    industry: "Technology",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Repeat website visits",
    signals: [sig("recent-ql")],
    recentConversion: "Inbound demo request",
    recentConversionDate: "Jun 4, 2026",
    lastActivityDate: "Jun 6, 2026",
    nextStep: "Enroll in sequence",
    rating: "High",
    priority: "P2",
    contacts: [],
  },
  {
    id: "cedar-grove-health",
    name: "Cedar Grove Health",
    domain: "cedargrove.org",
    industry: "Healthcare",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Early-stage research",
    signals: [sig("viewed-pricing")],
    recentConversion: "Ebook download",
    recentConversionDate: "May 26, 2026",
    lastActivityDate: "May 31, 2026",
    nextStep: "Nurture with content",
    rating: "Medium",
    priority: "P3",
    contacts: [],
  },
  {
    id: "pinnacle-capital",
    name: "Pinnacle Capital",
    domain: "pinnaclecapital.com",
    industry: "Finance",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Pricing inquiry submitted",
    signals: [sig("recent-ql")],
    recentConversion: "Pricing inquiry",
    recentConversionDate: "Jun 1, 2026",
    lastActivityDate: "Jun 3, 2026",
    nextStep: "Confirm budget authority",
    rating: "High",
    priority: "P2",
    contacts: [],
  },
  {
    id: "forge-robotics",
    name: "Forge Robotics",
    domain: "forgerobotics.io",
    industry: "Manufacturing",
    actionGuidanceCount: 2,
    actionGuidanceLabel: "Funding + inbound demo",
    signals: [sig("funding-round"), sig("recent-ql")],
    recentConversion: "Requested a demo",
    recentConversionDate: "Jun 9, 2026",
    lastActivityDate: "Jun 9, 2026",
    nextStep: "Book discovery call",
    rating: "High",
    priority: "P1",
    contacts: [
      {
        id: "marcus-lin",
        name: "Marcus Lin",
        role: "Chief Operating Officer",
        initials: "ML",
        avatarColor: "bg-trellis-blue-600",
        signals: [
          { variant: "green", text: "Primary Contact" },
          { variant: "neutral", text: "Operations - Decision Maker" },
        ],
      },
      {
        id: "tara-webb",
        name: "Tara Webb",
        role: "VP, Sales",
        initials: "TW",
        avatarColor: "bg-trellis-blue-600",
        signals: [
          { variant: "neutral", text: "Sales - Influencer" },
        ],
      },
    ],
  },
  {
    id: "brightwave-media",
    name: "Brightwave Media",
    domain: "brightwave.tv",
    industry: "Media",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Low engagement",
    signals: [sig("hiring-surge")],
    recentConversion: "—",
    recentConversionDate: "—",
    lastActivityDate: "May 20, 2026",
    nextStep: "Monitor for intent",
    rating: "Low",
    priority: "P4",
    contacts: [],
  },
  {
    id: "northstar-logistics",
    name: "Northstar Logistics",
    domain: "northstarlogistics.com",
    industry: "Logistics",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Inbound form submission",
    signals: [sig("viewed-pricing")],
    recentConversion: "Contact form submission",
    recentConversionDate: "May 27, 2026",
    lastActivityDate: "May 29, 2026",
    nextStep: "Qualify on first call",
    rating: "Medium",
    priority: "P3",
    contacts: [],
  },
  {
    id: "helix-therapeutics",
    name: "Helix Therapeutics",
    domain: "helixtx.com",
    industry: "Biotech",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Webinar attendee",
    signals: [sig("attended-webinar"), sig("hiring-surge")],
    recentConversion: "Webinar registration",
    recentConversionDate: "Jun 3, 2026",
    lastActivityDate: "Jun 5, 2026",
    nextStep: "Share webinar follow-up",
    rating: "High",
    priority: "P2",
    contacts: [],
  },
  {
    id: "summit-education",
    name: "Summit Education",
    domain: "summitedu.org",
    industry: "Education",
    actionGuidanceCount: 1,
    actionGuidanceLabel: "Content engagement",
    signals: [sig("viewed-pricing")],
    recentConversion: "Ebook download",
    recentConversionDate: "May 24, 2026",
    lastActivityDate: "May 28, 2026",
    nextStep: "Nurture with content",
    rating: "Medium",
    priority: "P3",
    contacts: [],
  },
  {
    id: "vantage-software",
    name: "Vantage Software",
    domain: "vantagesoft.com",
    industry: "Technology",
    actionGuidanceCount: 2,
    actionGuidanceLabel: "Active trial + former customer",
    signals: [sig("former-customer"), sig("recent-ql")],
    recentConversion: "Free trial signup",
    recentConversionDate: "Jun 7, 2026",
    lastActivityDate: "Jun 8, 2026",
    nextStep: "Reach out to trial owner",
    rating: "High",
    priority: "P1",
    contacts: [
      {
        id: "jordan-pike",
        name: "Jordan Pike",
        role: "Chief Marketing Officer",
        initials: "JP",
        avatarColor: "bg-trellis-orange-500",
        signals: [
          { variant: "green", text: "Primary Contact" },
          { variant: "blue", text: "Past HubSpot User" },
        ],
      },
      {
        id: "riley-chen",
        name: "Riley Chen",
        role: "Director, Marketing Ops",
        initials: "RC",
        avatarColor: "bg-trellis-orange-500",
        signals: [
          { variant: "neutral", text: "Operations - Influencer" },
        ],
      },
    ],
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
          <FilterPill label="Industry" hasCarat options={["All industries", "Technology", "Healthcare", "Finance", "Manufacturing", "Media", "Logistics", "Biotech", "E-commerce", "Education"]} />
          <FilterPill label="Signals" hasCarat options={["All signals", ...SIGNAL_LABELS]} />
          <Button variant="ghost" size="medium" className="border border-transparent heading-50">
            <ListFilter className="h-4 w-4" />
            Advanced filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border bg-card rounded-[4px] overflow-hidden">
        <TableToolbar searchPlaceholder="Search prospects" />
        <div className="overflow-x-auto">
        <Table className="min-w-[1900px]">
          <TableHeader>
            <TableRow className="bg-[var(--color-fill-surface-recessed)] hover:bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
              <TableHead className="w-12 px-4 sticky left-0 z-20 bg-[var(--color-fill-surface-recessed)] table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                <Checkbox />
              </TableHead>
              <TableHead className="sticky left-12 z-20 bg-[var(--color-fill-surface-recessed)] min-w-[240px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                Company
              </TableHead>
              <TableHead className="min-w-[140px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Industry</TableHead>
              <TableHead className="min-w-[170px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Domain</TableHead>
              <TableHead className="min-w-[260px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Intent Signals</TableHead>
              <TableHead className="min-w-[200px] px-6 table-header-text align-middle whitespace-nowrap border-r border-[var(--color-border-transitional-core-subtle)]">Recent Conversion</TableHead>
              <TableHead className="min-w-[230px] px-6 table-header-text align-middle whitespace-nowrap border-r border-[var(--color-border-transitional-core-subtle)]">Recent Conversion Date</TableHead>
              <TableHead className="min-w-[200px] px-6 table-header-text align-middle whitespace-nowrap border-r border-[var(--color-border-transitional-core-subtle)]">Last Activity Date</TableHead>
              <TableHead className="min-w-[180px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Next Step</TableHead>
              <TableHead className="min-w-[120px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Rating</TableHead>
              <TableHead className="min-w-[90px] px-6 table-header-text align-middle">Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:last-child>td]:border-b-0">
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
                        <Button variant="link" className="body-125 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline">
                          {prospect.name}
                        </Button>
                      </div>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-foreground">{prospect.industry}</span>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <Button variant="link" className="body-100 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline inline-flex items-center gap-1">
                        {prospect.domain}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {prospect.signals.map((signal, i) => (
                          <SignalChip
                            key={`${signal.id}-${i}`}
                            signal={signal}
                            owner={{ kind: "company", id: prospect.id, name: prospect.name }}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className={prospect.recentConversion === "—" ? "body-100 text-muted-foreground" : "body-100 text-foreground"}>
                        {prospect.recentConversion}
                      </span>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className={prospect.recentConversionDate === "—" ? "body-100 text-muted-foreground" : "body-100 text-foreground"}>
                        {prospect.recentConversionDate}
                      </span>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-foreground">{prospect.lastActivityDate}</span>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-foreground">{prospect.nextStep}</span>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-foreground">{prospect.rating}</span>
                    </td>
                    <td className="border-b border-border px-4 py-3 align-middle">
                      <span className="body-100 text-foreground">{prospect.priority}</span>
                    </td>
                  </TableRow>
                  {isExpanded && hasContacts && prospect.contacts.map(contact => (
                    <TableRow key={`${prospect.id}-${contact.id}`} className="bg-card hover:bg-fill-surface-recessed">
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
                        <span className="body-100 text-muted-foreground">—</span>
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
                      <td className="border-b border-border px-4 py-3 align-middle">
                        <span className="body-100 text-muted-foreground">—</span>
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
                        <span className="body-100 text-muted-foreground">—</span>
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

export default FullProspectBook;
