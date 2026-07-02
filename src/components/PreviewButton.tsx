import { PanelRightClose } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/*
 * PreviewButton — circular icon that reveals on row hover and opens the company
 * side panel. Place inside a row marked with the `group` class; it stays hidden
 * until the row is hovered (or the button itself is focused).
 */
export const PreviewButton = ({ onClick }: { onClick: () => void }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        onClick={onClick}
        aria-label="Preview"
        className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground opacity-0 transition-opacity hover:bg-trellis-neutral-100 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <PanelRightClose className="h-4 w-4" />
      </button>
    </TooltipTrigger>
    <TooltipContent>Preview</TooltipContent>
  </Tooltip>
);
