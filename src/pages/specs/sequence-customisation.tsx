import { useState } from "react";
import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  HorizontalFlow,
  HorizontalFlowStep,
  Callout,
} from "./blocks";
import { OutreachSequenceCard } from "@/components/OutreachSequenceCard";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { GripVertical } from "lucide-react";
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
      description="The first step shows an inline dropdown that controls when the sequence begins relative to enrollment. Options: same day as, 1 day after, 3 days after, or a custom date via a calendar picker."
    >
      <HorizontalFlow>
        <HorizontalFlowStep
          step={1}
          label="Default state"
          description="First step shows 'First step will execute same day as enrollment.' with a dropdown trigger."
        >
          <div className="bg-white rounded-200 border border-border p-4 w-[340px]">
            <div className="flex items-center gap-2 mb-1">
              <TrellisIcon name="calling" size={16} className="text-foreground shrink-0" />
              <span className="body-100 text-foreground">Follow up call</span>
            </div>
            <p className="detail-200 text-muted-foreground">
              First step will execute <span className="font-semibold text-foreground">same day as ˅</span> enrollment. This task will not block subsequent steps.
            </p>
          </div>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={2}
          label="Click dropdown"
          description="Popover opens with preset options and a 'Custom Date and Time' option that reveals a calendar."
        >
          <div className="bg-white rounded-200 border border-border p-4 w-[340px]">
            <div className="flex items-center gap-2 mb-1">
              <TrellisIcon name="calling" size={16} className="text-foreground shrink-0" />
              <span className="body-100 text-foreground">Follow up call</span>
            </div>
            <p className="detail-200 text-muted-foreground mb-2">
              First step will execute <span className="font-semibold text-foreground">same day as ˅</span> enrollment.
            </p>
            <div className="w-[180px] rounded-200 border border-border bg-white shadow-200 p-1">
              <div className="px-3 py-1.5 detail-200 text-foreground font-semibold bg-[var(--color-fill-surface-recessed)] rounded">same day as</div>
              <div className="px-3 py-1.5 detail-200 text-foreground">1 day after</div>
              <div className="px-3 py-1.5 detail-200 text-foreground">3 days after</div>
              <div className="px-3 py-1.5 detail-200 text-foreground">Custom Date and Time</div>
            </div>
          </div>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={3}
          label="Selection applied"
          description="Dropdown closes. The text updates to reflect the new timing."
          isLast
        >
          <div className="bg-white rounded-200 border border-border p-4 w-[340px]">
            <div className="flex items-center gap-2 mb-1">
              <TrellisIcon name="calling" size={16} className="text-foreground shrink-0" />
              <span className="body-100 text-foreground">Follow up call</span>
            </div>
            <p className="detail-200 text-muted-foreground">
              First step will execute <span className="font-semibold text-foreground">3 days after ˅</span> enrollment.
            </p>
          </div>
        </HorizontalFlowStep>
      </HorizontalFlow>

      <Callout type="behavior">
        When the rep selects "Custom Date and Time", the popover switches to a calendar picker. After selecting a date, the text updates to show the chosen date (e.g., "First step will execute <strong>on Aug 15</strong>.").
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
            Email will be sent <span className="font-semibold text-foreground">2 days after ˅</span> previous step.
          </p>
        </div>
      </StateCard>

      <StateCard
        label="Call/LinkedIn task timing"
        description="Reads 'Task will be created [N days after] previous step. This task will not block subsequent steps.' The non-blocking note always appears for manual tasks."
      >
        <div className="bg-white rounded-200 border border-border p-4">
          <p className="detail-200 text-muted-foreground">
            Task will be created <span className="font-semibold text-foreground">3 days after ˅</span> previous step. This task will not block subsequent steps.
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
        description="A sentence appended to the timing text for call and LinkedIn steps. This appears on every manual task, including step 1."
      >
        <div className="bg-white rounded-200 border border-border p-4 space-y-3">
          <div>
            <p className="heading-50 text-foreground">Step 1 (call task)</p>
            <p className="detail-200 text-muted-foreground mt-1">
              First step will execute <span className="font-semibold text-foreground">same day as ˅</span> enrollment. This task will not block subsequent steps.
            </p>
          </div>
          <div className="border-t border-border pt-3">
            <p className="heading-50 text-foreground">Step 2 (LinkedIn task)</p>
            <p className="detail-200 text-muted-foreground mt-1">
              Task will be created <span className="font-semibold text-foreground">3 days after ˅</span> previous step. This task will not block subsequent steps.
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
      description="Expanding a call or LinkedIn step reveals a 'Task title' and 'Task notes' editor. Email steps show 'Subject' and 'Body'. Click anywhere on the step content to enter edit mode. The task title is shown inline in the collapsed header next to the icon."
    >
      <StateCard
        label="Call task — expanded edit state"
        description="Task title input, task notes textarea with rich-text toolbar (bold, italic, underline, link), and delete/cancel/save actions."
      >
        <div className="bg-white rounded-200 border border-border">
          <div className="px-4 py-3 flex items-center gap-4 border-b border-border">
            <GripVertical size={14} className="text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="calling" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Follow up call</span>
              </div>
              <p className="detail-200 text-muted-foreground">First step will execute <span className="font-semibold text-foreground">same day as ˅</span> enrollment. This task will not block subsequent steps.</p>
            </div>
          </div>
          <div className="px-4 py-4 pl-10 space-y-4">
            <div className="flex flex-col gap-1">
              <label className="heading-50 text-foreground">Task title</label>
              <div className="border border-border rounded-[4px] px-3 py-2 body-100 text-foreground bg-white">Follow up call</div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="heading-50 text-foreground">Task notes</label>
              <div className="border border-border rounded-[4px] px-3 py-2 body-100 text-foreground bg-white min-h-[80px] leading-relaxed">"Hi Keisha — congrats on the new role — the first 90 days are usually when the stack gets a hard look."</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5 text-muted-foreground">
                <span className="p-1.5 rounded hover:bg-[var(--color-fill-surface-recessed)]"><strong>B</strong></span>
                <span className="p-1.5 rounded hover:bg-[var(--color-fill-surface-recessed)]"><em>I</em></span>
                <span className="p-1.5 rounded hover:bg-[var(--color-fill-surface-recessed)]"><u>U</u></span>
                <span className="p-1.5 rounded hover:bg-[var(--color-fill-surface-recessed)]">🔗</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="detail-200 text-destructive">Delete step</span>
                <span className="detail-200 text-muted-foreground px-2 py-1 border border-border rounded-full">Cancel</span>
                <span className="detail-200 text-white bg-foreground px-2 py-1 rounded-full">Save</span>
              </div>
            </div>
          </div>
        </div>
      </StateCard>
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
              <p className="detail-200 text-muted-foreground">First step will execute <span className="font-semibold text-foreground">same day as ˅</span> enrollment. This task will not block subsequent steps.</p>
            </div>
          </div>
          <div className="relative border-t border-border">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-0.5 detail-100 text-muted-foreground shadow-sm">+ Step</span>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="linkedin" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Connection request</span>
              </div>
              <p className="detail-200 text-muted-foreground">Task will be created <span className="font-semibold text-foreground">3 days after ˅</span> previous step. This task will not block subsequent steps.</p>
            </div>
          </div>
        </div>
      </StateCard>

      <StateCard
        label="Reorder steps"
        description="Drag the grip handle on any step to reorder. Drag is constrained to vertical axis within the sequence. Delete is available via the expanded edit view toolbar."
      >
        <div className="bg-white rounded-200 border border-border divide-y divide-border">
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="calling" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Follow up call</span>
              </div>
              <p className="detail-200 text-muted-foreground">First step will execute <span className="font-semibold text-foreground">same day as ˅</span> enrollment.</p>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="linkedin" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground">Connection request</span>
              </div>
              <p className="detail-200 text-muted-foreground">Task will be created <span className="font-semibold text-foreground">3 days after ˅</span> previous step.</p>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-4">
            <GripVertical size={14} className="text-muted-foreground shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0 -space-y-0.5">
              <div className="flex items-center gap-2">
                <TrellisIcon name="email" size={16} className="text-foreground shrink-0" />
                <span className="body-100 text-foreground truncate">A cleaner path off Salesforce for ACME Corp</span>
              </div>
              <p className="detail-200 text-muted-foreground">Email will be sent <span className="font-semibold text-foreground">2 days after ˅</span> previous step.</p>
            </div>
          </div>
        </div>
      </StateCard>

      <Callout type="edge-case">
        After reordering, step timing indicators update automatically — "Executes on enrollment" only ever applies to whatever step is first, and all subsequent steps show their delay relative to the previous step.
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
