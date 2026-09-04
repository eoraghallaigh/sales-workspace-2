import { useState } from "react";
import { Phone } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { SignalChipRow } from "@/components/SignalChip";
import { OutreachSequenceCard } from "@/components/OutreachSequenceCard";
import CompanyResearchPanel from "@/components/CompanyResearchPanel";
import type { Company, RecommendedContact } from "@/components/CompanyCard";
import { getCompanyStrategy, type CompanyStrategyVariant } from "@/data/companyStrategies";
import { getContactDossier } from "@/data/contactDossier";
import { getOutreachState, getOutreachStripSegments } from "@/data/outreachStates";
import { prospectingCompanies } from "@/data/prospectingCompanies";

type ScriptMode = "script" | "bullets";

interface OutreachTargetCardProps {
  contact: RecommendedContact;
  company: Company;
  strategy: CompanyStrategyVariant;
}

const OutreachTargetCard = ({ contact, company, strategy }: OutreachTargetCardProps) => {
  const [expandedTouches, setExpandedTouches] = useState<Record<string, boolean>>({});
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [editedCallBullets, setEditedCallBullets] = useState<string[] | null>(null);
  const [scriptMode, setScriptMode] = useState<ScriptMode>("script");

  const getEditableContent = (key: string, fallback: string) => editedContent[key] ?? fallback;
  const setEditableContent = (key: string, v: string) =>
    setEditedContent((prev) => ({ ...prev, [key]: v }));

  const dossier = getContactDossier(
    { id: contact.id, name: contact.name, role: contact.role, signals: contact.signals, qlData: contact.qlData },
    { id: company.id, name: company.name, industry: company.industry },
    undefined,
  );
  const firstName = contact.name.split(" ")[0];
  const outreachState = getOutreachState(contact.id, firstName);
  const emailTemplates = dossier.emails;

  return (
    <div className="mb-6 rounded-300 border-100 border-core-subtle overflow-hidden pb-6">
      <div className="flex items-center justify-between gap-3 px-6 py-4 bg-[var(--color-fill-surface-recessed)]">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={contact.avatarColor + " text-white heading-50"}>
              {contact.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="heading-100 text-text-interactive">{contact.name}</span>
            <div className="body-100 text-muted-foreground">
              {contact.role}
              {contact.lastContactedDate && <> | Last contacted: {contact.lastContactedDate}</>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
            <TrellisIcon name="email" size={16} />
          </button>
          <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
            <TrellisIcon name="calling" size={16} />
          </button>
          <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
            <TrellisIcon name="linkedin" size={16} />
          </button>
          <button className="flex items-center justify-center hover:opacity-70 transition-opacity" aria-label="Hide contact">
            <TrellisIcon name="hide" size={16} />
          </button>
        </div>
      </div>

      {contact.signals.length > 0 && (
        <div className="px-6 py-0 bg-card">
          <SignalChipRow
            signals={contact.signals}
            owner={{ kind: "contact", id: contact.id, name: contact.name, role: contact.role }}
            className="mt-4 mb-4"
          />
        </div>
      )}

      <div className="px-6 pt-4 pb-0 bg-card">
        <p className="body-100 text-foreground leading-relaxed mb-4">{dossier.blurb}</p>
        <p className="heading-50 text-foreground mb-1">Primary Friction:</p>
        <p className="body-100 text-foreground leading-relaxed mb-3">{dossier.primaryFriction}</p>
        <div className="mb-12">
          <Button variant="primary" size="small">
            <Phone />
            Call {firstName}
          </Button>
        </div>

        <OutreachSequenceCard
          contact={{
            id: contact.id,
            name: contact.name,
            initials: contact.initials,
            avatarColor: contact.avatarColor,
          }}
          sequenceGeneratedAt={strategy.generatedAt}
          staleInstructions
          callBullets={editedCallBullets ?? dossier.callBullets}
          onCallBulletChange={(idx, value) =>
            setEditedCallBullets((prev) => {
              const current = prev ?? dossier.callBullets;
              const next = [...current];
              next[idx] = value;
              return next;
            })
          }
          scriptMode={scriptMode}
          onScriptModeChange={setScriptMode}
          call={outreachState.call}
          linkedin={outreachState.linkedin}
          sequence={outreachState.sequence}
          defaultCallScript={dossier.callScript}
          defaultLinkedInMessage={dossier.linkedInMessage}
          emailTemplates={emailTemplates}
          expandedTouches={expandedTouches}
          onToggleTouch={(id) => setExpandedTouches((prev) => ({ ...prev, [id]: !prev[id] }))}
          getCallScript={() => getEditableContent(`${contact.id}-call`, dossier.callScript)}
          onCallScriptChange={(v) => setEditableContent(`${contact.id}-call`, v)}
          getLinkedInMessage={() => getEditableContent(`${contact.id}-linkedin`, dossier.linkedInMessage)}
          onLinkedInMessageChange={(v) => setEditableContent(`${contact.id}-linkedin`, v)}
          getEmailSubject={(idx) =>
            getEditableContent(`${contact.id}-email-${idx}-subject`, emailTemplates[idx].subject)
          }
          onEmailSubjectChange={(idx, v) => setEditableContent(`${contact.id}-email-${idx}-subject`, v)}
          getEmailBody={(idx) => getEditableContent(`${contact.id}-email-${idx}`, emailTemplates[idx].body)}
          onEmailBodyChange={(idx, v) => setEditableContent(`${contact.id}-email-${idx}`, v)}
          onViewReasoning={() => {}}
          onRegenerate={() => {}}
          enableFeedback
        />
      </div>
    </div>
  );
};

interface OutreachStrategyPanelProps {
  companyId: string;
}

export const OutreachStrategyPanel = ({ companyId }: OutreachStrategyPanelProps) => {
  const company = prospectingCompanies.find((c) => c.id === companyId);
  const strategy = getCompanyStrategy(companyId).default;
  const [isResearchOpen, setIsResearchOpen] = useState(false);

  if (!company) return null;

  const outreachTargets = company.recommendedContacts.slice(0, 3);
  const seg = getOutreachStripSegments(outreachTargets);
  const buckets: Array<{ count: number; label: string; bg: string }> = [
    { count: seg.engaged, label: "replied", bg: "var(--color-fill-accent-green-default)" },
    { count: seg.inFlight, label: "awaiting response", bg: "var(--color-fill-accent-green-subtle)" },
    { count: seg.notStarted, label: "not started", bg: "var(--color-fill-surface-recessed)" },
  ];

  return (
    <div className="bg-card mt-4 px-6 py-6 border-100 border-[var(--color-border-core-subtle)] rounded-300 shadow-100">
      <Collapsible defaultOpen className="mb-12">
        <CollapsibleTrigger className="flex items-center gap-2 w-full group">
          <TrellisIcon
            name="downCarat"
            size={12}
            className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90"
          />
          <h3 className="heading-200 text-foreground">Company Research</h3>
          {strategy.generatedAt && (
            <span className="detail-200 text-muted-foreground ml-auto font-normal">
              {strategy.generatedAt}
            </span>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <ul className="list-disc pl-5 flex flex-col gap-2.5">
            {strategy.summaryBullets.slice(0, 5).map((bullet, idx) => (
              <li key={idx} className="body-100 text-foreground leading-relaxed">
                {bullet}
              </li>
            ))}
          </ul>
          <Button
            variant="ai-secondary"
            size="small"
            className="mt-4"
            onClick={() => setIsResearchOpen(true)}
          >
            Read full research
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen className="mb-4">
        <CollapsibleTrigger className="flex items-center gap-2 w-full group">
          <TrellisIcon
            name="downCarat"
            size={12}
            className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90"
          />
          <h3 className="heading-200 text-foreground">
            Outreach targets{outreachTargets.length > 0 ? ` (${outreachTargets.length})` : ""}
          </h3>
          {seg.total > 0 && (
            <div className="ml-auto flex items-center gap-3 shrink-0">
              {buckets.map((b) =>
                b.count > 0 ? (
                  <div key={b.label} className="flex items-center gap-1.5">
                    <div
                      className="h-2 rounded-sm"
                      style={{ width: `${b.count * 10}px`, background: b.bg, minWidth: "8px" }}
                    />
                    <span className="detail-200 text-muted-foreground whitespace-nowrap">
                      {b.count} {b.label}
                    </span>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          {outreachTargets.map((contact) => (
            <OutreachTargetCard key={contact.id} contact={contact} company={company} strategy={strategy} />
          ))}
        </CollapsibleContent>
      </Collapsible>

      <CompanyResearchPanel
        isOpen={isResearchOpen}
        onClose={() => setIsResearchOpen(false)}
        companyName={company.name}
        strategy={strategy}
      />
    </div>
  );
};

export default OutreachStrategyPanel;
