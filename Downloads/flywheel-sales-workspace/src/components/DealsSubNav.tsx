import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, Copy } from "lucide-react";

interface DealsSubNavProps {
  onCollapse?: () => void;
  isCollapsed?: boolean;
}

const DealsSubNav = ({ onCollapse, isCollapsed = false }: DealsSubNavProps) => {
  const [activeItem, setActiveItem] = useState("all-deals");

  const navItems = [
  { id: "all-deals", label: "All deals" },
  { id: "needs-attention", label: "Needs attention" },
  { id: "pending-follow-up", label: "Pending follow-up" },
  { id: "upcoming-meetings", label: "Upcoming meetings" }];


  return (
    <Card
      className={`flex-shrink-0 bg-card border-core-subtle rounded-none border-l-0 border-t-0 h-[calc(100vh-48px)] overflow-hidden transition-all duration-300 pr-3 pt-6 ${
      isCollapsed ? "w-16" : "w-[274px]"}`
      }
      onWheel={(e) => e.stopPropagation()}>

      {!isCollapsed &&
      <>
          {/* Header */}
          <div className="flex items-center justify-between pl-12">
            <h2 className="heading-100 text-foreground">Deals</h2>
            <div className="flex items-center gap-1">
              






              <Button
              variant="ghost"
              size="sm"
              onClick={onCollapse}
              className="h-8 w-8 p-0 border border-border">

                <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Nav Items */}
          <div className="pl-12 py-3">
            {navItems.map((item) =>
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => setActiveItem(item.id)}
            className={`w-[214px] flex items-center justify-start px-3 py-2 rounded-100 transition-colors relative h-auto mb-1 ${
            activeItem === item.id ?
            "bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" :
            "hover:bg-trellis-neutral-100"}`
            }>

                <span className="body-100 text-foreground">{item.label}</span>
              </Button>
          )}
          </div>
        </>
      }
    </Card>);

};

export default DealsSubNav;