import type { ReactNode } from "react";
import { Columns3, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onEditColumns?: () => void;
  // When provided, these actions replace the "Edit columns" button on the
  // right — e.g. bulk engagement actions shown while rows are selected.
  actions?: ReactNode;
}

/**
 * Thin toolbar that sits above a table header: a pill search field on the left
 * and an "Edit columns" control on the right. Shared chrome so every table gets
 * a consistent search + column-editing affordance.
 */
export const TableToolbar = ({
  searchPlaceholder = "Search",
  searchValue,
  onSearchChange,
  onEditColumns,
  actions,
}: TableToolbarProps) => (
  <div className="flex items-center justify-between gap-3 px-4 pt-2 pb-2 h-[44px] border-b border-border bg-[var(--color-fill-surface-default)]">
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        placeholder={searchPlaceholder}
        className="pl-9 rounded-full bg-card pt-0 pb-0 h-[30px]"
      />
    </div>
    {actions ?? (
      <Button
        variant="ghost"
        size="small"
        className="border border-transparent heading-50 whitespace-nowrap"
        onClick={onEditColumns}
      >
        <Columns3 className="h-4 w-4" />
        Edit columns
      </Button>
    )}
  </div>
);

export default TableToolbar;
