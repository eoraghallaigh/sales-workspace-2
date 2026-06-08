import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"
import checkIndicator from "@/assets/checkbox-indicator.svg"

/*
 * Checkbox — themed.
 * Transitional: 21px box, grey core border, 15px tick.
 * Alpha: 16px box, dark #141414 border, 12px tick (Trellis Alpha node 7802-33678).
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  const isAlpha = theme === "alpha"
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 rounded-[4px] border bg-fill-field-default-alt ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-fill-field-default-alt",
        isAlpha
          ? "h-[16px] w-[16px] border-[#141414] data-[state=checked]:border-[#141414]"
          : "h-[21px] w-[21px] border-core data-[state=checked]:border-interactive-pressed",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center")}>
        <img src={checkIndicator} alt="" className={isAlpha ? "h-[12px] w-[12px]" : "h-[15px] w-[15px]"} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
