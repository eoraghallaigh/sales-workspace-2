import { forwardRef, KeyboardEvent, TextareaHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { TrellisIcon } from "@/components/ui/trellis-icon";

const BREEZE_GRADIENT = "linear-gradient(114deg, #fc0849 0%, #d20688 100%)";
const GMAIL_ICON = "https://50277935.fs1.hubspotusercontent-na1.net/hubfs/50277935/assets/icons/apps/gmail.svg";
const GDRIVE_ICON = "https://50277935.fs1.hubspotusercontent-na1.net/hubfs/50277935/assets/icons/apps/gdrive.svg";
const CONFLUENCE_ICON = "https://50277935.fs1.hubspotusercontent-na1.net/hubfs/50277935/assets/icons/apps/confluence.svg";

interface AITextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value" | "onSubmit"> {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  showFooter?: boolean;
  canSend?: boolean;
}

export const AITextarea = forwardRef<HTMLTextAreaElement, AITextareaProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder = "Type @ to mention a record",
      rows = 3,
      disabled = false,
      showFooter = true,
      canSend,
      onKeyDown,
      className,
      ...rest
    },
    ref,
  ) => {
    const trimmed = value.trim();
    const effectiveCanSend = canSend ?? (!disabled && trimmed.length > 0);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (onKeyDown) onKeyDown(e);
      if (e.defaultPrevented) return;
      if (e.key === "Enter" && !e.shiftKey && onSubmit) {
        e.preventDefault();
        if (effectiveCanSend) onSubmit(value);
      }
    };

    return (
      <div
        className="group/input relative z-10 rounded-[16px] border border-[#dfe3eb] bg-card"
        style={{ boxShadow: "0 1px 8px 0 rgba(20, 20, 20, 0.08)" }}
      >
        <div className="px-3 pt-3 pb-4">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`block w-full resize-none border-0 bg-transparent text-[14px] text-foreground placeholder:text-[#aaaaaa] placeholder:text-[14px] focus:outline-none focus:ring-0 min-h-[92px] pr-10 disabled:opacity-60 disabled:cursor-not-allowed ${className ?? ""}`}
            {...rest}
          />
        </div>

        <button
          type="button"
          disabled={!effectiveCanSend}
          aria-label="Send"
          onClick={() => onSubmit?.(value)}
          className="absolute right-3 bottom-3 flex h-6 w-6 items-center justify-center rounded-full transition-all disabled:cursor-not-allowed"
          style={{
            background: effectiveCanSend ? BREEZE_GRADIENT : "#fbdbe9",
          }}
        >
          <TrellisIcon
            name="sortTableAsc"
            size={12}
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </button>

        {showFooter && (
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
        )}
      </div>
    );
  },
);
AITextarea.displayName = "AITextarea";
