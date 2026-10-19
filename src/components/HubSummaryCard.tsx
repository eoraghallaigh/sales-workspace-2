import type { ReactNode } from "react";
import { toast } from "sonner";
import { AreaChart, Area, LineChart, Line, XAxis } from "recharts";

import type { HubSummary } from "@/data/companyCards";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface HubSummaryCardProps {
  summary: HubSummary;
  // The Portals card shows the Hub ID + "View Portal" link in its own portal
  // header, so it hides this card's copy to avoid duplicating them.
  hidePortalLinks?: boolean;
  // FSC portals replace the "Tiers limits" section with a Credits & Capacity
  // view; when provided it renders in that slot. Defaults to the tiers limits.
  limitsSlot?: ReactNode;
  // FSC portals don't surface the usage-intent playbook key fact.
  hideUsageIntentPlaybook?: boolean;
}

const KeyValue = ({ label, value, link }: { label: string; value: string; link?: boolean }) => (
  <div className="flex flex-col gap-1">
    <span className="detail-200 text-muted-foreground">{label}</span>
    {link ? (
      <button
        type="button"
        onClick={() => toast.success(`Opens ${label}`)}
        className="link-100 text-left text-[var(--color-text-interactive-default)] hover:underline"
      >
        {value}
      </button>
    ) : (
      <span className="link-100 text-foreground">{value}</span>
    )}
  </div>
);

const ExternalLink = ({ children }: { children: string }) => (
  <button
    type="button"
    className="detail-100 text-text-interactive hover:underline flex items-center gap-1 whitespace-nowrap"
  >
    {children}
    <TrellisIcon name="externalLink" size={11} />
  </button>
);

const HubSummaryCard = ({
  summary,
  hidePortalLinks = false,
  limitsSlot,
  hideUsageIntentPlaybook = false,
}: HubSummaryCardProps) => {
  const gradId = `hubAreaGrad-${summary.hubId}`;

  return (
    <div className="flex flex-col gap-6">
      {!hidePortalLinks && (
        /* Header: Hub ID + portal link */
        <div className="flex items-center gap-4 flex-wrap">
          <span className="detail-200 text-muted-foreground">Hub ID: {summary.hubId}</span>
          <ExternalLink>View Portal</ExternalLink>
        </div>
      )}

      {/* Key facts */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <KeyValue label="Domain set in portal" value={summary.domain} />
        <KeyValue
          label="Active users"
          value={`${summary.activeUsers.active} of ${summary.activeUsers.total} total users`}
          link
        />
        <KeyValue label="Usage intent score" value={summary.usageIntentScore} />
        {!hideUsageIntentPlaybook && (
          <KeyValue label="Usage intent playbook" value={summary.usageIntentPlaybook} />
        )}
        <KeyValue label="First purchase" value={summary.firstPurchase} />
        <KeyValue label="Created" value={summary.created} />
      </div>

      <Separator />

      {/* Tiers limits (legacy) — replaced by a Credits & Capacity view under FSC */}
      {limitsSlot ?? (
        <div className="flex flex-col gap-4">
          <h4 className="heading-100 text-foreground">Tiers limits</h4>
          <div className="grid grid-cols-1 gap-4">
            {summary.limits.map((limit) => (
              <div key={limit.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="body-100 text-foreground">
                    {limit.label}
                    {limit.note ? (
                      <span className="text-muted-foreground"> {limit.note}</span>
                    ) : null}
                  </span>
                </div>
                <Progress value={limit.pct} className="h-2" />
                <span className="detail-200 text-muted-foreground">{limit.usedLabel}</span>
              </div>
            ))}
          </div>
          <p className="detail-200 text-muted-foreground">{summary.eligibility}</p>
        </div>
      )}

      <Separator />

      {/* Usage over time */}
      <div className="flex flex-col gap-3">
        <h4 className="heading-100 text-foreground">Usage over time</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="detail-200 text-muted-foreground">All contacts</span>
            <ChartContainer
              config={{ value: { label: "Contacts", color: "hsl(var(--chart-1))" } }}
              className="h-[110px] w-full overflow-hidden"
            >
              <AreaChart data={summary.usageOverTime.contacts}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-fill-accent-orange-default, #ffa581)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-fill-accent-orange-default, #ffa581)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-fill-accent-orange-default, #ffa581)"
                  fillOpacity={1}
                  fill={`url(#${gradId})`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </AreaChart>
            </ChartContainer>
          </div>
          <div>
            <span className="detail-200 text-muted-foreground">Emails</span>
            <ChartContainer
              config={{ value: { label: "Emails", color: "hsl(var(--chart-3))" } }}
              className="h-[110px] w-full overflow-hidden"
            >
              <LineChart data={summary.usageOverTime.emails}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-fill-accent-teal-default, #48d1cf)"
                  dot={{ r: 2 }}
                  strokeWidth={2}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      <Separator />

      {/* Integrations */}
      <div className="flex flex-col gap-2">
        <h4 className="heading-100 text-foreground">Integrations</h4>
        <p className="body-100 text-foreground">
          {summary.integrations.length > 0 ? summary.integrations.join(", ") : "No connected integrations"}
        </p>
      </div>

      {/* Active and past trials */}
      <div className="flex flex-col gap-2">
        <h4 className="heading-100 text-foreground">Active and past trials</h4>
        {summary.trials.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="detail-200 text-muted-foreground">Trial</span>
              <span className="detail-200 text-muted-foreground">Date</span>
            </div>
            {summary.trials.map((trial) => (
              <div key={`${trial.name}-${trial.dates}`} className="flex items-center justify-between">
                <span className="body-100 text-foreground">{trial.name}</span>
                <span className="body-100 text-muted-foreground">{trial.dates}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="body-100 text-muted-foreground">No active or past trials</p>
        )}
      </div>
    </div>
  );
};

export default HubSummaryCard;
