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
import { getOutreachState } from "@/data/outreachStates";
import { TrellisIcon, type TrellisIconName } from "@/components/ui/trellis-icon";
import { MiniTouchDots, type TouchStatus } from "@/components/TouchDot";
import PvsTooltip from "@/components/PvsTooltip";

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
            · {company.industry ?? "—"} ·{" "}
            <PvsTooltip pvsScore={company.pvsScore}>
              <span className="cursor-default">
                PVS {company.pvsScore ?? "—"}
              </span>
            </PvsTooltip>
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
          {(() => {
            const targets = company.recommendedContacts.slice(0, 3);
            if (targets.length === 0) return null;

            type Tone = "positive" | "awaiting" | "none";
            const POS = "var(--color-fill-accent-green-default)";
            const AWAIT = "var(--color-fill-accent-green-subtle)";
            const NONE = "var(--color-fill-surface-recessed)";
            const dotFor = (t: Tone) => (t === "positive" ? POS : t === "awaiting" ? AWAIT : NONE);

            const channelStatus = (
              c: (typeof targets)[number],
            ): Array<{ icon: TrellisIconName; status: string; tone: Tone }> => {
              const firstName = c.name.split(" ")[0];
              const s = getOutreachState(c.id, firstName);
              const rows: Array<{ icon: TrellisIconName; status: string; tone: Tone }> = [];

              switch (s.call.kind) {
                case "not-attempted":
                  rows.push({ icon: "calling", status: "Not started", tone: "none" });
                  break;
                case "no-answer":
                  rows.push({ icon: "calling", status: "No answer", tone: "awaiting" });
                  break;
                case "voicemail":
                  rows.push({ icon: "calling", status: "Voicemail", tone: "awaiting" });
                  break;
                case "connected":
                  rows.push({ icon: "calling", status: "Connected", tone: "positive" });
                  break;
              }

              switch (s.linkedin.kind) {
                case "not-sent":
                  rows.push({ icon: "linkedin", status: "Not started", tone: "none" });
                  break;
                case "pending":
                  rows.push({ icon: "linkedin", status: "Awaiting response", tone: "awaiting" });
                  break;
                case "accepted":
                  rows.push({ icon: "linkedin", status: "Accepted", tone: "positive" });
                  break;
                case "declined":
                  rows.push({ icon: "linkedin", status: "No response", tone: "awaiting" });
                  break;
                case "already-connected":
                  rows.push({ icon: "linkedin", status: "Already connected", tone: "positive" });
                  break;
              }

              switch (s.sequence.kind) {
                case "not-enrolled":
                  rows.push({ icon: "email", status: "Not enrolled", tone: "none" });
                  break;
                case "active":
                  rows.push({ icon: "email", status: "Active", tone: "awaiting" });
                  break;
                case "completed":
                  rows.push({ icon: "email", status: "Completed", tone: "awaiting" });
                  break;
                case "unenrolled": {
                  const reason = s.sequence.reason;
                  const status = reason.includes("replied")
                    ? "Replied"
                    : reason.includes("LinkedIn")
                    ? "Ended via LinkedIn"
                    : reason.includes("call")
                    ? "Ended via call"
                    : "Ended";
                  rows.push({ icon: "email", status, tone: "positive" });
                  break;
                }
              }
              return rows;
            };

            return (
              <HoverCardContent align="end" className="w-[340px] p-4">
                <div className="flex flex-col gap-4">
                  <div className="detail-200 font-semibold text-muted-foreground uppercase tracking-wide">
                    Outreach summary
                  </div>
                  {targets.map((c) => {
                    const subtle = getSubtleAvatarStyles(c.avatarColor);
                    const rows = channelStatus(c);
                    const allPristine = rows.every((r) => r.tone === "none");
                    return (
                      <div key={c.id} className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 flex-shrink-0">
                            <AvatarFallback
                              className="text-[10px] font-medium"
                              style={{ background: subtle.background, color: subtle.color }}
                            >
                              {c.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="heading-50 text-foreground">{c.name}</span>
                          <span className="detail-200 text-muted-foreground truncate">
                            · {c.role}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 pl-7">
                          {allPristine ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                                style={{ background: NONE }}
                              />
                              <span className="detail-200 text-muted-foreground">
                                Outreach not started
                              </span>
                            </div>
                          ) : (
                            rows.map((r) => (
                              <div key={r.icon} className="flex items-center gap-2">
                                <TrellisIcon name={r.icon} size={12} className="text-muted-foreground" />
                                <div
                                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                                  style={{ background: dotFor(r.tone) }}
                                />
                                <span className="detail-200 text-foreground truncate">
                                  {r.status}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </HoverCardContent>
            );
          })()}
        </HoverCard>

        <div className="flex items-center gap-3 flex-shrink-0">
          <MiniTouchDots statuses={displayedTouchStatuses as TouchStatus[]} />
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
