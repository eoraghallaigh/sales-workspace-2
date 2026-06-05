import { useRef, useState, type ReactNode } from "react";
import {
  GripVertical,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Sparkles,
  Undo2,
  Redo2,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { AiStarIcon } from "@/components/ui/ai-star-icon";
import RegenerateSequenceModal from "@/components/RegenerateSequenceModal";
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

const stripReasonPrefix = (reason: string): string =>
  reason.replace(/^Sequence ended because /, "");

type SequenceStatus = "enrolled" | "paused" | "replied" | "ended";
type LocalOverride = SequenceStatus | "removed" | null;

const classifyStatus = (
  localOverride: LocalOverride,
  sequence: SequenceState,
): SequenceStatus | null => {
  if (localOverride === "removed") return null;
  if (localOverride !== null) return localOverride;
  if (sequence.kind === "not-enrolled") return null;
  if (sequence.kind === "active") return "enrolled";
  if (sequence.kind === "completed") return "ended";
  if (sequence.reason.includes("connected call")) return "paused";
  return "replied";
};

const stepTextFromActive = (sequence: SequenceState): string => {
  if (sequence.kind !== "active") return "Step 1 of 5 · scheduled";
  const sentCount = sequence.statuses.filter((x) => x.kind === "sent").length;
  const next = sequence.statuses.find((x) => x.kind === "scheduled");
  return `Step ${sentCount} of 5${
    next && next.kind === "scheduled" ? ` · next sends ${next.sendsAt}` : ""
  }`;
};

const renderStatusBadgeStack = (
  status: SequenceStatus,
  sequence: SequenceState,
  localOverride: LocalOverride,
) => {
  let badge: React.ReactNode = null;
  let text = "";

  if (status === "enrolled") {
    badge = <Badge variant="status-blue">Enrolled</Badge>;
    text = stepTextFromActive(sequence);
  } else if (status === "paused") {
    badge = <Badge variant="status-yellow">Paused</Badge>;
    if (localOverride === "paused") {
      text =
        sequence.kind === "active"
          ? `Paused at ${stepTextFromActive(sequence)}`
          : "Paused at step 1 of 5";
    } else if (sequence.kind === "unenrolled") {
      text = stripReasonPrefix(sequence.reason);
    } else {
      text = "Paused";
    }
  } else if (status === "replied") {
    badge = <Badge variant="status-green">Replied</Badge>;
    text = sequence.kind === "unenrolled" ? stripReasonPrefix(sequence.reason) : "Replied";
  } else if (status === "ended") {
    badge = <Badge variant="status-gray">Ended</Badge>;
    text = "All 5 touches sent";
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-default" tabIndex={0}>
          {badge}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="end"
        className="zoom-in-100 data-[side=bottom]:slide-in-from-top-0 data-[side=top]:slide-in-from-bottom-0 data-[side=left]:slide-in-from-right-0 data-[side=right]:slide-in-from-left-0"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
};

const renderStatusCtas = (
  status: SequenceStatus,
  onPause: () => void,
  onUnpause: () => void,
  onEnd: () => void,
  onUnenroll: () => void,
) => {
  if (status === "enrolled") {
    return (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="small" onClick={onPause}>
          Pause
        </Button>
        <Button variant="secondary" size="small" onClick={onUnenroll}>
          Unenroll
        </Button>
      </div>
    );
  }
  if (status === "paused") {
    return (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="small" onClick={onUnpause}>
          Unpause
        </Button>
        <Button variant="secondary" size="small" onClick={onEnd}>
          End
        </Button>
      </div>
    );
  }
  return null;
};

type EmailEditorProps = {
  initialSubject: string;
  initialBody: string;
  onSave: (subject: string, body: string) => void;
  onDiscard: () => void;
};

const EmailEditor = ({ initialSubject, initialBody, onSave, onDiscard }: EmailEditorProps) => {
  const [history, setHistory] = useState<Array<{ subject: string; body: string }>>([
    { subject: initialSubject, body: initialBody },
  ]);
  const [index, setIndex] = useState(0);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const current = history[index];
  const dirty = current.subject !== initialSubject || current.body !== initialBody;
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  const push = (next: { subject: string; body: string }) => {
    setHistory((prev) => [...prev.slice(0, index + 1), next]);
    setIndex(index + 1);
  };

  const wrapSelection = (before: string, after = before) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? current.body.length;
    const end = ta.selectionEnd ?? current.body.length;
    const newBody =
      current.body.slice(0, start) +
      before +
      current.body.slice(start, end) +
      after +
      current.body.slice(end);
    push({ subject: current.subject, body: newBody });
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    });
  };

  return (
    <div className="flex flex-col gap-8 pt-4 pb-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col gap-1">
        <label htmlFor="email-subject" className="heading-50 text-foreground">
          Subject
        </label>
        <Input
          id="email-subject"
          value={current.subject}
          onChange={(e) => push({ subject: e.target.value, body: current.body })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email-body" className="heading-50 text-foreground">
          Body
        </label>
        <Textarea
          id="email-body"
          ref={bodyRef}
          value={current.body}
          onChange={(e) => push({ subject: current.subject, body: e.target.value })}
          className="min-h-[180px] leading-relaxed"
          autoFocus
        />
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center">
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => wrapSelection("**")}
              aria-label="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => wrapSelection("*")}
              aria-label="Italic"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => wrapSelection("__")}
              aria-label="Underline"
            >
              <Underline size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => wrapSelection("[", "](url)")}
              aria-label="Insert link"
            >
              <LinkIcon size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
              onClick={() => canUndo && setIndex(index - 1)}
              disabled={!canUndo}
              aria-label="Undo"
            >
              <Undo2 size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
              onClick={() => canRedo && setIndex(index + 1)}
              disabled={!canRedo}
              aria-label="Redo"
            >
              <Redo2 size={14} />
            </button>
            <Button variant="secondary" size="extra-small" onClick={onDiscard}>
              Discard
            </Button>
            <Button
              variant="primary"
              size="extra-small"
              onClick={() => onSave(current.subject, current.body)}
              disabled={!dirty}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

