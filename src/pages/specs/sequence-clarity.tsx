import { useState } from "react";
import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  Callout,
} from "./blocks";
import { OutreachSequenceCard } from "@/components/OutreachSequenceCard";
import SequenceRefusalBanner from "@/components/SequenceRefusalBanner";
import type { RefusalReason } from "@/components/SequenceRefusalBanner";
import { Badge } from "@/components/ui/badge";
import type { SequenceState } from "@/data/outreachStates";

/* ── Reply showcase contacts ───────────────────────────────────── */

const CONTACT_PRIYA = {
  id: "spec-reply-priya",
  name: "Priya Patel",
  initials: "PP",
  avatarColor: "bg-trellis-purple-600",
};

/* ── Reply showcase sequences ──────────────────────────────────── */

const SEQ_PRIYA: SequenceState = {
  kind: "unenrolled",
  reason: "Sequence ended because Priya replied",
  statuses: [
    {
      kind: "sent",
      sentAt: "Aug 20",
      opens: 4,
      clicks: 1,
      reply: {
        at: "Aug 20, 3:42pm",
        preview:
          "Hey — good timing actually. We've been evaluating alternatives to Salesforce since our renewal is up in Q1. Would you be free for a 20-min call Thursday afternoon?",
      },
    },
    { kind: "cancelled" },
    { kind: "cancelled" },
  ],
};

/* ── Reply showcase email templates ────────────────────────────── */

const EMAILS_PRIYA = [
  {
    subject: "CRM migration for TechFlow",
    body: "Hi Priya,\n\nI noticed TechFlow recently expanded the sales team to 40+ reps. Scaling on Salesforce at that rate usually surfaces some friction — reporting lag, rep adoption, seat costs adding up.\n\nHubSpot's Sales Hub was built for exactly this inflection point.",
  },
  {
    subject: "How teams like TechFlow are cutting CRM costs",
    body: "Hi Priya,\n\nQuick follow-up — I wanted to share how a company in TechFlow's position cut CRM costs by 40% after switching.",
  },
  {
    subject: "Worth a final look, Priya?",
    body: "Hi Priya,\n\nI know things move fast at a scaling company, so I'll keep this brief.",
  },
];

/* ── Reply showcase wrapper ────────────────────────────────────── */

const ReplyShowcase = ({
  contact,
  call,
  linkedin,
  sequence,
  emails,
  defaultExpandedIdx,
}: {
  contact: { id: string; name: string; initials: string; avatarColor: string };
  call: any;
  linkedin: any;
  sequence: SequenceState;
  emails: { subject: string; body: string }[];
  defaultExpandedIdx: number;
}) => {
  const [scriptMode, setScriptMode] = useState<"script" | "bullets">("script");
  const [expandedTouches, setExpandedTouches] = useState<
    Record<string, boolean>
  >({
    [`${contact.id}-email-${defaultExpandedIdx}`]: true,
  });

  return (
    <div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">
      <OutreachSequenceCard
        contact={contact}
        callBullets={["Mention recent activity", "HubSpot value prop"]}
        onCallBulletChange={() => {}}
        call={call}
        linkedin={linkedin}
        sequence={sequence}
        emailTemplates={emails}
        expandedTouches={expandedTouches}
        onToggleTouch={(id) =>
          setExpandedTouches((p) => ({ ...p, [id]: !p[id] }))
        }
        getCallScript={() =>
          '"Hi — I wanted to connect about how HubSpot could help your team."'
        }
        onCallScriptChange={() => {}}
        getLinkedInMessage={() =>
          '"I\'ve been following your work — would love to connect."'
        }
        onLinkedInMessageChange={() => {}}
        getEmailSubject={(idx) => emails[idx]?.subject ?? ""}
        onEmailSubjectChange={() => {}}
        getEmailBody={(idx) => emails[idx]?.body ?? ""}
        onEmailBodyChange={() => {}}
        scriptMode={scriptMode}
        onScriptModeChange={setScriptMode}
        onReplyToEmail={() => {}}
        onViewReasoning={() => {}}
        sequenceGeneratedAt="Aug 14"
        defaultCallScript=""
        defaultLinkedInMessage=""
      />
    </div>
  );
};

/* ── External sequence with real OutreachSequenceCard ───────────── */

const EXTERNAL_ENROLLED: SequenceState = {
  kind: "active",
  statuses: [
    { kind: "sent", sentAt: "Sep 1", opens: 3, clicks: 1 },
    { kind: "sent", sentAt: "Sep 3", opens: 1, clicks: 0 },
    { kind: "scheduled", sendsAt: "Mon Sep 8, 9:00am" },
  ],
};

