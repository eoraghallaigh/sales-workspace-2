import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AILoader } from "@/components/ui/ai-loader";

const RESEARCH_STEPS: string[][] = [
  [
    "Reading Portal 53 data and recent engagements",
    "Pulling account history and recent activity from Portal 53",
    "Reviewing Portal 53 records and the latest touchpoints",
  ],
  [
    "Searching the web for recent company news",
    "Scanning the web for fresh signals and announcements",
    "Gathering external news and market context",
  ],
  [
    "Researching the strongest outreach targets",
    "Identifying the best people to reach out to",
    "Mapping the decision-makers worth contacting",
  ],
  [
    "Packaging the findings into a TL;DR",
    "Summarising everything into a quick TL;DR",
    "Distilling the research into a TL;DR",
  ],
];

const RESEARCH_OPTIONAL: string[] = [
  "Surfacing relevant contacts not yet in the CRM",
  "Finding off-CRM contacts worth adding",
  "Looking for net-new contacts beyond the CRM",
];

const SEQUENCE_STEPS: string[][] = [
  [
    "Reviewing relevant product knowledge",
    "Pulling in the right product talking points",
    "Brushing up on product details for this persona",
  ],
  [
    "Matching your personal writing style",
    "Consulting your style guide so it sounds like you",
    "Tuning the tone to match your past emails",
  ],
  [
    "Checking against brand voice guidelines",
    "Aligning the copy with the brand style guide",
    "Making sure it follows brand voice rules",
  ],
];

const pick = (options: string[]) => options[Math.floor(Math.random() * options.length)];

const buildResearchSteps = (): string[] => {
  const steps = RESEARCH_STEPS.map(pick);
  if (Math.random() < 0.6) steps.push(pick(RESEARCH_OPTIONAL));
  return steps;
};

const buildSequenceSteps = (): string[] => SEQUENCE_STEPS.map(pick);

interface AgentReasoningStepsProps {
  kind: "research" | "sequence";
  stepMs?: number;
  className?: string;
}

const AgentReasoningSteps = ({ kind, stepMs = 6000, className }: AgentReasoningStepsProps) => {
  const [steps] = useState<string[]>(() =>
    kind === "research" ? buildResearchSteps() : buildSequenceSteps(),
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= steps.length - 1) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((i) => Math.min(i + 1, steps.length - 1));
    }, stepMs);
    return () => window.clearTimeout(timer);
  }, [activeIndex, steps.length, stepMs]);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {steps.map((step, idx) => {
        if (idx > activeIndex) return null;
        const isActive = idx === activeIndex;
        return (
          <div key={idx} className="flex items-center gap-2">
            {isActive ? (
              <AILoader size={32} />
            ) : (
              <Check className="h-3.5 w-3.5 text-trellis-green-700 shrink-0" />
            )}
            <span className={isActive ? "body-100 reasoning-shimmer" : "body-100 text-muted-foreground"}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AgentReasoningSteps;
