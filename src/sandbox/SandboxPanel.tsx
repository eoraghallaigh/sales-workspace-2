import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
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
import { applyOverride, clearOverride } from "./overrides";
import { ElementSource } from "./fiber";
import {
  ColorSelect,
  EnumSelect,
  Field,
  RangeControl,
  SectionTitle,
  TokenSelect,
} from "./controls";

export interface Crumb {
  element: HTMLElement;
  label: string;
}

interface SandboxPanelProps {
  element: HTMLElement;
  sandboxId: string;
  source: ElementSource;
  crumbs: Crumb[];
  onSelectCrumb: (element: HTMLElement) => void;
  onClose: () => void;
}

interface ColorOrigin {
  tokenName: string;
  raw: string;
  offToken: boolean;
}

interface ScaleOrigin {
  tokenName: string;
  px: number;
  offToken: boolean;
}

interface Original {
  textColor: ColorOrigin;
  bgColor: ColorOrigin;
  borderColor: ColorOrigin;
  typography: { tokenName: string; raw: string; offToken: boolean };
  letterSpacing: number;
  textTransform: string;
  paddingX: number;
  paddingY: number;
  marginX: number;
  marginY: number;
  gap: number;
  borderWidth: ScaleOrigin;
  borderRadius: ScaleOrigin;
  shadow: { tokenName: string; raw: string; offToken: boolean };
}

interface PanelState {
  textColor: string;
  bgColor: string;
  borderColor: string;
  typography: string;
  letterSpacing: number;
  textTransform: string;
  paddingX: number;
  paddingY: number;
  marginX: number;
  marginY: number;
  gap: number;
  borderWidth: string;
  borderRadius: string;
  shadow: string;
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

const computeOriginal = (element: HTMLElement): Original => {
  const cs = getComputedStyle(element);
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
    paddingX: nearestSpacingStep(parsePx(cs.paddingLeft)).px,
    paddingY: nearestSpacingStep(parsePx(cs.paddingTop)).px,
    marginX: nearestSpacingStep(parsePx(cs.marginLeft)).px,
    marginY: nearestSpacingStep(parsePx(cs.marginTop)).px,
    gap: nearestSpacingStep(parsePx(cs.gap)).px,
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
  };
};

const initialState = (o: Original): PanelState => ({
  textColor: o.textColor.tokenName,
  bgColor: o.bgColor.tokenName,
  borderColor: o.borderColor.tokenName,
  typography: o.typography.tokenName,
  letterSpacing: o.letterSpacing,
  textTransform: o.textTransform,
  paddingX: o.paddingX,
  paddingY: o.paddingY,
  marginX: o.marginX,
  marginY: o.marginY,
  gap: o.gap,
  borderWidth: o.borderWidth.tokenName,
  borderRadius: o.borderRadius.tokenName,
  shadow: o.shadow.tokenName,
});

const colorValue = (list: ColorToken[], name: string): string => {
  const token = list.find((t) => t.name === name);
  return token ? resolveVar(token) : "";
};

const colorVar = (list: ColorToken[], name: string): string => {
  const token = list.find((t) => t.name === name);
  return token ? token.cssVar : "";
};

interface BuiltOutput {
  decls: Record<string, string>;
  classes: string[];
  summary: string[];
}

const transformClass = (value: string): string => {
  if (value === "uppercase") return "uppercase";
  if (value === "lowercase") return "lowercase";
  if (value === "capitalize") return "capitalize";
  return "normal-case";
};

const buildOutput = (state: PanelState, o: Original): BuiltOutput => {
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

  spacingChange(["padding-left", "padding-right"], "px", state.paddingX, o.paddingX, "padding-x");
  spacingChange(["padding-top", "padding-bottom"], "py", state.paddingY, o.paddingY, "padding-y");
  spacingChange(["margin-left", "margin-right"], "mx", state.marginX, o.marginX, "margin-x");
  spacingChange(["margin-top", "margin-bottom"], "my", state.marginY, o.marginY, "margin-y");
  spacingChange(["gap"], "gap", state.gap, o.gap, "gap");

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

  return { decls, classes, summary };
};

const TRANSFORM_OPTIONS: { value: string; label: string }[] = [
  { value: "none", label: "none" },
  { value: "uppercase", label: "uppercase" },
  { value: "capitalize", label: "capitalize" },
  { value: "lowercase", label: "lowercase" },
];

