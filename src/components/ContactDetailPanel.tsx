import type { ReactNode } from "react";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactDetailSections from "@/components/ContactDetailSections";
import { ContactDetail } from "@/data/contactDetails";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { SignalChipRow } from "@/components/SignalChip";
import type { SignalInstance, SignalOwner } from "@/data/signals";
import type { ContactDossier } from "@/data/contactDossier";

interface ContactDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactDetail;
  companyLogo?: string;
  actionsRow?: ReactNode;
  showDeals?: boolean;
  signals?: SignalInstance[];
  signalsOwner?: SignalOwner;
  dossier?: ContactDossier;
}

const ContactDetailPanel = ({
  isOpen,
  onClose,
  contact,
  companyLogo,
  actionsRow,
  showDeals,
  signals,
  signalsOwner,
  dossier,
}: ContactDetailPanelProps) => {
  const logo = companyLogo || companyLogoPlaceholder;

  return (
    <div
      className={`fixed top-[76px] right-0 h-[var(--page-content-height)] bg-white z-40 transition-transform duration-300 overflow-y-auto shadow-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "569px" }}
    >
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-5 border-b border-border">
        <h2 className="heading-400 text-foreground">{contact.name}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-6 w-6 text-foreground" />
        </Button>
      </div>

      <div className="px-6 py-6 border-border">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <img
              src={logo}
              alt={`${contact.company} logo`}
              className="h-20 w-20 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="heading-400 text-foreground mb-2">{contact.name}</h3>
              <div className="body-100 text-foreground mb-1">{contact.role}</div>
              <div className="body-100 text-muted-foreground mb-1">{contact.company}</div>
              <div className="body-100 text-foreground">{contact.phone}</div>
            </div>
          </div>

          <Button
            variant="link"
            className="body-100 text-[#8B1538] p-0 h-auto hover:no-underline flex items-center gap-1"
          >
            View record <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {actionsRow && <div className="flex items-start gap-4">{actionsRow}</div>}
      </div>

      {signals && signals.length > 0 && (
        <div className="px-6 pb-6 border-b border-border">
          <p className="heading-50 text-muted-foreground mb-3">Intent signals</p>
          <SignalChipRow signals={signals} owner={signalsOwner} />
        </div>
      )}

      <ContactDetailSections contact={contact} companyLogo={logo} showDeals={showDeals} dossier={dossier} />
    </div>
  );
};

export default ContactDetailPanel;