type EditableEmailBodyProps = {
  subject: string;
  body: string;
  onSave: (subject: string, body: string) => void;
};

const EditableEmailBody = ({ subject, body, onSave }: EditableEmailBodyProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EmailEditor
        initialSubject={subject}
        initialBody={body}
        onSave={(s, b) => {
          onSave(s, b);
          setIsEditing(false);
        }}
        onDiscard={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative group cursor-pointer rounded-[var(--borderRadius-100)]"
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
    >
      <p className="body-100 text-foreground leading-relaxed whitespace-pre-line">{body}</p>
      <div className="absolute -inset-4 flex items-center justify-center bg-white/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Button variant="primary" size="small" tabIndex={-1} aria-hidden>
          Click to edit
        </Button>
      </div>
    </div>
  );
};

const ClickToEditView = ({
  onActivate,
  children,
}: {
  onActivate: () => void;
  children: ReactNode;
}) => (
  <div
    role="button"
    tabIndex={0}
    className="relative group cursor-pointer rounded-[var(--borderRadius-100)]"
    onClick={onActivate}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    }}
  >
    {children}
    <div className="absolute -inset-4 flex items-center justify-center bg-white/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <Button variant="primary" size="small" tabIndex={-1} aria-hidden>
        Click to edit
      </Button>
    </div>
  </div>
);

type SingleFieldEditorProps = {
  initialValue: string;
  label: string;
  onSave: (value: string) => void;
  onDiscard: () => void;
};

