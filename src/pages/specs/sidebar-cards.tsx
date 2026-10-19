import type { ReactNode } from "react";
import { SpecLayout } from "./SpecLayout";
import { SpecHeader, SpecSection, StateCard, Callout } from "./blocks";
import PortalsCard from "@/components/PortalsCard";
import PortalsCardFSC from "@/components/PortalsCardFSC";
import PortalsEmptyState from "@/components/PortalsEmptyState";
import { getFscPortalsCardData, getPortalsCardData, getProspectPortalsCardData } from "@/data/installBase";

/* ── Portals panel: the "Portals" sidebar card as it appears in the right
   column of an install base company record (same chrome as the record page's
   InfoCard, rendered open). ─────────────────────────────────────────────── */

const PortalsPanel = ({ children }: { children: ReactNode }) => (
  <div className="w-[920px] bg-fill-secondary rounded-300 border border-core-subtle shadow-100 flex flex-col overflow-hidden">
    <div className="px-6 py-6 shrink-0 border-b border-border-subtle">
      <h2 className="heading-100 text-foreground">Portals</h2>
    </div>
    <div className="px-6 py-4">{children}</div>
  </div>
);

const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="body-100 text-text-interactive hover:underline break-all"
  >
    {children}
  </a>
);

const Bullet = ({ children }: { children: ReactNode }) => (
  <li className="body-100 text-foreground leading-relaxed">{children}</li>
);

/* ── Real card data — a legacy (Hub-based) customer and an FSC customer. ─── */
const LEGACY_PORTALS = getPortalsCardData("brightpath-studio");
const FSC_PORTALS = getFscPortalsCardData("harbor-dental");
const PROSPECT_PORTALS = getProspectPortalsCardData("1");

const SidebarCardsSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Sidebar Cards"
      description="The Portals card on install base (customer) company records — one place for a customer's portal usage, subscriptions, and the HubSpot, customer, and partner teams working the account. It ships in two versions during the move to the Flexible Seats & Credits (FSC) billing model."
    />

    <SpecSection
      title="Overview"
      description="The Portals card appears in the right column of an install base company record. Each portal the customer owns is shown with its usage, its recurring subscriptions, and the teams assigned to it (teams are assigned per portal). A company can have multiple portals; when it does, each portal is a collapsible section."
    >
      <Callout type="info">
        We are migrating customers to Flexible Seats &amp; Credits (FSC), where customers buy seats
        and credits rather than Hubs. For a transition period some customers are on FSC and some are
        not, so there are two versions of the card. Legacy (non-FSC) customers see the Hub-based
        version; FSC customers see the FSC version. Under FSC a portal has a single edition; legacy
        portals can carry multiple Hubs, each at its own edition.
      </Callout>
      <Callout type="behavior">
        In the Customer team and Partner team sections, names link out to their CRM records — each
        shown with a trailing external-link icon. Customer contacts and partner primary contacts open
        the contact record; the partner name opens the partner object record. Clicking a HubSpot team
        name instead opens a popover with that person's details — avatar, job title, email, and Slack —
        rather than navigating to a record (so those names don't carry the external-link icon).
      </Callout>
    </SpecSection>

    <SpecSection
      title="Legacy (non-FSC) portal card — full view"
      description="Shown for customers still on Hub-based billing. Top to bottom: portal usage (the Hub Summary), recurring subscriptions with an expandable inactive-items list, and the HubSpot / Customer / Partner teams."
    >
      <StateCard
        label="Non-FSC portal card"
        description="Usage leads with key facts and the Tiers limits (contacts, seats, CRM contacts, emails). Subscription line items are Hubs and add-ons."
      >
        <PortalsPanel>
          <PortalsCard portals={LEGACY_PORTALS} />
        </PortalsPanel>
      </StateCard>
    </SpecSection>

    <SpecSection
      title="FSC portal card — full view"
      description="Shown for customers on Flexible Seats & Credits. Same shape as the legacy card, but the usage section's Tiers limits are replaced by a Credits & Capacity view, and the subscription items are seats and capacity packs."
    >
      <StateCard
        label="FSC portal card"
        description="The portal carries a single edition (shown as a badge in the header). Credits & Capacity shows capacity limits and a billed/non-billed credit usage breakdown. Subscriptions list GTM seats and capacity packs, plus a One-time fee subscriptions section."
      >
        <PortalsPanel>
          <PortalsCardFSC portals={FSC_PORTALS} />
        </PortalsPanel>
      </StateCard>
    </SpecSection>

    <SpecSection
      title="Net-new prospects — free portal"
      description="Net-new prospects (not yet customers) reuse the Portals card as a free-portal variant. It replaces the old standalone Hub Summary card on the prospect record. Prospect portals are free, so there is no recurring subscription (0 MRR) and no HubSpot or partner team — just the usage and a Customer team of the buying contacts."
    >
      <StateCard
        label="Prospect portal card (free)"
        description="Usage (the Hub Summary) plus a Customer team (primary contact and decision maker). No subscriptions, HubSpot team, or partner team."
      >
        <PortalsPanel>
          <PortalsCard portals={PROSPECT_PORTALS} />
        </PortalsPanel>
      </StateCard>

      <StateCard
        label="No portal (empty state)"
        description="Common for net-new prospects who don't have a HubSpot portal. When empty, the Portals card drops to the bottom of the right-column card stack."
      >
        <PortalsPanel>
          <PortalsEmptyState />
        </PortalsPanel>
      </StateCard>
    </SpecSection>

    <SpecSection
      title="What's different under FSC"
      description="The two versions share the header, subscriptions layout, and team sections. The differences are:"
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <ul className="flex flex-col gap-3 list-disc pl-5">
          <Bullet>
            <strong>Tiers limits → Credits &amp; Capacity.</strong> The "Tiers limits" block does not
            appear. In its place is a Credits &amp; Capacity view: capacity limits (GTM Seats, HubSpot
            Credits, Records, Calling, Custom Events, Email Sends, Workflow Actions, and so on) stacked
            above a "Credit usage by feature category" breakdown showing billed vs non-billed credits
            over a date range.
          </Bullet>
          <Bullet>
            <strong>Single portal-level edition.</strong> An FSC portal has one edition for the whole
            portal (shown as a badge next to the Hub ID). Legacy portals can have several Hubs, each at
            its own edition.
          </Bullet>
          <Bullet>
            <strong>Subscription line items.</strong> Items are seats and capacity packs (e.g. "3 GTM
            Seats (Professional)", "Growth Workflow Actions Capacity Pack"), not Hub subscriptions. A
            "One-time fee subscriptions" section sits below the recurring subscriptions.
          </Bullet>
          <Bullet>
            <strong>Usage intent playbook.</strong> This key fact is not shown on FSC portals.
          </Bullet>
        </ul>
      </div>
    </SpecSection>

    <SpecSection
      title="Where the data comes from"
      description="This prototype uses mocked data. For the real build, the card's data already exists in product today and should be sourced from these places:"
    >
      <div className="flex flex-col gap-5">
        <StateCard
          label="Non-FSC card — Hub Summary card on the company record"
          description="Everything on the non-FSC portal card comes from the existing Hub Summary card found on the company record: portal usage, tiers limits, usage-over-time, integrations, trials, and the subscription detail."
        >
          <ExternalLink href="https://app.hubspot.com/contacts/53/record/0-2/1710376822">
            Example company record — app.hubspot.com/contacts/53/record/0-2/1710376822
          </ExternalLink>
        </StateCard>

        <StateCard
          label="FSC credit usage & capacity — the portal record"
          description="The credit usage and capacity data (the Credits & Capacity view that replaces Tiers limits) comes from the portal records of customers already on FSC."
        >
          <ExternalLink href="https://app.hubspot.com/contacts/53/record/2-5945472/1357911972?eschref=%2Fcontacts%2F53%2Fobjects%2F2-5945472%2Fviews%2Fall%2Flist">
            Example FSC portal record — app.hubspot.com/contacts/53/record/2-5945472/1357911972
          </ExternalLink>
        </StateCard>
      </div>
    </SpecSection>
  </SpecLayout>
);

export default SidebarCardsSpec;
