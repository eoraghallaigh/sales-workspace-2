import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Ribbon [Transitional] — draws attention to a feature or element on the page.
 * Trellis "Ribbon" (Transitional Component Library, node 498:4544). The
 * asymmetric corner radii form the ribbon shape: tight on the anchored edge,
 * rounded on the open edge. `position` sets the anchored edge; `use` the colour.
 */
const ribbonVariants = cva(
  "inline-flex h-5 items-center pl-[var(--space-200,8px)] pr-[var(--space-300,12px)] heading-25 text-[var(--color-text-core-onfilldefault,#fff)] trellis-shadow-100",
  {
    variants: {
      use: {
        sorbet: "bg-[var(--color-fill-accent-light-orange-default,#ff8f59)]",
      },
      position: {
        left: "rounded-l-100 rounded-r-400",
        right: "rounded-l-400 rounded-r-100",
      },
    },
    defaultVariants: { use: "sorbet", position: "left" },
  }
)

export interface RibbonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ribbonVariants> {}

function Ribbon({ className, use, position, ...props }: RibbonProps) {
  return (
    <div className={cn(ribbonVariants({ use, position }), className)} {...props} />
  )
}

export { Ribbon, ribbonVariants }
