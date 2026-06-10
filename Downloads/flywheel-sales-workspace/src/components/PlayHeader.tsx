import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, FileText, Swords, MessageSquareText, Video, File, Calendar, ExternalLink, Megaphone } from "lucide-react";
import { useState } from "react";
import { Play, EnablementMaterial } from "@/data/playData";

interface PlayHeaderProps {
  play: Play;
  defaultOpen?: boolean;
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

const PlayHeader = ({ play, defaultOpen = false }: PlayHeaderProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const endDate = new Date(play.endDate);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const enablementSection = (
    <>
      <div className="flex items-center gap-2 mb-3">
        <span className="heading-50 text-foreground">Enablement materials</span>
        <span className="detail-100 text-muted-foreground">({play.enablementMaterials.length})</span>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {play.micrositeUrl && (
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
          {play.enablementMaterials.map(material => (
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
          ))}
        </div>
      </div>
    </>
  );

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-[#FFF4EF] to-card border border-[#F6CDBC] rounded shadow-200 px-10 pt-6 pb-8 mb-8">
      <div className="absolute inset-x-0 top-0 h-1 trellis-gradient-hero" />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
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
        <CollapsibleContent>
          <p className="body-100 text-foreground leading-relaxed mt-3 mb-6">{play.description}</p>
          {enablementSection}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PlayHeader;
