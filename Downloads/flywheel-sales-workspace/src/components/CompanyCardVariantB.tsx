import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import Tag from "@/components/Tag";
import { Company } from "@/components/CompanyCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CompanyCardVariantBProps {
  company: Company;
  strategyHint: string;
  onCompanyClick?: () => void;
  completedTasks?: Set<string>;
}

const STRATEGY_INDICATORS = ["Email drafted", "Call script ready", "In sequence"] as const;

const CompanyCardVariantB = ({ company, onCompanyClick }: CompanyCardVariantBProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadgeVariant = (): { label: string; variant: "status-orange" | "status-blue" | "status-yellow" | "status-green" | "status-gray" } => {
    switch (company.status) {
      case "New": return { label: "New", variant: "status-blue" };
      case "Unworked QL": return { label: "QL", variant: "status-orange" };
      case "Unworked P1": return { label: "Unworked", variant: "status-blue" };
      case "In Progress": return { label: "In Progress", variant: "status-yellow" };
      case "Over SLA": return { label: "Over SLA", variant: "status-orange" };
      case "Worked": return { label: "Worked", variant: "status-green" };
      case "Snoozed": return { label: "Snoozed", variant: "status-gray" };
      default: return { label: "Dismissed", variant: "status-gray" };
    }
  };

  const statusBadge = getStatusBadgeVariant();
  const contactCount = company.recommendedContacts.length;
  const displayedContacts = company.recommendedContacts.slice(0, 3);

  return (
    <div className="border border-border-core-subtle bg-card rounded shadow-100 overflow-hidden">
      {/* Main Row */}
      <div
        className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-accent/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        <img src={company.logo || companyLogoPlaceholder} alt={`${company.name} logo`} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="heading-200 text-foreground">{company.name}</span>
          <p className="body-100 text-muted-foreground flex items-center gap-1">
            <span>{company.industry ?? "—"}</span>
            <span>•</span>
            <span>PVS {company.pvsScore ?? "—"}</span>
          </p>
        </div>
        <span className="detail-200 text-muted-foreground flex-shrink-0">{contactCount} contacts</span>
        <Badge variant={statusBadge.variant} className="flex-shrink-0">{statusBadge.label}</Badge>
        <Button variant="primary" size="small" onClick={(e) => { e.stopPropagation(); onCompanyClick?.(); }} className="flex-shrink-0">
          Work
        </Button>
      </div>

      {/* Expandable: Mini Contact Cards + Signals */}
      {isExpanded && (
        <div className="px-5 py-4 bg-fill-tertiary flex flex-col gap-4">
          {/* Mini Contact Cards */}
          <div className="flex flex-wrap gap-3">
            {company.recommendedContacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className="bg-fill-surface-recessed rounded-lg px-4 py-3 detail-200 text-muted-foreground text-center">
                Mini Contact Card
              </div>
            ))}
          </div>

          {/* Intent Signals placeholders */}
          <div className="flex flex-wrap gap-2">
            {company.signals.slice(0, 3).map((_, index) => (
              <div key={index} className="bg-fill-surface-recessed rounded-lg px-3 py-2 detail-200 text-muted-foreground text-center">
                Intent Signal
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyCardVariantB;