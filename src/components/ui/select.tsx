import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

// Inline DownCarat so the fill resolves through the design-system token at
// render time (an <img>-rendered TrellisIcon can't read CSS variables).
const DownCarat = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 5.5L13 5.5L8 11Z"
      fill="var(--color-icon-interactive-default, #141414)"
      stroke="var(--color-icon-interactive-default, #141414)"
      strokeWidth={1.75}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const selectTriggerVariants = {
  default: {
    className: "px-4 body-200 text-[var(--color-text-core-default)] data-[placeholder]:text-[var(--color-text-core-subtle)]",
    style: {
      height: '40px',
      borderRadius: 'var(--borderRadius-100, 4px)',
      border: 'var(--borderWidth-100, 1px) solid var(--color-border-core-default, #8A8A8A)',
      background: 'var(--color-fill-field-default, #FFF)',
    } as React.CSSProperties,
  },
  transparent: {
    className: "bg-transparent border-transparent hover:bg-accent/10",
    style: {
      borderRadius: 'var(--borderRadius-100, 4px)',
      border: '1px solid transparent',
      background: 'transparent',
    } as React.CSSProperties,
  },
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    variant?: keyof typeof selectTriggerVariants
  }
>(({ className, children, variant = "default", ...props }, ref) => {
  const v = selectTriggerVariants[variant]
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between px-3 py-2 body-100 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span:first-child]:flex-1 [&>span:first-child]:min-w-0 [&>span:first-child]:text-left [&>span:first-child]:truncate",
        v.className,
        className
      )}
      style={v.style}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <span className="ml-2 shrink-0">
          <DownCarat size={16} />
        </span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// Visual twin of SelectTrigger, for use inside <PopoverTrigger asChild> when
// the dropdown content can't be a Radix Select (multi-select trees, calendars,
// etc). Renders the same border / height / padding / type / trailing arrow.
const SelectAnchor = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    placeholder?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  }
>(({ className, children, placeholder, trailingIcon, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex h-10 w-full items-center justify-between px-4 body-200 text-[var(--color-text-core-default)] data-[placeholder]:text-[var(--color-text-core-subtle)] hover:bg-[var(--color-fill-secondary-hover)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    style={{
      height: '40px',
      borderRadius: 'var(--borderRadius-100, 4px)',
      border: 'var(--borderWidth-100, 1px) solid var(--color-border-core-default, #8A8A8A)',
      background: 'var(--color-fill-field-default, #FFF)',
    }}
    {...props}
  >
    <span className="flex-1 min-w-0 text-left truncate">
      {children ?? (
        <span className="text-[var(--color-text-core-subtle)]">{placeholder}</span>
      )}
    </span>
    <span className="ml-2 shrink-0">
      {trailingIcon ?? <DownCarat size={16} />}
    </span>
  </button>
))
SelectAnchor.displayName = "SelectAnchor"

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-[4px] border border-[var(--color-border-core-subtle)] bg-[var(--color-fill-surface-default)] text-[var(--color-text-core-default)] shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 body-125", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center py-2 pl-8 pr-4 body-100 text-[var(--color-text-core-default)] outline-none data-[highlighted]:bg-[var(--color-fill-secondary-hover)] focus:bg-[var(--color-fill-secondary-hover)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectAnchor,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
