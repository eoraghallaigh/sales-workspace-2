import {
  ColorToken,
  ScaleToken,
  TypographyToken,
  SPACING_STEPS_PX,
  TYPOGRAPHY_TOKENS,
} from "./tokens";

let probe: HTMLDivElement | null = null;

const getProbe = (): HTMLDivElement => {
  if (!probe) {
    probe = document.createElement("div");
    probe.setAttribute("data-sandbox-ui", "true");
    probe.style.display = "none";
    document.body.appendChild(probe);
  }
  return probe;
};

export const toRgb = (color: string): string => {
  if (!color) return "";
  const el = getProbe();
  el.style.color = "rgb(1, 2, 3)";
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  return computed || color.toLowerCase();
};

export const resolveVar = (token: ColorToken): string => {
  const live = getComputedStyle(document.documentElement).getPropertyValue(token.cssVar).trim();
  return live || token.fallback;
};

export const findColorToken = (
  value: string,
  list: ColorToken[],
): ColorToken | undefined => {
  const target = toRgb(value);
  if (!target) return undefined;
  return list.find((token) => toRgb(resolveVar(token)) === target);
};

export interface ScaleMatch {
  token: ScaleToken;
  exact: boolean;
}

export const nearestScaleToken = (px: number, list: ScaleToken[]): ScaleMatch => {
  const exact = list.find((token) => token.px === px);
  if (exact) return { token: exact, exact: true };
  const nearest = list.reduce((best, token) =>
    Math.abs(token.px - px) < Math.abs(best.px - px) ? token : best,
  );
  return { token: nearest, exact: false };
};

export interface TypographyMatch {
  token: TypographyToken;
  exact: boolean;
}

export const nearestTypographyToken = (
  size: number,
  line: number,
  weight: number,
): TypographyMatch => {
  const score = (token: TypographyToken) =>
    Math.abs(token.size - size) * 12 +
    Math.abs(token.line - line) * 4 +
    Math.abs(token.weight - weight) / 100;
  const nearest = TYPOGRAPHY_TOKENS.reduce((best, token) =>
    score(token) < score(best) ? token : best,
  );
  const exact =
    nearest.size === size && nearest.line === line && nearest.weight === weight;
  return { token: nearest, exact };
};

export interface SpacingMatch {
  px: number;
  exact: boolean;
}

export const nearestSpacingStep = (px: number): SpacingMatch => {
  const exact = SPACING_STEPS_PX.includes(px);
  if (exact) return { px, exact: true };
  const nearest = SPACING_STEPS_PX.reduce((best, step) =>
    Math.abs(step - px) < Math.abs(best - px) ? step : best,
  );
  return { px: nearest, exact: false };
};

export const parsePx = (value: string): number => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
};
