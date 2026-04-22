import { GripVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Tag from "@/components/Tag";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { cn } from "@/lib/utils";

interface QLData {
  requestType: string;
  requestDate: string;
  deadline: string;
}

export interface DragHandleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners: Record<string, any> | undefined;
}

interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    initials: string;
    role: string;
    avatarColor: string;
    recentTouches: number;
    enrolledInSequence: boolean;
    recentConversions?: number;
    signals: Array<{
      variant: "green" | "blue" | "yellow" | "orange";
      text: string;
    }>;
    qlData?: QLData;
  };
  companyLogo?: string;
  isDragging?: boolean;
  dragHandleProps?: DragHandleProps;
  onContactClick?: (contactId: string) => void;
  onCallClick?: (contactId: string) => void;
  onEmailClick?: (contactId: string) => void;
  onPrepForCallClick?: (contactId: string) => void;
  onWorkQLClick?: (contactId: string) => void;
  onThumbsDownClick?: (contactId: string) => void;
}

const ContactCard = ({
  contact,
  companyLogo,
  isDragging = false,
  dragHandleProps,
  onContactClick,
  onCallClick,
  onEmailClick,
  onWorkQLClick,
  onThumbsDownClick,
}: ContactCardProps) => {
  const recentConversions = contact.recentConversions ?? 0;
  const isQL = !!contact.qlData;

  const cardClassName = cn(
    "group flex h-full flex-col border border-border rounded-lg bg-white min-w-[280px] max-w-[320px] overflow-hidden transition-shadow",
    isDragging ? "shadow-xl ring-1 ring-border" : "shadow-100",
  );

  const avatarSlot = (
    <div className="relative h-10 w-10 flex-shrink-0">
      <Avatar
        className={cn(
          "absolute inset-0 h-10 w-10 border-2 border-white transition-opacity",
          dragHandleProps ? "group-hover:opacity-0" : "",
        )}
      >
        <AvatarImage
          src={companyLogo || companyLogoPlaceholder}
          alt={`${contact.name} avatar`}
        />
        <AvatarFallback className={contact.avatarColor}>
          {contact.initials}
        </AvatarFallback>
      </Avatar>
      {dragHandleProps && (
        <button
          type="button"
          className="absolute inset-0 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 cursor-grab active:cursor-grabbing focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Reorder ${contact.name}`}
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  const thumbsDownButton = onThumbsDownClick ? (
    <button
      type="button"
      className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Give feedback on ${contact.name}`}
      onClick={() => onThumbsDownClick(contact.id)}
    >
      <TrellisIcon name="thumbsDown" size={16} />
    </button>
  ) : null;

  // QL Card variant
  if (isQL) {
    return (
      <div className={cardClassName}>
        {/* QL Header - Yellow/cream background */}
        <div
          className="flex items-center justify-between p-4 rounded-t-lg"
          style={{ background: "var(--trellis-color-yellow-200)" }}
        >
          <div className="flex items-center gap-3">
            {avatarSlot}
            <div>
              <div
                className="link-200 cursor-pointer hover:text-text-interactive transition-colors"
                onClick={() => onContactClick?.(contact.id)}
              >
                {contact.name}
              </div>
              <div className="detail-200 text-muted-foreground">
                {contact.role}
              </div>
            </div>
          </div>
          {/* QL Badge */}
          <div
            className="flex justify-center items-center heading-25 text-white"
            style={{
              padding: "1px var(--space-200, 8px)",
              borderRadius: "999999px",
              background: "var(--color-fill-accent-orange-default, #C93700)",
            }}
          >
            QL
          </div>
        </div>

        {/* QL Card Body */}
        <div className="flex flex-1 flex-col px-4 py-5">
          <div className="flex flex-col gap-1 mb-6">
            <div className="body-125 font-semibold text-foreground">
              {contact.qlData!.requestType}
            </div>
            <div className="detail-200 text-muted-foreground">
              {contact.qlData!.requestDate}
            </div>
            <div className="detail-200 text-trellis-red-900 font-medium">
              Work or reject before {contact.qlData!.deadline}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            <Button
              variant="primary"
              size="medium"
              onClick={() => onWorkQLClick?.(contact.id)}
            >
              Work QL
            </Button>
            {thumbsDownButton}
          </div>
        </div>
      </div>
    );
  }

  // Standard Contact Card
  return (
    <div className={cardClassName}>
      {/* Contact Header */}
      <div
        className="flex items-center justify-between p-4 rounded-t-lg"
        style={{ background: "var(--color-fill-secondary-hover)" }}
      >
        <div className="flex items-center gap-3">
          {avatarSlot}
          <div>
            <div
              className="body-125 text-text-interactive cursor-pointer hover:text-text-interactive transition-colors"
              onClick={() => onContactClick?.(contact.id)}
            >
              {contact.name}
            </div>
            <div className="detail-200 text-muted-foreground">
              {contact.role}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-4 h-4 flex items-center justify-center"
            onClick={() => onEmailClick?.(contact.id)}
          >
            <TrellisIcon name="email" size={16} />
          </button>
          <button
            className="w-4 h-4 flex items-center justify-center"
            onClick={() => onCallClick?.(contact.id)}
          >
            <TrellisIcon name="calling" size={16} />
          </button>
          <button className="w-4 h-4 flex items-center justify-center">
            <TrellisIcon name="linkedin" size={16} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col px-4 pt-5 pb-2">
        {/* Activity Points */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 detail-200 text-muted-foreground">
            <div
              className={`h-2 w-2 rounded-full ${
                recentConversions > 0
                  ? "bg-trellis-green-600"
                  : "bg-muted-foreground"
              }`}
            />
            {recentConversions > 0
              ? `${recentConversions} recent conversion${recentConversions !== 1 ? "s" : ""}`
              : "No recent conversions"}
          </div>
          <div className="flex items-center gap-2 detail-200 text-muted-foreground">
            <div
              className={`h-2 w-2 rounded-full ${
                contact.recentTouches > 0
                  ? "bg-trellis-green-600"
                  : "bg-muted-foreground"
              }`}
            />
            {contact.recentTouches > 0
              ? `${contact.recentTouches} recent touch${contact.recentTouches !== 1 ? "es" : ""}`
              : "No recent touches"}
          </div>
          <div className="flex items-center gap-2 detail-200 text-muted-foreground">
            <div
              className={`h-2 w-2 rounded-full ${
                contact.enrolledInSequence
                  ? "bg-trellis-purple-600"
                  : "bg-muted-foreground"
              }`}
            />
            {contact.enrolledInSequence
              ? "Enrolled in a sequence"
              : "Not enrolled in a sequence"}
          </div>
        </div>

        {/* Signals */}
        <div className="flex flex-col items-stretch gap-2 mb-2">
          {contact.signals.length > 0 ? (
            contact.signals.map((signal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Tag variant={signal.variant}>{signal.text}</Tag>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2">
              <span className="detail-200 text-muted-foreground">
                No signals found
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto flex justify-end">{thumbsDownButton}</div>
      </div>
    </div>
  );
};

export default ContactCard;
