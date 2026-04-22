import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ContactCard from "@/components/ContactCard";
import type { RecommendedContact } from "@/components/CompanyCard";

interface SortableContactCardProps {
  contact: RecommendedContact;
  companyLogo?: string;
  onContactClick?: (contactId: string) => void;
  onCallClick?: (contactId: string) => void;
  onEmailClick?: (contactId: string) => void;
  onWorkQLClick?: (contactId: string) => void;
  onEnrollClick?: (contactId: string) => void;
  onConfirmDismiss?: (contactId: string, reasons?: string[]) => void;
}

const SortableContactCard = ({
  contact,
  companyLogo,
  onContactClick,
  onCallClick,
  onEmailClick,
  onWorkQLClick,
  onEnrollClick,
  onConfirmDismiss,
}: SortableContactCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(
      transform
        ? { ...transform, scaleX: isDragging ? 1.02 : 1, scaleY: isDragging ? 1.02 : 1 }
        : transform,
    ),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.95 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 flex touch-none"
    >
      <ContactCard
        contact={contact}
        companyLogo={companyLogo}
        isDragging={isDragging}
        dragHandleProps={{ attributes, listeners }}
        onContactClick={onContactClick}
        onCallClick={onCallClick}
        onEmailClick={onEmailClick}
        onWorkQLClick={onWorkQLClick}
        onEnrollClick={onEnrollClick}
        onConfirmDismiss={onConfirmDismiss}
      />
    </div>
  );
};

export default SortableContactCard;
