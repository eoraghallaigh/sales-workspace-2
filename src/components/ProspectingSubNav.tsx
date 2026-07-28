import * as React from "react";
import { useState } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useCyclePath } from "@/hooks/useCyclePath";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, PanelLeftClose, ArrowRight } from "lucide-react";
import { usePlays } from "@/contexts/PlaysContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ProspectingSubNavProps {
  onCollapse?: () => void;
  isCollapsed?: boolean;
  onActiveItemChange?: (itemId: string) => void;
}

/*
 * Row — themed sub-nav row, shared by plain items and collapsible triggers.
 * Transitional: master button with left-bar active accent on neutral-200.
 * Alpha: 32px rounded NavRow, transparent → #ebebeb hover → #e6e6e6 selected.
 */
interface RowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  indented?: boolean;
  muted?: boolean;
  trailing?: React.ReactNode;
  isAlpha: boolean;
}
const Row = React.forwardRef<HTMLButtonElement, RowProps>(
  ({ label, selected, indented, muted, trailing, isAlpha, className, ...rest }, ref) => {
    if (isAlpha) {
      return (
        <button
          ref={ref}
          className={cn(
            "w-full flex items-center justify-between gap-2 min-h-[32px] rounded-[6px] text-[14px] leading-[20px] font-normal transition-colors outline-none text-left",
            "focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] focus-visible:ring-offset-2",
            indented ? "pl-6 pr-2" : "px-2",
            muted ? "text-[#666666]" : "text-[#141414]",
            selected ? "bg-[#e6e6e6] hover:bg-[#e6e6e6]" : "hover:bg-[#ebebeb] active:bg-[#e6e6e6]",
            className
          )}
          {...rest}
        >
          <span className="truncate">{label}</span>
          {trailing}
        </button>
      );
    }
    // Transitional (master)
    return (
      <button
        ref={ref}
        className={cn(
          "w-[214px] flex items-center justify-between px-3 py-2 rounded-100 transition-colors relative h-auto",
          indented && "pl-6 pr-3",
          selected
            ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r"
            : "hover:bg-trellis-neutral-100",
          className
        )}
        {...rest}
      >
        <span className={cn("body-100", muted ? "text-muted-foreground" : "text-foreground")}>{label}</span>
        {trailing}
      </button>
    );
  }
);
Row.displayName = "Row";

