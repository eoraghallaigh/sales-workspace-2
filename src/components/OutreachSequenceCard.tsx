import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import {
  CheckCircle2,
  GripVertical,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Sparkles,
  Undo2,
  Redo2,
  ChevronDown,
  Megaphone,
  Plus,
  Phone,
  Linkedin,
  Mail,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { InlineFeedbackRow } from "@/components/InlineFeedbackRow";
import { AiStarIcon } from "@/components/ui/ai-star-icon";
import RegenerateSequenceModal from "@/components/RegenerateSequenceModal";
import type { CallState, LinkedInState, EmailStatus, SequenceState } from "@/data/outreachStates";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    if (status.sendsAt === "when enrolled") return null;
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
    if (!isEnrolled) return null;
    return (
      <span className="detail-200 text-muted-foreground flex items-center gap-1.5">
        <TrellisIcon name="clock" size={12} className="text-muted-foreground" />
        Due: Tomorrow
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
    if (!isEnrolled) return null;
    return (
      <span className="detail-200 text-muted-foreground flex items-center gap-1.5">
        <TrellisIcon name="clock" size={12} className="text-muted-foreground" />
        Due: Tomorrow
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

type StartTiming = "same-day" | "1-day" | "3-days" | "custom";

const getDefaultDelay = (kind: "call" | "linkedin" | "email"): number =>
  kind === "email" ? 2 : 3;

const computeStartDateLabel = (timing: StartTiming, customDate?: Date): string => {
  if (timing === "same-day") return "";
  const now = new Date();
  let target: Date;
  if (timing === "1-day") {
    target = new Date(now);
    target.setDate(target.getDate() + 1);
  } else if (timing === "3-days") {
    target = new Date(now);
    target.setDate(target.getDate() + 3);
  } else if (customDate) {
    target = customDate;
  } else {
    return "";
  }
  return target.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const StepTimingRow = ({
  touchKind,
  delayDays,
  editable,
  onChange,
}: {
  touchKind: "call" | "linkedin" | "email";
  delayDays: number;
  editable: boolean;
  onChange: (days: number) => void;
}) => {
  const isManual = touchKind === "call" || touchKind === "linkedin";
  const verb = touchKind === "email" ? "Email will be sent" : "Task will be created";

  return (
    <p className="detail-200 text-muted-foreground py-1.5">
      {verb}{" "}
      {editable ? (
        <span className="inline-flex items-center align-middle border border-[var(--color-border-core-default)] rounded-[var(--borderRadius-100)] mx-0.5 h-[26px]">
          <input
            type="number"
            value={delayDays}
            onChange={(e) => {
              e.stopPropagation();
              onChange(Math.max(1, parseInt(e.target.value) || 1));
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-7 text-center bg-transparent py-0.5 text-foreground detail-200 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            min={1}
          />
          <span className="flex flex-col border-l border-[var(--color-border-core-default)] self-stretch">
            <button
              type="button"
              className="flex-1 px-1 flex items-center justify-center hover:bg-[var(--color-fill-surface-recessed)] transition-colors rounded-tr-[var(--borderRadius-100)]"
              onClick={(e) => {
                e.stopPropagation();
                onChange(delayDays + 1);
              }}
            >
              <ChevronDown size={10} className="rotate-180" />
            </button>
            <span className="block h-px bg-[var(--color-border-core-default)]" />
            <button
              type="button"
              className="flex-1 px-1 flex items-center justify-center hover:bg-[var(--color-fill-surface-recessed)] transition-colors rounded-br-[var(--borderRadius-100)]"
              onClick={(e) => {
                e.stopPropagation();
                onChange(Math.max(1, delayDays - 1));
              }}
            >
              <ChevronDown size={10} />
            </button>
          </span>
        </span>
      ) : (
        <span className="font-medium">{delayDays}</span>
      )}{" "}
      days after previous step.
      {isManual && " This task will not block subsequent steps."}
    </p>
  );
};

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
  onDelete?: () => void;
};

const EmailEditor = ({ initialSubject, initialBody, onSave, onDiscard, onDelete }: EmailEditorProps) => {
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
            <Button variant="secondary" size="extra-small" className="mr-2" onClick={onDiscard}>
              Cancel
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
  onDelete?: () => void;
};

const EditableEmailBody = ({ subject, body, onSave, onDelete }: EditableEmailBodyProps) => {
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
        onDelete={onDelete}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="body-100 text-foreground leading-relaxed whitespace-pre-line">{body}</p>
      <div className="flex items-center justify-end gap-1">
        <Button variant="secondary" size="extra-small" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setIsEditing(true); }}>
          Edit
        </Button>
        {onDelete && (
          <Button variant="ghost" size="extra-small" className="text-destructive hover:text-destructive" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete(); }}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

const ClickToEditView = ({
  onActivate,
  onDelete,
  children,
}: {
  onActivate: () => void;
  onDelete?: () => void;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    {children}
    <div className="flex items-center justify-end gap-1">
      <Button variant="secondary" size="extra-small" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onActivate(); }}>
        Edit
      </Button>
      {onDelete && (
        <Button variant="ghost" size="extra-small" className="text-destructive hover:text-destructive" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete(); }}>
          Delete
        </Button>
      )}
    </div>
  </div>
);

type SingleFieldEditorProps = {
  initialValue: string;
  label: string;
  onSave: (value: string) => void;
  onDiscard: () => void;
  onDelete?: () => void;
};

const SingleFieldEditor = ({ initialValue, label, onSave, onDiscard, onDelete }: SingleFieldEditorProps) => {
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
          <Button variant="secondary" size="extra-small" className="mr-2" onClick={onDiscard}>
            Cancel
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
  onDelete?: () => void;
};

const EditableText = ({ value, label, onSave, onDelete }: EditableTextProps) => {
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
        onDelete={onDelete}
      />
    );
  }
  return (
    <ClickToEditView onActivate={() => setIsEditing(true)} onDelete={onDelete}>
      <p className="body-100 text-foreground leading-relaxed whitespace-pre-line">{value}</p>
    </ClickToEditView>
  );
};

