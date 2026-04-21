import { useState } from "react";
import { AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { Company } from "@/components/CompanyCard";

interface CompanyCardVariantCProps {
  company: Company;
  strategyHint: string;
  onCompanyClick?: () => void;
  completedTasks?: Set<string>;
}

const STRATEGY_INDICATORS = ["Email drafted", "Call script ready", "In sequence"] as const;

const CompanyCardVariantC = ({ company, onCompanyClick }: CompanyCardVariantCProps) => {
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);

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
  const touchStatuses = [...(company.touches.touchStatuses || [])];
  while (touchStatuses.length < 5) touchStatuses.push("empty");
  const displayedTouchStatuses = touchStatuses.slice(0, 5);
  const remainingTouches = displayedTouchStatuses.filter(s => s !== "completed").length;

  const displayedContacts = company.recommendedContacts.slice(0, 3);
  const extraCount = company.recommendedContacts.length - 3;

  return (
    <Card className="p-8 mb-4 border border-border rounded shadow-100 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img src={company.logo || companyLogoPlaceholder} alt={`${company.name} logo`} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex flex-col">
              <h3 className="heading-300 text-foreground mb-1">{company.name}</h3>
              <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="heading-50 text-text-interactive hover:text-text-interactive-hover transition-colors flex items-center gap-1 mb-1">
                {company.website}
                <TrellisIcon name="externalLink" size={12} />
              </a>
              <p className="body-100 text-muted-foreground flex items-center gap-1">
                <span>{company.industry ?? "—"}</span>
                <span>•</span>
                <span>PVS {company.pvsScore ?? "—"}</span>
                <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          <div className="flex flex-col items-end gap-1">
            <span className="detail-200 text-muted-foreground">
              {remainingTouches} more {remainingTouches === 1 ? 'touch' : 'touches'} required before {company.touches.deadline}
            </span>
            <div className="flex items-center gap-1.5">
              {displayedTouchStatuses.map((status, index) => (
                <div key={index} className={`h-4 w-4 rounded-full ${status === "scheduled" ? "bg-trellis-orange-500" : ""}`}
                  style={{
                    background: status === "completed" ? "var(--color-fill-transitional-progress-success-gradient-color-1, #00823A)" : status === "empty" ? "var(--color-fill-surface-recessed, #F0F0F0)" : undefined
                  }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Contact Cards */}
      <div className="flex flex-wrap gap-3">
        {company.recommendedContacts.slice(0, 3).map((contact) => (
          <div key={contact.id} className="bg-fill-surface-recessed rounded-lg px-4 py-3 detail-200 text-muted-foreground text-center">
            Mini Contact Card
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex min-h-[40px] px-3 justify-center items-center gap-2 rounded border border-transparent bg-transparent heading-50 text-foreground hover:bg-accent/10 transition-colors">
                Snooze <TrellisIcon name="downCarat" size={12} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>1 day</DropdownMenuItem>
              <DropdownMenuItem>3 days</DropdownMenuItem>
              <DropdownMenuItem>1 week</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="flex min-h-[40px] px-3 justify-center items-center gap-2 rounded border border-transparent bg-transparent heading-50 text-foreground hover:bg-accent/10 transition-colors" onClick={() => setIsDismissModalOpen(true)}>
            Dismiss
          </button>
          <Button variant="primary" size="medium" onClick={() => onCompanyClick?.()}>
            Work
          </Button>
        </div>
      </div>

      {/* Dismiss Modal */}
      <Dialog open={isDismissModalOpen} onOpenChange={setIsDismissModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Dismiss {company.name}?</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="body-100 text-foreground">This will remove {company.name} from your P1 list until someone at {company.name} shows high intent again.</p>
            <p className="body-100 text-foreground">You can view your dismissed companies using the "Worked Status" selector.</p>
          </div>
          <DialogFooter className="sm:justify-start gap-2">
            <Button variant="destructive" onClick={() => setIsDismissModalOpen(false)}>Dismiss {company.name}</Button>
            <Button variant="outline" onClick={() => setIsDismissModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CompanyCardVariantC;