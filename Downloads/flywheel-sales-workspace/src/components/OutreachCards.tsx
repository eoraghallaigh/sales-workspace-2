import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import type {
  CallState,
  EmailStatus,
  LinkedInState,
  SequenceState,
} from "@/data/outreachStates";

const POS_DOT = "bg-[var(--color-fill-accent-green-default)]";
const MUTED_DOT = "bg-muted-foreground";
const POSITIVE_AVATAR = "bg-[var(--color-fill-positive-default)] text-white";
const PASSIVE_AVATAR =
  "bg-[var(--color-fill-surface-recessed)] text-foreground border border-core-subtle";

const renderCallChip = (s: CallState, firstName: string) => {
  switch (s.kind) {
    case "not-attempted":
      return (
        <Button variant="primary" size="extra-small">
          <TrellisIcon name="calling" size={12} className="mr-1 brightness-0 invert" /> Call {firstName}
        </Button>
      );
    case "no-answer":
      return (
        <div className="flex items-center gap-3">
          <span className="detail-200 text-muted-foreground">
            No answer · {s.attempts} attempts · {s.lastAttemptAt}
          </span>
          <Button variant="secondary" size="extra-small">
            <TrellisIcon name="calling" size={12} className="mr-1" /> Try again
          </Button>
        </div>
      );
    case "voicemail":
      return (
        <div className="flex items-center gap-3">
          <span className="detail-200 text-muted-foreground">Voicemail left · {s.lastAttemptAt}</span>
          <Button variant="secondary" size="extra-small">
            <TrellisIcon name="calling" size={12} className="mr-1" /> Try again
          </Button>
        </div>
      );
    case "connected":
      return (
        <div className="flex items-center gap-2 detail-200 text-muted-foreground">
          <div className={`h-2.5 w-2.5 rounded-full ${POS_DOT}`} />
          Connected · {s.durationMin}m · {s.at}
        </div>
      );
  }
};

const renderLiChip = (s: LinkedInState) => {
  switch (s.kind) {
    case "not-sent":
      return (
        <Button variant="primary" size="extra-small">
          <TrellisIcon name="linkedin" size={12} className="mr-1 brightness-0 invert" /> Send request
        </Button>
      );
    case "pending":
      return (
        <span className="detail-200 text-muted-foreground">
          Request sent · {s.sentAt} · awaiting response
        </span>
      );
    case "accepted":
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 detail-200 text-muted-foreground">
            <div className={`h-2.5 w-2.5 rounded-full ${POS_DOT}`} />
            Connected · {s.acceptedAt}
          </div>
          <Button variant="secondary" size="extra-small">
            <TrellisIcon name="linkedin" size={12} className="mr-1" /> Send InMail
          </Button>
        </div>
      );
    case "declined":
      return <span className="detail-200 text-muted-foreground">No response · consider another channel</span>;
    case "already-connected":
      return <span className="detail-200 text-muted-foreground">Already a 1st-degree connection</span>;
  }
};

const renderSeqChip = (s: SequenceState, firstName: string) => {
  switch (s.kind) {
    case "not-enrolled":
      return (
        <Button variant="primary" size="extra-small">
          <TrellisIcon name="email" size={12} className="mr-1 brightness-0 invert" /> Enroll {firstName}
        </Button>
      );
    case "active": {
      const sentCount = s.statuses.filter((x) => x.kind === "sent").length;
      const nextScheduled = s.statuses.find((x) => x.kind === "scheduled");
      return (
        <div className="flex items-center gap-3">
          <span className="detail-200 text-muted-foreground">
            Step {sentCount} of 3
            {nextScheduled && nextScheduled.kind === "scheduled"
              ? ` · next sends ${nextScheduled.sendsAt}`
              : ""}
          </span>
          <Button variant="secondary" size="extra-small">Unenroll</Button>
        </div>
      );
    }
    case "completed":
      return <span className="detail-200 text-muted-foreground">Completed · all 3 sent</span>;
    case "unenrolled":
      return (
        <span className="detail-200" style={{ color: "var(--color-border-accent-green-default)" }}>
          {s.reason}
        </span>
      );
  }
};

const renderEmailMeta = (status: EmailStatus) => {
  if (status.kind === "scheduled") {
    return (
      <span className="detail-200 text-muted-foreground flex items-center gap-1.5">
        <TrellisIcon name="clock" size={12} className="text-muted-foreground" />
        Sends {status.sendsAt}
      </span>
    );
  }
  if (status.kind === "sent") {
    const engaged = status.opens > 0;
    return (
      <div className="flex items-center gap-2 detail-200 text-muted-foreground">
        <div className={`h-2 w-2 rounded-full ${engaged ? POS_DOT : MUTED_DOT}`} />
        <span>
          Sent {status.sentAt} · Opens {status.opens} · Clicks {status.clicks}
        </span>
      </div>
    );
  }
  return <span className="detail-200 text-muted-foreground">Cancelled</span>;
};

