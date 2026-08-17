import { useState, useCallback } from "react";
import { Loader2, Check, RotateCcw, RotateCw } from "lucide-react";
import { SpecLayout } from "./SpecLayout";
import {
  SpecHeader,
  SpecSection,
  StateCard,
  FlowStep,
  Callout,
} from "./blocks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { SignalChipRow } from "@/components/SignalChip";
import { sig } from "@/data/signals";
import PvsTooltip from "@/components/PvsTooltip";
import AgentReasoningSteps from "@/components/AgentReasoningSteps";
import { getCompanyStrategy } from "@/data/companyStrategies";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OutreachSequenceCard } from "@/components/OutreachSequenceCard";
import { getContactDossier } from "@/data/contactDossier";
import type { CallState, LinkedInState, SequenceState } from "@/data/outreachStates";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

const MOCK_COMPANY = {
  companyId: "1",
  name: "ACME Corp",
  industry: "Software & Technology",
  pvsScore: "High" as const,
  signals: [
    sig("funding-round", { headline: "Raised $28M Series B", rows: [{ label: "Round", value: "Series B" }, { label: "Amount", value: "$28M" }], footnote: "Source: Crunchbase" }),
    sig("hiring-surge", { headline: "24 open roles, up 45% this quarter", rows: [{ label: "Open roles", value: "24" }, { label: "Concentrated in", value: "Sales" }], footnote: "Source: job listings" }),
  ],
};

const MOCK_CONTACT = {
  id: "c1",
  name: "Jennifer Park",
  initials: "JP",
  role: "VP, Marketing",
  avatarColor: "bg-trellis-purple-600",
  company: { id: "1", name: "ACME Corp", industry: "Software & Technology" },
  signals: [] as ReturnType<typeof sig>[],
};

const NOT_ENROLLED_CALL: CallState = { kind: "not-attempted" };
const NOT_ENROLLED_LINKEDIN: LinkedInState = { kind: "not-sent" };
const NOT_ENROLLED_SEQUENCE: SequenceState = { kind: "not-enrolled" };

const BoldText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

const ConfigTextarea = ({ value, placeholder }: { value: string; placeholder: string }) => (
  <textarea
    value={value}
    readOnly
    placeholder={placeholder}
    className="w-full min-h-[120px] rounded-[var(--radius-card)] border border-[var(--color-border-core-subtle)] bg-[var(--color-fill-secondary-default)] p-4 body-100 resize-none focus:outline-none placeholder:text-[14px] placeholder:leading-[24px] placeholder:font-light placeholder:[font-family:var(--trellis-font-sans)]"
    style={{ color: "var(--color-text-core-default)" }}
  />
);

const SaveIndicator = ({ state }: { state: "idle" | "saving" | "saved" }) => (
  <div className="flex items-center justify-between mt-2">
    <div className="flex items-center gap-1">
      <button className="p-1 rounded" style={{ color: "var(--color-icon-core-subtle)" }}>
        <RotateCcw size={14} />
      </button>
      <button className="p-1 rounded" style={{ color: "var(--color-icon-core-subtle)" }}>
        <RotateCw size={14} />
      </button>
    </div>
    {state === "saving" && (
      <span className="inline-flex items-center gap-1.5 body-100 text-muted-foreground">
        <Loader2 size={12} className="animate-spin" />
        Saving your changes
      </span>
    )}
    {state === "saved" && (
      <span className="inline-flex items-center gap-1.5 body-100 text-trellis-green-700">
        <Check size={12} />
        Changes saved
      </span>
    )}
  </div>
);

