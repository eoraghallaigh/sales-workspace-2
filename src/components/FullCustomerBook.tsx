import { DataWell } from "@/components/ui/data-well";
import { Button } from "@/components/ui/button";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { ExternalLink, ListFilter } from "lucide-react";
import Tag from "@/components/Tag";
import FilterPill from "@/components/FilterPill";
import { SIGNAL_LABELS, type SignalInstance } from "@/data/signals";
import { CompanyTable, type CompanyTableColumn } from "@/components/CompanyTable";
import type { RecommendedContact } from "@/components/CompanyCard";
import { genericAdditionalContacts } from "@/data/allContacts";

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

type CustomerTableRow = CustomerRow & { recommendedContacts: RecommendedContact[] };

const FullCustomerBook = ({
  onPreview,
}: {
  onPreview?: (companyId: string, companyName: string) => void;
}) => {
  const rows: CustomerTableRow[] = customers.map((c) => ({
    ...c,
    recommendedContacts: c.contacts.map((ct) => ({
      id: ct.id,
      name: ct.name,
      initials: ct.initials,
      role: ct.role,
      avatarColor: ct.avatarColor,
      recentTouches: 0,
      enrolledInSequence: false,
      recentConversions: 0,
      signals: [] as SignalInstance[],
    })),
  }));

  const columns: CompanyTableColumn<CustomerTableRow>[] = [
    {
      key: "portalId", header: "Portal ID", minWidth: 140, render: (r) => (
        <Button variant="link" className="body-100 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline inline-flex items-center gap-1">
          {r.portalId}
          <ExternalLink className="h-3 w-3" />
        </Button>
      ),
    },
    {
      key: "actionGuidance", header: "Action Guidance", minWidth: 240, render: (r) => (
        <span className="body-100 text-foreground">
          <span className="font-medium">{r.actionGuidanceCount} action{r.actionGuidanceCount === 1 ? "" : "s"}</span>
          <span className="text-muted-foreground"> · {r.actionGuidanceLabel}</span>
        </span>
      ),
    },
    {
      key: "signals", header: "Install Base Signals", minWidth: 280, render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.signals.map((signal) => (
            <Tag key={signal.text} variant={signal.variant === "neutral" ? "neutral" : signal.variant}>
              {signal.text}
            </Tag>
          ))}
        </div>
      ),
    },
    { key: "platformMrr", header: "Platform MRR (USD)", minWidth: 160, render: (r) => <span className="body-100 text-muted-foreground">{r.platformMrr || "—"}</span> },
  ];

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
      <CompanyTable
        rows={rows}
        columns={columns}
        primaryHeader="Customer"
        minTableWidth={1100}
        toolbar={<TableToolbar searchPlaceholder="Search portals" />}
        getAvailableContacts={() => genericAdditionalContacts}
        onPreview={onPreview ? (r) => onPreview(r.id, r.name) : undefined}
      />
    </div>
  );
};


export default FullCustomerBook;
