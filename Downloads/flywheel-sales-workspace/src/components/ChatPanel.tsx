import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrellisIcon } from "@/components/ui/trellis-icon";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string;
  context?: string;
}

const GMAIL_ICON = "https://50277935.fs1.hubspotusercontent-na1.net/hubfs/50277935/assets/icons/apps/gmail.svg";
const GDRIVE_ICON = "https://50277935.fs1.hubspotusercontent-na1.net/hubfs/50277935/assets/icons/apps/gdrive.svg";
const CONFLUENCE_ICON = "https://50277935.fs1.hubspotusercontent-na1.net/hubfs/50277935/assets/icons/apps/confluence.svg";

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

export const ChatPanel = ({ isOpen, onClose, selectedText }: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = inputValue.trim().length > 0;

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

      <div className={`px-5 space-y-5 ${selectedText ? "pt-2" : "my-auto"}`}>
        {!selectedText && <div className="px-1"><EmptyState /></div>}
        <div
          className="group/input relative rounded-[16px] border border-[#dfe3eb] bg-card"
          style={{ boxShadow: "0 1px 8px 0 rgba(20, 20, 20, 0.08)" }}
        >
          <div className="px-3 pt-3 pb-4">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type @ to mention a record"
              rows={3}
              className="block w-full resize-none border-0 bg-transparent text-[14px] text-foreground placeholder:text-[#aaaaaa] placeholder:text-[14px] focus:outline-none focus:ring-0 min-h-[92px] pr-10"
            />
          </div>

          <button
            type="button"
            disabled={!canSend}
            aria-label="Send"
            className="absolute right-3 bottom-3 flex h-6 w-6 items-center justify-center rounded-full transition-all disabled:cursor-not-allowed"
            style={{
              background: canSend ? BREEZE_GRADIENT : "#fbdbe9",
            }}
          >
            <TrellisIcon
              name="sortTableAsc"
              size={12}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </button>

          <div className="flex items-center gap-1 px-3 pb-2 opacity-0 pointer-events-none transition-opacity duration-200 group-focus-within/input:opacity-100 group-focus-within/input:pointer-events-auto group-hover/input:opacity-100 group-hover/input:pointer-events-auto">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full px-2 py-1 hover:bg-muted transition-colors"
            >
              <span className="flex items-center -space-x-1">
                <img src={GMAIL_ICON} alt="Gmail" width={12} height={12} className="rounded-full ring-1 ring-card" />
                <img src={GDRIVE_ICON} alt="Google Drive" width={12} height={12} className="rounded-full ring-1 ring-card" />
                <img src={CONFLUENCE_ICON} alt="Confluence" width={12} height={12} className="rounded-full ring-1 ring-card" />
              </span>
              <span className="detail-100 text-muted-foreground">Apps</span>
            </button>
            <Button variant="ghost" size="sm" className="p-1.5 h-7 w-7" aria-label="Upload files">
              <TrellisIcon name="attach" size={14} />
            </Button>
            <Button variant="ghost" size="sm" className="p-1.5 h-7 w-7" aria-label="Saved prompts">
              <TrellisIcon name="bookmark" size={14} />
            </Button>
            <Button variant="ghost" size="sm" className="p-1.5 h-7 w-7" aria-label="Reference data">
              <TrellisIcon name="mention" size={14} />
            </Button>
          </div>
        </div>

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
      </div>

      <div className="px-5 pt-10 pb-4 text-center">
        <small className="body-100 text-muted-foreground">AI-generated content may be inaccurate.</small>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
