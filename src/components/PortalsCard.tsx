import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type {
  CustomerTeamRole,
  PartnerTeamRow,
  PortalCardData,
  PortalHubSpotTeam,
  TeamContact,
} from "@/data/installBase";
import { Separator } from "@/components/ui/separator";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import HubSummaryCard from "@/components/HubSummaryCard";
import HubSpotMemberLink from "@/components/HubSpotMemberLink";
import PortalSubscriptions from "@/components/PortalSubscriptions";

interface PortalsCardProps {
  portals: PortalCardData[];
}

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

const ViewPortalLink = () => (
  <button
    type="button"
    onClick={() => toast.success("Opens portal")}
    className="link-100 text-text-interactive hover:underline flex items-center gap-1 whitespace-nowrap shrink-0"
  >
    View Portal
    <TrellisIcon name="externalLink" size={12} />
  </button>
);

const PortalBody = ({ portal }: { portal: PortalCardData }) => (
  <div className="flex flex-col gap-6">
    <HubSummaryCard summary={portal.summary} hidePortalLinks />
    <Separator />
    <PortalSubscriptions subscription={portal.subscription} />
    <Separator />
    <HubSpotTeamSection team={portal.team.hubSpot} />
    <Separator />
    <CustomerTeamSection roles={portal.team.customer} />
    <Separator />
    <PartnerTeamSection partners={portal.team.partners} />
  </div>
);

const PortalsCard = ({ portals }: PortalsCardProps) => {
  if (portals.length === 0) return null;

  // A single portal renders flat with a plain header; multiple portals collapse
  // into per-portal sections. Either way the Hub ID + "View Portal" link sit in
  // the portal header, so each portal stays identified by its ID.
  if (portals.length === 1) {
    const portal = portals[0];
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 pr-4">
          <span className="heading-100 text-foreground truncate">Hub ID: {portal.id}</span>
          <ViewPortalLink />
        </div>
        <PortalBody portal={portal} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {portals.map((portal, i) => (
        <Collapsible key={portal.id} defaultOpen={i === 0}>
          <div className="flex w-full items-center justify-between gap-3 pr-4 py-3">
            <CollapsibleTrigger className="group flex items-center gap-2 min-w-0 text-left">
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-data-[state=closed]:-rotate-90" />
              <span className="heading-100 text-foreground truncate">Hub ID: {portal.id}</span>
            </CollapsibleTrigger>
            <ViewPortalLink />
          </div>
          <CollapsibleContent className="px-1 pt-4 pb-2">
            <PortalBody portal={portal} />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default PortalsCard;
