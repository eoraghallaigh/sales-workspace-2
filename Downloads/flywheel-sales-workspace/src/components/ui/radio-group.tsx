import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

/*
 * Radio Button — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=7802-34263
 * Light mode values only. Token paths annotated inline.
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-[8px]", className)} // trellisComp/radioButtonGroup/space/verticalOnly
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-figma-component-key="7802:34263"
      className={cn(
        // Size & shape
        "aspect-square h-[16px] w-[16px] shrink-0", // trellisComp/radioButton/icon/size
        "rounded-full border border-solid border-[#141414]", // trellisComp/radioButton/icon/borderColor/unselected/default
        "bg-white",
        // Focus
        "outline-none ring-offset-2 ring-offset-white",
        "focus-visible:ring-2 focus-visible:ring-[#0050c7]", // trellisSys/color/expressive/focus/default
        // Error (opt-in via aria-invalid)
        "aria-[invalid=true]:border-[#ac0020]", // expressive/danger/default
        // Disabled
        "disabled:cursor-not-allowed disabled:border-[#e6e6e6]", // trellisComp/radioButton/icon/borderColor/unselected/disabled
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="h-[8px] w-[8px] rounded-full bg-[#141414]" />{/* selected-state indicator dot */}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
