import * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const CANONICAL_URL = "https://prospecting-strategy.netlify.app/q2c2/summary"

const isAlphaPreviewHost = (): boolean => {
  if (typeof window === "undefined") return false
  return window.location.hostname.includes("trellis-alpha")
}

const AlphaPreviewBanner: React.FC = () => {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    setVisible(isAlphaPreviewHost())
  }, [])

  if (!visible) return null

  return (
    <Alert
      variant="caution"
      className="sticky top-0 z-50 rounded-none border-x-0 border-t-0"
    >
      <AlertTitle>Trellis Alpha preview</AlertTitle>
      <AlertDescription>
        This is a design preview — not the current design system.{" "}
        <a
          href={CANONICAL_URL}
          className="underline underline-offset-2 hover:no-underline"
        >
          View the canonical prototype →
        </a>
      </AlertDescription>
    </Alert>
  )
}

export default AlphaPreviewBanner
