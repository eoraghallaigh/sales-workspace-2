import {
  BG_COLOR_TOKENS,
  BORDER_COLOR_TOKENS,
  BORDER_WIDTH_TOKENS,
  ColorToken,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  TEXT_COLOR_TOKENS,
  TYPOGRAPHY_TOKENS,
  spacingClassFor,
} from "@/design-tokens/tokens";
import {
  findColorToken,
  nearestScaleToken,
  nearestSpacingStep,
  nearestTypographyToken,
  parsePx,
  resolveVar,
  toRgb,
} from "@/design-tokens/resolve";
import { ElementSource } from "./fiber";
import { detectButtonVariant, detectButtonSize } from "./buttonVariants";
import { type MoveRecord, moveSummaryLine } from "./reorder";

export interface Crumb {
  element: HTMLElement;
  label: string;
}

export interface ColorOrigin {
  tokenName: string;
  raw: string;
  offToken: boolean;
}

export interface ScaleOrigin {
  tokenName: string;
  px: number;
  offToken: boolean;
}

export interface Original {
  textColor: ColorOrigin;
  bgColor: ColorOrigin;
  borderColor: ColorOrigin;
  typography: { tokenName: string; raw: string; offToken: boolean };
  letterSpacing: number;
  textTransform: string;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  gap: number;
  display: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  flexWrap: string;
  width: number;
  height: number;
  borderWidth: ScaleOrigin;
  borderRadius: ScaleOrigin;
  shadow: { tokenName: string; raw: string; offToken: boolean };
  // Component-level (currently buttons only): the variant prop is fixed by the
  // component, so it gets its own control rather than free-form style edits.
  isButton: boolean;
  variant: string;
  buttonSize: string;
  baseClassName: string;
}

export interface PanelState {
  textColor: string;
  bgColor: string;
  borderColor: string;
  typography: string;
  letterSpacing: number;
  textTransform: string;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  gap: number;
  display: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  flexWrap: string;
  width: string;
  height: string;
  borderWidth: string;
  borderRadius: string;
  shadow: string;
  variant: string;
  buttonSize: string;
  agentInstructions: string;
}

export interface BuiltOutput {
  decls: Record<string, string>;
  classes: string[];
  summary: string[];
}

export interface SandboxEntry {
  id: string;
  element: HTMLElement;
  source: ElementSource;
  label: string;
  crumbs: Crumb[];
  original: Original;
  state: PanelState;
  // A recorded DOM reorder for this element (set by dragging it in design mode).
  move?: MoveRecord;
  // Original DOM position, captured before the first move/delete so it can be restored.
  moveUndo?: { parent: Node; next: Node | null };
  // Marked for deletion (Backspace in design mode); removed from the live DOM as a preview.
  deleted?: boolean;
}

const matchColor = (value: string, list: ColorToken[]): ColorOrigin => {
  const token = findColorToken(value, list);
  return { tokenName: token?.name ?? "", raw: toRgb(value), offToken: !token };
};

const SHADOW_SIGNATURES: [string, string][] = [
  ["1px 8px", "shadow-100"],
  ["8px 16px", "shadow-200"],
  ["16px 32px", "shadow-300"],
  ["24px 48px", "shadow-400"],
];

const matchShadow = (boxShadow: string) => {
  const raw = (boxShadow || "none").trim();
  if (raw === "none") return { tokenName: "none", raw, offToken: false };
  const hit = SHADOW_SIGNATURES.find(([needle]) => raw.includes(needle));
  return hit ? { tokenName: hit[1], raw, offToken: false } : { tokenName: "", raw, offToken: true };
};

const parseLetterSpacing = (value: string): number => {
  if (!value || value === "normal") return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 10) / 10 : 0;
};

