import { PointerEvent as ReactPointerEvent, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import {
  BG_COLOR_TOKENS,
  BORDER_COLOR_TOKENS,
  BORDER_WIDTH_TOKENS,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  TEXT_COLOR_TOKENS,
  TYPOGRAPHY_TOKENS,
} from "@/design-tokens/tokens";
import {
  BuiltOutput,
  PanelState,
  SandboxEntry,
  formatEntryBlock,
  targetLineFor,
} from "./model";
import {
  AxisSpacingControl,
  CollapsibleSection,
  ColorSelect,
  EnumSelect,
  IconOption,
  IconSegmentedControl,
  NumberControl,
  RangeControl,
  TokenSelect,
} from "./controls";
import { AlignIcon, DirectionIcon, JustifyIcon, WrapIcon } from "./flexIcons";
import { BUTTON_VARIANT_NAMES, BUTTON_SIZE_NAMES } from "./buttonVariants";

export interface StashItem {
  id: string;
  label: string;
  count: number;
}

interface SandboxPanelProps {
  entry: SandboxEntry;
  output: BuiltOutput;
  onStateChange: (state: PanelState) => void;
  onSelectCrumb: (element: HTMLElement) => void;
  onClose: () => void;
  onReset: () => void;
  stash: StashItem[];
  currentId: string;
  copiedAll: boolean;
  onSelectStashItem: (id: string) => void;
  onRemoveStashItem: (id: string) => void;
  onCopyAll: () => void;
  onClearAll: () => void;
}

const TRANSFORM_OPTIONS: { value: string; label: string }[] = [
  { value: "none", label: "none" },
  { value: "uppercase", label: "uppercase" },
  { value: "capitalize", label: "capitalize" },
  { value: "lowercase", label: "lowercase" },
];

type SectionKey = "component" | "colour" | "typography" | "padding" | "margin" | "flex" | "layout" | "border" | "instructions" | "element" | "stash";

const FLEX_DISPLAY_OPTIONS = ["block", "flex", "inline-flex", "grid", "inline-block", "inline", "none"];
const FLEX_DIRECTION_OPTIONS = ["row", "row-reverse", "column", "column-reverse"];
const JUSTIFY_OPTIONS = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];
const ALIGN_OPTIONS = ["stretch", "flex-start", "center", "flex-end", "baseline"];
const WRAP_OPTIONS = ["nowrap", "wrap", "wrap-reverse"];

const enumOptions = (values: string[], current: string): { value: string; label: string }[] => {
  const merged = current && !values.includes(current) ? [current, ...values] : values;
  return merged.map((v) => ({ value: v, label: v }));
};

const DIRECTION_ICON_OPTIONS: IconOption[] = FLEX_DIRECTION_OPTIONS.map((v) => ({
  value: v,
  label: v,
  icon: <DirectionIcon value={v} />,
}));

const WRAP_ICON_OPTIONS: IconOption[] = WRAP_OPTIONS.map((v) => ({
  value: v,
  label: v,
  icon: <WrapIcon value={v} />,
}));

const justifyIconOptions = (mainVertical: boolean): IconOption[] =>
  JUSTIFY_OPTIONS.map((v) => ({
    value: v,
    label: v,
    icon: <JustifyIcon value={v} mainVertical={mainVertical} />,
  }));

const alignIconOptions = (mainVertical: boolean): IconOption[] =>
  ALIGN_OPTIONS.map((v) => ({
    value: v,
    label: v,
    icon: <AlignIcon value={v} mainVertical={mainVertical} />,
  }));