const SingleFieldEditor = ({ initialValue, label, onSave, onDiscard }: SingleFieldEditorProps) => {
  const [history, setHistory] = useState<string[]>([initialValue]);
  const [index, setIndex] = useState(0);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const current = history[index];
  const dirty = current !== initialValue;
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  const push = (next: string) => {
    setHistory((prev) => [...prev.slice(0, index + 1), next]);
    setIndex(index + 1);
  };

  const wrapSelection = (before: string, after = before) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? current.length;
    const end = ta.selectionEnd ?? current.length;
    const next =
      current.slice(0, start) + before + current.slice(start, end) + after + current.slice(end);
    push(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    });
  };

  return (
    <div className="flex flex-col gap-1 pt-2 pb-2" onClick={(e) => e.stopPropagation()}>
      <label className="heading-50 text-foreground">{label}</label>
      <Textarea
        ref={bodyRef}
        value={current}
        onChange={(e) => push(e.target.value)}
        className="min-h-[120px] leading-relaxed"
        autoFocus
      />
      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex items-center">
          <button
            type="button"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
            onClick={() => wrapSelection("**")}
            aria-label="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
            onClick={() => wrapSelection("*")}
            aria-label="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
            onClick={() => wrapSelection("__")}
            aria-label="Underline"
          >
            <Underline size={14} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
            onClick={() => wrapSelection("[", "](url)")}
            aria-label="Insert link"
          >
            <LinkIcon size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            onClick={() => canUndo && setIndex(index - 1)}
            disabled={!canUndo}
            aria-label="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            onClick={() => canRedo && setIndex(index + 1)}
            disabled={!canRedo}
            aria-label="Redo"
          >
            <Redo2 size={14} />
          </button>
          <Button variant="secondary" size="extra-small" onClick={onDiscard}>
            Discard
          </Button>
          <Button
            variant="primary"
            size="extra-small"
            onClick={() => onSave(current)}
            disabled={!dirty}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

type EditableTextProps = {
  value: string;
  label: string;
  onSave: (value: string) => void;
};

const EditableText = ({ value, label, onSave }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return (
      <SingleFieldEditor
        initialValue={value}
        label={label}
        onSave={(v) => {
          onSave(v);
          setIsEditing(false);
        }}
        onDiscard={() => setIsEditing(false)}
      />
    );
  }
  return (
    <ClickToEditView onActivate={() => setIsEditing(true)}>
      <p className="body-100 text-foreground leading-relaxed whitespace-pre-line">{value}</p>
    </ClickToEditView>
  );
};

type BulletsEditorProps = {
  initialBullets: string[];
  onSave: (bullets: string[]) => void;
  onDiscard: () => void;
};