export const computeOriginal = (element: HTMLElement): Original => {
  const cs = getComputedStyle(element);
  const detectedVariant = element.tagName === "BUTTON" ? detectButtonVariant(element) : "";
  const type = nearestTypographyToken(
    parsePx(cs.fontSize),
    parsePx(cs.lineHeight),
    parseInt(cs.fontWeight, 10) || 400,
  );
  const borderWidth = nearestScaleToken(parsePx(cs.borderTopWidth), BORDER_WIDTH_TOKENS);
  const radius = nearestScaleToken(parsePx(cs.borderTopLeftRadius), RADIUS_TOKENS);
  return {
    textColor: matchColor(cs.color, TEXT_COLOR_TOKENS),
    bgColor: matchColor(cs.backgroundColor, BG_COLOR_TOKENS),
    borderColor: matchColor(cs.borderTopColor, BORDER_COLOR_TOKENS),
    typography: {
      tokenName: type.exact ? type.token.name : "",
      raw: `${parsePx(cs.fontSize)}px / ${parsePx(cs.lineHeight)} / ${cs.fontWeight}`,
      offToken: !type.exact,
    },
    letterSpacing: parseLetterSpacing(cs.letterSpacing),
    textTransform: cs.textTransform && cs.textTransform !== "none" ? cs.textTransform : "none",
    paddingTop: nearestSpacingStep(parsePx(cs.paddingTop)).px,
    paddingRight: nearestSpacingStep(parsePx(cs.paddingRight)).px,
    paddingBottom: nearestSpacingStep(parsePx(cs.paddingBottom)).px,
    paddingLeft: nearestSpacingStep(parsePx(cs.paddingLeft)).px,
    marginTop: nearestSpacingStep(parsePx(cs.marginTop)).px,
    marginRight: nearestSpacingStep(parsePx(cs.marginRight)).px,
    marginBottom: nearestSpacingStep(parsePx(cs.marginBottom)).px,
    marginLeft: nearestSpacingStep(parsePx(cs.marginLeft)).px,
    gap: nearestSpacingStep(parsePx(cs.gap)).px,
    display: cs.display,
    flexDirection: cs.flexDirection,
    justifyContent: cs.justifyContent,
    alignItems: cs.alignItems,
    flexWrap: cs.flexWrap,
    width: parsePx(cs.width),
    height: parsePx(cs.height),
    borderWidth: {
      tokenName: borderWidth.exact ? borderWidth.token.name : "",
      px: parsePx(cs.borderTopWidth),
      offToken: !borderWidth.exact,
    },
    borderRadius: {
      tokenName: radius.exact ? radius.token.name : "",
      px: parsePx(cs.borderTopLeftRadius),
      offToken: !radius.exact,
    },
    shadow: matchShadow(cs.boxShadow),
    isButton: detectedVariant !== "",
    variant: detectedVariant,
    buttonSize: detectedVariant !== "" ? detectButtonSize(element) : "",
    baseClassName: typeof element.className === "string" ? element.className : "",
  };
};

export const initialState = (o: Original): PanelState => ({
  textColor: o.textColor.tokenName,
  bgColor: o.bgColor.tokenName,
  borderColor: o.borderColor.tokenName,
  typography: o.typography.tokenName,
  letterSpacing: o.letterSpacing,
  textTransform: o.textTransform,
  paddingTop: o.paddingTop,
  paddingRight: o.paddingRight,
  paddingBottom: o.paddingBottom,
  paddingLeft: o.paddingLeft,
  marginTop: o.marginTop,
  marginRight: o.marginRight,
  marginBottom: o.marginBottom,
  marginLeft: o.marginLeft,
  gap: o.gap,
  display: o.display,
  flexDirection: o.flexDirection,
  justifyContent: o.justifyContent,
  alignItems: o.alignItems,
  flexWrap: o.flexWrap,
  width: "",
  height: "",
  borderWidth: o.borderWidth.tokenName,
  borderRadius: o.borderRadius.tokenName,
  shadow: o.shadow.tokenName,
  variant: o.variant,
  buttonSize: o.buttonSize,
  agentInstructions: "",
});

const colorValue = (list: ColorToken[], name: string): string => {
  const token = list.find((t) => t.name === name);
  return token ? resolveVar(token) : "";
};

const colorVar = (list: ColorToken[], name: string): string => {
  const token = list.find((t) => t.name === name);
  return token ? token.cssVar : "";
};

const transformClass = (value: string): string => {
  if (value === "uppercase") return "uppercase";
  if (value === "lowercase") return "lowercase";
  if (value === "capitalize") return "capitalize";
  return "normal-case";
};

const FLEX_CLASS_MAPS: Record<string, Record<string, string>> = {
  display: {
    flex: "flex",
    "inline-flex": "inline-flex",
    grid: "grid",
    "inline-grid": "inline-grid",
    block: "block",
    "inline-block": "inline-block",
    inline: "inline",
    none: "hidden",
  },
  "flex-direction": {
    row: "flex-row",
    "row-reverse": "flex-row-reverse",
    column: "flex-col",
    "column-reverse": "flex-col-reverse",
  },
  "justify-content": {
    "flex-start": "justify-start",
    start: "justify-start",
    center: "justify-center",
    "flex-end": "justify-end",
    end: "justify-end",
    "space-between": "justify-between",
    "space-around": "justify-around",
    "space-evenly": "justify-evenly",
  },
  "align-items": {
    stretch: "items-stretch",
    "flex-start": "items-start",
    start: "items-start",
    center: "items-center",
    "flex-end": "items-end",
    end: "items-end",
    baseline: "items-baseline",
  },
  "flex-wrap": {
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
  },
};

