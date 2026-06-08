import {
  BG_COLOR_TOKENS,
  BORDER_COLOR_TOKENS,
  BORDER_WIDTH_TOKENS,
  ColorToken,
  RADIUS_TOKENS,
  TEXT_COLOR_TOKENS,
} from "@/design-tokens/tokens";
import {
  findColorToken,
  nearestScaleToken,
  nearestTypographyToken,
  parsePx,
  toRgb,
} from "@/design-tokens/resolve";
import { ElementSource, getElementSource } from "../sandbox/fiber";

export interface InspectColor {
  label: string;
  display: string;
  rgb: string;
  token: string;
  cssVar: string;
  isTransparent: boolean;
}

export interface InspectType {
  token: string;
  exact: boolean;
  fontFamily: string;
  fontFamilyStack: string;
  fontSize: number;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
  textTransform: string;
  fontStyle: string;
}

export interface InspectScale {
  px: number;
  token: string;
  exact: boolean;
  uniform: boolean;
}

export interface InspectSides {
  top: number;
  right: number;
  bottom: number;
  left: number;
  uniform: boolean;
}

export interface Inspection {
  tag: string;
  id: string;
  classes: string[];
  testId: string;
  role: string;
  ariaLabel: string;
  componentName: string;
  source: ElementSource;
  width: number;
  height: number;
  display: string;
  colors: InspectColor[];
  type: InspectType;
  padding: InspectSides;
  margin: InspectSides;
  gap: number | null;
  borderWidth: InspectScale;
  borderStyle: string;
  borderRadius: InspectScale;
  shadowToken: string;
  shadowRaw: string;
  opacity: string;
}

interface ParsedRgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

const parseRgb = (value: string): ParsedRgb | null => {
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;
  const parts = match[1].split(",").map((part) => parseFloat(part.trim()));
  if (parts.length < 3 || parts.some((part) => !Number.isFinite(part))) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length >= 4 ? parts[3] : 1 };
};

const hexPart = (value: number): string =>
  Math.round(value).toString(16).padStart(2, "0").toUpperCase();

const formatColor = (rgb: string): { display: string; isTransparent: boolean } => {
  const parsed = parseRgb(rgb);
  if (!parsed) return { display: rgb || "—", isTransparent: !rgb || rgb === "transparent" };
  if (parsed.a === 0) return { display: "transparent", isTransparent: true };
  if (parsed.a < 1) {
    const alpha = Math.round(parsed.a * 100) / 100;
    return { display: `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`, isTransparent: false };
  }
  return {
    display: `#${hexPart(parsed.r)}${hexPart(parsed.g)}${hexPart(parsed.b)}`,
    isTransparent: false,
  };
};

const inspectColor = (label: string, raw: string, list: ColorToken[]): InspectColor => {
  const rgb = toRgb(raw);
  const { display, isTransparent } = formatColor(rgb);
  const token = isTransparent ? undefined : findColorToken(raw, list);
  return {
    label,
    display,
    rgb,
    token: token?.name ?? "",
    cssVar: token?.cssVar ?? "",
    isTransparent,
  };
};

