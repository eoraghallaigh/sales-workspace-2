import { SpecLayout } from "./SpecLayout";
import { SpecHeader, SpecSection, StateCard, FlowStep, Callout, CodeRef } from "./blocks";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CooldownBannerShowcase = () => (
  <div className="w-full max-w-2xl">
    <Alert type="warning">
      <AlertDescription>
        Sequence generation is blocked until{" "}
        <span className="font-semibold">3:42 PM</span>{" "}
        today because there is another automation running on this contact.
      </AlertDescription>
    </Alert>
  </div>
);

const OsaDelaySpec = () => (
  <SpecLayout>
    <SpecHeader
      title="1-hr delay on OSA enrollment + PA monitoring indicator"
      description="After an individual signal fires on a contact, preserve a 1-hour window for Email Team Automation before the OSA can suggest or execute outreach. This prevents OSA emails from suppressing automation sends and protects the ~43% of discovery meetings attributable to automation flows."
    />

    <SpecSection
      title="Cooldown banner"
      description="When a contact is in the 1-hour cooldown window, the sequence card area is replaced with a warning alert. The banner shows the exact time the cooldown expires so the rep knows when to come back."
    >
      <StateCard
        label="Active cooldown"
        description="Contact has a signal that fired less than 1 hour ago. Email Team Automation has priority."
        variant="warning"
      >
        <CooldownBannerShowcase />
      </StateCard>
    </SpecSection>

    <SpecSection
      title="What the rep can still see"
      description="During the cooldown, the rep is not blocked from all information — only sequence generation is deferred."
    >
      <FlowStep
        step={1}
        label="Company research"
        description="The strategy research section (blurb, primary friction, research table) remains fully visible. The rep can read the company research and prepare while waiting."
      />
      <FlowStep
        step={2}
        label="Other contacts' sequences"
        description="If other contacts on the same company are not in a cooldown window, their sequences display normally. Only the specific contact with the active cooldown is blocked."
      />
      <FlowStep
        step={3}
        label="Signal chips"
        description="The contact's signal chips still render above the cooldown banner. The rep can see which signal triggered the cooldown."
        isLast
      />
    </SpecSection>

    <SpecSection
      title="Timing and expiry"
      description="The cooldown is computed per-contact, not per-company."
    >
      <Callout>
        The cooldown timestamp is stored as an ISO datetime string on each contact
        (<CodeRef>automationCooldownUntil</CodeRef>). The UI checks{" "}
        <CodeRef>Date.now() &lt; cooldownUntil</CodeRef> on each render — once the
        timestamp passes, the banner disappears and the sequence card renders
        normally without a page refresh.
      </Callout>

      <StateCard
        label="Cooldown expired"
        description="The 1-hour window has passed. The contact's sequence card now renders normally — blurb, primary friction, call CTA, and the outreach sequence."
        variant="success"
      >
        <div className="body-100 text-muted-foreground italic">
          Standard sequence card renders here (same as any non-cooldown contact).
        </div>
      </StateCard>
    </SpecSection>

    <SpecSection
      title="Decision chain"
      description="The cooldown check sits within a priority chain of conditions that determines what renders in the contact card body."
    >
      <FlowStep
        step={1}
        label="Loading state"
        description="If the outreach agent is actively working on this contact, show a spinner with 'Outreach agent is working…'"
      />
      <FlowStep
        step={2}
        label="Building sequences"
        description="If a bulk sequence build is in progress (or this contact is being regenerated), show the agent reasoning steps animation."
      />
      <FlowStep
        step={3}
        label="No sequences yet"
        description="If sequences haven't been generated for this company yet, show the contact's signal/touch/enrollment summary stats."
      />
      <FlowStep
        step={4}
        label="Automation cooldown (this feature)"
        description="If the contact has an active automationCooldownUntil timestamp, show the warning banner instead of the sequence."
      />
      <FlowStep
        step={5}
        label="Normal sequence card"
        description="Default: show the company research, primary friction, call CTA, and outreach sequence."
        isLast
      />
    </SpecSection>
  </SpecLayout>
);

export default OsaDelaySpec;