export const buildOutput = (state: PanelState, o: Original): BuiltOutput => {
  const decls: Record<string, string> = {};
  const classes: string[] = [];
  const summary: string[] = [];

  const colorChange = (
    prop: string,
    twPrefix: string,
    list: ColorToken[],
    selected: string,
    origin: ColorOrigin,
    label: string,
  ) => {
    if (!selected || selected === origin.tokenName) return;
    decls[prop] = colorValue(list, selected);
    classes.push(`${twPrefix}-[var(${colorVar(list, selected)})]`);
    summary.push(`${label}: ${selected} (was ${origin.tokenName || origin.raw})`);
  };

  colorChange("color", "text", TEXT_COLOR_TOKENS, state.textColor, o.textColor, "text / icon colour");
  colorChange("background-color", "bg", BG_COLOR_TOKENS, state.bgColor, o.bgColor, "background");
  colorChange("border-color", "border", BORDER_COLOR_TOKENS, state.borderColor, o.borderColor, "border colour");

  if (state.typography && state.typography !== o.typography.tokenName) {
    const token = TYPOGRAPHY_TOKENS.find((t) => t.name === state.typography);
    if (token) {
      decls["font-size"] = `${token.size}px`;
      decls["line-height"] = `${token.line}px`;
      decls["font-weight"] = `${token.weight}`;
      decls["font-family"] = token.family;
      classes.push(token.name);
      summary.push(`typography: ${token.name} (was ${o.typography.tokenName || o.typography.raw})`);
    }
  }

  if (state.letterSpacing !== o.letterSpacing) {
    decls["letter-spacing"] = `${state.letterSpacing}px`;
    classes.push(`tracking-[${state.letterSpacing}px]`);
    summary.push(`letter-spacing: ${state.letterSpacing}px (was ${o.letterSpacing}px)`);
  }

  if (state.textTransform !== o.textTransform) {
    decls["text-transform"] = state.textTransform;
    classes.push(transformClass(state.textTransform));
    summary.push(`text-transform: ${state.textTransform} (was ${o.textTransform})`);
  }

  const spacingChange = (
    props: string[],
    twPrefix: string,
    value: number,
    original: number,
    label: string,
  ) => {
    if (value === original) return;
    props.forEach((prop) => {
      decls[prop] = `${value}px`;
    });
    classes.push(spacingClassFor(twPrefix, value));
    summary.push(`${label}: ${value}px (was ${original}px)`);
  };

  spacingChange(["padding-top"], "pt", state.paddingTop, o.paddingTop, "padding-top");
  spacingChange(["padding-right"], "pr", state.paddingRight, o.paddingRight, "padding-right");
  spacingChange(["padding-bottom"], "pb", state.paddingBottom, o.paddingBottom, "padding-bottom");
  spacingChange(["padding-left"], "pl", state.paddingLeft, o.paddingLeft, "padding-left");
  spacingChange(["margin-top"], "mt", state.marginTop, o.marginTop, "margin-top");
  spacingChange(["margin-right"], "mr", state.marginRight, o.marginRight, "margin-right");
  spacingChange(["margin-bottom"], "mb", state.marginBottom, o.marginBottom, "margin-bottom");
  spacingChange(["margin-left"], "ml", state.marginLeft, o.marginLeft, "margin-left");
  spacingChange(["gap"], "gap", state.gap, o.gap, "gap");

  const flexChange = (cssProp: string, value: string, original: string, label: string) => {
    if (!value || value === original) return;
    decls[cssProp] = value;
    const twClass = FLEX_CLASS_MAPS[cssProp]?.[value];
    if (twClass) classes.push(twClass);
    summary.push(`${label}: ${value} (was ${original})`);
  };

  flexChange("display", state.display, o.display, "display");
  flexChange("flex-direction", state.flexDirection, o.flexDirection, "flex-direction");
  flexChange("justify-content", state.justifyContent, o.justifyContent, "justify-content");
  flexChange("align-items", state.alignItems, o.alignItems, "align-items");
  flexChange("flex-wrap", state.flexWrap, o.flexWrap, "flex-wrap");

  if (state.width.trim() !== "") {
    const px = parseFloat(state.width);
    if (Number.isFinite(px)) {
      decls["width"] = `${px}px`;
      classes.push(`w-[${px}px]`);
      summary.push(`width: ${px}px (was ${o.width}px)`);
    }
  }

  if (state.height.trim() !== "") {
    const px = parseFloat(state.height);
    if (Number.isFinite(px)) {
      decls["height"] = `${px}px`;
      classes.push(`h-[${px}px]`);
      summary.push(`height: ${px}px (was ${o.height}px)`);
    }
  }

  if (state.borderWidth && state.borderWidth !== o.borderWidth.tokenName) {
    const token = BORDER_WIDTH_TOKENS.find((t) => t.name === state.borderWidth);
    if (token) {
      decls["border-width"] = `${token.px}px`;
      classes.push(token.twClass);
      summary.push(`border-width: ${token.name} (was ${o.borderWidth.tokenName || `${o.borderWidth.px}px`})`);
    }
  }

  if (state.borderRadius && state.borderRadius !== o.borderRadius.tokenName) {
    const token = RADIUS_TOKENS.find((t) => t.name === state.borderRadius);
    if (token) {
      decls["border-radius"] = `${token.px}px`;
      classes.push(token.twClass);
      summary.push(`border-radius: ${token.name} (was ${o.borderRadius.tokenName || `${o.borderRadius.px}px`})`);
    }
  }

  if (state.shadow && state.shadow !== o.shadow.tokenName) {
    const token = SHADOW_TOKENS.find((t) => t.name === state.shadow);
    if (token) {
      decls["box-shadow"] = token.css;
      classes.push(token.twClass);
      summary.push(`shadow: ${token.name} (was ${o.shadow.tokenName || "custom"})`);
    }
  }

  // Variant is a component prop, not a style declaration — report it as guidance
  // (no decls/classes to copy; the agent changes the `variant` prop).
  if (o.isButton && state.variant && state.variant !== o.variant) {
    summary.push(`variant prop: ${state.variant} (was ${o.variant})`);
  }

  if (o.isButton && state.buttonSize && state.buttonSize !== o.buttonSize) {
    summary.push(`size prop: ${state.buttonSize} (was ${o.buttonSize})`);
  }

  return { decls, classes, summary };
};

