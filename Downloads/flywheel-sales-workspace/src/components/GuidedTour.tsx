import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTour } from "@/contexts/TourContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 8;

const GuidedTour: React.FC = () => {
  const { activeTour, currentStepIndex, isActive, nextStep, endTour } = useTour();
  const location = useLocation();
  const navigate = useNavigate();
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const rafRef = useRef<number>();
  const retryRef = useRef<number>();
  const clickingRef = useRef(false);

  const currentStep = activeTour?.steps[currentStepIndex];

  // Navigate to the step's route if needed
  useEffect(() => {
    if (!currentStep) return;
    // For strategy routes, just check prefix
    const stepRoute = currentStep.route;
    if (stepRoute.endsWith("/")) {
      if (!location.pathname.startsWith(stepRoute)) {
        // Don't navigate for wildcard routes - user needs to navigate there
      }
    } else if (location.pathname !== stepRoute) {
      navigate(stepRoute);
    }
  }, [currentStep, location.pathname, navigate]);

  // Find and track the target element
  const updateRect = useCallback(() => {
    if (!currentStep) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(currentStep.targetSelector);
    if (el) {
      const r = el.getBoundingClientRect();
      setTargetRect({
        top: r.top - PADDING,
        left: r.left - PADDING,
        width: r.width + PADDING * 2,
        height: r.height + PADDING * 2,
      });
    } else {
      setTargetRect(null);
    }
    rafRef.current = requestAnimationFrame(updateRect);
  }, [currentStep]);

  useEffect(() => {
    if (!isActive) return;
    // Small delay to let DOM settle after navigation
    retryRef.current = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(updateRect);
    }, 300);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [isActive, updateRect, currentStepIndex, location.pathname]);

  // Position tooltip
  useEffect(() => {
    if (!currentStep) return;
    const tooltipW = 320;
    const tooltipH = 160;

    if (!targetRect) {
      // Center tooltip on screen when target not found
      setTooltipStyle({
        top: window.innerHeight / 2 - tooltipH / 2,
        left: window.innerWidth / 2 - tooltipW / 2,
      });
      return;
    }

    const pos = currentStep.position || "bottom";
    let style: React.CSSProperties = {};

    switch (pos) {
      case "bottom":
        style = {
          top: targetRect.top + targetRect.height + 12,
          left: Math.max(16, targetRect.left + targetRect.width / 2 - tooltipW / 2),
        };
        break;
      case "top":
        style = {
          top: targetRect.top - tooltipH - 12,
          left: Math.max(16, targetRect.left + targetRect.width / 2 - tooltipW / 2),
        };
        break;
      case "right":
        style = {
          top: Math.max(16, targetRect.top + targetRect.height / 2 - tooltipH / 2),
          left: targetRect.left + targetRect.width + 12,
        };
        break;
      case "left":
        style = {
          top: Math.max(16, targetRect.top + targetRect.height / 2 - tooltipH / 2),
          left: targetRect.left - tooltipW - 12,
        };
        break;
    }

    // Clamp to viewport
    const maxLeft = window.innerWidth - tooltipW - 16;
    const maxTop = window.innerHeight - tooltipH - 16;
    style.left = Math.min(Math.max(16, style.left as number), maxLeft);
    style.top = Math.min(Math.max(16, style.top as number), maxTop);

    setTooltipStyle(style);
  }, [targetRect, currentStep]);

  if (!isActive || !currentStep) return null;

  const stepNum = currentStepIndex + 1;
  const totalSteps = activeTour!.steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <>
      {/* Full-screen click blocker */}
      <div
        className="fixed inset-0 z-[9997]"
        style={{ background: "transparent" }}
      />

      {/* Overlay with spotlight cutout */}
      <div
        className="fixed z-[9998] pointer-events-none transition-all duration-300"
        style={
          targetRect
            ? {
                top: targetRect.top,
                left: targetRect.left,
                width: targetRect.width,
                height: targetRect.height,
                borderRadius: "8px",
                boxShadow: `0 0 0 9999px rgba(28, 28, 28, 0.65), 0 0 0 3px var(--trellis-color-magenta-600) inset, 0 0 20px 4px rgba(255, 255, 255, 0.15) inset`,
              }
            : {
                inset: 0,
                position: "fixed",
                background: "rgba(28, 28, 28, 0.65)",
              }
        }
      />

      {/* Clickable target area — clicks through to the real element and advances tour */}
      {targetRect && (
        <div
          className="fixed z-[10001] rounded-lg cursor-pointer"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            background: "transparent",
          }}
          onClick={() => {
            if (clickingRef.current) return;
            clickingRef.current = true;
            // Step 2: clicking first company card should navigate to strategy page
            if (currentStep.targetSelector === '[data-tour="first-company-card"]') {
              navigate("/prospecting/strategy/1");
              setTimeout(() => { nextStep(); clickingRef.current = false; }, 300);
              return;
            }
            const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
            if (el) {
              el.click();
            }
            setTimeout(() => { nextStep(); clickingRef.current = false; }, 300);
          }}
        />
      )}

      {/* Pulsing ring around target */}
      {targetRect && (
        <div
          className="fixed z-[9999] rounded-lg pointer-events-none"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: "0 0 0 3px var(--trellis-color-magenta-600), 0 0 24px 8px rgba(255, 159, 204, 0.35)",
            animation: "tour-pulse 2s ease-in-out infinite",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-[10000] bg-card border border-border-core-subtle rounded-lg shadow-300 p-4"
        style={{ ...tooltipStyle, width: 320 }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="heading-100 text-foreground">{currentStep.title}</h3>
          <button
            onClick={endTour}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="body-100 text-muted-foreground mb-4">{currentStep.description}</p>
        <div className="flex items-center justify-between">
          <span className="detail-100 text-muted-foreground">
            {stepNum} of {totalSteps}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="extra-small" onClick={endTour}>
              Skip tour
            </Button>
            <Button variant="primary" size="extra-small" onClick={nextStep}>
              {isLastStep ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes tour-pulse {
          0%, 100% { box-shadow: 0 0 0 3px var(--trellis-color-magenta-600), 0 0 24px 8px rgba(255, 159, 204, 0.35); }
          50% { box-shadow: 0 0 0 4px var(--trellis-color-magenta-600), 0 0 32px 12px rgba(255, 159, 204, 0.2); }
        }
      `}</style>
    </>
  );
};

export default GuidedTour;
