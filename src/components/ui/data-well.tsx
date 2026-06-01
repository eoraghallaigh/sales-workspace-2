import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DataWellProps {
  label: string;
  value: string;
  tooltip?: string;
  secondary?: string;
  className?: string;
}

export const DataWell = ({ label, value, tooltip, secondary, className }: DataWellProps) => (
  <Card
    className={cn(
      "flex flex-1 flex-col items-start gap-1 text-left px-5 py-4 bg-card border border-border rounded-100 shadow-100",
      className,
    )}
  >
    <div className="flex items-center gap-2">
      <span className="heading-25 text-foreground">{label}</span>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <div className="flex flex-col items-start gap-0.5">
      <div className="heading-700 text-foreground">{value}</div>
      {secondary && <div className="detail-100 text-muted-foreground">{secondary}</div>}
    </div>
  </Card>
);

export default DataWell;
