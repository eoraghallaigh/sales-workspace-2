import { type ReactNode, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineFeedbackRowProps {
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
  thumbsDownWrapper?: (button: ReactNode) => ReactNode;
  className?: string;
}

export const InlineFeedbackRow = ({
  onThumbsUp,
  onThumbsDown,
  thumbsDownWrapper,
  className,
}: InlineFeedbackRowProps) => {
  const [isThumbsUp, setIsThumbsUp] = useState(false);

  const thumbsDownButton = (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onThumbsDown?.();
      }}
      className="p-0.5 rounded hover:bg-[var(--color-fill-accent-neutral-subtle-alt)] text-foreground/40 hover:text-foreground transition-colors"
    >
      <ThumbsDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className={cn("flex items-center justify-start", className)}>
      <p className="detail-200 text-muted-foreground mr-3">Give us your feedback</p>
      <div className="flex items-center gap-1">
        {onThumbsUp && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsThumbsUp(true);
              onThumbsUp();
            }}
            className={cn(
              "p-0.5 rounded transition-colors",
              isThumbsUp
                ? "bg-foreground text-background"
                : "hover:bg-[var(--color-fill-accent-neutral-subtle-alt)] text-foreground/40 hover:text-foreground"
            )}
          >
            <ThumbsUp className="h-3 w-3" />
          </button>
        )}
        {onThumbsDown && (
          thumbsDownWrapper ? thumbsDownWrapper(thumbsDownButton) : thumbsDownButton
        )}
      </div>
    </div>
  );
};
