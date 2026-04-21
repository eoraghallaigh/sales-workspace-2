import { ThumbsUp, ThumbsDown, Sparkles, Info } from "lucide-react";
import { SuggestedAction } from "@/data/dealsData";
import { Button } from "@/components/ui/button";

interface SuggestedActionCardProps {
  action: SuggestedAction;
}

const SuggestedActionCard = ({ action }: SuggestedActionCardProps) => {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] gap-2">
      <div className="flex h-full flex-col border border-border rounded-lg bg-white overflow-hidden shadow-100">
        <div className="flex flex-1 flex-col p-4 gap-3">
          <h4 className="heading-100 text-foreground">{action.title}</h4>
          <p className="body-100 text-muted-foreground">{action.description}</p>
          <div className="flex items-center gap-3">
            {action.hasGenerateEmail && (
              <Button
                variant="transparent"
                size="extra-small"
                className="heading-50 rounded-full border border-[var(--trellis-color-magenta-800)] text-[var(--trellis-color-magenta-900)] hover:text-[var(--trellis-color-magenta-1000)]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate email
              </Button>
            )}
            <Button
              variant="transparent"
              size="extra-small"
              className="heading-50 rounded-full border border-[var(--trellis-color-magenta-800)] text-[var(--trellis-color-magenta-900)] hover:text-[var(--trellis-color-magenta-1000)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask assistant
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          <span className="detail-100 text-subtle">Generated {action.generatedAt}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedActionCard;
