import { parsePx } from "@/design-tokens/resolve";

export interface Band {
  side: "top" | "right" | "bottom" | "left";
  value: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface GapMarker {
  axis: "vertical" | "horizontal";
  value: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ChildBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SpacingModel {
  padding: Band[];
  gaps: GapMarker[];
  children: ChildBox[];
}

const EPSILON = 0.5;

const isVisible = (rect: DOMRect): boolean => rect.width > EPSILON && rect.height > EPSILON;

const paddingBands = (rect: DOMRect, cs: CSSStyleDeclaration): Band[] => {
  const top = parsePx(cs.paddingTop);
  const right = parsePx(cs.paddingRight);
  const bottom = parsePx(cs.paddingBottom);
  const left = parsePx(cs.paddingLeft);

  const bands: Band[] = [];
  if (top > 0) {
    bands.push({ side: "top", value: top, left: rect.left, top: rect.top, width: rect.width, height: top });
  }
  if (bottom > 0) {
    bands.push({
      side: "bottom",
      value: bottom,
      left: rect.left,
      top: rect.bottom - bottom,
      width: rect.width,
      height: bottom,
    });
  }
  const innerTop = rect.top + top;
  const innerHeight = Math.max(0, rect.height - top - bottom);
  if (left > 0) {
    bands.push({ side: "left", value: left, left: rect.left, top: innerTop, width: left, height: innerHeight });
  }
  if (right > 0) {
    bands.push({
      side: "right",
      value: right,
      left: rect.right - right,
      top: innerTop,
      width: right,
      height: innerHeight,
    });
  }
  return bands;
};

const gapBetween = (a: DOMRect, b: DOMRect): GapMarker | null => {
  // Vertical gap: b sits below a with horizontal overlap.
  const overlapLeft = Math.max(a.left, b.left);
  const overlapRight = Math.min(a.right, b.right);
  const horizontalOverlap = overlapRight - overlapLeft;

  const overlapTop = Math.max(a.top, b.top);
  const overlapBottom = Math.min(a.bottom, b.bottom);
  const verticalOverlap = overlapBottom - overlapTop;

  if (b.top - a.bottom > EPSILON && horizontalOverlap > EPSILON) {
    const value = Math.round(b.top - a.bottom);
    return {
      axis: "vertical",
      value,
      left: overlapLeft,
      top: a.bottom,
      width: horizontalOverlap,
      height: b.top - a.bottom,
    };
  }
  if (b.left - a.right > EPSILON && verticalOverlap > EPSILON) {
    const value = Math.round(b.left - a.right);
    return {
      axis: "horizontal",
      value,
      left: a.right,
      top: overlapTop,
      width: b.left - a.right,
      height: verticalOverlap,
    };
  }
  return null;
};

export const computeSpacing = (element: HTMLElement): SpacingModel => {
  const rect = element.getBoundingClientRect();
  const cs = getComputedStyle(element);

  const childElements = Array.from(element.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
  const childRects = childElements
    .map((child) => child.getBoundingClientRect())
    .filter(isVisible);

  const children: ChildBox[] = childRects.map((r) => ({
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
  }));

  const gaps: GapMarker[] = [];
  for (let index = 0; index < childRects.length - 1; index += 1) {
    const marker = gapBetween(childRects[index], childRects[index + 1]);
    if (marker) gaps.push(marker);
  }

  return {
    padding: paddingBands(rect, cs),
    gaps,
    children,
  };
};
