import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, PanelLeftClose } from "lucide-react";

interface ProspectingSubNavProps {
  onCollapse?: () => void;
  isCollapsed?: boolean;
  onActiveItemChange?: (itemId: string) => void;
}
const ProspectingSubNav = ({
  onCollapse,
  isCollapsed = false,
  onActiveItemChange
}: ProspectingSubNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { campaignId } = useParams();
  const isPowerHourRoute = location.pathname.startsWith("/power-hour");
  const defaultItem = campaignId || (isPowerHourRoute ? "" : "p1-now");
  const campaignIds = ["salesforce-switchers", "q3-aeo-push", "enterprise-expansion", "smb-winback"];
  const [activeItem, setActiveItemState] = useState(defaultItem);
  const [isPriorityOpen, setIsPriorityOpen] = useState(!campaignId);
  const [isOtherOpen, setIsOtherOpen] = useState(!!campaignId);
  const setActiveItem = (id: string) => {
    setActiveItemState(id);
    onActiveItemChange?.(id);
    const campaignIds = ["salesforce-switchers", "q3-aeo-push", "enterprise-expansion", "smb-winback"];
    if (campaignIds.includes(id)) {
      navigate(`/prospecting/campaign/${id}`);
    } else {
      navigate("/prospecting");
    }
  };
  
  
  

  const priorityItems = [{
    id: "p1-now",
    label: "P1 - Now"
  }, {
    id: "p2-next",
    label: "P2 - Next"
  }, {
    id: "p3-later",
    label: "P3 - Later"
  }, {
    id: "p4-last",
    label: "P4 - Last"
  }, {
    id: "install-base",
    label: "Install Base"
  }];
  return (
    <>
      <Card
        className={`flex-shrink-0 bg-card border-core-subtle rounded-none border-l-0 border-t-0 h-[calc(100vh-48px)] overflow-hidden transition-all duration-300 pr-3 pt-6 ${isCollapsed ? 'w-16' : 'w-[274px]'}`}
        onWheel={(e) => e.stopPropagation()}>

        {/* Header */}
        {!isCollapsed && <div className="flex items-center justify-between pl-12">
            <h2 className="heading-100 text-foreground">Prospecting Views</h2>
            <Button variant="ghost" size="sm" onClick={onCollapse} className="h-8 w-8 p-0 border border-border">
              <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>}

        {/* Navigation Items */}
        {!isCollapsed && <div className="pl-12 py-3">
            {/* QLs */}
            <Button variant="ghost" onClick={() => setActiveItem("qls")} className={`w-[214px] flex items-center justify-start px-3 py-2 rounded-100 transition-colors relative h-auto mb-2 ${activeItem === "qls" ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" : "hover:bg-trellis-neutral-100"}`}>
              <span className="body-100 text-foreground">QLs</span>
            </Button>

            {/* Priority prospects Collapsible */}
            <Collapsible open={isPriorityOpen} onOpenChange={setIsPriorityOpen}>
              <CollapsibleTrigger className="w-[214px] flex items-center justify-between px-3 py-2 rounded-100 hover:bg-trellis-neutral-100 transition-colors mb-1">
                <span className="body-100 text-foreground">Priority prospects</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isPriorityOpen ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {priorityItems.map((item) => <Button key={item.id} variant="ghost" onClick={() => setActiveItem(item.id)} className={`w-[214px] flex items-center justify-start pl-6 pr-3 py-2 rounded-100 transition-colors relative h-auto ${activeItem === item.id ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" : "hover:bg-trellis-neutral-100"}`}>
                    <span className="body-100 text-foreground">{item.label}</span>
                  </Button>)}
              </CollapsibleContent>
            </Collapsible>

            {/* Separator */}
            <div className="my-4 border-t border-border" />

            {/* Daily Power Hour */}
            <Button variant="ghost" onClick={() => navigate("/power-hour/review")} className={`w-[214px] flex items-center justify-start px-3 py-2 rounded-100 transition-colors relative h-auto mb-2 ${isPowerHourRoute ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" : "hover:bg-trellis-neutral-100"}`}>
              <span className="body-100 text-foreground">Daily Power Hour</span>
            </Button>

            {/* Separator */}
            <div className="my-4 border-t border-border" />

            {/* Campaigns Collapsible */}
            <Collapsible open={isOtherOpen} onOpenChange={setIsOtherOpen}>
              <CollapsibleTrigger className="w-[214px] flex items-center justify-between px-3 py-2 rounded-100 hover:bg-trellis-neutral-100 transition-colors mb-1">
                <span className="body-100 text-foreground">Campaigns</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOtherOpen ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {[
                  { id: "salesforce-switchers", label: "Salesforce Switchers" },
                  { id: "q3-aeo-push", label: "Q3 AEO Push" },
                  { id: "enterprise-expansion", label: "Enterprise Expansion" },
                  { id: "smb-winback", label: "SMB Winback" },
                ].map((item) => <Button key={item.id} variant="ghost" onClick={() => setActiveItem(item.id)} className={`w-[214px] flex items-center justify-start pl-6 pr-3 py-2 rounded-100 transition-colors relative h-auto ${activeItem === item.id ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" : "hover:bg-trellis-neutral-100"}`}>
                    <span className="body-100 text-foreground">{item.label}</span>
                  </Button>)}
              </CollapsibleContent>
            </Collapsible>


          </div>}
      </Card>
    </>);

};
export default ProspectingSubNav;