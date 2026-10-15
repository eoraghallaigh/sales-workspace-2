import { useState } from "react";
import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  FlowStep,
  HorizontalFlow,
  HorizontalFlowStep,
  Callout,
} from "./blocks";
import { OutreachSequenceCard } from "@/components/OutreachSequenceCard";
import { Button } from "@/components/ui/button";
import { SplitButton } from "@/components/ui/split-button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { GripVertical, ChevronDown, Bold, Italic, Underline, Link as LinkIcon } from "lucide-react";
import type { SequenceState } from "@/data/outreachStates";

const MOCK_CONTACT = {
  id: "spec-seq",
  name: "Keisha Williams",
  initials: "KW",
  avatarColor: "bg-trellis-purple-600",
};

const MOCK_CALL_SCRIPT = `"Hi Keisha — congrats on the new role. The first 90 days are usually when the stack gets a hard look. HubSpot gives reps a CRM they'll actually use."`;
const MOCK_LI_MSG = `"I've been following your work scaling the mid-market team — would love to connect and share how similar teams are using HubSpot."`;

const MOCK_EMAILS = [
  { subject: "A cleaner path off Salesforce for ACME Corp", body: "Hi Keisha,\n\nI noticed ACME Corp recently expanded the sales org..." },
  { subject: "One more reason it's worth a look, Keisha", body: "Hi Keisha,\n\nFollowing up on my previous note..." },
  { subject: "Should I close the loop?", body: "Hi Keisha,\n\nI know things get busy, so I'll keep this brief..." },
];

const ENROLLED_SEQUENCE: SequenceState = {
  kind: "active",
  statuses: [
    { kind: "sent", sentAt: "Apr 25", opens: 3, clicks: 1 },
    { kind: "sent", sentAt: "Apr 27", opens: 2, clicks: 0 },
    { kind: "scheduled", sendsAt: "Tue Apr 30, 9:00am" },
  ],
};

const SequenceShowcase = () => {
  const [scriptMode, setScriptMode] = useState<"script" | "bullets">("script");
  const [expandedTouches, setExpandedTouches] = useState<Record<string, boolean>>({});
  const [callScript, setCallScript] = useState(MOCK_CALL_SCRIPT);
  const [liMsg, setLiMsg] = useState(MOCK_LI_MSG);
  const [subjects, setSubjects] = useState<Record<number, string>>({});
  const [bodies, setBodies] = useState<Record<number, string>>({});

  return (
    <div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">
      <OutreachSequenceCard
        contact={MOCK_CONTACT}
        callBullets={["Mention new role timing", "HubSpot CRM adoption pitch"]}
        onCallBulletChange={() => {}}
        call={{ kind: "not-attempted" }}
        linkedin={{ kind: "not-sent" }}
        sequence={{ kind: "not-enrolled" }}
        defaultCallScript={MOCK_CALL_SCRIPT}
        defaultLinkedInMessage={MOCK_LI_MSG}
        emailTemplates={MOCK_EMAILS}
        expandedTouches={expandedTouches}
        onToggleTouch={(id) => setExpandedTouches((p) => ({ ...p, [id]: !p[id] }))}
        getCallScript={() => callScript}
        onCallScriptChange={setCallScript}
        getLinkedInMessage={() => liMsg}
        onLinkedInMessageChange={setLiMsg}
        getEmailSubject={(idx) => subjects[idx] ?? MOCK_EMAILS[idx].subject}
        onEmailSubjectChange={(idx, v) => setSubjects((p) => ({ ...p, [idx]: v }))}
        getEmailBody={(idx) => bodies[idx] ?? MOCK_EMAILS[idx].body}
        onEmailBodyChange={(idx, v) => setBodies((p) => ({ ...p, [idx]: v }))}
        scriptMode={scriptMode}
        onScriptModeChange={setScriptMode}
        onViewReasoning={() => {}}
      />
    </div>
  );
};

