import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--borderRadius-100,4px)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 body-125 font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-[var(--color-fill-secondary-default)] text-[var(--color-text-core-default)] border border-[var(--color-border-secondary-default)] rounded-[4px] hover:bg-[var(--color-fill-secondary-hover)]",
        ghost: "hover:bg-[var(--color-fill-accent-neutral-subtle-alt)]",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-[var(--color-fill-primary-default)] text-[var(--color-text-primary-default)] hover:bg-[var(--color-fill-primary-hover)] border border-[var(--color-border-primary-default)]",
        "secondary-alt": "bg-[var(--color-fill-secondary-default)] text-[var(--color-text-core-default)] border border-[var(--color-border-secondary-default)] hover:bg-[var(--color-fill-secondary-hover)]",
        transparent: "bg-transparent text-[var(--trellis-color-magenta-900)] hover:text-[var(--trellis-color-magenta-1000)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        medium: "min-h-[40px] px-[24px] gap-[8px] rounded-[4px]",
        small: "min-h-[32px] gap-[8px] rounded-[4px]",
        "extra-small": "min-h-[26px] rounded-[4px]",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
