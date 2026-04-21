import { CheckCircle2, AlertCircle } from "lucide-react";
import { DealInsight } from "@/data/dealsData";

interface DealInsightsCardProps {
  insights: DealInsight[];
  variant?: "default" | "card";
}

const DealInsightsCard = ({ insights, variant = "default" }: DealInsightsCardProps) => {
  if (variant === "card") {
    return (
      <div className="flex h-full flex-col border border-border rounded-lg bg-white min-w-[280px] max-w-[320px] overflow-hidden shadow-100">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 rounded-t-lg"
          style={{ background: "var(--color-fill-secondary-hover)" }}
        >
          <div className="flex items-center gap-3">
            <h4 className="link-200">Deal Insights</h4>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-4 py-5 gap-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-center gap-3">
              {insight.status === "positive" ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--color-fill-positive-default)]" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-[var(--color-fill-alert-default)]" />
              )}
              <span className={insight.isBold ? "detail-100 !font-bold text-text-interactive cursor-pointer" : "detail-100 text-subtle"}>
                {insight.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-white p-6 flex flex-col gap-4 h-full shadow-100">
      <h4 className="heading-100 text-foreground">Deal Insights</h4>
      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-center gap-3">
            {insight.status === "positive" ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--color-fill-positive-default)]" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-[var(--color-fill-alert-default)]" />
            )}
            <span className={insight.isBold ? "detail-100 !font-bold text-text-interactive cursor-pointer" : "detail-100 text-subtle"}>
              {insight.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealInsightsCard;
