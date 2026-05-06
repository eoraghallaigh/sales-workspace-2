import { ReactNode } from "react";
import { CheckCircle2, Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type PvsScore = "High" | "Medium" | "Low";

const pvsCopy: Record<PvsScore, { title: string; points: string[] }> = {
  High: {
    title: "High value prospect",
    points: [
      "Already using our free product",
      "75 employees",
      "Extensive tech adoption (28+ technologies)",
      "Contacts use work emails",
      "Previous sales activity (engaged ~8 months ago)",
      "Recently founded (2020)",
      "Recent HINQL: ISC",
    ],
  },
  Medium: {
    title: "Medium value prospect",
    points: [
      "Some product usage in the last 30 days",
      "Mid-sized team (~30 employees)",
      "Moderate tech adoption (12 technologies)",
      "Contacts use work emails",
      "No recent sales activity",
    ],
  },
  Low: {
    title: "Low value prospect",
    points: [
      "Limited product usage",
      "Small team (<10 employees)",
      "Few buying signals",
      "Mixed personal and work emails",
    ],
  },
};

interface PvsTooltipProps {
  pvsScore?: PvsScore;
  children: ReactNode;
}

const PvsTooltip = ({ pvsScore, children }: PvsTooltipProps) => {
  if (!pvsScore) return <>{children}</>;

  const copy = pvsCopy[pvsScore];

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-default">
          {children}
          <Info
            className="text-muted-foreground flex-shrink-0"
            style={{ width: 12, height: 12 }}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-auto max-w-[440px] p-0 rounded-[3px] border border-border bg-card shadow-[0px_1px_12px_0px_rgba(0,0,0,0.08)]"
      >
        <div className="flex flex-col">
          <div className="px-5 pt-5 pb-0">
            <p className="heading-100 text-foreground">{copy.title}</p>
          </div>
          <div className="px-6 py-5">
            <ul className="flex flex-col gap-3">
              {copy.points.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-trellis-green-800 flex-shrink-0"
                    strokeWidth={2}
                  />
                  <span className="body-100 text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default PvsTooltip;