type BulletsEditorProps = {
  initialBullets: string[];
  onSave: (bullets: string[]) => void;
  onDiscard: () => void;
  onDelete?: () => void;
};

const BulletsEditor = ({ initialBullets, onSave, onDiscard, onDelete }: BulletsEditorProps) => {
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
        <Button variant="secondary" size="extra-small" className="mr-2" onClick={onDiscard}>
          Cancel
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
  onDelete,
}: {
  bullets: string[];
  onSave: (bullets: string[]) => void;
  onDelete?: () => void;
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
        onDelete={onDelete}
      />
    );
  }
  return (
    <ClickToEditView onActivate={() => setIsEditing(true)} onDelete={onDelete}>
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

const CallTaskEditor = ({
  initialTitle,
  initialNotes,
  onSave,
  onDiscard,
  onDelete,
}: {
  initialTitle: string;
  initialNotes: string;
  onSave: (title: string, notes: string) => void;
  onDiscard: () => void;
  onDelete?: () => void;
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [notes, setNotes] = useState(initialNotes);
  const [isBulleted, setIsBulleted] = useState(() =>
    initialNotes.split("\n").some((l) => l.startsWith("• ")),
  );
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const dirty = title !== initialTitle || notes !== initialNotes;

  const toggleBullets = (on: boolean) => {
    if (on) {
      const lines = notes.split("\n").filter((l) => l.trim());
      setNotes(lines.map((l) => (l.startsWith("• ") ? l : `• ${l}`)).join("\n"));
    } else {
      setNotes(
        notes
          .split("\n")
          .map((l) => l.replace(/^• /, ""))
          .join("\n"),
      );
    }
    setIsBulleted(on);
  };

  const wrapSelection = (before: string, after = before) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? notes.length;
    const end = ta.selectionEnd ?? notes.length;
    const next =
      notes.slice(0, start) + before + notes.slice(start, end) + after + notes.slice(end);
    setNotes(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    });
  };

  return (
    <div className="flex flex-col gap-8 pt-0 pb-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col gap-1">
        <label className="heading-50 text-foreground">Task title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="heading-50 text-foreground">Task notes</label>
        <Textarea
          ref={bodyRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] leading-relaxed"
          autoFocus
        />
        <div className="flex items-center justify-between gap-2 mt-1">
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
            <Button variant="secondary" size="extra-small" className="mr-2" onClick={onDiscard}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="extra-small"
              onClick={() => onSave(title, notes)}
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

const EditableCallTask = ({
  script,
  title,
  onSave,
  onTitleChange,
  onDelete,
}: {
  script: string;
  title: string;
  onSave: (v: string) => void;
  onTitleChange: (title: string) => void;
  onDelete?: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <CallTaskEditor
        initialTitle={title}
        initialNotes={script}
        onSave={(newTitle, newNotes) => {
          onTitleChange(newTitle);
          onSave(newNotes);
          setIsEditing(false);
        }}
        onDiscard={() => setIsEditing(false)}
        onDelete={onDelete}
      />
    );
  }

  return (
    <ClickToEditView onActivate={() => setIsEditing(true)} onDelete={onDelete}>
      <p className="heading-50 text-foreground mb-2">{title}</p>
      <p className="body-100 text-foreground leading-relaxed whitespace-pre-line">{script}</p>
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
  onDelete?: () => void;
  stepIndex: number;
  delayDays: number;
  onDelayChange: (days: number) => void;
  touchTitle: string;
  onTitleChange: (title: string) => void;
  startTiming: StartTiming;
  customStartDate?: Date;
  onStartTimingSelect: (timing: StartTiming) => void;
  onCustomDateSelect: (date: Date) => void;
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
  onDelete,
  stepIndex,
  delayDays,
  onDelayChange,
  touchTitle,
  onTitleChange,
  startTiming,
  customStartDate: customStartDateProp,
  onStartTimingSelect,
  onCustomDateSelect,
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

  const [stepScheduleOpen, setStepScheduleOpen] = useState(false);
  const [stepShowCal, setStepShowCal] = useState(false);
  const [delayPopoverOpen, setDelayPopoverOpen] = useState(false);

  const stepStartLabel = (() => {
    if (startTiming === "same-day") return "same day as";
    if (startTiming === "1-day") return "1 day after";
    if (startTiming === "3-days") return "3 days after";
    if (startTiming === "custom" && customStartDateProp) {
      return `on ${customStartDateProp.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    }
    return "same day as";
  })();

  const headingInner = (
    <div className="flex-1 min-w-0 -space-y-0.5">
      <div className="flex items-center gap-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <span className="shrink-0 cursor-default">
              <TrellisIcon name={touchIcon(touch)} size={16} className="text-foreground" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">{touchLabel(touch)}</TooltipContent>
        </Tooltip>
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
        {(touch.kind === "call" || touch.kind === "linkedin") && (
          <span className="body-100 flex-1 min-w-0 truncate text-foreground">
            {touchTitle}
          </span>
        )}
      </div>
      {(() => {
        const meta = renderTouchMeta(touch, isEnrolled);
        return meta ? <div className="mt-1">{meta}</div> : null;
      })()}
      {!isEnrolled && stepIndex === 0 && (
        <div className="mt-0">
          <span className="detail-200 text-muted-foreground">
            First step will execute{" "}
            <Popover
              open={stepScheduleOpen}
              onOpenChange={(open) => {
                setStepScheduleOpen(open);
                if (!open) setStepShowCal(false);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="font-semibold text-foreground inline-flex items-center gap-0.5 hover:underline underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {stepStartLabel}
                  <ChevronDown size={10} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="w-auto p-1"
                onClick={(e) => e.stopPropagation()}
              >
                {stepShowCal ? (
                  <Calendar
                    mode="single"
                    selected={customStartDateProp}
                    onSelect={(date) => {
                      if (date) onCustomDateSelect(date);
                      setStepScheduleOpen(false);
                      setStepShowCal(false);
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {(
                      [
                        { value: "same-day", label: "same day as" },
                        { value: "1-day", label: "1 day after" },
                        { value: "3-days", label: "3 days after" },
                      ] as const
                    ).map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        className="flex items-center gap-2 rounded px-3 py-1.5 text-left detail-200 text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
                        onClick={() => {
                          onStartTimingSelect(value);
                          setStepScheduleOpen(false);
                        }}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded px-3 py-1.5 text-left detail-200 text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
                      onClick={() => {
                        onStartTimingSelect("custom");
                        setStepShowCal(true);
                      }}
                    >
                      Custom Date and Time
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {startTiming !== "custom" || !customStartDateProp ? " enrollment" : ""}.
            {(touch.kind === "call" || touch.kind === "linkedin") &&
              " This task will not block subsequent steps."}
          </span>
        </div>
      )}
      {!isEnrolled && stepIndex > 0 && (
        <div className="mt-0">
          <span className="detail-200 text-muted-foreground">
            {touch.kind === "email" ? "Email will be sent" : "Task will be created"}{" "}
            <Popover open={delayPopoverOpen} onOpenChange={setDelayPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="font-semibold text-foreground inline-flex items-center gap-0.5 hover:underline underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {delayDays} day{delayDays !== 1 ? "s" : ""} after
                  <ChevronDown size={10} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="w-auto p-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-0.5">
                  {[1, 2, 3, 5, 7, 14].map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`flex items-center gap-2 rounded px-3 py-1.5 text-left detail-200 text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors ${d === delayDays ? "font-semibold" : ""}`}
                      onClick={() => {
                        onDelayChange(d);
                        setDelayPopoverOpen(false);
                      }}
                    >
                      {d} day{d !== 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>{" "}
            previous step.
            {(touch.kind === "call" || touch.kind === "linkedin") &&
              " This task will not block subsequent steps."}
          </span>
        </div>
      )}
    </div>
  );

  if (!isEnrolled) {
    return (
      <div ref={setNodeRef} style={style}>
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-4 cursor-pointer text-left -mx-2 px-2 pt-5 pb-5 rounded-[4px] hover:bg-[var(--color-fill-surface-recessed)] transition-colors">
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
              {headingInner}
              <ChevronDown
                className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                  isExpanded ? "" : "-rotate-90"
                }`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent
            className="pl-7 pt-2 pb-6"
          >
            {touch.kind === "call" &&
              (editable ? (
                <EditableCallTask
                  script={touch.script}
                  title={touchTitle}
                  onSave={(v) => onScriptChange?.(v)}
                  onTitleChange={onTitleChange}
                  onDelete={onDelete}
                />
              ) : (
                <p className="body-100 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {touch.script}
                </p>
              ))}
            {touch.kind === "linkedin" &&
              (editable ? (
                <EditableCallTask
                  script={touch.message}
                  title={touchTitle}
                  onSave={(v) => onMessageChange?.(v)}
                  onTitleChange={onTitleChange}
                  onDelete={onDelete}
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
                  onDelete={onDelete}
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
          <div className="flex items-center gap-2 cursor-pointer text-left -mx-2 px-2 py-3 rounded-[4px] hover:bg-[var(--color-fill-surface-recessed)] transition-colors">
            {headingInner}
            <ChevronDown
              className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                isExpanded ? "" : "-rotate-90"
              }`}
            />
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

type InsertedStep = {
  id: string;
  kind: "call" | "linkedin" | "email";
  content: string;
  subject: string;
};

let insertCounter = 0;

const STEP_CHOICES: { kind: "call" | "linkedin" | "email"; label: string; icon: typeof Phone }[] = [
  { kind: "call", label: "Call", icon: Phone },
  { kind: "linkedin", label: "LinkedIn", icon: Linkedin },
  { kind: "email", label: "Email", icon: Mail },
];

const InsertStepButton = ({ onInsert }: { onInsert: (kind: "call" | "linkedin" | "email") => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-10 flex items-center gap-1 rounded-full border border-[var(--color-border-core-subtle)] bg-white px-2 py-0.5 detail-100 text-muted-foreground opacity-0 group-hover/insert:opacity-100 hover:!opacity-100 hover:border-[var(--color-border-interactive-default)] hover:text-foreground transition-opacity shadow-sm"
        >
          <Plus size={12} />
          Step
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-auto p-1">
        <div className="flex flex-col gap-0.5">
          {STEP_CHOICES.map(({ kind, label, icon: Icon }) => (
            <button
              key={kind}
              type="button"
              className="flex items-center gap-2 rounded px-3 py-1.5 text-left detail-100 text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => {
                onInsert(kind);
                setOpen(false);
              }}
            >
              <Icon size={14} className="text-muted-foreground" />
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DELAY_OPTIONS = [1, 2, 3, 5, 7, 14];

const InsertedStepRow = ({
  step,
  onSave,
  onDiscard,
}: {
  step: InsertedStep;
  onSave: (step: InsertedStep) => void;
  onDiscard: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(step.subject);
  const [content, setContent] = useState(step.content);
  const [delayDays, setDelayDays] = useState(step.kind === "email" ? 2 : 3);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const icon = step.kind === "call" ? "calling" : step.kind === "linkedin" ? "linkedin" : "email";
  const label = step.kind === "call" ? "Call task" : step.kind === "linkedin" ? "LinkedIn message task" : "Email";
  const isTask = step.kind === "call" || step.kind === "linkedin";

  return (
    <div className="border-t border-[var(--color-border-core-subtle)] py-4 px-2 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <TrellisIcon name={icon} size={14} className="text-muted-foreground" />
        <span className="heading-50 text-foreground">{label}</span>
      </div>
      <div className="flex flex-col gap-3 pl-6">
        <div className="flex flex-col gap-1">
          <p className="detail-200 text-muted-foreground">
            {step.kind === "email" ? "Email will be sent" : "Task will be created"}{" "}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="font-semibold text-foreground inline-flex items-center gap-0.5 hover:underline underline-offset-2"
                >
                  {delayDays} day{delayDays !== 1 ? "s" : ""} after
                  <ChevronDown size={10} />
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-auto p-1">
                <div className="flex flex-col gap-0.5">
                  {DELAY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`flex items-center gap-2 rounded px-3 py-1.5 text-left detail-200 text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors ${d === delayDays ? "font-semibold" : ""}`}
                      onClick={() => setDelayDays(d)}
                    >
                      {d} day{d !== 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>{" "}
            previous step.
            {isTask && " This task will not block subsequent steps."}
          </p>
        </div>
        {isTask && (
          <div className="flex flex-col gap-1 mt-3">
            <label className="heading-50 text-foreground">Task title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title…"
              autoFocus
            />
          </div>
        )}
        {step.kind === "email" && (
          <div className="flex flex-col gap-1">
            <label className="heading-50 text-foreground">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject…"
              autoFocus
            />
          </div>
        )}
        <div className="flex flex-col gap-1 mt-3">
          <label className="heading-50 text-foreground">
            {isTask ? "Task notes" : "Body"}
          </label>
          <Textarea
            ref={bodyRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              step.kind === "call"
                ? "Write your call notes…"
                : step.kind === "linkedin"
                  ? "Write your message…"
                  : "Write your email body…"
            }
            className="min-h-[100px] leading-relaxed"
            autoFocus={step.kind === "email"}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => {
                const ta = bodyRef.current;
                if (!ta) return;
                const s = ta.selectionStart ?? content.length;
                const e = ta.selectionEnd ?? content.length;
                setContent(content.slice(0, s) + "**" + content.slice(s, e) + "**" + content.slice(e));
              }}
              aria-label="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => {
                const ta = bodyRef.current;
                if (!ta) return;
                const s = ta.selectionStart ?? content.length;
                const e = ta.selectionEnd ?? content.length;
                setContent(content.slice(0, s) + "*" + content.slice(s, e) + "*" + content.slice(e));
              }}
              aria-label="Italic"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => {
                const ta = bodyRef.current;
                if (!ta) return;
                const s = ta.selectionStart ?? content.length;
                const e = ta.selectionEnd ?? content.length;
                setContent(content.slice(0, s) + "__" + content.slice(s, e) + "__" + content.slice(e));
              }}
              aria-label="Underline"
            >
              <Underline size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
              onClick={() => {
                const ta = bodyRef.current;
                if (!ta) return;
                const s = ta.selectionStart ?? content.length;
                const e = ta.selectionEnd ?? content.length;
                setContent(content.slice(0, s) + "[" + content.slice(s, e) + "](url)" + content.slice(e));
              }}
              aria-label="Insert link"
            >
              <LinkIcon size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="extra-small" className="mr-2" onClick={onDiscard}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="extra-small"
              disabled={isTask ? !title.trim() : !content.trim()}
              onClick={() => onSave({ ...step, content, subject })}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export type OutreachSequenceCardProps = {
  contact: { id: string; name: string; initials: string; avatarColor: string };
  // When this contact is already enrolled in a different play's sequence, the
  // owning play's label — shown as a chip above the sequence to explain why the
  // sequence here belongs to another play (one active enrollment per contact).
  playProvenanceLabel?: string;
  callBullets: string[];
  onCallBulletChange: (idx: number, value: string) => void;
  call: CallState;
  linkedin: LinkedInState;
  sequence: SequenceState;
  defaultCallScript: string;
  defaultLinkedInMessage: string;
  emailTemplates: Array<{ subject: string; body: string }>;
  // Eligible plays for this contact. When more than one, a play selector renders
  // next to the sequence header so the rep can pick which play's email sequence
  // to enroll the contact in.
  playOptions?: Array<{ id: string; label: string }>;
  selectedPlayId?: string;
  onSelectPlay?: (playId: string) => void;
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
  onRegenerate?: (instructions: string) => void;
  enableFeedback?: boolean;
  sequenceGeneratedAt?: string;
  staleInstructions?: boolean;
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
  playProvenanceLabel,
  callBullets,
  onCallBulletChange,
  call,
  linkedin,
  sequence,
  emailTemplates,
  playOptions,
  selectedPlayId,
  onSelectPlay,
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
  onRegenerate,
  enableFeedback,
  sequenceGeneratedAt,
  staleInstructions,
}: OutreachSequenceCardProps) => {
  const firstName = contact.name.split(" ")[0];
  const pristine = isPristine(call, linkedin, sequence);

  const [localOverride, setLocalOverride] = useState<LocalOverride>(null);
  const [order, setOrder] = useState<string[]>(() => buildDefaultOrder(contact.id));
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isFeedbackMode, setIsFeedbackMode] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const feedbackRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isFeedbackMode && !feedbackSuccess) feedbackRef.current?.focus();
  }, [isFeedbackMode, feedbackSuccess]);
  const [pendingInsert, setPendingInsert] = useState<{ afterId: string; step: InsertedStep } | null>(null);
  const [customTouches, setCustomTouches] = useState<Map<string, Touch>>(new Map());
  const [customExpanded, setCustomExpanded] = useState<Set<string>>(new Set());
  const [startTiming, setStartTiming] = useState<StartTiming>("same-day");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [stepDelays, setStepDelays] = useState<Record<string, number>>({});
  const [touchTitles, setTouchTitles] = useState<Record<string, string>>({});

  const getTouchTitle = useCallback(
    (touchId: string, kind: "call" | "linkedin" | "email"): string => {
      if (touchTitles[touchId]) return touchTitles[touchId];
      if (kind === "call") return "Follow up call";
      if (kind === "linkedin") return "Connection request";
      return "";
    },
    [touchTitles],
  );

  const setTouchTitle = useCallback((touchId: string, title: string) => {
    setTouchTitles((prev) => ({ ...prev, [touchId]: title }));
  }, []);

  const getDelayForTouch = useCallback(
    (touchId: string, kind: "call" | "linkedin" | "email"): number =>
      stepDelays[touchId] ?? getDefaultDelay(kind),
    [stepDelays],
  );

  const setDelayForTouch = useCallback((touchId: string, days: number) => {
    setStepDelays((prev) => ({ ...prev, [touchId]: days }));
  }, []);

  const handleInsertStep = useCallback((afterId: string, kind: "call" | "linkedin" | "email") => {
    const id = `${contact.id}-insert-${++insertCounter}`;
    setPendingInsert({ afterId, step: { id, kind, content: "", subject: "" } });
  }, [contact.id]);

  const handleSaveInsert = useCallback((step: InsertedStep) => {
    if (!pendingInsert) return;
    const touch: Touch = step.kind === "call"
      ? { id: step.id, kind: "call", state: { kind: "not-attempted" }, script: step.content }
      : step.kind === "linkedin"
        ? { id: step.id, kind: "linkedin", state: { kind: "not-sent" }, message: step.content }
        : { id: step.id, kind: "email", status: { kind: "scheduled", sendsAt: "when enrolled" }, subject: step.subject, body: step.content, emailIndex: -1 };
    setCustomTouches((prev) => new Map(prev).set(step.id, touch));
    setOrder((prev) => {
      const idx = prev.indexOf(pendingInsert.afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, step.id);
      return next;
    });
    setCustomExpanded((prev) => new Set(prev).add(step.id));
    setPendingInsert(null);
  }, [pendingInsert]);

  const handleDiscardInsert = useCallback(() => {
    setPendingInsert(null);
  }, []);

  const handleDeleteStep = useCallback((id: string) => {
    setOrder((prev) => prev.filter((x) => x !== id));
    setCustomTouches((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setCustomExpanded((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const status = classifyStatus(localOverride, sequence);
  const fromBackend = !pristine;
  const isEnrolled = fromBackend || localOverride !== null;
  const draggable = !isEnrolled;

  const mutedAttribution = (
    <div className="flex items-center gap-1.5 ml-3">
      <Sparkles size={12} className="text-muted-foreground" aria-hidden />
      <span className="detail-200 text-muted-foreground">Created by Sequencing Agent{sequenceGeneratedAt ? ` · ${sequenceGeneratedAt}` : ""} ·</span>
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
    ...customTouches,
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

  const startTimingLabel = (() => {
    if (startTiming === "same-day") return "same day as";
    if (startTiming === "1-day") return "1 day after";
    if (startTiming === "3-days") return "3 days after";
    if (startTiming === "custom" && customStartDate) {
      return `on ${customStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    }
    return "same day as";
  })();

  return (
    <div className="bg-[var(--color-fill-surface-raised)]">
      {playProvenanceLabel && (
        <Badge variant="orange" className="gap-1 mb-2">
          <Megaphone className="h-3 w-3" />
          Part of {playProvenanceLabel} play
        </Badge>
      )}
      {staleInstructions && !isEnrolled && (
        <Alert type="info" className="mb-3">
          <div className="flex items-center justify-between gap-3">
            <AlertDescription>
              This sequence was generated before you updated your agent instructions for sequences.
            </AlertDescription>
            {onRegenerate && (
              <Button variant="tertiary" size="extra-small" className="shrink-0" onClick={() => onRegenerate("")}>
                Regenerate
              </Button>
            )}
          </div>
        </Alert>
      )}
      <div className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 py-3">
          <span className="heading-100 text-foreground">5-touch sequence</span>
          {status !== null && renderStatusBadgeStack(status, sequence, localOverride)}
          {playOptions && playOptions.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="small"
                  className="border border-transparent detail-200 h-auto px-2 py-0.5 gap-1 text-muted-foreground hover:text-foreground"
                >
                  {playOptions.find((o) => o.id === selectedPlayId)?.label ?? "Select play"}
                  <TrellisIcon name="downCarat" size={10} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {playOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => onSelectPlay?.(option.id)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="flex-1" />
          {mutedAttribution}
        </div>
          <div className="pb-0">
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
                      : "divide-y divide-[var(--color-border-core-subtle)] border-y border-[var(--color-border-core-subtle)] mb-6"
                  }
                >
                  {orderedTouches.map((t, idx) => {
                    const hasPending = pendingInsert?.afterId === t.id;
                    const isCustom = customTouches.has(t.id);
                    return (
                    <div key={t.id} className={`relative ${!isEnrolled && !hasPending ? "group/insert" : ""}`}>
                      <SortableRow
                        touch={t}
                        isFirst={idx === 0}
                        isLast={idx === orderedTouches.length - 1}
                        draggable={draggable}
                        isEnrolled={isEnrolled}
                        isExpanded={isCustom ? customExpanded.has(t.id) : (expandedTouches[t.id] ?? false)}
                        onToggle={() => isCustom ? setCustomExpanded((prev) => {
                          const next = new Set(prev);
                          next.has(t.id) ? next.delete(t.id) : next.add(t.id);
                          return next;
                        }) : onToggleTouch(t.id)}
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
                        onDelete={() => handleDeleteStep(t.id)}
                        stepIndex={idx}
                        delayDays={getDelayForTouch(t.id, t.kind)}
                        onDelayChange={(days) => setDelayForTouch(t.id, days)}
                        touchTitle={getTouchTitle(t.id, t.kind)}
                        onTitleChange={(title) => setTouchTitle(t.id, title)}
                        startTiming={startTiming}
                        customStartDate={customStartDate}
                        onStartTimingSelect={setStartTiming}
                        onCustomDateSelect={setCustomStartDate}
                      />
                      {idx === 0 && isEnrolled && startTiming !== "same-day" && computeStartDateLabel(startTiming, customStartDate) !== "" && (
                        <div className="relative flex gap-3">
                          <span className="w-[14px] shrink-0" />
                          <div className="relative w-7 shrink-0">
                            <span
                              aria-hidden
                              className="absolute left-1/2 -translate-x-1/2 w-px bg-[var(--color-border-core-subtle)] top-0 bottom-0"
                            />
                          </div>
                          <p className="detail-200 text-muted-foreground py-1">
                            Sequence starts on {computeStartDateLabel(startTiming, customStartDate)}
                          </p>
                        </div>
                      )}
                      {hasPending && (
                        <InsertedStepRow
                          step={pendingInsert!.step}
                          onSave={handleSaveInsert}
                          onDiscard={handleDiscardInsert}
                        />
                      )}
                      {!isEnrolled && !hasPending && (
                        <InsertStepButton onInsert={(kind) => handleInsertStep(t.id, kind)} />
                      )}
                    </div>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
            <div className="mt-4 flex items-center justify-between gap-6">
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
                  {onRegenerate && (
                    <Button
                      variant="transparent"
                      size="small"
                      className="gap-1"
                      onClick={() => setIsRegenerateOpen(true)}
                    >
                      <AiStarIcon size={14} className="mr-1" />
                      Regenerate sequence
                    </Button>
                  )}
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
              {enableFeedback && (
                <InlineFeedbackRow
                  onThumbsUp={() => {}}
                  onThumbsDown={() => setIsFeedbackMode(true)}
                  thumbsDownWrapper={(btn) => (
                    <Popover open={isFeedbackMode} onOpenChange={(open) => {
                      setIsFeedbackMode(open);
                      if (!open) setFeedbackText("");
                    }}>
                      <PopoverTrigger asChild>
                        {btn}
                      </PopoverTrigger>
                      <PopoverContent side="top" align="end" sideOffset={8} className="w-[280px] p-0">
                        {feedbackSuccess ? (
                          <div className="px-4 py-3.5 flex flex-col items-center justify-center gap-1.5">
                            <CheckCircle2 className="h-6 w-6 text-trellis-green-600" />
                            <p className="heading-50 text-foreground">Feedback submitted!</p>
                          </div>
                        ) : (
                          <div className="px-4 pt-4 pb-4">
                            <p className="heading-50 text-foreground mb-1">
                              What's wrong with this sequence?
                            </p>
                            <p className="detail-200 text-muted-foreground mb-3">
                              Your feedback is used to train the sequencing agent.
                            </p>
                            <Textarea
                              ref={feedbackRef}
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              className="min-h-[60px] body-75 resize-none mt-4"
                            />
                            <div className="flex items-center justify-end gap-2 mt-4">
                              <Button
                                variant="ghost"
                                size="extra-small"
                                onClick={() => {
                                  setIsFeedbackMode(false);
                                  setFeedbackText("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                size="extra-small"
                                disabled={feedbackText.trim().length === 0}
                                onClick={() => {
                                  setFeedbackSuccess(true);
                                  setTimeout(() => {
                                    setIsFeedbackMode(false);
                                    setFeedbackText("");
                                    setFeedbackSuccess(false);
                                  }, 1000);
                                }}
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  )}
                />
              )}
            </div>
          </div>
      </div>
      <RegenerateSequenceModal
        open={isRegenerateOpen}
        onOpenChange={setIsRegenerateOpen}
        contactName={firstName}
        onRegenerate={onRegenerate}
      />
    </div>
  );
};
