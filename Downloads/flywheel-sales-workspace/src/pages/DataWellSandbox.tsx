import { useMemo, useState } from "react";
import { Info } from "lucide-react";

type Align = "flex-start" | "center" | "flex-end";
type Transform = "none" | "uppercase" | "capitalize";
type Shadow = "none" | "100" | "200" | "300" | "400";

// --- Design-system tokens (the only selectable values) ---
interface TypeToken { name: string; size: number; line: number; weight: number }

const TYPE_TOKENS: TypeToken[] = [
  { name: "detail-100", size: 12, line: 14, weight: 300 },
  { name: "detail-200", size: 12, line: 18, weight: 300 },
  { name: "heading-25", size: 12, line: 18, weight: 600 },
  { name: "body-75", size: 12, line: 18, weight: 300 },
  { name: "link-25", size: 12, line: 18, weight: 700 },
  { name: "heading-50", size: 14, line: 18, weight: 600 },
  { name: "body-100", size: 14, line: 24, weight: 300 },
  { name: "body-125", size: 14, line: 24, weight: 600 },
  { name: "link-100", size: 14, line: 24, weight: 700 },
  { name: "heading-100", size: 16, line: 20, weight: 600 },
  { name: "body-200", size: 16, line: 24, weight: 300 },
  { name: "link-200", size: 16, line: 24, weight: 700 },
  { name: "heading-200", size: 18, line: 24, weight: 500 },
  { name: "body-300", size: 18, line: 24, weight: 400 },
  { name: "heading-300", size: 20, line: 24, weight: 600 },
  { name: "body-400", size: 20, line: 28, weight: 400 },
  { name: "link-300", size: 20, line: 24, weight: 700 },
  { name: "heading-400", size: 22, line: 27, weight: 500 },
  { name: "body-500", size: 22, line: 28, weight: 400 },
  { name: "heading-500", size: 24, line: 29, weight: 300 },
  { name: "link-500", size: 24, line: 29, weight: 700 },
  { name: "body-600", size: 26, line: 32, weight: 400 },
  { name: "body-700", size: 28, line: 36, weight: 400 },
  { name: "heading-600", size: 32, line: 39, weight: 700 },
  { name: "heading-700", size: 36, line: 44, weight: 500 },
  { name: "heading-800", size: 42, line: 52, weight: 500 },
  { name: "heading-900", size: 46, line: 56, weight: 500 },
  { name: "heading-1000", size: 55, line: 67, weight: 700 },
  { name: "display-100", size: 56, line: 72, weight: 500 },
  { name: "display-200", size: 66, line: 76, weight: 500 },
  { name: "display-300", size: 76, line: 88, weight: 500 },
];

interface ColorToken { name: string; value: string }

const TEXT_TOKENS: ColorToken[] = [
  { name: "text-core-default", value: "#141414" },
  { name: "text-core-subtle", value: "#666666" },
  { name: "text-core-disabled", value: "#8A8A8A" },
  { name: "text-interactive-default", value: "#006162" },
  { name: "text-brand-default", value: "#9F2800" },
  { name: "text-alert-default", value: "#D9002B" },
  { name: "text-primary-default", value: "#FFFFFF" },
];

const FILL_TOKENS: ColorToken[] = [
  { name: "fill-surface-default", value: "#FFFFFF" },
  { name: "fill-surface-recessed", value: "#F0F0F0" },
  { name: "fill-brand-subtle", value: "#FCC6B1" },
  { name: "fill-brand-default", value: "#FF4800" },
  { name: "fill-primary-default", value: "#141414" },
];

const BORDER_TOKENS: ColorToken[] = [
  { name: "border-core-subtle", value: "#CCCCCC" },
  { name: "border-core-default", value: "#8A8A8A" },
  { name: "border-brand-default", value: "#FF4800" },
  { name: "border-positive-default", value: "#00823A" },
  { name: "border-caution-default", value: "#EEB117" },
  { name: "border-info-default", value: "#016DE1" },
  { name: "border-accent-purple-default", value: "#7D53E9" },
];

const typeOf = (name: string) => TYPE_TOKENS.find((t) => t.name === name) ?? TYPE_TOKENS[0];
const colorOf = (list: ColorToken[], name: string) => list.find((c) => c.name === name)?.value ?? "#000000";

