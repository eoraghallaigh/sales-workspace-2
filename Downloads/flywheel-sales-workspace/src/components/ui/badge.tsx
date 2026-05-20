import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Badge — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=7835-76060
 *
 * Pill-shaped status/label chip. Trellis Alpha defines Badge colors via the
 * shared avatar palette (red/orange/yellow/green/teal/blue/purple/lavender/magenta),
 * all with subtle backgrounds and dark text. Status-style filled variants
 * (status-orange, status-blue, etc.) are retained so the 10 existing consumers
 * don't break — they keep a bolder, filled treatment for high-visibility status.
 *
 * New canonical color variants (red/orange/yellow/green/teal/blue/purple/lavender/magenta)
 * use the Trellis Alpha subtle backgrounds for new code.
 */
const badgeVariants = cva(
  cn(
    "inline-flex justify-center items-center",
    "rounded-full", // pill — trellisSys/border/radius/full
    "transition-colors focus:outline-none focus:ring-2 focus:ring-[#0050c7] focus:ring-offset-2" // expressive/focus/default
  ),
  {
    variants: {
      size: {
        // sm = 24px tall (avatar/container/height/sm); 12/18/400 Body Sm + 3px vertical padding
        sm: "h-[24px] px-[8px] text-[12px] leading-[18px] font-normal",
        // md = 32px tall (avatar/container/height/md); 14/20/400 Body Md + 6px vertical padding
        md: "h-[32px] px-[12px] text-[14px] leading-[20px] font-normal",
      },
      variant: {
        // Default & solid styles
        default: "border-transparent bg-[#333333] text-white hover:bg-[#4d4d4d]", // button/container/backgroundColor/primary/default
        secondary: "border-transparent bg-[#f0f0f0] text-[#141414] hover:bg-[#ebebeb]", // foundational/bg/subtle
        destructive: "border-transparent bg-[#ac0020] text-white hover:bg-[#d9002b]", // expressive/danger/default
        outline: "border border-[#cccccc] bg-transparent text-[#141414]", // foundational/border/subtle
        // Trellis Alpha avatar-palette variants (subtle backgrounds, dark text)
        red: "border-transparent bg-[#fcece9] text-[#141414]", // avatar/container/backgroundColor/red/default
        orange: "border-transparent bg-[#fcece6] text-[#141414]",
        yellow: "border-transparent bg-[#fcf6e6] text-[#141414]",
        green: "border-transparent bg-[#daefe1] text-[#141414]",
        teal: "border-transparent bg-[#e0fcfa] text-[#141414]",
        blue: "border-transparent bg-[#e1f2fb] text-[#141414]",
        purple: "border-transparent bg-[#efeefd] text-[#141414]",
        lavender: "border-transparent bg-[#efe7f0] text-[#141414]",
        magenta: "border-transparent bg-[#fcebf2] text-[#141414]",
        // Legacy accent-* aliases — now use the same subtle palette
        "accent-blue": "border-transparent bg-[#e1f2fb] text-[#141414]",
        "accent-green": "border-transparent bg-[#daefe1] text-[#141414]",
        // Legacy status-* variants — remapped to Trellis Alpha subtle palette to
        // match the rest of the design system. Dark text (#141414) on all for readability.
        "status-orange": "border-transparent bg-[#fcece6] text-[#141414]", // avatar/container/backgroundColor/orange
        "status-blue": "border-transparent bg-[#e1f2fb] text-[#141414]", // avatar/container/backgroundColor/blue
        "status-yellow": "border-transparent bg-[#fcf6e6] text-[#141414]", // avatar/container/backgroundColor/yellow
        "status-green": "border-transparent bg-[#daefe1] text-[#141414]", // avatar/container/backgroundColor/green
        "status-gray": "border-transparent bg-[#f0f0f0] text-[#141414]", // foundational/bg/subtle
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      data-figma-component-key="7824:75116"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
