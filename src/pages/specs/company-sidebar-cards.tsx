import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  FlowStep,
} from "./blocks";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import HubSummaryCard from "@/components/HubSummaryCard";
import RecentConversionsCard from "@/components/RecentConversionsCard";
import PreviousDealCard from "@/components/PreviousDealCard";
import { getHubSummary, getRecentConversions } from "@/data/companyCards";
import { contactDetails } from "@/data/contactDetails";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

/* ── InfoCard (same as ProspectingStrategy local component) ─────── */

const InfoCard = ({
  title,
  maxHeight = "max-h-[600px]",
  collapsible = false,
  defaultCollapsed = false,
  children,
}: {
  title: string;
  maxHeight?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(!(collapsible && defaultCollapsed));
  const showContent = !collapsible || open;
  return (
    <div className={`bg-fill-secondary rounded-300 border border-core-subtle shadow-100 flex flex-col overflow-hidden ${showContent ? maxHeight : ""}`}>
      <div className={`px-6 py-6 shrink-0 ${showContent ? "border-b border-border-subtle" : ""}`}>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-2 w-full text-left"
          >
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${open ? "" : "-rotate-90"}`}
            />
            <h2 className="heading-100 text-foreground">{title}</h2>
          </button>
        ) : (
          <h2 className="heading-100 text-foreground">{title}</h2>
        )}
      </div>
      {showContent && <div className="overflow-y-auto px-6 py-4">{children}</div>}
    </div>
  );
};

/* ── Mock data ──────────────────────────────────────────────────── */

const COMPANY_ID = "1";
const COMPANY_NAME = "ACME Corp";
const COMPANY_INDUSTRY = "Software & Technology";

const MOCK_HUB_SUMMARY = getHubSummary(COMPANY_ID);
const MOCK_CONVERSIONS = getRecentConversions(COMPANY_ID);

const MOCK_NOTES = (() => {
  const contacts = [
    { id: "c1", name: "Jennifer Park" },
    { id: "c2", name: "Priya Sharma" },
    { id: "c4", name: "Aisha Williams" },
  ];
  const notes: Array<{ id: string; content: string; date: string; time: string; contactName: string }> = [];
  for (const c of contacts) {
    const detail = contactDetails[c.id];
    if (detail?.notes) {
      for (const n of detail.notes) {
        notes.push({ ...n, contactName: c.name });
      }
    }
  }
  return notes;
})();

const MOCK_DEALS = [
  { name: "ACME Corp - New Pro Deal", amount: "$24,000", closeDate: "Dec 2024", stage: "Negotiation", stageIndex: 3, totalStages: 5 },
  { name: "ACME Corp - Starter Renewal", amount: "$6,000", closeDate: "Jan 2025", stage: "Renewal", stageIndex: 1, totalStages: 3 },
];

const MOCK_PROPERTY_GROUPS = [
  {
    id: "prospecting-signals",
    label: "Prospecting Signals",
    properties: [
      { label: "3rd Party Intent Summary" },
      { label: "BDR Lead Status" },
      { label: "Compelling Reason", value: "Funding round, new CRO hire" },
      { label: "Intent Score", value: "87 / 100" },
      { label: "ICP Fit Score", value: "A+" },
    ],
  },
  {
    id: "company-information",
    label: "Company Information",
    properties: [
      { label: "Company name", value: "ACME Corp" },
      { label: "Industry", value: "Software & Technology" },
      { label: "Annual revenue", value: "$12M" },
      { label: "Number of employees", value: "250" },
    ],
  },
];

/* ── Company data card body (matches ProspectingStrategy) ───────── */

const CompanyDataBody = () => {
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "prospecting-signals": true,
  });

  const query = search.trim().toLowerCase();
  const filtered = MOCK_PROPERTY_GROUPS
    .map((g) => ({
      ...g,
      visibleProps: query
        ? g.properties.filter((p) => p.label.toLowerCase().includes(query) || (p.value && p.value.toLowerCase().includes(query)))
        : g.properties,
    }))
    .filter((g) => g.visibleProps.length > 0 || g.label.toLowerCase().includes(query));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full h-9 px-3 pr-8 rounded-200 border border-core-subtle bg-fill-surface body-100 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <TrellisIcon name="search" size={14} />
        </div>
        <button className="body-100 text-[var(--color-text-interactive-default)] hover:underline whitespace-nowrap flex items-center gap-1">
          Manage properties
          <TrellisIcon name="externalLink" size={12} />
        </button>
      </div>

      <div className="flex flex-col">
        {filtered.length === 0 && (
          <p className="body-100 text-muted-foreground py-4">No properties match &ldquo;{search}&rdquo;.</p>
        )}
        {filtered.map((group) => {
          const isOpen = expandedGroups[group.id] ?? false;
          return (
            <Collapsible
              key={group.id}
              open={isOpen}
              onOpenChange={(open) => setExpandedGroups((prev) => ({ ...prev, [group.id]: open }))}
              className="border-b border-border-subtle"
            >
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-3 group">
                <TrellisIcon
                  name="downCarat"
                  size={12}
                />
                <h4 className="heading-100 text-foreground">{group.label}</h4>
                <span className="detail-200 text-muted-foreground">{group.properties.length} properties</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pb-4 pl-5">
                <div className="flex flex-col gap-4">
                  {group.visibleProps.map((prop, idx) => (
                    <div key={`${group.id}-${idx}`} className="flex flex-col gap-1">
                      <div className="detail-200 text-muted-foreground">{prop.label}</div>
                      <div className="body-100 text-foreground whitespace-pre-line">
                        {prop.value ?? "--"}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

/* ── LinkedIn Sales Navigator body ──────────────────────────────── */

const LinkedInBody = () => (
  <div className="flex flex-col gap-4">
    <div className="border border-[#0A66C2] rounded overflow-hidden">
      <div className="bg-[#EDF3F8] px-3 py-2 border-b border-[#0A66C2] flex items-center gap-2">
        <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span className="text-xs font-semibold text-[#0A66C2] tracking-wider">SALES NAVIGATOR</span>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <img src={companyLogoPlaceholder} alt={`${COMPANY_NAME} logo`} className="w-12 h-12 rounded-full object-cover" />
        </div>
        <a href="#" className="text-[#0A66C2] hover:underline text-base font-normal mb-1 block">{COMPANY_NAME}</a>
        <p className="text-muted-foreground text-sm mb-3">{COMPANY_INDUSTRY}</p>
        <Button variant="outline" className="mb-4 border-[#0A66C2] text-[#0A66C2] hover:bg-[#EDF3F8] w-auto px-4" size="small">
          View in Sales Navigator
        </Button>
        <div className="flex gap-4 pt-3 border-t border-core-subtle">
          <a href="#" className="text-muted-foreground text-sm hover:underline">Help</a>
          <a href="#" className="text-muted-foreground text-sm hover:underline">Privacy and Terms</a>
        </div>
      </div>
    </div>
  </div>
);

/* ── Activity body (matches ProspectingStrategy collapsible cards) ─ */

type EmailItem = {
  type: "email";
  id: string;
  subject: string;
  from: string;
  to: string;
  timestamp: string;
  threadCount: number;
  preview: string;
  expanded: string;
  opens?: number;
  clicks?: number;
};
type CallItem = {
  type: "call";
  id: string;
  title: string;
  by: string;
  withWhom?: string;
  timestamp: string;
  outcome: string;
  callType: string;
  direction: string;
  duration?: string;
  contactsLabel: string;
  associations: string;
};
type ActivityItem = EmailItem | CallItem;

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    type: "email", id: "e1", subject: "Email 1 of sequence", from: "Dan Taft", to: "Jennifer Park",
    timestamp: "2 days ago", threadCount: 2, opens: 3, clicks: 1,
    preview: "Hi Jennifer,\n\nQuick follow-up from the team at HubSpot — wanted to share a few ideas based on what we're seeing in your space.",
    expanded: "Hi Jennifer,\n\nQuick follow-up from the team at HubSpot — wanted to share a few ideas based on what we're seeing in your space.\n\nWe've been working with companies in a similar position to ACME Corp and the results have been significant.",
  },
  {
    type: "call", id: "call1", title: "Logged call — No answer (2 attempts)", by: "Dan Taft", withWhom: "Jennifer Park",
    timestamp: "3 days ago", outcome: "No answer", callType: "Outbound", direction: "Outbound",
    contactsLabel: "1 contact", associations: "1 association",
  },
  {
    type: "email", id: "e2", subject: "Email 2 of sequence", from: "Dan Taft", to: "Jennifer Park",
    timestamp: "5 days ago", threadCount: 1, opens: 1, clicks: 0,
    preview: "Hi Jennifer,\n\nFollowing up on my previous note — I'd love to find some time to connect this week.",
    expanded: "Hi Jennifer,\n\nFollowing up on my previous note — I'd love to find some time to connect this week.\n\nI think there's a compelling opportunity to consolidate your current stack.",
  },
];

const ActivityBody = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-3">
      {MOCK_ACTIVITY.map((item) => {
        const isOpen = expandedItems[item.id] ?? false;
        const onOpenChange = (open: boolean) =>
          setExpandedItems((prev) => ({ ...prev, [item.id]: open }));

        if (item.type === "email") {
          return (
            <Collapsible
              key={item.id}
              open={isOpen}
              onOpenChange={onOpenChange}
              className="bg-fill-tertiary border border-core-subtle rounded-300"
            >
              <CollapsibleTrigger className="w-full text-left px-4 py-3 group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <TrellisIcon
                      name="downCarat"
                      size={12}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="body-100 text-foreground">
                        <strong className="heading-50">{item.subject}</strong> from {item.from}
                      </div>
                      <div className="body-100 text-foreground mt-1">to {item.to}</div>
                      <div className="flex items-center gap-2 detail-200 text-muted-foreground mt-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.opens && item.opens > 0 ? "bg-trellis-green-600" : "bg-muted-foreground"}`} />
                        {item.opens && item.opens > 0
                          ? `Opens: ${item.opens}   Clicks: ${item.clicks ?? 0}`
                          : "Sent"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TrellisIcon name="email" size={12} />
                    <span className="detail-100 text-muted-foreground">{item.threadCount}</span>
                    <span className="detail-100 text-muted-foreground ml-2">{item.timestamp}</span>
                  </div>
                </div>
                {!isOpen && (
                  <p className="body-100 text-foreground mt-3 ml-5 whitespace-pre-line line-clamp-3">
                    {item.preview}
                  </p>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 ml-5">
                <p className="body-100 text-foreground whitespace-pre-line leading-relaxed">
                  {item.expanded}
                </p>
              </CollapsibleContent>
            </Collapsible>
          );
        }

        return (
          <Collapsible
            key={item.id}
            open={isOpen}
            onOpenChange={onOpenChange}
            className="bg-fill-tertiary border border-core-subtle rounded-300"
          >
            <CollapsibleTrigger className="w-full text-left px-4 py-3 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <TrellisIcon
                    name="downCarat"
                    size={12}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="body-100 text-foreground">
                      <strong className="heading-50">{item.title}</strong> by {item.by}
                    </div>
                    {item.withWhom && (
                      <div className="detail-100 text-muted-foreground mt-1">with {item.withWhom}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <TrellisIcon name="calling" size={12} />
                  <span className="detail-100 text-muted-foreground ml-2">{item.timestamp}</span>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 ml-5">
              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-3 border-t border-border-subtle">
                <div className="flex flex-col">
                  <span className="detail-100 text-muted-foreground">Contacted</span>
                  <span className="body-100 text-foreground">{item.contactsLabel}</span>
                </div>
                <div className="flex flex-col">
                  <span className="detail-100 text-muted-foreground">Outcome</span>
                  <span className="body-100 text-foreground">{item.outcome}</span>
                </div>
                <div className="flex flex-col">
                  <span className="detail-100 text-muted-foreground">Type</span>
                  <span className="body-100 text-foreground">{item.callType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="detail-100 text-muted-foreground">Direction</span>
                  <span className="body-100 text-foreground">{item.direction}</span>
                </div>
                {item.duration && (
                  <div className="flex flex-col">
                    <span className="detail-100 text-muted-foreground">Duration</span>
                    <span className="body-100 text-foreground">{item.duration}</span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

/* ── Notes body ─────────────────────────────────────────────────── */

const NotesBody = ({ notes }: { notes: typeof MOCK_NOTES }) => (
  notes.length > 0 ? (
    <div className="flex flex-col gap-4">
      {notes.map((note) => (
        <div key={note.id} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="heading-50 text-foreground">{note.contactName}</span>
            <span className="detail-200 text-muted-foreground">{note.date} at {note.time}</span>
          </div>
          <p className="body-100 text-foreground">{note.content}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="body-100 text-muted-foreground">No notes yet.</p>
  )
);

/* ── Deals body ─────────────────────────────────────────────────── */

const DealsBody = () => (
  <div className="flex flex-col gap-3">
    {MOCK_DEALS.map((deal) => (
      <PreviousDealCard key={deal.name} deal={deal} />
    ))}
  </div>
);

/* ── Sidebar showcase (all cards together) ──────────────────────── */

const SidebarShowcase = () => (
  <div className="flex flex-col gap-4 w-[460px]">
    <InfoCard title="Company data" maxHeight="max-h-[400px]" collapsible><CompanyDataBody /></InfoCard>
    <InfoCard title="LinkedIn Sales Navigator" maxHeight="max-h-[400px]" collapsible><LinkedInBody /></InfoCard>
    <InfoCard title="Hub summary" maxHeight="max-h-[400px]" collapsible><HubSummaryCard summary={MOCK_HUB_SUMMARY} /></InfoCard>
    <InfoCard title="Recent conversions" maxHeight="max-h-[400px]" collapsible><RecentConversionsCard conversions={MOCK_CONVERSIONS} onContactClick={() => {}} /></InfoCard>
    <InfoCard title="Activity" maxHeight="max-h-[400px]" collapsible><ActivityBody /></InfoCard>
    <InfoCard title="Deals" maxHeight="max-h-[400px]" collapsible><DealsBody /></InfoCard>
    <InfoCard title="Notes" maxHeight="max-h-[320px]" collapsible><NotesBody notes={MOCK_NOTES} /></InfoCard>
  </div>
);

/* ── Page ────────────────────────────────────────────────────────── */

const CompanySidebarCardsSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Company sidebar cards"
      description="The right-hand sidebar on the company strategy page. Shows company data, LinkedIn Sales Navigator, Hub summary, recent conversions, activity, deals, and notes — all collapsible and scrollable within their max-height containers."
    />

    {/* ── Context ─────────────────────────────────────────────── */}
    <SpecSection
      title="Context"
      description="On wide viewports, the sidebar renders as a flex-[4] column to the right of the strategy content (flex-[10]). On narrow viewports, the cards become tabs within the main content area. Each card uses an InfoCard wrapper with a collapsible header."
    >
      <StateCard
        label="Sidebar in context (wide viewport)"
        description="All seven cards stacked vertically. Each scrolls independently within its max-height."
      >
        <SidebarShowcase />
      </StateCard>
    </SpecSection>

    {/* ── Collapse flow ──────────────────────────────────────── */}
    <SpecSection
      title="Collapse interaction"
      description="Every sidebar card is collapsible. Clicking the header toggles the body open/closed."
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep
          step={1}
          label="Card expanded (default)"
          description="Content is visible and scrolls within the card's max-height."
        >
          <div className="w-[460px]">
            <InfoCard title="Hub summary" maxHeight="max-h-[400px]" collapsible>
              <HubSummaryCard summary={MOCK_HUB_SUMMARY} />
            </InfoCard>
          </div>
        </FlowStep>
        <FlowStep
          step={2}
          label="Click header to collapse"
          description="Body hides, chevron rotates -90 degrees. Header border-bottom disappears."
          isLast
        >
          <div className="w-[460px]">
            <InfoCard title="Hub summary" maxHeight="max-h-[400px]" collapsible defaultCollapsed>
              <HubSummaryCard summary={MOCK_HUB_SUMMARY} />
            </InfoCard>
          </div>
        </FlowStep>
      </div>
    </SpecSection>

    {/* ── Individual card states ──────────────────────────────── */}
    <SpecSection
      title="Card states"
      description="Each sidebar card rendered individually at the sidebar's typical width (~380px)."
    >
      <StateCard
        label="Company data"
        description="Searchable, collapsible property group browser. Groups expand to show key-value property rows. The 'Prospecting Signals' group opens by default and shows scored values like Intent Score and ICP Fit."
      >
        <div className="w-[460px]">
          <InfoCard title="Company data" maxHeight="max-h-[500px]" collapsible>
            <CompanyDataBody />
          </InfoCard>
        </div>
      </StateCard>

      <StateCard
        label="LinkedIn Sales Navigator"
        description="Embedded LinkedIn-branded card showing the company name, industry, and a link to Sales Navigator. Uses LinkedIn's blue (#0A66C2) branding."
      >
        <div className="w-[460px]">
          <InfoCard title="LinkedIn Sales Navigator" maxHeight="max-h-[500px]" collapsible>
            <LinkedInBody />
          </InfoCard>
        </div>
      </StateCard>

      <StateCard
        label="Hub summary"
        description="Customer tier, portal info, usage limits (progress bars), usage-over-time charts (contacts area chart, emails line chart), integrations list, and active/past trials. Data comes from the company's portal via getHubSummary()."
      >
        <div className="w-[460px]">
          <InfoCard title="Hub summary" maxHeight="max-h-[640px]" collapsible>
            <HubSummaryCard summary={MOCK_HUB_SUMMARY} />
          </InfoCard>
        </div>
      </StateCard>

      <StateCard
        label="Recent conversions"
        description="Table of contacts who had a conversion event (form submission, pricing page view, webinar registration) in the last 90 days. Contact names are clickable — they open the contact detail drawer. Data from getRecentConversions()."
      >
        <div className="w-[460px]">
          <InfoCard title="Recent conversions" maxHeight="max-h-[480px]" collapsible>
            <RecentConversionsCard conversions={MOCK_CONVERSIONS} onContactClick={() => {}} />
          </InfoCard>
        </div>
      </StateCard>

      <StateCard
        label="Recent conversions (empty)"
        description="When no contacts have conversion signals in the last 90 days."
      >
        <div className="w-[460px]">
          <InfoCard title="Recent conversions" maxHeight="max-h-[480px]" collapsible>
            <RecentConversionsCard conversions={[]} onContactClick={() => {}} />
          </InfoCard>
        </div>
      </StateCard>

      <StateCard
        label="Activity"
        description="Chronological feed of emails (with open/click counts) and calls (with outcome and duration). Items are displayed as bordered cards within the scrollable container."
      >
        <div className="w-[460px]">
          <InfoCard title="Activity" maxHeight="max-h-[500px]" collapsible>
            <ActivityBody />
          </InfoCard>
        </div>
      </StateCard>

      <StateCard
        label="Deals"
        description="List of associated deals showing name, amount, close date, stage, and a progress bar. Uses the shared PreviousDealCard component."
      >
        <div className="w-[460px]">
          <InfoCard title="Deals" maxHeight="max-h-[480px]" collapsible>
            <DealsBody />
          </InfoCard>
        </div>
      </StateCard>

      <StateCard
        label="Notes (with content)"
        description="Aggregated notes from the company's contacts. Each note shows the contact name, timestamp, and content."
      >
        <div className="w-[460px]">
          <InfoCard title="Notes" maxHeight="max-h-[320px]" collapsible>
            <NotesBody notes={MOCK_NOTES} />
          </InfoCard>
        </div>
      </StateCard>

      <StateCard
        label="Notes (empty)"
        description="When none of the company's contacts have notes."
      >
        <div className="w-[460px]">
          <InfoCard title="Notes" maxHeight="max-h-[320px]" collapsible>
            <NotesBody notes={[]} />
          </InfoCard>
        </div>
      </StateCard>
    </SpecSection>

  </SpecLayout>
);

export default CompanySidebarCardsSpec;
