import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";
import { useCyclePath } from "@/hooks/useCyclePath";
interface WorkspaceHeaderProps {
  activeTab?: "summary" | "prospecting" | "deals" | "tasks" | "agents" | "performance";
  hideTabs?: boolean;
  hideTitle?: boolean;
  subtitle?: ReactNode;
  backLink?: { to: string; label: string };
  title?: string;
}
const WorkspaceHeader = ({
  activeTab = "summary",
  hideTabs = false,
  hideTitle = false,
  subtitle,
  backLink,
  title
}: WorkspaceHeaderProps) => {
  const { cyclePath } = useCyclePath();
  const tabs = [{
    id: "summary",
    label: "Summary",
    path: cyclePath("/summary")
  }, {
    id: "prospecting",
    label: "Prospecting",
    path: cyclePath("/prospecting")
  }, {
    id: "deals",
    label: "Deals",
    path: cyclePath("/deals")
  }, {
    id: "tasks",
    label: "Tasks",
    path: "#"
  }, {
    id: "agents",
    label: "Agents",
    path: cyclePath("/agents")
  }, {
    id: "performance",
    label: "Performance",
    path: cyclePath("/dashboard")
  }];
  if (backLink) {
    return (
      <div className="sticky top-0 z-30 bg-card border-b border-core-subtle" onWheel={(e) => e.stopPropagation()}>
        <div className="pl-12 pr-6 pt-6 pb-6">
          <Link
            to={backLink.to}
            className="inline-flex items-center gap-1 body-100 text-muted-foreground hover:text-foreground mb-3"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{backLink.label}</span>
          </Link>
          {title && <h1 className="heading-300">{title}</h1>}
          {subtitle && <div className="mt-2">{subtitle}</div>}
        </div>
      </div>
    );
  }

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