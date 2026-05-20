import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"
import checkIndicator from "@/assets/checkbox-indicator.svg"

/*
 * Checkbox — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=7802-33678
 * Light mode values only. Token paths annotated inline.
 *
 * Error state (red border) is opt-in via aria-invalid on the root.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-figma-component-key="7802:33678"
    className={cn(
      // Size & shape
      "peer h-[16px] w-[16px] shrink-0", // trellisComp/radioButton/icon/size (16, shared with checkbox)
      "rounded-[4px]", // trellisSys/border/radius/75
      "border border-solid border-[#141414]", // trellisComp/checkbox/icon/borderColor/unchecked/default
      "bg-white",
      // Focus
      "ring-offset-background outline-none",
      "focus-visible:ring-2 focus-visible:ring-[#0050c7] focus-visible:ring-offset-2", // trellisSys/color/expressive/focus/default
      // Checked
      "data-[state=checked]:bg-white data-[state=checked]:border-[#141414]",
      // Error (opt-in via aria-invalid)
      "aria-[invalid=true]:border-[#ac0020]", // trellisComp/checkbox/icon/borderColor/unchecked/error
      // Disabled
      "disabled:cursor-not-allowed disabled:border-[#e6e6e6]", // trellisComp/checkbox/icon/borderColor/unchecked/disabled
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center")}>
      <img src={checkIndicator} alt="" className="h-[12px] w-[12px]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
