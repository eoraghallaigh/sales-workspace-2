import { useState } from "react";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CheckCircle2, Triangle, List, Mail, MoreVertical, Calendar, Sparkles } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
const SalesWorkspace = () => {
  const [activityTab, setActivityTab] = useState<"prospects" | "agents" | "team">("prospects");
  // Sample data for charts
  const barChartData = [{
    name: "W1",
    value1: 140,
    value2: 80
  }, {
    name: "W2",
    value1: 180,
    value2: 100
  }, {
    name: "W3",
    value1: 160,
    value2: 90
  }, {
    name: "W4",
    value1: 170,
    value2: 85
  }, {
    name: "W5",
    value1: 190,
    value2: 110
  }, {
    name: "W6",
    value1: 185,
    value2: 105
  }, {
    name: "W7",
    value1: 200,
    value2: 120
  }];
  const areaChartData = [{
    name: "Jan",
    value: 40
  }, {
    name: "Feb",
    value: 55
  }, {
    name: "Mar",
    value: 45
  }, {
    name: "Apr",
    value: 65
  }, {
    name: "May",
    value: 50
  }, {
    name: "Jun",
    value: 70
  }];
  const streamChartData = [{
    name: "Q1",
    cat1: 30,
    cat2: 25,
    cat3: 20,
    cat4: 15
  }, {
    name: "Q2",
    cat1: 35,
    cat2: 28,
    cat3: 22,
    cat4: 18
  }, {
    name: "Q3",
    cat1: 32,
    cat2: 30,
    cat3: 25,
    cat4: 20
  }, {
    name: "Q4",
    cat1: 38,
    cat2: 32,
    cat3: 28,
    cat4: 22
  }];
  const actionItems = [{
    type: "deal",
    title: "Deal stage: Koro & HubSpot | Discovery Call",
    subtitle: "This meeting starts at 11:00 AM today",
    company: "Koro Ireland",
    action: "Prepare",
    badge: null
  }, {
    type: "reach-out",
    title: "Reach out to Gucci",
    subtitle: "They responded to your email",
    detail: null,
    company: "Gucci",
    action: "Review strategy",
    badge: null
  }, {
    type: "reply",
    title: "Reply to Alessandro Vieri",
    subtitle: "Contact responded to your email",
    detail: "Success Agent prepared a growth plan",
    company: "Sage",
    action: "Review plan",
    badge: null
  }, {
    type: "deal",
    title: "Deal stage: Ellen Chan",
    subtitle: "This deal is 16 days overdue for engagement",
    detail: "Outreach Agent wrote an email",
    company: "Patagonia",
    action: "Review email",
    badge: null
  }, {
    type: "reach-out",
    title: "Reach out to Trinity College",
    subtitle: "This portal has been identified as at risk of downgrade",
    detail: "Churn Agent prepared a save strategy",
    company: "Trinity College",
    action: "Review strategy",
    badge: null
  }, {
    type: "qbr",
    title: "Oatly is due a QBR",
    subtitle: "QBR overdue — last held 6 months ago.",
    company: "Oatly",
    action: "Prep for QBR",
    badge: {
      text: "Overdue",
      color: "magenta"
    }
  }, {
    type: "follow-up",
    title: "CD Company - P2 - High Value, Low Intent",
    subtitle: "Mia Kent just replied to your email Follow-up",
    company: "CD Company",
    action: "Send email",
    badge: {
      text: "Follow-up",
      color: "magenta"
    }
  }];
  const scheduleItems = [{
    time: "8:00 am",
    title: "One hour +",
    type: "Prepare",
    hasIcon: true
  }, {
    time: "9:00 am",
    title: "Training",
    type: null,
    hasIcon: false
  }, {
    time: "10:00 am",
    title: "Reach out to Gucci",
    type: "Suggested activity",
    hasIcon: true
  }, {
    time: "11:00 am",
    title: "Koro & HubSpot | Strategy Call",
    type: "Prepare",
    hasIcon: false
  }, {
    time: "12:00 pm",
    title: "Lunch block",
    type: null,
    hasIcon: false
  }, {
    time: "12:30 pm",
    title: "The Six & HubSpot",
    type: "Prepare",
    hasIcon: true
  }, {
    time: "1:30 pm",
    title: null,
    type: null,
    hasIcon: false
  }, {
    time: "2:00 pm",
    title: "Reach out to Ellen Chan at Pat...",
    type: "Suggested activity",
    hasIcon: true
  }, {
    time: "3:00 pm",
    title: "Valley Forge & HubSpot",
    type: "Prepare",
    hasIcon: true
  }, {
    time: "4:00 pm",
    title: "Reach out to Trinity College",
    type: "Suggested activity",
    hasIcon: true
  }];
  return <Layout>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-fill-surface-recessed overflow-hidden">
        <WorkspaceHeader activeTab="summary" />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="max-w-[1440px] mx-auto px-6 py-6">
          <div className="flex gap-4">
            {/* Left Section: Actions Queue */}
            <div className="flex-1">
              <Card className="p-0 overflow-hidden">
                {/* Actions Header */}
                <div className="p-4 border-b border-core-subtle flex items-center gap-3">
                  <button className="px-3 py-2 bg-fill-primary text-primary-foreground rounded-100 body-125 flex items-center gap-2">
                    All actions
                    <span className="bg-trellis-neutral-800 text-primary-foreground px-2 py-0.5 rounded-full detail-100">
                      7
                    </span>
                  </button>
                  <button className="px-3 py-2 bg-trellis-neutral-100 rounded-100 body-100 text-foreground flex items-center gap-2">
                    Prospecting
                    <span className="bg-trellis-neutral-300 px-2 py-0.5 rounded-full detail-100">
                      5
                    </span>
                  </button>
                  <button className="px-3 py-2 bg-trellis-neutral-100 rounded-100 body-100 text-foreground flex items-center gap-2">
                    Selling
                    <span className="bg-trellis-neutral-300 px-2 py-0.5 rounded-full detail-100">
                      2
                    </span>
                  </button>
                </div>

                {/* Action Items List */}
                <div className="divide-y divide-core-subtle">
                  {actionItems.map((item, index) => <div key={index} className="p-4 hover:bg-trellis-neutral-100 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {item.type === "deal" && <CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
                            {item.type === "reach-out" && <Triangle className="h-4 w-4 text-muted-foreground" />}
                            {item.type === "reply" && <List className="h-4 w-4 text-muted-foreground" />}
                            {item.type === "qbr" && <CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
                            {item.type === "follow-up" && <Mail className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="body-125 text-foreground mb-1">{item.title}</div>
                            <div className="detail-200 text-muted-foreground mb-1">{item.subtitle}</div>
                            {item.detail && <div className="detail-200 text-trellis-magenta-900 mb-2">
                                {item.detail}
                              </div>}
                            <div className="body-125 text-foreground">{item.company}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && <span className="px-2 py-1 rounded-full border border-trellis-magenta-900 text-trellis-magenta-800 detail-100 whitespace-nowrap">
                              {item.badge.text}
                            </span>}
                          <Button variant="secondary-alt" size="small" className="whitespace-nowrap">
                            {item.action}
                          </Button>
                          <Button variant="transparent" size="extra-small" className="p-1">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>)}
                </div>
              </Card>
            </div>

            {/* Right Section: Activity Feed, Schedule, and Key Metrics */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Activity Feed */}
              <Card className="p-4">
                <h2 className="heading-200 text-foreground mb-4">Activity Feed</h2>
                
                {/* Tabs */}
                <div className="flex gap-4 mb-4 border-b border-core-subtle">
                  {(["prospects", "agents", "team"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActivityTab(tab)}
                      className={`pb-2 px-1 border-b-2 ${activityTab === tab ? "border-primary body-125 text-foreground" : "border-transparent body-100 text-muted-foreground hover:text-foreground"}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Activity Items */}
                {activityTab === "prospects" && (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className="space-y-2">
                        <div className="h-3 bg-trellis-orange-400 rounded w-1/4"></div>
                        <div className="h-16 bg-trellis-orange-200 rounded"></div>
                      </div>)}
                  </div>
                )}

                {activityTab === "agents" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-core-subtle bg-card">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-0.5 h-8 w-8 rounded-full bg-trellis-magenta-200 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-trellis-magenta-900" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="body-125 text-foreground">Innovation Corp - New Deal</div>
                            <div className="detail-200 text-muted-foreground mt-0.5">Demo generator has created a portal for your upcoming demo.</div>
                          </div>
                        </div>
                        <Button variant="secondary-alt" size="small" className="whitespace-nowrap">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activityTab === "team" && (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className="space-y-2">
                        <div className="h-3 bg-trellis-orange-400 rounded w-1/4"></div>
                        <div className="h-16 bg-trellis-orange-200 rounded"></div>
                      </div>)}
                  </div>
                )}
              </Card>

              {/* Top Row: Schedule and Key Metrics */}
              <div className="flex gap-4">
                {/* Schedule */}
                <div className="flex-1">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="heading-200 text-foreground">Today, Jul 31</h2>
                      <div className="flex gap-2">
                        <Button variant="secondary-alt" size="extra-small" className="p-2">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary-alt" size="extra-small" className="p-2">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-core-subtle">
                      {scheduleItems.map((item, index) => <div key={index} className="flex items-start gap-0 py-3">
                          <div className="detail-100 text-muted-foreground w-[56px] flex-shrink-0 pt-3">
                            {item.time}
                          </div>
                          {item.title ? <div className={`flex-1 p-3 rounded-lg ${item.type === "Suggested activity" ? "border border-dashed border-trellis-magenta-800 bg-card" : "bg-trellis-neutral-100"}`}>
                              <div className="flex items-center gap-2 mb-2">
                                {item.hasIcon ? <List className="h-4 w-4 text-foreground" /> : <Calendar className="h-4 w-4 text-foreground" />}
                                <span className="heading-25 text-foreground">{item.title}</span>
                              </div>
                              {item.type && <div className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 text-trellis-magenta-900" />
                                  <span className="heading-25 text-trellis-magenta-900">{item.type}</span>
                                </div>}
                            </div> : <div className="flex-1"></div>}
                        </div>)}
                    </div>
                  </Card>
                </div>

                {/* Key Metrics */}
                <div className="flex-1">
                  <Card className="p-4">
                    <h2 className="heading-200 text-foreground mb-4">Key Metrics</h2>
                    
                    <div className="space-y-6">
                      {/* Stacked Bar Chart */}
                      <div className="h-48">
                        <ChartContainer config={{
                        value1: {
                          label: "Category 1",
                          color: "#48d1cf"
                        },
                        value2: {
                          label: "Category 2",
                          color: "#ffa581"
                        }
                      }} className="h-full w-full">
                          <BarChart data={barChartData}>
                            <XAxis dataKey="name" />
                            <Bar dataKey="value1" stackId="a" fill="#48d1cf" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="value2" stackId="a" fill="#ffa581" radius={[4, 4, 0, 0]} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </BarChart>
                        </ChartContainer>
                      </div>

                      {/* Area Chart */}
                      <div className="h-40">
                        <ChartContainer config={{
                        value: {
                          label: "Value",
                          color: "#ffa581"
                        }
                      }} className="h-full w-full">
                          <AreaChart data={areaChartData}>
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffa581" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ffa581" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#ffa581" fillOpacity={1} fill="url(#colorValue)" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </AreaChart>
                        </ChartContainer>
                      </div>

                      {/* Stream Chart */}
                      <div className="h-40">
                        <ChartContainer config={{
                        cat1: {
                          label: "Category 1",
                          color: "#9778ec"
                        },
                        cat2: {
                          label: "Category 2",
                          color: "#d20688"
                        },
                        cat3: {
                          label: "Category 3",
                          color: "#fb31a7"
                        },
                        cat4: {
                          label: "Category 4",
                          color: "#ffa581"
                        }
                      }} className="h-full w-full">
                          <AreaChart data={streamChartData}>
                            <Area type="monotone" dataKey="cat1" stackId="1" stroke="#9778ec" fill="#9778ec" />
                            <Area type="monotone" dataKey="cat2" stackId="1" stroke="#d20688" fill="#d20688" />
                            <Area type="monotone" dataKey="cat3" stackId="1" stroke="#fb31a7" fill="#fb31a7" />
                            <Area type="monotone" dataKey="cat4" stackId="1" stroke="#ffa581" fill="#ffa581" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </AreaChart>
                        </ChartContainer>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>;
};
export default SalesWorkspace;