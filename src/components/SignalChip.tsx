import { type ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { InlineFeedbackRow } from "@/components/InlineFeedbackRow";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  resolveSignalDetail,
  SIGNAL_CATALOG,
  type SignalDetail,
  type SignalInstance,
  type SignalOwner,
} from "@/data/signals";

const DetailBody = ({
  title,
  detail,
  summary,
  onThumbsDown,
}: {
  title: string;
  detail: SignalDetail;
  summary: string;
  onThumbsDown?: () => void;
}) => (
  <div className="px-4 py-3.5 relative">
    <p className="heading-100 text-foreground">{title}</p>
    <p className="body-100 text-[var(--color-text-core-default)] mt-1">
      {detail.narrative ?? detail.headline ?? summary}
    </p>
    {onThumbsDown && (
      <InlineFeedbackRow
        className="mt-4"
        onThumbsUp={() => {}}
        onThumbsDown={onThumbsDown}
      />
    )}
  </div>
);

const FeedbackBody = ({
  title,
  subtitle,
  onSubmit,
  onCancel,
}: {
  title: string;
  subtitle: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) => {
  const [text, setText] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  if (isSuccess) {
    return (
      <div className="px-4 py-3.5 flex flex-col items-center justify-center gap-1.5">
        <CheckCircle2 className="h-6 w-6 text-trellis-green-600" />
        <p className="heading-50 text-foreground">Feedback submitted!</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3.5">
      <p className="heading-50 text-foreground mb-1">
        What's wrong with "{title}"?
      </p>
      <p className="detail-200 text-muted-foreground mb-3">{subtitle}</p>
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[60px] body-75 resize-none"
      />
      <div className="flex items-center justify-end gap-2 mt-2">
        <Button variant="ghost" size="extra-small" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="extra-small"
          disabled={text.trim().length === 0}
          onClick={() => {
            setIsSuccess(true);
            setTimeout(() => onSubmit(text.trim()), 1000);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

interface SignalChipProps {
  signal: SignalInstance;
  owner?: SignalOwner;
  className?: string;
}

export const SignalChip = ({ signal, owner, className }: SignalChipProps) => {
  const def = SIGNAL_CATALOG[signal.id];
  if (!def) return null;

  const detail = resolveSignalDetail(signal, owner);
  const [isFeedbackMode, setIsFeedbackMode] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpenChange = (next: boolean) => {
    if (isFeedbackMode && !next) return;
    setOpen(next);
    if (!next) setIsFeedbackMode(false);
  };

  const handleSubmitFeedback = (_text: string) => {
    setIsFeedbackMode(false);
    setOpen(false);
  };

  const handleCancelFeedback = () => {
    setIsFeedbackMode(false);
  };

  return (
    <HoverCard openDelay={120} closeDelay={80} open={open} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            "inline-flex cursor-default rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            className,
          )}
        >
          <Tag variant={def.variant}>{def.label}</Tag>
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-[280px] p-0"
      >
        {isFeedbackMode ? (
          <FeedbackBody
            title={def.label}
            subtitle="Your feedback will be sent to the product team."
            onSubmit={handleSubmitFeedback}
            onCancel={handleCancelFeedback}
          />
        ) : (
          <DetailBody
            title={def.label}
            detail={detail}
            summary={def.summary}
            onThumbsDown={() => setIsFeedbackMode(true)}
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

interface SignalChipRowProps {
  signals: SignalInstance[];
  owner?: SignalOwner;
  className?: string;
  emptyLabel?: string;
}

// A wrapped row of chips, with an optional empty state.
export const SignalChipRow = ({
  signals,
  owner,
  className,
  emptyLabel,
}: SignalChipRowProps) => {
  if (signals.length === 0) {
    return emptyLabel ? (
      <span className="detail-200 text-muted-foreground">{emptyLabel}</span>
    ) : null;
  }
  return (
    <div className={cn("flex flex-wrap items-start gap-2", className)}>
      {signals.map((signal, idx) => (
        <SignalChip key={`${signal.id}-${idx}`} signal={signal} owner={owner} />
      ))}
    </div>
  );
};

interface ContactSignalsHoverCardProps {
  contact: { id: string; name: string; role: string; signals: SignalInstance[] };
  children: ReactNode;
}

// Wraps a contact avatar; on hover/focus, shows that contact's signals with a
// one-line detail each. Used in table/list views where chips aren't inline.
export const ContactSignalsHoverCard = ({
  contact,
  children,
}: ContactSignalsHoverCardProps) => {
  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side="top" align="start" sideOffset={8} className="w-[280px] p-0">
        <div className="px-4 pt-3.5 pb-2 border-b border-border">
          <p className="heading-100 text-foreground">{contact.name}</p>
          <p className="detail-200 text-muted-foreground mt-0.5">{contact.role}</p>
        </div>
        <div className="px-4 py-3 flex flex-col gap-2.5">
          {contact.signals.length === 0 ? (
            <span className="detail-200 text-muted-foreground">No signals yet</span>
          ) : (
            contact.signals.map((signal, idx) => {
              const def = SIGNAL_CATALOG[signal.id];
              if (!def) return null;
              const detail = resolveSignalDetail(signal, {
                kind: "contact",
                id: contact.id,
                name: contact.name,
                role: contact.role,
              });
              return (
                <div key={`${signal.id}-${idx}`} className="flex flex-col gap-1">
                  <span className="inline-flex">
                    <Tag variant={def.variant}>{def.label}</Tag>
                  </span>
                  <span className="detail-200 text-muted-foreground">
                    {detail.narrative ?? detail.headline ?? def.summary}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SignalChip;
