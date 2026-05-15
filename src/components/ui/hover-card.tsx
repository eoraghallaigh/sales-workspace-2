import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"
import {
  hoverCardTransformOriginStyle,
  snappyPopoverMotionProps,
} from "@/lib/motion-presets"

const HoverCardOpenContext = React.createContext(false)

type HoverCardProps = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>

const HoverCard = ({
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...rest
}: HoverCardProps) => {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const currentOpen = isControlled ? open : internalOpen

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <HoverCardOpenContext.Provider value={currentOpen}>
      <HoverCardPrimitive.Root
        open={currentOpen}
        onOpenChange={handleOpenChange}
        {...rest}
      >
        {children}
      </HoverCardPrimitive.Root>
    </HoverCardOpenContext.Provider>
  )
}

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
  const isOpen = React.useContext(HoverCardOpenContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <HoverCardPrimitive.Portal forceMount>
          <HoverCardPrimitive.Content
            ref={ref}
            forceMount
            align={align}
            sideOffset={sideOffset}
            asChild
            className={cn(
              "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
              className
            )}
            {...props}
          >
            <motion.div
              {...snappyPopoverMotionProps}
              style={hoverCardTransformOriginStyle}
            >
              {children}
            </motion.div>
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      )}
    </AnimatePresence>
  )
})
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
