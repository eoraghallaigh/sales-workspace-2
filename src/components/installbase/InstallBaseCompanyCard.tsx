import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Tag from "@/components/Tag";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { SignalChipRow } from "@/components/SignalChip";
import AccountDetailBlock from "@/components/installbase/AccountDetailBlock";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { type IbCompany } from "@/data/installBase";

const CsEngagement = ({
  csmName,
  renewalActive,
}: {
  csmName?: string;
  renewalActive?: boolean;
}) => {
  if (!csmName && !renewalActive) return null;
  const parts = [
    csmName ? `CSM: ${csmName}` : null,
    renewalActive ? "Renewal in progress" : null,
  ].filter(Boolean);
  return (
    <div className="flex items-center gap-1.5 detail-200 text-muted-foreground">
      {renewalActive && (
        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-trellis-orange-800" />
      )}
      <span>{parts.join(" · ")}</span>
    </div>
  );
};

interface InstallBaseCompanyCardProps {
  company: IbCompany;
  onWork: () => void;
  onContactClick?: (contactId: string) => void;
}

const InstallBaseCompanyCard = ({
  company,
  onWork,
  onContactClick,
}: InstallBaseCompanyCardProps) => {
  return (
    <Card className="p-8 mb-4 border border-border rounded shadow-100 flex flex-col gap-6">
      {/* Header */}
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
              <h3
                className="heading-300 text-text-interactive cursor-pointer hover:text-text-interactive-hover transition-colors"
                onClick={onWork}
              >
                {company.name}
              </h3>
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

        <div className="flex flex-col items-end gap-2">
          <CsEngagement
            csmName={company.csEngagement?.csmName}
            renewalActive={company.csEngagement?.renewalActive}
          />
        </div>
      </div>

      {/* Account detail block — portal(s) + curated contacts (always open). */}
      <AccountDetailBlock
        company={company}
        onWork={onWork}
        onContactClick={onContactClick}
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Button variant="link" className="body-100 text-foreground h-auto p-0">
          View account details
        </Button>
        <Button variant="primary" size="medium" onClick={onWork}>
          Work
        </Button>
      </div>
    </Card>
  );
};

export default InstallBaseCompanyCard;