const CompanyCardIdle = () => (
  <Card className="p-5 border-[var(--color-border-core-subtle)]">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src={companyLogoPlaceholder} alt="ACME Corp logo" className="w-8 h-8 rounded-full object-cover" />
        <div>
          <div className="heading-100">ACME Corp</div>
          <div className="body-100 flex items-center gap-1.5" style={{ color: "var(--color-text-core-subtle)" }}>
            <span>Software &amp; Technology</span>
            <span>•</span>
            <PvsTooltip pvsScore="High">
              <span className="cursor-default">PVS High</span>
            </PvsTooltip>
          </div>
        </div>
      </div>
      <SignalChipRow signals={MOCK_COMPANY.signals} />
    </div>
  </Card>
);

const CompanyCardLoading = () => (
  <Card className="p-5 border-[var(--color-border-core-subtle)]">
    <div className="flex flex-col gap-4">
      <div className="heading-100">ACME Corp</div>
      <div className="flex items-center gap-2">
        <TrellisIcon name="artificialIntelligence" size={14} />
        <span className="heading-50 text-foreground">Researching ACME Corp…</span>
      </div>
      <AgentReasoningSteps kind="research" stepMs={4000} />
    </div>
  </Card>
);

const ResearchPreviewDone = () => {
  const strategy = getCompanyStrategy("1").default;
  const researchRows = strategy.researchTable ??
    strategy.sections.map((s) => ({ category: s.heading, content: s.body }));

  return (
    <Card className="p-5 pb-0 border-[var(--color-border-core-subtle)]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <img src={companyLogoPlaceholder} alt="ACME Corp logo" className="w-8 h-8 rounded-full object-cover" />
          <div>
            <div className="heading-100">ACME Corp</div>
            <div className="body-100 flex items-center gap-1.5" style={{ color: "var(--color-text-core-subtle)" }}>
              <span>Software &amp; Technology</span>
              <span>•</span>
              <PvsTooltip pvsScore="High">
                <span className="cursor-default">PVS High</span>
              </PvsTooltip>
            </div>
          </div>
        </div>

        <div>
          <h3 className="heading-100 text-foreground mb-3">Summary</h3>
          <p className="body-100 text-muted-foreground mb-3">{strategy.summary}</p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            {strategy.summaryBullets.map((bullet, idx) => (
              <li key={idx} className="body-100 text-foreground leading-relaxed">{bullet}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="heading-100 text-foreground mb-3">Full Research</h3>
          <div className="-mx-5 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px] align-top px-5">Topic</TableHead>
                  <TableHead className="px-5">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {researchRows.slice(0, 3).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="align-top font-medium whitespace-nowrap body-100 text-muted-foreground px-5">
                      {row.category}
                    </TableCell>
                    <TableCell className="align-top px-5">
                      <ul className="list-disc pl-4 flex flex-col gap-1">
                        {row.content
                          .split(/\n/)
                          .map((l) => l.replace(/^\s*[-•]\s+/, "").trim())
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((line, li) => (
                            <li key={li} className="body-100 text-foreground leading-relaxed">
                              <BoldText text={line} />
                            </li>
                          ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ContactCardIdle = () => (
  <Card className="p-5 border-[var(--color-border-core-subtle)]">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar className={`h-8 w-8 ${MOCK_CONTACT.avatarColor}`}>
          <AvatarFallback className={`${MOCK_CONTACT.avatarColor} text-white text-xs`}>
            {MOCK_CONTACT.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="heading-100">{MOCK_CONTACT.name}</div>
          <div className="body-100" style={{ color: "var(--color-text-core-subtle)" }}>
            {MOCK_CONTACT.role} at {MOCK_CONTACT.company.name}
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const ContactCardLoading = () => (
  <Card className="p-5 border-[var(--color-border-core-subtle)]">
    <div className="flex flex-col gap-4">
      <div className="heading-100">{MOCK_CONTACT.name}</div>
      <div className="flex items-center gap-2">
        <TrellisIcon name="artificialIntelligence" size={14} />
        <span className="heading-50 text-foreground">Building sequence for {MOCK_CONTACT.name}…</span>
      </div>
      <AgentReasoningSteps kind="sequence" stepMs={3000} />
    </div>
  </Card>
);

const SequencePreviewDone = () => {
  const dossier = getContactDossier(
    { id: MOCK_CONTACT.id, name: MOCK_CONTACT.name, role: MOCK_CONTACT.role, signals: MOCK_CONTACT.signals },
    MOCK_CONTACT.company,
  );
  const [expandedTouches, setExpandedTouches] = useState<Record<string, boolean>>({});
  const [scriptMode, setScriptMode] = useState<"script" | "bullets">("script");
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  const getEditable = useCallback((key: string, fallback: string) =>
    editedContent[key] ?? fallback, [editedContent]);
  const setEditable = useCallback((key: string, value: string) =>
    setEditedContent((prev) => ({ ...prev, [key]: value })), []);

  return (
    <Card className="p-5 border-[var(--color-border-core-subtle)]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar className={`h-8 w-8 ${MOCK_CONTACT.avatarColor}`}>
            <AvatarFallback className={`${MOCK_CONTACT.avatarColor} text-white text-xs`}>
              {MOCK_CONTACT.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="heading-100">{MOCK_CONTACT.name}</div>
            <div className="body-100" style={{ color: "var(--color-text-core-subtle)" }}>
              {MOCK_CONTACT.role} at {MOCK_CONTACT.company.name}
            </div>
          </div>
        </div>
        <OutreachSequenceCard
          contact={{ id: MOCK_CONTACT.id, name: MOCK_CONTACT.name, initials: MOCK_CONTACT.initials, avatarColor: MOCK_CONTACT.avatarColor }}
          callBullets={dossier.callBullets}
          onCallBulletChange={() => {}}
          call={NOT_ENROLLED_CALL}
          linkedin={NOT_ENROLLED_LINKEDIN}
          sequence={NOT_ENROLLED_SEQUENCE}
          defaultCallScript={dossier.callScript}
          defaultLinkedInMessage={dossier.linkedInMessage}
          emailTemplates={dossier.emails.map((e) => ({ subject: e.subject, body: e.body }))}
          expandedTouches={expandedTouches}
          onToggleTouch={(id) => setExpandedTouches((prev) => ({ ...prev, [id]: !prev[id] }))}
          getCallScript={() => getEditable(`callScript`, dossier.callScript)}
          onCallScriptChange={(v) => setEditable(`callScript`, v)}
          getLinkedInMessage={() => getEditable(`linkedin`, dossier.linkedInMessage)}
          onLinkedInMessageChange={(v) => setEditable(`linkedin`, v)}
          getEmailSubject={(idx) => getEditable(`email-${idx}-subject`, dossier.emails[idx]?.subject ?? "")}
          onEmailSubjectChange={(idx, v) => setEditable(`email-${idx}-subject`, v)}
          getEmailBody={(idx) => getEditable(`email-${idx}-body`, dossier.emails[idx]?.body ?? "")}
          onEmailBodyChange={(idx, v) => setEditable(`email-${idx}-body`, v)}
          scriptMode={scriptMode}
          onScriptModeChange={setScriptMode}
          onViewReasoning={() => {}}
          enableFeedback
        />
      </div>
    </Card>
  );
};

const AgentConfigurationSpec = () => (
  <SpecLayout>
    <SpecHeader
      title="Agent configuration"
      description="Reps can give custom instructions to the research and sequencing agents, then preview the output before applying to real accounts. Found at Agents → Configure on each agent card."
    />

    {/* ── Autosave flow ─────────────────────────────────────────── */}
    <SpecSection
      title="Autosave flow"
      description="As the rep types instructions, changes autosave with a debounced indicator. Preview is disabled while saving."
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep
          step={1}
          label="Empty state"
          description="Textarea with placeholder text. Undo/redo buttons below left, no save indicator."
        >
          <div className="w-[800px]">
            <ConfigTextarea value="" placeholder="e.g. Focus on recent funding rounds…" />
            <SaveIndicator state="idle" />
          </div>
        </FlowStep>
        <FlowStep
          step={2}
          label="Typing"
          description="Save indicator shows spinner + 'Saving your changes'. Preview button is disabled."
        >
          <div className="w-[800px]">
            <ConfigTextarea value="Focus on hiring signals and leadership changes." placeholder="" />
            <SaveIndicator state="saving" />
          </div>
        </FlowStep>
        <FlowStep
          step={3}
          label="Saved"
          description="1.5s after typing stops, indicator shows green check + 'Changes saved'. Preview re-enables."
          isLast
        >
          <div className="w-[800px]">
            <ConfigTextarea value="Focus on hiring signals and leadership changes." placeholder="" />
            <SaveIndicator state="saved" />
          </div>
        </FlowStep>
      </div>
    </SpecSection>

    {/* ── Research preview flow ──────────────────────────────────── */}
    <SpecSection
      title="Research agent preview flow"
      description="The rep selects a company, clicks Preview, and sees the research output rendered inside the company card."
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep
          step={1}
          label="Idle"
          description="Company card shows name, industry, PVS score, and signal chips."
        >
          <div className="w-[800px]">
            <CompanyCardIdle />
          </div>
        </FlowStep>
        <FlowStep
          step={2}
          label="Loading"
          description="Card shows only company name + reasoning steps. Signal chips and metadata are hidden."
        >
          <div className="w-[800px]">
            <CompanyCardLoading />
          </div>
        </FlowStep>
        <FlowStep
          step={3}
          label="Done"
          description="Card expands with summary bullets and full research table. No separate cards."
          isLast
        >
          <div className="w-[800px]">
            <ResearchPreviewDone />
          </div>
        </FlowStep>
      </div>
    </SpecSection>

    {/* ── Research preview states ────────────────────────────────── */}
    <SpecSection
      title="Research preview states"
      description="Each state of the company card in the research agent preview."
    >
      <StateCard
        label="Idle"
        description="Company card with logo, name, industry, PVS tooltip, and signal chips. 'Change company' selector appears below, right-aligned."
      >
        <div className="w-[800px]">
          <CompanyCardIdle />
        </div>
      </StateCard>

      <StateCard
        label="Loading"
        description="Only company name and animated reasoning steps. Signal chips, industry, PVS are hidden. 'Change company' selector and Preview button are hidden."
      >
        <div className="w-[800px]">
          <CompanyCardLoading />
        </div>
      </StateCard>

      <StateCard
        label="Done"
        description="Card expands vertically with summary bullets + full research table. Card has pb-0 so the table runs flush to the card edge. Truncated here — full table has 14 rows."
        variant="success"
      >
        <div className="w-[800px]">
          <ResearchPreviewDone />
        </div>
      </StateCard>
    </SpecSection>

    {/* ── Sequencing preview flow ───────────────────────────────── */}
    <SpecSection
      title="Sequencing agent preview flow"
      description="Same interaction pattern as research, but at the contact level. The card shows a contact avatar instead of a company logo, and the output is an outreach sequence."
    >
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep
          step={1}
          label="Idle"
          description="Contact card shows avatar, name, role, and company."
        >
          <div className="w-[800px]">
            <ContactCardIdle />
          </div>
        </FlowStep>
        <FlowStep
          step={2}
          label="Loading"
          description="Card shows contact name + sequence reasoning steps (product knowledge, writing style, brand voice)."
        >
          <div className="w-[800px]">
            <ContactCardLoading />
          </div>
        </FlowStep>
        <FlowStep
          step={3}
          label="Done"
          description="Card expands with a full OutreachSequenceCard. No 'Regenerate sequence' button — reps re-preview by editing instructions."
          isLast
        >
          <div className="w-[800px]">
            <SequencePreviewDone />
          </div>
        </FlowStep>
      </div>
    </SpecSection>

    {/* ── Sequencing preview done (full width) ──────────────────── */}
    <SpecSection
      title="Sequencing preview — done state"
      description="The full outreach sequence card rendered inside the contact card. Interactive — expand steps, edit content, enroll. The 'Regenerate sequence' CTA is intentionally hidden on this page."
    >
      <StateCard
        label="Sequence preview (done)"
        description="Contact info at top, OutreachSequenceCard below. All steps are interactive."
      >
        <SequencePreviewDone />
      </StateCard>
    </SpecSection>

    {/* ── Preview button states ─────────────────────────────────── */}
    <SpecSection
      title="Preview button states"
      description="The Preview button sits inline with the 'Run the agent' heading. Its enabled/disabled state depends on the preview lifecycle and autosave state."
    >
      <StateCard
        label="Idle — enabled"
        description="Default state. Rep has not yet previewed, or has made changes since the last preview."
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-300">Run the agent</h2>
            <p className="body-100 mt-1" style={{ color: "var(--color-text-core-subtle)" }}>Test the research agent on one of your P1 companies.</p>
          </div>
          <Button variant="ai" size="small">Preview</Button>
        </div>
      </StateCard>

      <StateCard
        label="Saving — disabled"
        description="While the autosave indicator shows 'Saving your changes', Preview is disabled."
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-300">Run the agent</h2>
            <p className="body-100 mt-1" style={{ color: "var(--color-text-core-subtle)" }}>Test the research agent on one of your P1 companies.</p>
          </div>
          <Button variant="ai" size="small" disabled>Preview</Button>
        </div>
      </StateCard>

      <StateCard
        label="Running — disabled"
        description="While the agent reasoning animation plays, Preview is disabled."
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-300">Run the agent</h2>
            <p className="body-100 mt-1" style={{ color: "var(--color-text-core-subtle)" }}>Test the research agent on one of your P1 companies.</p>
          </div>
          <Button variant="ai" size="small" disabled>Preview</Button>
        </div>
      </StateCard>

      <StateCard
        label="Done, no new changes — disabled"
        description="Preview just completed and the rep hasn't edited instructions yet."
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-300">Run the agent</h2>
            <p className="body-100 mt-1" style={{ color: "var(--color-text-core-subtle)" }}>Test the research agent on one of your P1 companies.</p>
          </div>
          <Button variant="ai" size="small" disabled>Preview</Button>
        </div>
      </StateCard>

      <StateCard
        label="Done, instructions edited — enabled"
        description="Rep edited instructions after the last preview. Preview re-enables so they can see updated output."
        variant="success"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-300">Run the agent</h2>
            <p className="body-100 mt-1" style={{ color: "var(--color-text-core-subtle)" }}>Test the research agent on one of your P1 companies.</p>
          </div>
          <Button variant="ai" size="small">Preview</Button>
        </div>
      </StateCard>
    </SpecSection>

    {/* ── Key differences ──────────────────────────────────────── */}
    <SpecSection
      title="Differences between research and sequencing"
      description="Both agents share the same page layout and interaction design. The differences are in the preview target and output."
    >
      <Callout type="info">
        <strong>Research agent:</strong> preview target is a company (logo, name, industry, PVS, signal chips). Output is summary bullets + a structured research table with 14 topic rows.
      </Callout>
      <Callout type="info">
        <strong>Sequencing agent:</strong> preview target is a contact (avatar, name, role, company). Output is a full OutreachSequenceCard (call, LinkedIn, 3 emails). The "Regenerate sequence" CTA is hidden — reps edit instructions and re-preview instead.
      </Callout>
      <Callout type="behavior">
        The entity picker below the card reads "Change company" or "Change contact" depending on agent type. It is only visible in the idle state — hidden during loading and after results are shown.
      </Callout>
    </SpecSection>
  </SpecLayout>
);

export default AgentConfigurationSpec;
