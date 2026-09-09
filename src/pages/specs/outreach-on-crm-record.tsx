import { useState } from "react";
import { SpecLayout } from "./SpecLayout";
import { SpecHeader, SpecSection, StateCard, Callout } from "./blocks";
import { OutreachStrategyPanel } from "@/components/OutreachStrategyPanel";
import { cn } from "@/lib/utils";
import heroScreenshot from "@/assets/specs/outreach-on-crm-record.png";

/* ── Record middle-panel tab strip (matches the CRM record page) ── */

const RECORD_TABS = ["Outreach Strategy", "Activities", "Intelligence"];

const RecordTabStrip = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (tab: string) => void;
}) => (
  <div className="flex rounded-t-[var(--radius-card)] overflow-hidden shrink-0 border-100 border-core-subtle">
    {RECORD_TABS.map((tab, i) => {
      const isActive = tab === active;
      return (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 h-12 flex items-center justify-center body-100 transition-colors",
            i < RECORD_TABS.length - 1 && "border-r border-core-subtle",
            isActive
              ? "bg-card text-foreground font-semibold"
              : "bg-[var(--color-fill-surface-recessed)] text-muted-foreground border-b border-core-subtle hover:text-foreground",
          )}
        >
          {tab}
        </button>
      );
    })}
  </div>
);

/* ── The record middle content area, with the outreach strategy ── */

const RecordMiddlePanelShowcase = () => {
  const [tab, setTab] = useState("Outreach Strategy");
  return (
    <div className="w-[840px] max-w-full">
      <RecordTabStrip active={tab} onChange={setTab} />
      <div className="bg-[var(--color-fill-surface-recessed)]">
        {tab === "Outreach Strategy" ? (
          <OutreachStrategyPanel companyId="3" />
        ) : (
          <div className="px-6 py-20 text-center body-100 text-muted-foreground">
            The {tab} tab is a placeholder in this prototype.
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Page ────────────────────────────────────────────────────────── */

const OutreachOnCrmRecordSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Outreach strategy on the CRM record"
      description="The outreach strategy — company research plus ranked outreach targets and their sequences — surfaced directly on the standard company CRM record, in the record's middle content area, alongside Activities and Intelligence."
    />

    <div className="mb-12 rounded-200 border border-border overflow-hidden bg-[var(--color-fill-surface-raised)]">
      <img
        src={heroScreenshot}
        alt="The company CRM record for Advanced Satellite Communications with the outreach strategy — Company Research and Outreach targets — in the middle content area under the Outreach Strategy tab."
        className="block w-full h-auto"
      />
    </div>

    {/* ── Why ─────────────────────────────────────────────────── */}
    <SpecSection
      title="Why it's on the CRM record"
      description="Until now the outreach strategy only existed inside the prospecting workspace. Putting it on the company record — the surface every rep already opens — makes it reachable without changing how a rep works."
    >
      <Callout type="info">
        The record is the common denominator. A rep who doesn't work out of the
        prospecting workspace, or who builds their own CRM company lists rather than
        working an assigned book, can still find and act on the outreach strategy from
        the record they already use. The feature meets reps where they are instead of
        requiring them to adopt a new surface.
      </Callout>
    </SpecSection>

    {/* ── Where it lives ──────────────────────────────────────── */}
    <SpecSection
      title="Where it lives on the record"
      description="The company record keeps its familiar three-column layout — the record and 'About this company' properties on the left, associated objects (Deals, Portals, Contacts, …) on the right. The middle content area is a tabbed panel, and the outreach strategy is the first, default tab. Switch tabs below; the Activities and Intelligence tabs are placeholders here."
    >
      <StateCard
        label="Middle content area — Outreach Strategy tab"
        description="Company Research sits at the top, followed by the ranked Outreach targets and their sequences. 'Read full research' opens the full research as a slide-over."
      >
        <RecordMiddlePanelShowcase />
      </StateCard>

      <Callout type="behavior">
        The whole record scrolls as a single page. The outreach strategy grows the middle
        column to its natural height rather than scrolling inside its own pane, so a rep
        scrolls the record once to move from the company properties down through the
        research and each outreach target.
      </Callout>
    </SpecSection>

    {/* ── What the strategy contains ──────────────────────────── */}
    <SpecSection
      title="What the strategy contains"
      description="The panel is the same outreach strategy reps see in the prospecting workspace — unchanged in content and behaviour. The only change is where it appears. It has two areas, both shown in the panel above: Company Research (an agent-generated TL;DR of at most five scannable lines, timestamped, with 'Read full research' opening the complete section-by-section research in a slide-over) and Outreach targets (the ranked contacts with their rationale, Primary Friction, call action, and editable multi-touch sequences)."
    >
      <Callout type="info">
        Company Research and the Outreach targets are the same components used on the
        prospecting strategy view — the ranked contacts, the rationale and Primary
        Friction copy, the call action, and the editable multi-touch sequence all behave
        identically. This spec covers the placement; the target-card and sequence states
        themselves are documented in the sequence specs.
      </Callout>

      <Callout type="edge-case">
        This is a read-first surface for reps outside the workspace. On the record, the
        per-contact side actions that open workspace-only panels — view reasoning,
        regenerate, enroll, the contact drawer, and per-channel icons — are present for
        parity but are not wired to workspace navigation here.
      </Callout>
    </SpecSection>
  </SpecLayout>
);

export default OutreachOnCrmRecordSpec;
