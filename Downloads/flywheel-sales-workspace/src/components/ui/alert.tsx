import * as React from "react"
import { cva } from "class-variance-authority"
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * Alert — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=7713-3819
 * Light mode values only. Token paths annotated inline.
 *
 * API preserved for back-compat: Alert / AlertTitle / AlertDescription.
 * Variants:
 *   info (default) | success | caution | error
 *   destructive    -> alias of error (legacy back-compat)
 *   default        -> alias of info  (legacy back-compat)
 *
 * Pass `onDismiss` to render the close X. Pass `actions` to render a row
 * of secondary action buttons below the body.
 */

type AlertVariant = "info" | "success" | "caution" | "error" | "default" | "destructive"

const containerStyles: Record<Exclude<AlertVariant, "default" | "destructive">, string> = {
  info: "bg-white border-[#8a8a8a]", // trellis/alert/container/backgroundColor/info + semantic/neutral/border
  success: "bg-[#edf4ef] border-[#00823a]", // trellisComp/alert/container/{backgroundColor,borderColor}/success
  caution: "bg-[#fcf6e6] border-[#d39913]",
  error: "bg-[#fcece9] border-[#d9002b]",
}
// default -> info; destructive -> error
const resolveVariant = (v: AlertVariant): Exclude<AlertVariant, "default" | "destructive"> => {
  if (v === "default") return "info"
  if (v === "destructive") return "error"
  return v
}

const iconStyles: Record<Exclude<AlertVariant, "default" | "destructive">, string> = {
  info: "text-[#666666]", // trellisComp/alert/icon/color/info
  success: "text-[#006831]",
  caution: "text-[#956309]",
  error: "text-[#ac0020]",
}

const iconForVariant: Record<Exclude<AlertVariant, "default" | "destructive">, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  caution: AlertTriangle,
  error: AlertCircle,
}

const alertVariants = cva(
  cn(
    "relative w-full",
    "rounded-[16px]", // trellisSys/border/radius/200
    "border border-solid",
    "p-[12px]", // trellisSys/dimension/container/space/compact
    "flex items-start gap-[12px]" // trellis/alert/container/gapHorizontal
  ),
  {
    variants: {
      variant: containerStyles,
    },
  }
)

interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant
  onDismiss?: () => void
  actions?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", onDismiss, actions, children, ...props }, ref) => {
    const resolved = resolveVariant(variant)
    const Icon = iconForVariant[resolved]
    return (
      <div
        ref={ref}
        role="alert"
        data-figma-component-key="7713:3819"
        className={cn(alertVariants({ variant: resolved }), className)}
        {...props}
      >
        <Icon className={cn("h-4 w-4 shrink-0 mt-[2px]", iconStyles[resolved])} aria-hidden />
        <div className="flex-1 min-w-0">
          {children}
          {actions && (
            <div className="mt-[20px] flex gap-[8px]">{/* trellisComp/alert/container/actions/spaceTop */}
              {actions}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="shrink-0 ml-[8px] text-[#141414] hover:text-[#666666] outline-none focus-visible:ring-2 focus-visible:ring-[#0050c7] rounded-sm"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "text-[14px] leading-[20px] font-medium text-[#141414]", // Heading 05 — HubSpot Sans 14/20/500
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[14px] leading-[20px] font-normal text-[#666666] [&_p]:leading-relaxed", // Body Md / foundational/fg/subtle
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
