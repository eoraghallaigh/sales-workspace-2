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
      "flex flex-1 flex-col items-center gap-2 text-center px-5 py-4 bg-card border border-border rounded-[8px] shadow-100",
      className,
    )}
  >
    <div className="flex items-center justify-center gap-1.5">
      <span className="heading-25 uppercase text-foreground">{label}</span>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="text-[28px] leading-9 font-bold underline decoration-2 underline-offset-4 text-[var(--color-text-interactive-default)]">{value}</div>
      {secondary && <div className="body-100 text-foreground">{secondary}</div>}
    </div>
  </Card>
);

export default DataWell;
