import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Button — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=3032-2804
 * Light mode values only. Token paths annotated inline next to each value.
 *
 * Variant API:
 *   primary | secondary | tertiary  -> canonical Trellis Alpha variants
 *   default | outline | ghost | secondary-alt | destructive | link | transparent
 *                                    -> legacy aliases retained so existing consumers
 *                                       (236 usages across 53 files) don't break.
 *   The legacy aliases produce the Trellis Alpha look, not the pre-Alpha look.
 *
 * Size API:
 *   md (40) | sm (32) | xs (24)     -> canonical Trellis Alpha sizes
 *   default | lg | icon | medium | small | extra-small  -> legacy aliases
 *
 * Orthogonal flags:
 *   destructive (bool) — overlays expressive/danger colors on any variant
 *   iconOnly (bool)    — collapses padding for icon-only buttons
 */

// Trellis Alpha variant styles, defined once and aliased into multiple legacy names below.
const primaryStyles = cn(
  "bg-[#333333] text-white border border-[#333333]",
  "hover:bg-[#4d4d4d] hover:border-[#4d4d4d] hover:text-[#f0f0f0]",
  "active:bg-[#666666] active:border-[#666666] active:text-[#ebebeb]",
  "disabled:bg-[#f5f5f5] disabled:border-[#e6e6e6] disabled:text-[#8a8a8a]",
)
// trellisComp/button/container/{backgroundColor,borderColor}/primary/{default,hover,pressed,disabled}
// trellisComp/button/label/color/primary/{default,hover,pressed,disabled}

const secondaryStyles = cn(
  "bg-white text-[#141414] border border-[#8a8a8a]",
  "hover:bg-[#f0f0f0] hover:border-[#8a8a8a] hover:text-[#4d4d4d]",
  "active:bg-[#e6e6e6] active:border-[#8a8a8a] active:text-[#666666]",
  "disabled:bg-[#f5f5f5] disabled:border-[#e6e6e6] disabled:text-[#8a8a8a]",
)
// trellisComp/button/container/{backgroundColor,borderColor}/secondary/{default,hover,pressed,disabled}
// trellisComp/button/label/color/secondary/{default,hover,pressed,disabled}

const tertiaryStyles = cn(
  "bg-transparent text-[#141414] border border-transparent",
  "hover:bg-[#ebebeb] hover:text-[#4d4d4d]",
  "active:bg-[#e6e6e6] active:text-[#666666]",
  "disabled:bg-transparent disabled:text-[#8a8a8a]",
)
// trellisComp/button/container/{backgroundColor,borderColor}/tertiary/{default,hover,pressed,disabled}
// trellisComp/button/label/color/tertiary/{default,hover,pressed,disabled}

const destructivePrimaryStyles = cn(
  "bg-[#ac0020] border-[#ac0020] text-white",
  "hover:bg-[#d9002b] hover:border-[#d9002b]",
  "active:bg-[#ac0020] active:border-[#ac0020]",
)
// trellisSys/color/expressive/danger/{default,hover,pressed}

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-full", // trellisComp/button/container/borderRadius (full pill)
    "font-normal text-[14px] leading-[20px]", // trellisComp/button/label fontWeight/fontSize/lineHeight (HubSpot Sans 14/20/400 — body inherits HubSpot Sans)
    "ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0050c7]", // trellisSys/color/expressive/focus/default
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        // Trellis Alpha canonical
        primary: primaryStyles,
        secondary: secondaryStyles,
        tertiary: tertiaryStyles,
        // Legacy aliases (visually reskinned to Trellis Alpha)
        default: primaryStyles,
        outline: secondaryStyles,
        "secondary-alt": secondaryStyles,
        ghost: tertiaryStyles,
        destructive: cn(destructivePrimaryStyles, "focus-visible:ring-[#d9002b]"),
        // Specialty variants (not in Trellis Alpha spec — kept for legacy callers)
        link: "text-[#141414] underline-offset-4 hover:underline border-none",
        transparent: "bg-transparent text-[var(--trellis-color-magenta-900)] hover:text-[var(--trellis-color-magenta-1000)] border-none",
      },
      size: {
        // Trellis Alpha canonical
        md: "h-[40px] px-[20px] gap-[8px]", // trellisSys/dimension/component/size/standard/md + trellisComp/button/container/paddingInline/md + container/gap
        sm: "h-[32px] px-[16px] gap-[8px]", // trellisSys/dimension/component/size/standard/sm + trellisComp/button/container/paddingInline/sm
        xs: "h-[24px] px-[12px] gap-[4px]", // trellisSys/dimension/component/size/standard/xs (padding inferred — no token for xs)
        // Legacy aliases — kept at their existing dimensions so callers' layouts don't shift
        default: "h-10 px-[20px] py-2 gap-[8px]", // 40px tall, Trellis Alpha MD padding
        lg: "h-11 px-8", // 44px — no Trellis Alpha equivalent, left as legacy
        icon: "h-10 w-10 p-0",
        medium: "min-h-[40px] px-[20px] gap-[8px]",
        small: "min-h-[32px] px-[16px] gap-[8px]",
        "extra-small": "min-h-[24px] px-[12px] gap-[4px]",
      },
      destructive: {
        true: "",
        false: "",
      },
      iconOnly: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      // destructive + primary -> filled red
      {
        variant: "primary",
        destructive: true,
        class: cn(destructivePrimaryStyles, "focus-visible:ring-[#d9002b]"),
      },
      // destructive + secondary -> red outline
      {
        variant: "secondary",
        destructive: true,
        class: cn(
          "border-[#d9002b] text-[#ac0020] bg-white",
          "hover:bg-[#fbddd8] hover:text-[#d9002b] hover:border-[#d9002b]", // trellisSys/color/organizational/red/bg/hover
          "active:bg-[#fcc5be] active:text-[#ac0020] active:border-[#ac0020]", // trellisSys/color/organizational/red/bg/pressed
          "focus-visible:ring-[#d9002b]",
        ),
      },
      // destructive + tertiary -> red ghost
      {
        variant: "tertiary",
        destructive: true,
        class: cn(
          "text-[#ac0020]",
          "hover:bg-[#fbddd8] hover:text-[#d9002b]",
          "active:bg-[#fcc5be] active:text-[#ac0020]",
          "focus-visible:ring-[#d9002b]",
        ),
      },
      // icon-only padding overrides (zero horizontal padding, square footprint)
      { iconOnly: true, size: "md", class: "px-0 w-[40px]" }, // container/paddingInline/iconOnlyMd
      { iconOnly: true, size: "sm", class: "px-0 w-[32px]" }, // container/paddingInline/iconOnlySm
      { iconOnly: true, size: "xs", class: "px-0 w-[24px]" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      destructive: false,
      iconOnly: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, destructive, iconOnly, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, destructive, iconOnly, className }))}
        ref={ref}
        data-figma-component-key="3032:2804"
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
