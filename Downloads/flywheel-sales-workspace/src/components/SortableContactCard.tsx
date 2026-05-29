import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ContactCard from "@/components/ContactCard";
import type { RecommendedContact } from "@/components/CompanyCard";

interface SortableContactCardProps {
  contact: RecommendedContact;
  companyLogo?: string;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (contactId: string, checked: boolean) => void;
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
  selectionMode,
  isSelected,
  onToggleSelect,
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
      className={`flex-shrink-0 flex touch-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      {...attributes}
      {...listeners}
    >
      <ContactCard
        contact={contact}
        companyLogo={companyLogo}
        isDragging={isDragging}
        enableSelection
        selectionMode={selectionMode}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
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
