import { AlertTriangle, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCyclePath } from "@/hooks/useCyclePath";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataWell } from "@/components/ui/data-well";
import Tag from "@/components/Tag";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { SignalChipRow } from "@/components/SignalChip";
import AccountDetailBlock from "@/components/installbase/AccountDetailBlock";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import {
  earliestRenewal,
  formatMrr,
  installBaseCompanies,
  seatsRollup,
  totalMrr,
  type IbCompany,
} from "@/data/installBase";

// A short, data-derived "how to work this account" summary. Not a full strategy
// engine — enough to make the takeover feel like a real work surface.
const buildApproach = (c: IbCompany): { headline: string; points: string[] } => {
  const soonest = earliestRenewal(c);
  const points: string[] = [];

  if (c.trigger?.kind === "ql") {
    points.push(
      `Responded to a ${c.trigger.label} — reach out within SLA while intent is hot.`,
    );
  } else if (c.trigger?.kind === "signal") {
    points.push(
      `Intent signal: ${c.trigger.label}. Worth a proactive, personalised touch.`,
    );
  } else {
    points.push("Surfaced by IB Causal Rank as a high-uplift expansion target.");
  }

  if (soonest) {
    points.push(
      `${soonest.name} renews ${soonest.renewalDate} (${soonest.renewalInDays}d) — anchor the conversation to the renewal.`,
    );
  }

  c.portals
    .flatMap((p) => (p.signals ?? []).map((s) => ({ portal: p.name, text: s.text })))
    .slice(0, 2)
    .forEach((w) => points.push(`${w.text} — ${w.portal}.`));

  if (c.contacts[0]) {
    points.push(
      `Start with ${c.contacts[0].name}${c.contacts[0].role ? `, ${c.contacts[0].role}` : ""}.`,
    );
  }

  if (c.csEngagement?.renewalActive) {
    points.push(
      `Renewal motion is active${c.csEngagement.csmName ? ` with ${c.csEngagement.csmName}` : ""} — coordinate before reaching out.`,
    );
  }

  const headline =
    c.trigger?.kind === "ql"
      ? "Hot QL — work now"
      : c.trigger?.kind === "signal"
        ? "Intent signal — nurture toward expansion"
        : "Proactive expansion play";

  return { headline, points };
};

const InstallBaseAccount = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cyclePath } = useCyclePath();

  const company = installBaseCompanies.find((c) => c.id === companyId);

  const state = location.state as { from?: string; fromLabel?: string } | null;
  const backTo = state?.from ?? cyclePath("/prospecting?view=full-customer-book");
  const backLabel = state?.fromLabel ?? "Install Base";

  if (!company) {
    return (
      <div className="flex flex-col h-[var(--page-content-height)] bg-[var(--page-bg)] overflow-hidden">
        <WorkspaceHeader activeTab="prospecting" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center flex flex-col gap-3">
            <p className="body-100 text-muted-foreground">Customer not found.</p>
            <Button variant="secondary" onClick={() => navigate(backTo)}>
              Back to {backLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const approach = buildApproach(company);
  const seats = seatsRollup(company);
  const soonest = earliestRenewal(company);

  return (
    <div className="flex flex-col h-[var(--page-content-height)] bg-[var(--page-bg)] overflow-hidden">
      <WorkspaceHeader activeTab="prospecting" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-6">
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="inline-flex items-center gap-1 body-100 text-text-interactive hover:text-text-interactive-hover self-start"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </button>

          {/* Account header */}
          <Card className="p-8 border border-border rounded shadow-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={company.logo || companyLogoPlaceholder}
                  alt={`${company.name} logo`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <a
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="heading-50 text-text-interactive hover:text-text-interactive-hover transition-colors flex items-center gap-1 mb-1"
                  >
                    {company.website}
                    <TrellisIcon name="externalLink" size={12} />
                  </a>
                  <div className="flex items-baseline gap-2">
                    <h1 className="heading-500 text-foreground">{company.name}</h1>
                    <p className="body-100 text-muted-foreground flex items-center gap-1">
                      <span>{company.industry ?? "—"}</span>
                      <span>•</span>
                      <span>{company.segment}</span>
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    {company.trigger && (
                      <Tag variant={company.trigger.kind === "ql" ? "orange" : "blue"}>
                        {company.trigger.label}
                      </Tag>
                    )}
                    <SignalChipRow
                      signals={company.companySignals}
                      owner={{ kind: "company", id: company.id, name: company.name }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {(company.csEngagement?.csmName || company.csEngagement?.renewalActive) && (
                  <div className="flex items-center gap-1.5 detail-200 text-muted-foreground">
                    {company.csEngagement?.renewalActive && (
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-trellis-orange-800" />
                    )}
                    <span>
                      {[
                        company.csEngagement?.csmName
                          ? `CSM: ${company.csEngagement.csmName}`
                          : null,
                        company.csEngagement?.renewalActive
                          ? "Renewal in progress"
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={() => toast.success("Create IB deal")}
                  >
                    Create IB deal
                  </Button>
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => toast.success("Opens targeted outreach")}
                  >
                    Start targeted outreach
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Account roll-up */}
          <div className="grid grid-cols-4 gap-4">
            <DataWell
              label="Total MRR"
              value={formatMrr(totalMrr(company))}
              tooltip="Combined MRR across this customer's portals"
            />
            <DataWell
              label="Portals"
              value={`${company.portals.length}`}
              tooltip="HubSpot portals on this account"
            />
            <DataWell
              label="Seats active"
              value={`${seats.active} / ${seats.licensed}`}
              tooltip="Active vs. licensed seats across portals"
            />
            <DataWell
              label="Next renewal"
              value={soonest ? `${soonest.renewalInDays}d` : "—"}
              secondary={soonest?.renewalDate}
              tooltip="Soonest portal renewal"
            />
          </div>

          {/* Recommended approach */}
          <Card className="p-6 border border-border rounded shadow-100 flex flex-col gap-3">
            <span className="heading-100 text-foreground">Recommended approach</span>
            <p className="body-125 text-foreground">{approach.headline}</p>
            <ul className="list-disc pl-5 body-100 text-muted-foreground space-y-1">
              {approach.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Card>

          {/* Portals + contacts */}
          <Card className="p-8 border border-border rounded shadow-100">
            <AccountDetailBlock
              company={company}
              onWork={() => toast.success("Opens targeted outreach")}
              onContactClick={() => toast.success("Opens contact record")}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstallBaseAccount;
