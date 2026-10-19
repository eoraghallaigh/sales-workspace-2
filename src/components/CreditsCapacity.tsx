import { BarChart, Bar, XAxis } from "recharts";
import type { CreditCapacityRow, CreditUsageDatum } from "@/data/installBase";
import { Separator } from "@/components/ui/separator";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface CreditsCapacityProps {
  capacity: CreditCapacityRow[];
  creditUsage: CreditUsageDatum[];
}

const BILLED = "#0E7C86";
const NON_BILLED = "#7FD1D1";

const CapacityBar = ({ pct, atLimit }: { pct: number; atLimit?: boolean }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-fill-surface-recessed,#F0F0F0)]">
    <div
      className="h-full rounded-full"
      style={{
        width: `${pct}%`,
        background: atLimit
          ? "var(--color-fill-alert-default,#D9002B)"
          : "var(--color-fill-accent-green-default,#00bda5)",
      }}
    />
  </div>
);

const CapacityRow = ({ row }: { row: CreditCapacityRow }) => (
  <div className="flex flex-col gap-1.5">
    <span className="heading-50 text-foreground">{row.label}</span>
    <span className="body-100 text-muted-foreground">{row.message ?? row.usedLabel}</span>
    <CapacityBar pct={row.pct ?? 0} atLimit={(row.pct ?? 0) >= 100} />
    {row.note && <span className="body-100 text-muted-foreground">{row.note}</span>}
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-core-subtle bg-card px-2.5 py-1 detail-100 text-foreground">
    {children}
  </span>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5 detail-200 text-muted-foreground">
    <span className="h-2 w-2 rounded-full" style={{ background: color }} />
    {label}
  </span>
);

const CreditsCapacity = ({ capacity, creditUsage }: CreditsCapacityProps) => {
  const topRows = capacity.filter((r) => r.group === "top");
  const usageRows = capacity.filter((r) => r.group === "usage");

  return (
    <div className="flex flex-col gap-6">
      <h4 className="heading-100 text-foreground">Credits &amp; Capacity</h4>

      {/* Capacity */}
      <div className="flex flex-col gap-5">
        {topRows.map((row) => (
          <CapacityRow key={row.label} row={row} />
        ))}
        <Separator />
        <span className="heading-100 text-foreground">HubSpot on Credits Usage</span>
        {usageRows.map((row) => (
          <CapacityRow key={row.label} row={row} />
        ))}
      </div>

      <Separator />

      {/* Credits usage breakdown */}
      <div className="flex flex-col gap-4">
        <h4 className="heading-100 text-foreground">Credit usage by feature category</h4>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip>Current month<TrellisIcon name="down" size={11} /></Chip>
          <Chip>Daily<TrellisIcon name="down" size={11} /></Chip>
          <Chip>Billed usage<TrellisIcon name="remove" size={10} /></Chip>
          <Chip>Non-billed usage<TrellisIcon name="remove" size={10} /></Chip>
        </div>
        <div className="flex items-center gap-4">
          <LegendDot color={NON_BILLED} label="Non-billed usage" />
          <LegendDot color={BILLED} label="Billed usage" />
        </div>
        <ChartContainer
          config={{
            billed: { label: "Billed usage", color: BILLED },
            nonBilled: { label: "Non-billed usage", color: NON_BILLED },
          }}
          className="h-[200px] w-full"
        >
          <BarChart data={creditUsage}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="nonBilled" stackId="credits" fill={NON_BILLED} />
            <Bar dataKey="billed" stackId="credits" fill={BILLED} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
        <span className="detail-200 text-muted-foreground">Credits used over the selected date range</span>
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <span className="detail-200 text-muted-foreground">
          Powered by <span className="heading-50">Limits</span>
        </span>
        <TrellisIcon name="infoCircle" size={13} className="opacity-60" />
      </div>
    </div>
  );
};

export default CreditsCapacity;
