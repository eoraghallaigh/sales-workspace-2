import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Tag from "@/components/Tag";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface QLData {
  requestType: string;
  requestDate: string;
  deadline: string;
}

export interface DragHandleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners: Record<string, any> | undefined;
}

interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    initials: string;
    role: string;
    avatarColor: string;
    recentTouches: number;
    enrolledInSequence: boolean;
    recentConversions?: number;
    hasPhone?: boolean;
    signals: Array<{
      variant: "green" | "blue" | "yellow" | "orange";
      text: string;
    }>;
    qlData?: QLData;
  };
  companyLogo?: string;
  isDragging?: boolean;
  dragHandleProps?: DragHandleProps;
  onContactClick?: (contactId: string) => void;
  onCallClick?: (contactId: string) => void;
  onEmailClick?: (contactId: string) => void;
  onPrepForCallClick?: (contactId: string) => void;
  onWorkQLClick?: (contactId: string) => void;
  onEnrollClick?: (contactId: string) => void;
  onConfirmDismiss?: (contactId: string, reasons?: string[]) => void;
}

const DISMISS_DURATION_MS = 6000;

const QUICK_REASONS: Array<{ value: string; label: string }> = [
  { value: "no-longer-at-company", label: "No longer at company" },
  { value: "wrong-role", label: "Wrong role" },
  { value: "bounced-unsubscribed", label: "Bounced" },
  { value: "bad-data", label: "Bad data" },
];

