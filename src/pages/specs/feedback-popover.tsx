import { useState, useRef, useEffect } from "react";
import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  HorizontalFlow,
  HorizontalFlowStep,
} from "./blocks";
import Tag from "@/components/Tag";
import { InlineFeedbackRow } from "@/components/InlineFeedbackRow";
import { OutreachSequenceCard } from "@/components/OutreachSequenceCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

/* ── Isolated sub-components (same logic as SignalChip internals) ── */

const DetailBody = ({
  title,
  narrative,
  showFeedback = true,
  onThumbsDown,
}: {
  title: string;
  narrative: string;
  showFeedback?: boolean;
  onThumbsDown?: () => void;
}) => (
  <div className="px-4 py-3.5">
    <p className="heading-100 text-foreground">{title}</p>
    <p className="body-100 text-[var(--color-text-core-default)] mt-1">
      {narrative}
    </p>
    {showFeedback && (
      <InlineFeedbackRow
        className="mt-4"
        onThumbsUp={() => {}}
        onThumbsDown={onThumbsDown}
      />
    )}
  </div>
);

const FeedbackForm = ({
  heading,
  subtitle,
  onSubmit,
  onCancel,
}: {
  heading: string;
  subtitle: string;
  onSubmit: () => void;
  onCancel: () => void;
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="px-4 pt-4 pb-4">
      <p className="heading-50 text-foreground mb-1">{heading}</p>
      <p className="detail-200 text-muted-foreground mb-3">{subtitle}</p>
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[60px] body-75 resize-none"
      />
      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="ghost" size="extra-small" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="extra-small"
          disabled={text.trim().length === 0}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

const SuccessBody = () => (
  <div className="px-4 py-3.5 flex flex-col items-center justify-center gap-1.5">
    <CheckCircle2 className="h-6 w-6 text-trellis-green-600" />
    <p className="heading-50 text-foreground">Feedback submitted!</p>
  </div>
);

const PopoverFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[280px] rounded-200 border border-border bg-white shadow-200">
    {children}
  </div>
);

/* ── Outreach sequence card showcase ─────────────────────────────── */

const MOCK_CONTACT = {
  id: "spec-contact",
  name: "Jennifer Park",
  initials: "JP",
  avatarColor: "bg-trellis-purple-600",
};

const MOCK_CALL_SCRIPT = `"I noticed ACME Corp recently partnered with Orbweaver to automate data exchange. HubSpot's Sales Hub consolidates these data streams into one view."`;

const MOCK_LI_MSG = `"I've been following your leadership in the multi-line sales space and would love to connect."`;

const MOCK_EMAILS = [
  { subject: "Scaling ACME Corp's Content ROI.", body: "Hi Jennifer,\n\nI've been researching ACME Corp's content strategy..." },
  { subject: "Doubling down on ACME Corp's highest-ROI content", body: "Hi Jennifer,\n\nFollowing up on my previous note..." },
  { subject: "Closing the loop on content ROI at ACME Corp", body: "Hi Jennifer,\n\nI know things get busy, so I'll keep this brief..." },
];

const SequenceCardShowcase = () => {
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
      callBullets={["Mention Orbweaver partnership", "Sales Hub consolidation pitch"]}
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
      enableFeedback
    />
    </div>
  );
};

/* ── Page ────────────────────────────────────────────────────────── */

const FeedbackPopoverSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Feedback popover"
      description="An inline thumbs up/down mechanism that lets reps give feedback on AI-generated content. Used in two places: signal chip popovers and outreach sequence cards."
    />

    {/* ── Signal flow ─────────────────────────────────────────── */}
    <SpecSection
      title="Signal feedback flow"
      description="Triggered by hovering on a signal chip. The popover shows signal detail, then flips to a feedback form on thumbs down."
    >
      <HorizontalFlow>
        <HorizontalFlowStep
          step={1}
          label="Hover on chip"
          description="Detail view with narrative and thumbs up/down."
        >
          <PopoverFrame>
            <DetailBody
              title="Funding Round"
              narrative="ACME Corp closed a $45M Series C led by Sequoia last month. Companies at this stage typically expand their sales tooling within 6 months."
              onThumbsDown={() => {}}
            />
          </PopoverFrame>
          <div className="mt-3 flex justify-center">
            <Tag variant="green">Funding Round</Tag>
          </div>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={2}
          label="Click thumbs down"
          description="Popover flips to feedback form. Stays pinned open."
        >
          <PopoverFrame>
            <FeedbackForm
              heading={`What's wrong with "Funding Round"?`}
              subtitle="Your feedback will be sent to the product team."
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </PopoverFrame>
          <div className="mt-3 flex justify-center">
            <Tag variant="green">Funding Round</Tag>
          </div>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={3}
          label="Submit feedback"
          description="Success confirmation, then popover closes."
          isLast
        >
          <PopoverFrame>
            <SuccessBody />
          </PopoverFrame>
          <div className="mt-3 flex justify-center">
            <Tag variant="green">Funding Round</Tag>
          </div>
        </HorizontalFlowStep>
      </HorizontalFlow>
    </SpecSection>

    {/* ── Signal popover states ────────────────────────────────── */}
    <SpecSection
      title="Signal popover states"
      description="The three states of the signal popover body, shown at actual rendered size (280px)."
    >
      <StateCard
        label="Detail view (default)"
        description="Signal title, narrative description, and the inline feedback row. This is what appears on hover."
      >
        <PopoverFrame>
          <DetailBody
            title="Funding Round"
            narrative="ACME Corp closed a $45M Series C led by Sequoia last month. Companies at this stage typically expand their sales tooling within 6 months."
            onThumbsDown={() => {}}
          />
        </PopoverFrame>
        <div className="mt-3">
          <Tag variant="green">Funding Round</Tag>
        </div>
      </StateCard>

      <StateCard
        label="Feedback form"
        description="After clicking thumbs down. Textarea is auto-focused. Submit is disabled until text is entered."
      >
        <PopoverFrame>
          <FeedbackForm
            heading={`What's wrong with "Funding Round"?`}
            subtitle="Your feedback will be sent to the product team."
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        </PopoverFrame>
        <div className="mt-3">
          <Tag variant="green">Funding Round</Tag>
        </div>
      </StateCard>

      <StateCard
        label="Success confirmation"
        description="Shown for ~1 second after submitting, then the popover closes automatically."
        variant="success"
      >
        <PopoverFrame>
          <SuccessBody />
        </PopoverFrame>
        <div className="mt-3">
          <Tag variant="green">Funding Round</Tag>
        </div>
      </StateCard>
    </SpecSection>

    {/* ── Sequence context ────────────────────────────────────── */}
    <SpecSection
      title="Sequence feedback"
      description="The feedback row sits at the bottom of the outreach sequence card on the strategy page. Clicking thumbs down opens a Popover (click-triggered, not hover). Below is the full card with feedback enabled."
    >
      <StateCard
        label="Outreach sequence card with feedback"
        description="The 'Give us your feedback' row appears at the very bottom of the card. Click thumbs down to see the feedback popover."
      >
        <SequenceCardShowcase />
      </StateCard>
    </SpecSection>

    {/* ── Sequence flow ──────────────────────────────────────── */}
    <SpecSection
      title="Sequence feedback flow"
      description="The interaction after the rep clicks thumbs down on the feedback row."
    >
      <HorizontalFlow>
        <HorizontalFlowStep
          step={1}
          label="Thumbs row visible"
          description="Feedback row sits at the bottom of the sequence card."
        >
          <PopoverFrame>
            <div className="px-4 py-3.5">
              <InlineFeedbackRow
                onThumbsUp={() => {}}
                onThumbsDown={() => {}}
              />
            </div>
          </PopoverFrame>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={2}
          label="Click thumbs down"
          description="A Popover opens above the button with a feedback form."
        >
          <PopoverFrame>
            <FeedbackForm
              heading="What's wrong with this sequence?"
              subtitle="Your feedback is used to train the sequencing agent."
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </PopoverFrame>
        </HorizontalFlowStep>
        <HorizontalFlowStep
          step={3}
          label="Submit feedback"
          description="Success confirmation, then popover closes."
          isLast
        >
          <PopoverFrame>
            <SuccessBody />
          </PopoverFrame>
        </HorizontalFlowStep>
      </HorizontalFlow>
    </SpecSection>

    {/* ── Sequence popover states ─────────────────────────────── */}
    <SpecSection
      title="Sequence popover states"
      description="The sequence feedback popover. Key differences from the signal popover: click-triggered (not hover), different copy, and the subtitle references the sequencing agent."
    >
      <StateCard
        label="Feedback form"
        description="Opens on thumbs-down click. Textarea is auto-focused. Submit is disabled until text is entered."
      >
        <PopoverFrame>
          <FeedbackForm
            heading="What's wrong with this sequence?"
            subtitle="Your feedback is used to train the sequencing agent."
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        </PopoverFrame>
      </StateCard>

      <StateCard
        label="Success confirmation"
        description="Shown for ~1 second after submitting, then the popover closes automatically."
        variant="success"
      >
        <PopoverFrame>
          <SuccessBody />
        </PopoverFrame>
      </StateCard>
    </SpecSection>
  </SpecLayout>
);

export default FeedbackPopoverSpec;
