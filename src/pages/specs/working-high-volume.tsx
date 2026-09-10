import { useEffect, useRef, useState } from "react";
import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  FlowStep,
  HorizontalFlow,
  HorizontalFlowStep,
  Callout,
  CodeRef,
} from "./blocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { AILoader } from "@/components/ui/ai-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Tag from "@/components/Tag";
import { getSubtleAvatarStyles } from "@/components/ContactOutreachAvatars";
import CompaniesTableView, {
  MAX_BULK_STRATEGY_COMPANIES,
  formatStrategyTimestamp,
} from "@/components/CompaniesTableView";
import { Company } from "@/components/CompanyCard";
import { prospectingCompanies } from "@/data/prospectingCompanies";
import overviewScreenshot from "@/assets/spec-recently-generated-overview.png";

const AVATAR_COLORS = {
  purple: "bg-trellis-purple-600",
  blue: "bg-trellis-blue-600",
  green: "bg-trellis-green-600",
};

const POS = "var(--color-fill-accent-green-default)";
const AWAIT = "var(--color-fill-accent-green-subtle)";
const NONE = "var(--color-fill-surface-recessed)";

const StatusDot = ({ tone }: { tone: "positive" | "awaiting" | "none" }) => (
  <div
    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
    style={{ background: tone === "positive" ? POS : tone === "awaiting" ? AWAIT : NONE }}
  />
);

