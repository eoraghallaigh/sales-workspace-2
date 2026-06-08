import { ReactNode, useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import {
  InspectColor,
  InspectScale,
  InspectSides,
  Inspection,
} from "./inspect";

export interface Crumb {
  element: HTMLElement;
  label: string;
}

interface InspectorPanelProps {
  data: Inspection;
  crumbs: Crumb[];
  onSelectCrumb: (element: HTMLElement) => void;
  onClose: () => void;
}

const ACCENT = "#016DE1";

const Copyable = ({
  text,
  children,
  className = "",
}: {
  text: string;
  children: ReactNode;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1100);
    return () => window.clearTimeout(timer);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          ?.writeText(text)
          .then(() => setCopied(true))
          .catch(() => undefined)
      }
      title={`Copy ${text}`}
      className={`group inline-flex max-w-full items-center gap-1 rounded px-1 text-left hover:bg-slate-100 ${className}`}
    >
      <span className="truncate">{children}</span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-emerald-600" />
      ) : (
        <Copy className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-slate-500" />
      )}
    </button>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="border-b border-slate-100 px-4 py-3">
    <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</h3>
    <div className="flex flex-col gap-1">{children}</div>
  </div>
);

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="shrink-0 pt-0.5 text-[11px] text-slate-500">{label}</span>
    <div className="flex min-w-0 flex-col items-end text-right">{children}</div>
  </div>
);

const Mono = ({ children, muted }: { children: ReactNode; muted?: boolean }) => (
  <span className={`font-mono text-[11px] ${muted ? "text-slate-400" : "text-slate-800"}`}>
    {children}
  </span>
);

const formatSides = (sides: InspectSides): string =>
  sides.uniform
    ? `${sides.top}px`
    : `${sides.top} · ${sides.right} · ${sides.bottom} · ${sides.left}`;

const scaleLabel = (scale: InspectScale): string => {
  const base = scale.exact ? scale.token : `≈ ${scale.token}`;
  return `${base} · ${scale.px}px`;
};

const ColorRow = ({ color }: { color: InspectColor }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex shrink-0 items-center gap-2 pt-0.5">
      <span
        className="h-4 w-4 shrink-0 rounded border border-slate-300"
        style={
          color.isTransparent
            ? {
                backgroundImage:
                  "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)",
                backgroundSize: "6px 6px",
                backgroundPosition: "0 0, 3px 3px",
              }
            : { background: color.rgb }
        }
      />
      <span className="text-[11px] text-slate-500">{color.label}</span>
    </div>
    <div className="flex min-w-0 flex-col items-end">
      {color.token ? (
        <>
          <Copyable text={color.token} className="font-mono text-[11px]" >
            <span style={{ color: ACCENT }}>{color.token}</span>
          </Copyable>
          <Copyable text={`var(${color.cssVar})`} className="font-mono text-[10px] text-slate-400">
            var({color.cssVar})
          </Copyable>
          <Copyable text={color.display} className="font-mono text-[10px] text-slate-400">
            {color.display}
          </Copyable>
        </>
      ) : (
        <>
          <Copyable text={color.display} className="font-mono text-[11px] text-slate-800">
            {color.display}
          </Copyable>
          {!color.isTransparent && <span className="text-[10px] text-slate-400">off-token</span>}
        </>
      )}
    </div>
  </div>
);

