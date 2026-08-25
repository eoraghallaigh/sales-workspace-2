import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[26px] w-[52px] shrink-0 cursor-pointer items-center rounded-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e9ed6] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-[var(--color-fill-surface-recessed,#dfe3eb)] border data-[state=checked]:border-foreground data-[state=unchecked]:border-[var(--color-border-core-default,#cbd6e2)]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none flex items-center justify-center h-[24px] w-[24px] rounded-[5px] bg-white shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-[26px] data-[state=unchecked]:translate-x-0"
      )}
    >
      <Check className="h-3 w-3 stroke-[3] text-foreground [[data-state=unchecked]_&]:hidden" />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
