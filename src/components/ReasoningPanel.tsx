import { useState } from "react";
import { ChevronRight, ChevronDown, X, Wrench, Globe, Building2, Users, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import BreezeBadge from "@/components/BreezeBadge";

interface ReasoningPanelProps {
  onClose: () => void;
  contactName: string;
  companyName: string;
}

type CitationSource = {
  name: string;
  type: string;
  icon: typeof Building2;
  iconBorder: string;
};

const RecordChip = ({ icon: Icon, label }: { icon: typeof Building2; label: string }) => (
  <span className="inline-flex items-center gap-1 align-middle px-1.5 py-0.5 rounded border border-border bg-background-secondary detail-200 text-text-interactive">
    <Icon className="h-3 w-3" />
    {label}
  </span>
);

const Citation = ({ n, source }: { n: number; source: CitationSource }) => {
  const Icon = source.icon;

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <sup
          tabIndex={0}
          className="inline-flex items-center justify-center h-4 w-4 ml-0.5 rounded-full bg-fill-tertiary text-text-interactive detail-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {n}
        </sup>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-3" sideOffset={6}>
        <div className="flex flex-col gap-3">
          <div className="bg-background-secondary rounded-200 px-4 py-3 flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full bg-white shrink-0"
              style={{ width: 32, height: 32, border: `1px solid ${source.iconBorder}` }}
            >
              <Icon className="h-4 w-4 text-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="heading-50 text-foreground leading-tight">{source.name}</span>
              <span className="detail-200 text-muted-foreground leading-tight">{source.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex items-center justify-center h-6 w-6 rounded hover:bg-background-secondary"
              aria-label="Helpful"
            >
              <ThumbsUp className="h-3 w-3 text-muted-foreground" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center h-6 w-6 rounded hover:bg-background-secondary"
              aria-label="Not helpful"
            >
              <ThumbsDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const ToolsCalledRow = ({ tools }: { tools: { icon: typeof Wrench; label: string }[] }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-1.5 text-left"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="detail-200 text-muted-foreground">{tools.length} tools called</span>
      </button>
      {expanded ? (
        <ul className="pl-7 pt-2 space-y-1.5">
          {tools.map((t, i) => {
            const Icon = t.icon;
            return (
              <li key={i} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="detail-200 text-muted-foreground">{t.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

const ReasoningPanel = ({ onClose, contactName, companyName }: ReasoningPanelProps) => {
  const firstName = contactName.split(" ")[0];

  const sources: Record<number, CitationSource> = {
    1: { name: `${companyName} — Services`, type: "Company website", icon: Globe, iconBorder: "#cbd6e2" },
    2: { name: `${companyName} — About`, type: "Company website", icon: Globe, iconBorder: "#cbd6e2" },
    3: { name: `${companyName} — Careers`, type: "Company website", icon: Globe, iconBorder: "#cbd6e2" },
    4: { name: "LinkedIn job posts", type: "Web result", icon: Globe, iconBorder: "#cbd6e2" },
    5: { name: contactName, type: "HubSpot Contact", icon: Users, iconBorder: "#ff7a59" },
  };

  const tools = [
    { icon: Building2, label: "Looked up the company record in CRM" },
    { icon: Users, label: "Pulled most-engaged contacts on the account" },
    { icon: Globe, label: `Searched ${companyName}'s services and about pages` },
    { icon: Globe, label: "Scanned recent job postings for hiring signals" },
    { icon: Wrench, label: "Checked internal writing guidance" },
  ];

  return (
    <motion.div
      key="reasoning-panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-12 right-0 h-[calc(100vh-3rem)] bg-white z-50 overflow-y-auto shadow-300"
      style={{ width: "569px" }}
    >
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <BreezeBadge />
          <div>
            <h2 className="heading-200 text-foreground">Outreach Agent</h2>
            <div className="detail-200 text-muted-foreground">How this sequence was built</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-5 w-5 text-foreground" />
        </Button>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div>
          <div className="heading-100 text-foreground mb-3">Thought process</div>
          <ol className="space-y-3 list-decimal pl-5 body-100 text-foreground leading-relaxed">
            <li>
              <strong>Raw signals:</strong> {contactName} is in CRM at{" "}
              <RecordChip icon={Users} label={contactName} /> with{" "}
              <RecordChip icon={Building2} label={companyName} />.{" "}
              {companyName} positions itself around bookkeeping, payroll, financial reporting,
              dashboards, and clean-up/catch-up work for small and mid-sized businesses.
              <Citation n={1} source={sources[1]} />
              <Citation n={2} source={sources[2]} /> The company is also hiring for a sales rep,
              senior accountant, and full charge bookkeeper, which suggests growth and added
              operational complexity.
              <Citation n={3} source={sources[3]} />
              <Citation n={4} source={sources[4]} /> {firstName}'s background includes prior CFO
              roles and {companyName}'s messaging emphasizes helping owners reclaim time while
              improving reporting quality.
              <Citation n={5} source={sources[5]} />
            </li>
            <li>
              <strong>Trigger:</strong> The strongest trigger is the visible hiring plus their move
              upmarket into more complex service delivery like forecasting, inventory, locations,
              job costing, and payroll.
              <Citation n={3} source={sources[3]} />
              <Citation n={4} source={sources[4]} />
            </li>
            <li>
              <strong>PROVES mapping:</strong> <strong>Root Cause:</strong> as firms like{" "}
              {companyName} add staff and serve more complex client needs, delivery, handoffs, and
              pipeline visibility often get fragmented across sales, onboarding, and client
              management. <strong>Outcome:</strong> tighter lead-to-client handoff, cleaner
              follow-up, and better visibility into growth without adding admin drag.{" "}
              <strong>Fears:</strong> dropped inquiries, inconsistent follow-up, and growth creating
              more manual work instead of leverage. <strong>Differentiator:</strong> HubSpot can
              help unify sales activity, handoffs, and customer visibility in one system.
            </li>
            <li>
              <strong>Output format:</strong> Compressed the PROVES flow into a 3-touch sequence:
              Email 1 = problem + trigger, Email 2 = root cause, Email 3 = outcome + low-friction
              CTA.
            </li>
          </ol>
        </div>

        <ToolsCalledRow tools={tools} />

        <button className="flex items-center gap-2 px-3 py-2 rounded-100 border border-border bg-background-secondary hover:bg-background-tertiary transition-colors">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="detail-200 text-foreground">5 Sources</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ReasoningPanel;
