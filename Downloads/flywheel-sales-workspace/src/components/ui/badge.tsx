import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "flex justify-center items-center rounded-full border px-[var(--space-200,8px)] py-[1px] heading-25 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        "accent-blue": "text-[var(--color-border-accent-blue-default)] border-[var(--color-border-accent-blue-default)] bg-[var(--color-fill-accent-blue-subtle-alt)] rounded-[var(--borderRadius-transitional-full-0)]",
        "accent-green": "text-[var(--color-border-accent-green-default)] border-[var(--color-border-accent-green-default)] bg-[var(--color-fill-accent-green-subtle-alt)] rounded-[var(--borderRadius-transitional-full-0)]",
        "status-orange": "border-transparent bg-[var(--color-fill-accent-orange-default,#C93700)] text-white",
        "status-blue": "border-transparent bg-[#2563EB] text-white",
        "status-yellow": "border-transparent bg-[var(--color-fill-caution-default,#FCCB57)] text-black",
        "status-green": "border-transparent bg-[var(--color-fill-transitional-progress-success-gradient-color-1,#00823A)] text-white",
        "status-gray": "border-transparent bg-[#6B7280] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
