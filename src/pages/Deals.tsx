import { useState } from "react";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import DealsSubNav from "@/components/DealsSubNav";
import DealCard from "@/components/DealCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutGrid, Columns, List, ChevronDown } from "lucide-react";
import { dealsData } from "@/data/dealsData";

const Deals = () => {
  const [isSubNavCollapsed, setIsSubNavCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<"card" | "column" | "list">("card");

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-48px)] overflow-hidden">
        <WorkspaceHeader activeTab="deals" />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sub-Nav */}
          <DealsSubNav
            isCollapsed={isSubNavCollapsed}
            onCollapse={() => setIsSubNavCollapsed(!isSubNavCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-background">
            {/* Chart Placeholders */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Chart 1 - Horizontal bars */}
              <Card className="border border-core-subtle bg-card p-4 h-[140px] flex flex-col justify-center gap-2">
                <div className="flex gap-1 items-center">
                  <div className="h-4 w-24 bg-trellis-teal-600 rounded-sm" />
                  <div className="h-4 w-16 bg-trellis-orange-500 rounded-sm" />
                </div>
                <div className="flex gap-1 items-center">
                  <div className="h-4 w-20 bg-trellis-teal-600 rounded-sm" />
                  <div className="h-4 w-28 bg-trellis-orange-500 rounded-sm" />
                </div>
                <div className="flex gap-1 items-center">
                  <div className="h-4 w-12 bg-trellis-teal-600 rounded-sm" />
                  <div className="h-4 w-8 bg-trellis-orange-500 rounded-sm" />
                </div>
              </Card>

              {/* Chart 2 - Area chart placeholder */}
              <Card className="border border-core-subtle bg-card p-4 h-[140px] flex items-end">
                <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M0,70 Q30,60 50,50 T100,30 T150,45 T200,20"
                    fill="none"
                    stroke="var(--trellis-color-teal-600)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,70 Q30,60 50,50 T100,30 T150,45 T200,20 L200,80 L0,80 Z"
                    fill="var(--trellis-color-teal-200)"
                    opacity="0.5"
                  />
                </svg>
              </Card>

              {/* Chart 3 - Stacked bars */}
              <Card className="border border-core-subtle bg-card p-4 h-[140px] flex flex-col justify-center gap-2">
                <div className="flex gap-1 items-center">
                  <div className="h-3 w-20 bg-trellis-purple-600 rounded-sm" />
                  <div className="h-3 w-24 bg-trellis-purple-300 rounded-sm" />
                </div>
                <div className="flex gap-1 items-center">
                  <div className="h-3 w-28 bg-trellis-orange-500 rounded-sm" />
                  <div className="h-3 w-16 bg-trellis-orange-300 rounded-sm" />
                </div>
              </Card>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between mb-6">
              {/* Dropdown */}
              <Button variant="outline" size="small" className="gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-16 bg-trellis-teal-600 rounded-full" />
                  <div className="h-2 w-8 bg-trellis-purple-500 rounded-full" />
                </div>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {/* View Toggles */}
              <div className="flex items-center border border-core-subtle rounded-transitional-component overflow-hidden">
                <button
                  onClick={() => setActiveView("card")}
                  className={`p-2 transition-colors ${
                    activeView === "card"
                      ? "bg-trellis-neutral-200"
                      : "bg-card hover:bg-trellis-neutral-100"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4 text-foreground" />
                </button>
                <button
                  onClick={() => setActiveView("column")}
                  className={`p-2 border-x border-core-subtle transition-colors ${
                    activeView === "column"
                      ? "bg-trellis-neutral-200"
                      : "bg-card hover:bg-trellis-neutral-100"
                  }`}
                >
                  <Columns className="h-4 w-4 text-foreground" />
                </button>
                <button
                  onClick={() => setActiveView("list")}
                  className={`p-2 transition-colors ${
                    activeView === "list"
                      ? "bg-trellis-neutral-200"
                      : "bg-card hover:bg-trellis-neutral-100"
                  }`}
                >
                  <List className="h-4 w-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Deal Cards */}
            <div>
              {dealsData.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Deals;
