import { useState } from "react";
import { SpecLayout } from "./SpecLayout";
import { SpecHeader, SpecSection, StateCard, FlowStep, Callout } from "./blocks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { StatusIndicator } from "@/components/ui/status-indicator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import type { PlayState } from "@/data/playData";

const STATE_PILL_CLASS: Record<PlayState, string> = {
  draft: "bg-[var(--color-fill-caution-subtle)] text-[var(--color-text-core-default)]",
  upcoming: "bg-fill-info-subtle text-[var(--color-text-core-default)]",
  active: "bg-fill-positive-subtle text-[var(--color-text-core-default)]",
  ended: "bg-trellis-neutral-200 text-foreground",
};

const STATE_PILL_LABEL: Record<PlayState, string> = {
  draft: "Draft",
  upcoming: "Upcoming",
  active: "Active",
  ended: "Ended",
};

const ALLOWED_TRANSITIONS: Record<PlayState, PlayState[]> = {
  draft: ["draft", "upcoming", "active"],
  upcoming: ["draft", "upcoming", "active", "ended"],
  active: ["draft", "upcoming", "active", "ended"],
  ended: ["upcoming", "active", "ended"],
};

const STATE_OPTIONS: { value: PlayState; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "ended", label: "Ended" },
];

const StatusPill = ({ state }: { state: PlayState }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full body-75 ${STATE_PILL_CLASS[state]}`}>
    {STATE_PILL_LABEL[state]}
  </span>
);

const StatusDropdownDemo = ({ currentState }: { currentState: PlayState }) => {
  const allowed = ALLOWED_TRANSITIONS[currentState];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="inline-flex items-center gap-1.5 cursor-pointer">
          <StatusPill state={currentState} />
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 bg-card border border-border shadow-lg" align="start">
        {STATE_OPTIONS.filter((opt) => allowed.includes(opt.value)).map((opt) => (
          <DropdownMenuItem key={opt.value} className="flex items-center gap-2 px-3 py-2 cursor-pointer">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full detail-200 ${STATE_PILL_CLASS[opt.value]}`}>
              {opt.label}
            </span>
            {currentState === opt.value && <Check className="h-3 w-3 ml-auto text-muted-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FormFooterDemo = ({ canPublish, isPotm, tooltipText }: { canPublish: boolean; isPotm: boolean; tooltipText?: string }) => {
  const [potm, setPotm] = useState(isPotm);
  return (
    <div className="border-t border-[var(--color-border-container-default)] bg-card rounded-b-lg">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary" size="medium" disabled={!canPublish}>Publish</Button>
              </TooltipTrigger>
              {canPublish && tooltipText && (
                <TooltipContent side="top">{tooltipText}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button variant="secondary" size="medium">Save as Draft</Button>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer body-75 text-[var(--color-text-core-default)]">
          <Checkbox checked={potm} onCheckedChange={(v) => setPotm(v === true)} />
          POTM
        </label>
      </div>
    </div>
  );
};

const TableRowDemo = ({ name, state, isPotm, sequence }: { name: string; state: PlayState; isPotm?: boolean; sequence?: string }) => (
  <tr className="bg-card">
    <td className="border-b border-border px-6 py-3 align-middle hover:bg-fill-surface-recessed transition-colors">
      <div className="flex items-center gap-2">
        <button type="button" className="body-125 text-text-interactive hover:text-text-interactive-hover hover:underline text-left">
          {name}
        </button>
        {isPotm && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><Badge variant="lorax" className="cursor-default">POTM</Badge></span>
              </TooltipTrigger>
              <TooltipContent side="top">Play of the Month</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </td>
    <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground hover:bg-fill-surface-recessed transition-colors">Sarah Chen</td>
    <td className="border-b border-border align-middle hover:bg-fill-surface-recessed transition-colors p-0 group/status">
      <div className="px-6 py-3 flex items-center gap-1.5">
        <StatusPill state={state} />
        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover/status:opacity-100 transition-opacity" />
      </div>
    </td>
    <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground hover:bg-fill-surface-recessed transition-colors">Mid-Market</td>
    <td className="border-b border-border px-6 py-3 align-middle body-100 hover:bg-fill-surface-recessed transition-colors">
      {sequence ? (
        <button type="button" className="text-link-100 text-text-interactive hover:text-text-interactive-hover hover:underline text-left">{sequence}</button>
      ) : <span className="text-muted-foreground">—</span>}
    </td>
    <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground hover:bg-fill-surface-recessed transition-colors">Aug 1 – Oct 31, 2026</td>
  </tr>
);

const MiniTable = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-border bg-card rounded-[4px] overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
          <th className="min-w-[220px] px-6 py-2 table-header-text align-middle text-left border-r border-[var(--color-border-transitional-core-subtle)]">Name</th>
          <th className="min-w-[140px] px-6 py-2 table-header-text align-middle text-left border-r border-[var(--color-border-transitional-core-subtle)]">Owner</th>
          <th className="min-w-[120px] px-6 py-2 table-header-text align-middle text-left border-r border-[var(--color-border-transitional-core-subtle)]">Status</th>
          <th className="min-w-[120px] px-6 py-2 table-header-text align-middle text-left border-r border-[var(--color-border-transitional-core-subtle)]">Segment</th>
          <th className="min-w-[180px] px-6 py-2 table-header-text align-middle text-left border-r border-[var(--color-border-transitional-core-subtle)]">Sequence</th>
          <th className="min-w-[180px] px-6 py-2 table-header-text align-middle text-left">Dates</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const TransitionTable = () => (
  <div className="border border-border bg-card rounded-[4px] overflow-hidden">
    <table className="w-full body-100">
      <thead>
        <tr className="bg-[var(--color-fill-surface-recessed)]">
          <th className="px-4 py-2.5 text-left heading-50">From \ To</th>
          <th className="px-4 py-2.5 text-center heading-50">Draft</th>
          <th className="px-4 py-2.5 text-center heading-50">Upcoming</th>
          <th className="px-4 py-2.5 text-center heading-50">Active</th>
          <th className="px-4 py-2.5 text-center heading-50">Ended</th>
        </tr>
      </thead>
      <tbody>
        {([
          ["Draft", "—", "Direct", "Modal: Activate", "Blocked"],
          ["Upcoming", "Direct", "—", "Modal: Launch Now", "Modal: End Play"],
          ["Active", "Modal: Move to Draft", "Modal: Reschedule", "—", "Modal: End Play"],
          ["Ended", "Blocked", "Modal: Schedule Again", "Modal: Reactivate", "—"],
        ] as string[][]).map((row, i) => (
          <tr key={i} className="border-t border-border">
            <td className="px-4 py-2.5 heading-50">{row[0]}</td>
            {row.slice(1).map((cell, j) => (
              <td key={j} className={`px-4 py-2.5 text-center ${cell === "Blocked" ? "text-[var(--color-text-core-disabled)] line-through" : cell === "—" ? "text-[var(--color-text-core-disabled)]" : ""}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ModalDemo = ({ title, description, actionLabel, onClose }: { title: string; description: string; actionLabel: string; onClose?: () => void }) => (
  <div className="bg-background border border-border rounded-lg p-6 shadow-lg max-w-lg space-y-4">
    <div className="space-y-2">
      <h3 className="heading-300">{title}</h3>
      <p className="body-100 text-muted-foreground">{description}</p>
    </div>
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="medium" onClick={onClose}>Cancel</Button>
      <Button variant="primary" size="medium" onClick={onClose}>{actionLabel}</Button>
    </div>
  </div>
);

const ReactivateModalDemo = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-lg max-w-md space-y-4">
      <div className="space-y-2">
        <h3 className="heading-300">Reactivate this play</h3>
        <p className="body-100 text-muted-foreground">Set an end date for this play. Reps in US, EMEA will see it immediately.</p>
      </div>
      <div className="flex justify-center">
        <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d <= new Date()} className="rounded-md border" />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="medium">Cancel</Button>
        <Button variant="primary" size="medium" disabled={!date}>Activate</Button>
      </div>
    </div>
  );
};

const RelaunchModalDemo = () => {
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-lg max-w-md space-y-4">
      <div className="space-y-2">
        <h3 className="heading-300">Schedule this play again</h3>
        <p className="body-100 text-muted-foreground">Pick a launch date and an expiry date.</p>
      </div>
      <div className="flex justify-center">
        <Calendar
          mode="range"
          selected={range as import("react-day-picker").DateRange | undefined}
          onSelect={(r) => setRange(r as { from?: Date; to?: Date } | undefined)}
          disabled={(d) => d <= new Date()}
          className="rounded-md border"
        />
      </div>
      {range?.from && !range?.to && (
        <p className="body-100 text-muted-foreground text-center">Now pick an expiry date</p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="medium">Cancel</Button>
        <Button variant="primary" size="medium" disabled={!range?.from || !range?.to}>Schedule</Button>
      </div>
    </div>
  );
};

const RescheduleModalDemo = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-lg max-w-md space-y-4">
      <div className="space-y-2">
        <h3 className="heading-300">Reschedule launch</h3>
        <p className="body-100 text-muted-foreground">What date do you want this play to launch on?</p>
      </div>
      <div className="flex justify-center">
        <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d <= new Date()} className="rounded-md border" />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="medium">Cancel</Button>
        <Button variant="primary" size="medium" disabled={!date}>Reschedule</Button>
      </div>
    </div>
  );
};

const PlayLifecycleSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Play creation & lifecycle management"
      description="The play creation form footer (publish / save as draft / POTM), the plays table with inline status changes, status transition rules, and all confirmation modals."
    />

    {/* --- Form Footer --- */}
    <SpecSection title="Form footer" description="The bottom of the play creation / edit form. Contains the primary Publish CTA, a secondary Save as Draft, and a POTM checkbox aligned right.">
      <StateCard label="Publish disabled" description="Required fields are incomplete. Publish button is disabled; Save as Draft is always available.">
        <div className="w-[500px]">
          <FormFooterDemo canPublish={false} isPotm={false} />
        </div>
      </StateCard>

      <StateCard label="Publish enabled — future launch date" description="All required fields filled. Hovering Publish shows a tooltip with the launch date.">
        <div className="w-[500px]">
          <FormFooterDemo canPublish={true} isPotm={false} tooltipText="Reps won't see the play until Oct 1, 2026" />
        </div>
      </StateCard>

      <StateCard label="Publish enabled — immediate launch" description="Launch date is today or in the past. Tooltip warns reps will see it immediately.">
        <div className="w-[500px]">
          <FormFooterDemo canPublish={true} isPotm={true} tooltipText="Reps will see this play immediately" />
        </div>
      </StateCard>

      <StateCard label="POTM checked" description="Marks this play as Play of the Month. Adds a POTM badge in the plays table and prospecting sub-nav.">
        <div className="w-[500px]">
          <FormFooterDemo canPublish={true} isPotm={true} />
        </div>
      </StateCard>
    </SpecSection>

    {/* --- Autosave Indicator --- */}
    <SpecSection title="Autosave indicator" description="Appears below the form after the first edit. Debounced at 1 second — shows 'Saving changes' immediately on edit, then settles to 'Changes saved' once the draft is persisted.">
      <StateCard label="Saving" description="User is actively editing. Shown with a loading spinner.">
        <div className="w-[300px]">
          <StatusIndicator loading dotClassName="bg-trellis-green-600" label="Saving changes" />
        </div>
      </StateCard>
      <StateCard label="Saved" description="Draft persisted after 1 second of inactivity." variant="success">
        <div className="w-[300px]">
          <StatusIndicator dotClassName="bg-trellis-green-600" label="Changes saved" />
        </div>
      </StateCard>
    </SpecSection>

    {/* --- Status Badges --- */}
    <SpecSection title="Status badges" description="Four derived states shown as pills in the plays table. State is computed from the persisted status and the play's dates.">
      <div className="flex gap-4 flex-wrap">
        {(["draft", "upcoming", "active", "ended"] as PlayState[]).map((state) => (
          <StateCard key={state} label={STATE_PILL_LABEL[state]} description={
            state === "draft" ? "Persisted status is 'draft'. Dates are ignored." :
            state === "upcoming" ? "Start date is in the future." :
            state === "active" ? "Start date ≤ today and end date ≥ today." :
            "End date is in the past."
          }>
            <StatusPill state={state} />
          </StateCard>
        ))}
      </div>
    </SpecSection>

    {/* --- POTM Badge --- */}
    <SpecSection title="POTM badge" description="Appears beside the play name in the table and in the prospecting sub-nav. Hovering reveals 'Play of the Month' tooltip.">
      <StateCard label="In table row" description="Lorax-variant Badge component, rendered inline after the play name.">
        <div className="flex items-center gap-2">
          <span className="body-125 text-text-interactive">Enterprise Expansion</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><Badge variant="lorax" className="cursor-default">POTM</Badge></span>
              </TooltipTrigger>
              <TooltipContent side="top">Play of the Month</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </StateCard>
    </SpecSection>

    {/* --- Plays Table --- */}
    <SpecSection title="Plays table" description="Each cell has its own hover state. The status cell is fully clickable (opens the dropdown). The play name links to the edit form. Ended plays are also clickable.">
      <StateCard label="Table with all states" description="One row per state. The status column is an inline dropdown.">
        <MiniTable>
          <TableRowDemo name="Marketo Displacement" state="draft" sequence="Marketo Rip & Replace (play1)" />
          <TableRowDemo name="Q3 AEO Push" state="upcoming" sequence="AEO Outbound - Q3" />
          <TableRowDemo name="Enterprise Expansion" state="active" isPotm sequence="MH Pro/Ent (play1)" />
          <TableRowDemo name="SMB Winback" state="ended" sequence="SMB Winback Reactivation" />
        </MiniTable>
      </StateCard>
    </SpecSection>

    {/* --- Status Dropdown --- */}
    <SpecSection title="Status dropdown" description="Clicking anywhere in the status cell opens the dropdown. The chevron only appears on hover. Options are filtered by the current state — Draft ↔ Ended is blocked.">
      <div className="flex gap-6 flex-wrap">
        {(["draft", "upcoming", "active", "ended"] as PlayState[]).map((state) => (
          <StateCard key={state} label={`From ${STATE_PILL_LABEL[state]}`} description={`Allowed targets: ${ALLOWED_TRANSITIONS[state].filter(s => s !== state).map(s => STATE_PILL_LABEL[s]).join(", ")}`}>
            <StatusDropdownDemo currentState={state} />
          </StateCard>
        ))}
      </div>
      <Callout type="behavior">Draft cannot move to Ended (never published). Ended cannot move to Draft (stale dates). These options are hidden from the dropdown.</Callout>
    </SpecSection>

    {/* --- Transition Table --- */}
    <SpecSection title="Transition rules" description="Complete matrix of all state transitions. 'Direct' means no confirmation; 'Modal' means a dialog appears; 'Blocked' means the option is not available.">
      <TransitionTable />
    </SpecSection>

    {/* --- Confirmation Modals --- */}
    <SpecSection title="Confirmation modals" description="Transitions that affect rep visibility or require date input show a confirmation dialog before applying.">

      <StateCard label="Draft → Active" description="Publish a draft. If the launch date is in the future, the message reflects the date instead of 'immediately'.">
        <ModalDemo title="Activate this play?" description="This play will be visible to 16 reps in US, EMEA immediately." actionLabel="Activate" />
      </StateCard>

      <StateCard label="Upcoming → Active" description="Launch a scheduled play ahead of its start date.">
        <ModalDemo title="Launch this play now?" description="This will launch this play to 16 reps in US, EMEA immediately." actionLabel="Launch Now" />
      </StateCard>

      <StateCard label="Active → Draft" description="Pull a live play back to draft. Reps lose access immediately.">
        <ModalDemo title="Move to draft?" description="16 reps in US, EMEA will lose access to this play immediately." actionLabel="Move to Draft" />
      </StateCard>

      <StateCard label="Active → Ended" description="End a live play. Same impact as moving to draft — reps lose access.">
        <ModalDemo title="End this play?" description="16 reps in US, EMEA will lose access to this play immediately." actionLabel="End Play" />
      </StateCard>

      <StateCard label="Upcoming → Ended" description="Cancel a scheduled play before it launches.">
        <ModalDemo title="End this play?" description="This will cancel the scheduled launch. The play will be marked as ended." actionLabel="End Play" />
      </StateCard>

      <StateCard label="Active → Upcoming (reschedule)" description="Push an active play back to a future launch date. Single date picker for the new launch date.">
        <RescheduleModalDemo />
      </StateCard>

      <StateCard label="Ended → Active (reactivate)" description="Bring an expired play back to life. Requires picking a new end date. Start date is pulled to today.">
        <ReactivateModalDemo />
      </StateCard>

      <StateCard label="Ended → Upcoming (relaunch)" description="Schedule a new run of an expired play. Range calendar — pick launch and expiry dates on one calendar.">
        <RelaunchModalDemo />
      </StateCard>
    </SpecSection>

    {/* --- Creation Flow --- */}
    <SpecSection title="Creation flow" description="End-to-end flow from opening the form to the play appearing in the table.">
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep step={1} label="Open form" description="User clicks 'Create play' from the plays table. The PlayBuilder page opens with a blank form and Publish disabled.">
          <div className="w-[500px]">
            <FormFooterDemo canPublish={false} isPotm={false} />
          </div>
        </FlowStep>
        <FlowStep step={2} label="Fill required fields" description="As the user fills fields, the form auto-saves as a Draft every 1 second of inactivity. The autosave indicator appears below the form.">
          <div className="w-[300px]">
            <StatusIndicator dotClassName="bg-trellis-green-600" label="Changes saved" />
          </div>
        </FlowStep>
        <FlowStep step={3} label="Publish or save as draft" description="Once all required fields are filled, Publish enables. Hovering shows a tooltip about when reps will see the play. User can also explicitly Save as Draft.">
          <div className="w-[500px]">
            <FormFooterDemo canPublish={true} isPotm={false} tooltipText="Reps won't see the play until Oct 1, 2026" />
          </div>
        </FlowStep>
        <FlowStep step={4} label="Play appears in table" description="After publishing, the play appears in the plays table with its derived status (Active if launch date is today/past, Upcoming if future). Draft plays also appear." isLast>
          <MiniTable>
            <TableRowDemo name="New Play" state="upcoming" sequence="New Play Sequence" />
          </MiniTable>
        </FlowStep>
      </div>
    </SpecSection>
  </SpecLayout>
);

export default PlayLifecycleSpec;
