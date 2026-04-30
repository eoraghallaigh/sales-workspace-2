import { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  CallCard,
  LinkedInCard,
  EmailSequenceCard,
} from "@/components/OutreachCards";
import type {
  CallState,
  LinkedInState,
  SequenceState,
} from "@/data/outreachStates";

const FAKE_CONTACT = {
  id: "showcase-contact",
  name: "Jennifer Park",
  initials: "JP",
  avatarColor: "bg-trellis-purple-600",
};
const FIRST_NAME = "Jennifer";
const COMPANY = "ACME Corp";

const DEFAULT_CALL_SCRIPT = `"I noticed ${COMPANY} recently partnered with Orbweaver to automate data exchange for manufacturers. Usually, increasing the volume of automated data leads to fragmented 'Franken-stacks' where reps struggle to find a single source of truth. HubSpot's Sales Hub consolidates these data streams into one view, using Breeze AI to automate prospecting so your team stays focused on closing."`;
const DEFAULT_LI_MSG = `"I've been following your leadership in the multi-line sales space and would love to connect. Your work integrating Empowering Systems into ${COMPANY} is fascinating."`;
const EMAIL_TEMPLATES = [
  {
    subject: `Scaling ${COMPANY}'s Content ROI.`,
    body: `Hi ${FIRST_NAME},\n\nI've been researching ${COMPANY}'s content strategy and noticed some impressive growth metrics. Many companies in your space are leaving significant ROI on the table by not connecting their content performance data directly to their sales pipeline.\n\nHubSpot's Content Hub can help you attribute revenue directly to content touchpoints, giving your team clear visibility into what's driving deals forward.\n\nWould you be open to a 15-minute conversation about how we could help scale your content ROI?`,
  },
  {
    subject: `Doubling down on ${COMPANY}'s highest-ROI content`,
    body: `Hi ${FIRST_NAME},\n\nFollowing up on my previous note — I wanted to share a quick case study. A company similar to ${COMPANY} was able to 2x their content-influenced pipeline by using AI-powered content recommendations to serve the right assets at the right stage of the buyer's journey.\n\nI'd love to walk you through how this could work for your team. Would next Tuesday or Wednesday work for a brief call?`,
  },
  {
    subject: `Closing the loop on content ROI at ${COMPANY}`,
    body: `Hi ${FIRST_NAME},\n\nI know things get busy, so I'll keep this brief. I've put together a short analysis of how ${COMPANY} could better leverage your existing content library to accelerate deals currently in your pipeline.\n\nNo commitment needed — happy to share the analysis either way. Just let me know if you'd like me to send it over.`,
  },
];

type Scenario<T> = { label: string; description: string; state: T };

const callScenarios: Scenario<CallState>[] = [
  {
    label: "Not attempted",
    description: "Rep hasn't called yet. Default state for any new prospect.",
    state: { kind: "not-attempted" },
  },
  {
    label: "No answer",
    description: "Rep dialled but the prospect didn't pick up. Counter increments per attempt.",
    state: { kind: "no-answer", attempts: 2, lastAttemptAt: "2 days ago" },
  },
  {
    label: "Voicemail left",
    description: "Rep left a voicemail. Awaiting callback or another attempt.",
    state: { kind: "voicemail", lastAttemptAt: "yesterday" },
  },
  {
    label: "Connected",
    description: "Rep had an actual conversation. Sequence auto-unenrolls when this happens.",
    state: { kind: "connected", at: "yesterday", durationMin: 12 },
  },
];

const linkedinScenarios: Scenario<LinkedInState>[] = [
  {
    label: "Not sent",
    description: "Rep hasn't sent a connection request. Default state.",
    state: { kind: "not-sent" },
  },
  {
    label: "Pending",
    description: "Request has been sent and the prospect hasn't accepted or declined yet.",
    state: { kind: "pending", sentAt: "3 days ago", daysWaiting: 3 },
  },
  {
    label: "Accepted",
    description: "Prospect accepted the request. Sequence auto-unenrolls and 'Send InMail' becomes available.",
    state: { kind: "accepted", acceptedAt: "yesterday" },
  },
  {
    label: "Declined / no response",
    description: "Request was declined or has gone unanswered for a long time. Suggests trying another channel.",
    state: { kind: "declined" },
  },
  {
    label: "Already connected",
    description: "Rep is already a 1st-degree connection on LinkedIn — no request needed.",
    state: { kind: "already-connected" },
  },
];

