import { Card } from "@/components/ui/card";
import { Ribbon } from "@/components/ui/ribbon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { Play } from "@/data/playData";

interface PlayHeaderProps {
  play: Play;
  defaultOpen?: boolean;
  // When set, the hero microsite card shows a loading spinner instead of its preview.
  loadingMicrosite?: boolean;
  // Compact mode (company strategy view): shows the play name as the header with
  // the dates in the body, instead of the standalone red badge + large title.
  compact?: boolean;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const PlayHeader = ({ play, defaultOpen = false, loadingMicrosite = false, compact = false }: PlayHeaderProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const endDate = new Date(play.endDate);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const micrositeLink = (
    <>
      {play.micrositeUrl && loadingMicrosite && (
        <div className="flex items-center gap-2.5 rounded-200 border border-core-subtle p-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            <div className="h-3 w-2/3 rounded bg-[#EBEBEB] animate-pulse" />
            <div className="h-2.5 w-full rounded bg-[#EBEBEB] animate-pulse" />
          </div>
        </div>
      )}
      {play.micrositeUrl && !loadingMicrosite && (
        <a
          href={play.micrositeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-2.5 rounded-200 border border-core-subtle p-3 hover:shadow-200 hover:border-text-interactive transition-all"
        >
          <ExternalLink className="h-4 w-4 text-text-interactive flex-shrink-0 mt-0.5 group-hover:text-text-interactive-hover transition-colors" />
          <div className="min-w-0 flex-1">
            <span className="link-100 text-text-interactive group-hover:text-text-interactive-hover transition-colors block">
              {play.micrositeTitle ?? "Campaign microsite"}
            </span>
            <span className="detail-100 text-muted-foreground block">
              {play.micrositeDescription ?? "Marketing-built Lovable site with the latest enablement materials."}
            </span>
          </div>
        </a>
      )}
    </>
  );

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-[#FFF4EF] to-card border border-[#F6CDBC] rounded shadow-200 pr-6 pl-6 pt-6 pb-6 mb-8">
      <div className="absolute inset-x-0 top-0 h-1 trellis-gradient-hero" />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className={`flex flex-col ${compact ? "gap-2" : "gap-4"}`}>
          <div className="flex items-center justify-between gap-4">
            <Ribbon className="self-start">Prospecting Play</Ribbon>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="detail-100 text-muted-foreground">
                {formatDate(play.startDate)} – {formatDate(play.endDate)}
              </span>
              <span className="detail-100 text-muted-foreground">·</span>
              <span className="detail-100 text-muted-foreground">{daysRemaining} days remaining</span>
            </div>
          </div>
          <CollapsibleTrigger className="flex items-center gap-2 group text-left">
            <ChevronDown className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
            <h3 className={`${compact ? "heading-200" : "heading-300"} text-foreground`}>{play.label}</h3>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="grid grid-cols-[3fr_2fr] gap-8 mt-3 items-start">
            <p className="body-100 text-foreground leading-relaxed">
              {play.description}
            </p>
            {play.micrositeUrl && (
              <div>
                {micrositeLink}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PlayHeader;
