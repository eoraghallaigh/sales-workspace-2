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
              "z-50 w-72 p-4 outline-none",
              "rounded-[16px]", // trellisSys/border/radius/200
              "border border-[#cccccc] bg-white text-[#141414]", // foundational/border/subtle + bg/normal + fg/normal
              "shadow-[0px_8px_16px_0px_rgba(0,0,0,0.06)]", // trellisSys/shadow/400 (#0000000f ≈ 6% black)
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