const ContactRow = ({
  initials,
  avatarColor,
  name,
  role,
  status,
  tone,
  signals,
}: {
  initials: string;
  avatarColor: string;
  name: string;
  role: string;
  status: string;
  tone: "positive" | "awaiting" | "none";
  signals?: { label: string; variant: string }[];
}) => {
  const subtle = getSubtleAvatarStyles(avatarColor);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Avatar className="h-5 w-5 flex-shrink-0">
          <AvatarFallback
            className="text-[10px] font-medium"
            style={{ background: subtle.background, color: subtle.color }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="heading-50 text-foreground">{name}</span>
        <span className="detail-200 text-muted-foreground truncate">· {role}</span>
      </div>
      <div className="flex items-center gap-2 pl-7">
        <StatusDot tone={tone} />
        <span className={`detail-200 truncate ${tone === "none" ? "text-muted-foreground" : "text-foreground"}`}>
          {status}
        </span>
      </div>
      {signals && signals.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pl-7 pt-0.5">
          {signals.map((s, i) => (
            <span key={i} className="inline-flex">
              <Tag variant={s.variant as any}>{s.label}</Tag>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const SequenceSummaryPopover = ({
  contacts,
}: {
  contacts: {
    initials: string;
    avatarColor: string;
    name: string;
    role: string;
    status: string;
    tone: "positive" | "awaiting" | "none";
    signals?: { label: string; variant: string }[];
  }[];
}) => (
  <div className="w-[340px] p-4 border border-border rounded-200 bg-card shadow-lg">
    <div className="flex flex-col gap-4">
      <div className="detail-200 font-semibold text-muted-foreground uppercase tracking-wide">
        Sequence summary
      </div>
      {contacts.map((c, i) => (
        <ContactRow key={i} {...c} />
      ))}
    </div>
  </div>
);

/* ── Bulk generation internals ───────────────────────────────────────
 * The selection bar and Strategy Status cell are produced inside the shared
 * company table (they aren't standalone components), so they're recreated here
 * to match the live markup exactly for the state showcases below.            */

const SelectionBar = ({
  count,
  overLimit = false,
}: {
  count: number;
  overLimit?: boolean;
}) => {
  const generateButton = (
    <Button variant="primary" size="small" disabled={overLimit}>
      <TrellisIcon
        name="artificialIntelligence"
        size={14}
        className="mr-1 brightness-0 invert"
      />
      Generate strategies ({count})
    </Button>
  );
  return (
    <div className="border border-border bg-card rounded-[4px] overflow-hidden w-[820px]">
      <div className="flex items-center gap-3 px-4 py-2 min-h-[44px] border-b border-border bg-[var(--color-fill-surface-recessed)]">
        <span className="body-100 font-medium text-foreground whitespace-nowrap">
          {count} selected
        </span>
        {overLimit ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex">
                {generateButton}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              You can only generate strategies for {MAX_BULK_STRATEGY_COMPANIES} companies at
              a time.
            </TooltipContent>
          </Tooltip>
        ) : (
          generateButton
        )}
        <Button variant="secondary" size="small">
          <TrellisIcon name="snooze" size={14} className="mr-1" />
          Snooze ({count})
        </Button>
        <Button variant="secondary" size="small">
          <TrellisIcon name="remove" size={14} className="mr-1" />
          Dismiss ({count})
        </Button>
        <Button variant="link" className="body-100 text-foreground h-auto p-0">
          Clear
        </Button>
      </div>
    </div>
  );
};

type DemoStatus = "not-generated" | "generating" | "generated" | "failed";

const StrategyStatusCell = ({
  status,
  at = "Sep 10, 2:45 PM",
}: {
  status: DemoStatus;
  at?: string;
}) => {
  if (status === "generating") {
    return (
      <div className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
        <AILoader size={16} />
        <span className="reasoning-shimmer">Generating</span>
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
        <div className="h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
        <span className="text-destructive">Generation Failed</span>
      </div>
    );
  }
  if (status === "generated") {
    return (
      <div className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
        <div className="h-1.5 w-1.5 rounded-full bg-trellis-green-600 flex-shrink-0" />
        <span className="text-foreground">Generated: {at}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
      <span className="text-muted-foreground">Not Generated</span>
    </div>
  );
};

const MiniSelectList = ({ checked }: { checked: number[] }) => {
  const names = [
    "ACME Corp",
    "TechVision Inc",
    "Advanced Satellite",
    "DataStream Analytics",
    "CloudScale Systems",
    "Orbital Dynamics",
  ];
  return (
    <div className="w-[240px] border border-border rounded-[4px] overflow-hidden bg-card">
      {names.map((name, i) => (
        <div
          key={name}
          className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-b-0"
        >
          <Checkbox checked={checked.includes(i)} />
          <span className="body-100 text-foreground truncate">{name}</span>
        </div>
      ))}
    </div>
  );
};

const LiveTableShowcase = () => {
  const [companies, setCompanies] = useState<Company[]>(() =>
    prospectingCompanies.slice(0, 6),
  );
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const generate = (ids: string[]) => {
    const idSet = new Set(ids.slice(0, MAX_BULK_STRATEGY_COMPANIES));
    setCompanies((prev) =>
      prev.map((c) =>
        idSet.has(c.id) ? { ...c, strategyStatus: "generating" as const } : c,
      ),
    );
    const timer = setTimeout(() => {
      const at = formatStrategyTimestamp(new Date());
      setCompanies((prev) =>
        prev.map((c) =>
          idSet.has(c.id)
            ? {
                ...c,
                strategyStatus: "generated" as const,
                strategyGeneratedAt: at,
                hasGeneratedStrategy: true,
              }
            : c,
        ),
      );
    }, 3000);
    timersRef.current.push(timer);
  };

  return (
    <CompaniesTableView
      companies={companies}
      showStrategyStatus
      onGenerateStrategies={generate}
      onSnoozeCompanies={() => {}}
      onDismissCompanies={() => {}}
    />
  );
};

const WorkingHighVolumeSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Working High Volume Efficiently"
      description="Features that help reps manage large books: bulk strategy generation across many companies at once, a &ldquo;Recently Generated&rdquo; view to find companies whose strategies the agent has finished, and a simplified &ldquo;Sequence Summary&rdquo; column that rolls per-channel outreach status into a single workflow position per contact."
    />

    <img
      src={overviewScreenshot}
      alt="Recently Generated view showing the prospecting table with sub-nav counts"
      className="rounded-200 border border-core-subtle mb-10 w-full"
    />

    {/* ── Recently Generated view ───────────────────────────────── */}

    <SpecSection
      title="Recently Generated view"
      description="Strategy generation takes a long time. Reps click &ldquo;Generate strategy&rdquo; on several companies then move on to other work. When they return, they need to find which companies have finished strategies without clicking into each one. This view surfaces all companies whose strategy was generated in the last 24 hours."
    >
      <Callout type="info">
        Addresses feedback from reps that the agent &ldquo;works too slowly to sit and wait&rdquo; — this view closes the loop by letting them batch-generate, leave, and come back to a ready list.
      </Callout>
    </SpecSection>

    {/* ── Bulk strategy generation ──────────────────────────────── */}

    <SpecSection
      title="Bulk strategy generation"
      description="Rather than clicking into each company one at a time, reps select multiple company rows in the prospecting table and generate outreach strategies for all of them in one action. Select rows below to reveal the selection bar, then press Generate strategies to watch the Strategy Status move from Generating to Generated (this is the live Recently Generated table, with the Strategy Status column shown)."
    >
      <div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">
        <LiveTableShowcase />
      </div>
    </SpecSection>

    <SpecSection
      title="Generation flow"
      description="What happens from selection through to a finished strategy."
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep
          step={1}
          label="Select companies"
          description="Ticking one or more rows swaps the table's search toolbar for a selection bar with the bulk actions and a running count."
        >
          <SelectionBar count={4} />
        </FlowStep>
        <FlowStep
          step={2}
          label="Generate strategies"
          description="Kicks off generation for the selected companies, clears the selection, and confirms with a banner. Each company is marked Generating and immediately appears in the Recently Generated view."
        >
          <Alert type="success" className="w-auto max-w-lg">
            <AlertDescription type="success">
              Generating strategies for 4 companies. Find them in Recently Generated.
            </AlertDescription>
          </Alert>
        </FlowStep>
        <FlowStep
          step={3}
          label="Generating"
          description="While the agent runs, the company's Strategy Status shows an animated, shimmering Generating indicator (the same treatment as other in-flight agent work, e.g. call-notes generation)."
        >
          <StrategyStatusCell status="generating" />
        </FlowStep>
        <FlowStep
          step={4}
          label="Generated"
          description="When the run finishes, the status flips to Generated with the completion date and time."
          isLast
        >
          <StrategyStatusCell status="generated" />
        </FlowStep>
      </div>
    </SpecSection>

    <SpecSection
      title="Selecting rows"
      description="Rows have per-row checkboxes plus a select-all in the header. Shift-click extends selection so a rep can grab a run of rows without ticking each one."
    >
      <Callout type="behavior">
        A plain click toggles a single row and sets it as the anchor. A <strong>shift-click</strong>{" "}
        selects every row between the anchor (the last row toggled on its own) and the row
        shift-clicked, adding that range to the current selection. Keyboard activation (Space)
        toggles a single row.
      </Callout>
      <HorizontalFlow>
        <HorizontalFlowStep
          step={1}
          label="Click a row"
          description="A plain click selects that row and makes it the anchor."
        >
          <MiniSelectList checked={[1]} />
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={2}
          label="Shift-click a lower row"
          description="Everything between the anchor and the shift-clicked row is added to the selection."
          isLast
        >
          <MiniSelectList checked={[1, 2, 3, 4]} />
        </HorizontalFlowStep>
      </HorizontalFlow>
    </SpecSection>

    <SpecSection
      title="Selection bar states"
      description="The bar carries three actions — Generate strategies (primary), then Snooze and Dismiss as secondary actions — plus the selected count and a Clear link. Snooze and Dismiss set the companies' worked status and remove them from the working lists."
    >
      <StateCard
        label="Within the limit"
        description="Up to 10 companies selected. All actions are available."
      >
        <SelectionBar count={4} />
      </StateCard>
      <StateCard
        label="Over the generation limit"
        description="Generation is capped at 10 companies per batch to avoid burning tokens on an oversized run. Past 10, Generate strategies is disabled and hovering it shows a tooltip explaining the cap — Snooze and Dismiss stay available since they carry no generation cost."
        variant="warning"
      >
        <SelectionBar count={14} overLimit />
      </StateCard>
    </SpecSection>

    <SpecSection
      title="Strategy Status column"
      description="Shown in the Recently Generated view so reps can see, at a glance, which companies have a finished strategy and which are still cooking. Companies that are generating or that failed are included in the view alongside finished ones."
    >
      <StateCard
        label="Not Generated"
        description="No strategy has been generated for this company yet."
      >
        <StrategyStatusCell status="not-generated" />
      </StateCard>
      <StateCard
        label="Generating"
        description="The agent is running. Animated shimmer signals in-flight work."
      >
        <StrategyStatusCell status="generating" />
      </StateCard>
      <StateCard
        label="Generated"
        description="The strategy is ready, stamped with the completion date and time."
        variant="success"
      >
        <StrategyStatusCell status="generated" />
      </StateCard>
      <StateCard
        label="Generation Failed"
        description="The run errored. The company stays in the Recently Generated view so the rep can see it needs another attempt."
        variant="error"
      >
        <StrategyStatusCell status="failed" />
      </StateCard>
    </SpecSection>

    {/* ── View counts ───────────────────────────────────────────── */}

    <SpecSection
      title="View counts on all nav items"
      description="Every nav item in the sub-nav shows a count badge. Counts are computed once in the parent Prospecting page and passed as a viewCounts record."
    >
      <StateCard
        label="Count sources by view"
        description="How counts are derived for each nav item."
      >
        <div className="w-[600px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="heading-50 text-foreground py-2 pr-4">View</th>
                <th className="heading-50 text-foreground py-2">Count source</th>
              </tr>
            </thead>
            <tbody className="body-100 text-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-4">QLs</td>
                <td className="py-2 text-muted-foreground">Workable companies with at least one contact with <CodeRef>qlData</CodeRef></td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Recently Generated</td>
                <td className="py-2 text-muted-foreground">All companies that have a finished strategy, are currently generating, or whose generation failed</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Full Prospect Book</td>
                <td className="py-2 text-muted-foreground">Hardcoded 312 (matches the FullProspectBook component)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">P1–P4</td>
                <td className="py-2 text-muted-foreground">Workable companies filtered by priority</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Full Customer Book</td>
                <td className="py-2 text-muted-foreground">Hardcoded 185 (matches the FullCustomerBook component)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Plays</td>
                <td className="py-2 text-muted-foreground">Workable companies whose <CodeRef>getPlayIdsForCompany</CodeRef> includes the play</td>
              </tr>
            </tbody>
          </table>
        </div>
      </StateCard>
    </SpecSection>

    {/* ── Sequence Summary column ─────────────────────────────────── */}

    <SpecSection
      title="Sequence Summary column"
      description="The companies table column previously showed outreach status for each contact, but this included very old outreach. Let's simplify this by just showing sequence enrollment status. Additionally, let's update the card view version of the enrollment status to match."
    >
      <StateCard label="No sequence generated" description="No outreach strategy has been created for this contact. They have not been through the agent.">
        <SequenceSummaryPopover
          contacts={[
            { initials: "KB", avatarColor: AVATAR_COLORS.blue, name: "Keisha Blue", role: "Marketing Director", status: "No sequence generated", tone: "none", signals: [{ label: "Recent hire", variant: "green" }] },
            { initials: "EG", avatarColor: AVATAR_COLORS.green, name: "Elowen Green", role: "Head of Product", status: "No sequence generated", tone: "none", signals: [{ label: "Attended webinar", variant: "green" }] },
          ]}
        />
      </StateCard>
      <StateCard label="Sequence generated, not enrolled" description="The agent created an outreach sequence but the rep hasn't enrolled the contact yet.">
        <SequenceSummaryPopover
          contacts={[
            { initials: "EG", avatarColor: AVATAR_COLORS.green, name: "Elowen Green", role: "Head of Product", status: "Sequence generated, not enrolled", tone: "none", signals: [{ label: "Attended webinar", variant: "green" }] },
            { initials: "KB", avatarColor: AVATAR_COLORS.blue, name: "Keisha Blue", role: "Marketing Director", status: "No sequence generated", tone: "none" },
          ]}
        />
      </StateCard>
      <StateCard label="Enrolled, awaiting response" description="Contact is actively enrolled in a sequence. Emails have been sent but no reply, connected call, or LinkedIn response yet.">
        <SequenceSummaryPopover
          contacts={[
            { initials: "JP", avatarColor: AVATAR_COLORS.purple, name: "Jennifer Park", role: "VP, Marketing", status: "Enrolled, awaiting response", tone: "awaiting", signals: [{ label: "Past HubSpot user", variant: "green" }, { label: "Viewed pricing page", variant: "orange" }] },
            { initials: "KB", avatarColor: AVATAR_COLORS.blue, name: "Keisha Blue", role: "Marketing Director", status: "Enrolled, awaiting response", tone: "awaiting" },
          ]}
        />
      </StateCard>
      <StateCard label="Replied / Connected call / LinkedIn message" description="The contact engaged — replied to an email, took a connected call, or responded on LinkedIn. This is the positive outcome." variant="success">
        <SequenceSummaryPopover
          contacts={[
            { initials: "JP", avatarColor: AVATAR_COLORS.purple, name: "Jennifer Park", role: "VP, Marketing", status: "Replied", tone: "positive" },
            { initials: "DL", avatarColor: AVATAR_COLORS.blue, name: "David Lee", role: "CMO", status: "Connected call logged", tone: "positive" },
            { initials: "ER", avatarColor: AVATAR_COLORS.green, name: "Emily Rodriguez", role: "VP Sales", status: "LinkedIn message logged", tone: "positive" },
          ]}
        />
      </StateCard>
      <StateCard label="Sequence ended" description="The sequence completed or the contact was unenrolled without a positive engagement signal.">
        <SequenceSummaryPopover
          contacts={[
            { initials: "MO", avatarColor: AVATAR_COLORS.blue, name: "Michael O'Brien", role: "Head of Growth", status: "Sequence ended", tone: "none" },
            { initials: "JP", avatarColor: AVATAR_COLORS.purple, name: "Jennifer Park", role: "VP, Marketing", status: "Replied", tone: "positive" },
          ]}
        />
      </StateCard>
    </SpecSection>
  </SpecLayout>
);

export default WorkingHighVolumeSpec;