const ProspectingSubNav = ({
  onCollapse,
  isCollapsed = false,
  onActiveItemChange,
}: ProspectingSubNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cyclePath } = useCyclePath();
  const { playId } = useParams();
  const { plays } = usePlays();
  const { theme } = useTheme();
  const isAlpha = theme === "alpha";
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get("view");
  const isPowerHourRoute = location.pathname.startsWith("/power-hour");
  const defaultItem = playId || viewParam || (isPowerHourRoute ? "" : "p1-now");
  const playIds = plays.map(c => c.id);
  const [activeItem, setActiveItemState] = useState(defaultItem);
  const [isNetNewOpen, setIsNetNewOpen] = useState(!playId);
  const [isInstallBaseOpen, setIsInstallBaseOpen] = useState(!playId);
  const [isOtherOpen, setIsOtherOpen] = useState(!!playId);
  const setActiveItem = (id: string) => {
    setActiveItemState(id);
    onActiveItemChange?.(id);
    if (playIds.includes(id)) {
      navigate(cyclePath(`/prospecting/play/${id}`));
    } else {
      navigate(cyclePath("/prospecting"));
    }
  };

  const netNewItems = [
    { id: "full-prospect-book", label: "Full Prospect Book" },
    { id: "p1-now", label: "P1 - Now" },
    { id: "p2-next", label: "P2 - Next" },
    { id: "p3-later", label: "P3 - Later" },
    { id: "p4-last", label: "P4 - Last" },
  ];
  const installBaseItems = [{ id: "full-customer-book", label: "Full Customer Book" }];

  const chevron = (open: boolean) => (
    <ChevronDown className={cn("h-4 w-4 transition-transform", isAlpha ? "text-[#666666]" : "text-muted-foreground", !open && "-rotate-90")} />
  );
  const separator = <div className={cn("my-4 border-t", isAlpha ? "border-[#cccccc]" : "border-border")} />;
  const contentSpacing = isAlpha ? "mt-1 space-y-0.5" : "space-y-1 mt-1";

  return (
    <Card
      className={cn(
        "flex-shrink-0 bg-card border-core-subtle rounded-none border-l-0 border-t-0 border-b-0 h-full overflow-y-auto transition-all duration-300 pr-3 pt-6 pb-6",
        isCollapsed ? "w-16" : "w-[274px]"
      )}
      onWheel={(e) => e.stopPropagation()}
    >
      {!isCollapsed && (
        <>
          {/* Header */}
          <div className={cn("flex items-center justify-between", isAlpha ? "pl-4" : "pl-12")}>
            <h2 className={cn("text-foreground", isAlpha ? "text-[14px] leading-[20px] font-medium pl-2" : "heading-100")}>
              Prospecting Views
            </h2>
            <Button variant="ghost" size="sm" onClick={onCollapse} className="h-8 w-8 p-0 border border-border">
              <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className={cn("py-3", isAlpha ? "pl-4" : "pl-12")}>
            <Row isAlpha={isAlpha} label="QLs" selected={activeItem === "qls"} onClick={() => setActiveItem("qls")} className={isAlpha ? "mb-1" : "mb-2"} />

            {/* Net New */}
            <Collapsible open={isNetNewOpen} onOpenChange={setIsNetNewOpen}>
              <CollapsibleTrigger asChild>
                <Row isAlpha={isAlpha} label="Net New" trailing={chevron(isNetNewOpen)} className="mb-1" />
              </CollapsibleTrigger>
              <CollapsibleContent className={contentSpacing}>
                {netNewItems.map(item => (
                  <Row key={item.id} isAlpha={isAlpha} label={item.label} indented selected={activeItem === item.id} onClick={() => setActiveItem(item.id)} />
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Install Base */}
            <Collapsible open={isInstallBaseOpen} onOpenChange={setIsInstallBaseOpen}>
              <CollapsibleTrigger asChild>
                <Row isAlpha={isAlpha} label="Install Base" trailing={chevron(isInstallBaseOpen)} className="mb-1 mt-1" />
              </CollapsibleTrigger>
              <CollapsibleContent className={contentSpacing}>
                {installBaseItems.map(item => (
                  <Row key={item.id} isAlpha={isAlpha} label={item.label} indented selected={activeItem === item.id} onClick={() => setActiveItem(item.id)} />
                ))}
              </CollapsibleContent>
            </Collapsible>

            {separator}

            {/* Plays */}
            <Collapsible open={isOtherOpen} onOpenChange={setIsOtherOpen}>
              <CollapsibleTrigger asChild>
                <Row isAlpha={isAlpha} label="Plays" trailing={chevron(isOtherOpen)} className="mb-1" />
              </CollapsibleTrigger>
              <CollapsibleContent className={contentSpacing}>
                {plays.map(item => (
                  <Row key={item.id} isAlpha={isAlpha} label={item.label} indented selected={activeItem === item.id} onClick={() => setActiveItem(item.id)} />
                ))}
                <Row
                  isAlpha={isAlpha}
                  label="View all plays"
                  indented
                  muted
                  onClick={() => navigate(cyclePath("/plays"))}
                  trailing={<ArrowRight className={cn("h-4 w-4", isAlpha ? "text-[#666666]" : "")} />}
                />
              </CollapsibleContent>
            </Collapsible>

            {separator}

            {/* Daily Power Hour */}
            <Row
              isAlpha={isAlpha}
              label="Daily Power Hour"
              selected={isPowerHourRoute}
              onClick={() => navigate(cyclePath("/power-hour/review"))}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default ProspectingSubNav;
