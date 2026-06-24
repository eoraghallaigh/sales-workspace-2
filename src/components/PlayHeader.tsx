import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, FileText, Swords, MessageSquareText, Video, File, Calendar, ExternalLink, Megaphone, Loader2 } from "lucide-react";
import { useState } from "react";
import { Play, EnablementMaterial } from "@/data/playData";

interface PlayHeaderProps {
  play: Play;
  defaultOpen?: boolean;
  // When set, the hero microsite card shows a loading spinner instead of its preview.
  loadingMicrosite?: boolean;
  // Material ids whose row should render as a loading spinner instead of content.
  loadingMaterialIds?: string[];
  // Compact mode (company strategy view): shows the play name as the header with
  // the dates in the body, instead of the standalone red badge + large title.
  compact?: boolean;
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

const PlayHeader = ({ play, defaultOpen = false, loadingMicrosite = false, loadingMaterialIds = [], compact = false }: PlayHeaderProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const endDate = new Date(play.endDate);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const playDateLine = (p: Play) => {
    const days = Math.max(
      0,
      Math.ceil((new Date(p.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    );
    return `Ends ${formatDate(p.endDate)} · ${days} days remaining`;
  };

  const enablementSection = (
    <>
      <div className="grid grid-cols-2 gap-6">
        {play.micrositeUrl && loadingMicrosite && (
          <div className="flex flex-col rounded-200 border border-core-subtle overflow-hidden">
            <div className="h-40 flex items-center justify-center border-b border-core-subtle bg-[#F5F5F5]">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-2 p-3">
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
            className="group flex flex-col rounded-200 border border-core-subtle overflow-hidden hover:shadow-200 hover:border-text-interactive transition-all"
          >
            {play.micrositePreview ? (
              <div className="h-40 overflow-hidden border-b border-core-subtle">
                <img
                  src={play.micrositePreview}
                  alt={`${play.micrositeTitle ?? "Campaign microsite"} preview`}
                  className="w-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center gap-1.5 border-b border-core-subtle bg-[#0B3B34] px-4 text-center">
                <span className="heading-200 text-white">{play.micrositeTitle ?? play.label}</span>
                <span className="detail-100 text-white/70">Campaign microsite</span>
              </div>
            )}
            <div className="flex items-start gap-2 p-3">
              <ExternalLink className="h-4 w-4 text-text-interactive flex-shrink-0 mt-0.5 group-hover:text-text-interactive-hover transition-colors" />
              <div className="min-w-0 flex-1">
                <span className="link-100 text-text-interactive group-hover:text-text-interactive-hover transition-colors block">
                  {play.micrositeTitle ?? "Campaign microsite"}
                </span>
                <span className="detail-100 text-muted-foreground block">
                  {play.micrositeDescription ?? "Marketing-built Lovable site with the latest enablement materials."}
                </span>
              </div>
            </div>
          </a>
        )}

        <div className="flex flex-col gap-4">
          {play.enablementMaterials.map(material =>
            loadingMaterialIds.includes(material.id) ? (
              <div key={material.id} className="flex items-start gap-2.5 w-full px-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground flex-shrink-0 mt-1" />
                <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                  <div className="h-3 w-1/2 rounded bg-[#EBEBEB] animate-pulse" />
                  <div className="h-2.5 w-3/4 rounded bg-[#EBEBEB] animate-pulse" />
                </div>
              </div>
            ) : (
              <button
                key={material.id}
                className="flex items-start gap-2.5 w-full text-left px-2 py-2 rounded hover:bg-accent/50 transition-colors group"
              >
                <span className="flex-shrink-0 mt-1">{materialIcon(material.type)}</span>
                <div className="min-w-0 flex-1">
                  <span className="link-100 text-text-interactive group-hover:text-text-interactive-hover transition-colors block">
                    {material.title}
                  </span>
                  <span className="detail-100 text-muted-foreground block">{material.description}</span>
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </>
  );

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-[#FFF4EF] to-card border border-[#F6CDBC] rounded shadow-200 pr-6 pl-6 pt-6 pb-6 mb-8">
      <div className="absolute inset-x-0 top-0 h-1 trellis-gradient-hero" />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {compact ? (
          <div className="flex flex-col gap-2">
            <Badge variant="red" className="gap-1 self-start">
              <Megaphone className="h-3 w-3" />
              <span className="uppercase tracking-wide">Prospecting Play</span>
            </Badge>
            <CollapsibleTrigger className="flex items-center gap-2 group">
              <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
              <h3 className="heading-200 text-foreground">{play.label}</h3>
            </CollapsibleTrigger>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-4">
              <Badge variant="red" className="gap-1 self-start">
                <Megaphone className="h-3 w-3" />
                <span className="uppercase tracking-wide">Prospecting Play</span>
              </Badge>
              <CollapsibleTrigger className="flex items-center gap-2 group text-left">
                <ChevronDown className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                <h3 className="heading-300 text-foreground">{play.label}</h3>
              </CollapsibleTrigger>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="detail-100 text-muted-foreground">
                {formatDate(play.startDate)} – {formatDate(play.endDate)}
              </span>
              <span className="detail-100 text-muted-foreground">·</span>
              <span className="detail-100 text-muted-foreground">{daysRemaining} days remaining</span>
            </div>
          </div>
        )}
        <CollapsibleContent>
          <p className={`body-100 text-foreground leading-relaxed ${compact ? "mt-4 mb-2" : "mt-3 mb-6"}`}>
            {play.description}
          </p>
          {compact && (
            <p className="detail-100 text-muted-foreground font-normal mb-6">
              {playDateLine(play)}
            </p>
          )}
          {enablementSection}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PlayHeader;
