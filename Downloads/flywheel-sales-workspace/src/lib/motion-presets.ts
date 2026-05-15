import type { MotionProps, Transition } from "framer-motion";

export const snappyPopoverTransition: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 26,
  mass: 0.6,
  opacity: { duration: 0.12 },
};

export const snappyPopoverMotionProps = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
  transition: snappyPopoverTransition,
} satisfies Pick<MotionProps, "initial" | "animate" | "exit" | "transition">;

export const popoverTransformOriginStyle = {
  transformOrigin: "var(--radix-popover-content-transform-origin)",
} as const;

export const hoverCardTransformOriginStyle = {
  transformOrigin: "var(--radix-hover-card-content-transform-origin)",
} as const;
