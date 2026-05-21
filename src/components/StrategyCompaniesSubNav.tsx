import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { MiniTouchDots, type TouchStatus } from "@/components/TouchDot";

export interface StrategyCompany {
  id: string;
  name: string;
  touches?: { touchStatuses?: TouchStatus[] };
}

interface StrategyCompaniesSubNavProps {
  companies: StrategyCompany[];
  currentCompanyId: string;
  onSelect: (companyId: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const StrategyCompaniesSubNav = ({
  companies,
  currentCompanyId,
  onSelect,
  isCollapsed,
  onToggle,
}: StrategyCompaniesSubNavProps) => {
  return (
    <Card
      className={`flex-shrink-0 bg-card border-core-subtle rounded-none border-l-0 border-t-0 h-full overflow-hidden transition-all duration-300 pt-6 ${
        isCollapsed ? "w-16" : "w-[274px]"
      }`}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "justify-between pl-12 pr-3"
        }`}
      >
        {!isCollapsed && <h2 className="heading-100 text-foreground">Companies</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 border border-border"
          aria-label={isCollapsed ? "Expand sub-nav" : "Collapse sub-nav"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <nav className="pl-8 pr-3 py-3 overflow-y-auto h-[calc(100%-3.5rem)]">
          {companies.map((company) => {
            const isActive = company.id === currentCompanyId;
            return (
              <button
                key={company.id}
                onClick={() => onSelect(company.id)}
                className={`w-full text-left px-3 py-3 transition-colors ${
                  isActive
                    ? "rounded-l-[var(--borderRadius-100,4px)] rounded-r-none border-l-4 border-l-[var(--color-border-core-pressed,#141414)] bg-[var(--color-fill-tertiary-disabled,#F5F5F5)]"
                    : "hover:bg-trellis-neutral-100"
                }`}
              >
                <div className="body-100 text-foreground">{company.name}</div>
                <div className="mt-1">
                  <MiniTouchDots statuses={(company.touches?.touchStatuses || []) as TouchStatus[]} />
                </div>
              </button>
            );
          })}
        </nav>
      )}
    </Card>
  );
};

export default StrategyCompaniesSubNav;