const EnrolledShowcase = () => {
  const [scriptMode, setScriptMode] = useState<"script" | "bullets">("script");
  const [expandedTouches, setExpandedTouches] = useState<Record<string, boolean>>({});
  const [callScript, setCallScript] = useState(MOCK_CALL_SCRIPT);
  const [liMsg, setLiMsg] = useState(MOCK_LI_MSG);
  const [subjects, setSubjects] = useState<Record<number, string>>({});
  const [bodies, setBodies] = useState<Record<number, string>>({});

  return (
    <div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">
      <OutreachSequenceCard
        contact={MOCK_CONTACT}
        callBullets={["Mention new role timing", "HubSpot CRM adoption pitch"]}
        onCallBulletChange={() => {}}
        call={{ kind: "no-answer", attempts: 2, lastAttemptAt: "2 days ago" }}
        linkedin={{ kind: "pending", sentAt: "3 days ago", daysWaiting: 3 }}
        sequence={ENROLLED_SEQUENCE}
        defaultCallScript={MOCK_CALL_SCRIPT}
        defaultLinkedInMessage={MOCK_LI_MSG}
        emailTemplates={MOCK_EMAILS}
        expandedTouches={expandedTouches}
        onToggleTouch={(id) => setExpandedTouches((p) => ({ ...p, [id]: !p[id] }))}
        getCallScript={() => callScript}
        onCallScriptChange={setCallScript}
        getLinkedInMessage={() => liMsg}
        onLinkedInMessageChange={setLiMsg}
        getEmailSubject={(idx) => subjects[idx] ?? MOCK_EMAILS[idx].subject}
        onEmailSubjectChange={(idx, v) => setSubjects((p) => ({ ...p, [idx]: v }))}
        getEmailBody={(idx) => bodies[idx] ?? MOCK_EMAILS[idx].body}
        onEmailBodyChange={(idx, v) => setBodies((p) => ({ ...p, [idx]: v }))}
        scriptMode={scriptMode}
        onScriptModeChange={setScriptMode}
        onViewReasoning={() => {}}
      />
    </div>
  );
};

const SequenceCustomisationSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Sequences flexibility: add/remove steps, schedule, re-prompt individual steps"
      description="Give reps more control over sequences: scheduled starts, adjustable timing between steps, add/remove/reorder steps, and non-blocking manual tasks. Reps can customise an AI-generated sequence before enrolling a contact."
    />

    <SpecSection
      title="Context"
      description="The sequence card on the prospecting strategy page. All customisation happens here before enrollment."
    >
      <StateCard
        label="Pre-enrollment sequence (interactive)"
        description="The full card with all customisation controls active. Click steps to expand, drag to reorder, use the inline dropdowns to adjust timing, and click '+Step' to insert new steps."
      >
        <SequenceShowcase />
      </StateCard>
    </SpecSection>

    <SpecSection
      title="Scheduled start"
      description="When the sequence begins is chosen from the enroll control, not from the first step. The control is a primary split button: its main segment enrolls same-day, and its calendar segment opens a date picker to schedule a later start."
    >
      <HorizontalFlow>
        <HorizontalFlowStep
          step={1}
          label="Enroll control"
          description="Below the sequence, a primary split button with an 'Enroll {Name}' main segment and a calendar segment divided by a thin line."
        >
          <div className="w-fit">
            <SplitButton
              size="small"
              trailing={<TrellisIcon name="date" size={14} />}
              trailingAriaLabel="Choose a start date"
            >
              Enroll Keisha
            </SplitButton>
          </div>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={2}
          label="Open the date picker"
          description="Clicking the calendar segment opens a date picker — no date preselected, and no highlight on today."
        >
          <div className="w-fit rounded-[var(--radius-popover)] border bg-popover text-popover-foreground shadow-md p-1">
            <Calendar mode="single" classNames={{ day_today: "" }} />
          </div>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={3}
          label="Pick a date"
          description="Selecting a date closes the picker immediately and relabels the main segment to 'Enroll {Name} on {date}'. Enrolling is still one click on the main segment."
        >
          <div className="w-fit">
            <SplitButton
              size="small"
              trailing={<TrellisIcon name="date" size={14} />}
              trailingAriaLabel="Choose a start date"
            >
              Enroll Keisha on Aug 15
            </SplitButton>
          </div>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={4}
          label="Scheduled"
          description="The chip reads 'Scheduled' (blue), the footer shows a single 'Cancel' CTA, and a 'Sequence starts on {date}' note sits under the first step."
          isLast
        >
          <div className="bg-[var(--color-fill-surface-raised)] rounded-200 border border-border p-4 w-[340px] space-y-3">
            <div className="flex items-center gap-2">
              <span className="heading-100 text-foreground">5-touch sequence</span>
              <Badge variant="status-blue">Scheduled</Badge>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrellisIcon name="calling" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Follow up call</span>
              </div>
              <p className="detail-200 text-muted-foreground">
                Sequence starts on <span className="font-semibold text-foreground">Aug 15</span>.
              </p>
            </div>
            <Button variant="secondary" size="small">
              Cancel
            </Button>
          </div>
        </HorizontalFlowStep>
      </HorizontalFlow>

      <Callout type="behavior">
        Scheduling doesn't wait — the contact is enrolled straight away; only the first step's fire date shifts to the chosen date. While scheduled, the chip reads "Scheduled" and the only control is "Cancel", which returns the sequence to its initial un-enrolled state. Once the first step actually executes, the chip flips to "Enrolled" and the controls become "Pause" and "Unenroll".
      </Callout>

      <Callout type="behavior">
        The main segment enrolls directly. With no date chosen it enrolls same-day and goes straight to "Enrolled"; after a date is chosen its label becomes "Enroll {"{Name}"} on {"{date}"}" and it schedules instead.
      </Callout>
    </SpecSection>

    <SpecSection
      title="Step timing"
      description="Steps 2+ show an inline dropdown that controls the delay relative to the previous step. The format differs by step type."
    >
      <StateCard
        label="Email step timing"
        description="Reads 'Email will be sent [N days after] previous step.' The bold text is a dropdown trigger with preset options (1, 2, 3, 5, 7, 14 days)."
      >
        <div className="bg-white rounded-200 border border-border p-4">
          <p className="detail-200 text-muted-foreground">
            Email will be sent <span className="font-semibold text-foreground inline-flex items-center gap-0.5">2 days after <ChevronDown size={10} /></span> previous step.
          </p>
        </div>
      </StateCard>

      <StateCard
        label="Call/LinkedIn task timing"
        description="Reads 'Task will be created [N days after] previous step. This task will not block subsequent steps.' The non-blocking note always appears for manual tasks."
      >
        <div className="bg-white rounded-200 border border-border p-4">
          <p className="detail-200 text-muted-foreground">
            Task will be created <span className="font-semibold text-foreground inline-flex items-center gap-0.5">3 days after <ChevronDown size={10} /></span> previous step. This task will not block subsequent steps.
          </p>
        </div>
      </StateCard>

      <Callout type="implementation">
        Delay values are stored per-step. Default is 2 days for emails and 3 days for call/LinkedIn tasks. The dropdown options are: 1, 2, 3, 5, 7, 14 days. Selecting an option closes the dropdown immediately.
      </Callout>
    </SpecSection>

    <SpecSection
      title="Non-blocking manual tasks"
      description="Call and LinkedIn tasks are manual — the rep has to complete them. Unlike emails (which send automatically), manual tasks should not prevent the next automated step from firing."
    >
      <StateCard
        label="Non-blocking indicator"
        description="A sentence shown for call and LinkedIn steps. On steps 2+ it's appended to the timing text; on the first step (which no longer has a timing line) it stands on its own."
      >
        <div className="bg-white rounded-200 border border-border p-4 space-y-3">
          <div>
            <p className="heading-50 text-foreground">Step 1 (call task)</p>
            <p className="detail-200 text-muted-foreground mt-1">
              This task will not block subsequent steps.
            </p>
          </div>
          <div className="border-t border-border pt-3">
            <p className="heading-50 text-foreground">Step 2 (LinkedIn task)</p>
            <p className="detail-200 text-muted-foreground mt-1">
              Task will be created <span className="font-semibold text-foreground inline-flex items-center gap-0.5">3 days after <ChevronDown size={10} /></span> previous step. This task will not block subsequent steps.
            </p>
          </div>
        </div>
      </StateCard>

      <Callout type="behavior">
        "Non-blocking" means: if a call task is due on day 3 but the rep hasn't completed it by day 5, the next email still sends on day 5. Manual tasks run in parallel with the automated sequence — they don't gate progression.
      </Callout>
    </SpecSection>

    <SpecSection
      title="Step editing"
      description="Expanding a step reveals its content as readable text with Edit and Delete buttons at the bottom-right. Clicking Edit enters an inline editor; clicking Delete removes the step. The step content is always readable without needing to interact — no hover overlay or blur."
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep
          step={1}
          label="Expand step"
          description="Click the collapsed row to expand. The step content is immediately readable. Edit and Delete buttons sit at the bottom-right."
        >
          <div className="bg-white rounded-200 border border-border">
            <div className="px-4 py-3 flex items-center gap-4 border-b border-border">
              <GripVertical size={14} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0 -space-y-0.5">
                <div className="flex items-center gap-2">
                  <TrellisIcon name="calling" size={16} />
                  <span className="body-100 text-foreground">Follow up call</span>
                </div>
                <p className="detail-200 text-muted-foreground">This task will not block subsequent steps.</p>
              </div>
            </div>
            <div className="px-4 py-4 pl-10">
              <div className="flex flex-col gap-2">
                <p className="heading-50 text-foreground">Follow up call</p>
                <p className="body-100 text-foreground leading-relaxed whitespace-pre-line">"Hi Keisha — congrats on the new role. The first 90 days are usually when the stack gets a hard look. HubSpot gives reps a CRM they'll actually use."</p>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="secondary" size="extra-small">Edit</Button>
                  <Button variant="ghost" size="extra-small" className="text-destructive hover:text-destructive">Delete</Button>
                </div>
              </div>
            </div>
          </div>
        </FlowStep>

        <FlowStep
          step={2}
          label="Click Edit"
          description="The read view is replaced by an inline editor with title input, notes textarea, rich-text toolbar, and Cancel/Save actions."
        >
          <div className="bg-white rounded-200 border border-border">
            <div className="px-4 py-3 flex items-center gap-4 border-b border-border">
              <GripVertical size={14} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0 -space-y-0.5">
                <div className="flex items-center gap-2">
                  <TrellisIcon name="calling" size={16} />
                  <span className="body-100 text-foreground">Follow up call</span>
                </div>
                <p className="detail-200 text-muted-foreground">This task will not block subsequent steps.</p>
              </div>
            </div>
            <div className="px-4 py-4 pl-10 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="heading-50 text-foreground">Task title</label>
                <Input defaultValue="Follow up call" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="heading-50 text-foreground">Task notes</label>
                <Textarea
                  defaultValue={`"Hi Keisha — congrats on the new role — the first 90 days are usually when the stack gets a hard look."`}
                  className="min-h-[120px] leading-relaxed"
                />
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="flex items-center">
                    <button type="button" aria-label="Bold" className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"><Bold size={14} /></button>
                    <button type="button" aria-label="Italic" className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"><Italic size={14} /></button>
                    <button type="button" aria-label="Underline" className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"><Underline size={14} /></button>
                    <button type="button" aria-label="Insert link" className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"><LinkIcon size={14} /></button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="secondary" size="extra-small" className="mr-2">Cancel</Button>
                    <Button variant="primary" size="extra-small">Save</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FlowStep>

        <FlowStep
          step={3}
          label="Save or Cancel"
          description="Save commits edits and returns to the read view. Cancel discards changes. Both return the step to the readable state with Edit/Delete buttons."
          isLast
        >
          <div className="bg-white rounded-200 border border-border">
            <div className="px-4 py-3 flex items-center gap-4 border-b border-border">
              <GripVertical size={14} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0 -space-y-0.5">
                <div className="flex items-center gap-2">
                  <TrellisIcon name="calling" size={16} />
                  <span className="body-100 text-foreground">Follow up call</span>
                </div>
                <p className="detail-200 text-muted-foreground">This task will not block subsequent steps.</p>
              </div>
            </div>
            <div className="px-4 py-4 pl-10">
              <div className="flex flex-col gap-2">
                <p className="heading-50 text-foreground">Follow up call</p>
                <p className="body-100 text-foreground leading-relaxed whitespace-pre-line">"Hi Keisha — congrats on the new role. The first 90 days are usually when the stack gets a hard look. HubSpot gives reps a CRM they'll actually use."</p>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="secondary" size="extra-small">Edit</Button>
                  <Button variant="ghost" size="extra-small" className="text-destructive hover:text-destructive">Delete</Button>
                </div>
              </div>
            </div>
          </div>
        </FlowStep>
      </div>

      <Callout type="behavior">
        The Edit and Delete buttons are always visible on an expanded step — no hover required. This lets reps read step content without accidentally triggering an edit. Delete removes the step immediately; the editor only has Cancel and Save.
      </Callout>
    </SpecSection>

    <SpecSection
      title="Add/remove/reorder steps"
      description="Before enrollment, reps can insert new steps, delete existing ones, and drag-and-drop to reorder."
    >
      <StateCard
        label="Insert step"
        description="Hover between any two steps to reveal a '+Step' pill. Click to choose the step type (Call, LinkedIn, Email) from a popover. The new step form includes scheduling, task title/notes, and a toolbar."
      >
        <div className="bg-white rounded-200 border border-border">
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="calling" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Follow up call</span>
              </div>
              <p className="detail-200 text-muted-foreground">This task will not block subsequent steps.</p>
            </div>
          </div>
          <div className="relative border-t border-border">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-core-subtle)] bg-white px-2 py-0.5 detail-100 text-muted-foreground shadow-sm">+ Step</span>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="linkedin" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Connection request</span>
              </div>
              <p className="detail-200 text-muted-foreground">Task will be created <span className="font-semibold text-foreground inline-flex items-center gap-0.5">3 days after <ChevronDown size={10} /></span> previous step. This task will not block subsequent steps.</p>
            </div>
          </div>
        </div>
      </StateCard>

      <StateCard
        label="Reorder steps"
        description="Drag the grip handle on any step to reorder. Drag is constrained to vertical axis within the sequence. Delete is available via the Delete button on any expanded step."
      >
        <div className="bg-white rounded-200 border border-border divide-y divide-border">
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="calling" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Follow up call</span>
              </div>
              <p className="detail-200 text-muted-foreground">This task will not block subsequent steps.</p>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="linkedin" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Connection request</span>
              </div>
              <p className="detail-200 text-muted-foreground">Task will be created <span className="font-semibold text-foreground inline-flex items-center gap-0.5">3 days after <ChevronDown size={10} /></span> previous step.</p>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="email" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground truncate">A cleaner path off Salesforce for ACME Corp</span>
              </div>
              <p className="detail-200 text-muted-foreground">Email will be sent <span className="font-semibold text-foreground inline-flex items-center gap-0.5">2 days after <ChevronDown size={10} /></span> previous step.</p>
            </div>
          </div>
        </div>
      </StateCard>

      <Callout type="edge-case">
        After reordering, step timing indicators update automatically — whatever step lands first drops its "N days after previous step" delay (its start is governed by the enrollment CTAs instead), and all subsequent steps show their delay relative to the previous step.
      </Callout>
    </SpecSection>

    <SpecSection
      title="Enrolled state"
      description="Once enrolled, the sequence becomes read-only. Timing is shown as exact dates (from the existing timestamp system), not relative delays."
    >
      <StateCard
        label="Enrolled sequence (interactive)"
        description="Timeline view with completion dots. Steps are expandable but not editable. Timing shows absolute dates (e.g., 'Sends Tue Apr 30, 9:00am'). Pause/Unenroll controls appear below."
      >
        <EnrolledShowcase />
      </StateCard>

      <Callout type="behavior">
        The relative timing controls (dropdowns) are hidden in the enrolled state. The existing meta timestamps ("Sends Apr 30", "Sent Apr 27") provide the scheduling information instead. Steps cannot be added, removed, reordered, or edited after enrollment.
      </Callout>
    </SpecSection>

  </SpecLayout>
);

export default SequenceCustomisationSpec;
