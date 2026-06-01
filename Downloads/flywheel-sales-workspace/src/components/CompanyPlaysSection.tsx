import { useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  Target,
  Building2,
  FileText,
  Swords,
  MessageSquareText,
  Video,
  File,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCyclePath } from "@/hooks/useCyclePath";
import { usePlays } from "@/contexts/PlaysContext";
import { getPlaysForCompany, EnablementMaterial, Play } from "@/data/playData";

interface CompanyPlaysSectionProps {
  companyId: string;
}

const materialIcon = (type: EnablementMaterial["type"]) => {
  switch (type) {
    case "case-study":
      return <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "battle-card":
      return <Swords className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "talk-track":
      return <MessageSquareText className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "video":
      return <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    case "one-pager":
      return <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
  }
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const daysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const today = new Date();
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
};

const PlayCard = ({ play }: { play: Play }) => {
  const navigate = useNavigate();
  const { cyclePath } = useCyclePath();
  const remaining = daysRemaining(play.endDate);

  return (
    <div className="rounded-100 border border-core-subtle bg-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <button
          type="button"
          onClick={() => navigate(cyclePath(`/prospecting/play/${play.id}`))}
          className="group flex items-center gap-1.5 text-left"
        >
          <h4 className="heading-200 text-text-interactive group-hover:text-text-interactive-hover transition-colors">
            {play.label}
          </h4>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-text-interactive-hover transition-colors" />
        </button>
        <Badge variant="status-green" className="flex-shrink-0">Live</Badge>
      </div>

      <p className="body-100 text-muted-foreground leading-relaxed mb-4">{play.description}</p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="detail-100 text-muted-foreground">
            Ends {formatDate(play.endDate)} · {remaining} days left
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="detail-100 text-muted-foreground">{play.createdBy}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="detail-100 text-muted-foreground">
            {play.metrics.totalCompanies} companies · {play.metrics.worked} worked
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="detail-100 text-muted-foreground">{play.completionCriteria}</span>
        </div>
      </div>

      <div>
        <span className="heading-50 text-foreground block mb-1.5">
          Enablement materials ({play.enablementMaterials.length})
        </span>
        <div className="space-y-0.5">
          {play.enablementMaterials.map(material => (
            <button
              key={material.id}
              type="button"
              className="flex items-start gap-3 w-full text-left px-2 py-2 rounded-100 hover:bg-accent/50 transition-colors group"
            >
              {materialIcon(material.type)}
              <div className="min-w-0 flex-1">
                <span className="body-100 text-foreground group-hover:underline block">{material.title}</span>
                <span className="detail-100 text-muted-foreground block">{material.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompanyPlaysSection = ({ companyId }: CompanyPlaysSectionProps) => {
  const { plays } = usePlays();
  const companyPlays = getPlaysForCompany(companyId, plays);

  if (companyPlays.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {companyPlays.map(play => (
        <PlayCard key={play.id} play={play} />
      ))}
    </div>
  );
};

export default CompanyPlaysSection;
