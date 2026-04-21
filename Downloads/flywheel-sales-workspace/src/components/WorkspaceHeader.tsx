import { Link } from "react-router-dom";
import { ReactNode } from "react";
interface WorkspaceHeaderProps {
  activeTab?: "summary" | "prospecting" | "deals" | "tasks" | "agents" | "performance";
  hideTabs?: boolean;
  hideTitle?: boolean;
  subtitle?: ReactNode;
}
const WorkspaceHeader = ({
  activeTab = "summary",
  hideTabs = false,
  hideTitle = false,
  subtitle
}: WorkspaceHeaderProps) => {
  const tabs = [{
    id: "summary",
    label: "Summary",
    path: "/summary"
  }, {
    id: "prospecting",
    label: "Prospecting",
    path: "/prospecting"
  }, {
    id: "deals",
    label: "Deals",
    path: "/deals"
  }, {
    id: "tasks",
    label: "Tasks",
    path: "#"
  }, {
    id: "agents",
    label: "Agents",
    path: "/agents"
  }, {
    id: "performance",
    label: "Performance",
    path: "/dashboard"
  }];
  return <div className="sticky top-0 z-30 bg-card border-b border-core-subtle" onWheel={(e) => e.stopPropagation()}>
      <div className="pl-12 pr-6 pt-6">
        {!hideTitle && <h1 className="heading-300 mb-6">Sales Workspace | Olivia Smith</h1>}
        {subtitle && <div className="mb-4">{subtitle}</div>}
        
        {/* Navigation Tabs */}
        {!hideTabs && (
          <div className="border-b border-core-subtle">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <Link 
                  key={tab.id} 
                  to={tab.path} 
                  className={`pb-4 px-1 border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-foreground body-100 !font-bold" : "border-transparent body-100 text-muted-foreground hover:text-foreground hover:border-core-subtle"}`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>;
};
export default WorkspaceHeader;