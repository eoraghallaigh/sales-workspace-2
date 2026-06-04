import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { ResearchSectionBody } from "@/components/ResearchSectionBody";
import { getCompanyStrategy } from "@/data/companyStrategies";
import { prospectingCompanies } from "@/data/prospectingCompanies";

const SUGGESTED_PROMPTS = [
  "Research [company name or domain]",
  "Who are the best outreach targets at [company name] and what should I say?",
  "Give me talking points for [contact name] at [company name]",
  "Write a sequence for [contact name]",
];

const AiMessageIcon = ({ size = 22, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M13.43 10c4.42 0 8-3.58 8-8 0 4.42 3.58 8 8 8-4.42 0-8 3.58-8 8 0-4.42-3.58-8-8-8" />
    <path d="M21.43 19.14c-.63 0-1.14-.51-1.14-1.14 0-3.78-3.08-6.86-6.86-6.86a1.14 1.14 0 1 1 0-2.28c3.78 0 6.86-3.08 6.86-6.86a1.14 1.14 0 1 1 2.28 0c0 3.78 3.08 6.86 6.86 6.86a1.14 1.14 0 1 1 0 2.28c-3.78 0-6.86 3.08-6.86 6.86 0 .63-.51 1.14-1.14 1.14M17.85 10c1.5.83 2.74 2.08 3.58 3.58.83-1.5 2.08-2.74 3.58-3.58a9.26 9.26 0 0 1-3.58-3.58A9.26 9.26 0 0 1 17.85 10" />
    <path d="M2 30.57c-.15 0-.3-.03-.44-.09-.43-.18-.71-.59-.71-1.06V6.57c0-1.89 1.54-3.43 3.43-3.43h11.43a1.14 1.14 0 1 1 0 2.28H4.29c-.63 0-1.14.51-1.14 1.14v20.1l4.91-4.91c.21-.21.5-.33.81-.33h16c.63 0 1.14-.51 1.14-1.14v-4.57a1.14 1.14 0 1 1 2.28 0v4.57c0 1.89-1.54 3.43-3.43 3.43H9.33l-6.52 6.52c-.22.22-.51.33-.81.33Z" />
  </svg>
);

const ResearchView = ({ companyId }: { companyId: string }) => {
  const company = prospectingCompanies.find((c) => c.id === companyId);
  const strategy = getCompanyStrategy(companyId).default;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <TrellisIcon name="artificialIntelligence" size={14} />
          <h3 className="heading-100 text-foreground">
            Company research{company ? ` — ${company.name}` : ""}
          </h3>
        </div>
        <p className="body-100 text-muted-foreground">{strategy.summary}</p>
      </div>
      {strategy.sections.map((section, idx) => (
        <div key={`${section.heading}-${idx}`} className="flex flex-col gap-2">
          <h4 className="heading-50 text-foreground">{section.heading}</h4>
          <ResearchSectionBody body={section.body} />
        </div>
      ))}
    </div>
  );
};

const ProspectingAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [view, setView] = useState<"default" | "research">("default");
  const [researchCompanyId, setResearchCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      if (detail.mode === "research" && detail.companyId) {
        setResearchCompanyId(detail.companyId);
        setView("research");
      } else {
        setView("default");
      }
      setIsOpen(true);
    };
    window.addEventListener("openProspectingAgent", handleOpen);
    return () => window.removeEventListener("openProspectingAgent", handleOpen);
  }, []);

  const toggleOpen = () => {
    setIsOpen((open) => {
      if (!open) setView("default");
      return !open;
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="prospecting-agent-panel"
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed top-16 right-6 bottom-24 w-[380px] z-40 flex flex-col bg-card border border-core-subtle rounded-2xl shadow-400 overflow-hidden"
            aria-label="Flywheel Prospecting Agent"
          >
            <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-core-subtle shrink-0">
              <h2 className="heading-100 text-foreground">Flywheel Prospecting Agent</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 detail-100"
                  onClick={() => {
                    setInputValue("");
                    setView("default");
                  }}
                >
                  Clear
                </Button>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Expand">
                  <TrellisIcon name="expand" size={16} />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
              {view === "research" && researchCompanyId ? (
                <ResearchView companyId={researchCompanyId} />
              ) : (
                <>
                  <p className="body-100 text-foreground">
                    Hi! I'm an agent directly inspired by your AI-forward peers like Coke Orellana and
                    Thomas Gonzalez — but trained on your own writing style.
                  </p>
                  <p className="body-100 text-foreground">
                    I research both inside and outside SE, cross-checking so you always get the full
                    picture and the latest news.
                  </p>
                  <div className="flex flex-col items-start gap-2 pt-2">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setInputValue(prompt)}
                        className="text-left rounded-2xl border border-core-subtle bg-card px-3.5 py-2 body-100 text-foreground hover:bg-fill-secondary transition-colors max-w-full"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="px-5 pb-5 pt-3 shrink-0">
              <div className="flex items-center gap-2 rounded-full border border-trellis-magenta-600 bg-card pl-4 pr-2 py-1.5 focus-within:border-trellis-magenta-900 transition-colors">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask something…"
                  className="flex-1 bg-transparent border-0 outline-none body-100 text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  aria-label="Send"
                  disabled={!inputValue.trim()}
                  className="flex items-center justify-center h-8 w-8 rounded-full text-trellis-magenta-900 hover:bg-trellis-magenta-300 disabled:text-muted-foreground disabled:hover:bg-transparent transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? "Close Flywheel Prospecting Agent" : "Open Flywheel Prospecting Agent"}
        aria-expanded={isOpen}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#1c1c1c] text-white transition-transform hover:scale-105 ${
          isOpen ? "shadow-lg" : "ring-2 ring-[#ff5c35]"
        }`}
        style={
          isOpen
            ? undefined
            : { boxShadow: "0 4px 16px rgba(255, 92, 53, 0.35), 0 0 0 4px rgba(255, 92, 53, 0.15)" }
        }
      >
        {isOpen ? <X size={22} /> : <AiMessageIcon size={22} />}
      </button>
    </>
  );
};

export default ProspectingAgent;
