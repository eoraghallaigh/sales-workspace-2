import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  Callout,
} from "./blocks";
import InstallBaseView from "@/components/installbase/InstallBaseView";
import InstallBaseTable from "@/components/installbase/InstallBaseTable";
import InstallBaseContactsTable from "@/components/installbase/InstallBaseContactsTable";
import ContactStrip from "@/components/installbase/ContactStrip";
import {
  installBaseByTier,
  installBaseCompanies,
  type IbCompany,
} from "@/data/installBase";

const noop = () => {};
const byId = (id: string) =>
  installBaseCompanies.find((c) => c.id === id) as IbCompany;

// Northwind = P1, multi-portal, QL trigger — used to depict the contacts tray.
const MULTI = byId("northwind-traders");

// A slice of P2 for the table (includes Atlas Freight, a multi-portal account).
const TABLE_COMPANIES = installBaseByTier("P2").slice(0, 4);

// One customer per tier, for the all-tiers Full Customer Book.
const BOOK_COMPANIES = [
  "northwind-traders",
  "summit-gear",
  "coastal-media-group",
  "harbor-dental",
].map(byId);

const InstallBasePpfSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Install Base PPF — customer accounts"
      description="Rendering install base (customer) accounts in the prospecting workspace under the same P1–P4 Prospect Prioritisation Framework as Net New. A customer is an account with one or more HubSpot portals — each portal carries its own MRR, usage, seats, credits and renewal, and is the trigger for a rep to reach out — plus a curated set of contacts."
    />

    {/* ── Prioritisation model ──────────────────────────────────── */}
    <SpecSection
      title="Prioritisation model"
      description="Every customer in the rep's book is placed in one of four tiers. The rep does not set the tier — a data-science model (IB Causal Rank) plus intent triggers do."
    >
      <Callout type="info">
        <strong>P1</strong> — customers whose trigger is a <strong>QL</strong>
        (the highest-value triggers, same QLs used in Net New). &nbsp;
        <strong>P3</strong> — customers whose trigger is a{" "}
        <strong>non-QL intent signal</strong> (valuable, below the QL bar).
        &nbsp;<strong>P2</strong> — the top 25 remaining customers by{" "}
        <strong>IB Causal Rank</strong> (likelihood rep action drives
        incremental expansion). &nbsp;<strong>P4</strong> — everyone else.
      </Callout>
      <Callout type="behavior">
        Every tier uses one surface — the <strong>table</strong>. The columns
        carry <strong>portal-level</strong> data (the portal is what triggers the
        outreach), so each portal is a row: the primary (highest-MRR) portal
        fills the company row and any additional portals appear as sub-rows
        beneath it. Expanding a company reveals its recommended contacts.
      </Callout>
    </SpecSection>

    {/* ── Context: the tier view ────────────────────────────────── */}
    <SpecSection
      title="Context — a tier view"
      description="Each tier (and the Full Customer Book) is a page with a metrics row, a quick-filter row, a Companies / Contacts toggle, and the table."
    >
      <StateCard
        label="P3 tier view"
        description="Metrics · filters · Companies/Contacts toggle · the customer table."
      >
        <div className="w-[1040px]">
          <InstallBaseView tier="P3" onWork={noop} onContactClick={noop} />
        </div>
      </StateCard>
    </SpecSection>

    {/* ── Portals as rows ───────────────────────────────────────── */}
    <SpecSection
      title="Portals as rows"
      description="Because the columns are portal-level data, each portal gets its own row rather than being hidden behind a card. The primary (highest-MRR) portal fills the company row; additional portals are sub-rows sharing the same columns. The checkbox + Customer columns merge across a company's portals into one block, so it reads as a single account, while the portal-data columns stay divided per portal."
    >
      <StateCard
        label="Company rows + portal sub-rows"
        description="Atlas Freight (multi-portal) shows a primary row plus a sub-row for its second portal; single-portal customers are just one row. The Customer column is merged down; portal columns (Portal ID, MRR, renewal, credits, usage…) are per portal."
      >
        <div className="w-[1040px]">
          <InstallBaseTable companies={TABLE_COMPANIES} onWork={noop} onContactClick={noop} />
        </div>
      </StateCard>
      <Callout type="behavior">
        Consistent with Net New, the <strong>chevron beside the company
        avatar</strong> expands the account. Clicking elsewhere in the{" "}
        <strong>Customer cell</strong> (avatar or name) opens the account's
        outreach strategy page.
      </Callout>
    </SpecSection>

    {/* ── Expanding a company ───────────────────────────────────── */}
    <SpecSection
      title="Expanding a company — recommended contacts"
      description="The expander reveals the account's curated contacts (economic buyer, champion, cross-functional leaders) as a tray beneath its portal rows, aligned with the expander arrow. In the multi-portal case the tray sits under all of the portals — a minor oddity accepted for consistency with Net New, since the vast majority of customers are single-portal."
    >
      <StateCard
        label="Recommended contacts tray"
        description="Shown when a company is expanded. Each card links back to the contact; call / email open targeted outreach."
      >
        <div className="w-[1040px] bg-card p-6 rounded-200">
          <div className="flex flex-col gap-3">
            <span className="heading-50 text-foreground">Recommended contacts</span>
            <ContactStrip
              company={MULTI}
              onWork={noop}
              onContactClick={noop}
              showHeading={false}
            />
          </div>
        </div>
      </StateCard>
    </SpecSection>

    {/* ── Full Customer Book + columns ──────────────────────────── */}
    <SpecSection
      title="Full Customer Book & columns"
      description="The whole book across every tier uses the same table, with an added Tier column and a search field. Columns mirror the real Full Customer Book."
    >
      <StateCard
        label="All tiers, with Tier column"
        description="Portals as rows, grouped by company (primary portal + sub-rows), across P1–P4."
      >
        <div className="w-[1040px]">
          <InstallBaseTable
            companies={BOOK_COMPANIES}
            onWork={noop}
            onContactClick={noop}
            showTier
            searchPlaceholder="Search customers"
          />
        </div>
      </StateCard>
      <Callout type="behavior">
        <strong>Edit columns</strong> (top-right of the table) toggles the full
        column set. A lean default subset shows (Portal ID · Action Guidance ·
        Install Base Signals · Total MRR · Next renewal · HubSpot Credits
        Consumption % · Count of Integrations · Portal Usage Score · Usage Score
        Trend · Whitespace · Success Owner · Contract Manager); the rest —
        per-hub MRR + tier, Discount → Upcoming Changes, seats, marketing
        contacts, CSM Notes, and more — are available on demand. Every column is
        drag-resizable from its header edge.
      </Callout>
      <Callout type="behavior">
        <strong>Bulk selection:</strong> the header and per-company checkboxes
        select customers; a bulk-action bar (Generate strategies · Snooze ·
        Dismiss) appears above the table while any are selected.
      </Callout>
    </SpecSection>

    {/* ── Contacts view ─────────────────────────────────────────── */}
    <SpecSection
      title="Contacts view"
      description="The second axis of the toggle. A flat list of the tier's curated contacts across all its customers — buyer, champion, and cross-functional leaders — each linking back to its account."
    >
      <StateCard label="Contacts across a tier" description="Contact · Customer · Signals · Actions.">
        <div className="w-[1040px]">
          <InstallBaseContactsTable
            companies={installBaseByTier("P3")}
            onWork={noop}
            onContactClick={noop}
          />
        </div>
      </StateCard>
    </SpecSection>

    {/* ── Working an account ────────────────────────────────────── */}
    <SpecSection
      title="Working an account"
      description="The primary job is to choose a customer and work it."
    >
      <Callout type="info">
        Clicking a customer's name (from any list or contacts view) opens the{" "}
        <strong>same outreach strategy page Net New companies use</strong> —
        install base customers flow through the shared strategy surface rather
        than a separate destination.
      </Callout>
    </SpecSection>
  </SpecLayout>
);

export default InstallBasePpfSpec;
