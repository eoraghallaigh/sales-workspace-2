import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";

// ── Chart data ──────────────────────────────────────────────

const barChartData = [
  { name: "W1", booked: 140, pipeline: 80 },
  { name: "W2", booked: 180, pipeline: 100 },
  { name: "W3", booked: 160, pipeline: 90 },
  { name: "W4", booked: 170, pipeline: 85 },
  { name: "W5", booked: 190, pipeline: 110 },
  { name: "W6", booked: 185, pipeline: 105 },
  { name: "W7", booked: 200, pipeline: 120 },
];

const areaChartData = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 55 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 65 },
  { name: "May", value: 50 },
  { name: "Jun", value: 70 },
];

const horizontalBarData = [
  { name: "Q1", cat1: 30, cat2: 25, cat3: 20, cat4: 15 },
  { name: "Q2", cat1: 35, cat2: 28, cat3: 22, cat4: 18 },
  { name: "Q3", cat1: 32, cat2: 30, cat3: 25, cat4: 20 },
  { name: "Q4", cat1: 38, cat2: 32, cat3: 28, cat4: 22 },
];

// ── Activity data ───────────────────────────────────────────

type ActivityTab = "prospects" | "agents" | "team";

interface ActivityItem {
  id: string;
  company: string;
  description: string;
  actionLabel: string;
  actionVariant: "link" | "button";
  dotColor: string;
  agentBadge?: { label: string; color: string };
}

const activityData: Record<ActivityTab, ActivityItem[]> = {
  prospects: [
    { id: "1", company: "Gucci", description: "Responded to your outreach email", actionLabel: "View response", actionVariant: "link", dotColor: "bg-trellis-green-600" },
    { id: "2", company: "Oatly", description: "Downloaded the pricing guide", actionLabel: "View activity", actionVariant: "link", dotColor: "bg-trellis-blue-600" },
    { id: "3", company: "Koro Ireland", description: "Visited the product page 3 times", actionLabel: "View activity", actionVariant: "link", dotColor: "bg-trellis-orange-500" },
  ],
  agents: [
    { id: "0", company: "Innovation Corp - New Deal", description: "Demo generator has created a portal for your upcoming demo.", actionLabel: "View", actionVariant: "button", dotColor: "bg-trellis-magenta-600", agentBadge: { label: "Demo Generator", color: "magenta" } },
    { id: "1", company: "ACME Corp", description: "New prospecting strategy created for this company", actionLabel: "View strategy", actionVariant: "link", dotColor: "bg-trellis-blue-400", agentBadge: { label: "Prospecting Strategist", color: "blue" } },
    { id: "2", company: "Stellar Solutions", description: "New prospecting strategy created for this company", actionLabel: "View strategy", actionVariant: "link", dotColor: "bg-trellis-blue-400", agentBadge: { label: "Prospecting Strategist", color: "blue" } },
    { id: "3", company: "Olivia Carmicheal", description: "Contact was enrolled in a sequence.", actionLabel: "Review", actionVariant: "button", dotColor: "bg-trellis-blue-400", agentBadge: { label: "Sequencing", color: "orange" } },
    { id: "4", company: "Pinnacle Technologies", description: "New prospecting strategy created for this company", actionLabel: "View strategy", actionVariant: "link", dotColor: "bg-trellis-blue-400", agentBadge: { label: "Prospecting Strategist", color: "blue" } },
  ],
  team: [
    { id: "1", company: "Sarah Chen", description: "Booked a meeting with Acme Corp", actionLabel: "View", actionVariant: "link", dotColor: "bg-trellis-green-600" },
    { id: "2", company: "James Lee", description: "Closed a deal with TechStart", actionLabel: "View", actionVariant: "link", dotColor: "bg-trellis-green-600" },
  ],
};

// ── Schedule data ───────────────────────────────────────────

interface ScheduleEvent {
  startHour: number; // e.g. 8 = 8:00am, 12.5 = 12:30pm
  durationHours: number; // 0.5 = 30min, 1 = 1hr
  title: string;
  subtitle?: string;
  variant: "booked" | "agent" | "suggested";
  attendees?: number;
  link?: string;
}

const SCHEDULE_START = 8;
const SCHEDULE_END = 17;
const SLOT_HEIGHT = 48; // px per half hour

