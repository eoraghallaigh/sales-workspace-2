import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown } from "lucide-react";
import Tag from "@/components/Tag";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { cn } from "@/lib/utils";
import { formatMrr, type Portal, type PortalHealth } from "@/data/installBase";

const HEALTH_DOT: Record<PortalHealth, string> = {
  green: "bg-trellis-green-800",
  yellow: "bg-trellis-yellow-500",
  red: "bg-trellis-red-800",
};

// Renewal countdown, colour-coded by proximity — the single most action-driving
// number for an IB rep.
const renewalTone = (days: number): string => {
  if (days <= 30) return "text-trellis-red-900 font-medium";
  if (days <= 60) return "text-trellis-yellow-900 font-medium";
  return "text-muted-foreground";
};

const MrrValue = ({ portal }: { portal: Portal }) => (
  <span className="inline-flex items-center gap-1 body-125 text-foreground">
    {formatMrr(portal.mrr)}
    {portal.mrrTrend === "up" && (
      <ArrowUpRight className="h-3.5 w-3.5 text-trellis-green-800" />
    )}
    {portal.mrrTrend === "down" && (
      <ArrowDownRight className="h-3.5 w-3.5 text-trellis-red-800" />
    )}
  </span>
);

const HubChips = ({ portal }: { portal: Portal }) => (
  <div className="flex flex-wrap items-center gap-1">
    {portal.hubs.map((h) => (
      <Tag key={`${h.hub}-${h.tier}`} variant="neutral">
        {h.hub} {h.tier}
      </Tag>
    ))}
  </div>
);

// A labelled utilisation meter (seats / credits): "18 / 25" + fill bar.
const Meter = ({
  label,
  used,
  total,
  unit,
}: {
  label: string;
  used: number;
  total: number;
  unit?: string;
}) => {
  const ratio = total > 0 ? Math.min(1, used / total) : 0;
  const near = ratio >= 0.9;
  return (
    <div className="flex flex-col gap-1 min-w-[92px]">
      <div className="flex items-center justify-between gap-2">
        <span className="detail-200 text-muted-foreground">{label}</span>
        <span className="detail-200 text-foreground">
          {used.toLocaleString("en-US")}
          <span className="text-muted-foreground">
            {" / "}
            {total.toLocaleString("en-US")}
            {unit ? ` ${unit}` : ""}
          </span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-trellis-neutral-200 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            near ? "bg-trellis-orange-800" : "bg-trellis-green-800",
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
    </div>
  );
};

const PortalIdLink = ({ portal }: { portal: Portal }) => (
  <button
    type="button"
    className="inline-flex items-center gap-1 detail-200 text-text-interactive hover:text-text-interactive-hover transition-colors"
  >
    {portal.id}
    <TrellisIcon name="externalLink" size={12} />
  </button>
);

const RenewalValue = ({ portal }: { portal: Portal }) => (
  <span className={cn("body-125", renewalTone(portal.renewalInDays))}>
    {portal.renewalDate}
    <span className="detail-200"> ({portal.renewalInDays}d)</span>
  </span>
);

const PortalSignals = ({ portal }: { portal: Portal }) =>
  portal.signals && portal.signals.length > 0 ? (
    <div className="flex flex-wrap gap-1">
      {portal.signals.map((s) => (
        <Tag key={s.text} variant={s.variant}>
          {s.text}
        </Tag>
      ))}
    </div>
  ) : null;

// --- Single-portal: lean full-width strip -----------------------------------

const PortalSummaryStrip = ({ portal }: { portal: Portal }) => (
  <div className="flex flex-wrap items-start gap-x-6 gap-y-3 rounded border border-border bg-[var(--color-fill-surface-default)] px-4 py-3">
    <div className="flex items-center gap-2 min-w-[200px]">
      <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", HEALTH_DOT[portal.health])} />
      <div className="flex flex-col">
        <span className="heading-50 text-foreground">{portal.name}</span>
        <PortalIdLink portal={portal} />
      </div>
    </div>
    <HubChips portal={portal} />
    <div className="flex flex-col gap-0.5">
      <span className="detail-200 text-muted-foreground">MRR</span>
      <MrrValue portal={portal} />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="detail-200 text-muted-foreground">Next renewal</span>
      <RenewalValue portal={portal} />
    </div>
    <Meter label="Seats" used={portal.seatsActive} total={portal.seatsLicensed} />
    {portal.creditsLimit ? (
      <Meter label="Credits" used={portal.creditsUsed ?? 0} total={portal.creditsLimit} />
    ) : null}
    <div className="w-full">
      <PortalSignals portal={portal} />
    </div>
  </div>
);

// Multi-portal: lead with the primary portal (highest MRR — usually carries the
// vast majority of the account's spend) as a strip, then a "N more" expander
// revealing the remaining portal strips. Same strip format throughout so each
// portal is recognisable at a glance.
const MultiPortalBlock = ({ portals }: { portals: Portal[] }) => {
  const [open, setOpen] = useState(false);
  const sorted = [...portals].sort((a, b) => b.mrr - a.mrr);
  const [primary, ...rest] = sorted;
  const restMrr = rest.reduce((sum, p) => sum + p.mrr, 0);

  // A `fit-content(100%)` column sizes to the widest strip's content but caps at
  // the container width — so every strip shares the widest one's width, the block
  // only takes the space it needs, and it never overflows the container.
  return (
    <div className="grid grid-cols-[fit-content(100%)] gap-3">
      <PortalSummaryStrip portal={primary} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 justify-self-start body-100 text-text-interactive hover:text-text-interactive-hover transition-colors"
      >
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")}
        />
        {open
          ? `Hide ${rest.length} ${rest.length === 1 ? "portal" : "portals"}`
          : `Show ${rest.length} more ${rest.length === 1 ? "portal" : "portals"}`}
        {!open && (
          <span className="text-muted-foreground">· {formatMrr(restMrr)}</span>
        )}
      </button>
      {open && rest.map((p) => <PortalSummaryStrip key={p.id} portal={p} />)}
    </div>
  );
};

// The portal block adapts to count: one portal renders as a lean strip that hugs
// its content; two or more lead with the primary (highest-MRR) portal plus a
// "N more" expander, all strips sharing the widest one's width.
const PortalBlock = ({ portals }: { portals: Portal[] }) => {
  if (portals.length === 1) {
    return (
      <div className="grid grid-cols-[fit-content(100%)]">
        <PortalSummaryStrip portal={portals[0]} />
      </div>
    );
  }
  return <MultiPortalBlock portals={portals} />;
};

export default PortalBlock;