export const changeCount = (entry: SandboxEntry): number =>
  buildOutput(entry.state, entry.original).summary.length +
  (entry.move ? 1 : 0) +
  (entry.deleted ? 1 : 0) +
  (entry.state.agentInstructions.trim() ? 1 : 0);

export const hasChanges = (entry: SandboxEntry): boolean => changeCount(entry) > 0;

export const targetLineFor = (source: ElementSource, element: HTMLElement): string =>
  source.relativeFileName
    ? `${source.componentName ? `<${source.componentName}> ` : ""}${source.relativeFileName}${source.lineNumber ? `:${source.lineNumber}` : ""}`
    : source.componentName
      ? `<${source.componentName}> (source unavailable)`
      : `${element.tagName.toLowerCase()} (source unavailable)`;

export const formatEntryBlock = (
  source: ElementSource,
  element: HTMLElement,
  output: BuiltOutput,
  move?: MoveRecord,
  deleted?: boolean,
  agentInstructions?: string,
): string => {
  const classAttr =
    typeof element.className === "string" && element.className ? ` class="${element.className}"` : "";
  const summaryLines = [...output.summary];
  if (move) summaryLines.push(moveSummaryLine(move));
  if (deleted) summaryLines.push("DOM: delete this element");
  const lines: string[] = [
    `Target: ${targetLineFor(source, element)}`,
    `Element: <${element.tagName.toLowerCase()}${classAttr}>`,
    "",
    "Changes:",
    ...(summaryLines.length ? summaryLines.map((s) => `  - ${s}`) : ["  (none yet)"]),
  ];
  if (output.classes.length) {
    lines.push("", `Tailwind classes to apply: ${output.classes.join(" ")}`);
  }
  const cssBlock = Object.entries(output.decls)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join("\n");
  if (cssBlock) {
    lines.push("", "Resolved CSS:", ".selector {", cssBlock, "}");
  }
  if (agentInstructions?.trim()) {
    lines.push("", "Agent instructions:", agentInstructions.trim());
  }
  return lines.join("\n");
};
