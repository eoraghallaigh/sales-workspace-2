import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  Callout,
  CodeRef,
} from "./blocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Tag from "@/components/Tag";
import { getSubtleAvatarStyles } from "@/components/ContactOutreachAvatars";
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

const WorkingHighVolumeSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Working High Volume Efficiently"
      description="Two features that help reps manage large books: a &ldquo;Recently Generated&rdquo; view to find companies whose strategies the agent has finished, and a simplified &ldquo;Sequence Summary&rdquo; column that rolls per-channel outreach status into a single workflow position per contact."
    />

    <img
      src={overviewScreenshot}
      alt="Recently Generated view showing the prospecting table with sub-nav counts"
      className="rounded-200 border border-core-subtle mb-10 w-full"
    />

    {/* ── Feature 1: Recently Generated view ────────────────────── */}

    <SpecSection
      title="Recently Generated view"
      description="Strategy generation takes a long time. Reps click &ldquo;Generate strategy&rdquo; on several companies then move on to other work. When they return, they need to find which companies have finished strategies without clicking into each one. This view surfaces all companies whose strategy was generated in the last 24 hours."
    >
      <Callout type="info">
        Addresses feedback from reps that the agent &ldquo;works too slowly to sit and wait&rdquo; — this view closes the loop by letting them batch-generate, leave, and come back to a ready list.
      </Callout>
    </SpecSection>

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
                <td className="py-2 text-muted-foreground">All companies where <CodeRef>hasGeneratedStrategy !== false</CodeRef></td>
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

    {/* ── Feature 2: Sequence Summary column ─────────────────────── */}

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
