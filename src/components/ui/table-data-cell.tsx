import * as React from "react";
import { cn } from "@/lib/utils";

const TableDataCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "flex w-[115px] min-h-[72px] px-[var(--space-600,24px)] py-[var(--space-400,16px)] flex-col justify-center items-start border-b border-[var(--color-border-transitional-core-subtle)] bg-[var(--color-fill-field-default-alt)] body-100",
      className
    )}
    {...props}
  >
    {children}
  </td>
));
TableDataCell.displayName = "TableDataCell";

export { TableDataCell };
