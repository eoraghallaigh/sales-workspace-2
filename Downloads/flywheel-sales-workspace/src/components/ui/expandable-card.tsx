import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * ExpandableCard — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=8583-53909
 * Light mode values only. Token paths annotated inline.
 *
 * Standalone card with a clickable header that expands/collapses a body section.
 * Distinct from <Accordion> (which is a stacked-list pattern). Keep them separate.
 *
 * Composition:
 *   <ExpandableCard defaultOpen>
 *     <ExpandableCardHeader title="Title" trailing={<MoreMenu />} />
 *     <ExpandableCardContent>...body...</ExpandableCardContent>
 *   </ExpandableCard>
 *
 * Or controlled:
 *   <ExpandableCard open={isOpen} onOpenChange={setIsOpen}>...</ExpandableCard>
 *
 * Use `selected` to render the focused/selected blue border state.
 */

interface ExpandableCardProps
  extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> {
  selected?: boolean
}

const ExpandableCard = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  ExpandableCardProps
>(({ className, selected, disabled, children, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    disabled={disabled}
    data-figma-component-key="8583:53909"
    className={cn(
      // Card container
      "bg-white", // foundational/bg/normal/default
      "rounded-[6px]", // trellisSys/border/radius/100
      "border border-solid",
      // Border state
      selected
        ? "border-[#0050c7]" // expressive/focus/default — selected/focused card
        : "border-[#cccccc]", // foundational/border/subtle/default
      // Disabled
      disabled && "border-[#e6e6e6]", // foundational/border/subtle/disabled
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Root>
))
ExpandableCard.displayName = "ExpandableCard"

interface ExpandableCardHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>, "title"> {
  title: React.ReactNode
  trailing?: React.ReactNode
}

const ExpandableCardHeader = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  ExpandableCardHeaderProps
>(({ className, title, trailing, ...props }, ref) => {
  return (
    <div className="flex items-center w-full">
      <CollapsiblePrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center gap-[8px]", // button/container/gap
          "px-[12px] py-[10px]", // container/space/compact (12) + balanced vertical for sm-32 size standard
          "text-[14px] leading-[20px] font-normal text-[#141414]", // Heading 06 (h6-14 reg) — HubSpot Sans 14/20/400
          "outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#0050c7] focus-visible:ring-offset-2 focus-visible:ring-offset-white", // expressive/focus/default
          "disabled:cursor-not-allowed disabled:text-[#8a8a8a]", // foundational/fg/normal/disabled
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform duration-200 text-[#141414]" // button/icon/blockSize/sm (16) + fg/normal
          aria-hidden
        />
        <span className="text-left flex-1">{title}</span>
      </CollapsiblePrimitive.Trigger>
      {trailing && (
        <div className="flex items-center pr-[8px]">{trailing}</div>
      )}
    </div>
  )
})
ExpandableCardHeader.displayName = "ExpandableCardHeader"

const ExpandableCardContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="px-[16px] pb-[16px]">{children}</div>{/* component/space/general/16 */}
  </CollapsiblePrimitive.Content>
))
ExpandableCardContent.displayName = "ExpandableCardContent"

export { ExpandableCard, ExpandableCardHeader, ExpandableCardContent }
