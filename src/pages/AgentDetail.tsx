import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, RotateCcw, RotateCw, Check } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCyclePath } from "@/hooks/useCyclePath";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { SignalChipRow } from "@/components/SignalChip";
import { sig } from "@/data/signals";
import PvsTooltip from "@/components/PvsTooltip";
import AgentReasoningSteps from "@/components/AgentReasoningSteps";
import { getCompanyStrategy } from "@/data/companyStrategies";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const PREVIEW_COMPANIES = [
  { companyId: "1", name: "ACME Corp", industry: "Software & Technology", pvsScore: "High" as const, signals: [
    sig("funding-round", { headline: "Raised $28M Series B", rows: [{ label: "Round", value: "Series B" }, { label: "Amount", value: "$28M" }], footnote: "Source: Crunchbase" }),
    sig("hiring-surge", { headline: "24 open roles, up 45% this quarter", rows: [{ label: "Open roles", value: "24" }, { label: "Concentrated in", value: "Sales" }], footnote: "Source: job listings" }),
  ]},
  { companyId: "2", name: "TechVision Inc", industry: "Data Analytics", pvsScore: "High" as const, signals: [
    sig("new-hire", { headline: "Marcus Bell joined as CRO", rows: [{ label: "Role", value: "Chief Revenue Officer" }], footnote: "Source: LinkedIn" }),
    sig("tech-stack-change", { headline: "Adopted Snowflake", rows: [{ label: "Added", value: "Snowflake" }], footnote: "Source: BuiltWith" }),
  ]},
  { companyId: "4", name: "DataStream Analytics", industry: "Data Analytics", pvsScore: "High" as const, signals: [
    sig("hiring-surge", { headline: "18 open roles, up 32%", rows: [{ label: "Open roles", value: "18" }], footnote: "Source: job listings" }),
  ]},
  { companyId: "5", name: "CloudScale Systems", industry: "Cloud Infrastructure", pvsScore: "High" as const, signals: [
    sig("funding-round", { headline: "Raised $65M Series C", rows: [{ label: "Round", value: "Series C" }, { label: "Amount", value: "$65M" }], footnote: "Source: Crunchbase" }),
  ]},
  { companyId: "10", name: "Summit Financial", industry: "Financial Services", pvsScore: "High" as const, signals: [
    sig("former-customer", { headline: "Previously a Sales Hub customer", rows: [{ label: "Product", value: "Sales Hub" }], footnote: "Source: CRM history" }),
  ]},
];

const PREVIEW_CONTACTS = [
  { id: "c1", name: "Jennifer Park", initials: "JP", role: "VP, Marketing", avatarColor: "bg-trellis-purple-600",
    company: { id: "1", name: "ACME Corp", industry: "Software & Technology" },
    signals: [] as ReturnType<typeof sig>[] },
  { id: "c4", name: "Sarah Johnson", initials: "SJ", role: "CEO", avatarColor: "bg-trellis-blue-600",
    company: { id: "2", name: "TechVision Inc", industry: "Data Analytics" },
    signals: [] as ReturnType<typeof sig>[] },
  { id: "c6", name: "David Lee", initials: "DL", role: "CMO", avatarColor: "bg-trellis-green-600",
    company: { id: "4", name: "DataStream Analytics", industry: "Data Analytics" },
    signals: [] as ReturnType<typeof sig>[] },
];

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

const AGENT_CONFIG: Record<string, { title: string; description: string; placeholder: string }> = {
  research: {
    title: "Company research agent",
    description: "Define your research priorities and output structure. Changes apply to new research runs only, previously generated research is not affected.",
    placeholder: "e.g. Focus on recent funding rounds, leadership changes, and technology stack. Format the output as bullet points grouped by category.",
  },
  sequencing: {
    title: "Sequencing agent",
    description: "Define your outreach style and sequence preferences. Changes apply to new sequences only, previously generated sequences are not affected.",
    placeholder: "e.g. Keep emails under 100 words. Use a casual but professional tone. Reference the prospect's recent LinkedIn activity when possible.",
  },
};

const CHAR_LIMIT = 2000;