const ContactCard = ({
  contact,
  companyLogo,
  isDragging = false,
  dragHandleProps,
  onContactClick,
  onCallClick,
  onEmailClick,
  onWorkQLClick,
  onEnrollClick,
  onConfirmDismiss,
}: ContactCardProps) => {
  const recentConversions = contact.recentConversions ?? 0;
  const isQL = !!contact.qlData;
  const canCall = contact.hasPhone !== false;
  const noPhoneTooltip = "Contact has no phone number";

  const [isDismissing, setIsDismissing] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set());
  const [isDragHandleHovered, setIsDragHandleHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const progressRef = useRef(0);
  const submittedReasonsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!isDismissing) {
      progressRef.current = 0;
      setProgress(0);
      return;
    }
    if (isPaused) return;

    const initialProgress = progressRef.current;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const next = Math.min(1, initialProgress + elapsed / DISMISS_DURATION_MS);
      progressRef.current = next;
      setProgress(next);
      if (next >= 1) {
        setIsRemoving(true);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isDismissing, isPaused]);

  useEffect(() => {
    if (!isRemoving) return;
    const timer = setTimeout(() => {
      const reasons = submittedReasonsRef.current;
      onConfirmDismiss?.(contact.id, reasons.length > 0 ? reasons : undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [isRemoving, contact.id, onConfirmDismiss]);

  const startDismissal = () => {
    progressRef.current = 0;
    submittedReasonsRef.current = [];
    setProgress(0);
    setIsPaused(false);
    setFeedbackSubmitted(false);
    setSelectedReasons(new Set());
    setIsDismissing(true);
  };

  const handleCardMouseEnter = () => {
    if (!isDismissing || feedbackSubmitted) return;
    setIsPaused(true);
  };

  const handleCardMouseLeave = () => {
    if (!isDismissing || feedbackSubmitted) return;
    setIsPaused(false);
  };

  const toggleReason = (value: string, checked: boolean) => {
    setSelectedReasons((prev) => {
      const next = new Set(prev);
      if (checked) next.add(value);
      else next.delete(value);
      return next;
    });
  };

  const handleSubmitFeedback = () => {
    submittedReasonsRef.current = Array.from(selectedReasons);
    setFeedbackSubmitted(true);
    setIsPaused(false);
  };

  const secondsRemaining = Math.max(
    0,
    Math.ceil((DISMISS_DURATION_MS * (1 - progress)) / 1000),
  );

  const cardClassName = cn(
    "group relative flex h-full flex-col border border-border rounded-lg bg-white min-w-[360px] max-w-[360px] overflow-hidden transition-all duration-300 ease-out",
    isDragging
      ? "shadow-xl"
      : isDragHandleHovered
        ? "-translate-y-1 shadow-lg"
        : "shadow-100",
    isRemoving ? "opacity-0" : "",
  );

  const avatarSlot = (
    <div className="relative h-8 w-8 flex-shrink-0">
      <Avatar
        className={cn(
          "absolute inset-0 h-8 w-8 border-2 border-white transition-opacity",
          dragHandleProps && !isDismissing ? "group-hover:opacity-0" : "",
        )}
      >
        <AvatarImage
          src={companyLogo || companyLogoPlaceholder}
          alt={`${contact.name} avatar`}
        />
        <AvatarFallback className={contact.avatarColor}>
          {contact.initials}
        </AvatarFallback>
      </Avatar>
      {dragHandleProps && !isDismissing && (
        <button
          type="button"
          className="absolute inset-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 cursor-grab active:cursor-grabbing focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Reorder ${contact.name}`}
          onMouseEnter={() => setIsDragHandleHovered(true)}
          onMouseLeave={() => setIsDragHandleHovered(false)}
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
        >
          <GripVertical className="h-8 w-8" />
        </button>
      )}
    </div>
  );

  const enrolAction = onEnrollClick ? (
    <button
      type="button"
      className="flex items-center gap-1.5 body-125 text-foreground hover:text-text-interactive opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      onClick={() => onEnrollClick(contact.id)}
    >
      Enrol
      <TrellisIcon name="sequences" size={14} />
    </button>
  ) : null;

  const hideAction = onConfirmDismiss ? (
    <button
      type="button"
      className="flex items-center gap-1.5 body-125 text-foreground hover:text-text-interactive opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      onClick={startDismissal}
    >
      Hide
      <TrellisIcon name="hide" size={14} />
    </button>
  ) : null;

  const dismissalBody = isDismissing ? (
    feedbackSubmitted ? (
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <span className="body-125 font-semibold text-foreground">
          Feedback submitted!
        </span>
      </div>
    ) : (
      <div className="flex flex-1 flex-col px-4 pt-5 pb-4 gap-3">
        <div className="body-125 font-semibold text-foreground">
          Removing contact in... {secondsRemaining}
        </div>
        <div className="body-125 font-semibold text-foreground">Tell us why</div>
        <div className="flex flex-col gap-2">
          {QUICK_REASONS.map((option) => (
            <label
              key={option.value}
              htmlFor={`${contact.id}-reason-${option.value}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id={`${contact.id}-reason-${option.value}`}
                checked={selectedReasons.has(option.value)}
                onCheckedChange={(value) =>
                  toggleReason(option.value, value === true)
                }
              />
              <span className="body-100 text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
        <Button
          variant="secondary"
          size="medium"
          className="mt-auto self-start"
          onClick={handleSubmitFeedback}
        >
          Submit feedback
        </Button>
      </div>
    )
  ) : null;

  const dismissalHeader = (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      {avatarSlot}
      <div className="min-w-0">
        <div className="body-125 text-text-interactive truncate">
          {contact.name}
        </div>
        <div className="detail-200 text-muted-foreground truncate">
          {contact.role}
        </div>
      </div>
    </div>
  );

  if (isQL) {
    return (
      <div
        className={cardClassName}
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
      >
        <div
          className="flex items-center justify-between p-4 rounded-t-lg"
          style={{ background: "var(--trellis-color-yellow-200)" }}
        >
          {isDismissing ? (
            dismissalHeader
          ) : (
            <>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {avatarSlot}
                <div className="min-w-0">
                  <div
                    className="link-200 cursor-pointer hover:text-text-interactive transition-colors truncate"
                    onClick={() => onContactClick?.(contact.id)}
                  >
                    {contact.name}
                  </div>
                  <div className="detail-200 text-muted-foreground truncate">
                    {contact.role}
                  </div>
                </div>
              </div>
              <div
                className="flex justify-center items-center heading-25 text-white"
                style={{
                  padding: "1px var(--space-200, 8px)",
                  borderRadius: "999999px",
                  background: "var(--color-fill-accent-orange-default, #C93700)",
                }}
              >
                QL
              </div>
            </>
          )}
        </div>

        {dismissalBody ?? (
          <div className="flex flex-1 flex-col px-4 py-5">
            <div className="flex flex-col gap-1 mb-6">
              <div className="body-125 font-semibold text-foreground">
                {contact.qlData!.requestType}
              </div>
              <div className="detail-200 text-muted-foreground">
                {contact.qlData!.requestDate}
              </div>
              <div className="detail-200 text-trellis-red-900 font-medium">
                Work or reject before {contact.qlData!.deadline}
              </div>
            </div>

            <div className="mt-auto flex items-center gap-6">
              <Button
                variant="primary"
                size="medium"
                onClick={() => onWorkQLClick?.(contact.id)}
              >
                Work QL
              </Button>
              {enrolAction}
              {hideAction}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cardClassName}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      <div
        className="flex items-center justify-between p-4 rounded-t-lg"
        style={{ background: "var(--color-fill-secondary-hover)" }}
      >
        {isDismissing ? (
          dismissalHeader
        ) : (
          <>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {avatarSlot}
              <div className="min-w-0">
                <div
                  className="body-125 text-text-interactive cursor-pointer hover:text-text-interactive transition-colors truncate"
                  onClick={() => onContactClick?.(contact.id)}
                >
                  {contact.name}
                </div>
                <div className="detail-200 text-muted-foreground truncate">
                  {contact.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-4 h-4 flex items-center justify-center"
                onClick={() => onEmailClick?.(contact.id)}
              >
                <TrellisIcon name="email" size={16} />
              </button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={!canCall ? "cursor-not-allowed" : undefined}>
                    <button
                      className="w-4 h-4 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
                      onClick={() => onCallClick?.(contact.id)}
                      disabled={!canCall}
                    >
                      <TrellisIcon name="calling" size={16} />
                    </button>
                  </span>
                </TooltipTrigger>
                {!canCall && (
                  <TooltipContent>{noPhoneTooltip}</TooltipContent>
                )}
              </Tooltip>
              <button className="w-4 h-4 flex items-center justify-center">
                <TrellisIcon name="linkedin" size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {dismissalBody ?? (
        <div className="flex flex-1 flex-col pt-3 pb-4">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-0.5 px-4">
              <div className="flex items-center gap-2 detail-200 text-muted-foreground">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    recentConversions > 0
                      ? "bg-trellis-green-600"
                      : "bg-muted-foreground"
                  }`}
                />
                {recentConversions > 0
                  ? `${recentConversions} recent conversion${recentConversions !== 1 ? "s" : ""}`
                  : "No recent conversions"}
              </div>
              <div className="flex items-center gap-2 detail-200 text-muted-foreground">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    contact.recentTouches > 0
                      ? "bg-trellis-green-600"
                      : "bg-muted-foreground"
                  }`}
                />
                {contact.recentTouches > 0
                  ? `${contact.recentTouches} recent touch${contact.recentTouches !== 1 ? "es" : ""}`
                  : "No recent touches"}
              </div>
              <div className="flex items-center gap-2 detail-200 text-muted-foreground">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    contact.enrolledInSequence
                      ? "bg-trellis-purple-600"
                      : "bg-muted-foreground"
                  }`}
                />
                {contact.enrolledInSequence
                  ? "Enrolled in a sequence"
                  : "Not enrolled in a sequence"}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 px-4">
              {contact.signals.length > 0 ? (
                contact.signals.map((signal, idx) => (
                  <Tag key={idx} variant={signal.variant}>
                    {signal.text}
                  </Tag>
                ))
              ) : (
                <span className="detail-200 text-muted-foreground">
                  No signals found
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto pt-12 flex items-center gap-6 px-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={!canCall ? "cursor-not-allowed" : undefined}>
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={() => onCallClick?.(contact.id)}
                    disabled={!canCall}
                  >
                    Call
                    <TrellisIcon name="calling" size={14} className="ml-1" />
                  </Button>
                </span>
              </TooltipTrigger>
              {!canCall && (
                <TooltipContent>{noPhoneTooltip}</TooltipContent>
              )}
            </Tooltip>
            {enrolAction}
            {hideAction}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactCard;