const SandboxPanel = ({
  element,
  sandboxId,
  source,
  crumbs,
  onSelectCrumb,
  onClose,
}: SandboxPanelProps) => {
  const original = useMemo(() => computeOriginal(element), [element]);
  const [state, setState] = useState<PanelState>(() => initialState(original));
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof PanelState>(key: K) => (value: PanelState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const output = useMemo(() => buildOutput(state, original), [state, original]);

  useEffect(() => {
    applyOverride(sandboxId, output.decls);
  }, [sandboxId, output.decls]);

  const declKey = JSON.stringify(output.decls);
  useEffect(() => {
    setCopied(false);
  }, [declKey]);

  const reset = () => setState(initialState(original));

  const cssBlock = Object.entries(output.decls)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join("\n");

  const targetLine = source.relativeFileName
    ? `${source.componentName ? `<${source.componentName}> ` : ""}${source.relativeFileName}${source.lineNumber ? `:${source.lineNumber}` : ""}`
    : source.componentName
      ? `<${source.componentName}> (source unavailable)`
      : `${element.tagName.toLowerCase()} (source unavailable)`;

  const classAttr =
    typeof element.className === "string" && element.className ? ` class="${element.className}"` : "";
  const lines: string[] = [
    `Target: ${targetLine}`,
    `Element: <${element.tagName.toLowerCase()}${classAttr}>`,
    "",
    "Changes:",
    ...(output.summary.length ? output.summary.map((s) => `  - ${s}`) : ["  (none yet)"]),
  ];
  if (output.classes.length) {
    lines.push("", `Tailwind classes to apply: ${output.classes.join(" ")}`);
  }
  if (cssBlock) {
    lines.push("", "Resolved CSS:", ".selector {", cssBlock, "}");
  }
  const agentBlock = lines.join("\n");

  const copy = () => {
    navigator.clipboard?.writeText(agentBlock).then(() => setCopied(true)).catch(() => setCopied(false));
  };

  return (
    <div
      data-sandbox-ui="true"
      className="fixed right-4 top-4 bottom-4 z-[2147483647] flex w-[360px] flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-2xl"
      style={{ fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif", pointerEvents: "auto" }}
    >
      <div className="flex items-start justify-between gap-2 border-b border-slate-200 p-4">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900">Sandbox</h2>
          <p className="mt-0.5 truncate text-[11px] text-slate-500" title={targetLine}>
            {targetLine}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={reset} className="text-xs font-semibold text-[#FF4800] hover:underline">
            Reset
          </button>
          <button onClick={onClose} aria-label="Close sandbox" className="text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 border-b border-slate-100 px-4 py-2 text-[11px] text-slate-500">
        {crumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-slate-300">›</span>}
            <button
              onClick={() => onSelectCrumb(crumb.element)}
              className={`hover:text-[#FF4800] ${index === crumbs.length - 1 ? "font-semibold text-slate-700" : ""}`}
            >
              {crumb.label}
            </button>
          </span>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <SectionTitle>Colour</SectionTitle>
        <div className="flex flex-col gap-3">
          <ColorSelect
            label="Text / icon colour"
            value={state.textColor}
            options={TEXT_COLOR_TOKENS}
            offTokenValue={original.textColor.offToken ? original.textColor.raw : undefined}
            onChange={set("textColor")}
          />
          <ColorSelect
            label="Background"
            value={state.bgColor}
            options={BG_COLOR_TOKENS}
            offTokenValue={original.bgColor.offToken ? original.bgColor.raw : undefined}
            onChange={set("bgColor")}
          />
          <ColorSelect
            label="Border colour"
            value={state.borderColor}
            options={BORDER_COLOR_TOKENS}
            offTokenValue={original.borderColor.offToken ? original.borderColor.raw : undefined}
            onChange={set("borderColor")}
          />
        </div>

        <SectionTitle>Typography</SectionTitle>
        <div className="flex flex-col gap-3">
          <TokenSelect
            label="Type token"
            value={state.typography}
            options={TYPOGRAPHY_TOKENS.map((t) => ({ name: t.name, hint: `${t.size}px / ${t.weight}` }))}
            offTokenLabel={original.typography.offToken ? original.typography.raw : undefined}
            onChange={set("typography")}
          />
          <RangeControl
            label="Letter spacing"
            value={state.letterSpacing}
            min={-1}
            max={4}
            step={0.5}
            onChange={set("letterSpacing")}
          />
          <EnumSelect
            label="Text transform"
            value={state.textTransform}
            options={TRANSFORM_OPTIONS}
            onChange={set("textTransform")}
          />
        </div>

        <SectionTitle>Spacing</SectionTitle>
        <div className="flex flex-col gap-3">
          <RangeControl label="Padding X" value={state.paddingX} min={0} max={64} step={4} onChange={set("paddingX")} />
          <RangeControl label="Padding Y" value={state.paddingY} min={0} max={64} step={4} onChange={set("paddingY")} />
          <RangeControl label="Margin X" value={state.marginX} min={0} max={64} step={4} onChange={set("marginX")} />
          <RangeControl label="Margin Y" value={state.marginY} min={0} max={64} step={4} onChange={set("marginY")} />
          <RangeControl label="Gap" value={state.gap} min={0} max={64} step={4} onChange={set("gap")} />
        </div>

        <SectionTitle>Border &amp; shadow</SectionTitle>
        <div className="flex flex-col gap-3">
          <TokenSelect
            label="Border width"
            value={state.borderWidth}
            options={BORDER_WIDTH_TOKENS.map((t) => ({ name: t.name, hint: `${t.px}px` }))}
            offTokenLabel={original.borderWidth.offToken ? `${original.borderWidth.px}px` : undefined}
            onChange={set("borderWidth")}
          />
          <TokenSelect
            label="Border radius"
            value={state.borderRadius}
            options={RADIUS_TOKENS.map((t) => ({ name: t.name, hint: `${t.px}px` }))}
            offTokenLabel={original.borderRadius.offToken ? `${original.borderRadius.px}px` : undefined}
            onChange={set("borderRadius")}
          />
          <TokenSelect
            label="Shadow"
            value={state.shadow}
            options={SHADOW_TOKENS.map((t) => ({ name: t.name }))}
            offTokenLabel={original.shadow.offToken ? "custom" : undefined}
            onChange={set("shadow")}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <SectionTitle>Output</SectionTitle>
          <button
            onClick={copy}
            disabled={output.summary.length === 0}
            className="rounded bg-[#FF4800] px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40"
          >
            {copied ? "Copied" : "Copy for agent"}
          </button>
        </div>
        <textarea
          readOnly
          value={output.summary.length ? agentBlock : "Adjust a control to generate output."}
          className="h-44 w-full rounded border border-slate-300 bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-100"
        />
      </div>
    </div>
  );
};

export default SandboxPanel;