const BulletsEditor = ({ initialBullets, onSave, onDiscard }: BulletsEditorProps) => {
  const [bullets, setBullets] = useState<string[]>(initialBullets);
  const dirty = bullets.some((b, i) => b !== initialBullets[i]);
  return (
    <div className="flex flex-col gap-3 pt-2 pb-2" onClick={(e) => e.stopPropagation()}>
      <label className="heading-50 text-foreground">Call bullets</label>
      <ul className="list-disc pl-4 space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="body-100 text-foreground leading-relaxed">
            <Textarea
              value={b}
              onChange={(e) =>
                setBullets((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))
              }
              className="min-h-[40px] leading-relaxed"
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-end gap-1">
        <Button variant="secondary" size="extra-small" onClick={onDiscard}>
          Discard
        </Button>
        <Button
          variant="primary"
          size="extra-small"
          onClick={() => onSave(bullets)}
          disabled={!dirty}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

const EditableBullets = ({
  bullets,
  onSave,
}: {
  bullets: string[];
  onSave: (bullets: string[]) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return (
      <BulletsEditor
        initialBullets={bullets}
        onSave={(b) => {
          onSave(b);
          setIsEditing(false);
        }}
        onDiscard={() => setIsEditing(false)}
      />
    );
  }
  return (
    <ClickToEditView onActivate={() => setIsEditing(true)}>
      <ul className="list-disc pl-4 space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="body-100 text-foreground leading-relaxed whitespace-pre-line">
            {b}
          </li>
        ))}
      </ul>
    </ClickToEditView>
  );
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
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging
      ? "0 12px 28px -6px rgba(20, 20, 20, 0.20), 0 4px 10px -4px rgba(20, 20, 20, 0.12)"
      : undefined,
    backgroundColor: isDragging
      ? "var(--color-fill-surface-default, white)"
      : undefined,
    borderRadius: isDragging ? 4 : undefined,
    zIndex: isDragging ? 10 : undefined,
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
          <span
            className={`body-100 flex-1 min-w-0 truncate ${
              touch.status.kind === "cancelled"
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {touch.subject}
          </span>
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
      <div ref={setNodeRef} style={style}>
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <div className="flex items-start gap-2 cursor-pointer text-left -mx-2 px-2 py-3 rounded-[4px] hover:bg-[var(--color-fill-surface-recessed)] transition-colors">
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
          <CollapsibleContent
            className={`pl-7 pt-2 ${touch.kind === "email" ? "pb-6" : "pb-1"}`}
          >
            {touch.kind === "call" &&
              (editable ? (
                <>
                  {scriptMode === "script" ? (
                    <EditableText
                      value={touch.script}
                      label="Call script"
                      onSave={(v) => onScriptChange?.(v)}
                    />
                  ) : (
                    <EditableBullets
                      bullets={callBullets}
                      onSave={(next) => next.forEach((v, i) => onCallBulletChange(i, v))}
                    />
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
                <EditableText
                  value={touch.message}
                  label="Message"
                  onSave={(v) => onMessageChange?.(v)}
                />
              ) : (
                <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {touch.message}
                </p>
              ))}
            {touch.kind === "email" &&
              (editable ? (
                <EditableEmailBody
                  subject={touch.subject}
                  body={touch.body}
                  onSave={(s, b) => {
                    onSubjectChange?.(s);
                    onBodyChange?.(b);
                  }}
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

      <div className="flex-1 min-w-0">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="flex items-start gap-2 cursor-pointer text-left -mx-2 px-2 py-3 rounded-[4px] hover:bg-[var(--color-fill-surface-recessed)] transition-colors">
            {headingInner}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={`pt-2 ${touch.kind === "email" ? "pb-6" : "pb-1"}`}
        >
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
  onViewReasoning: () => void;
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
  onViewReasoning,
}: OutreachSequenceCardProps) => {
  const firstName = contact.name.split(" ")[0];
  const pristine = isPristine(call, linkedin, sequence);

  const [localOverride, setLocalOverride] = useState<LocalOverride>(null);
  const [order, setOrder] = useState<string[]>(() => buildDefaultOrder(contact.id));
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);

  const status = classifyStatus(localOverride, sequence);
  const fromBackend = !pristine;
  const isEnrolled = fromBackend || localOverride !== null;
  const draggable = !isEnrolled;

  const mutedAttribution = (
    <div className="flex items-center gap-1.5">
      <Sparkles size={12} className="text-muted-foreground" aria-hidden />
      <span className="detail-200 text-muted-foreground">Created by Sequencing Agent ·</span>
      <button
        type="button"
        onClick={onViewReasoning}
        className="detail-200 text-text-interactive hover:underline"
      >
        View reasoning
      </button>
    </div>
  );

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
            {status !== null && renderStatusBadgeStack(status, sequence, localOverride)}
          </div>
          <CollapsibleContent className="pb-0">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext items={order} strategy={verticalListSortingStrategy}>
                <div
                  className={
                    isEnrolled
                      ? ""
                      : "divide-y divide-[var(--color-border-core-subtle)] border-y border-[var(--color-border-core-subtle)]"
                  }
                >
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
            <div className="mt-10 flex items-center justify-between gap-6">
              <div>
              {status === null && (
                <div className="flex items-center gap-6">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => setLocalOverride("enrolled")}
                  >
                    <TrellisIcon name="email" size={12} className="mr-1 brightness-0 invert" />
                    Enroll {firstName}
                  </Button>
                  <Button
                    variant="transparent"
                    size="small"
                    className="gap-1"
                    onClick={() => setIsRegenerateOpen(true)}
                  >
                    <AiStarIcon size={14} className="mr-1" />
                    Regenerate sequence
                  </Button>
                </div>
              )}
              {(status === "enrolled" || status === "paused") && (
                <div className="pl-[26px]">
                  {renderStatusCtas(
                    status,
                    () => setLocalOverride("paused"),
                    () => setLocalOverride("enrolled"),
                    () => setLocalOverride("ended"),
                    () => setLocalOverride("removed"),
                  )}
                </div>
              )}
              </div>
              {mutedAttribution}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <RegenerateSequenceModal
        open={isRegenerateOpen}
        onOpenChange={setIsRegenerateOpen}
        contactName={firstName}
      />
    </div>
  );
};
