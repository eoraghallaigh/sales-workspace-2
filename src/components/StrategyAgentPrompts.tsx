import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { AiStarIconGradient } from "@/components/ui/ai-star-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";

interface StrategyEmptyBannerProps {
  companyName: string;
  isRunning: boolean;
  onGenerateBoth: () => void;
  onRunResearchOnly: () => void;
}

export const StrategyEmptyBanner = ({
  companyName,
  isRunning,
  onGenerateBoth,
  onRunResearchOnly,
}: StrategyEmptyBannerProps) => (
  <div className="flex items-start gap-4 rounded-100 border border-core-subtle bg-card px-6 py-5 mb-8">
    <div className="shrink-0 mt-0.5">
      <TrellisIcon name="artificialIntelligence" size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="heading-200 text-foreground">
        {companyName} hasn't been prepped yet
      </h3>
      <p className="body-100 text-muted-foreground mt-1">
        Run the prospecting agents to generate business intelligence, recent
        triggers, and personalized email sequences for each outreach target.
      </p>
      <div className="flex items-center gap-4 mt-4">
        <Button
          variant="default"
          size="medium"
          onClick={onGenerateBoth}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Generating strategy…
            </>
          ) : (
            "Generate strategy"
          )}
        </Button>
        <button
          type="button"
          onClick={onRunResearchOnly}
          disabled={isRunning}
          className="body-100 text-text-interactive hover:underline disabled:opacity-50"
        >
          Run research only
        </button>
      </div>
    </div>
  </div>
);

interface ResearchEmptyCardProps {
  companyName: string;
  isRunning: boolean;
  onRun: () => void;
  cooldownUntil?: string;
}

function formatCooldownTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function useIsCooldownActive(cooldownUntil?: string): boolean {
  const [active, setActive] = useState(() => {
    if (!cooldownUntil) return false;
    return new Date(cooldownUntil).getTime() > Date.now();
  });

  useEffect(() => {
    if (!cooldownUntil) return;
    const remaining = new Date(cooldownUntil).getTime() - Date.now();
    if (remaining <= 0) {
      setActive(false);
      return;
    }
    setActive(true);
    const timer = window.setTimeout(() => setActive(false), remaining);
    return () => window.clearTimeout(timer);
  }, [cooldownUntil]);

  return active;
}

export const ResearchEmptyCard = ({
  companyName,
  isRunning,
  onRun,
  cooldownUntil,
}: ResearchEmptyCardProps) => {
  const isBlocked = useIsCooldownActive(cooldownUntil);
  const isDisabled = isRunning || isBlocked;

  return (
    <div className="rounded-100 border border-dashed border-core-subtle bg-card px-6 py-8 text-center mb-12">
      <div className="flex justify-center mb-3">
        <AiStarIconGradient size={24} />
      </div>
      <h3 className="heading-200 text-foreground">
        {companyName} hasn't been prepped yet
      </h3>
      {!isBlocked && (
        <p className="body-100 text-muted-foreground mt-2 max-w-md mx-auto">
          Generate company research and personalized email sequences for every
          outreach target.
        </p>
      )}
      {isBlocked && cooldownUntil && (
        <Alert type="warning" className="mt-4 mx-auto max-w-md text-left">
          <AlertDescription>
            Strategy generation is blocked until{" "}
            <span className="font-semibold">{formatCooldownTime(cooldownUntil)}</span>{" "}
            today because there is another automation running on this company.
          </AlertDescription>
        </Alert>
      )}
      <div className="mt-5 flex justify-center">
        <Button
          variant="ai"
          size="medium"
          onClick={onRun}
          disabled={isDisabled}
        >
          {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRunning ? "Creating prospecting strategy…" : "Create prospecting strategy"}
        </Button>
      </div>
    </div>
  );
};

interface SequenceSectionPromptProps {
  isRunning: boolean;
  onRun: () => void;
  researchAvailable: boolean;
}

export const SequenceSectionPrompt = ({
  isRunning,
  onRun,
  researchAvailable,
}: SequenceSectionPromptProps) => (
  <div className="flex items-center justify-between gap-4 rounded-100 border border-dashed border-core-subtle bg-card px-4 py-3 mb-4">
    <div className="flex items-center gap-3 min-w-0">
      <AiStarIconGradient size={20} />
      <p className="body-100 text-foreground">
        Sequences haven't been drafted for these targets yet.
      </p>
    </div>
    <Button
      variant={researchAvailable ? "ai" : "ai-secondary"}
      size="small"
      onClick={onRun}
      disabled={isRunning}
      className="shrink-0"
    >
      {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
      {isRunning ? "Drafting sequences…" : "Run sequence agent"}
    </Button>
  </div>
);