const HEADER_H = 36;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const SandboxPanel = ({
  entry,
  output,
  onStateChange,
  onSelectCrumb,
  onClose,
  onReset,
  stash,
  currentId,
  copiedAll,
  onSelectStashItem,
  onRemoveStashItem,
  onCopyAll,
  onClearAll,
}: SandboxPanelProps) => {
  const { element, source, original, state, crumbs } = entry;
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState(() => ({ x: Math.max(16, window.innerWidth - 376), y: 16 }));
  const [size, setSize] = useState(() => ({ w: 360, h: window.innerHeight - 32 }));
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    component: true,
    colour: true,
    typography: true,
    padding: true,
    margin: true,
    flex: true,
    layout: true,
    border: true,
    instructions: true,
    element: true,
    stash: true,
  });
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingScroll, setPendingScroll] = useState<{ key: SectionKey; index: number } | null>(null);

  const reveal = (key: SectionKey, index: number) => {
    setOpen((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    setPendingScroll({ key, index });
  };
  const toggleSection = (key: SectionKey, index: number) => {
    const willOpen = !open[key];
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    if (willOpen) setPendingScroll({ key, index });
  };

  const set = <K extends keyof PanelState>(key: K) => (value: PanelState[K]) =>
    onStateChange({ ...state, [key]: value });

  const targetLine = targetLineFor(source, element);
  const agentBlock = formatEntryBlock(source, element, output, entry.move, entry.deleted, state.agentInstructions);
  const hasChanges = output.summary.length > 0 || !!entry.move || !!entry.deleted;

  const declKey = JSON.stringify(output.decls);
  useEffect(() => {
    setCopied(false);
  }, [declKey]);

  useLayoutEffect(() => {
    if (!pendingScroll) return;
    const container = scrollRef.current;
    const header = container?.querySelector(`[data-sbx-section="${pendingScroll.key}"]`) as HTMLElement | null;
    if (container && header) {
      const delta =
        header.getBoundingClientRect().top - container.getBoundingClientRect().top - pendingScroll.index * HEADER_H;
      container.scrollTo({ top: container.scrollTop + delta, behavior: "smooth" });
    }
    setPendingScroll(null);
  }, [pendingScroll]);

  const copy = () => {
    navigator.clipboard?.writeText(agentBlock).then(() => setCopied(true)).catch(() => setCopied(false));
  };

  const onHandleDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { dx: event.clientX - pos.x, dy: event.clientY - pos.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onHandleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPos({
      x: clamp(event.clientX - drag.current.dx, 0, window.innerWidth - size.w),
      y: clamp(event.clientY - drag.current.dy, 0, window.innerHeight - 48),
    });
  };
  const onHandleUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const onResizeDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    resize.current = { x: event.clientX, y: event.clientY, w: size.w, h: size.h };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onResizeMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!resize.current) return;
    setSize({
      w: clamp(resize.current.w + (event.clientX - resize.current.x), 300, window.innerWidth - pos.x - 8),
      h: clamp(resize.current.h + (event.clientY - resize.current.y), 220, window.innerHeight - pos.y - 8),
    });
  };
  const onResizeUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    resize.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const sections: { key: SectionKey; title: string; body: ReactNode }[] = [
    ...(original.isButton
      ? [
          {
            key: "component" as SectionKey,
            title: "Component",
            body: (
              <>
                <EnumSelect
                  label="Button variant"
                  value={state.variant}
                  options={BUTTON_VARIANT_NAMES.map((name) => ({ value: name, label: name }))}
                  onChange={set("variant")}
                />
                <EnumSelect
                  label="Button size"
                  value={state.buttonSize}
                  options={BUTTON_SIZE_NAMES.map((name) => ({ value: name, label: name }))}
                  onChange={set("buttonSize")}
                />
              </>
            ),
          },
        ]
      : []),
    {
      key: "colour",
      title: "Colour",
      body: (
        <>
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
        </>
      ),
    },
    {
      key: "typography",
      title: "Typography",
      body: (
        <>
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
        </>
      ),
    },
    {
      key: "padding",
      title: "Padding",
      body: (
        <AxisSpacingControl
          min={0}
          max={64}
          step={4}
          values={{
            top: state.paddingTop,
            right: state.paddingRight,
            bottom: state.paddingBottom,
            left: state.paddingLeft,
          }}
          onChange={(next) =>
            onStateChange({
              ...state,
              paddingTop: next.top,
              paddingRight: next.right,
              paddingBottom: next.bottom,
              paddingLeft: next.left,
            })
          }
        />
      ),
    },
    {
      key: "margin",
      title: "Margin",
      body: (
        <AxisSpacingControl
          min={0}
          max={64}
          step={4}
          values={{
            top: state.marginTop,
            right: state.marginRight,
            bottom: state.marginBottom,
            left: state.marginLeft,
          }}
          onChange={(next) =>
            onStateChange({
              ...state,
              marginTop: next.top,
              marginRight: next.right,
              marginBottom: next.bottom,
              marginLeft: next.left,
            })
          }
        />
      ),
    },
    {
      key: "flex",
      title: "Flexbox",
      body: (
        <>
          <EnumSelect
            label="Display"
            value={state.display}
            options={enumOptions(FLEX_DISPLAY_OPTIONS, original.display)}
            onChange={set("display")}
          />
          <IconSegmentedControl
            label="Direction"
            value={state.flexDirection}
            options={DIRECTION_ICON_OPTIONS}
            onChange={set("flexDirection")}
          />
          <IconSegmentedControl
            label="Justify content (main axis)"
            value={state.justifyContent}
            options={justifyIconOptions(state.flexDirection.startsWith("column"))}
            onChange={set("justifyContent")}
          />
          <IconSegmentedControl
            label="Align items (cross axis)"
            value={state.alignItems}
            options={alignIconOptions(state.flexDirection.startsWith("column"))}
            onChange={set("alignItems")}
          />
          <IconSegmentedControl
            label="Wrap"
            value={state.flexWrap}
            options={WRAP_ICON_OPTIONS}
            onChange={set("flexWrap")}
          />
        </>
      ),
    },
    {
      key: "layout",
      title: "Layout",
      body: (
        <>
          <RangeControl label="Gap" value={state.gap} min={0} max={64} step={4} onChange={set("gap")} />
          <NumberControl
            label="Width"
            value={state.width}
            placeholder={`${original.width} (current)`}
            onChange={set("width")}
          />
          <NumberControl
            label="Height"
            value={state.height}
            placeholder={`${original.height} (current)`}
            onChange={set("height")}
          />
        </>
      ),
    },
    {
      key: "border",
      title: "Border & shadow",
      body: (
        <>
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
        </>
      ),
    },
    {
      key: "instructions",
      title: "Agent instructions",
      body: (
        <textarea
          value={state.agentInstructions}
          onChange={(e) => set("agentInstructions")(e.target.value)}
          placeholder="Describe what the agent should do that the controls above can't express…"
          className="w-full rounded border border-slate-300 bg-white p-2.5 text-xs leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-[#FF4800] focus:outline-none focus:ring-1 focus:ring-[#FF4800]"
          rows={3}
        />
      ),
    },
    {
      key: "element",
      title: "This element",
      body: (
        <>
          <div className="flex justify-end">
            <button
              onClick={copy}
              disabled={!hasChanges}
              className="rounded bg-[#FF4800] px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            value={hasChanges ? agentBlock : "Adjust a control to generate output."}
            className="h-40 w-full rounded border border-slate-300 bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-100"
          />
        </>
      ),
    },
    {
      key: "stash",
      title: `Staged changes (${stash.length})`,
      body:
        stash.length === 0 ? (
          <p className="text-[11px] text-slate-400">
            No staged changes yet. Edits to other elements collect here automatically.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-0.5">
              {stash.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectStashItem(item.id)}
                  className={`group flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 text-xs hover:bg-slate-100 ${
                    item.id === currentId ? "bg-slate-100" : ""
                  }`}
                >
                  <span className="truncate text-slate-700">
                    {item.label} <span className="text-slate-400">· {item.count}</span>
                  </span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveStashItem(item.id);
                    }}
                    aria-label="Discard changes for this element"
                    className="shrink-0 text-slate-400 opacity-0 hover:text-[#FF4800] group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onCopyAll}
                className="flex-1 rounded bg-[#FF4800] px-2.5 py-1 text-xs font-semibold text-white"
              >
                {copiedAll ? "Copied" : "Copy all"}
              </button>
              <button
                onClick={onClearAll}
                className="rounded border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Clear all
              </button>
            </div>
          </>
        ),
    },
  ];

  return (
    <div
      data-sandbox-ui="true"
      className="fixed z-[2147483647] flex flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-2xl"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        maxHeight: `calc(100vh - ${pos.y + 16}px)`,
        fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif",
        pointerEvents: "auto",
      }}
    >
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-slate-200 p-4">
        <div
          className="min-w-0 cursor-move touch-none select-none"
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
        >
          <h2 className="text-sm font-bold text-slate-900">Sandbox</h2>
          <p className="mt-0.5 truncate text-[11px] text-slate-500" title={targetLine}>
            {targetLine}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={onReset} className="text-xs font-semibold text-[#FF4800] hover:underline">
            Reset
          </button>
          <button onClick={onClose} aria-label="Close sandbox" className="text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-x-1 gap-y-0.5 border-b border-slate-100 px-4 py-2 text-[11px] text-slate-500">
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

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {sections.map((section, index) => (
          <CollapsibleSection
            key={section.key}
            sectionKey={section.key}
            title={section.title}
            open={open[section.key]}
            onReveal={() => reveal(section.key, index)}
            onToggle={() => toggleSection(section.key, index)}
            topOffset={index * HEADER_H}
            bottomOffset={(sections.length - 1 - index) * HEADER_H}
          >
            {section.body}
          </CollapsibleSection>
        ))}
      </div>

      <div
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeUp}
        className="absolute bottom-0 right-0 z-30 h-4 w-4 cursor-nwse-resize touch-none"
        aria-label="Resize panel"
      >
        <div className="absolute bottom-1 right-1 h-2 w-2 border-b-2 border-r-2 border-slate-400" />
      </div>
    </div>
  );
};

export default SandboxPanel;