const EXTERNAL_CONTACT = {
  id: "spec-ext",
  name: "Keisha Williams",
  initials: "KW",
  avatarColor: "bg-trellis-purple-600",
};

const EXTERNAL_EMAILS = [
  {
    subject: "Welcome to HubSpot CRM",
    body: "Hi Keisha,\n\nThanks for signing up for HubSpot CRM. Here's how to get started with your free tools.",
  },
  {
    subject: "Getting started with your free tools",
    body: "Hi Keisha,\n\nA quick guide to the tools you already have access to — and a peek at what Sales Hub Pro can do.",
  },
  {
    subject: "See what Sales Hub Pro can do",
    body: "Hi Keisha,\n\nYour free trial is ready whenever you are. Here's what teams like yours get from upgrading.",
  },
];

const ExternalSequenceShowcase = ({
  sequenceName,
}: {
  sequenceName: string;
}) => {
  const [scriptMode, setScriptMode] = useState<"script" | "bullets">("script");
  const [expandedTouches, setExpandedTouches] = useState<
    Record<string, boolean>
  >({});

  return (
    <div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">
      <OutreachSequenceCard
        contact={EXTERNAL_CONTACT}
        callBullets={[]}
        onCallBulletChange={() => {}}
        call={{ kind: "not-attempted" }}
        linkedin={{ kind: "not-sent" }}
        sequence={EXTERNAL_ENROLLED}
        emailTemplates={EXTERNAL_EMAILS}
        expandedTouches={expandedTouches}
        onToggleTouch={(id) =>
          setExpandedTouches((p) => ({ ...p, [id]: !p[id] }))
        }
        getCallScript={() => ""}
        onCallScriptChange={() => {}}
        getLinkedInMessage={() => ""}
        onLinkedInMessageChange={() => {}}
        getEmailSubject={(idx) => EXTERNAL_EMAILS[idx]?.subject ?? ""}
        onEmailSubjectChange={() => {}}
        getEmailBody={(idx) => EXTERNAL_EMAILS[idx]?.body ?? ""}
        onEmailBodyChange={() => {}}
        scriptMode={scriptMode}
        onScriptModeChange={setScriptMode}
        onViewReasoning={() => {}}
        defaultCallScript=""
        defaultLinkedInMessage=""
        externalSequenceName={sequenceName}
      />
    </div>
  );
};

/* ── Refusal reasons ───────────────────────────────────────────── */

const REFUSAL_REASONS: {
  reason: RefusalReason;
  label: string;
  description: string;
  variant: "default" | "warning" | "error";
}[] = [
  {
    reason: "duplicate",
    label: "Duplicate contact",
    description:
      "The agent detected this contact appears to be a duplicate of another CRM record.",
    variant: "warning",
  },
  {
    reason: "no-longer-at-company",
    label: "No longer at company",
    description:
      "The agent determined this contact no longer works at the associated company.",
    variant: "warning",
  },
  {
    reason: "not-real-individual",
    label: "Not a real individual",
    description:
      "The contact is a shared inbox, role-based address, or auto-generated record.",
    variant: "warning",
  },
  {
    reason: "opted-out",
    label: "Opted out",
    description:
      "The contact has explicitly opted out or requested not to be contacted again.",
    variant: "error",
  },
  {
    reason: "unenriched-shell",
    label: "Unenriched shell record",
    description:
      "The CRM record has no name or job title — the agent needs more context to generate relevant outreach.",
    variant: "warning",
  },
];

/* ── Main spec ─────────────────────────────────────────────────── */

const SequenceClaritySpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Sequence Clarity"
      description="Improve sequence usability: visible contact replies, clear status badge logic, support for external (non-agent) sequences, and handling agent refusals."
    />

    {/* ── Status badge reference ───────────────────────────────── */}

    <SpecSection
      title="Status badge reference"
      description="Four status badges indicate where a contact stands in a sequence lifecycle. Each maps to a specific scenario."
    >
      <StateCard
        label="Badge states"
        description="Reference table for all sequence status badges."
      >
        <div className="w-[700px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="heading-50 text-foreground py-2 pr-4 w-[100px]">
                  Badge
                </th>
                <th className="heading-50 text-foreground py-2 pr-4">
                  When shown
                </th>
                <th className="heading-50 text-foreground py-2">Tooltip</th>
              </tr>
            </thead>
            <tbody className="body-100">
              <tr className="border-b border-border">
                <td className="py-3 pr-4">
                  <Badge variant="status-blue">Enrolled</Badge>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  Contact is actively enrolled in the sequence. Emails are
                  sending on schedule.
                </td>
                <td className="py-3 text-muted-foreground">
                  &ldquo;Step N of 5 &middot; next sends [date]&rdquo;
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4">
                  <Badge variant="status-yellow">Paused</Badge>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  Sequence is paused — typically after a connected call. Rep can
                  unpause to resume or end the sequence.
                </td>
                <td className="py-3 text-muted-foreground">
                  &ldquo;Paused at step N of 5&rdquo; or the specific pause
                  reason
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4">
                  <Badge variant="status-green">Replied</Badge>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  Contact replied to an email in the sequence. Sequence
                  auto-unenrolled.
                </td>
                <td className="py-3 text-muted-foreground">
                  The unenroll reason (e.g. &ldquo;Priya replied to Email
                  1&rdquo;)
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4">
                  <Badge variant="status-orange">Unenrolled</Badge>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  The rep manually unenrolled the contact before the sequence
                  finished.
                </td>
                <td className="py-3 text-muted-foreground">
                  &ldquo;Manually unenrolled at step N of 5&rdquo;
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <Badge variant="status-gray">Ended</Badge>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  All touches in the sequence have been sent without a reply or
                  positive engagement signal.
                </td>
                <td className="py-3 text-muted-foreground">
                  &ldquo;All 5 touches sent&rdquo;
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </StateCard>

      <Callout type="behavior">
        A connected call triggers Paused, not Replied — even though it&rsquo;s a
        positive signal. This lets the rep decide whether to continue the email
        sequence after the call or end it.
      </Callout>
    </SpecSection>

    {/* ── Reply visibility ─────────────────────────────────────── */}

    <SpecSection
      title="Reply visibility"
      description="When a contact replies to a sequence email, the reply appears inline under the sent email step. The sequence shows a green &lsquo;Replied&rsquo; badge and auto-unenrolls. Three scenarios below show different reply tones reps will encounter."
    >
      <StateCard
        label="Interested reply — first email"
        description="Contact replies positively to the first email. Remaining emails are cancelled. The reply text is visible inside the expanded email step."
        variant="success"
      >
        <ReplyShowcase
          contact={CONTACT_PRIYA}
          call={{ kind: "not-attempted" }}
          linkedin={{ kind: "not-sent" }}
          sequence={SEQ_PRIYA}
          emails={EMAILS_PRIYA}
          defaultExpandedIdx={0}
        />
      </StateCard>

    </SpecSection>

    {/* ── External sequences ───────────────────────────────────── */}

    <SpecSection
      title="External sequences"
      description="A contact may be enrolled in a sequence that wasn't created by the sequencing agent — for example, a marketing nurture or a manually created sales sequence. These display differently: the sequence name replaces &lsquo;5-touch sequence&rsquo; as the heading, and the agent attribution line is removed entirely."
    >
      <StateCard
        label="Marketing sequence (live component)"
        description="A real OutreachSequenceCard with the externalSequenceName prop set. The heading shows the sequence name. No agent attribution or reasoning link."
      >
        <ExternalSequenceShowcase sequenceName="MKTG | RLDP | BoB | NAM (en) | NB | SB | GS | P1 | Non-QL | CRM Signup" />
      </StateCard>

      <StateCard
        label="Personal sequence (live component)"
        description="A simple sequence with a human-readable name. Same layout, shorter heading."
      >
        <ExternalSequenceShowcase sequenceName="Missed Meeting - Liam Gately" />
      </StateCard>

    </SpecSection>

    {/* ── Agent refusal ────────────────────────────────────────── */}

    <SpecSection
      title="Sequence not generated"
      description="The sequencing agent may decide not to generate a sequence for a contact. When this happens, a warning banner replaces the entire sequence card. The &lsquo;View reasoning&rsquo; link opens the same side panel used for successful sequences, showing the agent&rsquo;s decision rationale."
    >
      {REFUSAL_REASONS.map((r) => (
        <StateCard
          key={r.reason}
          label={r.label}
          description={r.description}
          variant={r.variant}
        >
          <div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">
            <SequenceRefusalBanner
              reason={r.reason}
              onViewReasoning={() => {}}
            />
          </div>
        </StateCard>
      ))}

      <Callout type="behavior">
        The &ldquo;View reasoning&rdquo; link in the banner opens the same
        reasoning side panel used for successful sequences. The panel shows the
        agent&rsquo;s research and decision process — why it concluded the
        contact shouldn&rsquo;t receive a sequence.
      </Callout>
    </SpecSection>
  </SpecLayout>
);

export default SequenceClaritySpec;
