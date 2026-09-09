import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RecommendedContact } from "@/components/CompanyCard";
import { getOutreachState } from "@/data/outreachStates";
import Tag from "@/components/Tag";
import { SIGNAL_CATALOG } from "@/data/signals";

export const getSubtleAvatarStyles = (
  avatarColor: string,
): { background: string; color: string } => {
  const mapping: Record<string, { background: string; color: string }> = {
    "bg-trellis-purple-600": {
      background: "var(--color-fill-accent-purple-subtle-alt, #F4EDF6)",
      color: "var(--color-border-accent-purple-default, #7C3AED)",
    },
    "bg-trellis-blue-600": {
      background: "var(--color-fill-accent-blue-subtle-alt, #EAF1FB)",
      color: "var(--color-border-accent-blue-default, #2563EB)",
    },
    "bg-trellis-green-600": {
      background: "var(--color-fill-accent-green-subtle-alt, #EDF4EF)",
      color: "var(--color-border-accent-green-default, #00823A)",
    },
    "bg-trellis-orange-600": {
      background: "var(--color-fill-brand-subtle, #FDEFE9)",
      color: "var(--color-border-brand-default, #C93700)",
    },
    "bg-trellis-yellow-600": {
      background: "var(--color-fill-caution-subtle, #FEF5DA)",
      color: "var(--color-border-caution-default, #A17D00)",
    },
    "bg-trellis-teal-600": {
      background: "var(--color-fill-accent-teal-subtle-alt, #E5F2F4)",
      color: "var(--color-border-accent-teal-default, #007A87)",
    },
    "bg-trellis-pink-600": {
      background: "var(--color-fill-accent-pink-subtle-alt, #FBEAF1)",
      color: "var(--color-border-accent-pink-default, #C2185B)",
    },
  };
  return (
    mapping[avatarColor] ?? {
      background: "var(--color-fill-accent-blue-subtle-alt, #EAF1FB)",
      color: "var(--color-border-accent-blue-default, #2563EB)",
    }
  );
};

interface ContactOutreachAvatarsProps {
  contacts: RecommendedContact[];
  maxAvatars?: number;
  align?: "start" | "center" | "end";
  /** Stop click propagation on the trigger (use when nested in a clickable row/card) */
  stopPropagation?: boolean;
}

const ContactOutreachAvatars = ({
  contacts,
  maxAvatars = 3,
  align = "end",
  stopPropagation = true,
}: ContactOutreachAvatarsProps) => {
  if (contacts.length === 0) {
    return <span className="body-100 text-muted-foreground">—</span>;
  }

  const displayedContacts = contacts.slice(0, maxAvatars);
  const extraCount = Math.max(0, contacts.length - maxAvatars);
  const targets = contacts.slice(0, maxAvatars);

  type Tone = "positive" | "awaiting" | "none";
  const POS = "var(--color-fill-accent-green-default)";
  const AWAIT = "var(--color-fill-accent-green-subtle)";
  const NONE = "var(--color-fill-surface-recessed)";
  const dotFor = (t: Tone) => (t === "positive" ? POS : t === "awaiting" ? AWAIT : NONE);

  const workflowStatus = (c: RecommendedContact): { status: string; tone: Tone } => {
    const firstName = c.name.split(" ")[0];
    const s = getOutreachState(c.id, firstName);

    if (s.sequence.kind === "unenrolled") {
      const reason = s.sequence.reason;
      if (reason.includes("replied")) return { status: "Replied", tone: "positive" };
      if (reason.includes("call")) return { status: "Connected call logged", tone: "positive" };
      if (reason.includes("LinkedIn")) return { status: "LinkedIn message logged", tone: "positive" };
      return { status: "Sequence ended", tone: "none" };
    }
    if (s.call.kind === "connected") return { status: "Connected call logged", tone: "positive" };
    if (s.sequence.kind === "completed") return { status: "Sequence ended", tone: "none" };
    if (s.sequence.kind === "active") return { status: "Enrolled, awaiting response", tone: "awaiting" };
    if (c.outreachStrategyCreated) return { status: "Sequence generated, not enrolled", tone: "none" };
    return { status: "No sequence generated", tone: "none" };
  };

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <div
          className="flex items-center gap-2 flex-shrink-0 rounded px-1 -mx-1 w-fit"
          onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
        >
          <div className="flex -space-x-2">
            {displayedContacts.map((contact) => {
              const subtle = getSubtleAvatarStyles(contact.avatarColor);
              return (
                <Avatar
                  key={contact.id}
                  className="h-7 w-7 border-2 border-card"
                  style={{ background: subtle.background }}
                >
                  <AvatarFallback
                    className="text-xs font-medium"
                    style={{ background: subtle.background, color: subtle.color }}
                  >
                    {contact.initials}
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>
          {extraCount > 0 && (
            <span className="detail-200 text-muted-foreground">+{extraCount}</span>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent align={align} className="w-[340px] p-4">
        <div className="flex flex-col gap-4">
          <div className="detail-200 font-semibold text-muted-foreground uppercase tracking-wide">
            Outreach summary
          </div>
          {targets.map((c) => {
            const subtle = getSubtleAvatarStyles(c.avatarColor);
            const ws = workflowStatus(c);
            return (
              <div key={c.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5 flex-shrink-0">
                    <AvatarFallback
                      className="text-[10px] font-medium"
                      style={{ background: subtle.background, color: subtle.color }}
                    >
                      {c.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="heading-50 text-foreground">{c.name}</span>
                  <span className="detail-200 text-muted-foreground truncate">
                    · {c.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <div
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: dotFor(ws.tone) }}
                  />
                  <span className={`detail-200 truncate ${ws.tone === "none" ? "text-muted-foreground" : "text-foreground"}`}>
                    {ws.status}
                  </span>
                </div>
                {c.signals.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pl-7 pt-0.5">
                    {c.signals.slice(0, 3).map((s, i) => {
                      const def = SIGNAL_CATALOG[s.id];
                      if (!def) return null;
                      return (
                        <span key={`${s.id}-${i}`} className="inline-flex">
                          <Tag variant={def.variant}>{def.label}</Tag>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ContactOutreachAvatars;
