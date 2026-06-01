import { usePlays } from "@/contexts/PlaysContext";
import { getPlaysForCompany } from "@/data/playData";
import { cn } from "@/lib/utils";

interface CompanyPlayTagsProps {
  companyId: string;
  compact?: boolean;
  className?: string;
  excludePlayId?: string;
}

const CompanyPlayTags = ({ companyId, compact = false, className, excludePlayId }: CompanyPlayTagsProps) => {
  const { plays } = usePlays();
  const companyPlays = getPlaysForCompany(companyId, plays).filter(
    (play) => play.id !== excludePlayId,
  );

  if (companyPlays.length === 0) return null;

  return (
    <span className={cn("block text-muted-foreground", compact ? "detail-200" : "body-100", className)}>
      Part of the{" "}
      {companyPlays.map((play, i) => (
        <span key={play.id}>
          {i > 0 && ", "}
          <span className="font-semibold text-foreground">{play.label}</span>
        </span>
      ))}{" "}
      {companyPlays.length > 1 ? "plays" : "play"}
    </span>
  );
};

export default CompanyPlayTags;
