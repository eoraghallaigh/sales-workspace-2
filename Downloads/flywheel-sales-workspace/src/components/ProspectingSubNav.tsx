import { useState } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useCyclePath } from "@/hooks/useCyclePath";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, PanelLeftClose, ArrowRight } from "lucide-react";
import { useCampaigns } from "@/contexts/CampaignsContext";

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
  const { cyclePath, cycleSlug } = useCyclePath();
  const { campaignId } = useParams();
  const { campaigns } = useCampaigns();
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get("view");
  const isPowerHourRoute = location.pathname.startsWith(`/${cycleSlug}/power-hour`);
  const defaultItem = campaignId || viewParam || (isPowerHourRoute ? "" : "p1-now");
  const campaignIds = campaigns.map(c => c.id);
  const [activeItem, setActiveItemState] = useState(defaultItem);
  const [isNetNewOpen, setIsNetNewOpen] = useState(!campaignId);
  const [isInstallBaseOpen, setIsInstallBaseOpen] = useState(!campaignId);
  const [isOtherOpen, setIsOtherOpen] = useState(!!campaignId);
  const setActiveItem = (id: string) => {
    setActiveItemState(id);
    onActiveItemChange?.(id);
    if (campaignIds.includes(id)) {
      navigate(cyclePath(`/prospecting/campaign/${id}`));
    } else {
      navigate(cyclePath("/prospecting"));
    }
  };

  const netNewItems = [{
    id: "full-prospect-book",
    label: "Full Prospect Book"
  }, {
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
  }];

  const installBaseItems = [{
    id: "full-customer-book",
    label: "Full Customer Book"
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

            {/* Net New Collapsible */}
            <Collapsible open={isNetNewOpen} onOpenChange={setIsNetNewOpen}>
              <CollapsibleTrigger className="w-[214px] flex items-center justify-between px-3 py-2 rounded-100 hover:bg-trellis-neutral-100 transition-colors mb-1">
                <span className="body-100 text-foreground">Net New</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isNetNewOpen ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {netNewItems.map((item) => <Button key={item.id} variant="ghost" onClick={() => setActiveItem(item.id)} className={`w-[214px] flex items-center justify-start pl-6 pr-3 py-2 rounded-100 transition-colors relative h-auto ${activeItem === item.id ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" : "hover:bg-trellis-neutral-100"}`}>
                    <span className="body-100 text-foreground">{item.label}</span>
                  </Button>)}
              </CollapsibleContent>
            </Collapsible>

            {/* Install Base Collapsible */}
            <Collapsible open={isInstallBaseOpen} onOpenChange={setIsInstallBaseOpen}>
              <CollapsibleTrigger className="w-[214px] flex items-center justify-between px-3 py-2 rounded-100 hover:bg-trellis-neutral-100 transition-colors mb-1 mt-1">
                <span className="body-100 text-foreground">Install Base</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isInstallBaseOpen ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {installBaseItems.map((item) => <Button key={item.id} variant="ghost" onClick={() => setActiveItem(item.id)} className={`w-[214px] flex items-center justify-start pl-6 pr-3 py-2 rounded-100 transition-colors relative h-auto ${activeItem === item.id ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" : "hover:bg-trellis-neutral-100"}`}>
                    <span className="body-100 text-foreground">{item.label}</span>
                  </Button>)}
              </CollapsibleContent>
            </Collapsible>

            {/* Separator */}
            <div className="my-4 border-t border-border" />

            {/* Daily Power Hour */}
            <Button variant="ghost" onClick={() => navigate(cyclePath("/power-hour/review"))} className={`w-[214px] flex items-center justify-start px-3 py-2 rounded-100 transition-colors relative h-auto mb-2 ${isPowerHourRoute ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" : "hover:bg-trellis-neutral-100"}`}>
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
                {campaigns.map((item) => <Button key={item.id} variant="ghost" onClick={() => setActiveItem(item.id)} className={`w-[214px] flex items-center justify-start pl-6 pr-3 py-2 rounded-100 transition-colors relative h-auto ${activeItem === item.id ? "bg-trellis-neutral-200 hover:bg-trellis-neutral-200 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-foreground before:rounded-r" : "hover:bg-trellis-neutral-100"}`}>
                    <span className="body-100 text-foreground">{item.label}</span>
                  </Button>)}
                <Button
                  variant="ghost"
                  onClick={() => navigate(cyclePath("/campaigns"))}
                  className="w-[214px] flex items-center justify-start pl-6 pr-3 py-2 rounded-100 transition-colors relative h-auto text-muted-foreground hover:bg-trellis-neutral-100"
                >
                  <span className="body-100">View all campaigns</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleContent>
            </Collapsible>


          </div>}
      </Card>
    </>);

};
export default ProspectingSubNav;
