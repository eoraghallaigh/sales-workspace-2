import * as React from "react"

import { cn } from "@/lib/utils"

// A split button: a single pill divided into a main action segment and a
// trailing segment (typically a dropdown/date affordance), separated by a
// divider. Variants mirror the matching Button variants so the two read as one
// design-system family. Forwards its ref to the root so it can be used as a
// Radix PopoverAnchor.
const splitButtonSizes = {
  medium: { root: "min-h-[40px]", main: "px-[24px] gap-[8px]", trailing: "px-[12px]" },
  small: { root: "min-h-[32px] detail-100", main: "px-[16px] gap-[8px]", trailing: "px-[10px]" },
} as const

const splitButtonVariants = {
  // Filled/dark: white label + icon. Icons are <img>, so whiten them with a
  // brightness/invert filter (same treatment the primary Button uses).
  primary: {
    root: "bg-[var(--button-primary-bg)] text-[var(--color-text-primary-default)] border-[var(--color-border-primary-default)] [&_img]:brightness-0 [&_img]:invert",
    hover: "hover:bg-[var(--button-primary-bg-hover)]",
    divider: "bg-[var(--color-border-core-onfilldefault)]",
  },
  secondary: {
    root: "bg-[var(--color-fill-surface-default)] text-[var(--color-text-core-default)] border-[var(--color-border-secondary-default)]",
    hover: "hover:bg-[var(--color-fill-secondary-hover)]",
    divider: "bg-[var(--color-border-secondary-default)]",
  },
} as const

export interface SplitButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  variant?: keyof typeof splitButtonVariants
  size?: keyof typeof splitButtonSizes
  disabled?: boolean
  onMainClick?: () => void
  mainAriaLabel?: string
  onTrailingClick?: () => void
  trailingAriaLabel?: string
  trailing: React.ReactNode
}

const segmentBase =
  "inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "small",
      disabled = false,
      onMainClick,
      mainAriaLabel,
      onTrailingClick,
      trailingAriaLabel,
      trailing,
      ...props
    },
    ref,
  ) => {
    const s = splitButtonSizes[size]
    const v = splitButtonVariants[variant]
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-stretch overflow-hidden rounded-[var(--radius-button)] border",
          v.root,
          disabled && "pointer-events-none opacity-50",
          s.root,
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label={mainAriaLabel}
          disabled={disabled}
          onClick={onMainClick}
          className={cn(segmentBase, v.hover, s.main)}
        >
          {children}
        </button>
        <span aria-hidden className={cn("w-px self-stretch", v.divider)} />
        <button
          type="button"
          aria-label={trailingAriaLabel}
          disabled={disabled}
          onClick={onTrailingClick}
          className={cn(segmentBase, v.hover, s.trailing)}
        >
          {trailing}
        </button>
      </div>
    )
  },
)
SplitButton.displayName = "SplitButton"

export { SplitButton }