const cleanFamily = (stack: string): string => {
  const first = stack.split(",")[0]?.trim() ?? stack;
  return first.replace(/^['"]|['"]$/g, "");
};

const formatLetterSpacing = (value: string): string => {
  if (!value || value === "normal") return "normal";
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? `${Math.round(parsed * 100) / 100}px` : value;
};

const makeSides = (top: number, right: number, bottom: number, left: number): InspectSides => ({
  top,
  right,
  bottom,
  left,
  uniform: top === right && right === bottom && bottom === left,
});

const SHADOW_SIGNATURES: [string, string][] = [
  ["1px 8px", "shadow-100"],
  ["8px 16px", "shadow-200"],
  ["16px 32px", "shadow-300"],
  ["24px 48px", "shadow-400"],
];

const matchShadowToken = (boxShadow: string): string => {
  const raw = (boxShadow || "none").trim();
  if (raw === "none") return "none";
  const hit = SHADOW_SIGNATURES.find(([needle]) => raw.includes(needle));
  return hit ? hit[1] : "";
};

export const inspectElement = (element: HTMLElement): Inspection => {
  const cs = getComputedStyle(element);
  const source = getElementSource(element);
  const rect = element.getBoundingClientRect();

  const fontSize = parsePx(cs.fontSize);
  const lineHeightPx = cs.lineHeight === "normal" ? 0 : parsePx(cs.lineHeight);
  const fontWeight = parseInt(cs.fontWeight, 10) || 400;
  const typeMatch = nearestTypographyToken(fontSize, lineHeightPx, fontWeight);

  const borderWidthPx = parsePx(cs.borderTopWidth);
  const borderWidth = nearestScaleToken(borderWidthPx, BORDER_WIDTH_TOKENS);
  const borderUniform =
    cs.borderTopWidth === cs.borderRightWidth &&
    cs.borderRightWidth === cs.borderBottomWidth &&
    cs.borderBottomWidth === cs.borderLeftWidth;

  const radiusPx = parsePx(cs.borderTopLeftRadius);
  const radius = nearestScaleToken(radiusPx, RADIUS_TOKENS);
  const radiusUniform =
    cs.borderTopLeftRadius === cs.borderTopRightRadius &&
    cs.borderTopRightRadius === cs.borderBottomRightRadius &&
    cs.borderBottomRightRadius === cs.borderBottomLeftRadius;

  const display = cs.display;
  const isFlexOrGrid = /flex|grid/.test(display);
  const hasBorder = borderWidthPx > 0 && cs.borderTopStyle !== "none";

  const colors: InspectColor[] = [inspectColor("Text", cs.color, TEXT_COLOR_TOKENS)];
  const background = inspectColor("Background", cs.backgroundColor, BG_COLOR_TOKENS);
  if (!background.isTransparent) colors.push(background);
  if (hasBorder) colors.push(inspectColor("Border", cs.borderTopColor, BORDER_COLOR_TOKENS));

  const className = typeof element.className === "string" ? element.className : "";

  return {
    tag: element.tagName.toLowerCase(),
    id: element.id || "",
    classes: className.trim() ? className.trim().split(/\s+/) : [],
    testId: element.getAttribute("data-testid") || "",
    role: element.getAttribute("role") || "",
    ariaLabel: element.getAttribute("aria-label") || "",
    componentName: source.componentName ?? "",
    source,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    display,
    colors,
    type: {
      token: typeMatch.token.name,
      exact: typeMatch.exact,
      fontFamily: cleanFamily(cs.fontFamily),
      fontFamilyStack: cs.fontFamily,
      fontSize,
      lineHeight: cs.lineHeight === "normal" ? "normal" : `${lineHeightPx}px`,
      fontWeight,
      letterSpacing: formatLetterSpacing(cs.letterSpacing),
      textTransform: cs.textTransform || "none",
      fontStyle: cs.fontStyle || "normal",
    },
    padding: makeSides(
      parsePx(cs.paddingTop),
      parsePx(cs.paddingRight),
      parsePx(cs.paddingBottom),
      parsePx(cs.paddingLeft),
    ),
    margin: makeSides(
      parsePx(cs.marginTop),
      parsePx(cs.marginRight),
      parsePx(cs.marginBottom),
      parsePx(cs.marginLeft),
    ),
    gap: isFlexOrGrid ? parsePx(cs.gap) : null,
    borderWidth: {
      px: borderWidthPx,
      token: borderWidth.token.name,
      exact: borderWidth.exact,
      uniform: borderUniform,
    },
    borderStyle: hasBorder ? cs.borderTopStyle : "none",
    borderRadius: {
      px: radiusPx,
      token: radius.token.name,
      exact: radius.exact,
      uniform: radiusUniform,
    },
    shadowToken: matchShadowToken(cs.boxShadow),
    shadowRaw: (cs.boxShadow || "none").trim(),
    opacity: cs.opacity || "1",
  };
};