interface WellStyle {
  fontFamily: string;
  width: number;
  paddingX: number;
  paddingY: number;
  bgToken: string;
  borderToken: string;
  borderWidth: number;
  radius: number;
  shadow: Shadow;
  align: Align;
  labelPosition: "top" | "bottom";
  labelToValueGap: number;
  valueToSecondaryGap: number;

  labelText: string;
  labelType: string;
  labelTracking: number;
  labelTransform: Transform;
  labelColorToken: string;
  showInfoIcon: boolean;

  valueText: string;
  valueType: string;
  valueColorToken: string;

  showSecondary: boolean;
  secondaryText: string;
  secondaryType: string;
  secondaryColorToken: string;
}

const DEFAULTS: WellStyle = {
  fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif",
  width: 240,
  paddingX: 20,
  paddingY: 16,
  bgToken: "fill-surface-default",
  borderToken: "border-core-subtle",
  borderWidth: 1,
  radius: 4,
  shadow: "100",
  align: "flex-start",
  labelPosition: "top",
  labelToValueGap: 4,
  valueToSecondaryGap: 2,

  labelText: "Companies worked",
  labelType: "heading-25",
  labelTracking: 0,
  labelTransform: "none",
  labelColorToken: "text-core-default",
  showInfoIcon: true,

  valueText: "10",
  valueType: "heading-900",
  valueColorToken: "text-core-default",

  showSecondary: true,
  secondaryText: "16 companies in play",
  secondaryType: "detail-100",
  secondaryColorToken: "text-core-subtle",
};

const SHADOW_MAP: Record<Shadow, string> = {
  none: "none",
  "100": "0px 1px 8px 0px rgba(20,20,20,0.08)",
  "200": "0px 8px 16px 0px rgba(20,20,20,0.04)",
  "300": "0px 16px 32px 0px rgba(20,20,20,0.08)",
  "400": "0px 24px 48px 0px rgba(20,20,20,0.08)",
};

const alignToText = (a: Align): "left" | "center" | "right" =>
  a === "flex-start" ? "left" : a === "flex-end" ? "right" : "center";

// --- Reusable controls ---
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>
);

const RangeControl = ({
  label, value, min, max, step = 1, unit = "px", onChange,
}: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) => (
  <Field label={`${label} — ${value}${unit}`}>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#FF4800]" />
  </Field>
);

const selectClass = "w-full rounded border border-slate-300 px-2 py-1.5 text-sm bg-white";

const EnumSelect = <T extends string>({
  label, value, options, onChange,
}: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) => (
  <Field label={label}>
    <select value={value} onChange={(e) => onChange(e.target.value as T)} className={selectClass}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </Field>
);

const TypeSelect = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <Field label={label}>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
      {TYPE_TOKENS.map((t) => (
        <option key={t.name} value={t.name}>{`${t.name} · ${t.size}px / ${t.weight}`}</option>
      ))}
    </select>
  </Field>
);

const ColorSelect = ({ label, value, options, onChange }: { label: string; value: string; options: ColorToken[]; onChange: (v: string) => void }) => (
  <Field label={label}>
    <div className="flex items-center gap-2">
      <span className="h-7 w-7 shrink-0 rounded border border-slate-300" style={{ background: colorOf(options, value) }} />
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {options.map((c) => <option key={c.name} value={c.name}>{`${c.name} · ${c.value}`}</option>)}
      </select>
    </div>
  </Field>
);

const TextControl = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <Field label={label}>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" />
  </Field>
);

const ToggleControl = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-center justify-between gap-2 cursor-pointer py-1">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#FF4800]" />
  </label>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-6 mb-3 first:mt-0">{children}</h3>
);