// ─── Call card ────────────────────────────────────────────────────────────

export type CallCardProps = {
  state: CallState;
  contactName: string;
  companyName: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  scriptValue: string;
  onScriptChange: (value: string) => void;
  scriptMode: "script" | "bullets";
  onScriptModeChange: (mode: "script" | "bullets") => void;
};

export const CallCard = ({
  state,
  contactName,
  companyName,
  isExpanded,
  onToggleExpanded,
  scriptValue,
  onScriptChange,
  scriptMode,
  onScriptModeChange,
}: CallCardProps) => {
  const firstName = contactName.split(" ")[0];
  const positive = state.kind !== "not-attempted";
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className={positive ? POSITIVE_AVATAR : PASSIVE_AVATAR}>
          {positive ? (
            <TrellisIcon name="success" size={16} className="brightness-0 invert" />
          ) : (
            <TrellisIcon name="calling" size={16} />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 rounded-100 border border-core-subtle overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <CollapsibleTrigger className="flex items-center gap-2">
              <TrellisIcon
                name="downCarat"
                size={12}
                className={`text-muted-foreground transition-transform ${isExpanded ? "" : "-rotate-90"}`}
              />
              <span className="heading-50 text-foreground">Call</span>
            </CollapsibleTrigger>
            <div className="flex-1" />
            <div>{renderCallChip(state, firstName)}</div>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            {state.kind !== "not-attempted" ? (
              <p className="body-100 text-muted-foreground leading-relaxed ml-5 whitespace-pre-line">
                {scriptValue}
              </p>
            ) : scriptMode === "script" ? (
              <textarea
                className="body-100 text-foreground leading-relaxed ml-5 w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                style={{ fieldSizing: "content" } as React.CSSProperties}
                value={scriptValue}
                onChange={(e) => onScriptChange(e.target.value)}
                rows={2}
              />
            ) : (
              <ul className="ml-5 list-disc pl-4 space-y-1.5">
                <li className="body-100 text-foreground leading-relaxed">
                  {companyName} partnered with Orbweaver to automate data exchange for manufacturers
                </li>
                <li className="body-100 text-foreground leading-relaxed">
                  Automated data often leads to fragmented "Franken-stacks" — reps can't find a single source of truth
                </li>
                <li className="body-100 text-foreground leading-relaxed">
                  HubSpot Sales Hub consolidates data streams into one view
                </li>
                <li className="body-100 text-foreground leading-relaxed">
                  Breeze AI automates prospecting so team stays focused on closing
                </li>
              </ul>
            )}
            {state.kind === "not-attempted" && (
              <div className="flex items-center gap-2 justify-end mt-2">
                <span className="detail-200 text-muted-foreground">Bullet points</span>
                <Switch
                  className="h-4 w-7 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
                  checked={scriptMode === "bullets"}
                  onCheckedChange={(checked) => onScriptModeChange(checked ? "bullets" : "script")}
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

// ─── LinkedIn card ────────────────────────────────────────────────────────

export type LinkedInCardProps = {
  state: LinkedInState;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  messageValue: string;
  onMessageChange: (value: string) => void;
};

export const LinkedInCard = ({
  state,
  isExpanded,
  onToggleExpanded,
  messageValue,
  onMessageChange,
}: LinkedInCardProps) => {
  const positive = state.kind !== "not-sent";
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className={positive ? POSITIVE_AVATAR : PASSIVE_AVATAR}>
          {positive ? (
            <TrellisIcon name="success" size={16} className="brightness-0 invert" />
          ) : (
            <TrellisIcon name="linkedin" size={16} />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 rounded-100 border border-core-subtle overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <CollapsibleTrigger className="flex items-center gap-2">
              <TrellisIcon
                name="downCarat"
                size={12}
                className={`text-muted-foreground transition-transform ${isExpanded ? "" : "-rotate-90"}`}
              />
              <span className="heading-50 text-foreground">LinkedIn Connection Request</span>
            </CollapsibleTrigger>
            <div className="flex-1" />
            <div>{renderLiChip(state)}</div>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            {state.kind !== "not-sent" ? (
              <p className="body-100 text-muted-foreground leading-relaxed ml-5 whitespace-pre-line">
                {messageValue}
              </p>
            ) : (
              <textarea
                className="body-100 text-foreground leading-relaxed ml-5 w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                style={{ fieldSizing: "content" } as React.CSSProperties}
                value={messageValue}
                onChange={(e) => onMessageChange(e.target.value)}
                rows={2}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

// ─── Email sequence card ──────────────────────────────────────────────────

export type EmailSequenceCardProps = {
  state: SequenceState;
  contact: { id: string; name: string; initials: string; avatarColor: string };
  isExpanded: boolean;
  onToggleExpanded: () => void;
  emails: Array<{ subject: string; body: string }>;
  expandedEmails: Record<number, boolean>;
  onToggleEmail: (index: number) => void;
  getSubjectValue: (index: number) => string;
  onSubjectChange: (index: number, value: string) => void;
  getBodyValue: (index: number) => string;
  onBodyChange: (index: number, value: string) => void;
  onReply?: (index: number) => void;
};

export const EmailSequenceCard = ({
  state,
  contact,
  isExpanded,
  onToggleExpanded,
  emails,
  expandedEmails,
  onToggleEmail,
  getSubjectValue,
  onSubjectChange,
  getBodyValue,
  onBodyChange,
  onReply,
}: EmailSequenceCardProps) => {
  const firstName = contact.name.split(" ")[0];
  const isEnrolled = state.kind !== "not-enrolled";
  const positive = isEnrolled;
  const statuses: EmailStatus[] | null =
    state.kind === "active" || state.kind === "completed" || state.kind === "unenrolled"
      ? state.statuses
      : null;

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className={positive ? POSITIVE_AVATAR : PASSIVE_AVATAR}>
          {positive ? (
            <TrellisIcon name="success" size={16} className="brightness-0 invert" />
          ) : (
            <TrellisIcon name="email" size={16} />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 rounded-100 border border-core-subtle overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <CollapsibleTrigger className="flex items-center gap-2">
              <TrellisIcon
                name="downCarat"
                size={12}
                className={`text-muted-foreground transition-transform ${isExpanded ? "" : "-rotate-90"}`}
              />
              <span className="heading-50 text-foreground">3 Email sequence</span>
            </CollapsibleTrigger>
            <div className="flex-1" />
            <div>{renderSeqChip(state, firstName)}</div>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="ml-5 divide-y divide-border-core-subtle">
              {emails.map((email, idx) => {
                const status: EmailStatus = statuses
                  ? statuses[idx]
                  : { kind: "scheduled", sendsAt: "when enrolled" };
                const cancelled = status.kind === "cancelled";
                const reply = status.kind === "sent" ? status.reply : undefined;
                const open = expandedEmails[idx] ?? Boolean(reply);
                return (
                  <Collapsible key={idx} open={open} onOpenChange={() => onToggleEmail(idx)}>
                    <CollapsibleTrigger asChild>
                      <div className="w-full py-3 cursor-pointer text-left">
                        <div className="flex items-center gap-2">
                          <TrellisIcon
                            name="downCarat"
                            size={12}
                            className={`text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`}
                          />
                          <span className="heading-50 text-foreground shrink-0">Subject:</span>
                          <input
                            type="text"
                            className={`body-100 flex-1 min-w-0 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text ${cancelled ? "text-muted-foreground line-through" : "text-foreground"}`}
                            value={getSubjectValue(idx)}
                            onChange={(e) => onSubjectChange(idx, e.target.value)}
                            readOnly={isEnrolled}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="ml-5 mt-2">{renderEmailMeta(status)}</div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-5 pb-4 pt-1">
                      {isEnrolled ? (
                        <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                          {getBodyValue(idx)}
                        </p>
                      ) : (
                        <textarea
                          className="body-100 text-foreground leading-relaxed whitespace-pre-line w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                          style={{ fieldSizing: "content" } as React.CSSProperties}
                          value={getBodyValue(idx)}
                          onChange={(e) => onBodyChange(idx, e.target.value)}
                          rows={2}
                        />
                      )}
                      {reply && (
                        <div className="mt-5">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className={contact.avatarColor + " text-white detail-100"}>
                                {contact.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="heading-50 text-foreground">{contact.name} replied</span>
                            <span className="detail-200 text-muted-foreground">· {reply.at}</span>
                            {onReply && (
                              <Button
                                variant="secondary"
                                size="extra-small"
                                className="ml-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReply(idx);
                                }}
                              >
                                <TrellisIcon name="email" size={12} className="mr-1" /> Reply
                              </Button>
                            )}
                          </div>
                          <p className="body-100 text-foreground whitespace-pre-line">{reply.preview}</p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
