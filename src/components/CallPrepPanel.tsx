import { X, ThumbsUp, ThumbsDown, Phone, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

interface CallPrepPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    id: string;
    name: string;
    initials: string;
    role?: string;
    company?: string;
    email?: string;
    avatarColor?: string;
  } | null;
  onCallClick?: (contactId: string) => void;
}

const AIBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ background: 'var(--trellis-color-magenta-300)', color: 'var(--trellis-color-magenta-900)' }}>
    <Sparkles className="h-3 w-3" />
    AI
  </span>
);

const CallPrepPanel = ({ isOpen, onClose, contact, onCallClick }: CallPrepPanelProps) => {
  if (!isOpen || !contact) return null;

  // Hardcoded talking points based on the design

  const talkingPoints = [
    {
      title: "Centralizing Property & Claim Data",
      points: [
        "Since your team manages complex contents restoration from pack-out to storage, data silos between the field and the office can lead to lost revenue.",
        'HubSpot serves as a "single source of truth" for every claim, ensuring that photos, inventory logs, and adjuster communications are all linked to one record.',
        "This eliminates the need to hunt through spreadsheets or separate folders when an insurance company requests an update."
      ]
    },
    {
      title: "Automating Adjuster & Homeowner Updates",
      points: [
        'I noticed your emphasis on "Professionalism and Care" during the restoration process; however, manual follow-ups during high-volume periods (like storm seasons) can lead to communication gaps.',
        "HubSpot's automation can trigger instant updates to homeowners and adjusters at every stage of the pack-out, keeping stakeholders informed without your team having to send every email manually.",
        'This increases your "referral worthiness" with insurance carriers by providing a more transparent, tech-forward experience.'
      ]
    },
    {
      title: "Scaling Regional Growth Without Complexity",
      points: [
        'As you expand your footprint in the Indianapolis market, managing a growing sales and project management team often leads to "tech debt" and clunky workflows.',
        "Unlike legacy systems or fragmented tools, HubSpot is built on a unified codebase that scales with you, allowing your team to track new business leads and active jobs in one easy-to-use interface.",
        "You get enterprise-level reporting on your job pipeline without needing a dedicated IT person to manage the software."
      ]
    },
    {
      title: "Accelerating Time-to-Invoice",
      points: [
        'In the restoration industry, the gap between "job completion" and "payment" is often dictated by how fast documentation is organized.',
        "By using HubSpot's integrated Sales Hub, your team can move from initial site inspection to final documentation in a streamlined digital pipeline.",
        "Reducing the administrative friction in your sales-to-service handoff means faster billing and improved cash flow for the business."
      ]
    }
  ];

  return (
    <>
      {/* Dark scrim overlay */}
      <div 
        className="fixed inset-0 top-12 bg-black/50 z-30"
        onClick={onClose}
      />
      
      <div className="fixed top-12 right-0 bottom-0 w-[569px] bg-card border-l border-border shadow-lg z-40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="heading-300">Cold Call Preparation</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-accent/10 rounded transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Contact Info */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={companyLogoPlaceholder} alt={contact.name} />
              <AvatarFallback className={contact.avatarColor || "bg-trellis-blue-800"}>
                {contact.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="heading-200">{contact.name}</div>
              <div className="detail-200 text-muted-foreground">{contact.company || "devdemosuperx.de"}</div>
              <div className="detail-200 text-muted-foreground">{contact.email || "oliviac@superchat.de"}</div>
            </div>
          </div>
        </div>


        {/* Talking Points Section */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-200">Talking Points</h3>
            <AIBadge />
          </div>

          <div className="space-y-6">
            {talkingPoints.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h4 className="body-125 font-semibold text-foreground mb-2">{section.title}</h4>
                <ul className="list-disc list-outside ml-4 space-y-1">
                  {section.points.map((point, pointIdx) => (
                    <li key={pointIdx} className="body-100 text-foreground">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="default" 
            className="gap-2"
            onClick={() => onCallClick?.(contact.id)}
          >
            Call {contact.name.split(' ')[0]}
            <Phone className="h-4 w-4" />
          </Button>
          <button className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--trellis-color-magenta-900)' }}>
            <Sparkles className="h-4 w-4" />
            Configure call preparation agent
          </button>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="detail-200">Are these talking points helpful?</span>
          <button className="p-1 hover:bg-accent/10 rounded transition-colors">
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-accent/10 rounded transition-colors">
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default CallPrepPanel;
