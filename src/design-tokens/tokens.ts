export interface ColorToken {
  name: string;
  cssVar: string;
  fallback: string;
}

export interface TypographyToken {
  name: string;
  size: number;
  line: number;
  weight: number;
  family: string;
  letterSpacing: number;
}

export interface ScaleToken {
  name: string;
  px: number;
  twClass: string;
}

export interface ShadowToken {
  name: string;
  css: string;
  twClass: string;
}

const LEXEND = "'Lexend Deca', Helvetica, Arial, sans-serif";
const SOURCE_CODE = "'Source Code Pro', Consolas, Monaco, 'Courier New', monospace";

export const TEXT_COLOR_TOKENS: ColorToken[] = [
  { name: "text-core-default", cssVar: "--color-text-core-default", fallback: "#141414" },
  { name: "text-core-subtle", cssVar: "--color-text-core-subtle", fallback: "#666666" },
  { name: "text-core-disabled", cssVar: "--color-text-core-disabled", fallback: "#8A8A8A" },
  { name: "text-core-onfilldefault", cssVar: "--color-text-core-onfilldefault", fallback: "#FFFFFF" },
  { name: "text-primary-default", cssVar: "--color-text-primary-default", fallback: "#FFFFFF" },
  { name: "text-interactive-default", cssVar: "--color-text-interactive-default", fallback: "#006162" },
  { name: "text-brand-default", cssVar: "--color-text-brand-default", fallback: "#9F2800" },
  { name: "text-alert-default", cssVar: "--color-text-alert-default", fallback: "#D9002B" },
  { name: "text-inverse-default", cssVar: "--color-text-inverse-default", fallback: "#141414" },
  { name: "text-inverse-default-alt", cssVar: "--color-text-inverse-default-alt", fallback: "#FFFFFF" },
];

export const BG_COLOR_TOKENS: ColorToken[] = [
  { name: "fill-surface-default", cssVar: "--color-fill-surface-default", fallback: "#FFFFFF" },
  { name: "fill-surface-raised", cssVar: "--color-fill-surface-raised", fallback: "#FFFFFF" },
  { name: "fill-surface-recessed", cssVar: "--color-fill-surface-recessed", fallback: "#F0F0F0" },
  { name: "fill-surface-overlay", cssVar: "--color-fill-surface-overlay", fallback: "#FFFFFF" },
  { name: "fill-primary-default", cssVar: "--color-fill-primary-default", fallback: "#141414" },
  { name: "fill-secondary-default", cssVar: "--color-fill-secondary-default", fallback: "#FFFFFF" },
  { name: "fill-brand-default", cssVar: "--color-fill-brand-default", fallback: "#FF4800" },
  { name: "fill-brand-subtle", cssVar: "--color-fill-brand-subtle", fallback: "#FCC6B1" },
  { name: "fill-positive-default", cssVar: "--color-fill-positive-default", fallback: "#00823A" },
  { name: "fill-positive-subtle", cssVar: "--color-fill-positive-subtle", fallback: "#EDF4EF" },
  { name: "fill-caution-default", cssVar: "--color-fill-caution-default", fallback: "#FCCB57" },
  { name: "fill-caution-subtle", cssVar: "--color-fill-caution-subtle", fallback: "#FCF6E6" },
  { name: "fill-alert-default", cssVar: "--color-fill-alert-default", fallback: "#D9002B" },
  { name: "fill-alert-subtle", cssVar: "--color-fill-alert-subtle", fallback: "#FCECE9" },
  { name: "fill-info-default", cssVar: "--color-fill-info-default", fallback: "#016DE1" },
  { name: "fill-info-subtle", cssVar: "--color-fill-info-subtle", fallback: "#E1F2FB" },
  { name: "fill-accent-purple-default", cssVar: "--color-fill-accent-purple-default", fallback: "#6431DA" },
  { name: "fill-accent-purple-subtle", cssVar: "--color-fill-accent-purple-subtle", fallback: "#D7CDFC" },
  { name: "fill-accent-blue-default", cssVar: "--color-fill-accent-blue-default", fallback: "#016DE1" },
  { name: "fill-accent-green-default", cssVar: "--color-fill-accent-green-default", fallback: "#00823A" },
  { name: "fill-accent-teal-default", cssVar: "--color-fill-accent-teal-default", fallback: "#007C7D" },
  { name: "fill-accent-magenta-default", cssVar: "--color-fill-accent-magenta-default", fallback: "#D20688" },
  { name: "fill-accent-orange-default", cssVar: "--color-fill-accent-orange-default", fallback: "#C93700" },
];

export const BORDER_COLOR_TOKENS: ColorToken[] = [
  { name: "border-core-default", cssVar: "--color-border-core-default", fallback: "#8A8A8A" },
  { name: "border-core-subtle", cssVar: "--color-border-core-subtle", fallback: "#CCCCCC" },
  { name: "border-core-disabled", cssVar: "--color-border-core-disabled", fallback: "#E6E6E6" },
  { name: "border-brand-default", cssVar: "--color-border-brand-default", fallback: "#FF4800" },
  { name: "border-positive-default", cssVar: "--color-border-positive-default", fallback: "#00823A" },
  { name: "border-caution-default", cssVar: "--color-border-caution-default", fallback: "#EEB117" },
  { name: "border-alert-default", cssVar: "--color-border-alert-default", fallback: "#D9002B" },
  { name: "border-info-default", cssVar: "--color-border-info-default", fallback: "#016DE1" },
  { name: "border-accent-purple-default", cssVar: "--color-border-accent-purple-default", fallback: "#7D53E9" },
];

