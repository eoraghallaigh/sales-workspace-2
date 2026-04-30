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
import { MoreHorizontal } from "lucide-react";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { Company } from "@/components/CompanyCard";
import SnoozeModal from "@/components/SnoozeModal";

interface CompanyCardVariantAProps {
  company: Company;
  strategyHint: string;
  rank?: number;
  onCompanyClick?: () => void;
  completedTasks?: Set<string>;
}

const getWhyNow = (company: Company): string => {
  const parts: string[] = [];
  if (company.signals[0]?.text) parts.push(company.signals[0].text);
  if (company.signals[1]?.text) parts.push(company.signals[1].text);
  if (parts.length === 0 && company.conversionTrigger) {
    parts.push(company.conversionTrigger);
  }
  return parts.join(" · ") || "Ranked by urgency + account potential";
};

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

const CompanyCardVariantA = ({
  company,
  onCompanyClick,
}: CompanyCardVariantAProps) => {
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);

  const statusBadge = getStatusBadge(company.status);

  const touchStatuses = [...(company.touches.touchStatuses || [])];
  while (touchStatuses.length < 5) touchStatuses.push("empty");
  const displayedTouchStatuses = touchStatuses.slice(0, 5);
  const completedCount = displayedTouchStatuses.filter((s) => s === "completed").length;

  const whyNow = getWhyNow(company);

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
      className="group flex items-center gap-4 px-4 py-3 bg-card cursor-pointer"
    >
      <img
        src={company.logo || companyLogoPlaceholder}
        alt={`${company.name} logo`}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <span className="heading-200 text-text-interactive truncate">
          {company.name}
        </span>
        <span className="body-100 text-muted-foreground truncate">
          {whyNow}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <MiniTouchDots statuses={displayedTouchStatuses as TouchStatus[]} />
        <span className="detail-200 text-muted-foreground">
          {completedCount}/5 · due {company.touches.deadline}
        </span>
      </div>

      <Badge variant={statusBadge.variant} className="flex-shrink-0">
        {statusBadge.label}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-9 w-9"
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

export default CompanyCardVariantA;
