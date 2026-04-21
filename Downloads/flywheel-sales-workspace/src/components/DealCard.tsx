import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, RefreshCw, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Deal, dealStages } from "@/data/dealsData";
import SuggestedActionCard from "@/components/SuggestedActionCard";
import DealInsightsCard from "@/components/DealInsightsCard";
import DealContactCard, { DealContact } from "@/components/DealContactCard";
import DealPartnerCard, { DealPartner } from "@/components/DealPartnerCard";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import downCarat from "@/assets/down-carat.png";

interface DealCardProps {
  deal: Deal;
}

const DealCard = ({ deal }: DealCardProps) => {
  const getScoreBadge = () => {
    if (deal.score >= 80) {
      return {
        label: `Score ${deal.score}`,
        style: { background: "var(--color-fill-transitional-progress-success-gradient-color-1, #00823A)" },
        className: "text-white",
      };
    } else if (deal.score >= 60) {
      return {
        label: `Score ${deal.score}`,
        style: { background: "var(--color-fill-caution-default, #FCCB57)" },
        className: "text-black",
      };
    }
    return {
      label: `Score ${deal.score}`,
      style: { background: "#6B7280" },
      className: "text-white",
    };
  };

  const scoreBadge = getScoreBadge();

  // Experimental contact cards for Skyward Solutions
  const dealContacts: DealContact[] = deal.id === "deal-2" ? [
    {
      name: "Danni Carmichael",
      role: "Marketing Director",
      initials: "DC",
      signals: [
        { color: "green", text: "Champion" },
        { color: "yellow", text: "No engagement in last 7 days" },
      ],
      actionDescription: "Confirm approval and send signature email to Danni.",
    },
    {
      name: "Faswillah Nattabi",
      role: "Budget Analyst",
      initials: "FN",
      signals: [
        { color: "green", text: "Budget holder" },
        { color: "yellow", text: "Awaiting follow-up" },
      ],
      actionDescription: "Send recap email with resources and budget path to Faswillah.",
    },
    {
      name: "Richard Elmore",
      role: "VP of Operations",
      initials: "RE",
      signals: [
        { color: "green", text: "Executive sponsor" },
      ],
      actionDescription: "Schedule executive alignment call with Richard to unblock budget approval.",
    },
  ] : deal.id === "deal-3" ? [
    {
      name: "Marta Chen",
      role: "Head of Procurement",
      initials: "MC",
      signals: [
        { color: "green", text: "Decision maker" },
      ],
      actionDescription: "Follow up with Marta on contract terms.",
    },
  ] : [];

  const dealPartner: DealPartner | null = deal.id === "deal-2" ? {
    contactName: "Sander de Grijff",
    contactCompany: "De Grijff Enterprises B.V.",
    contactInitials: "SG",
    dealTeam: ["Sander de Grijff", "Melissa Lucas", "Danny de Grijff"],
    dealType: "Partner Sourced",
    partnerCloseDate: "30 March 2026",
    unreadMessages: 2,
  } : null;


  return (
    <Card className="p-8 mb-4 border border-border rounded shadow-100 flex flex-col gap-8">
      {/* Header - mirrors CompanyCard header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img
              src={companyLogoPlaceholder}
              alt={`${deal.companyName} logo`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h3 className="heading-300 text-text-interactive cursor-pointer hover:text-text-interactive-hover transition-colors mb-1">
                {deal.dealName}
              </h3>
              {deal.companyName !== deal.dealName && (
                <span className="heading-50 text-muted-foreground mb-1">
                  {deal.companyName}
                </span>
              )}
              <p className="body-100 text-muted-foreground flex items-center gap-1">
                <span>{deal.amount}</span>
                <span>•</span>
                <span>{deal.industry}</span>
                <span>•</span>
                <span>{deal.daysInStage} days in {deal.stage}</span>
                {deal.lastEngagement && (
                  <>
                    <span>•</span>
                    <span>Last engagement: {deal.lastEngagement}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Score Badge, Stage Indicators and Insights */}
        <div className="flex flex-col items-end gap-2">
          <div
            className={`flex items-center justify-center px-3 py-1 rounded-full heading-50 ${scoreBadge.className}`}
            style={scoreBadge.style}
          >
            {scoreBadge.label}
          </div>

          {/* Stage Indicator */}
          <div className="flex flex-col items-end gap-1">
            <span className="detail-200 text-muted-foreground">{deal.stage}</span>
            <div className="flex items-center gap-1.5">
              {dealStages.map((stage, index) => {
                const currentIndex = dealStages.indexOf(deal.stage);
                const isCompleted = index <= currentIndex;
                const stageColors = [
                  "#F28B82",
                  "#F28B82",
                  "#E8789A",
                  "#D98CB3",
                  "#CF8DC2",
                  "#C490D1",
                ];
                return (
                  <div
                    key={stage}
                    className="h-1.5 w-8 rounded-full"
                    style={{
                      background: isCompleted
                        ? stageColors[index]
                        : "var(--color-fill-surface-recessed, #F0F0F0)",
                    }}
                  />
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Deal Insights & Suggested Actions - horizontal row */}
      {(deal.insights.length > 0 || (deal.id !== "deal-2" && deal.suggestedActions.length > 0) || dealContacts.length > 0 || dealPartner) && (
        <div className="flex items-stretch gap-4 overflow-x-auto pb-2">
          {deal.id !== "deal-3" && deal.insights.length > 0 && (
            <div className="flex-shrink-0 min-w-[280px] max-w-[320px]">
              <DealInsightsCard insights={deal.insights} variant={deal.id === "deal-2" ? "card" : "default"} />
            </div>
          )}
          {dealContacts.map((contact, idx) => (
            <div key={idx} className="flex-shrink-0 min-w-[280px] max-w-[320px]">
              <DealContactCard contact={contact} />
            </div>
          ))}
          {deal.id !== "deal-2" && deal.id !== "deal-3" && deal.suggestedActions.map((action) => (
            <div key={action.id} className="flex-shrink-0">
              <SuggestedActionCard action={action} />
            </div>
          ))}
          {dealPartner && (
            <div className="flex-shrink-0 min-w-[280px] max-w-[320px]">
              <DealPartnerCard partner={dealPartner} />
            </div>
          )}
        </div>
      )}

      {/* Footer - mirrors CompanyCard footer */}
      <div className="flex items-center justify-between">
        <Button variant="link" className="body-100 text-muted-foreground h-auto p-0">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Help to progress this deal
        </Button>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex min-h-[40px] px-3 justify-center items-center gap-2 rounded border border-transparent bg-transparent heading-50 text-foreground hover:bg-accent/10 transition-colors">
                Actions <img src={downCarat} alt="" className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Update stage</DropdownMenuItem>
              <DropdownMenuItem>Add note</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default DealCard;
