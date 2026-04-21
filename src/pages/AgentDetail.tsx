import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const powerHourContacts = [
  { id: 1, name: "Olivia Carmichael" },
  { id: 2, name: "Amelia Shepherd" },
  { id: 3, name: "Marcus Chen" },
];

const AgentDetail = () => {
  const [activeTab, setActiveTab] = useState<"activity" | "configuration">("activity");

  return (
    <Layout>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header area */}
        <div className="bg-card border-b border-core-subtle px-8 pt-6 pb-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 body-100 text-muted-foreground mb-2">
            <Link to="/agents" className="hover:text-foreground text-primary">Agents</Link>
            <ChevronRight size={14} />
            <span>Cold call preparation</span>
          </div>
          <h1 className="heading-300 mb-6">Cold call preparation</h1>

          {/* Activity / Configuration tabs */}
          <div className="border-b border-core-subtle">
            <nav className="flex space-x-8">
              {(["activity", "configuration"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 border-b-2 transition-colors capitalize body-100 ${
                    activeTab === tab
                      ? "border-primary text-foreground !font-bold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-core-subtle"
                  }`}
                >
                  {tab === "activity" ? "Activity" : "Configuration"}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          {activeTab === "activity" ? (
            <div className="p-8">
              {/* Metric cards row */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {/* Chart card 1 - area chart placeholder */}
                <Card className="p-4 border-core-subtle">
                  <div className="h-2.5 w-3/5 rounded bg-muted mb-3" />
                  <div className="h-24 rounded bg-gradient-to-br from-[hsl(var(--primary)/0.2)] via-[hsl(var(--primary)/0.1)] to-[hsl(var(--accent)/0.15)]" />
                </Card>

                {/* Chart card 2 - line chart placeholder */}
                <Card className="p-4 border-core-subtle">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2.5 w-2/5 rounded bg-muted" />
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-positive-default)' }}>▲ 0.71%</span>
                  </div>
                  <div className="h-24 rounded bg-gradient-to-t from-[hsl(var(--primary)/0.08)] to-transparent relative overflow-hidden">
                    <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
                      <path d="M0,60 Q30,55 50,50 T100,40 T150,35 T200,30" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5"/>
                      <path d="M0,60 Q30,55 50,50 T100,40 T150,35 T200,30 L200,80 L0,80 Z" fill="hsl(var(--primary))" opacity="0.08"/>
                    </svg>
                  </div>
                </Card>

                {/* Big number card 1 */}
                <Card className="p-4 border-core-subtle flex flex-col">
                  <div className="h-2.5 w-3/5 rounded bg-muted mb-3" />
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-5xl font-light text-foreground">156</span>
                  </div>
                </Card>

                {/* Big number card 2 */}
                <Card className="p-4 border-core-subtle flex flex-col">
                  <div className="h-2.5 w-2/5 rounded bg-muted mb-3" />
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-5xl font-light text-foreground">23</span>
                  </div>
                </Card>
              </div>

              {/* Two-column content */}
              <div className="grid grid-cols-[1fr_1fr] gap-8">
                {/* Left: New power hour created */}
                <div>
                  <div className="flex items-center gap-4 mb-1">
                    <h2 className="heading-200">New power hour created</h2>
                    <button className="body-100 text-primary font-medium">+ Generate a new list</button>
                    <Button size="sm" className="body-100">Start Power Hour</Button>
                  </div>
                  <p className="body-100 text-muted-foreground mb-4">
                    These are the best 30 contacts you can call right now
                  </p>

                  <div className="flex flex-col gap-4">
                    {powerHourContacts.map((contact) => (
                      <ContactActivityCard key={contact.id} name={contact.name} />
                    ))}
                  </div>
                </div>

                {/* Right: New talking points added */}
                <div>
                  <h2 className="heading-200 mb-1">New talking points added</h2>
                  <p className="body-100 text-muted-foreground mb-4">
                    The agent has added talking points to these contacts in the last week.
                  </p>

                  {/* Talking points skeleton card */}
                  <Card className="p-5 border-core-subtle">
                    <div className="flex flex-col gap-2.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="h-2.5 rounded bg-muted" style={{ width: `${20 + Math.random() * 30}%` }} />
                          ))}
                        </div>
                      ))}
                    </div>
                    <button className="flex items-center gap-1 mx-auto mt-4 body-100 text-muted-foreground hover:text-foreground">
                      See more <ChevronDown size={14} />
                    </button>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <p className="body-100 text-muted-foreground">Configuration settings will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const ContactActivityCard = ({ name }: { name: string }) => {
  return (
    <Card className="p-5 border-core-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted" />
          <span className="body-100 font-semibold text-foreground">{name}</span>
        </div>
        <Button variant="outline" size="sm" className="body-100 gap-1">
          Actions <ChevronDown size={14} />
        </Button>
      </div>

      {/* Skeleton content lines */}
      <div className="flex flex-col gap-2.5 mb-2">
        <div className="flex gap-3">
          {[65, 45, 55, 40].map((w, i) => (
            <div key={i} className="h-2.5 rounded bg-muted" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="flex gap-3">
          {[50, 60, 35, 55].map((w, i) => (
            <div key={i} className="h-2.5 rounded bg-muted" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="h-2.5 w-full rounded bg-muted" />
      </div>

      <button className="flex items-center gap-1 mx-auto mt-3 body-100 text-muted-foreground hover:text-foreground">
        See more <ChevronDown size={14} />
      </button>
    </Card>
  );
};

export default AgentDetail;
