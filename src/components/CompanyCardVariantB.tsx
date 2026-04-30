import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MiniTouchDots, type TouchStatus } from "@/components/TouchDot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { Company } from "@/components/CompanyCard";
import SnoozeModal from "@/components/SnoozeModal";

interface CompanyCardVariantBProps {
  company: Company;
  strategyHint: string;
  rank?: number;
  onCompanyClick?: () => void;
  completedTasks?: Set<string>;
}

const getStatusBadge = (
  status: Company["status"],
): {
  label: string;
  variant: "status-orange" | "status-blue" | "status-yellow" | "status-green" | "status-gray";
} => {
  switch (status) {
    case "New":
      return { label: "New", variant: "status-blue" };
    case "Unworked QL":
      return { label: "QL", variant: "status-orange" };
    case "Unworked P1":
      return { label: "Unworked", variant: "status-blue" };
    case "In Progress":
      return { label: "In Progress", variant: "status-yellow" };
    case "Over SLA":
      return { label: "Over SLA", variant: "status-orange" };
    case "Worked":
      return { label: "Worked", variant: "status-green" };
    case "Snoozed":
      return { label: "Snoozed", variant: "status-gray" };
    default:
      return { label: "Dismissed", variant: "status-gray" };
  }
};

const composeBrief = (company: Company): string => {
  const signalText = company.signals
    .slice(0, 2)
    .map((s) => s.text.toLowerCase())
    .join(" and ");
  const topContact = company.recommendedContacts[0];
  const contactCount = company.recommendedContacts.length;

  const signalClause = signalText
    ? `${signalText} this week`
    : company.conversionTrigger
      ? company.conversionTrigger.toLowerCase()
      : "showing intent signals across the account";

  const approach = contactCount === 0
    ? "Strategy pending — no recommended contacts yet."
    : topContact
      ? `Strategy ready: ${contactCount} contact${contactCount === 1 ? "" : "s"} selected, lead with ${topContact.name} (${topContact.role}).`
      : `Strategy ready: ${contactCount} contact${contactCount === 1 ? "" : "s"} selected.`;

  const capitalizedClause = signalClause.charAt(0).toUpperCase() + signalClause.slice(1);

  return `${capitalizedClause}. ${approach}`;
};

const CompanyCardVariantB = ({
  company,
  onCompanyClick,
}: CompanyCardVariantBProps) => {
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);

  const statusBadge = getStatusBadge(company.status);
  const brief = composeBrief(company);

  const touchStatuses = [...(company.touches.touchStatuses || [])];
  while (touchStatuses.length < 5) touchStatuses.push("empty");
  const displayedTouchStatuses = touchStatuses.slice(0, 5);
  const completedCount = displayedTouchStatuses.filter((s) => s === "completed").length;

  const handleRowClick = () => onCompanyClick?.();

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onCompanyClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      className="group flex items-start gap-4 px-5 py-5 mb-2 border border-border rounded shadow-100 bg-card cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-300"
    >
      <img
        src={company.logo || companyLogoPlaceholder}
        alt={`${company.name} logo`}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-0.5"
      />

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="heading-200 text-text-interactive">{company.name}</span>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>
        <p className="body-200 text-muted-foreground leading-relaxed">{brief}</p>
        <div className="flex items-center gap-2 mt-1">
          <MiniTouchDots statuses={displayedTouchStatuses as TouchStatus[]} />
          <span className="detail-200 text-muted-foreground">
            {completedCount}/5 touches · due {company.touches.deadline}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSnoozeModalOpen(true);
                }}
              >
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDismissModalOpen(true);
                }}
              >
                Dismiss
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span className="detail-200 text-text-interactive flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          Open Strategy
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      <SnoozeModal
        open={isSnoozeModalOpen}
        onOpenChange={setIsSnoozeModalOpen}
        companyName={company.name}
      />

      <Dialog open={isDismissModalOpen} onOpenChange={setIsDismissModalOpen}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Dismiss {company.name}?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="body-100 text-foreground">
              This will remove {company.name} from your P1 list until someone at {company.name} shows high intent again.
            </p>
            <p className="body-100 text-foreground">
              You can view your dismissed companies using the "Worked Status" selector.
            </p>
          </div>
          <DialogFooter className="sm:justify-start gap-2">
            <Button variant="destructive" onClick={() => setIsDismissModalOpen(false)}>
              Dismiss {company.name}
            </Button>
            <Button variant="outline" onClick={() => setIsDismissModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyCardVariantB;
