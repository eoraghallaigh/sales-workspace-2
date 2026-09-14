import ContactStrip from "@/components/installbase/ContactStrip";
import PortalBlock from "@/components/installbase/PortalBlock";
import { type IbCompany } from "@/data/installBase";

// The shared account detail block — portal(s) + curated contacts. Rendered
// always-open inside the P1/P3 card, and inline (on expand) inside the P2/P4
// table row, so both views show identical detail. See .context/ib-ppf-design.md.
interface AccountDetailBlockProps {
  company: IbCompany;
  onWork: () => void;
  onContactClick?: (contactId: string) => void;
}

const AccountDetailBlock = ({
  company,
  onWork,
  onContactClick,
}: AccountDetailBlockProps) => (
  <div className="flex flex-col gap-6">
    {/* Portal(s). Single portal renders as a strip; multi-portal leads with the
        primary portal + a "N more" expander. */}
    <div className="flex flex-col gap-3">
      <span className="heading-100 text-foreground">
        {company.portals.length === 1 ? "Portal" : "Portals"}
      </span>
      <PortalBlock portals={company.portals} />
    </div>

    {/* Curated contacts */}
    <ContactStrip
      company={company}
      onWork={onWork}
      onContactClick={onContactClick}
    />
  </div>
);

export default AccountDetailBlock;
