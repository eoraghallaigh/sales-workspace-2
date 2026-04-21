import * as React from "react";
import { cn } from "@/lib/utils";

const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "flex w-[115px] min-h-[44px] max-h-[44px] px-[var(--space-600,24px)] py-[var(--space-300,12px)] flex-col justify-center items-start border-b border-[var(--color-border-transitional-core-subtle)] bg-[var(--color-specialty-table-header-default)] table-header-text",
      className
    )}
    {...props}
  >
    {children}
  </th>
));
TableHeaderCell.displayName = "TableHeaderCell";

export { TableHeaderCell };
