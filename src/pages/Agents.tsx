import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrellisIcon, type TrellisIconName } from "@/components/ui/trellis-icon";
import { useNavigate } from "react-router-dom";
import { useCyclePath } from "@/hooks/useCyclePath";

const agentsData = [
  {
    id: "research",
    name: "Company Research Agent",
    description:
      "Your personal prospect researcher. Tell it what you want it to focus on and how to format its output.",
    stats: ["50 companies researched this week", "50 new contacts with talking points"],
    icon: "blogResearch" as TrellisIconName,
  },
  {
    id: "sequencing",
    name: "Sequencing Agent",
    description:
      "The agent that crafts your outreach. Customise it to your style.",
    stats: ["50 sequences created this week"],
    icon: "sequences" as TrellisIconName,
  },
];

const Agents = () => {
  const navigate = useNavigate();
  const { cyclePath } = useCyclePath();
  return (
    <Layout>
      <div className="flex flex-col h-[var(--page-content-height)] overflow-hidden">
        <WorkspaceHeader activeTab="agents" />
        <div
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: "var(--color-fill-surface-recessed)",
            padding: "48px",
          }}
        >
          <div className="flex gap-12 items-start">
            {agentsData.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onConfigure={() =>
                  navigate(cyclePath(`/agents/${agent.id}`))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface AgentCardProps {
  agent: (typeof agentsData)[number];
  onConfigure: () => void;
}

const AgentCard = ({ agent, onConfigure }: AgentCardProps) => {
  return (
    <Card className="flex flex-col gap-3 overflow-hidden p-6 border-[var(--color-border-core-subtle)] trellis-shadow-100 w-[650px]">
      <div className="flex items-center gap-2 py-0.5">
        <div
          className="flex items-center rounded p-1"
          style={{ backgroundColor: "var(--color-fill-secondary-default)" }}
        >
          <TrellisIcon name={agent.icon} size={24} />
        </div>
        <h2 className="heading-500">{agent.name}</h2>
      </div>

      <div className="flex flex-col gap-6">
        <p className="body-100" style={{ color: "var(--color-text-core-default)" }}>
          {agent.description}
        </p>

        <div className="flex items-center gap-3">
          {agent.stats.map((stat, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && (
                <span
                  className="rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: "var(--color-fill-primary-default)",
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                className="body-100 whitespace-nowrap"
                style={{ color: "var(--color-text-core-subtle)" }}
              >
                {stat}
              </span>
            </span>
          ))}
        </div>

        <div>
          <Button variant="primary" size="medium" onClick={onConfigure}>
            Configure
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Agents;
