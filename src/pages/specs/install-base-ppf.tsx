import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  FlowStep,
  Callout,
} from "./blocks";
import InstallBaseView from "@/components/installbase/InstallBaseView";
import InstallBaseTable from "@/components/installbase/InstallBaseTable";
import InstallBaseContactsTable from "@/components/installbase/InstallBaseContactsTable";
import PortalBlock from "@/components/installbase/PortalBlock";
import AccountDetailBlock from "@/components/installbase/AccountDetailBlock";
import {
  installBaseByTier,
  installBaseCompanies,
  type IbCompany,
} from "@/data/installBase";

const noop = () => {};
const byId = (id: string) =>
  installBaseCompanies.find((c) => c.id === id) as IbCompany;

// Northwind = P1, multi-portal, QL trigger. Brightpath = P1, single-portal SMB.
const MULTI = byId("northwind-traders");
const SINGLE = byId("brightpath-studio");

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
      description="Rendering install base (customer) accounts in the prospecting workspace under the same P1–P4 Prospect Prioritisation Framework as Net New. A customer is an account with one or more HubSpot portals (each carrying its own MRR, usage, seats, credits and renewal) plus a curated set of contacts."
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
        Every tier uses one surface — the <strong>table</strong>. Collapsed rows
        for scanning; expanding a row reveals the full account detail (portals +
        contacts) inline, so there's no separate card view to maintain.
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

    {/* ── Portal block ──────────────────────────────────────────── */}
    <SpecSection
      title="Portal block — adapts to portal count"
      description="A customer's portals are shown at a glance. The block adapts to how many there are, so the common one-portal case stays lean and multi-portal accounts stay legible without a wall of data."
    >
      <StateCard
        label="One portal"
        description="A single dense strip: portal ID, hubs + tier, MRR, renewal countdown (colour-coded in-window), seats and credits meters, health dot, portal-level signals."
      >
        <div className="w-[900px]">
          <PortalBlock portals={SINGLE.portals} />
        </div>
      </StateCard>
      <StateCard
        label="Multiple portals"
        description="Leads with the primary (highest-MRR) portal, then a 'Show N more portals · $X/mo' expander revealing the rest — same strip format throughout. All strips share the widest one's width."
      >
        <div className="w-[900px]">
          <PortalBlock portals={MULTI.portals} />
        </div>
      </StateCard>
      <Callout type="behavior">
        The expander is interactive — click “Show N more portals” to reveal the
        remaining portal strips.
      </Callout>
    </SpecSection>

    {/* ── The table + expand-into-cards ─────────────────────────── */}
    <SpecSection
      title="Table view — expand into cards"
      description="The table is the P2/P4 default. Collapsed rows carry honest company-level columns for scanning; expanding a row reveals the SAME account detail block (portal strip/cards + contacts) as a full-width panel — not column-aligned nested rows."
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep
          step={1}
          label="Collapsed rows"
          description="All rows start collapsed. Company-level columns only (total MRR, next renewal, usage, whitespace, signals, success owner…). A checkbox column enables bulk selection; the chevron expands."
        >
          <div className="w-[1040px]">
            <InstallBaseTable companies={TABLE_COMPANIES} onWork={noop} onContactClick={noop} />
          </div>
        </FlowStep>
        <FlowStep
          step={2}
          label="Expand → account detail panel"
          description="Clicking the chevron reveals this panel inline, beneath the row: the portal block plus the curated contact cards. This is the same block the card view renders."
          isLast
        >
          <div className="w-[1040px] bg-[var(--color-fill-surface-recessed)] p-6 rounded-200">
            <AccountDetailBlock company={MULTI} onWork={noop} onContactClick={noop} />
          </div>
        </FlowStep>
      </div>
      <Callout type="behavior">
        <strong>Row interactions:</strong> only the chevron expands a row.
        Clicking anywhere in the <strong>Customer name cell</strong> opens the
        account's outreach strategy page. A click on the rest of the row does
        nothing.
      </Callout>
    </SpecSection>

    {/* ── Full Customer Book + columns ──────────────────────────── */}
    <SpecSection
      title="Full Customer Book & columns"
      description="The whole book across every tier uses the same table, with an added Tier column and a search field. Columns mirror the real Full Customer Book."
    >
      <StateCard
        label="All tiers, with Tier column"
        description="One row per customer across P1–P4."
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
        column set. A lean default subset shows (Install Base Signals · Total
        MRR · Next renewal · Portal Usage Score · Usage Score Trend · Whitespace
        · Success Owner); the rest — Portal ID, Action Guidance, per-hub MRR +
        tier, Discount → Upcoming Changes, seats, credits, integrations, CSM
        Notes, Contract Manager, and more — are available on demand. Every
        column is drag-resizable from its header edge.
      </Callout>
      <Callout type="behavior">
        <strong>Bulk selection:</strong> the header and per-row checkboxes select
        customers; a bulk-action bar (Add to play · Assign owner · Export)
        appears above the table while any are selected.
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
        Clicking a customer's name (from any list, card, or contacts view) opens
        the <strong>same outreach strategy page Net New companies use</strong> —
        install base customers flow through the shared strategy surface rather
        than a separate destination.
      </Callout>
    </SpecSection>
  </SpecLayout>
);

export default InstallBasePpfSpec;
