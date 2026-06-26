import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  label: string;
  // When true, shows a spinner instead of the dot (e.g. an in-flight save).
  loading?: boolean;
  // Tailwind background class for the status dot (e.g. "bg-trellis-green-600").
  dotClassName?: string;
  className?: string;
}

/*
 * StatusIndicator — the dot + muted label status line used across the app
 * (e.g. "Enrolled in a sequence" on contact cards). `loading` swaps the dot
 * for a spinner so it can double as a transient saving indicator.
 */
export const StatusIndicator = ({
  label,
  loading = false,
  dotClassName = "bg-muted-foreground",
  className,
}: StatusIndicatorProps) => (
  <div className={cn("flex items-center gap-2 detail-200 text-muted-foreground", className)}>
    {loading ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : (
      <div className={cn("h-2.5 w-2.5 rounded-full", dotClassName)} />
    )}
    {label}
  </div>
);

export default StatusIndicator;
