import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  FlowStep,
  HorizontalFlow,
  HorizontalFlowStep,
  Callout,
  CodeRef,
} from "./blocks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RotateCw, Sparkles } from "lucide-react";
import SequenceRefusalBanner from "@/components/SequenceRefusalBanner";

/* ── Shared demo contacts ─────────────────────────────────────── */

const CONTACTS = {
  maya: { id: "spec-ot-maya", name: "Maya Chen", initials: "MC", role: "VP Sales", avatarColor: "bg-trellis-blue-600" },
  ravi: { id: "spec-ot-ravi", name: "Ravi Sharma", initials: "RS", role: "Director of Revenue Operations", avatarColor: "bg-trellis-purple-600" },
  lin: { id: "spec-ot-lin", name: "Lin Torres", initials: "LT", role: "Head of Growth", avatarColor: "bg-trellis-green-600" },
  alex: { id: "spec-ot-alex", name: "Alex Kim", initials: "AK", role: "Sales Manager", avatarColor: "bg-trellis-yellow-600" },
};

/* ── Reusable contact row ─────────────────────────────────────── */

const ContactRow = ({
  contact,
  children,
}: {
  contact: { name: string; initials: string; role: string; avatarColor: string };
  children: React.ReactNode;
}) => (
  <div className="rounded-300 border-100 border-core-subtle overflow-hidden">
    <div className="flex items-center justify-between gap-3 px-6 py-4 bg-[var(--color-fill-surface-recessed)]">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback className={contact.avatarColor + " text-white heading-50"}>
            {contact.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="heading-100 text-foreground">{contact.name}</p>
          <p className="body-100 text-muted-foreground">{contact.role}</p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

/* ── Empty state body ─────────────────────────────────────────── */

const EmptyStateBody = ({ name }: { name: string }) => (
  <div className="px-6 py-5 bg-card">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 detail-200 text-muted-foreground">
        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
        No recent conversions
      </div>
      <div className="flex items-center gap-2 detail-200 text-muted-foreground">
        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
        No recent touches
      </div>
      <div className="flex items-center gap-2 detail-200 text-muted-foreground">
        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
        Not enrolled in a sequence
      </div>
    </div>
    <p className="detail-200 text-muted-foreground mt-4">
      Research has not been generated for this company yet. Generate research to create a sequence for {name}.
    </p>
  </div>
);

/* ── Sequence generation error body ───────────────────────────── */

const SequenceErrorBody = ({ name }: { name: string }) => (
  <div className="px-6 py-5 bg-card">
    <Alert type="warning">
      <AlertDescription className="flex items-start gap-2">
        <div className="flex-1">
          <p className="body-100 text-foreground">
            Sequence generation failed for {name}. The sequencing agent encountered an error while creating this sequence.
          </p>
          <div className="mt-3">
            <Button variant="primary" size="extra-small">
              <RotateCw className="mr-1.5 h-3 w-3" />
              Try again
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  </div>
);

/* ── Research error body ──────────────────────────────────────── */

const ResearchErrorBody = () => (
  <div className="px-6 py-5 bg-card">
    <Alert type="warning">
      <AlertDescription className="flex items-start gap-2">
        <div className="flex-1">
          <p className="body-100 text-foreground">
            Research generation failed for this company. Sequences cannot be created until research is available.
          </p>
          <div className="mt-3">
            <Button variant="primary" size="extra-small">
              <RotateCw className="mr-1.5 h-3 w-3" />
              Regenerate research
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  </div>
);

/* ── Main spec ────────────────────────────────────────────────── */

const OutreachTargetDecouplingSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Outreach Target decoupling"
      description="Decoupling Outreach Targets from sequence generation so that contacts appear as targets even when research or sequencing has not completed — or has failed."
    />

    {/* ── Problem ──────────────────────────────────────────────── */}

    <SpecSection
      title="Problem"
      description="In the current production implementation, Outreach Targets are derived from which contacts have sequences drafted for them. This creates a fragile coupling: any failure in the sequence generation pipeline causes the company to show zero Outreach Targets, regardless of how many Recommended Contacts exist."
    >
      <Callout type="info">
        Outreach Targets are the top 3 Recommended Contacts for a company, ranked by job title, intent signals, recent activity, and play-persona fit.
        They exist independently of whether research or sequences have been generated.
      </Callout>

      <Callout type="edge-case">
        <strong>Current bug:</strong> When the sequence generation pipeline errors, the company appears to have no Outreach Targets — the rep sees an empty state and has no way to take action on contacts the algorithm has already identified as high-priority.
      </Callout>
    </SpecSection>

    {/* ── Decoupled model ──────────────────────────────────────── */}

    <SpecSection
      title="Decoupled model"
      description="After the change, Outreach Targets are chosen algorithmically from Recommended Contacts — before and independent of any agent work. The sequencing agent is a downstream consumer of the target list, not its source."
    >
      <HorizontalFlow>
        <HorizontalFlowStep
          step={1}
          label="Recommended Contacts"
          description="Ranked by job title, intent signals, recent activity, and play-persona fit."
        />
        <HorizontalFlowStep
          step={2}
          label="Outreach Targets"
          description="Top 3 Recommended Contacts, plus any manually added by the rep. Always visible."
        />
        <HorizontalFlowStep
          step={3}
          label="Research generation"
          description="Company-level research runs independently. Not required for targets to appear."
        />
        <HorizontalFlowStep
          step={4}
          label="Sequence generation"
          description="Runs per-contact once research exists. Failures don't remove the target."
          isLast
        />
      </HorizontalFlow>

      <Callout type="behavior">
        The key change: steps 1–2 happen immediately when a company enters the pipeline. Steps 3–4 are asynchronous and may fail without affecting the target list.
      </Callout>
    </SpecSection>

    {/* ── Outreach Target states ────────────────────────────────── */}

    <SpecSection
      title="Outreach Target states"
      description="An Outreach Target card can appear in one of four states depending on whether research and sequence generation have completed."
    >
      <StateCard
        label="No research generated"
        description="The company has not been researched yet. The target appears with signal dots and a prompt to generate research."
        variant="default"
      >
        <ContactRow contact={CONTACTS.maya}>
          <EmptyStateBody name="Maya" />
        </ContactRow>
      </StateCard>

      <StateCard
        label="Research generated, sequence pending"
        description="Research exists but the sequencing agent hasn't processed this contact yet. The agent reasoning UI shows progress."
        variant="default"
      >
        <ContactRow contact={CONTACTS.ravi}>
          <div className="px-6 py-5 bg-card">
            <p className="heading-50 text-foreground mb-3">
              Building Ravi's sequence…
            </p>
            <div className="space-y-2">
              {["Reviewing research and contact signals…", "Drafting call script…", "Writing email sequence…"].map((msg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-trellis-blue-800 shrink-0" />
                  <span className="detail-200 text-muted-foreground">{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </ContactRow>
      </StateCard>

      <StateCard
        label="Sequence generation failed"
        description="Research exists but the sequencing agent failed for this contact. A 'Try again' CTA replaces the 'View reasoning' link."
        variant="warning"
      >
        <ContactRow contact={CONTACTS.lin}>
          <SequenceErrorBody name="Lin" />
        </ContactRow>
      </StateCard>

      <StateCard
        label="Research generation failed"
        description="Company-level research failed. All targets for this company show the research error state."
        variant="warning"
      >
        <ContactRow contact={CONTACTS.maya}>
          <ResearchErrorBody />
        </ContactRow>
      </StateCard>

      <StateCard
        label="Sequence generated"
        description="The happy path — research and sequencing both succeeded. The full outreach card is shown (call script, LinkedIn, email sequence)."
        variant="success"
      >
        <ContactRow contact={CONTACTS.ravi}>
          <div className="px-6 py-5 bg-card">
            <p className="body-100 text-foreground leading-relaxed mb-3">
              Ravi leads Revenue Operations at Acme and has been evaluating CRM alternatives since the Salesforce renewal.
              Recent LinkedIn activity shows interest in reporting automation — a strong entry point for HubSpot's Operations Hub pitch.
            </p>
            <p className="heading-50 text-foreground mb-1">Primary Friction:</p>
            <p className="body-100 text-foreground leading-relaxed mb-4">
              Salesforce reporting requires a dedicated analyst; self-serve dashboards are a top ask from the sales floor.
            </p>
            <div className="flex items-center gap-2 detail-200 text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Sequence generated by Sequencing Agent</span>
            </div>
          </div>
        </ContactRow>
      </StateCard>
    </SpecSection>

    {/* ── Comparison with existing refusal banner ──────────────── */}

    <SpecSection
      title="Comparison: sequence error vs. agent refusal"
      description="A sequence generation error is different from an agent refusal. Refusals are intentional — the agent has a reason not to sequence a contact. Errors are unintentional pipeline failures."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StateCard
          label="Sequence generation error (new)"
          description="Pipeline failure — the agent tried and something broke."
          variant="warning"
        >
          <div className="space-y-3">
            <Alert type="warning">
              <AlertDescription>
                <p className="body-100 text-foreground">
                  Sequence generation failed for Lin. The sequencing agent encountered an error while creating this sequence.
                </p>
                <div className="mt-3">
                  <Button variant="primary" size="extra-small">
                    <RotateCw className="mr-1.5 h-3 w-3" />
                    Try again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </StateCard>

        <StateCard
          label="Agent refusal (existing)"
          description="Intentional decision — the agent chose not to sequence this contact."
          variant="warning"
        >
          <SequenceRefusalBanner
            reason="not-real-individual"
            onViewReasoning={() => {}}
          />
        </StateCard>
      </div>

      <Callout type="behavior">
        <strong>Error → "Try again".</strong> The agent didn't choose to skip this contact; something went wrong. The CTA retries generation.
        <br />
        <strong>Refusal → "View reasoning".</strong> The agent made a deliberate decision. The CTA shows why.
      </Callout>
    </SpecSection>

    {/* ── Adding contacts manually ─────────────────────────────── */}

    <SpecSection
      title="Manually adding contacts"
      description="Reps can add contacts from the Recommended Contacts list to the Outreach Targets. The behavior differs based on whether research exists."
    >
      <FlowStep
        step={1}
        label="Rep adds a contact to Outreach Targets"
        description="Via the 'Add to Outreach Targets' button on any contact in the Other Contacts section."
      />
      <FlowStep
        step={2}
        label="No research exists for this company"
        description="The contact appears as an Outreach Target in the empty state (signal dots, no sequence). The rep must generate research before sequences can be created."
      >
        <StateCard label="Manually added, no research" variant="default">
          <ContactRow contact={CONTACTS.alex}>
            <EmptyStateBody name="Alex" />
          </ContactRow>
        </StateCard>
      </FlowStep>
      <FlowStep
        step={3}
        label="Research already exists for this company"
        description="Adding the contact automatically kicks off sequence generation. The agent reasoning UI appears while the sequence is being built."
        isLast
      >
        <StateCard label="Manually added, research exists" variant="default">
          <ContactRow contact={CONTACTS.alex}>
            <div className="px-6 py-5 bg-card">
              <p className="heading-50 text-foreground mb-3">
                Building Alex's sequence…
              </p>
              <div className="space-y-2">
                {["Reviewing research and contact signals…", "Drafting call script…"].map((msg, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-trellis-blue-800 shrink-0" />
                    <span className="detail-200 text-muted-foreground">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </ContactRow>
        </StateCard>
      </FlowStep>
    </SpecSection>

    {/* ── Edge cases ───────────────────────────────────────────── */}

    <SpecSection
      title="Edge cases"
    >
      <Callout type="edge-case">
        <strong>Fewer than 3 Recommended Contacts.</strong> If a company only has 1 or 2 Recommended Contacts, those are the Outreach Targets. The system does not pad to 3.
      </Callout>

      <Callout type="edge-case">
        <strong>All sequences fail.</strong> If research succeeds but all 3 sequence generations fail, all 3 Outreach Targets show the error state with individual "Try again" CTAs. The company is still shown in the prospecting queue — it is not hidden.
      </Callout>

      <Callout type="edge-case">
        <strong>Research fails then succeeds on retry.</strong> When research is regenerated successfully, sequence generation should automatically kick off for all current Outreach Targets (including any manually added contacts).
      </Callout>

      <Callout type="edge-case">
        <strong>Contact removed then re-added.</strong> If a rep removes an Outreach Target (via hide/feedback) and later re-adds them, the contact should re-enter the target list in whatever state is current — if a sequence was already generated, it should be shown; if not, the empty or error state applies.
      </Callout>

      <Callout type="implementation">
        The prototype already models this decoupling via separate <CodeRef>hasResearch</CodeRef> and <CodeRef>hasSequences</CodeRef> flags and an independent <CodeRef>outreachTargets</CodeRef> array derived from <CodeRef>rankedRecommended</CodeRef> contacts. The production implementation should follow the same separation.
      </Callout>
    </SpecSection>
  </SpecLayout>
);

export default OutreachTargetDecouplingSpec;
