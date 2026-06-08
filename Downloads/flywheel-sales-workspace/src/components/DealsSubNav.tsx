import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PanelLeftClose } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface DealsSubNavProps {
  onCollapse?: () => void;
  isCollapsed?: boolean;
}

const DealsSubNav = ({ onCollapse, isCollapsed = false }: DealsSubNavProps) => {
  const [activeItem, setActiveItem] = useState("all-deals");
  const { theme } = useTheme();
  const isAlpha = theme === "alpha";

  const navItems = [
    { id: "all-deals", label: "All deals" },
    { id: "needs-attention", label: "Needs attention" },
    { id: "pending-follow-up", label: "Pending follow-up" },
    { id: "upcoming-meetings", label: "Upcoming meetings" },
  ];

  return (
    <Card
      className={cn(
        "flex-shrink-0 bg-card border-core-subtle rounded-none border-l-0 border-t-0 border-b-0 h-[var(--page-content-height)] overflow-hidden transition-all duration-300 pr-3 pt-6",
        isCollapsed ? "w-16" : "w-[274px]"
      )}
      onWheel={(e) => e.stopPropagation()}
    >
      {!isCollapsed && (
        <>
          {/* Header */}
          <div className={cn("flex items-center justify-between", isAlpha ? "pl-4" : "pl-12")}>
            <h2 className={cn("text-foreground", isAlpha ? "text-[14px] leading-[20px] font-medium pl-2" : "heading-100")}>
              Deals
            </h2>
            <Button variant="ghost" size="sm" onClick={onCollapse} className="h-8 w-8 p-0 border border-border">
              <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Nav Items */}
          <div className={cn("py-3", isAlpha ? "pl-4" : "pl-12")}>
            {navItems.map(item => {
              const selected = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={cn(
                    isAlpha
                      ? cn(
                          "w-full flex items-center min-h-[32px] px-2 rounded-[6px] text-[14px] leading-[20px] font-normal text-[#141414] transition-colors outline-none text-left mb-0.5",
                          "focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] focus-visible:ring-offset-2",
                          selected ? "bg-[#e6e6e6] hover:bg-[#e6e6e6]" : "hover:bg-[#ebebeb] active:bg-[#e6e6e6]"
                        )
                      : cn(
                          "w-[214px] flex items-center justify-start px-3 py-2 rounded-100 transition-colors relative h-auto mb-1",
                          selected
                            ? "bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r"
                            : "hover:bg-trellis-neutral-100"
                        )
                  )}
                >
                  {isAlpha ? (
                    <span className="truncate">{item.label}</span>
                  ) : (
                    <span className="body-100 text-foreground">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
};

export default DealsSubNav;
