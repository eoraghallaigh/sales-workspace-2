import { useMemo, useState } from "react";
import { ChevronDown, Megaphone, Calendar, ExternalLink, FileText, Swords, MessageSquareText, Video, File } from "lucide-react";
import { plays, EnablementMaterial } from "@/data/playData";

const play = plays[0];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const daysRemaining = (() => {
  const end = new Date(play.endDate);
  const today = new Date();
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
})();

const materialIcon = (type: EnablementMaterial["type"]) => {
  switch (type) {
    case "case-study": return <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "battle-card": return <Swords className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "talk-track": return <MessageSquareText className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "video": return <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "one-pager": return <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
  }
};

interface Spacing {
  cardPadX: number;
  cardPadY: number;
  accentBarHeight: number;
  eyebrowToTitle: number;
  titleToDescription: number;
  descriptionToEnablement: number;
  enablementHeadToGrid: number;
  gridGap: number;
  materialGap: number;
  materialPadX: number;
  materialPadY: number;
  micrositeFooterPad: number;
  micrositePreviewH: number;
}

const DEFAULTS: Spacing = {
  cardPadX: 20,
  cardPadY: 20,
  accentBarHeight: 4,
  eyebrowToTitle: 8,
  titleToDescription: 12,
  descriptionToEnablement: 16,
  enablementHeadToGrid: 8,
  gridGap: 16,
  materialGap: 2,
  materialPadX: 8,
  materialPadY: 8,
  micrositeFooterPad: 12,
  micrositePreviewH: 160,
};

// Nearest Tailwind spacing class for a px value (4px scale).
const TW_SCALE: { px: number; cls: string }[] = [
  { px: 0, cls: "0" }, { px: 2, cls: "0.5" }, { px: 4, cls: "1" }, { px: 6, cls: "1.5" },
  { px: 8, cls: "2" }, { px: 12, cls: "3" }, { px: 16, cls: "4" }, { px: 20, cls: "5" },
  { px: 24, cls: "6" }, { px: 32, cls: "8" }, { px: 40, cls: "10" }, { px: 48, cls: "12" },
];
const nearestTw = (px: number) =>
  TW_SCALE.reduce((best, t) => (Math.abs(t.px - px) < Math.abs(best.px - px) ? t : best)).cls;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>
);

const RangeControl = ({
  label, value, min, max, onChange,
}: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) => (
  <Field label={`${label} — ${value}px · ~${nearestTw(value)}`}>
    <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#FF4800]" />
  </Field>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-6 mb-3 first:mt-0">{children}</h3>
);

