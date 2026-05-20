import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Input — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=7319-2784
 * Light mode values only. Token paths annotated inline.
 *
 * State variants beyond default/focus/disabled (error, caution, success) are
 * the responsibility of the form-field wrapper, not the Input itself.
 * Callers can pass `aria-invalid` and override border color via className.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-figma-component-key="7319:2784"
        className={cn(
          // Layout & typography
          "flex h-[40px] w-full px-3 py-2", // trellisSys/dimension/component/size/standard/md (40)
          "text-[14px] leading-[20px] font-normal", // Body Md — HubSpot Sans 14/20/400 (inherited via body font-family)
          // Visual
          "rounded-[6px]", // trellisSys/border/radius/100
          "border border-solid border-[#cccccc]", // trellisSys/color/foundational/border/subtle/default
          "bg-white", // trellisSys/color/foundational/bg/normal/default
          "text-[#141414]", // trellisSys/color/foundational/fg/normal/default
          "placeholder:text-[#666666]", // trellisSys/color/foundational/fg/subtle/default
          // Focus — ring around the input, border stays subtle
          "outline-none ring-offset-2 ring-offset-white",
          "focus-visible:ring-2 focus-visible:ring-[#0050c7]", // trellisSys/color/expressive/focus/default
          // Error (consumer opts in via aria-invalid)
          "aria-[invalid=true]:border-[#d9002b]", // trellisSys/color/semantic/error/border/default
          // Disabled
          "disabled:cursor-not-allowed disabled:border-[#e6e6e6] disabled:bg-[#f5f5f5] disabled:text-[#8a8a8a]", // foundational/border/subtle/disabled, fg/subtle/disabled
          // File input
          "file:border-0 file:bg-transparent file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
