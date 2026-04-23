import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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

interface CompanyCardVariantCProps {
  company: Company;
  strategyHint: string;
  rank?: number;
  onCompanyClick?: () => void;
  completedTasks?: Set<string>;
}

const getFallbackWhyNow = (company: Company): string => {
  if (company.conversionTrigger) return company.conversionTrigger;
  return "Ranked by urgency + account potential";
};

const getSubtleAvatarStyles = (avatarColor: string): { background: string; color: string } => {
  const mapping: Record<string, { background: string; color: string }> = {
    "bg-trellis-purple-600": {
      background: "var(--color-fill-accent-purple-subtle-alt, #F4EDF6)",
      color: "var(--color-border-accent-purple-default, #7C3AED)",
    },
    "bg-trellis-blue-600": {
      background: "var(--color-fill-accent-blue-subtle-alt, #EAF1FB)",
      color: "var(--color-border-accent-blue-default, #2563EB)",
    },
    "bg-trellis-green-600": {
      background: "var(--color-fill-accent-green-subtle-alt, #EDF4EF)",
      color: "var(--color-border-accent-green-default, #00823A)",
    },
    "bg-trellis-orange-600": {
      background: "var(--color-fill-brand-subtle, #FDEFE9)",
      color: "var(--color-border-brand-default, #C93700)",
    },
    "bg-trellis-yellow-600": {
      background: "var(--color-fill-caution-subtle, #FEF5DA)",
      color: "var(--color-border-caution-default, #A17D00)",
    },
    "bg-trellis-teal-600": {
      background: "var(--color-fill-accent-teal-subtle-alt, #E5F2F4)",
      color: "var(--color-border-accent-teal-default, #007A87)",
    },
    "bg-trellis-pink-600": {
      background: "var(--color-fill-accent-pink-subtle-alt, #FBEAF1)",
      color: "var(--color-border-accent-pink-default, #C2185B)",
    },
  };
  return (
    mapping[avatarColor] ?? {
      background: "var(--color-fill-accent-blue-subtle-alt, #EAF1FB)",
      color: "var(--color-border-accent-blue-default, #2563EB)",
    }
  );
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
}: CompanyCardVariantCProps) => {
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);

  const statusBadge = getStatusBadge(company.status);

  const touchStatuses = [...(company.touches.touchStatuses || [])];
  while (touchStatuses.length < 5) touchStatuses.push("empty");
  const displayedTouchStatuses = touchStatuses.slice(0, 5);

  const displayedSignals = company.signals.slice(0, 2);
  const fallbackWhyNow = displayedSignals.length === 0 ? getFallbackWhyNow(company) : null;
  const displayedContacts = company.recommendedContacts.slice(0, 3);
  const extraCount = Math.max(0, company.recommendedContacts.length - 3);

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

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="heading-200 text-text-interactive truncate">
            {company.name}
          </span>
          <span className="detail-200 text-muted-foreground whitespace-nowrap">
            · {company.industry ?? "—"} · PVS {company.pvsScore ?? "—"}
          </span>
          <span className="detail-200 text-muted-foreground whitespace-nowrap truncate">
            {displayedSignals.length > 0
              ? `· ${displayedSignals.map((s) => s.text).join(" · ")}`
              : `· ${fallbackWhyNow}`}
          </span>
        </div>

        <HoverCard openDelay={120} closeDelay={80}>
          <HoverCardTrigger asChild>
            <div
              className="flex items-center gap-2 flex-shrink-0 rounded px-1 -mx-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex -space-x-2">
                {displayedContacts.map((contact) => {
                  const subtle = getSubtleAvatarStyles(contact.avatarColor);
                  return (
                    <Avatar
                      key={contact.id}
                      className="h-7 w-7 border-2 border-card"
                      style={{ background: subtle.background }}
                    >
                      <AvatarFallback
                        className="text-xs font-medium"
                        style={{ background: subtle.background, color: subtle.color }}
                      >
                        {contact.initials}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
              {extraCount > 0 && (
                <span className="detail-200 text-muted-foreground">
                  +{extraCount}
                </span>
              )}
            </div>
          </HoverCardTrigger>
          {displayedContacts.length > 0 && (
            <HoverCardContent align="end" className="w-[360px] p-4">
              <div className="flex flex-col gap-6">
                <div className="detail-200 font-semibold text-muted-foreground uppercase tracking-wide">
                  Strategy preview
                </div>
                {displayedContacts.map((contact) => (
                  <div key={contact.id} className="flex items-start gap-3">
                    <img
                      src={companyLogoPlaceholder}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                      <span className="heading-100 text-foreground">
                        {contact.name}
                      </span>
                      <span className="detail-200 text-muted-foreground">
                        {contact.role}
                      </span>
                      <span className="body-100 text-foreground">
                        {getApproachFor(contact.role)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </HoverCardContent>
          )}
        </HoverCard>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1">
            {displayedTouchStatuses.map((status, index) => (
              <div
                key={index}
                className="h-3 w-3 rounded-full"
                style={{
                  background:
                    status === "completed"
                      ? "var(--color-fill-transitional-progress-success-gradient-color-1, #00823A)"
                      : status === "scheduled"
                        ? "var(--color-fill-transitional-progress-warning, #F5A623)"
                        : "var(--color-fill-surface-recessed, #F0F0F0)",
                }}
              />
            ))}
          </div>
          <span className="detail-200 text-muted-foreground whitespace-nowrap">
            due {company.touches.deadline}
          </span>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>

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