const PlayHeaderSandbox = () => {
  const [s, setS] = useState<Spacing>(DEFAULTS);
  const set = (key: keyof Spacing) => (value: number) => setS((prev) => ({ ...prev, [key]: value }));

  const summary = useMemo(
    () =>
      (Object.keys(s) as (keyof Spacing)[])
        .map((k) => `${k}: ${s[k]}px  (~${nearestTw(s[k])})`)
        .join("\n"),
    [s],
  );

  const preview = (
    <div
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF4EF] to-card border border-[#F6CDBC] rounded shadow-200"
      style={{ paddingLeft: s.cardPadX, paddingRight: s.cardPadX, paddingTop: s.cardPadY, paddingBottom: s.cardPadY }}
    >
      <div className="absolute inset-x-0 top-0 trellis-gradient-hero" style={{ height: s.accentBarHeight }} />

      {/* Eyebrow */}
      <div className="flex items-center gap-1.5" style={{ marginBottom: s.eyebrowToTitle }}>
        <Megaphone className="h-3.5 w-3.5 text-[var(--color-text-brand-default)]" />
        <span className="heading-25 uppercase tracking-wide text-[var(--color-text-brand-default)]">Play</span>
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <h3 className="heading-300 text-foreground">{play.label}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="detail-100 text-muted-foreground">{formatDate(play.startDate)} – {formatDate(play.endDate)}</span>
          <span className="detail-100 text-muted-foreground">·</span>
          <span className="detail-100 text-muted-foreground">{daysRemaining} days remaining</span>
        </div>
      </div>

      {/* Description */}
      <p className="body-100 text-foreground leading-relaxed" style={{ marginTop: s.titleToDescription, marginBottom: s.descriptionToEnablement }}>
        {play.description}
      </p>

      {/* Enablement heading */}
      <div className="flex items-center gap-2" style={{ marginBottom: s.enablementHeadToGrid }}>
        <span className="heading-50 text-foreground">Enablement materials</span>
        <span className="detail-100 text-muted-foreground">({play.enablementMaterials.length})</span>
      </div>

      {/* Enablement grid */}
      <div className="grid grid-cols-2" style={{ gap: s.gridGap }}>
        {play.micrositeUrl && (
          <div className="flex flex-col rounded-200 border border-core-subtle overflow-hidden">
            {play.micrositePreview ? (
              <div className="overflow-hidden border-b border-core-subtle" style={{ height: s.micrositePreviewH }}>
                <img src={play.micrositePreview} alt="" className="w-full object-cover object-top" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1.5 border-b border-core-subtle bg-[#0B3B34] px-4 text-center" style={{ height: s.micrositePreviewH }}>
                <span className="heading-200 text-white">{play.micrositeTitle ?? play.label}</span>
                <span className="detail-100 text-white/70">Campaign microsite</span>
              </div>
            )}
            <div className="flex items-start gap-2" style={{ padding: s.micrositeFooterPad }}>
              <ExternalLink className="h-4 w-4 text-text-interactive flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="link-100 text-text-interactive block">{play.micrositeTitle ?? "Campaign microsite"}</span>
                <span className="detail-100 text-muted-foreground block">{play.micrositeDescription}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col" style={{ gap: s.materialGap }}>
          {play.enablementMaterials.map((material) => (
            <div key={material.id} className="flex items-start gap-2.5 rounded" style={{ paddingLeft: s.materialPadX, paddingRight: s.materialPadX, paddingTop: s.materialPadY, paddingBottom: s.materialPadY }}>
              <span className="flex-shrink-0 mt-1">{materialIcon(material.type)}</span>
              <div className="min-w-0 flex-1">
                <span className="link-100 text-text-interactive block">{material.title}</span>
                <span className="detail-100 text-muted-foreground block">{material.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex font-sans">
      <aside className="w-[360px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Play Box Spacing</h2>
          <button onClick={() => setS(DEFAULTS)} className="text-xs font-semibold text-[#FF4800] hover:underline">Reset</button>
        </div>

        <SectionTitle>Card</SectionTitle>
        <div className="flex flex-col gap-3">
          <RangeControl label="Padding X" value={s.cardPadX} min={0} max={48} onChange={set("cardPadX")} />
          <RangeControl label="Padding Y" value={s.cardPadY} min={0} max={48} onChange={set("cardPadY")} />
          <RangeControl label="Accent bar height" value={s.accentBarHeight} min={0} max={12} onChange={set("accentBarHeight")} />
        </div>

        <SectionTitle>Vertical rhythm</SectionTitle>
        <div className="flex flex-col gap-3">
          <RangeControl label="Eyebrow → title" value={s.eyebrowToTitle} min={0} max={32} onChange={set("eyebrowToTitle")} />
          <RangeControl label="Title → description" value={s.titleToDescription} min={0} max={32} onChange={set("titleToDescription")} />
          <RangeControl label="Description → enablement" value={s.descriptionToEnablement} min={0} max={40} onChange={set("descriptionToEnablement")} />
          <RangeControl label="Enablement heading → grid" value={s.enablementHeadToGrid} min={0} max={32} onChange={set("enablementHeadToGrid")} />
        </div>

        <SectionTitle>Enablement</SectionTitle>
        <div className="flex flex-col gap-3">
          <RangeControl label="Grid column gap" value={s.gridGap} min={0} max={48} onChange={set("gridGap")} />
          <RangeControl label="Material link gap" value={s.materialGap} min={0} max={24} onChange={set("materialGap")} />
          <RangeControl label="Material link padding X" value={s.materialPadX} min={0} max={24} onChange={set("materialPadX")} />
          <RangeControl label="Material link padding Y" value={s.materialPadY} min={0} max={24} onChange={set("materialPadY")} />
          <RangeControl label="Microsite footer padding" value={s.micrositeFooterPad} min={0} max={32} onChange={set("micrositeFooterPad")} />
          <RangeControl label="Microsite preview height" value={s.micrositePreviewH} min={80} max={280} onChange={set("micrositePreviewH")} />
        </div>

        <SectionTitle>Values</SectionTitle>
        <textarea readOnly value={summary} className="w-full h-[280px] rounded-lg border border-slate-300 bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-100" />
      </aside>

      <main className="flex-1 overflow-auto bg-[#F5F8FA] p-10">
        <div className="mx-auto max-w-[840px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Play explanation box</h3>
          {preview}
          <p className="mt-6 text-xs text-slate-400">Type &amp; colour come from the design system; only spacing is adjustable here. Collapse is shown statically (always open).</p>
        </div>
      </main>
    </div>
  );
};

export default PlayHeaderSandbox;
