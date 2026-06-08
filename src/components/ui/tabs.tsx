import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

/*
 * Tabs — themed.
 * Transitional: full-width 48px tabs with a bottom underline indicator.
 * Alpha: content-width 32px tabs with a grey-pill active state + detached
 *        rounded underline (Trellis Alpha spec, node 3715-4523).
 * The two looks differ structurally, so we branch on theme rather than tokens.
 */

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        theme === "alpha"
          ? "inline-flex items-end gap-[8px]"
          : "inline-flex items-stretch border-b border-[var(--color-border-core-subtle,#CCCCCC)]",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        theme === "alpha"
          ? // Alpha: grey-pill active state, detached rounded underline
            "relative inline-flex items-center justify-center whitespace-nowrap min-h-[32px] px-[20px] mb-[10px] gap-[8px] rounded-[6px] text-[14px] leading-[20px] font-normal text-[#666666] outline-none transition-colors hover:text-[#141414] focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=active]:bg-[#e6e6e6] data-[state=active]:text-[#141414] after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-transparent data-[state=active]:after:bg-[#141414]"
          : // Transitional: full-width 48px tab with bottom underline
            "relative flex-1 inline-flex h-[48px] items-center justify-center whitespace-nowrap px-[var(--space-700,28px)] py-[var(--space-0,0)] gap-[var(--space-200,8px)] body-100 text-[var(--color-text-core-subtle)] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[var(--color-text-core-default)] data-[state=active]:font-semibold after:absolute after:bottom-0 after:left-[8px] after:right-[8px] after:h-[3px] after:rounded-full after:transition-all data-[state=active]:after:bg-[var(--color-fill-primary-default,#141414)] data-[state=inactive]:after:bg-transparent",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
