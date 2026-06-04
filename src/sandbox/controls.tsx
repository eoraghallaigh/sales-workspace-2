import { ReactNode } from "react";
import { ColorToken } from "@/design-tokens/tokens";
import { resolveVar } from "@/design-tokens/resolve";

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>
);

export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-5 mb-2.5 first:mt-0">{children}</h3>
);

const selectClass = "w-full rounded border border-slate-300 px-2 py-1.5 text-sm bg-white";

export const RangeControl = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  offToken,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  offToken?: boolean;
  onChange: (v: number) => void;
}) => (
  <Field label={`${label} — ${value}${unit}${offToken ? " · off-token" : ""}`}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#FF4800]"
    />
  </Field>
);

export const EnumSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) => (
  <Field label={label}>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </Field>
);

export const ColorSelect = ({
  label,
  value,
  options,
  offTokenValue,
  onChange,
}: {
  label: string;
  value: string;
  options: ColorToken[];
  offTokenValue?: string;
  onChange: (v: string) => void;
}) => {
  const selected = options.find((o) => o.name === value);
  const swatch = selected ? resolveVar(selected) : offTokenValue ?? "transparent";
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <span
          className="h-7 w-7 shrink-0 rounded border border-slate-300"
          style={{ background: swatch }}
        />
        <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
          <option value="">{offTokenValue ? `Keep (${offTokenValue})` : "Keep current"}</option>
          {options.map((c) => (
            <option key={c.name} value={c.name}>
              {`${c.name} · ${resolveVar(c)}`}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
};

export const TokenSelect = ({
  label,
  value,
  options,
  offTokenLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: { name: string; hint?: string }[];
  offTokenLabel?: string;
  onChange: (v: string) => void;
}) => (
  <Field label={label}>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
      <option value="">{offTokenLabel ? `Keep (${offTokenLabel})` : "Keep current"}</option>
      {options.map((o) => (
        <option key={o.name} value={o.name}>
          {o.hint ? `${o.name} · ${o.hint}` : o.name}
        </option>
      ))}
    </select>
  </Field>
);
