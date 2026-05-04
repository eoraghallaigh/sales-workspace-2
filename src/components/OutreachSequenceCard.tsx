import { useState } from "react";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import type { CallState, LinkedInState, EmailStatus, SequenceState } from "@/data/outreachStates";

const POS_DOT = "bg-[var(--color-fill-accent-green-default)]";
const MUTED_DOT = "bg-muted-foreground";

export type CallTouch = {
  id: string;
  kind: "call";
  state: CallState;
  script: string;
};
export type LinkedInTouch = {
  id: string;
  kind: "linkedin";
  state: LinkedInState;
  message: string;
};
export type EmailTouch = {
  id: string;
  kind: "email";
  status: EmailStatus;
  subject: string;
  body: string;
  emailIndex: number;
};
export type Touch = CallTouch | LinkedInTouch | EmailTouch;

const touchLabel = (t: Touch): string => {
  if (t.kind === "call") return "Call task";
  if (t.kind === "linkedin") return "LinkedIn message task";
  return "Email";
};

const touchIcon = (t: Touch) => {
  if (t.kind === "call") return "calling";
  if (t.kind === "linkedin") return "linkedin";
  return "email";
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

const renderCallMeta = (s: CallState, isEnrolled: boolean) => {
  if (s.kind === "not-attempted") {
    return (
      <span className="detail-200 text-muted-foreground flex items-center gap-1.5">
        <TrellisIcon name="clock" size={12} className="text-muted-foreground" />
        {isEnrolled ? "Task created when enrolled" : "Task created on enrollment"}
      </span>
    );
  }
  if (s.kind === "no-answer") {
    return (
      <span className="detail-200 text-muted-foreground">
        No answer · {s.attempts} attempts · {s.lastAttemptAt}
      </span>
    );
  }
  if (s.kind === "voicemail") {
    return <span className="detail-200 text-muted-foreground">Voicemail left · {s.lastAttemptAt}</span>;
  }
  return (
    <div className="flex items-center gap-2 detail-200 text-muted-foreground">
      <div className={`h-2 w-2 rounded-full ${POS_DOT}`} />
      Connected · {s.durationMin}m · {s.at}
    </div>
  );
};

const renderLinkedInMeta = (s: LinkedInState, isEnrolled: boolean) => {
  if (s.kind === "not-sent") {
    return (
      <span className="detail-200 text-muted-foreground flex items-center gap-1.5">
        <TrellisIcon name="clock" size={12} className="text-muted-foreground" />
        {isEnrolled ? "Task created when enrolled" : "Task created on enrollment"}
      </span>
    );
  }
  if (s.kind === "pending") {
    return (
      <span className="detail-200 text-muted-foreground">
        Request sent · {s.sentAt} · awaiting response
      </span>
    );
  }
  if (s.kind === "accepted") {
    return (
      <div className="flex items-center gap-2 detail-200 text-muted-foreground">
        <div className={`h-2 w-2 rounded-full ${POS_DOT}`} />
        Connected · {s.acceptedAt}
      </div>
    );
  }
  if (s.kind === "declined") {
    return <span className="detail-200 text-muted-foreground">No response · consider another channel</span>;
  }
  return <span className="detail-200 text-muted-foreground">Already a 1st-degree connection</span>;
};

const renderTouchMeta = (t: Touch, isEnrolled: boolean) => {
  if (t.kind === "email") return renderEmailMeta(t.status);
  if (t.kind === "call") return renderCallMeta(t.state, isEnrolled);
  return renderLinkedInMeta(t.state, isEnrolled);
};

const isPristine = (call: CallState, linkedin: LinkedInState, sequence: SequenceState) =>
  call.kind === "not-attempted" &&
  linkedin.kind === "not-sent" &&
  sequence.kind === "not-enrolled";

const isTouchCompleted = (t: Touch): boolean => {
  if (t.kind === "email") return t.status.kind === "sent";
  if (t.kind === "call") return t.state.kind !== "not-attempted";
  return t.state.kind !== "not-sent";
};

const EnrolledBadge = () => <Badge variant="status-green">Enrolled</Badge>;

export const getDefaultCallBullets = (companyName: string): string[] => [
  `${companyName} partnered with Orbweaver to automate data exchange for manufacturers`,
  `Automated data often leads to fragmented "Franken-stacks" — reps can't find a single source of truth`,
  "HubSpot Sales Hub consolidates data streams into one view",
  "Breeze AI automates prospecting so team stays focused on closing",
];

type ScriptMode = "script" | "bullets";

const ScriptModeToggle = ({
  mode,
  onChange,
}: {
  mode: ScriptMode;
  onChange: (mode: ScriptMode) => void;
}) => (
  <div className="flex items-center gap-2 justify-end mt-2">
    <span className="detail-200 text-muted-foreground">Bullet points</span>
    <Switch
      className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
      checked={mode === "bullets"}
      onCheckedChange={(checked) => onChange(checked ? "bullets" : "script")}
    />
  </div>
);

const seqHeaderChip = (
  isEnrolled: boolean,
  enrolledLocally: boolean,
  sequence: SequenceState,
  firstName: string,
  onEnroll: () => void,
  onUnenroll: () => void,
) => {
  if (!isEnrolled) {
    return (
      <Button variant="primary" size="extra-small" onClick={onEnroll}>
        <TrellisIcon name="email" size={12} className="mr-1 brightness-0 invert" /> Enroll {firstName}
      </Button>
    );
  }
  if (enrolledLocally) {
    return (
      <div className="flex items-center gap-3">
        <EnrolledBadge />
        <span className="detail-200 text-muted-foreground">Step 1 of 5 · scheduled</span>
        <Button variant="secondary" size="extra-small" onClick={onUnenroll}>
          Unenroll
        </Button>
      </div>
    );
  }
  if (sequence.kind === "active") {
    const sentCount = sequence.statuses.filter((x) => x.kind === "sent").length;
    const next = sequence.statuses.find((x) => x.kind === "scheduled");
    return (
      <div className="flex items-center gap-3">
        <EnrolledBadge />
        <span className="detail-200 text-muted-foreground">
          Step {sentCount} of 5{next && next.kind === "scheduled" ? ` · next sends ${next.sendsAt}` : ""}
        </span>
        <Button variant="secondary" size="extra-small">
          Unenroll
        </Button>
      </div>
    );
  }
  if (sequence.kind === "completed") {
    return <span className="detail-200 text-muted-foreground">Completed · all touches sent</span>;
  }
  if (sequence.kind === "unenrolled") {
    return (
      <span className="detail-200" style={{ color: "var(--color-border-accent-green-default)" }}>
        {sequence.reason}
      </span>
    );
  }
  return null;
};

type SortableRowProps = {
  touch: Touch;
  isFirst: boolean;
  isLast: boolean;
  draggable: boolean;
  isEnrolled: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onScriptChange?: (v: string) => void;
  onMessageChange?: (v: string) => void;
  onSubjectChange?: (v: string) => void;
  onBodyChange?: (v: string) => void;
  contact: { name: string; initials: string; avatarColor: string };
  callBullets: string[];
  onCallBulletChange: (idx: number, value: string) => void;
  scriptMode: ScriptMode;
  onScriptModeChange: (mode: ScriptMode) => void;
  onReply?: () => void;
};

const SortableRow = ({
  touch,
  isFirst,
  isLast,
  draggable,
  isEnrolled,
  isExpanded,
  onToggle,
  onScriptChange,
  onMessageChange,
  onSubjectChange,
  onBodyChange,
  contact,
  callBullets,
  onCallBulletChange,
  scriptMode,
  onScriptModeChange,
  onReply,
}: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: touch.id,
    disabled: !draggable,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const reply =
    touch.kind === "email" && touch.status.kind === "sent" ? touch.status.reply : undefined;

  const editable = !isEnrolled;
  const completed = isTouchCompleted(touch);

  const headingInner = (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="heading-50 text-foreground">{touchLabel(touch)}</span>
        {touch.kind === "email" && (
          <input
            type="text"
            className={`body-100 flex-1 min-w-0 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text ${
              touch.status.kind === "cancelled"
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
            value={touch.subject}
            onChange={(e) => onSubjectChange?.(e.target.value)}
            readOnly={!editable}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )}
        <TrellisIcon
          name="downCarat"
          size={12}
          className={`ml-auto text-muted-foreground transition-transform ${
            isExpanded ? "" : "-rotate-90"
          }`}
        />
      </div>
      <div className="mt-1">{renderTouchMeta(touch, isEnrolled)}</div>
    </div>
  );

  if (!isEnrolled) {
    return (
      <div ref={setNodeRef} style={style} className="py-3">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <div className="flex items-start gap-2 cursor-pointer text-left">
              {draggable ? (
                <button
                  type="button"
                  className="mt-0.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                  {...attributes}
                  {...listeners}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Reorder touch"
                >
                  <GripVertical size={14} />
                </button>
              ) : (
                <span className="w-[14px]" />
              )}
              <TrellisIcon
                name={touchIcon(touch)}
                size={14}
                className="text-muted-foreground mt-0.5"
              />
              {headingInner}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-7 pt-2 pb-1">
            {touch.kind === "call" &&
              (editable ? (
                <>
                  {scriptMode === "script" ? (
                    <textarea
                      className="body-100 text-foreground leading-relaxed w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                      style={{ fieldSizing: "content" } as React.CSSProperties}
                      value={touch.script}
                      onChange={(e) => onScriptChange?.(e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <ul className="list-disc pl-4 space-y-1.5">
                      {callBullets.map((b, i) => (
                        <li key={i} className="body-100 text-foreground leading-relaxed">
                          <textarea
                            className="body-100 text-foreground leading-relaxed w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                            style={{ fieldSizing: "content" } as React.CSSProperties}
                            value={b}
                            onChange={(e) => onCallBulletChange(i, e.target.value)}
                            rows={1}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  <ScriptModeToggle mode={scriptMode} onChange={onScriptModeChange} />
                </>
              ) : (
                <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {touch.script}
                </p>
              ))}
            {touch.kind === "linkedin" &&
              (editable ? (
                <textarea
                  className="body-100 text-foreground leading-relaxed w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                  style={{ fieldSizing: "content" } as React.CSSProperties}
                  value={touch.message}
                  onChange={(e) => onMessageChange?.(e.target.value)}
                  rows={2}
                />
              ) : (
                <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {touch.message}
                </p>
              ))}
            {touch.kind === "email" &&
              (editable ? (
                <textarea
                  className="body-100 text-foreground leading-relaxed whitespace-pre-line w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                  style={{ fieldSizing: "content" } as React.CSSProperties}
                  value={touch.body}
                  onChange={(e) => onBodyChange?.(e.target.value)}
                  rows={2}
                />
              ) : (
                <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {touch.body}
                </p>
              ))}
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
                        onReply();
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
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="relative flex gap-3">
      {draggable ? (
        <button
          type="button"
          className="self-start mt-[18px] text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Reorder touch"
        >
          <GripVertical size={14} />
        </button>
      ) : (
        <span className="w-[14px] shrink-0" />
      )}

      <div className="relative w-7 shrink-0 self-stretch">
        <span
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 w-px bg-[var(--color-border-core-subtle)]"
          style={
            isLast
              ? { top: isFirst ? 26 : 0, height: isFirst ? 0 : 26 }
              : { top: isFirst ? 26 : 0, bottom: 0 }
          }
        />
        <div
          className={`absolute left-0 top-3 h-7 w-7 rounded-full flex items-center justify-center ${
            completed
              ? ""
              : "bg-[var(--color-fill-surface-default)] border border-[var(--color-border-core-subtle)]"
          }`}
          style={completed ? { backgroundColor: "#00823A" } : undefined}
        >
          {completed ? (
            <TrellisIcon name="success" size={14} className="brightness-0 invert" />
          ) : (
            <TrellisIcon name={touchIcon(touch)} size={14} className="text-foreground" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 py-3">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="flex items-start gap-2 cursor-pointer text-left">
            {headingInner}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-1">
          {touch.kind === "call" &&
            (editable ? (
              <textarea
                className="body-100 text-foreground leading-relaxed w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                style={{ fieldSizing: "content" } as React.CSSProperties}
                value={touch.script}
                onChange={(e) => onScriptChange?.(e.target.value)}
                rows={2}
              />
            ) : (
              <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                {touch.script}
              </p>
            ))}
          {touch.kind === "linkedin" &&
            (editable ? (
              <textarea
                className="body-100 text-foreground leading-relaxed w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                style={{ fieldSizing: "content" } as React.CSSProperties}
                value={touch.message}
                onChange={(e) => onMessageChange?.(e.target.value)}
                rows={2}
              />
            ) : (
              <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                {touch.message}
              </p>
            ))}
          {touch.kind === "email" &&
            (editable ? (
              <textarea
                className="body-100 text-foreground leading-relaxed whitespace-pre-line w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                style={{ fieldSizing: "content" } as React.CSSProperties}
                value={touch.body}
                onChange={(e) => onBodyChange?.(e.target.value)}
                rows={2}
              />
            ) : (
              <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                {touch.body}
              </p>
            ))}
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
                      onReply();
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
      </div>
    </div>
  );
};

export type OutreachSequenceCardProps = {
  contact: { id: string; name: string; initials: string; avatarColor: string };
  callBullets: string[];
  onCallBulletChange: (idx: number, value: string) => void;
  call: CallState;
  linkedin: LinkedInState;
  sequence: SequenceState;
  defaultCallScript: string;
  defaultLinkedInMessage: string;
  emailTemplates: Array<{ subject: string; body: string }>;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  expandedTouches: Record<string, boolean>;
  onToggleTouch: (id: string) => void;
  getCallScript: () => string;
  onCallScriptChange: (v: string) => void;
  getLinkedInMessage: () => string;
  onLinkedInMessageChange: (v: string) => void;
  getEmailSubject: (idx: number) => string;
  onEmailSubjectChange: (idx: number, v: string) => void;
  getEmailBody: (idx: number) => string;
  onEmailBodyChange: (idx: number, v: string) => void;
  scriptMode: ScriptMode;
  onScriptModeChange: (mode: ScriptMode) => void;
  onReplyToEmail?: (idx: number) => void;
};

const buildDefaultOrder = (contactId: string): string[] => [
  `${contactId}-call`,
  `${contactId}-linkedin`,
  `${contactId}-email-0`,
  `${contactId}-email-1`,
  `${contactId}-email-2`,
];

export const OutreachSequenceCard = ({
  contact,
  callBullets,
  onCallBulletChange,
  call,
  linkedin,
  sequence,
  emailTemplates,
  isExpanded,
  onToggleExpanded,
  expandedTouches,
  onToggleTouch,
  getCallScript,
  onCallScriptChange,
  getLinkedInMessage,
  onLinkedInMessageChange,
  getEmailSubject,
  onEmailSubjectChange,
  getEmailBody,
  onEmailBodyChange,
  scriptMode,
  onScriptModeChange,
  onReplyToEmail,
}: OutreachSequenceCardProps) => {
  const firstName = contact.name.split(" ")[0];
  const pristine = isPristine(call, linkedin, sequence);

  const [enrolledLocally, setEnrolledLocally] = useState(false);
  const [order, setOrder] = useState<string[]>(() => buildDefaultOrder(contact.id));

  const fromBackend = !pristine;
  const isEnrolled = fromBackend || enrolledLocally;
  const draggable = !isEnrolled;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const callTouch: CallTouch = {
    id: `${contact.id}-call`,
    kind: "call",
    state: call,
    script: getCallScript(),
  };
  const liTouch: LinkedInTouch = {
    id: `${contact.id}-linkedin`,
    kind: "linkedin",
    state: linkedin,
    message: getLinkedInMessage(),
  };
  const emailTouches: EmailTouch[] = [0, 1, 2].map((idx) => {
    const status: EmailStatus =
      sequence.kind === "active" || sequence.kind === "completed" || sequence.kind === "unenrolled"
        ? sequence.statuses[idx]
        : { kind: "scheduled", sendsAt: "when enrolled" };
    return {
      id: `${contact.id}-email-${idx}`,
      kind: "email",
      status,
      subject: getEmailSubject(idx),
      body: getEmailBody(idx),
      emailIndex: idx,
    };
  });

  const touchById = new Map<string, Touch>([
    [callTouch.id, callTouch],
    [liTouch.id, liTouch],
    ...emailTouches.map((t) => [t.id, t] as [string, Touch]),
  ]);

  const orderedTouches: Touch[] = order
    .map((id) => touchById.get(id))
    .filter((t): t is Touch => Boolean(t));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const oldIdx = prev.indexOf(String(active.id));
      const newIdx = prev.indexOf(String(over.id));
      if (oldIdx < 0 || newIdx < 0) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  return (
    <div>
      <div className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
          <div className="flex flex-wrap items-center gap-2 py-3">
            <CollapsibleTrigger className="flex items-center gap-2">
              <TrellisIcon
                name="downCarat"
                size={12}
                className={`text-muted-foreground transition-transform ${
                  isExpanded ? "" : "-rotate-90"
                }`}
              />
              <span className="heading-50 text-foreground">5-touch sequence</span>
            </CollapsibleTrigger>
            <div className="flex-1" />
            <div>
              {seqHeaderChip(
                isEnrolled,
                enrolledLocally,
                sequence,
                firstName,
                () => setEnrolledLocally(true),
                () => setEnrolledLocally(false),
              )}
            </div>
          </div>
          <CollapsibleContent className="pb-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext items={order} strategy={verticalListSortingStrategy}>
                <div className={isEnrolled ? "" : "divide-y divide-border-core-subtle"}>
                  {orderedTouches.map((t, idx) => (
                    <SortableRow
                      key={t.id}
                      touch={t}
                      isFirst={idx === 0}
                      isLast={idx === orderedTouches.length - 1}
                      draggable={draggable}
                      isEnrolled={isEnrolled}
                      isExpanded={expandedTouches[t.id] ?? false}
                      onToggle={() => onToggleTouch(t.id)}
                      contact={{
                        name: contact.name,
                        initials: contact.initials,
                        avatarColor: contact.avatarColor,
                      }}
                      callBullets={callBullets}
                      onCallBulletChange={onCallBulletChange}
                      scriptMode={scriptMode}
                      onScriptModeChange={onScriptModeChange}
                      onScriptChange={
                        t.kind === "call" ? (v) => onCallScriptChange(v) : undefined
                      }
                      onMessageChange={
                        t.kind === "linkedin" ? (v) => onLinkedInMessageChange(v) : undefined
                      }
                      onSubjectChange={
                        t.kind === "email"
                          ? (v) => onEmailSubjectChange(t.emailIndex, v)
                          : undefined
                      }
                      onBodyChange={
                        t.kind === "email"
                          ? (v) => onEmailBodyChange(t.emailIndex, v)
                          : undefined
                      }
                      onReply={
                        t.kind === "email" && onReplyToEmail
                          ? () => onReplyToEmail(t.emailIndex)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