const scheduleEvents: ScheduleEvent[] = [
  { startHour: 8, durationHours: 0.5, title: "P1 Prospecting", subtitle: "Suggested block", variant: "suggested", link: "/prospecting" },
  { startHour: 9, durationHours: 1, title: "Discovery Call — Meridian Health", variant: "booked", attendees: 3 },
  { startHour: 10, durationHours: 1, title: "Cold Call Agent Power Hour", subtitle: "Suggested block", variant: "agent", link: "/power-hour/review" },
  { startHour: 11, durationHours: 1, title: "Demo — Atlas Ventures", variant: "booked", attendees: 4 },
  { startHour: 12, durationHours: 1, title: "Lunch", variant: "booked" },
  { startHour: 13, durationHours: 1, title: "Discovery Call — Pinnacle Solutions", variant: "booked", attendees: 2 },
  { startHour: 14.5, durationHours: 0.5, title: "P2 Prospecting", subtitle: "Suggested block", variant: "suggested" },
  { startHour: 15, durationHours: 1, title: "Demo — Quantum Dynamics", variant: "booked", attendees: 5 },
  { startHour: 16.5, durationHours: 0.5, title: "Pipeline Review", variant: "booked", attendees: 6 },
];

const formatHalfHour = (hour: number): string => {
  const h = Math.floor(hour);
  const m = hour % 1 === 0.5 ? "30" : "00";
  const ampm = h >= 12 ? "pm" : "am";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m} ${ampm}`;
};

const halfHourSlots: number[] = [];
for (let h = SCHEDULE_START; h < SCHEDULE_END; h += 0.5) {
  halfHourSlots.push(h);
}

// ── Component ───────────────────────────────────────────────

const Summary = () => {
  const navigate = useNavigate();
  const [activeActivityTab, setActiveActivityTab] = useState<ActivityTab>("agents");

  const activityTabs: { id: ActivityTab; label: string; icon: string }[] = [
    { id: "prospects", label: "Prospects", icon: "contact" },
    { id: "agents", label: "Agents", icon: "robot" },
    { id: "team", label: "Team", icon: "contact" },
  ];

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-fill-surface-recessed overflow-hidden">
        <WorkspaceHeader activeTab="summary" />

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col gap-6">

            {/* ── Key Metrics ──────────────────────────── */}
            <Card className="p-6">
              <h2 className="heading-300 text-foreground mb-6">Key Metrics</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Chart 1: Stacked bar */}
                <div className="border border-border rounded-lg p-4 h-[200px]">
                  <div className="h-3 bg-muted rounded w-20 mb-4" />
                  <ChartContainer
                    config={{
                      booked: { label: "Booked", color: "hsl(var(--chart-1))" },
                      pipeline: { label: "Pipeline", color: "hsl(var(--chart-3))" },
                    }}
                    className="h-[140px] w-full"
                  >
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" tick={false} axisLine={false} />
                      <Bar dataKey="booked" stackId="a" fill="var(--color-fill-accent-teal-default, #48d1cf)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="pipeline" stackId="a" fill="var(--color-fill-accent-orange-default, #ffa581)" radius={[2, 2, 0, 0]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                </div>

                {/* Chart 2: Area chart */}
                <div className="border border-border rounded-lg p-4 h-[200px]">
                  <div className="h-3 bg-muted rounded w-24 mb-4" />
                  <ChartContainer
                    config={{ value: { label: "Value", color: "hsl(var(--chart-3))" } }}
                    className="h-[140px] w-full"
                  >
                    <AreaChart data={areaChartData}>
                      <defs>
                        <linearGradient id="summaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-fill-accent-orange-default, #ffa581)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-fill-accent-orange-default, #ffa581)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-fill-accent-orange-default, #ffa581)"
                        fillOpacity={1}
                        fill="url(#summaryAreaGrad)"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </AreaChart>
                  </ChartContainer>
                </div>

                {/* Chart 3: Horizontal stacked bar */}
                <div className="border border-border rounded-lg p-4 h-[200px]">
                  <div className="h-3 bg-muted rounded w-16 mb-4" />
                  <ChartContainer
                    config={{
                      cat1: { label: "Cat 1", color: "hsl(var(--chart-4))" },
                      cat2: { label: "Cat 2", color: "hsl(var(--chart-5))" },
                      cat3: { label: "Cat 3", color: "hsl(var(--chart-3))" },
                      cat4: { label: "Cat 4", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[140px] w-full"
                  >
                    <BarChart data={horizontalBarData} layout="vertical">
                      <YAxis dataKey="name" type="category" tick={false} axisLine={false} width={0} />
                      <XAxis type="number" tick={false} axisLine={false} />
                      <Bar dataKey="cat1" stackId="a" fill="var(--trellis-color-purple-600, #9778ec)" />
                      <Bar dataKey="cat2" stackId="a" fill="var(--trellis-color-magenta-800, #d20688)" />
                      <Bar dataKey="cat3" stackId="a" fill="var(--trellis-color-magenta-600, #fb31a7)" />
                      <Bar dataKey="cat4" stackId="a" fill="var(--color-fill-accent-orange-default, #ffa581)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </Card>

            {/* ── Bottom row: Activity + Today ─────────── */}
            <div className="grid grid-cols-[1fr_1fr] gap-6">

              {/* Activity */}
              <Card className="p-6 flex flex-col">
                <h2 className="heading-300 text-foreground mb-4">Activity</h2>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-core-subtle mb-4">
                  {activityTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveActivityTab(tab.id)}
                      className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors ${
                        activeActivityTab === tab.id
                          ? "border-foreground body-100 !font-bold text-foreground"
                          : "border-transparent body-100 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <TrellisIcon name={tab.icon as any} size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Items */}
                <div className="flex flex-col divide-y divide-core-subtle">
                  {activityData[activeActivityTab].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4">
                      <div>
                        {item.agentBadge && (
                           <span className={`inline-flex items-center px-1.5 py-0.5 rounded detail-100 mb-1 ${
                            item.agentBadge.color === "magenta" ? "bg-trellis-magenta-300 text-trellis-magenta-900" :
                            item.agentBadge.color === "blue" ? "bg-trellis-blue-300 text-trellis-blue-1000" :
                            item.agentBadge.color === "orange" ? "bg-trellis-orange-300 text-trellis-orange-900" :
                            "bg-trellis-neutral-200 text-foreground"
                          }`}>
                            {item.agentBadge.label}
                          </span>
                        )}
                        <span className="heading-25 text-text-core-default cursor-pointer hover:text-text-interactive-hover transition-colors block">
                          {item.company}
                        </span>
                        <p className="detail-200 text-muted-foreground">{item.description}</p>
                      </div>
                      <Button variant="secondary" size="small" className="whitespace-nowrap">
                        {item.actionLabel}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Today schedule */}
              <Card className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-300 text-foreground">Today, Jul 31</h2>
                  <div className="flex gap-1">
                    <Button variant="secondary-alt" size="extra-small" className="p-1.5">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary-alt" size="extra-small" className="p-1.5">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative" style={{ height: `${halfHourSlots.length * SLOT_HEIGHT}px` }}>
                  {/* Time grid lines */}
                  {halfHourSlots.map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 flex items-start gap-3"
                      style={{ top: `${(hour - SCHEDULE_START) * 2 * SLOT_HEIGHT}px` }}
                    >
                      <span className="detail-200 text-muted-foreground w-[60px] flex-shrink-0 -translate-y-1/2">
                        {formatHalfHour(hour)}
                      </span>
                      <div className="flex-1 border-t border-border-core-subtle" />
                    </div>
                  ))}

                  {/* Event blocks */}
                  {scheduleEvents.map((evt, i) => {
                    const top = (evt.startHour - SCHEDULE_START) * 2 * SLOT_HEIGHT + 4;
                    const height = evt.durationHours * 2 * SLOT_HEIGHT - 8;

                    return (
                      <div
                        key={i}
                        className="absolute right-0"
                        style={{ top: `${top}px`, height: `${height}px`, left: "72px" }}
                        {...(evt.title === "P1 Prospecting" ? { "data-tour": "p1-prospecting-block" } : {})}
                      >
                        {evt.variant === "agent" || evt.variant === "suggested" ? (
                          <div
                            className="h-full rounded-lg p-3 flex items-center gap-2"
                            style={{
                              background: "var(--trellis-color-magenta-100, #FFF0F8)",
                              border: "1px dashed var(--trellis-color-magenta-400, #FF8AC7)",
                            }}
                          >
                            <TrellisIcon name="sparkle" size={14} />
                            <div className="flex flex-col flex-1">
                              <span className="heading-25 text-foreground">{evt.title}</span>
                              {evt.subtitle && <span className="detail-200 text-muted-foreground">{evt.subtitle}</span>}
                            </div>
                            <Button variant="secondary" size="small" className="whitespace-nowrap flex-shrink-0" onClick={() => evt.link && navigate(evt.link)}>
                              Start now
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="h-full rounded-lg p-3 flex flex-col justify-center"
                            style={{
                              background: "var(--trellis-color-blue-100, #E8F4FE)",
                              border: "1px solid var(--trellis-color-blue-500, #3B8BDB)",
                            }}
                          >
                            <span className="heading-25 text-foreground">{evt.title}</span>
                            {evt.attendees && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <TrellisIcon name="contact" size={12} />
                                <span className="detail-200 text-muted-foreground">
                                  {evt.attendees} {evt.attendees === 1 ? "attendee" : "attendees"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Summary;
