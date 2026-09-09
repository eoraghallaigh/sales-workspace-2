import { cn } from "@/lib/utils";

// A thin drag target on a header cell's right edge. The header cell must be
// positioned (sticky counts) so this anchors to it. Pair with useResizableColumns.
export const ColumnResizeHandle = ({
  onStart,
  className,
}: {
  onStart: (clientX: number) => void;
  className?: string;
}) => (
  <span
    role="separator"
    aria-orientation="vertical"
    aria-label="Resize column"
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onStart(e.clientX);
    }}
    className={cn(
      "absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none hover:bg-text-interactive/30 active:bg-text-interactive/50",
      className,
    )}
  />
);

export default ColumnResizeHandle;
