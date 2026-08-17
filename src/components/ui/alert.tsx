import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertType = "info" | "warning" | "success" | "danger" | "tip"
type AlertUse = "default" | "embedded"

const typeStyles: Record<AlertType, { default: string; embedded: string; title: string; text: string; close: string; actionBorder: string }> = {
  info: {
    default: "bg-trellis-blue-300 border-trellis-blue-500",
    embedded: "bg-trellis-blue-300 border-trellis-blue-300",
    title: "text-trellis-blue-1200",
    text: "text-trellis-blue-1000",
    close: "text-trellis-blue-800 hover:text-trellis-blue-1000",
    actionBorder: "border-trellis-blue-800 text-trellis-blue-1000 hover:bg-trellis-blue-500",
  },
  warning: {
    default: "bg-trellis-yellow-200 border-trellis-yellow-400",
    embedded: "bg-trellis-yellow-200 border-trellis-yellow-200",
    title: "text-trellis-yellow-1100",
    text: "text-trellis-yellow-1000",
    close: "text-trellis-yellow-800 hover:text-trellis-yellow-1000",
    actionBorder: "border-trellis-yellow-800 text-trellis-yellow-1000 hover:bg-trellis-yellow-400",
  },
  success: {
    default: "bg-trellis-green-200 border-trellis-green-400",
    embedded: "bg-trellis-green-200 border-trellis-green-200",
    title: "text-trellis-green-1100",
    text: "text-trellis-green-1000",
    close: "text-trellis-green-800 hover:text-trellis-green-1000",
    actionBorder: "border-trellis-green-800 text-trellis-green-1000 hover:bg-trellis-green-400",
  },
  danger: {
    default: "bg-trellis-red-200 border-trellis-red-500",
    embedded: "bg-trellis-red-200 border-trellis-red-200",
    title: "text-trellis-red-1100",
    text: "text-trellis-red-1000",
    close: "text-trellis-red-800 hover:text-trellis-red-1000",
    actionBorder: "border-trellis-red-800 text-trellis-red-1000 hover:bg-trellis-red-500",
  },
  tip: {
    default: "bg-trellis-neutral-200 border-trellis-neutral-400",
    embedded: "bg-trellis-neutral-200 border-trellis-neutral-200",
    title: "text-trellis-neutral-1000",
    text: "text-trellis-neutral-900",
    close: "text-trellis-neutral-700 hover:text-trellis-neutral-1000",
    actionBorder: "border-trellis-neutral-700 text-trellis-neutral-900 hover:bg-trellis-neutral-300",
  },
}

// Backward-compat: map old shadcn variants to new types
const legacyVariantMap: Record<string, AlertType> = {
  default: "tip",
  destructive: "danger",
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType
  use?: AlertUse
  variant?: string
  onClose?: () => void
  action?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, type, use = "default", variant, onClose, action, children, ...props }, ref) => {
    const resolvedType: AlertType = type ?? legacyVariantMap[variant ?? ""] ?? "tip"
    const colors = typeStyles[resolvedType]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          colors[use],
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {children}
          </div>
          {action && (
            <button
              type="button"
              className={cn(
                "shrink-0 rounded border px-2.5 py-0.5 body-100 font-medium transition-colors",
                colors.actionBorder,
              )}
            >
              {action}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={cn("shrink-0 p-0.5 transition-colors", colors.close)}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  type?: AlertType
}

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, type, ...props }, ref) => {
    const colors = type ? typeStyles[type] : undefined
    return (
      <h5
        ref={ref}
        className={cn("body-125 font-semibold leading-none tracking-tight", colors?.title, className)}
        {...props}
      />
    )
  }
)
AlertTitle.displayName = "AlertTitle"

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  type?: AlertType
}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, type, ...props }, ref) => {
    const colors = type ? typeStyles[type] : undefined
    return (
      <div
        ref={ref}
        className={cn("body-100 [&_p]:leading-relaxed", colors?.text, className)}
        {...props}
      />
    )
  }
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
export type { AlertType, AlertUse, AlertProps }