const sequenceScenarios: Scenario<SequenceState>[] = [
  {
    label: "Not enrolled",
    description: "Sequence hasn't been started for this contact. CTA invites the rep to enroll.",
    state: { kind: "not-enrolled" },
  },
  {
    label: "Active — mid-flight",
    description:
      "Some emails have sent, others are scheduled. Header shows step counter and next send time. Subjects/bodies are read-only while enrolled.",
    state: {
      kind: "active",
      statuses: [
        { kind: "sent", sentAt: "Apr 27", opens: 2, clicks: 0 },
        { kind: "scheduled", sendsAt: "Tue Apr 30, 9:00am" },
        { kind: "scheduled", sendsAt: "Mon May 5, 9:00am" },
      ],
    },
  },
  {
    label: "Completed — no reply",
    description: "All three emails have sent and the prospect didn't reply. Sequence ends naturally.",
    state: {
      kind: "completed",
      statuses: [
        { kind: "sent", sentAt: "Apr 22", opens: 2, clicks: 0 },
        { kind: "sent", sentAt: "Apr 25", opens: 1, clicks: 0 },
        { kind: "sent", sentAt: "Apr 28", opens: 0, clicks: 0 },
      ],
    },
  },
  {
    label: "Unenrolled — replied",
    description:
      "Prospect replied to one of the emails. Remaining emails are cancelled. Reply renders inline under the relevant email.",
    state: {
      kind: "unenrolled",
      reason: `Sequence ended because ${FIRST_NAME} replied`,
      statuses: [
        { kind: "sent", sentAt: "Apr 22", opens: 2, clicks: 0 },
        {
          kind: "sent",
          sentAt: "Apr 25",
          opens: 4,
          clicks: 2,
          reply: { at: "Apr 26, 10:14am", preview: "Open to a 20-min call next week." },
        },
        { kind: "cancelled" },
      ],
    },
  },
  {
    label: "Unenrolled — connected call",
    description: "Rep connected on a call so the sequence stops. Lets the rep figure out what to do next.",
    state: {
      kind: "unenrolled",
      reason: `Sequence ended because you had a connected call with ${FIRST_NAME}`,
      statuses: [
        { kind: "sent", sentAt: "Apr 22", opens: 3, clicks: 1 },
        { kind: "cancelled" },
        { kind: "cancelled" },
      ],
    },
  },
  {
    label: "Unenrolled — LinkedIn accepted",
    description: "Prospect accepted the LinkedIn request, so the sequence stops to allow direct outreach.",
    state: {
      kind: "unenrolled",
      reason: `Sequence ended because ${FIRST_NAME} accepted your LinkedIn request`,
      statuses: [
        { kind: "sent", sentAt: "Apr 24", opens: 1, clicks: 0 },
        { kind: "cancelled" },
        { kind: "cancelled" },
      ],
    },
  },
];

