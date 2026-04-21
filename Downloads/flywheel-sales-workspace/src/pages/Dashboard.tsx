import { useState } from "react";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine, BarChart, Cell, LabelList } from "recharts";
import { activityWeeklyData, contactsEngagedData, outreachByPersonaData, p1StatusData, speedDepthData, p2DepthData, p3ChannelMixData, mrrResultsData, mrrTarget, pipelineWeeklyData, pipelineTarget, salesReps } from "@/data/teamPerformanceData";
const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState("this-month");
  const [selectedRep, setSelectedRep] = useState("all");

  // Activity targets for traffic light system
  const ACTIVITY_TARGETS = {
    calls: { target: 60, nearThreshold: 54 },      // 90% of 60
    p2sTouched: { target: 25, nearThreshold: 23 }, // 90% of 25
    igaMeetings: { target: 3, nearThreshold: 3 }   // 90% of 3 rounds to 3, so amber at 2
  };

  // Traffic light colors
  const TRAFFIC_COLORS = {
    green: '#EDF4EF',  // Hit target
    amber: '#FCF6E6',  // Nearly hit target
    red: '#FCECE9'     // Missed target
  };

  // Helper to get traffic light color based on value and metric type
  const getActivityColor = (value: number, metricType: 'calls' | 'p2sTouched' | 'igaMeetings') => {
    const { target, nearThreshold } = ACTIVITY_TARGETS[metricType];
    if (value >= target) return TRAFFIC_COLORS.green;
    if (value >= nearThreshold) return TRAFFIC_COLORS.amber;
    return TRAFFIC_COLORS.red;
  };

  // Format currency for pipeline
  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  // Shorten rep names for charts
  const shortenName = (name: string) => {
    const parts = name.split(" ");
    return parts[0].charAt(0) + ". " + parts[1];
  };

  // Get selected rep name for filtering
  const selectedRepName = selectedRep === "all" 
    ? null 
    : salesReps.find(r => r.id === selectedRep)?.name ?? null;

  // Filter function to apply rep filter
  const filterByRep = <T extends { repName: string }>(data: T[]): T[] => {
    if (!selectedRepName) return data;
    return data.filter(d => d.repName === selectedRepName);
  };

  // Prepare data for charts with shortened names and filtering
  const pipelineChartData = filterByRep(pipelineWeeklyData).map(d => ({
    ...d,
    shortName: shortenName(d.repName),
    total: d.week1 + d.week2 + d.week3 + d.week4
  }));
  const mrrChartData = filterByRep(mrrResultsData).map(d => ({
    ...d,
    shortName: shortenName(d.repName),
    total: d.week1 + d.week2 + d.week3 + d.week4
  }));
  const p1StatusChartData = filterByRep(p1StatusData).map(d => ({
    ...d,
    shortName: shortenName(d.repName)
  }));
  const speedDepthChartData = filterByRep(speedDepthData).map(d => ({
    ...d,
    shortName: shortenName(d.repName)
  }));
  const p3ChartData = filterByRep(p3ChannelMixData).map(d => ({
    ...d,
    shortName: shortenName(d.repName)
  }));
  const outreachChartData = filterByRep(outreachByPersonaData).map(d => ({
    ...d,
    shortName: shortenName(d.repName)
  }));
  
  // Filter activity data
  const filteredActivityData = filterByRep(activityWeeklyData);
  const filteredP2DepthData = filterByRep(p2DepthData);
  return <Layout>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-[var(--color-fill-surface-recessed)] overflow-hidden">
        <WorkspaceHeader activeTab="performance" />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-6 py-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-300 text-[var(--color-text-core-default)]">Team Performance</h2>
              <div className="flex items-center gap-3">
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedRep} onValueChange={setSelectedRep}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Rep" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reps</SelectItem>
                    {salesReps.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>{rep.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section 1: The Pulse */}
            <Card className="p-6 mb-6 bg-card border border-border">
              <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">RPA</h3>
              
              {/* Results and Pipeline Charts - 2 columns */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Chart 1: Results (MRR by Week) */}
                <div>
                  <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">Results</h5>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mrrChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-core-subtle)" />
                        <XAxis dataKey="shortName" tick={{
                        fontSize: 11,
                        fill: "var(--color-text-core-subtle)"
                      }} tickLine={false} />
                        <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{
                        fontSize: 11,
                        fill: "var(--color-text-core-subtle)"
                      }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{
                        backgroundColor: "var(--color-fill-surface-default)",
                        border: "1px solid var(--color-border-container-default)",
                        borderRadius: "4px"
                      }} formatter={(value: number, name: string) => {
                        const weekLabels: Record<string, string> = {
                          week1: "Week 1",
                          week2: "Week 2",
                          week3: "Week 3",
                          week4: "Week 4"
                        };
                        return [`$${value.toLocaleString()}`, weekLabels[name] || name];
                      }} />
                        <Legend />
                        <ReferenceLine y={mrrTarget} stroke="var(--color-text-core-default)" strokeDasharray="5 5" strokeWidth={2} label={{
                        value: "Target",
                        position: "right",
                        fill: "var(--color-text-core-subtle)",
                        fontSize: 11
                      }} />
                        <Bar dataKey="week1" name="Week 1" stackId="a" fill="var(--trellis-color-blue-800)" />
                        <Bar dataKey="week2" name="Week 2" stackId="a" fill="var(--trellis-color-blue-600)" />
                        <Bar dataKey="week3" name="Week 3" stackId="a" fill="var(--trellis-color-blue-400)" />
                        <Bar dataKey="week4" name="Week 4" stackId="a" fill="var(--trellis-color-neutral-600)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Pipeline */}
                <div>
                  <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">Pipeline</h5>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pipelineChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-core-subtle)" />
                        <XAxis dataKey="shortName" tick={{
                        fontSize: 11,
                        fill: "var(--color-text-core-subtle)"
                      }} tickLine={false} />
                        <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{
                        fontSize: 11,
                        fill: "var(--color-text-core-subtle)"
                      }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{
                        backgroundColor: "var(--color-fill-surface-default)",
                        border: "1px solid var(--color-border-container-default)",
                        borderRadius: "4px"
                      }} formatter={(value: number, name: string) => {
                        const weekLabels: Record<string, string> = {
                          week1: "Week 1",
                          week2: "Week 2",
                          week3: "Week 3",
                          week4: "Week 4"
                        };
                        return [`$${value.toLocaleString()}`, weekLabels[name] || name];
                      }} />
                        <Legend />
                        <ReferenceLine y={pipelineTarget} stroke="var(--color-text-core-default)" strokeDasharray="5 5" strokeWidth={2} label={{
                        value: "Target",
                        position: "right",
                        fill: "var(--color-text-core-subtle)",
                        fontSize: 11
                      }} />
                        <Bar dataKey="week1" name="Week 1" stackId="a" fill="var(--trellis-color-purple-800)" />
                        <Bar dataKey="week2" name="Week 2" stackId="a" fill="var(--trellis-color-purple-600)" />
                        <Bar dataKey="week3" name="Week 3" stackId="a" fill="var(--trellis-color-purple-400)" />
                        <Bar dataKey="week4" name="Week 4" stackId="a" fill="var(--trellis-color-neutral-600)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Activity Heatmap - Full Width */}
              <div>
                <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">Activity</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th rowSpan={2} className="text-left py-2 px-2 body-50 text-[var(--color-text-core-subtle)] font-medium">
                          Rep
                        </th>
                        <th colSpan={3} className="text-center py-2 px-1 body-50 text-[var(--color-text-core-subtle)] font-medium border-l border-[var(--color-border-core-subtle)]">
                          Week 1
                        </th>
                        <th colSpan={3} className="text-center py-2 px-1 body-50 text-[var(--color-text-core-subtle)] font-medium border-l border-[var(--color-border-core-subtle)]">
                          Week 2
                        </th>
                        <th colSpan={3} className="text-center py-2 px-1 body-50 text-[var(--color-text-core-subtle)] font-medium border-l border-[var(--color-border-core-subtle)]">
                          Week 3
                        </th>
                        <th colSpan={3} className="text-center py-2 px-1 body-50 text-[var(--color-text-core-subtle)] font-medium border-l border-[var(--color-border-core-subtle)]">
                          Week 4
                        </th>
                      </tr>
                      <tr className="border-b border-[var(--color-border-core-subtle)]">
                        {/* Week 1 labels */}
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal border-l border-[var(--color-border-core-subtle)]">Calls</th>
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal">P2s</th>
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal">IGA</th>
                        {/* Week 2 labels */}
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal border-l border-[var(--color-border-core-subtle)]">Calls</th>
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal">P2s</th>
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal">IGA</th>
                        {/* Week 3 labels */}
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal border-l border-[var(--color-border-core-subtle)]">Calls</th>
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal">P2s</th>
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal">IGA</th>
                        {/* Week 4 labels */}
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal border-l border-[var(--color-border-core-subtle)]">Calls</th>
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal">P2s</th>
                        <th className="text-center py-1 px-1 body-50 text-[var(--color-text-core-subtle)] font-normal">IGA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActivityData.map((rep, repIdx) => <tr key={rep.repName} className={repIdx > 0 ? "border-t border-[var(--color-border-core-subtle)]" : ""}>
                          <td className="py-2 px-2 body-50 text-[var(--color-text-core-default)]">
                            {shortenName(rep.repName)}
                          </td>
                          {/* Week 1 - Calls, P2s Touched, IGA */}
                          <td className="py-1 px-1 text-center border-l border-[var(--color-border-core-subtle)]">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.calls.week1, 'calls')
                        }}>
                              {rep.calls.week1}
                            </span>
                          </td>
                          <td className="py-1 px-1 text-center">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.p2sTouched.week1, 'p2sTouched')
                        }}>
                              {rep.p2sTouched.week1}
                            </span>
                          </td>
                          <td className="py-1 px-1 text-center">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.igaMeetings.week1, 'igaMeetings')
                        }}>
                              {rep.igaMeetings.week1}
                            </span>
                          </td>
                          {/* Week 2 - Calls, P2s Touched, IGA */}
                          <td className="py-1 px-1 text-center border-l border-[var(--color-border-core-subtle)]">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.calls.week2, 'calls')
                        }}>
                              {rep.calls.week2}
                            </span>
                          </td>
                          <td className="py-1 px-1 text-center">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.p2sTouched.week2, 'p2sTouched')
                        }}>
                              {rep.p2sTouched.week2}
                            </span>
                          </td>
                          <td className="py-1 px-1 text-center">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.igaMeetings.week2, 'igaMeetings')
                        }}>
                              {rep.igaMeetings.week2}
                            </span>
                          </td>
                          {/* Week 3 - Calls, P2s Touched, IGA */}
                          <td className="py-1 px-1 text-center border-l border-[var(--color-border-core-subtle)]">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.calls.week3, 'calls')
                        }}>
                              {rep.calls.week3}
                            </span>
                          </td>
                          <td className="py-1 px-1 text-center">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.p2sTouched.week3, 'p2sTouched')
                        }}>
                              {rep.p2sTouched.week3}
                            </span>
                          </td>
                          <td className="py-1 px-1 text-center">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.igaMeetings.week3, 'igaMeetings')
                        }}>
                              {rep.igaMeetings.week3}
                            </span>
                          </td>
                          {/* Week 4 - Calls, P2s Touched, IGA */}
                          <td className="py-1 px-1 text-center border-l border-[var(--color-border-core-subtle)]">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.calls.week4, 'calls')
                        }}>
                              {rep.calls.week4}
                            </span>
                          </td>
                          <td className="py-1 px-1 text-center">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.p2sTouched.week4, 'p2sTouched')
                        }}>
                              {rep.p2sTouched.week4}
                            </span>
                          </td>
                          <td className="py-1 px-1 text-center">
                            <span className="inline-flex w-8 h-6 rounded items-center justify-center body-50 text-[var(--color-text-core-default)]" style={{
                          backgroundColor: getActivityColor(rep.igaMeetings.week4, 'igaMeetings')
                        }}>
                              {rep.igaMeetings.week4}
                            </span>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Section 2: Quality & Depth */}
            <Card className="p-6 mb-6 bg-card border border-border">
              <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">Quality & Depth</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Contacts Engaged (Box Plot Style) */}
                <div>
                  <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">Avg. Contacts Engaged per Company</h5>
                  <div className="space-y-3">
                    {contactsEngagedData.map(rep => <div key={rep.repName} className="flex items-center gap-3">
                        <span className="w-20 body-50 text-[var(--color-text-core-default)] truncate">
                          {shortenName(rep.repName)}
                        </span>
                        <div className="flex-1 h-6 relative bg-[var(--color-fill-surface-recessed)] rounded">
                          {/* Average bar */}
                          <div className="h-full bg-[var(--trellis-color-purple-800)] rounded" style={{
                        width: `${rep.average / 8 * 100}%`
                      }} />
                        </div>
                        <span className="w-8 body-50 text-[var(--color-text-core-subtle)] text-right">
                          {rep.average.toFixed(1)}
                        </span>
                      </div>)}
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[var(--color-border-core-subtle)]">
                      <span className="w-20" />
                      <div className="flex-1 flex justify-between body-50 text-[var(--color-text-core-subtle)]">
                        <span>0</span>
                        <span>4</span>
                        <span>8</span>
                      </div>
                      <span className="w-8" />
                    </div>
                  </div>
                </div>

                {/* Right: Outreach by Persona (100% Stacked Bar) */}
                <div>
                  <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">Outreach by Persona</h5>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={outreachChartData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-core-subtle)" />
                        <XAxis dataKey="shortName" tick={{
                        fontSize: 11,
                        fill: "var(--color-text-core-subtle)"
                      }} tickLine={false} />
                        <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{
                        fontSize: 11,
                        fill: "var(--color-text-core-subtle)"
                      }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{
                        backgroundColor: "var(--color-fill-surface-default)",
                        border: "1px solid var(--color-border-container-default)",
                        borderRadius: "4px"
                      }} formatter={(value: number) => [`${value}%`]} />
                        <Legend />
                        <Bar dataKey="decisionMaker" name="Decision Maker" stackId="a" fill="var(--trellis-color-green-800)" />
                        <Bar dataKey="influencer" name="Influencer" stackId="a" fill="var(--trellis-color-blue-600)" />
                        <Bar dataKey="other" name="Other" stackId="a" fill="var(--trellis-color-neutral-500)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 3: BoB Execution (SLA Adherence) */}
            <Card className="p-6 mb-6 bg-card border border-border">
              <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">Book of Business Engagement</h3>

              {/* Row 1: P1 High Priority */}
              <div className="mb-6">
                
                <div className="flex flex-col gap-6">
                  {/* P1 Current Status */}
                  <div>
                    <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">P1 Status</h5>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={p1StatusChartData} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-core-subtle)" />
                          <XAxis dataKey="shortName" tick={{
                          fontSize: 10,
                          fill: "var(--color-text-core-subtle)"
                        }} tickLine={false} />
                          <YAxis tick={{
                          fontSize: 11,
                          fill: "var(--color-text-core-subtle)"
                        }} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{
                          backgroundColor: "var(--color-fill-surface-default)",
                          border: "1px solid var(--color-border-container-default)",
                          borderRadius: "4px"
                        }} />
                          <Legend wrapperStyle={{
                          fontSize: "11px"
                        }} />
                          <Bar dataKey="overSLA" name="Over SLA" stackId="a" fill="var(--trellis-color-red-800)" />
                          <Bar dataKey="unworked" name="Unworked" stackId="a" fill="var(--trellis-color-yellow-500)" />
                          <Bar dataKey="inProgress" name="In Progress" stackId="a" fill="var(--trellis-color-green-600)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Speed vs Depth Scatter */}
                  <div>
                    <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">P1 Speed vs. Depth</h5>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-core-subtle)" />
                          <XAxis type="number" dataKey="speed" name="Speed" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{
                          fontSize: 11,
                          fill: "var(--color-text-core-subtle)"
                        }} tickLine={false} label={{
                          value: "Speed (% contacted < 24hrs)",
                          position: "bottom",
                          offset: -5,
                          style: {
                            fontSize: 11,
                            fill: "var(--color-text-core-subtle)"
                          }
                        }} />
                          <YAxis type="number" dataKey="depth" name="Depth" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{
                          fontSize: 11,
                          fill: "var(--color-text-core-subtle)"
                        }} tickLine={false} axisLine={false} width={70} label={{
                          value: "Depth (% with 5 touches/14d)",
                          angle: -90,
                          position: "insideLeft",
                          dx: 15,
                          style: {
                            fontSize: 11,
                            fill: "var(--color-text-core-subtle)",
                            textAnchor: "middle"
                          }
                        }} />
                          <ReferenceLine x={50} stroke="var(--color-border-core-subtle)" strokeDasharray="3 3" />
                          <ReferenceLine y={50} stroke="var(--color-border-core-subtle)" strokeDasharray="3 3" />
                          <Tooltip contentStyle={{
                          backgroundColor: "var(--color-fill-surface-default)",
                          border: "1px solid var(--color-border-container-default)",
                          borderRadius: "4px"
                        }} formatter={(value: number, name: string) => [`${value}%`, name]} labelFormatter={label => speedDepthChartData.find(d => d.speed === label)?.repName} />
                          <Scatter data={speedDepthChartData} fill="var(--trellis-color-purple-800)">
                            {speedDepthChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.speed >= 50 && entry.depth >= 50 ? "var(--trellis-color-green-800)" : "var(--trellis-color-purple-800)"} />)}
                            <LabelList dataKey="shortName" position="top" offset={8} style={{
                            fontSize: 10,
                            fill: "var(--color-text-core-default)"
                          }} />
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: P2 & P3 */}
              <div className="flex flex-col gap-6">
                {/* Left: P2 Depth */}
                <div>
                  <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">P2 Depth (10 touches / 90 days)</h5>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={filteredP2DepthData.map(rep => ({ ...rep, shortName: shortenName(rep.repName) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-core-subtle)" />
                        <XAxis dataKey="shortName" tick={{
                          fontSize: 11,
                          fill: "var(--color-text-core-subtle)"
                        }} tickLine={false} />
                        <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{
                          fontSize: 11,
                          fill: "var(--color-text-core-subtle)"
                        }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{
                          backgroundColor: "var(--color-fill-surface-default)",
                          border: "1px solid var(--color-border-container-default)",
                          borderRadius: "4px"
                        }} formatter={(value: number) => [`${value}%`, "Depth"]} />
                        <ReferenceLine y={80} stroke="var(--color-text-core-default)" strokeDasharray="4 4" label={{
                          value: "Goal: 80%",
                          position: "right",
                          fontSize: 11,
                          fill: "var(--color-text-core-subtle)"
                        }} />
                        <Bar dataKey="depthPercent" radius={[4, 4, 0, 0]}>
                          {filteredP2DepthData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.depthPercent >= 80 ? "var(--trellis-color-green-600)" : entry.depthPercent >= 60 ? "var(--trellis-color-yellow-500)" : "var(--trellis-color-red-500)"} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: P3 Channel Mix - Scatter Plot */}
                <div>
                  <h5 className="body-50 text-[var(--color-text-core-subtle)] mb-2">P3 Channel Mix & Volume</h5>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-core-subtle)" />
                        <XAxis 
                          type="number" 
                          dataKey="channelCompliance" 
                          name="Call + Email" 
                          domain={[0, 100]} 
                          tickFormatter={v => `${v}%`}
                          tick={{ fontSize: 11, fill: "var(--color-text-core-subtle)" }} 
                          tickLine={false}
                          label={{ value: "Call + Email", position: "bottom", offset: 0, fontSize: 11, fill: "var(--color-text-core-subtle)" }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="volumeCompliance" 
                          name="4 Touches in 14 Days" 
                          domain={[0, 100]} 
                          tickFormatter={v => `${v}%`}
                          tick={{ fontSize: 11, fill: "var(--color-text-core-subtle)" }} 
                          tickLine={false} 
                          axisLine={false}
                          width={70}
                          label={{ value: "4 Touches in 14 Days", angle: -90, position: "insideLeft", dx: 15, fontSize: 11, fill: "var(--color-text-core-subtle)", style: { textAnchor: "middle" } }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "var(--color-fill-surface-default)",
                            border: "1px solid var(--color-border-container-default)",
                            borderRadius: "4px"
                          }} 
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          labelFormatter={(label) => p3ChartData.find(d => d.channelCompliance === label)?.repName}
                        />
                        <Scatter data={p3ChartData} fill="var(--trellis-color-teal-600)">
                          <LabelList dataKey="shortName" position="top" offset={8} style={{ fontSize: 10, fill: "var(--color-text-core-default)" }} />
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>;
};
export default Dashboard;