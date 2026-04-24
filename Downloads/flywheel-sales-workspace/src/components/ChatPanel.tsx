import { useRef, useState } from "react";
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

const EmptyState = () => (
  <div className="flex h-full items-end pb-2">
    <h1
      className="bg-clip-text text-transparent font-medium leading-[1.15] text-[32px]"
      style={{ backgroundImage: "linear-gradient(135deg, #FF4800 0%, #FB31A7 100%)" }}
    >
      <span>Hi Eoin,<br />how can I help you?</span>
    </h1>
  </div>
);

export const ChatPanel = ({ isOpen, onClose, selectedText }: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showProjectsUpsell, setShowProjectsUpsell] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  const canSend = inputValue.trim().length > 0;

  return (
    <div className="fixed top-12 right-0 w-96 h-[calc(100vh-48px)] bg-card border-l border-border shadow-lg z-40 flex flex-col">
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
            <TrellisIcon name="x" size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4">
        {selectedText ? <ExplanationContent selectedText={selectedText} /> : <EmptyState />}
      </div>

      <div className="px-5 pt-2 space-y-5">
        <div className="relative rounded-[20px] border border-border bg-card focus-within:border-neutral-400 transition-colors">
          <div className="px-4 pt-4 pb-3">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type @ to mention a record"
              rows={3}
              className="block w-full resize-none border-0 bg-transparent body-200 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 min-h-[72px] pr-10"
            />
          </div>

          <button
            type="button"
            disabled={!canSend}
            aria-label="Send"
            className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full transition-all disabled:cursor-not-allowed"
            style={{
              backgroundImage: canSend
                ? "linear-gradient(135deg, #FF4800 0%, #FB31A7 100%)"
                : "linear-gradient(135deg, #FBDDD2 0%, #FCC3DC 100%)",
            }}
          >
            <TrellisIcon
              name="sortTableAsc"
              size={14}
              style={{
                filter: canSend
                  ? "brightness(0) invert(1)"
                  : "brightness(0) saturate(100%) invert(69%) sepia(47%) saturate(369%) hue-rotate(296deg) brightness(95%) contrast(97%)",
              }}
            />
          </button>

          <div className="flex items-center gap-1 px-3 pb-2">
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
          <button type="button" className="body-125 text-foreground hover:text-primary transition-colors">
            Summarize
          </button>
          <button type="button" className="body-125 text-foreground hover:text-primary transition-colors">
            Create
          </button>
          <button type="button" className="body-125 text-foreground hover:text-primary transition-colors">
            How do I
          </button>
          <button type="button" className="flex items-center gap-1.5 body-125 text-foreground hover:text-primary transition-colors">
            <TrellisIcon name="meetings" size={14} />
            Meetings
          </button>
        </div>

        {showProjectsUpsell && (
          <div className="relative rounded-xl border border-border p-4 pr-10 flex gap-3 items-start">
            <div className="shrink-0 mt-0.5">
              <TrellisIcon name="folderOpen" size={20} />
            </div>
            <div className="min-w-0">
              <p className="body-125 font-semibold text-foreground">Skip the setup next time</p>
              <p className="body-100 text-muted-foreground mt-1">
                Projects save your context, instructions, and files so every new chat starts ready.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowProjectsUpsell(false)}
              aria-label="Dismiss"
              className="absolute top-3 right-3 p-1 rounded hover:bg-muted transition-colors"
            >
              <TrellisIcon name="x" size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="px-5 pt-10 pb-4 text-center">
        <small className="body-100 text-muted-foreground">AI-generated content may be inaccurate.</small>
      </div>
    </div>
  );
};
