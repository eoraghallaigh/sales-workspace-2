import * as React from "react";
import { cn } from "@/lib/utils";

const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "flex w-[115px] h-[35px] px-[var(--space-600,24px)] py-0 flex-col justify-center items-start whitespace-nowrap border-b border-r border-[var(--color-border-transitional-core-subtle)] last:border-r-0 bg-[var(--color-fill-surface-recessed)] table-header-text",
      className
    )}
    {...props}
  >
    {children}
  </th>
));
TableHeaderCell.displayName = "TableHeaderCell";

export { TableHeaderCell };
