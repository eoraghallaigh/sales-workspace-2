import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { getPlayStatusBadge } from "@/utils/companyStatusUtils";
import { MiniTouchDots, type TouchStatus } from "@/components/TouchDot";
import PvsTooltip from "@/components/PvsTooltip";
import CompanyPlayTags from "@/components/CompanyPlayTags";
import ContactOutreachAvatars from "@/components/ContactOutreachAvatars";

interface CompanyCardVariantCProps {
  company: Company;
  strategyHint: string;
  rank?: number;
  onCompanyClick?: () => void;
  completedTasks?: Set<string>;
  currentPlayId?: string;
}

const getFallbackWhyNow = (company: Company): string => {
  if (company.conversionTrigger) return company.conversionTrigger;
  return "Ranked by urgency + account potential";
};

const getApproachFor = (role: string): string => {
  const lower = role.toLowerCase();
  if (lower.includes("vp") || lower.includes("chief") || lower.includes("director")) {
    return "Lead with strategic framing — they set direction.";
  }
  if (lower.includes("manager") || lower.includes("head")) {
    return "Focus on team impact and time-to-value.";
  }
  return "Open with a relevant pain point and a crisp ask.";
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

const CompanyCardVariantC = ({
  company,
  onCompanyClick,
  currentPlayId,
}: CompanyCardVariantCProps) => {
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);

  const statusBadge = currentPlayId
    ? getPlayStatusBadge(company.status)
    : getStatusBadge(company.status);

  const touchStatuses = [...(company.touches.touchStatuses || [])];
  while (touchStatuses.length < 5) touchStatuses.push("empty");
  const displayedTouchStatuses = touchStatuses.slice(0, 5);

  const displayedSignals = company.signals.slice(0, 2);
  const fallbackWhyNow = displayedSignals.length === 0 ? getFallbackWhyNow(company) : null;

  const handleRowClick = () => onCompanyClick?.();

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onCompanyClick?.();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      className="group px-5 py-4 mb-3 border border-border rounded shadow-100 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-300"
    >
      <div className="flex items-center gap-4">
        <img
          src={company.logo || companyLogoPlaceholder}
          alt={`${company.name} logo`}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="heading-200 text-text-interactive truncate">
              {company.name}
            </span>
            <span className="detail-200 text-muted-foreground whitespace-nowrap">
              · {company.industry ?? "—"} ·{" "}
              <PvsTooltip pvsScore={company.pvsScore}>
                <span className="cursor-default">
                  PVS {company.pvsScore ?? "—"}
                </span>
              </PvsTooltip>
            </span>
            {!currentPlayId && (
              <span className="detail-200 text-muted-foreground whitespace-nowrap truncate">
                {displayedSignals.length > 0
                  ? `· ${displayedSignals.map((s) => s.text).join(" · ")}`
                  : `· ${fallbackWhyNow}`}
              </span>
            )}
          </div>
          <CompanyPlayTags companyId={company.id} compact excludePlayId={currentPlayId} />
        </div>

        <ContactOutreachAvatars
          contacts={company.recommendedContacts}
          align="end"
        />

        <div className="flex items-center gap-3 flex-shrink-0">
          {!currentPlayId && (
            <>
              <MiniTouchDots statuses={displayedTouchStatuses as TouchStatus[]} />
              <span className="detail-200 text-muted-foreground whitespace-nowrap">
                due {company.touches.deadline}
              </span>
            </>
          )}
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>

          {!currentPlayId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
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
          )}
        </div>
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
    </Card>
  );
};

export default CompanyCardVariantC;
