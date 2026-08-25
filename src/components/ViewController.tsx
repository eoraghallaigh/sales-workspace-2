import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type EntityView = "companies" | "contacts";

interface ViewControllerProps {
  value: EntityView;
  onChange: (view: EntityView) => void;
}

const options: { value: EntityView; label: string }[] = [
  { value: "companies", label: "Companies" },
  { value: "contacts", label: "Contacts" },
];

const ViewController = ({ value, onChange }: ViewControllerProps) => (
  <div className="flex items-center" role="group" aria-label="Switch entity view">
    {options.map((opt, i) => {
      const isActive = value === opt.value;
      const isFirst = i === 0;
      const isLast = i === options.length - 1;
      return (
        <Tooltip key={opt.value}>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(opt.value)}
              className={`relative flex items-center px-3 py-1.5 detail-200 border border-core-subtle transition-colors ${
                isFirst ? "rounded-l-[4px] -mr-px" : isLast ? "rounded-r-[4px]" : "-mr-px"
              } ${
                isActive
                  ? "bg-[var(--page-bg)] z-[1] text-foreground"
                  : "bg-card text-muted-foreground hover:bg-[var(--page-bg)]"
              }`}
            >
              {opt.label}
            </button>
          </TooltipTrigger>
          <TooltipContent>{opt.label}</TooltipContent>
        </Tooltip>
      );
    })}
  </div>
);

export default ViewController;
