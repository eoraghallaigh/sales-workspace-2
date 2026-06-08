import { buttonVariantClasses } from "@/components/ui/button";

export const BUTTON_VARIANT_NAMES = Object.keys(buttonVariantClasses) as string[];

const tokensFor = (variant: string): string[] =>
  (buttonVariantClasses[variant as keyof typeof buttonVariantClasses] ?? "")
    .split(/\s+/)
    .filter(Boolean);

/**
 * Best-effort detection of which Button variant a live <button> is rendering.
 * We match each variant's class string against the element's classList and
 * prefer the variant whose classes are all present (most specific wins). twMerge
 * can drop a conflicting class, so we fall back to the highest partial score.
 */
export const detectButtonVariant = (element: HTMLElement): string => {
  const classes = new Set(element.classList);
  let best = "";
  let bestFull = -1;
  let bestPartial = 0;
  let bestPartialName = "";

  for (const name of BUTTON_VARIANT_NAMES) {
    const tokens = tokensFor(name);
    if (tokens.length === 0) continue;
    const present = tokens.filter((t) => classes.has(t)).length;
    if (present > bestPartial) {
      bestPartial = present;
      bestPartialName = name;
    }
    if (present === tokens.length && tokens.length > bestFull) {
      bestFull = tokens.length;
      best = name;
    }
  }

  if (best) return best;
  return bestPartial > 0 ? bestPartialName : "";
};

// The Button's base corner radius. Some variants bake their own radius into
// their class string (e.g. `secondary` → rounded-[4px], `ai` → !rounded-full),
// so stripping a variant can leave the element with no radius at all. When that
// happens we restore this base radius so swapping never squares the corners.
const BASE_RADIUS_CLASS = "rounded-[var(--borderRadius-100,4px)]";
const isRadiusToken = (token: string): boolean => /^!?rounded(\b|-|\[)/.test(token);

/**
 * Build the className for the element as if it rendered `toVariant` instead of
 * `fromVariant`: strip the source variant's classes and append the target's.
 * Computed from the immutable base className each time so previews don't drift.
 */
export const classNameForVariant = (
  baseClassName: string,
  fromVariant: string,
  toVariant: string,
): string => {
  const fromTokens = new Set(tokensFor(fromVariant));
  const result = baseClassName.split(/\s+/).filter((t) => t && !fromTokens.has(t));
  for (const token of tokensFor(toVariant)) {
    if (!result.includes(token)) result.push(token);
  }
  if (!result.some(isRadiusToken)) result.push(BASE_RADIUS_CLASS);
  return result.join(" ");
};

interface ButtonOrigin {
  isButton: boolean;
  variant: string;
  baseClassName: string;
}

const AI_VARIANTS = new Set(["ai", "ai-secondary"]);
const SVG_NS = "http://www.w3.org/2000/svg";
const AI_ICON_PATH =
  "M7 0.00488281C7.2761 0.00488281 7.49993 0.228796 7.5 0.504883C7.5 3.81874 10.1861 6.50488 13.5 6.50488C13.7761 6.50488 13.9999 6.7288 14 7.00488C14 7.28102 13.7761 7.50488 13.5 7.50488C10.1862 7.50488 7.50007 10.1911 7.5 13.5049C7.5 13.781 7.27614 14.0049 7 14.0049C6.72386 14.0049 6.5 13.781 6.5 13.5049C6.49993 10.1911 3.81382 7.50488 0.5 7.50488C0.223858 7.50488 0 7.28102 0 7.00488C6.59601e-05 6.7288 0.223898 6.50488 0.5 6.50488C3.81386 6.50488 6.5 3.81874 6.5 0.504883C6.50007 0.228796 6.7239 0.00488281 7 0.00488281Z";

/**
 * AI buttons carry an AiStarIcon as a child in real usage, so an iconless
 * preview reads wrong. Inject a matching star when previewing an AI variant
 * (only if the button has no icon of its own) and remove our injected one
 * otherwise — never touching the button's real content.
 */
const syncAiIcon = (element: HTMLElement, variant: string): void => {
  const injected = element.querySelector(':scope > [data-sandbox-ai-icon]');
  if (AI_VARIANTS.has(variant)) {
    if (injected || element.querySelector(":scope > svg")) return;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 14 14");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "mr-1");
    svg.setAttribute("data-sandbox-ai-icon", "true");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", AI_ICON_PATH);
    svg.appendChild(path);
    element.insertBefore(svg, element.firstChild);
  } else if (injected) {
    injected.remove();
  }
};

/** Apply (or revert, when `variant` equals the original) a variant on the live element. */
export const applyButtonVariant = (
  element: HTMLElement,
  origin: ButtonOrigin,
  variant: string,
): void => {
  if (!origin.isButton) return;
  const target = variant || origin.variant;
  element.className =
    target === origin.variant
      ? origin.baseClassName
      : classNameForVariant(origin.baseClassName, origin.variant, target);
  syncAiIcon(element, target);
};
