import { Sparkles } from "lucide-react";

interface BreezeBadgeProps {
  className?: string;
}

const BreezeBadge = ({ className = "" }: BreezeBadgeProps) => (
  <span
    className={`inline-flex items-center gap-0.5 rounded px-1 py-[2px] text-white align-middle ${className}`}
    style={{
      background:
        "linear-gradient(124deg, rgb(255, 56, 66) 7.66%, rgb(210, 6, 136) 100.76%)",
      border: "1px solid rgb(255, 56, 66)",
    }}
  >
    <Sparkles className="h-2 w-2" strokeWidth={2.5} fill="currentColor" />
    <span className="detail-200 leading-none" style={{ fontSize: "10px" }}>
      AI
    </span>
  </span>
);

export default BreezeBadge;
