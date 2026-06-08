import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"
import {
  popoverTransformOriginStyle,
  snappyPopoverMotionProps,
} from "@/lib/motion-presets"

const PopoverOpenContext = React.createContext(false)

type PopoverProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>

const Popover = ({
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...rest
}: PopoverProps) => {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const currentOpen = isControlled ? open : internalOpen

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <PopoverOpenContext.Provider value={currentOpen}>
      <PopoverPrimitive.Root
        open={currentOpen}
        onOpenChange={handleOpenChange}
        {...rest}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopoverOpenContext.Provider>
  )
}

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
  const isOpen = React.useContext(PopoverOpenContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content
            ref={ref}
            forceMount
            align={align}
            sideOffset={sideOffset}
            asChild
            className={cn(
              "z-50 w-72 rounded-[var(--radius-popover)] border bg-popover p-4 text-popover-foreground shadow-md outline-none",
              className
            )}
            {...props}
          >
            <motion.div
              {...snappyPopoverMotionProps}
              style={popoverTransformOriginStyle}
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  )
})
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
