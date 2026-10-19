import { toast } from "sonner";
import type {
  CustomerTeamRole,
  PartnerTeamRow,
  PortalHubSpotTeam,
  PortalTeam,
  TeamContact,
} from "@/data/installBase";
import { Separator } from "@/components/ui/separator";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import HubSpotMemberLink from "@/components/HubSpotMemberLink";

// The HubSpot / Customer / Partner team sections, shared by the legacy and FSC
// portal cards. (The legacy PortalsCard keeps its own copy; this is the reusable
// version used by the FSC card.)

const linkClass =
  "text-left text-[var(--color-specialty-text-core-alt-default)] hover:underline";

const PersonLink = ({ name, external }: { name: string; external?: boolean }) => (
  <button
    type="button"
    onClick={() => toast.success(`Opens ${name}`)}
    className={`link-100 inline-flex items-center gap-1 ${linkClass}`}
  >
    {name}
    {external && <TrellisIcon name="externalLink" size={11} />}
  </button>
);

// Customer and partner contact names link out to the contact record.
const ContactCell = ({ contact }: { contact: TeamContact }) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <PersonLink name={contact.name} external />
    {contact.email && (
      <span className="detail-200 text-muted-foreground truncate">{contact.email}</span>
    )}
  </div>
);

const TeamPerson = ({ name, role }: { name: string; role: string }) => (
  <div className="flex items-center gap-2 body-100">
    <HubSpotMemberLink name={name} role={role} />
    <span className="text-muted-foreground">|</span>
    <span className="text-foreground">{role}</span>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="heading-200 text-foreground">{children}</h3>
);

const HubSpotTeamSection = ({ team }: { team: PortalHubSpotTeam }) => (
  <section className="flex flex-col gap-4">
    <SectionTitle>HubSpot team</SectionTitle>
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        <h4 className="heading-100 text-foreground">Sales team</h4>
        <TeamPerson name={team.salesOwner} role="Sales Owner" />
        <TeamPerson name={team.contractManager} role="Contract Manager" />
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="heading-100 text-foreground">Success team</h4>
        <TeamPerson name={team.successOwner} role="Success Owner" />
      </div>
    </div>
  </section>
);

const CustomerTeamSection = ({ roles }: { roles: CustomerTeamRole[] }) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-center justify-between gap-4">
      <SectionTitle>Customer team</SectionTitle>
      <button
        type="button"
        onClick={() => toast.success("Opens all portal users")}
        className={`link-100 ${linkClass}`}
      >
        View all portal users
      </button>
    </div>
    <div>
      <div className="grid grid-cols-3 gap-4 pb-2 border-b border-border detail-200 text-muted-foreground">
        <span>HubSpot role</span>
        <span className="col-span-2">Customer contact</span>
      </div>
      {roles.map((r) => (
        <div
          key={r.role}
          className="grid grid-cols-3 gap-4 py-4 items-center border-b border-border-subtle last:border-b-0"
        >
          <span className="heading-100 text-foreground">{r.role}</span>
          <div className="col-span-2 flex flex-col gap-3">
            {r.contacts.map((c) => (
              <ContactCell key={`${r.role}-${c.name}`} contact={c} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const PartnerTeamSection = ({ partners }: { partners: PartnerTeamRow[] }) => (
  <section className="flex flex-col gap-4">
    <SectionTitle>Partner team</SectionTitle>
    <div>
      <div className="grid grid-cols-3 gap-4 pb-2 border-b border-border detail-200 text-muted-foreground">
        <span>Type</span>
        <span>Partner</span>
        <span>Primary contact</span>
      </div>
      {partners.map((p) => (
        <div
          key={`${p.type}-${p.partner}`}
          className="grid grid-cols-3 gap-4 py-4 items-start border-b border-border-subtle last:border-b-0"
        >
          <div className="flex flex-col gap-0.5">
            <span className="heading-100 text-foreground">{p.type}</span>
            {p.hubs && <span className="detail-200 text-muted-foreground">{p.hubs}</span>}
          </div>
          <PersonLink name={p.partner} external />
          <ContactCell contact={p.contact} />
        </div>
      ))}
    </div>
  </section>
);

const PortalTeams = ({ team }: { team: PortalTeam }) => (
  <>
    <HubSpotTeamSection team={team.hubSpot} />
    <Separator />
    <CustomerTeamSection roles={team.customer} />
    <Separator />
    <PartnerTeamSection partners={team.partners} />
  </>
);

export default PortalTeams;
