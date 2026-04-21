import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Optional label shown above the bar on the left */
  label?: string
  /** Whether to show the percentage text above (right) and inside the bar */
  showValue?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, label, showValue = false, ...props }, ref) => {
  const pct = value || 0

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="body-100 text-foreground">{label}</span>
          )}
          {showValue && (
            <span className="heading-200 text-foreground">{pct}%</span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden",
          "rounded-[var(--borderRadius-100,4px)]",
          "bg-[var(--color-fill-surface-recessed,#F0F0F0)]",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full flex items-center justify-center gap-[var(--space-0,0)] rounded-[var(--borderRadius-100,4px)] transition-all"
          style={{
            width: `${pct}%`,
            padding: 'var(--space-0, 0)',
            background: 'linear-gradient(90deg, var(--color-fill-transitional-progress-success-gradient-color-1, #00823A) 0%, var(--color-fill-transitional-progress-success-gradient-color-2, #00823A) 100%)',
          }}
        >
          {showValue && pct > 0 && (
            <span className="heading-50 text-white whitespace-nowrap">
              {pct}%
            </span>
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
