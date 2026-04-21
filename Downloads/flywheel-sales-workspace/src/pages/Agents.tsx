import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const agentsData = [
  {
    id: "cold-call-prep",
    name: "Cold call prep",
    summary: "1 New Power Hour Session  •  50 new contacts with talking points",
  },
  {
    id: "sequencing",
    name: "Sequencing",
    summary: "50 new contacts enrolled  •  20 sequence mails delivered yesterday",
  },
  {
    id: "prospecting-strategist",
    name: "Prospecting strategist",
    summary: "3 new plays for this month  •  5 new accounts with strategies to review",
  },
  {
    id: "sales-coach",
    name: "Sales Coach",
    summary: "2 coaching moments identified",
  },
];

const Agents = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="flex flex-col h-screen overflow-hidden">
        <WorkspaceHeader activeTab="agents" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 gap-6 max-w-[1200px]">
            {agentsData.map((agent) => (
              <Card key={agent.id} className="p-6 flex flex-col gap-4 border-core-subtle">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-muted" />
                    <h3 className="heading-200">{agent.name}</h3>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Settings size={18} />
                  </button>
                </div>

                {/* Skeleton placeholder lines */}
                <div className="flex flex-col gap-2">
                  <div className="h-2.5 w-full rounded bg-muted" />
                  <div className="h-2.5 w-full rounded bg-muted" />
                  <div className="h-2.5 w-3/5 rounded bg-muted" />
                </div>

                {/* Summary */}
                <p className="body-100 text-muted-foreground">{agent.summary}</p>

                {/* Review button */}
                <div>
                  <Button variant="outline" size="sm" className="body-100" onClick={() => navigate(`/agents/${agent.id}`)}>
                    Review
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Agents;
