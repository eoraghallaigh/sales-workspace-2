import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

/*
 * Badge — themed.
 * Transitional: heading-25 (12/18/600), bordered base.
 * Alpha: lighter 12/18/400, borderless pill (Trellis Alpha node 7824-75116).
 * The colour variants are shared between themes; only the base differs, so we
 * build two cva configs over one shared variants map.
 */
const variantConfig = {
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
      lorax: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-orange-default,#ff7a59)] text-[var(--color-text-core-onfilldefault,#fff)]",
      oz: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-green-default,#00bda5)] text-[var(--color-text-core-onfilldefault,#fff)]",
      thunderdome: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-purple-default,#6a78d1)] text-[var(--color-text-core-onfilldefault,#fff)]",
      norman: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-magenta-default,#f2547d)] text-[var(--color-text-core-onfilldefault,#fff)]",
      marigold: "border-transparent rounded-[4px] bg-[var(--color-fill-caution-default,#f5c26b)] text-[var(--color-text-core-onfilldefault,#fff)]",
      calypso: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-blue-default,#00a4bd)] text-[var(--color-text-core-onfilldefault,#fff)]",
      "candy-apple": "border-transparent rounded-[4px] bg-[var(--color-fill-accent-red-default,#f2545b)] text-[var(--color-text-core-onfilldefault,#fff)]",
      pantera: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-neutral-default,#425b76)] text-[var(--color-text-core-onfilldefault,#fff)]",
      sorbet: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-light-orange-default,#ff8f59)] text-[var(--color-text-core-onfilldefault,#fff)]",
      "teal-dark": "border-transparent rounded-[4px] bg-[var(--color-fill-accent-teal-default,#00a4bd)] text-[var(--color-text-core-onfilldefault,#fff)]",
      koala: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-neutral-subtle-alt,#eaf0f6)] text-[var(--color-text-core-default,#33475b)]",
      blue: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-blue-subtle,#e5f5f8)] text-[var(--color-text-core-default,#33475b)]",
      teal: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-teal-subtle,#e5f5f8)] text-[var(--color-text-core-default,#33475b)]",
      green: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-green-subtle,#e5f8f6)] text-[var(--color-text-core-default,#33475b)]",
      yellow: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-yellow-subtle,#fef8f0)] text-[var(--color-text-core-default,#33475b)]",
      orange: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-orange-subtle,#fff1ee)] text-[var(--color-text-core-default,#33475b)]",
      magenta: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-magenta-subtle,#fdedf2)] text-[var(--color-text-core-default,#33475b)]",
      purple: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-purple-subtle,#f0f1fa)] text-[var(--color-text-core-default,#33475b)]",
      red: "border-transparent rounded-[4px] bg-[var(--color-fill-accent-red-subtle,#fdedee)] text-[var(--color-text-core-default,#33475b)]",
    },
  },
  defaultVariants: { variant: "default" as const },
}

// Transitional base (master): heading-25, bordered.
const badgeVariants = cva(
  "flex justify-center items-center rounded-full border px-[var(--space-200,8px)] py-[1px] heading-25 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variantConfig
)

// Alpha base: lighter 12/18/400, borderless pill.
const badgeVariantsAlpha = cva(
  "inline-flex justify-center items-center rounded-full px-[8px] py-[1px] text-[12px] leading-[18px] font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variantConfig
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const { theme } = useTheme()
  const variants = theme === "alpha" ? badgeVariantsAlpha : badgeVariants
  return <div className={cn(variants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