const Section = ({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) => (
  <section className="mb-12">
    <h2 className="heading-200 text-foreground mb-1">{title}</h2>
    <p className="body-100 text-muted-foreground mb-6 max-w-2xl">{blurb}</p>
    <div className="space-y-8">{children}</div>
  </section>
);

const StateBlock = ({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="mb-3">
      <h3 className="heading-50 text-foreground">{label}</h3>
      <p className="detail-200 text-muted-foreground max-w-2xl">{description}</p>
    </div>
    {children}
  </div>
);

const CallShowcase = ({ state }: { state: CallState }) => {
  const [expanded, setExpanded] = useState(false);
  const [script, setScript] = useState(DEFAULT_CALL_SCRIPT);
  const [mode, setMode] = useState<"script" | "bullets">("script");
  return (
    <CallCard
      state={state}
      contactName={FAKE_CONTACT.name}
      companyName={COMPANY}
      isExpanded={expanded}
      onToggleExpanded={() => setExpanded((v) => !v)}
      scriptValue={script}
      onScriptChange={setScript}
      scriptMode={mode}
      onScriptModeChange={setMode}
    />
  );
};

const LinkedInShowcase = ({ state }: { state: LinkedInState }) => {
  const [expanded, setExpanded] = useState(false);
  const [msg, setMsg] = useState(DEFAULT_LI_MSG);
  return (
    <LinkedInCard
      state={state}
      isExpanded={expanded}
      onToggleExpanded={() => setExpanded((v) => !v)}
      messageValue={msg}
      onMessageChange={setMsg}
    />
  );
};

const SequenceShowcase = ({ state }: { state: SequenceState }) => {
  const [expanded, setExpanded] = useState(true);
  const [emailExpanded, setEmailExpanded] = useState<Record<number, boolean>>({});
  const [subjects, setSubjects] = useState<Record<number, string>>({});
  const [bodies, setBodies] = useState<Record<number, string>>({});
  return (
    <EmailSequenceCard
      state={state}
      contact={FAKE_CONTACT}
      isExpanded={expanded}
      onToggleExpanded={() => setExpanded((v) => !v)}
      emails={EMAIL_TEMPLATES}
      expandedEmails={emailExpanded}
      onToggleEmail={(idx) => setEmailExpanded((p) => ({ ...p, [idx]: !p[idx] }))}
      getSubjectValue={(idx) => subjects[idx] ?? EMAIL_TEMPLATES[idx].subject}
      onSubjectChange={(idx, v) => setSubjects((p) => ({ ...p, [idx]: v }))}
      getBodyValue={(idx) => bodies[idx] ?? EMAIL_TEMPLATES[idx].body}
      onBodyChange={(idx, v) => setBodies((p) => ({ ...p, [idx]: v }))}
      onReply={() => {}}
    />
  );
};

const OutreachStates = () => {
  return (
    <Layout>
      <div className="h-[calc(100vh-48px)] overflow-y-auto bg-white">
        <div className="px-10 py-12 max-w-4xl">
        <h1 className="heading-500 text-foreground mb-2">Outreach card states</h1>
        <p className="body-100 text-muted-foreground mb-10 max-w-2xl">
          A reference for engineers and designers showing every state the Call, LinkedIn, and Email
          sequence cards can land in. Cards on this page render the same components used on the
          strategy page — interactions like expand/collapse and editing work, but state isn't persisted.
        </p>

        <Section
          title="Call"
          blurb="Outbound call card. Avatar flips to the green check the moment the rep takes any action."
        >
          {callScenarios.map((sc) => (
            <StateBlock key={sc.label} label={sc.label} description={sc.description}>
              <CallShowcase state={sc.state} />
            </StateBlock>
          ))}
        </Section>

        <Section
          title="LinkedIn Connection Request"
          blurb="LinkedIn outreach. The pending state is the most common — reps lose track of these without a clear status."
        >
          {linkedinScenarios.map((sc) => (
            <StateBlock key={sc.label} label={sc.label} description={sc.description}>
              <LinkedInShowcase state={sc.state} />
            </StateBlock>
          ))}
        </Section>

        <Section
          title="Email sequence"
          blurb="Three-step email sequence. Status chip shows where the rep is. Per-email rows show send time, engagement, or cancellation. Replies render inline under the relevant email."
        >
          {sequenceScenarios.map((sc) => (
            <StateBlock key={sc.label} label={sc.label} description={sc.description}>
              <SequenceShowcase state={sc.state} />
            </StateBlock>
          ))}
        </Section>

        <div className="mt-16 p-4 rounded-100 border border-core-subtle bg-[var(--color-fill-surface-recessed)] max-w-2xl">
          <h3 className="heading-50 text-foreground mb-1">Where does this state come from?</h3>
          <p className="body-100 text-foreground">
            The state model lives in{" "}
            <code className="detail-200 px-1 py-0.5 rounded bg-card">src/data/outreachStates.ts</code>{" "}
            — types <code className="detail-200">CallState</code>,{" "}
            <code className="detail-200">LinkedInState</code>, and{" "}
            <code className="detail-200">SequenceState</code>. The cards themselves live in{" "}
            <code className="detail-200 px-1 py-0.5 rounded bg-card">src/components/OutreachCards.tsx</code>{" "}
            and are consumed by both this page and the strategy page.
          </p>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default OutreachStates;
