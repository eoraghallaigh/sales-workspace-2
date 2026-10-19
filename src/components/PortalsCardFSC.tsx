import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { FscPortalCardData } from "@/data/installBase";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import HubSummaryCard from "@/components/HubSummaryCard";
import CreditsCapacity from "@/components/CreditsCapacity";
import PortalSubscriptionsFSC from "@/components/PortalSubscriptionsFSC";
import PortalTeams from "@/components/PortalTeams";

interface PortalsCardFSCProps {
  portals: FscPortalCardData[];
}

const ViewPortalLink = () => (
  <button
    type="button"
    onClick={() => toast.success("Opens portal")}
    className="link-100 text-text-interactive hover:underline flex items-center gap-1 whitespace-nowrap shrink-0"
  >
    View Portal
    <TrellisIcon name="externalLink" size={12} />
  </button>
);

const PortalBody = ({ portal }: { portal: FscPortalCardData }) => (
  <div className="flex flex-col gap-6">
    <HubSummaryCard
      summary={portal.summary}
      hidePortalLinks
      hideUsageIntentPlaybook
      limitsSlot={<CreditsCapacity capacity={portal.capacity} creditUsage={portal.creditUsage} />}
    />
    <Separator />
    <PortalSubscriptionsFSC subscription={portal.subscription} />
    <Separator />
    <PortalTeams team={portal.team} />
  </div>
);

const PortalsCardFSC = ({ portals }: PortalsCardFSCProps) => {
  if (portals.length === 0) return null;

  // Single portal renders flat; multiple collapse into per-portal sections.
  // The header carries the Hub ID + single portal-level edition + portal link.
  if (portals.length === 1) {
    const portal = portals[0];
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 pr-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="heading-100 text-foreground truncate">Hub ID: {portal.id}</span>
            <Badge variant="koala" className="shrink-0">{portal.edition}</Badge>
          </div>
          <ViewPortalLink />
        </div>
        <PortalBody portal={portal} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {portals.map((portal, i) => (
        <Collapsible key={portal.id} defaultOpen={i === 0}>
          <div className="flex w-full items-center justify-between gap-3 pr-4 py-3">
            <CollapsibleTrigger className="group flex items-center gap-2 min-w-0 text-left">
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-data-[state=closed]:-rotate-90" />
              <span className="heading-100 text-foreground truncate">Hub ID: {portal.id}</span>
              <Badge variant="koala" className="shrink-0">{portal.edition}</Badge>
            </CollapsibleTrigger>
            <ViewPortalLink />
          </div>
          <CollapsibleContent className="px-1 pt-4 pb-2">
            <PortalBody portal={portal} />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default PortalsCardFSC;
