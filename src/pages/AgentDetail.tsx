import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, RotateCcw, RotateCw } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCyclePath } from "@/hooks/useCyclePath";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { SignalChipRow } from "@/components/SignalChip";
import { sig } from "@/data/signals";

const PREVIEW_COMPANIES = [
  { name: "ACME Corp", industry: "Software & Technology", signals: [
    sig("funding-round", { headline: "Raised $28M Series B", rows: [{ label: "Round", value: "Series B" }, { label: "Amount", value: "$28M" }], footnote: "Source: Crunchbase" }),
    sig("hiring-surge", { headline: "24 open roles, up 45% this quarter", rows: [{ label: "Open roles", value: "24" }, { label: "Concentrated in", value: "Sales" }], footnote: "Source: job listings" }),
  ]},
  { name: "TechVision Inc", industry: "Data Analytics", signals: [
    sig("new-hire", { headline: "Marcus Bell joined as CRO", rows: [{ label: "Role", value: "Chief Revenue Officer" }], footnote: "Source: LinkedIn" }),
    sig("tech-stack-change", { headline: "Adopted Snowflake", rows: [{ label: "Added", value: "Snowflake" }], footnote: "Source: BuiltWith" }),
  ]},
  { name: "DataStream Analytics", industry: "Data Analytics", signals: [
    sig("hiring-surge", { headline: "18 open roles, up 32%", rows: [{ label: "Open roles", value: "18" }], footnote: "Source: job listings" }),
  ]},
  { name: "CloudScale Systems", industry: "Cloud Infrastructure", signals: [
    sig("funding-round", { headline: "Raised $65M Series C", rows: [{ label: "Round", value: "Series C" }, { label: "Amount", value: "$65M" }], footnote: "Source: Crunchbase" }),
  ]},
  { name: "Summit Financial", industry: "Financial Services", signals: [
    sig("former-customer", { headline: "Previously a Sales Hub customer", rows: [{ label: "Product", value: "Sales Hub" }], footnote: "Source: CRM history" }),
  ]},
];

const AGENT_CONFIG: Record<string, { title: string; description: string; placeholder: string }> = {
  research: {
    title: "Company research agent",
    description: "Define your research priorities and output structure.",
    placeholder: "e.g. Focus on recent funding rounds, leadership changes, and technology stack. Format the output as bullet points grouped by category.",
  },
  sequencing: {
    title: "Sequencing agent",
    description: "Define your outreach style and sequence preferences.",
    placeholder: "e.g. Keep emails under 100 words. Use a casual but professional tone. Reference the prospect's recent LinkedIn activity when possible.",
  },
};

const AgentDetail = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { cyclePath } = useCyclePath();
  const config = AGENT_CONFIG[agentId || ""] || AGENT_CONFIG.research;

  const [instructions, setInstructions] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(PREVIEW_COMPANIES[0]);
  const [companyOpen, setCompanyOpen] = useState(false);

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
          <div className="flex gap-16 items-start max-w-[1200px]">
            {/* Left: Configure */}
            <div className="flex-1 min-w-0">
              <h2 className="heading-300 mb-1">Configure the agent</h2>
              <p
                className="body-100 mb-5"
                style={{ color: "var(--color-text-core-subtle)" }}
              >
                {config.description}
              </p>

              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={config.placeholder}
                className="w-full min-h-[240px] rounded-[var(--radius-card)] border border-[var(--color-border-core-subtle)] bg-[var(--color-fill-secondary-default)] p-4 body-100 resize-y focus:outline-none focus:border-[var(--color-border-interactive-pressed)]"
                style={{ color: "var(--color-text-core-default)" }}
              />

              <div className="flex items-center gap-1 mt-2">
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
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex-1 min-w-0">
              <div className="mb-5">
                <h2 className="heading-300">Preview your changes</h2>
                <p
                  className="body-100 mt-1"
                  style={{ color: "var(--color-text-core-subtle)" }}
                >
                  This is just a test run, it won't add anything to the company record.
                </p>
              </div>

              <Card className="p-5 border-[var(--color-border-core-subtle)] mb-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={companyLogoPlaceholder}
                      alt={`${selectedCompany.name} logo`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="heading-100">{selectedCompany.name}</div>
                      <div
                        className="body-100"
                        style={{ color: "var(--color-text-core-subtle)" }}
                      >
                        {selectedCompany.industry}
                      </div>
                    </div>
                  </div>
                  <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                    <PopoverTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 body-100 font-medium shrink-0">
                        Change company
                        <ChevronDown size={14} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-64 p-0">
                      <Command>
                        <CommandInput placeholder="Search companies..." />
                        <CommandList>
                          <CommandEmpty>No companies found.</CommandEmpty>
                          <CommandGroup>
                            {PREVIEW_COMPANIES.map((co) => (
                              <CommandItem
                                key={co.name}
                                value={co.name}
                                onSelect={() => {
                                  setSelectedCompany(co);
                                  setCompanyOpen(false);
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
                  </Popover>
                </div>

                <SignalChipRow signals={selectedCompany.signals} />
              </Card>

              <Button variant="ai" size="medium">
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgentDetail;
