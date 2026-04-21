import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import emailIcon from "@/assets/email-icon.png";
import callIcon from "@/assets/call-icon.png";
import sparkleIcon from "@/assets/sparkle-icon.png";
import aiBadge from "@/assets/ai-badge.png";

export interface DealContact {
  name: string;
  role: string;
  avatarUrl?: string;
  initials: string;
  signals: Array<{
    color: "green" | "yellow" | "orange" | "red";
    text: string;
  }>;
  actionDescription: string;
  actionLinkText?: string;
}

interface DealContactCardProps {
  contact: DealContact;
  onEmailClick?: () => void;
  onCallClick?: () => void;
  onGenerateEmail?: () => void;
  onAskAssistant?: () => void;
  onMoreDetails?: () => void;
}

const signalColorMap: Record<string, string> = {
  green: "bg-trellis-green-600",
  yellow: "bg-fill-caution",
  orange: "bg-trellis-orange-600",
  red: "bg-trellis-red-600",
};

const DealContactCard = ({
  contact,
  onEmailClick,
  onCallClick,
  onGenerateEmail,
  onAskAssistant,
  onMoreDetails,
}: DealContactCardProps) => {
  return (
    <div className="flex h-full flex-col border border-border rounded-lg bg-white min-w-[280px] max-w-[320px] overflow-hidden shadow-100">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 rounded-t-lg"
        style={{ background: "var(--color-fill-secondary-hover)" }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            {contact.avatarUrl && (
              <AvatarImage src={contact.avatarUrl} alt={`${contact.name} avatar`} />
            )}
            <AvatarFallback>{contact.initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="link-200 cursor-pointer hover:text-text-interactive transition-colors">
              {contact.name}
            </div>
            <div className="detail-200 text-muted-foreground">{contact.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-4 h-4 flex items-center justify-center"
            onClick={onEmailClick}
          >
            <img src={emailIcon} alt="Email" className="w-4 h-4" />
          </button>
          <button
            className="w-4 h-4 flex items-center justify-center"
            onClick={onCallClick}
          >
            <img src={callIcon} alt="Call" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 py-5 gap-2">
        {/* Signals */}
        <div className="flex flex-col gap-2 min-h-[48px]">
          {contact.signals.map((signal, idx) => (
            <div key={idx} className="flex items-center gap-2 body-100 text-foreground">
              <div className={`h-2.5 w-2.5 rounded-full ${signalColorMap[signal.color] || "bg-muted-foreground"}`} />
              {signal.text}
            </div>
          ))}
        </div>

        {/* Action description */}
        <div className="border-t border-border-subtle my-[12px]" />
        <div className="flex items-center justify-between">
          <span className="heading-50 text-text-core">Suggested Action</span>
          <img src={aiBadge} alt="AI" className="w-[30px] h-[20px]" />
        </div>
        <p className="body-100 text-foreground">
          {contact.actionDescription}
          {contact.actionLinkText && (
            <span
              className="!font-bold text-text-interactive cursor-pointer hover:underline ml-1"
              onClick={onMoreDetails}
            >
              {contact.actionLinkText}
            </span>
          )}
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 mt-2">
          <Button
            variant="transparent"
            size="small"
            className="heading-50 rounded-full border border-[var(--trellis-color-magenta-800)] text-[var(--trellis-color-magenta-900)] hover:text-[var(--trellis-color-magenta-1000)]"
            onClick={onGenerateEmail}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Email
          </Button>
          <Button
            variant="ghost"
            size="small"
            className="heading-50"
            onClick={onAskAssistant}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask Assistant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealContactCard;
