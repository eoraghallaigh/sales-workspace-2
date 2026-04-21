import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

export interface DealPartner {
  contactName: string;
  contactCompany: string;
  contactInitials: string;
  dealTeam: string[];
  dealType: "Partner Sourced" | "Partner Assisted";
  partnerCloseDate: string;
  unreadMessages: number;
}

interface DealPartnerCardProps {
  partner: DealPartner;
  onContactClick?: () => void;
  onMessagesClick?: () => void;
}

const DealPartnerCard = ({ partner, onContactClick, onMessagesClick }: DealPartnerCardProps) => {
  return (
    <div className="flex h-full flex-col border border-border rounded-lg bg-white min-w-[280px] max-w-[320px] overflow-hidden shadow-100">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 rounded-t-lg"
        style={{ background: "var(--color-fill-secondary-hover)" }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={companyLogoPlaceholder} alt={`${partner.contactCompany} logo`} />
            <AvatarFallback>{partner.contactCompany.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="link-200">{partner.contactCompany}</div>
            <div className="detail-200 text-muted-foreground">Partner</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 py-5 gap-5">
        {/* Deal team */}
        <div className="flex flex-col gap-1">
          <span className="detail-200 text-muted-foreground">Deal team</span>
          <div className="flex flex-col">
            {partner.dealTeam.map((name, idx) => (
              <span key={idx} className="body-100 text-text-interactive cursor-pointer hover:underline">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Deal type & Partner close date */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-1">
            <span className="detail-200 text-muted-foreground">Deal type</span>
            <span className="body-100 text-foreground">{partner.dealType}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="detail-200 text-muted-foreground">Close date</span>
            <span className="body-100 text-foreground">{partner.partnerCloseDate}</span>
          </div>
        </div>

        {/* Shared messages */}
        {partner.unreadMessages > 0 && (
          <div
            className="flex items-center gap-2 mt-auto cursor-pointer"
            onClick={onMessagesClick}
          >
            <Mail className="h-4 w-4 text-text-interactive" />
            <span className="body-100 !font-bold text-text-interactive">
              {partner.unreadMessages} unread shared message{partner.unreadMessages !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealPartnerCard;
