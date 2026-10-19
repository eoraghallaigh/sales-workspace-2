import { toast } from "sonner";
import type { HubSpotTeam } from "@/data/installBase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrellisIcon } from "@/components/ui/trellis-icon";

interface HubSpotTeamCardProps {
  team: HubSpotTeam;
}

const TeamRow = ({ label, name }: { label: string; name: string }) => (
  <div className="grid grid-cols-2 items-center gap-4">
    <span className="body-100 text-foreground">{label}:</span>
    <button
      type="button"
      onClick={() => toast.success(`Opens ${name}'s profile`)}
      className="link-100 text-left text-[var(--color-specialty-text-core-alt-default)] hover:underline"
    >
      {name}
    </button>
  </div>
);

const TeamSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <h3 className="heading-100 text-foreground">{title}</h3>
    {children}
  </div>
);

const HubSpotTeamCard = ({ team }: HubSpotTeamCardProps) => (
  <div className="flex flex-col gap-4">
    <TeamSection title="Sales Team">
      <TeamRow label="Sales Owner" name={team.salesOwner} />
      <TeamRow label="Sales Specialist Owner" name={team.salesSpecialistOwner} />
    </TeamSection>

    <Separator />

    <TeamSection title="Success Team">
      <TeamRow label="Success Owner" name={team.successOwner} />
      <TeamRow label="Contract Manager" name={team.contractManager} />
    </TeamSection>

    <div className="flex items-center gap-2 pt-2">
      <span className="detail-200 text-muted-foreground">
        Powered by <span className="heading-50">HubSpot Team Card</span>
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" aria-label="About the HubSpot Team card" className="text-muted-foreground">
            <TrellisIcon name="infoCircle" size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent>Shows who at HubSpot owns this customer account</TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="h-4" />
      <Button
        variant="ghost"
        size="small"
        onClick={() => toast.success("Opens HubSpot Team card settings")}
      >
        <TrellisIcon name="settings" size={14} />
        Settings
      </Button>
    </div>
  </div>
);

export default HubSpotTeamCard;
