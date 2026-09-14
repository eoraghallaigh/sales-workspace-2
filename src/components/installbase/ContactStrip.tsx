import { toast } from "sonner";
import ContactCard from "@/components/ContactCard";
import { type IbCompany } from "@/data/installBase";

// The curated-contacts strip for an account — a horizontally scrolling row of
// contact cards under a "Contacts" heading. Shared by the always-open account
// card (AccountDetailBlock) and the install-base table's expanded row, so both
// surfaces render contacts identically.
interface ContactStripProps {
  company: IbCompany;
  onWork: () => void;
  onContactClick?: (contactId: string) => void;
  /** Show the "Contacts" heading. Off in the table, where the recommended-
   *  contacts link above already labels the tray. */
  showHeading?: boolean;
}

const ContactStrip = ({
  company,
  onWork,
  onContactClick,
  showHeading = true,
}: ContactStripProps) => (
  <div className="flex flex-col gap-3 mb-4">
    {showHeading && <span className="heading-100 text-foreground">Contacts</span>}
    <div className="flex items-stretch gap-4 overflow-x-auto py-1 -my-1 px-1 -mx-1 mt-1">
      {company.contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          companyLogo={company.logo}
          onContactClick={onContactClick}
          onWorkQLClick={onWork}
          onCallClick={() =>
            toast.success("Opens targeted outreach for this contact")
          }
          onEmailClick={() =>
            toast.success("Opens targeted outreach for this contact")
          }
        />
      ))}
    </div>
  </div>
);

export default ContactStrip;