const AgentDetail = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { cyclePath } = useCyclePath();
  const config = AGENT_CONFIG[agentId || ""] || AGENT_CONFIG.research;

  const isSequencing = agentId === "sequencing";

  const [draft, setDraft] = useState("");
  const [savedInstructions, setSavedInstructions] = useState("");
  const [saveFlash, setSaveFlash] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [textareaFocused, setTextareaFocused] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(PREVIEW_COMPANIES[0]);
  const [selectedContact, setSelectedContact] = useState(PREVIEW_CONTACTS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewState, setPreviewState] = useState<"idle" | "running" | "done">("idle");
  const [previewedInstructions, setPreviewedInstructions] = useState<string | null>(null);

  const [expandedTouches, setExpandedTouches] = useState<Record<string, boolean>>({});
  const [scriptMode, setScriptMode] = useState<"script" | "bullets">("script");
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  const dossier = getContactDossier(
    { id: selectedContact.id, name: selectedContact.name, role: selectedContact.role, signals: selectedContact.signals },
    selectedContact.company,
  );

  const getEditable = useCallback((key: string, fallback: string) =>
    editedContent[key] ?? fallback, [editedContent]);
  const setEditable = useCallback((key: string, value: string) =>
    setEditedContent((prev) => ({ ...prev, [key]: value })), []);

  const isDirty = draft !== savedInstructions;
  const hasSavedChangesSincePreview = savedInstructions !== previewedInstructions;

  const handleInstructionsChange = (value: string) => {
    setDraft(value);
  };

  const handleSave = () => {
    setSavedInstructions(draft);
    setLastSavedAt(new Date());
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const charsRemaining = CHAR_LIMIT - draft.length;

  const previewDisabled = isDirty || previewState === "running" || (previewState === "done" && !hasSavedChangesSincePreview);
  const previewDisabledReason = isDirty
    ? "Save your changes before previewing"
    : previewState === "running"
      ? "Preview is running"
      : previewState === "done" && !hasSavedChangesSincePreview
        ? "Save new changes to preview again"
        : undefined;

  const startPreview = () => {
    setPreviewState("running");
    setPreviewedInstructions(savedInstructions);
    setTimeout(() => setPreviewState("done"), 18000);
  };

  const strategy = getCompanyStrategy(selectedCompany.companyId).default;
  const researchRows = strategy.researchTable ??
    strategy.sections.map((s) => ({ category: s.heading, content: s.body }));

  return (
    <Layout>
      <div className="flex flex-col h-[var(--page-content-height)] overflow-hidden">
        <WorkspaceHeader
          backLink={{ to: cyclePath("/agents"), label: "Agents" }}
          title={config.title}
          hideTabs
        />

        <div
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: "var(--color-fill-surface-recessed)",
            padding: "48px",
          }}
        >
          <div className="flex flex-col gap-16 items-start w-[800px]">
            {/* Configure */}
            <div className="w-full">
              <h2 className="heading-300 mb-1">Configure the agent</h2>
              <p
                className="body-100 mb-5"
                style={{ color: "var(--color-text-core-subtle)" }}
              >
                {config.description}
              </p>

              <textarea
                value={draft}
                onChange={(e) => handleInstructionsChange(e.target.value)}
                onFocus={() => setTextareaFocused(true)}
                onBlur={() => setTextareaFocused(false)}
                maxLength={CHAR_LIMIT}
                placeholder={config.placeholder}
                className="w-full min-h-[240px] rounded-[var(--radius-card)] border border-[var(--color-border-core-subtle)] bg-[var(--color-fill-secondary-default)] p-4 body-100 resize-y focus:outline-none focus:border-[var(--color-border-interactive-pressed)] placeholder:text-[14px] placeholder:leading-[24px] placeholder:font-light placeholder:[font-family:var(--trellis-font-sans)]"
                style={{ color: "var(--color-text-core-default)" }}
              />

              <div className="flex items-center justify-between mt-1">
                {saveFlash ? (
                  <span className="inline-flex items-center gap-1.5 detail-200 text-trellis-green-700">
                    <Check size={12} />
                    Changes saved
                  </span>
                ) : textareaFocused ? (
                  <span className="detail-200" style={{ color: "var(--color-text-core-subtle)" }}>
                    {charsRemaining.toLocaleString()} characters remaining
                  </span>
                ) : lastSavedAt ? (
                  <span className="detail-200" style={{ color: "var(--color-text-core-subtle)" }}>
                    Last updated {lastSavedAt.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-1">
                  <button
                    className="p-1 rounded hover:bg-[var(--color-fill-surface-default-hover)]"
                    style={{ color: "var(--color-icon-core-subtle)" }}
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-[var(--color-fill-surface-default-hover)]"
                    style={{ color: "var(--color-icon-core-subtle)" }}
                  >
                    <RotateCw size={14} />
                  </button>
                  <Button variant="primary" size="small" onClick={handleSave} disabled={!isDirty} className="ml-2">
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="heading-300">Run the agent</h2>
                  <p
                    className="body-100 mt-1"
                    style={{ color: "var(--color-text-core-subtle)" }}
                  >
                    {isSequencing
                      ? "Test the sequencing agent on one of your outreach targets."
                      : "Test the research agent on one of your P1 companies."}
                  </p>
                </div>
                {previewDisabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-not-allowed">
                        <Button variant="ai-secondary" size="small" disabled className="pointer-events-none">
                          Preview
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{previewDisabledReason}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Button variant="ai-secondary" size="small" onClick={startPreview}>
                    Preview
                  </Button>
                )}
              </div>

              {isSequencing ? (
                <>
                  <Card className="p-5 border-[var(--color-border-core-subtle)]">
                    {previewState === "running" ? (
                      <div className="flex flex-col gap-4">
                        <div className="heading-100">{selectedContact.name}</div>
                        <div className="flex items-center gap-2">
                          <TrellisIcon name="artificialIntelligence" size={14} />
                          <span className="heading-50 text-foreground">Building sequence for {selectedContact.name}…</span>
                        </div>
                        <AgentReasoningSteps kind="sequence" stepMs={3000} />
                      </div>
                    ) : previewState === "done" ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className={`h-8 w-8 ${selectedContact.avatarColor}`}>
                            <AvatarFallback className={`${selectedContact.avatarColor} text-white text-xs`}>
                              {selectedContact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="heading-100">{selectedContact.name}</div>
                            <div className="body-100" style={{ color: "var(--color-text-core-subtle)" }}>
                              {selectedContact.role} at {selectedContact.company.name}
                            </div>
                          </div>
                        </div>
                        <OutreachSequenceCard
                          contact={{ id: selectedContact.id, name: selectedContact.name, initials: selectedContact.initials, avatarColor: selectedContact.avatarColor }}
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
                          getCallScript={() => getEditable(`${selectedContact.id}-callScript`, dossier.callScript)}
                          onCallScriptChange={(v) => setEditable(`${selectedContact.id}-callScript`, v)}
                          getLinkedInMessage={() => getEditable(`${selectedContact.id}-linkedin`, dossier.linkedInMessage)}
                          onLinkedInMessageChange={(v) => setEditable(`${selectedContact.id}-linkedin`, v)}
                          getEmailSubject={(idx) => getEditable(`${selectedContact.id}-email-${idx}-subject`, dossier.emails[idx]?.subject ?? "")}
                          onEmailSubjectChange={(idx, v) => setEditable(`${selectedContact.id}-email-${idx}-subject`, v)}
                          getEmailBody={(idx) => getEditable(`${selectedContact.id}-email-${idx}-body`, dossier.emails[idx]?.body ?? "")}
                          onEmailBodyChange={(idx, v) => setEditable(`${selectedContact.id}-email-${idx}-body`, v)}
                          scriptMode={scriptMode}
                          onScriptModeChange={setScriptMode}
                          onViewReasoning={() => {}}
                          enableFeedback
                        />
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className={`h-8 w-8 ${selectedContact.avatarColor}`}>
                            <AvatarFallback className={`${selectedContact.avatarColor} text-white text-xs`}>
                              {selectedContact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="heading-100">{selectedContact.name}</div>
                            <div className="body-100" style={{ color: "var(--color-text-core-subtle)" }}>
                              {selectedContact.role} at {selectedContact.company.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </>
              ) : (
                <>
                  <Card className={`p-5 border-[var(--color-border-core-subtle)] ${previewState === "done" ? "pb-0" : ""}`}>
                    {previewState === "running" ? (
                      <div className="flex flex-col gap-4">
                        <div className="heading-100">{selectedCompany.name}</div>
                        <div className="flex items-center gap-2">
                          <TrellisIcon name="artificialIntelligence" size={14} />
                          <span className="heading-50 text-foreground">Researching {selectedCompany.name}…</span>
                        </div>
                        <AgentReasoningSteps kind="research" stepMs={4000} />
                      </div>
                    ) : previewState === "done" ? (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={companyLogoPlaceholder}
                              alt={`${selectedCompany.name} logo`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="heading-100">{selectedCompany.name}</div>
                              <div
                                className="body-100 flex items-center gap-1.5"
                                style={{ color: "var(--color-text-core-subtle)" }}
                              >
                                <span>{selectedCompany.industry}</span>
                                <span>•</span>
                                <PvsTooltip pvsScore={selectedCompany.pvsScore}>
                                  <span className="cursor-default">PVS {selectedCompany.pvsScore ?? "—"}</span>
                                </PvsTooltip>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="heading-100 text-foreground mb-3">Summary</h3>
                          <p className="body-100 text-muted-foreground mb-3">{strategy.summary}</p>
                          <ul className="list-disc pl-5 flex flex-col gap-2">
                            {strategy.summaryBullets.map((bullet, idx) => (
                              <li key={idx} className="body-100 text-foreground leading-relaxed">
                                {bullet}
                              </li>
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
                                {researchRows.map((row, idx) => (
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

                            {strategy.researchConflicts && (
                              <div className="mx-4 my-4 px-5 py-4 bg-[var(--color-fill-caution-subtle)] rounded-300 flex flex-col gap-2">
                                <span className="heading-50 text-[var(--color-border-caution-default)]">
                                  Key Conflicts & Data Gaps
                                </span>
                                <ul className="list-disc pl-4 flex flex-col gap-1">
                                  {strategy.researchConflicts
                                    .split(/\n/)
                                    .map((l) => l.replace(/^\s*[-•]\s+/, "").trim())
                                    .filter(Boolean)
                                    .map((line, li) => (
                                      <li key={li} className="body-100 text-foreground leading-relaxed">
                                        <BoldText text={line} />
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src={companyLogoPlaceholder}
                            alt={`${selectedCompany.name} logo`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="heading-100">{selectedCompany.name}</div>
                            <div
                              className="body-100 flex items-center gap-1.5"
                              style={{ color: "var(--color-text-core-subtle)" }}
                            >
                              <span>{selectedCompany.industry}</span>
                              <span>•</span>
                              <PvsTooltip pvsScore={selectedCompany.pvsScore}>
                                <span className="cursor-default">PVS {selectedCompany.pvsScore ?? "—"}</span>
                              </PvsTooltip>
                            </div>
                          </div>
                        </div>
                        <SignalChipRow signals={selectedCompany.signals} />
                      </div>
                    )}
                  </Card>
                </>
              )}

              <div className="flex items-baseline justify-end mt-5">
                {previewState === "idle" && <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center gap-1.5 body-100 font-medium shrink-0">
                      {isSequencing ? "Change contact" : "Change company"}
                      <ChevronDown size={14} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 p-0">
                    <Command>
                      <CommandInput placeholder={isSequencing ? "Search contacts..." : "Search companies..."} />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {isSequencing
                            ? PREVIEW_CONTACTS.map((ct) => (
                                <CommandItem
                                  key={ct.id}
                                  value={ct.name}
                                  onSelect={() => {
                                    setSelectedContact(ct);
                                    setPickerOpen(false);
                                  }}
                                  className="cursor-pointer body-100"
                                >
                                  <div>
                                    <div className="font-medium">{ct.name}</div>
                                    <div
                                      className="text-xs"
                                      style={{ color: "var(--color-text-core-subtle)" }}
                                    >
                                      {ct.role} at {ct.company.name}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))
                            : PREVIEW_COMPANIES.map((co) => (
                                <CommandItem
                                  key={co.name}
                                  value={co.name}
                                  onSelect={() => {
                                    setSelectedCompany(co);
                                    setPickerOpen(false);
                                  }}
                                  className="cursor-pointer body-100"
                                >
                                  <div>
                                    <div className="font-medium">{co.name}</div>
                                    <div
                                      className="text-xs"
                                      style={{ color: "var(--color-text-core-subtle)" }}
                                    >
                                      {co.industry}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgentDetail;
