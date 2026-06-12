import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
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
  muted,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  offToken?: boolean;
  muted?: boolean;
  displayValue?: string;
  onChange: (v: number) => void;
}) => (
  <Field label={`${label} — ${displayValue ?? `${value}${unit}`}${offToken ? " · off-token" : ""}`}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full accent-[#FF4800] ${muted ? "opacity-40" : ""}`}
    />
  </Field>
);

interface SideValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const AxisSpacingControl = ({
  values,
  min,
  max,
  step,
  onChange,
}: {
  values: SideValues;
  min: number;
  max: number;
  step: number;
  onChange: (next: SideValues) => void;
}) => {
  const xMixed = values.left !== values.right;
  const yMixed = values.top !== values.bottom;
  return (
    <div className="flex flex-col gap-3">
      <RangeControl
        label="Horizontal (left + right)"
        value={values.left}
        displayValue={xMixed ? "mixed — drag to sync" : undefined}
        muted={xMixed}
        min={min}
        max={max}
        step={step}
        onChange={(v) => onChange({ ...values, left: v, right: v })}
      />
      <div className="flex flex-col gap-3 border-l-2 border-slate-200 pl-3">
        <RangeControl label="Left" value={values.left} min={min} max={max} step={step} onChange={(v) => onChange({ ...values, left: v })} />
        <RangeControl label="Right" value={values.right} min={min} max={max} step={step} onChange={(v) => onChange({ ...values, right: v })} />
      </div>
      <RangeControl
        label="Vertical (top + bottom)"
        value={values.top}
        displayValue={yMixed ? "mixed — drag to sync" : undefined}
        muted={yMixed}
        min={min}
        max={max}
        step={step}
        onChange={(v) => onChange({ ...values, top: v, bottom: v })}
      />
      <div className="flex flex-col gap-3 border-l-2 border-slate-200 pl-3">
        <RangeControl label="Top" value={values.top} min={min} max={max} step={step} onChange={(v) => onChange({ ...values, top: v })} />
        <RangeControl label="Bottom" value={values.bottom} min={min} max={max} step={step} onChange={(v) => onChange({ ...values, bottom: v })} />
      </div>
    </div>
  );
};

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

export interface IconOption {
  value: string;
  label: string;
  icon: ReactNode;
}

export const IconSegmentedControl = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: IconOption[];
  onChange: (v: string) => void;
}) => {
  const known = options.some((o) => o.value === value);
  return (
    <Field label={`${label}${value ? ` — ${value}` : ""}`}>
      <div className="flex flex-wrap gap-1">
        {!known && value && (
          <span
            title={`Current: ${value} (no preset)`}
            className="flex h-8 items-center rounded border border-[#FF4800] bg-[#FF4800]/10 px-2 text-[11px] font-medium text-[#FF4800]"
          >
            {value}
          </span>
        )}
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              title={o.label}
              aria-label={o.label}
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`flex h-8 w-8 items-center justify-center rounded border transition-colors ${
                active
                  ? "border-[#FF4800] bg-[#FF4800]/10 text-[#FF4800]"
                  : "border-slate-300 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {o.icon}
            </button>
          );
        })}
      </div>
    </Field>
  );
};

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

export const NumberControl = ({
  label,
  value,
  placeholder,
  unit = "px",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  unit?: string;
  onChange: (v: string) => void;
}) => (
  <Field label={label}>
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
      />
      <span className="shrink-0 text-[11px] text-slate-400">{unit}</span>
    </div>
  </Field>
);

export const CollapsibleSection = ({
  sectionKey,
  title,
  open,
  onReveal,
  onToggle,
  topOffset,
  bottomOffset,
  children,
}: {
  sectionKey: string;
  title: string;
  open: boolean;
  onReveal: () => void;
  onToggle: () => void;
  topOffset: number;
  bottomOffset: number;
  children: ReactNode;
}) => (
  <>
    <div
      data-sbx-section={sectionKey}
      onClick={onReveal}
      style={{ top: topOffset, bottom: bottomOffset }}
      className="sticky z-20 flex h-9 w-full shrink-0 cursor-pointer items-center justify-between border-b border-slate-200 bg-slate-100 px-4 text-left shadow-sm"
    >
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{title}</span>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        aria-label="Collapse or expand section"
        className="ml-2 shrink-0 text-slate-400 hover:text-slate-600"
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
    </div>
    {open && <div className="flex flex-col gap-3 px-4 py-3">{children}</div>}
  </>
);
