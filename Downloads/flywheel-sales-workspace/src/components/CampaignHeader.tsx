import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, FileText, Swords, MessageSquareText, Video, File, Calendar, User, Target } from "lucide-react";
import { useState } from "react";
import { Campaign, EnablementMaterial } from "@/data/campaignData";

interface CampaignHeaderProps {
  campaign: Campaign;
}

const materialIcon = (type: EnablementMaterial["type"]) => {
  switch (type) {
    case "case-study": return <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "battle-card": return <Swords className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "talk-track": return <MessageSquareText className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "video": return <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "one-pager": return <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const CampaignHeader = ({ campaign }: CampaignHeaderProps) => {
  const [isEnablementOpen, setIsEnablementOpen] = useState(true);
  const workedPercent = Math.round((campaign.metrics.worked / campaign.metrics.totalCompanies) * 100);
  const meetingsPercent = Math.round((campaign.metrics.meetings / campaign.metrics.target) * 100);

  // Calculate days remaining
  const endDate = new Date(campaign.endDate);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <Card className="bg-card border border-border rounded shadow-100 p-5 mb-4">
      {/* Campaign title & meta */}
      <div className="mb-4">
        <h3 className="heading-300 text-foreground mb-1">{campaign.label}</h3>
        <p className="body-100 text-muted-foreground leading-relaxed">{campaign.description}</p>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="detail-100 text-muted-foreground">
            {formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="detail-100 text-muted-foreground">{daysRemaining} days remaining</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="detail-100 text-muted-foreground">{campaign.createdBy}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="detail-100 text-muted-foreground">{campaign.completionCriteria}</span>
        </div>
      </div>

      {/* Progress metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded border border-border bg-background">
          <div className="flex items-center justify-between mb-2">
            <span className="heading-50 text-foreground">Companies worked</span>
            <span className="heading-100 text-foreground">{campaign.metrics.worked}/{campaign.metrics.totalCompanies}</span>
          </div>
          <Progress value={workedPercent} className="h-2" />
          <span className="detail-100 text-muted-foreground mt-1 block">{workedPercent}% complete</span>
        </div>
        <div className="p-3 rounded border border-border bg-background">
          <div className="flex items-center justify-between mb-2">
            <span className="heading-50 text-foreground">Meetings booked</span>
            <span className="heading-100 text-foreground">{campaign.metrics.meetings}/{campaign.metrics.target}</span>
          </div>
          <Progress value={meetingsPercent} className="h-2" />
          <span className="detail-100 text-muted-foreground mt-1 block">{meetingsPercent}% of target</span>
        </div>
      </div>

      {/* Enablement materials */}
      <Collapsible open={isEnablementOpen} onOpenChange={setIsEnablementOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 w-full py-1">
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isEnablementOpen ? '' : '-rotate-90'}`} />
          <span className="heading-50 text-foreground">Enablement materials</span>
          <span className="detail-100 text-muted-foreground">({campaign.enablementMaterials.length})</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="space-y-1">
            {campaign.enablementMaterials.map(material => (
              <button
                key={material.id}
                className="flex items-start gap-3 w-full text-left px-3 py-2.5 rounded hover:bg-accent/50 transition-colors group"
              >
                {materialIcon(material.type)}
                <div className="min-w-0 flex-1">
                  <span className="body-100 text-foreground group-hover:underline block">{material.title}</span>
                  <span className="detail-100 text-muted-foreground block">{material.description}</span>
                </div>
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CampaignHeader;