export const TYPOGRAPHY_TOKENS: TypographyToken[] = [
  { name: "detail-100", size: 12, line: 14, weight: 300, family: LEXEND, letterSpacing: 0 },
  { name: "detail-200", size: 12, line: 18, weight: 300, family: LEXEND, letterSpacing: 0 },
  { name: "heading-25", size: 12, line: 18, weight: 600, family: LEXEND, letterSpacing: 0 },
  { name: "body-75", size: 12, line: 18, weight: 300, family: LEXEND, letterSpacing: 0 },
  { name: "link-25", size: 12, line: 18, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "table-header", size: 12, line: 20, weight: 500, family: LEXEND, letterSpacing: 0 },
  { name: "heading-50", size: 14, line: 18, weight: 600, family: LEXEND, letterSpacing: 0 },
  { name: "body-100", size: 14, line: 24, weight: 300, family: LEXEND, letterSpacing: 0 },
  { name: "body-125", size: 14, line: 24, weight: 600, family: LEXEND, letterSpacing: 0 },
  { name: "link-100", size: 14, line: 24, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "code-100", size: 14, line: 24, weight: 500, family: SOURCE_CODE, letterSpacing: 0 },
  { name: "heading-100", size: 16, line: 20, weight: 600, family: LEXEND, letterSpacing: 0 },
  { name: "body-200", size: 16, line: 24, weight: 300, family: LEXEND, letterSpacing: 0 },
  { name: "link-200", size: 16, line: 24, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "heading-200", size: 18, line: 24, weight: 500, family: LEXEND, letterSpacing: 0 },
  { name: "body-300", size: 18, line: 24, weight: 400, family: LEXEND, letterSpacing: 0 },
  { name: "heading-300", size: 20, line: 24, weight: 600, family: LEXEND, letterSpacing: 0 },
  { name: "body-400", size: 20, line: 28, weight: 400, family: LEXEND, letterSpacing: 0 },
  { name: "link-300", size: 20, line: 24, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "heading-400", size: 22, line: 27, weight: 500, family: LEXEND, letterSpacing: 0 },
  { name: "body-500", size: 22, line: 28, weight: 400, family: LEXEND, letterSpacing: 0 },
  { name: "link-400", size: 22, line: 27, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "heading-500", size: 24, line: 29, weight: 300, family: LEXEND, letterSpacing: 0 },
  { name: "link-500", size: 24, line: 29, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "body-600", size: 26, line: 32, weight: 400, family: LEXEND, letterSpacing: 0 },
  { name: "body-700", size: 28, line: 36, weight: 400, family: LEXEND, letterSpacing: 0 },
  { name: "heading-600", size: 32, line: 39, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "link-600", size: 32, line: 39, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "heading-700", size: 36, line: 44, weight: 500, family: LEXEND, letterSpacing: -0.16 },
  { name: "heading-800", size: 42, line: 52, weight: 500, family: LEXEND, letterSpacing: -0.16 },
  { name: "heading-900", size: 46, line: 56, weight: 500, family: LEXEND, letterSpacing: -0.16 },
  { name: "heading-1000", size: 55, line: 67, weight: 700, family: LEXEND, letterSpacing: 0 },
  { name: "display-100", size: 56, line: 72, weight: 500, family: LEXEND, letterSpacing: -0.32 },
  { name: "display-200", size: 66, line: 76, weight: 500, family: LEXEND, letterSpacing: -0.32 },
  { name: "display-300", size: 76, line: 88, weight: 500, family: LEXEND, letterSpacing: -0.32 },
  { name: "display-400", size: 84, line: 96, weight: 500, family: LEXEND, letterSpacing: -0.32 },
  { name: "display-500", size: 94, line: 100, weight: 500, family: LEXEND, letterSpacing: -0.32 },
];

export const RADIUS_TOKENS: ScaleToken[] = [
  { name: "rounded-0", px: 0, twClass: "rounded-0" },
  { name: "rounded-100", px: 4, twClass: "rounded-100" },
  { name: "rounded-300", px: 8, twClass: "rounded-300" },
  { name: "rounded-400", px: 16, twClass: "rounded-400" },
  { name: "rounded-full", px: 999999, twClass: "rounded-full" },
];

export const BORDER_WIDTH_TOKENS: ScaleToken[] = [
  { name: "border-0", px: 0, twClass: "border-0" },
  { name: "border-100", px: 1, twClass: "border-100" },
  { name: "border-200", px: 2, twClass: "border-200" },
  { name: "border-300", px: 4, twClass: "border-300" },
];

export const SHADOW_TOKENS: ShadowToken[] = [
  { name: "none", css: "none", twClass: "shadow-none" },
  { name: "shadow-100", css: "0px 1px 8px 0px rgba(20, 20, 20, 0.08)", twClass: "shadow-100" },
  { name: "shadow-200", css: "0px 8px 16px 0px rgba(20, 20, 20, 0.04)", twClass: "shadow-200" },
  { name: "shadow-300", css: "0px 16px 32px 0px rgba(20, 20, 20, 0.08)", twClass: "shadow-300" },
  { name: "shadow-400", css: "0px 24px 48px 0px rgba(20, 20, 20, 0.08)", twClass: "shadow-400" },
];

export const SPACING_STEPS_PX: number[] = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64];

export const spacingClassFor = (prefix: string, px: number): string => {
  return `${prefix}-${px / 4}`;
};