const DataWellSandbox = () => {
  const [s, setS] = useState<WellStyle>(DEFAULTS);
  const set = <K extends keyof WellStyle>(key: K) => (value: WellStyle[K]) => setS((prev) => ({ ...prev, [key]: value }));

  const labelTok = typeOf(s.labelType);
  const valueTok = typeOf(s.valueType);
  const secondaryTok = typeOf(s.secondaryType);

  const cardStyle: React.CSSProperties = {
    fontFamily: s.fontFamily,
    width: s.width,
    paddingLeft: s.paddingX,
    paddingRight: s.paddingX,
    paddingTop: s.paddingY,
    paddingBottom: s.paddingY,
    background: colorOf(FILL_TOKENS, s.bgToken),
    border: `${s.borderWidth}px solid ${colorOf(BORDER_TOKENS, s.borderToken)}`,
    borderRadius: s.radius,
    boxShadow: SHADOW_MAP[s.shadow],
    display: "flex",
    flexDirection: "column",
    alignItems: s.align,
    textAlign: alignToText(s.align),
    gap: s.labelToValueGap,
  };

  const labelBlock = (
    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: s.align }}>
      <span
        style={{
          fontSize: labelTok.size,
          fontWeight: labelTok.weight,
          lineHeight: `${labelTok.line}px`,
          letterSpacing: `${s.labelTracking}px`,
          textTransform: s.labelTransform,
          color: colorOf(TEXT_TOKENS, s.labelColorToken),
        }}
      >
        {s.labelText}
      </span>
      {s.showInfoIcon && <Info style={{ width: labelTok.size + 2, height: labelTok.size + 2, color: colorOf(TEXT_TOKENS, s.secondaryColorToken) }} />}
    </div>
  );

  const valueBlock = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: s.align, gap: s.valueToSecondaryGap }}>
      <div style={{ fontSize: valueTok.size, fontWeight: valueTok.weight, lineHeight: `${valueTok.line}px`, color: colorOf(TEXT_TOKENS, s.valueColorToken) }}>
        {s.valueText}
      </div>
      {s.showSecondary && (
        <div style={{ fontSize: secondaryTok.size, fontWeight: secondaryTok.weight, lineHeight: `${secondaryTok.line}px`, color: colorOf(TEXT_TOKENS, s.secondaryColorToken) }}>
          {s.secondaryText}
        </div>
      )}
    </div>
  );

  const wellInner = s.labelPosition === "top" ? <>{labelBlock}{valueBlock}</> : <>{valueBlock}{labelBlock}</>;

  const cssSnippet = useMemo(() => {
    return `.data-well {
  font-family: ${s.fontFamily};
  width: ${s.width}px;
  padding: ${s.paddingY}px ${s.paddingX}px;
  background: ${colorOf(FILL_TOKENS, s.bgToken)};          /* ${s.bgToken} */
  border: ${s.borderWidth}px solid ${colorOf(BORDER_TOKENS, s.borderToken)};   /* ${s.borderToken} */
  border-radius: ${s.radius}px;
  box-shadow: ${SHADOW_MAP[s.shadow]};${s.shadow === "none" ? "" : `   /* shadow-${s.shadow} */`}
  display: flex;
  flex-direction: column;
  align-items: ${s.align};
  text-align: ${alignToText(s.align)};
  gap: ${s.labelToValueGap}px;
}
.data-well__label {           /* ${labelTok.name} */
  font-size: ${labelTok.size}px;
  font-weight: ${labelTok.weight};
  line-height: ${labelTok.line}px;
  letter-spacing: ${s.labelTracking}px;
  text-transform: ${s.labelTransform};
  color: ${colorOf(TEXT_TOKENS, s.labelColorToken)};   /* ${s.labelColorToken} */
}
.data-well__value {           /* ${valueTok.name} */
  font-size: ${valueTok.size}px;
  font-weight: ${valueTok.weight};
  line-height: ${valueTok.line}px;
  color: ${colorOf(TEXT_TOKENS, s.valueColorToken)};   /* ${s.valueColorToken} */
}
.data-well__value-group { gap: ${s.valueToSecondaryGap}px; }
.data-well__secondary {       /* ${secondaryTok.name} */
  font-size: ${secondaryTok.size}px;
  font-weight: ${secondaryTok.weight};
  line-height: ${secondaryTok.line}px;
  color: ${colorOf(TEXT_TOKENS, s.secondaryColorToken)};   /* ${s.secondaryColorToken} */
}`;
  }, [s, labelTok, valueTok, secondaryTok]);

  return (
    <div className="h-screen flex font-sans">
      <aside className="w-[380px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-slate-900">Data Well Sandbox</h2>
          <button onClick={() => setS(DEFAULTS)} className="text-xs font-semibold text-[#FF4800] hover:underline">Reset</button>
        </div>
        <p className="text-[11px] text-slate-400 mb-4">Type &amp; colour options are restricted to design-system tokens.</p>

        <SectionTitle>Card</SectionTitle>
        <div className="flex flex-col gap-3">
          <TextControl label="Font family" value={s.fontFamily} onChange={set("fontFamily")} />
          <RangeControl label="Width" value={s.width} min={140} max={480} onChange={set("width")} />
          <RangeControl label="Padding X" value={s.paddingX} min={0} max={64} onChange={set("paddingX")} />
          <RangeControl label="Padding Y" value={s.paddingY} min={0} max={64} onChange={set("paddingY")} />
          <RangeControl label="Border radius" value={s.radius} min={0} max={32} onChange={set("radius")} />
          <RangeControl label="Border width" value={s.borderWidth} min={0} max={6} onChange={set("borderWidth")} />
          <ColorSelect label="Background token" value={s.bgToken} options={FILL_TOKENS} onChange={set("bgToken")} />
          <ColorSelect label="Border token" value={s.borderToken} options={BORDER_TOKENS} onChange={set("borderToken")} />
          <EnumSelect label="Shadow token" value={s.shadow} options={["none", "100", "200", "300", "400"] as const} onChange={set("shadow")} />
        </div>

        <SectionTitle>Layout</SectionTitle>
        <div className="flex flex-col gap-3">
          <EnumSelect label="Alignment" value={s.align} options={["flex-start", "center", "flex-end"] as const} onChange={set("align")} />
          <EnumSelect label="Label position" value={s.labelPosition} options={["top", "bottom"] as const} onChange={set("labelPosition")} />
          <RangeControl label="Label ↔ value gap" value={s.labelToValueGap} min={0} max={40} onChange={set("labelToValueGap")} />
          <RangeControl label="Value ↔ subtext gap" value={s.valueToSecondaryGap} min={0} max={24} onChange={set("valueToSecondaryGap")} />
        </div>

        <SectionTitle>Label</SectionTitle>
        <div className="flex flex-col gap-3">
          <TextControl label="Text" value={s.labelText} onChange={set("labelText")} />
          <TypeSelect label="Type token" value={s.labelType} onChange={set("labelType")} />
          <ColorSelect label="Colour token" value={s.labelColorToken} options={TEXT_TOKENS} onChange={set("labelColorToken")} />
          <RangeControl label="Letter spacing" value={s.labelTracking} min={-1} max={4} step={0.5} onChange={set("labelTracking")} />
          <EnumSelect label="Text transform" value={s.labelTransform} options={["none", "uppercase", "capitalize"] as const} onChange={set("labelTransform")} />
          <ToggleControl label="Show info icon" value={s.showInfoIcon} onChange={set("showInfoIcon")} />
        </div>

        <SectionTitle>Value</SectionTitle>
        <div className="flex flex-col gap-3">
          <TextControl label="Text" value={s.valueText} onChange={set("valueText")} />
          <TypeSelect label="Type token" value={s.valueType} onChange={set("valueType")} />
          <ColorSelect label="Colour token" value={s.valueColorToken} options={TEXT_TOKENS} onChange={set("valueColorToken")} />
        </div>

        <SectionTitle>Subtext</SectionTitle>
        <div className="flex flex-col gap-3">
          <ToggleControl label="Show subtext" value={s.showSecondary} onChange={set("showSecondary")} />
          <TextControl label="Text" value={s.secondaryText} onChange={set("secondaryText")} />
          <TypeSelect label="Type token" value={s.secondaryType} onChange={set("secondaryType")} />
          <ColorSelect label="Colour token" value={s.secondaryColorToken} options={TEXT_TOKENS} onChange={set("secondaryColorToken")} />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#F5F8FA] p-10">
        <div className="mx-auto max-w-[900px] flex flex-col gap-10">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Single</h3>
            <div className="flex justify-center rounded-lg bg-white/60 p-10 border border-slate-200">
              <div style={cardStyle}>{wellInner}</div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Four-up grid (in context)</h3>
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ ...cardStyle, width: "auto" }}>{wellInner}</div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Generated CSS</h3>
            <textarea readOnly value={cssSnippet} className="w-full h-[380px] rounded-lg border border-slate-300 bg-slate-900 p-4 font-mono text-xs text-slate-100" />
          </section>
        </div>
      </main>
    </div>
  );
};

export default DataWellSandbox;
