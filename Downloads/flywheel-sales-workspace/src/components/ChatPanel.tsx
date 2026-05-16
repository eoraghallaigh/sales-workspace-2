import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Star, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { AITextarea } from "@/components/ui/ai-textarea";
import { useStrategyAssistant } from "@/contexts/StrategyAssistantContext";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string;
  context?: string;
}

const ExplanationContent = ({ selectedText }: { selectedText: string }) => (
  <div className="space-y-4">
    <div className="bg-muted p-4 rounded-lg">
      <p className="body-200 text-foreground">
        Why was "<span className="body-125">{selectedText}</span>" included?
      </p>
    </div>

    <div className="flex justify-end">
      <Star className="h-5 w-5 text-muted-foreground" />
    </div>

    <div className="space-y-4">
      <h3 className="heading-50 text-foreground">Breeze</h3>

      <div className="space-y-4">
        <p className="body-100 text-foreground">
          This insight was included because it represents a critical risk to your customer's renewal and expansion potential:
        </p>
        <ul className="space-y-2 body-100 text-foreground ml-4">
          <li>• <strong>Declining engagement:</strong> Sales activity metrics show a significant downward trend over 3 months, indicating reduced adoption</li>
          <li>• <strong>License utilization risk:</strong> Lower activity correlates with underused seats (197/300 used), affecting ROI perception</li>
          <li>• <strong>Deal momentum impact:</strong> Reduced calls and meetings suggest pipeline stagnation and potential churn risk</li>
        </ul>
        <p className="body-100 text-foreground">
          This data point directly supports the recommendation to re-engage the sales team with workflows and automation to maximize their investment.
        </p>
      </div>

      <div className="space-y-3 mt-6">
        <Button variant="secondary-alt" size="small" className="justify-start h-auto py-2 px-4 text-left rounded-full w-full">
          <span className="detail-100">Tell me more about Sales usage trends</span>
        </Button>
        <Button variant="secondary-alt" size="small" className="justify-start h-auto py-2 px-4 text-left rounded-full w-full">
          <span className="detail-100">Show me similar at-risk customers</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button variant="ghost" size="sm" className="p-2"><ThumbsUp className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="p-2"><ThumbsDown className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="p-2"><Copy className="h-4 w-4" /></Button>
      </div>
    </div>
  </div>
);

const BREEZE_GRADIENT = "linear-gradient(114deg, #fc0849 0%, #d20688 100%)";

const EmptyState = () => (
  <h1
    className="bg-clip-text text-transparent font-medium leading-[1.15] text-[32px]"
    style={{ backgroundImage: BREEZE_GRADIENT }}
  >
    <span>Hi Eoin,<br />how can I help you?</span>
  </h1>
);

const STRATEGY_PATH_RE = /^\/prospecting\/strategy\/([^/?#]+)/;

const SUGGESTED_PROMPTS = [
  "Their Salesforce contract is ending soon",
  "They're a heavy Salesforce user",
];

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-muted self-start">
    <span className="block w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-pulse" style={{ animationDelay: "0ms" }} />
    <span className="block w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-pulse" style={{ animationDelay: "150ms" }} />
    <span className="block w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-pulse" style={{ animationDelay: "300ms" }} />
  </div>
);

export const ChatPanel = ({ isOpen, onClose, selectedText }: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { messages, isAssistantBusy, requestRewrite } = useStrategyAssistant();

  const strategyCompanyId = useMemo(() => {
    const m = location.pathname.match(STRATEGY_PATH_RE);
    return m ? m[1] : null;
  }, [location.pathname]);

  const onStrategyPage = strategyCompanyId !== null;
  const hasConversation = messages.length > 0;

  const canSend =
    inputValue.trim().length > 0 && onStrategyPage && !isAssistantBusy;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, isAssistantBusy]);

  const submit = (text: string) => {
    if (!strategyCompanyId) return;
    if (!text.trim()) return;
    if (isAssistantBusy) return;
    requestRewrite(strategyCompanyId, text);
    setInputValue("");
  };

  const showConversation = !selectedText && (hasConversation || isAssistantBusy);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-panel"
          initial={{ x: "calc(100% + 12px)" }}
          animate={{ x: 0 }}
          exit={{ x: "calc(100% + 12px)" }}
          transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
          className="fixed top-14 right-3 bottom-3 w-96 z-40 flex flex-col overflow-hidden"
          style={{
            background:
              "linear-gradient(var(--color-fill-surface-default), var(--color-fill-surface-default)) padding-box, " +
              BREEZE_GRADIENT +
              " border-box",
            border: "1px solid transparent",
            borderRadius: "16px",
          }}
        >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="body-125 text-teal-700 underline underline-offset-2 font-medium hover:text-teal-800 transition-colors"
        >
          Add assistant
        </a>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Page selector">
            <TrellisIcon name="verticalMenu" size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Projects">
            <TrellisIcon name="folderOpen" size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Expand">
            <TrellisIcon name="expand" size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2 h-8 w-8" aria-label="Close Assistant">
            <TrellisIcon name="remove" size={16} />
          </Button>
        </div>
      </div>

      {selectedText && (
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4">
          <ExplanationContent selectedText={selectedText} />
        </div>
      )}

      {showConversation && (
        <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4">
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "self-end max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3 py-2 body-100 whitespace-pre-wrap"
                    : "self-start max-w-[90%] rounded-2xl rounded-bl-sm bg-muted text-foreground px-3 py-2 body-100 whitespace-pre-wrap"
                }
              >
                {m.text}
              </div>
            ))}
            {isAssistantBusy && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <div className={`px-5 space-y-4 ${selectedText || showConversation ? "pt-2 pb-2" : "my-auto"}`}>
        {!selectedText && !showConversation && <div className="px-1"><EmptyState /></div>}

        {!selectedText && !onStrategyPage && (
          <p className="detail-100 text-muted-foreground text-center px-2">
            Open a company's prospecting strategy and I can rewrite it for you.
          </p>
        )}

        <div className="relative">
        <AnimatePresence>
          {!selectedText && onStrategyPage && !hasConversation && isInputFocused && (
            <motion.div
              key="suggested-prompts"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.7 }}
              className="absolute left-0 right-0 bottom-full mb-2 z-0 flex flex-col gap-2 pointer-events-auto"
            >
              <p className="detail-100 text-muted-foreground px-1">Try one of these to rewrite the strategy:</p>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => submit(prompt)}
                  className="text-left rounded-full border border-border bg-card px-3 py-2 body-100 text-foreground hover:bg-muted transition-colors shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <AITextarea
          ref={textareaRef}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={submit}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder={onStrategyPage ? "Ask me to rewrite the strategy…" : "Type @ to mention a record"}
          canSend={canSend}
        />
        </div>

        {!showConversation && !selectedText && (
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <button type="button" className="text-[12px] font-normal text-foreground hover:text-primary transition-colors">
              Summarize
            </button>
            <button type="button" className="text-[12px] font-normal text-foreground hover:text-primary transition-colors">
              Create
            </button>
            <button type="button" className="text-[12px] font-normal text-foreground hover:text-primary transition-colors">
              How do I
            </button>
            <button type="button" className="flex items-center gap-1.5 text-[12px] font-normal text-foreground hover:text-primary transition-colors">
              <TrellisIcon name="meetings" size={14} />
              Meetings
            </button>
          </div>
        )}
      </div>

      <div className="px-5 pt-4 pb-4 text-center">
        <small className="body-100 text-muted-foreground">AI-generated content may be inaccurate.</small>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