const InspectorPanel = ({ data, crumbs, onSelectCrumb, onClose }: InspectorPanelProps) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    setShown(true);
  }, []);

  const { type, padding, margin, borderWidth, borderRadius } = data;
  const sourceLine = data.source.relativeFileName
    ? `${data.source.relativeFileName}${data.source.lineNumber ? `:${data.source.lineNumber}` : ""}`
    : "";

  return (
    <aside
      data-inspector-ui="true"
      className="fixed right-0 top-0 z-[2147483647] flex h-full w-[360px] max-w-[92vw] flex-col border-l border-slate-200 bg-white shadow-2xl"
      style={{
        fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif",
        pointerEvents: "auto",
        transform: shown ? "translateX(0)" : "translateX(100%)",
        transition: "transform 160ms ease-out",
      }}
    >
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-slate-200 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-900">{data.tag}</span>
            {data.componentName && (
              <span
                className="truncate rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                style={{ background: ACCENT }}
              >
                {data.componentName}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-500" title={sourceLine || undefined}>
            {sourceLine || `${data.width} × ${data.height} px`}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close inspector"
          className="shrink-0 text-slate-400 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-x-1 gap-y-0.5 border-b border-slate-100 px-4 py-2 text-[11px] text-slate-500">
        {crumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-slate-300">›</span>}
            <button
              onClick={() => onSelectCrumb(crumb.element)}
              className={`hover:text-[#016DE1] ${
                index === crumbs.length - 1 ? "font-semibold text-slate-700" : ""
              }`}
            >
              {crumb.label}
            </button>
          </span>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section title="Element">
          <Row label="Size">
            <Mono>
              {data.width} × {data.height}
            </Mono>
          </Row>
          <Row label="Display">
            <Mono>{data.display}</Mono>
          </Row>
          {data.id && (
            <Row label="id">
              <Copyable text={data.id} className="font-mono text-[11px] text-slate-800">
                #{data.id}
              </Copyable>
            </Row>
          )}
          {data.testId && (
            <Row label="testid">
              <Copyable text={data.testId} className="font-mono text-[11px] text-slate-800">
                {data.testId}
              </Copyable>
            </Row>
          )}
          {data.role && (
            <Row label="role">
              <Mono>{data.role}</Mono>
            </Row>
          )}
          {data.classes.length > 0 && (
            <Row label="class">
              <Copyable
                text={data.classes.join(" ")}
                className="font-mono text-[10px] text-slate-500"
              >
                <span className="break-all text-right">{data.classes.join(" ")}</span>
              </Copyable>
            </Row>
          )}
        </Section>

        <Section title="Typography">
          <Row label="Type token">
            <Copyable text={type.token} className="font-mono text-[11px]">
              <span style={{ color: ACCENT }}>{type.exact ? type.token : `≈ ${type.token}`}</span>
            </Copyable>
            {!type.exact && <span className="text-[10px] text-slate-400">closest match</span>}
          </Row>
          <Row label="Font">
            <Copyable
              text={type.fontFamilyStack}
              className="font-mono text-[11px] text-slate-800"
            >
              {type.fontFamily}
            </Copyable>
          </Row>
          <Row label="Size / line / weight">
            <Mono>
              {type.fontSize}px / {type.lineHeight} / {type.fontWeight}
            </Mono>
          </Row>
          {type.letterSpacing !== "normal" && (
            <Row label="Letter spacing">
              <Mono>{type.letterSpacing}</Mono>
            </Row>
          )}
          {type.textTransform !== "none" && (
            <Row label="Transform">
              <Mono>{type.textTransform}</Mono>
            </Row>
          )}
          {type.fontStyle !== "normal" && (
            <Row label="Style">
              <Mono>{type.fontStyle}</Mono>
            </Row>
          )}
        </Section>

        <Section title="Colour">
          {data.colors.map((color) => (
            <ColorRow key={color.label} color={color} />
          ))}
        </Section>

        <Section title="Spacing">
          <Row label="Padding">
            <Mono muted={padding.uniform && padding.top === 0}>{formatSides(padding)}</Mono>
            {!padding.uniform && <span className="text-[10px] text-slate-400">T · R · B · L</span>}
          </Row>
          <Row label="Margin">
            <Mono muted={margin.uniform && margin.top === 0}>{formatSides(margin)}</Mono>
            {!margin.uniform && <span className="text-[10px] text-slate-400">T · R · B · L</span>}
          </Row>
          {data.gap !== null && (
            <Row label="Gap">
              <Mono muted={data.gap === 0}>{data.gap}px</Mono>
            </Row>
          )}
        </Section>

        <Section title="Border & effects">
          <Row label="Border width">
            <Copyable text={borderWidth.token} className="font-mono text-[11px] text-slate-800">
              {scaleLabel(borderWidth)}
            </Copyable>
            {!borderWidth.uniform && (
              <span className="text-[10px] text-slate-400">non-uniform</span>
            )}
          </Row>
          {data.borderStyle !== "none" && (
            <Row label="Border style">
              <Mono>{data.borderStyle}</Mono>
            </Row>
          )}
          <Row label="Border radius">
            <Copyable text={borderRadius.token} className="font-mono text-[11px] text-slate-800">
              {borderRadius.token === "rounded-full" && borderRadius.exact
                ? "rounded-full"
                : scaleLabel(borderRadius)}
            </Copyable>
            {!borderRadius.uniform && (
              <span className="text-[10px] text-slate-400">non-uniform</span>
            )}
          </Row>
          <Row label="Shadow">
            {data.shadowToken ? (
              <Copyable text={data.shadowToken} className="font-mono text-[11px] text-slate-800">
                {data.shadowToken}
              </Copyable>
            ) : (
              <Copyable text={data.shadowRaw} className="font-mono text-[10px] text-slate-400">
                custom
              </Copyable>
            )}
          </Row>
          {data.opacity !== "1" && (
            <Row label="Opacity">
              <Mono>{data.opacity}</Mono>
            </Row>
          )}
        </Section>
      </div>

      <div className="shrink-0 border-t border-slate-200 px-4 py-2 text-[10px] text-slate-400">
        Read-only · click another element to inspect · Esc to deselect
      </div>
    </aside>
  );
};

export default InspectorPanel;
