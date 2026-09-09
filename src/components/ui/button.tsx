import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { AiStarIcon } from "@/components/ui/ai-star-icon"

// Exported so dev-only tooling (the design sandbox) can enumerate variant
// names and their class strings without duplicating them here.
export const buttonSizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-[var(--radius-button)] px-3",
  lg: "h-11 rounded-[var(--radius-button)] px-8",
  icon: "h-10 w-10",
  medium: "min-h-[40px] px-[24px] gap-[8px] rounded-[var(--radius-button)]",
  small: "min-h-[32px] gap-[8px] rounded-[var(--radius-button)]",
  "extra-small": "min-h-[24px] px-[13px] rounded-[var(--radius-button)] detail-100",
} as const;

export const buttonVariantClasses = {
  default: "bg-[var(--button-primary-bg)] text-primary-foreground hover:bg-[var(--button-primary-bg-hover)]",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline:
    "border border-input bg-[var(--color-fill-surface-default)] hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-[var(--color-fill-secondary-default)] text-[var(--color-text-core-default)] border border-[var(--color-border-secondary-default)] rounded-[var(--radius-button)] hover:bg-[var(--color-fill-secondary-hover)]",
  ghost: "hover:bg-[var(--color-fill-accent-neutral-subtle-alt)]",
  link: "text-primary underline-offset-4 hover:underline",
  primary: "bg-[var(--button-primary-bg)] text-[var(--color-text-primary-default)] hover:bg-[var(--button-primary-bg-hover)] border border-[var(--color-border-primary-default)]",
  "secondary-alt": "bg-[var(--color-fill-secondary-default)] text-[var(--color-text-core-default)] border border-[var(--color-border-secondary-default)] hover:bg-[var(--color-fill-secondary-hover)]",
  transparent: "bg-transparent text-[var(--trellis-color-magenta-900)] hover:text-[var(--trellis-color-magenta-1000)]",
  ai: "bg-[var(--trellis-color-magenta-900)] text-white hover:bg-[var(--trellis-color-magenta-1000)] !rounded-full heading-50",
  "ai-secondary": "bg-card text-[var(--trellis-color-magenta-900)] border border-[var(--trellis-color-magenta-900)] hover:bg-[var(--trellis-color-magenta-200,#FBEAF1)] hover:text-[var(--trellis-color-magenta-1000)] hover:border-[var(--trellis-color-magenta-1000)] !rounded-full heading-50",
  tertiary: "bg-white text-[var(--color-text-core-default)] border border-[var(--color-border-core-subtle)] hover:bg-[var(--color-fill-secondary-hover)] hover:border-[var(--color-border-core-default)]",
} as const;

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-button)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-[14px] leading-[var(--button-line-height)] font-[var(--button-label-weight)]",
  {
    variants: {
      variant: buttonVariantClasses,
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[var(--radius-button)] px-3",
        lg: "h-11 rounded-[var(--radius-button)] px-8",
        icon: "h-10 w-10",
        medium: "min-h-[40px] px-[24px] gap-[8px] rounded-[var(--radius-button)]",
        small: "min-h-[32px] gap-[8px] rounded-[var(--radius-button)]",
        "extra-small": "min-h-[24px] px-[13px] rounded-[var(--radius-button)] detail-100",
      },
    },
    compoundVariants: [
      // Primary variants
      {
        variant: "primary",
        size: "medium",
        class: "px-[24px] gap-[8px]"
      },
      {
        variant: "primary",
        size: "small",
        class: "px-[16px] gap-[8px]"
      },
      {
        variant: "primary",
        size: "extra-small",
        class: "px-[12px] gap-[4px]"
      },
      // Secondary variants
      {
        variant: "secondary",
        size: "medium",
        class: "px-[24px] gap-[8px]"
      },
      {
        variant: "secondary",
        size: "small",
        class: "px-[16px] gap-[8px]"
      },
      {
        variant: "secondary",
        size: "extra-small",
        class: "px-[12px] gap-[4px]"
      },
      // Secondary-alt variants
      {
        variant: "secondary-alt",
        size: "medium",
        class: "px-[24px] gap-[8px]"
      },
      {
        variant: "secondary-alt",
        size: "small",
        class: "px-[16px] gap-[8px]"
      },
      {
        variant: "secondary-alt",
        size: "extra-small",
        class: "px-[12px] gap-[4px]"
      },
      // AI variants
      {
        variant: "ai",
        size: "medium",
        class: "px-[24px] gap-[8px] heading-50"
      },
      {
        variant: "ai",
        size: "small",
        class: "px-[16px] gap-[8px]"
      },
      {
        variant: "ai",
        size: "extra-small",
        class: "px-[10px] gap-[4px] heading-50"
      },
      // AI Secondary variants (mirror AI sizing)
      {
        variant: "ai-secondary",
        size: "medium",
        class: "px-[24px] gap-[8px] heading-50"
      },
      {
        variant: "ai-secondary",
        size: "small",
        class: "px-[16px] gap-[8px]"
      },
      {
        variant: "ai-secondary",
        size: "extra-small",
        class: "px-[10px] gap-[4px] heading-50"
      },
      // Ghost variants
      {
        variant: "ghost",
        size: "medium",
        class: "px-[24px] gap-[8px]"
      },
      {
        variant: "ghost",
        size: "small",
        class: "px-[8px] gap-[8px]"
      },
      {
        variant: "ghost",
        size: "extra-small",
        class: "px-[8px] gap-[4px]"
      },
      // Transparent variants
      {
        variant: "transparent",
        size: "medium",
        class: "px-[24px] gap-[8px]"
      },
      {
        variant: "transparent",
        size: "small",
        class: "px-[8px] gap-[8px]"
      },
      {
        variant: "transparent",
        size: "extra-small",
        class: "px-[4px] gap-[4px]"
      },
      // Font size overrides for small and extra-small
      {
        size: "small",
        class: "detail-100"
      },
      {
        size: "extra-small",
        class: "detail-100"
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    // AI buttons always lead with the AI star. Skip it when the caller already
    // leads with its own icon (e.g. a loading spinner) so we never double up,
    // and when asChild (Slot requires a single child).
    const isAi = variant === "ai" || variant === "ai-secondary"
    const leadsWithElement = React.isValidElement(React.Children.toArray(children)[0])
    const content =
      isAi && !asChild && !leadsWithElement ? (
        <>
          <AiStarIcon />
          {children}
        </>
      ) : (
        children
      )
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
