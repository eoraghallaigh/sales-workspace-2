import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { Task } from "@/components/TaskCard";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import SortableContactCard from "@/components/SortableContactCard";
import AddContactTile from "@/components/AddContactTile";
import ContactFeedbackModal, {
  ContactFeedbackPayload,
} from "@/components/ContactFeedbackModal";
import AddContactsModal from "@/components/AddContactsModal";
import { useCompanyContacts } from "@/hooks/useCompanyContacts";
import { getAdditionalContactsForCompany } from "@/data/allContacts";

export interface QLData {
  requestType: string;
  requestDate: string;
  deadline: string;
}

export interface RecommendedContact {
  id: string;
  name: string;
  initials: string;
  role: string;
  avatarColor: string;
  recentTouches: number;
  enrolledInSequence: boolean;
  sequenceEnrollmentStatus?: "enrolled" | "not-currently-enrolled" | "never-enrolled";
  outreachStrategyCreated?: boolean;
  recentConversions?: number;
  signals: Array<{
    variant: "green" | "blue" | "yellow" | "orange";
    text: string;
  }>;
  qlData?: QLData;
}
export interface Company {
  id: string;
  name: string;
  logo?: string;
  website: string;
  industry?: string;
  pvsScore?: "High" | "Medium" | "Low";
  conversionTrigger?: string;
  status: "New" | "Unworked QL" | "Unworked P1" | "In Progress" | "Over SLA" | "Worked" | "Snoozed" | "Dismissed";
  signals: Array<{
    variant: "green" | "blue" | "yellow" | "orange";
    text: string;
  }>;
  tasks: Task[];
  touches: {
    contactsReached: {
      current: number;
      total: number;
    };
    totalTouches: number;
    progress: number;
    touchStatuses: Array<"completed" | "scheduled" | "empty">;
    deadline: string;
  };
  recommendedContacts: RecommendedContact[];
}
interface CompanyCardProps {
  company: Company;
  onCompanyClick?: () => void;
  onNameClick?: () => void;
  onContactClick?: (contactId: string) => void;
  onTaskClick?: (taskId: string) => void;
  onCallClick?: (contactId: string, taskId: string) => void;
  onEmailClick?: (contactId: string, taskId: string) => void;
  onPrepForCallClick?: (contactId: string) => void;
  completedTasks?: Set<string>;
}
const CompanyCard = ({
  company,
  onCompanyClick,
  onNameClick,
  onContactClick,
  onCallClick,
  onEmailClick,
}: CompanyCardProps) => {
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [feedbackContactId, setFeedbackContactId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    contacts,
    reorder,
    remove,
    add,
    restore,
    recordFeedback,
  } = useCompanyContacts(company.recommendedContacts);

  const feedbackContact = useMemo(
    () => contacts.find((c) => c.id === feedbackContactId) ?? null,
    [contacts, feedbackContactId],
  );

  const availableToAdd = useMemo(() => {
    const recommendedIds = new Set(contacts.map((c) => c.id));
    return getAdditionalContactsForCompany(company.id).filter(
      (c) => !recommendedIds.has(c.id),
    );
  }, [company.id, contacts]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    reorder(String(active.id), String(over.id));
  };

  const handleFeedbackSubmit = (payload: ContactFeedbackPayload) => {
    if (!feedbackContact) return;
    recordFeedback({
      contactId: feedbackContact.id,
      contactName: feedbackContact.name,
      reason: payload.reason,
      note: payload.note,
      removed: payload.removed,
      submittedAt: new Date().toISOString(),
    });

    if (!payload.removed) {
      toast.success(`Thanks — feedback logged for ${feedbackContact.name}`);
      return;
    }

    const removed = remove(feedbackContact.id);
    if (!removed) return;
    toast.success(`Removed ${removed.contact.name}`, {
      action: {
        label: "Undo",
        onClick: () => restore(removed.contact, removed.index),
      },
      duration: 8000,
    });
  };

  const handleAddContacts = (newContacts: RecommendedContact[]) => {
    if (newContacts.length === 0) return;
    add(newContacts);
    toast.success(
      `Added ${newContacts.length} contact${newContacts.length !== 1 ? "s" : ""}`,
    );
  };

  const getStatusBadgeVariant = (): {
    label: string;
    variant: "status-orange" | "status-blue" | "status-yellow" | "status-green" | "status-gray";
  } => {
    switch (company.status) {
      case "New":
        return { label: "New", variant: "status-blue" };
      case "Unworked QL":
        return { label: "QL", variant: "status-orange" };
      case "Unworked P1":
        return { label: "Unworked", variant: "status-blue" };
      case "In Progress":
        return { label: "In Progress", variant: "status-yellow" };
      case "Over SLA":
        return { label: "Over SLA", variant: "status-orange" };
      case "Worked":
        return { label: "Worked", variant: "status-green" };
      case "Snoozed":
        return { label: "Snoozed", variant: "status-gray" };
      case "Dismissed":
      default:
        return { label: "Dismissed", variant: "status-gray" };
    }
  };

  const statusBadge = getStatusBadgeVariant();

  const touchStatuses = [...(company.touches.touchStatuses || [])];
  while (touchStatuses.length < 5) {
    touchStatuses.push("empty");
  }
  const displayedTouchStatuses = touchStatuses.slice(0, 5);
  const remainingTouches = displayedTouchStatuses.filter((status) => status !== "completed").length;

  return (
    <Card className="p-8 mb-4 border border-border rounded shadow-100 flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img
              src={company.logo || companyLogoPlaceholder}
              alt={`${company.name} logo`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h3
                className="heading-300 text-text-interactive cursor-pointer hover:text-text-interactive-hover transition-colors mb-1"
                onClick={onNameClick || onCompanyClick}
              >
                {company.name}
              </h3>
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="heading-50 text-text-interactive hover:text-text-interactive-hover transition-colors flex items-center gap-1 mb-1"
              >
                {company.website}
                <TrellisIcon name="externalLink" size={12} />
              </a>
              <p className="body-100 text-muted-foreground flex items-center gap-1">
                <span>{company.industry ?? "—"}</span>
                <span>•</span>
                <span>PVS {company.pvsScore ?? "—"}</span>
                <span>•</span>
                <span>{company.conversionTrigger ?? "—"}</span>
                <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge and Touch Indicators */}
        <div className="flex flex-col items-end gap-2">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>

          <div className="flex flex-col items-end gap-1">
            <span className="detail-200 text-muted-foreground">
              {remainingTouches} more {remainingTouches === 1 ? "touch" : "touches"} required
              before {company.touches.deadline}
            </span>
            <div className="flex items-center gap-1.5">
              {displayedTouchStatuses.map((status, index) => (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-full ${
                    status === "completed" ? "" : status === "scheduled" ? "bg-trellis-orange-500" : ""
                  }`}
                  style={{
                    background:
                      status === "completed"
                        ? "var(--color-fill-transitional-progress-success-gradient-color-1, #00823A)"
                        : status === "empty"
                          ? "var(--color-fill-surface-recessed, #F0F0F0)"
                          : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Contacts */}
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={contacts.map((c) => c.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-stretch gap-4 overflow-x-auto py-6 -my-6 px-1 -mx-1">
              {contacts.map((contact) => (
                <SortableContactCard
                  key={contact.id}
                  contact={contact}
                  companyLogo={company.logo}
                  onContactClick={onContactClick}
                  onCallClick={(contactId) => onCallClick?.(contactId, "")}
                  onEmailClick={(contactId) => onEmailClick?.(contactId, "")}
                  onThumbsDownClick={(contactId) => setFeedbackContactId(contactId)}
                />
              ))}
              <AddContactTile onClick={() => setIsAddModalOpen(true)} />
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex items-center justify-between mt-4">
          <Button variant="link" className="body-100 text-muted-foreground h-auto p-0">
            View all contacts
          </Button>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex min-h-[40px] px-3 justify-center items-center gap-2 rounded border border-transparent bg-transparent heading-50 text-foreground hover:bg-accent/10 transition-colors">
                  Snooze <TrellisIcon name="downCarat" size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>1 day</DropdownMenuItem>
                <DropdownMenuItem>3 days</DropdownMenuItem>
                <DropdownMenuItem>1 week</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="flex min-h-[40px] px-3 justify-center items-center gap-2 rounded border border-transparent bg-transparent heading-50 text-foreground hover:bg-accent/10 transition-colors"
              onClick={() => setIsDismissModalOpen(true)}
            >
              Dismiss
            </button>
            <Button
              variant="primary"
              size="medium"
              onClick={() => onCompanyClick?.()}
              data-tour="view-strategy-link"
            >
              Work
            </Button>
          </div>
        </div>
      </div>

      {/* Dismiss Confirmation Modal */}
      <Dialog open={isDismissModalOpen} onOpenChange={setIsDismissModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dismiss {company.name}?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="body-100 text-foreground">
              This will remove {company.name} from your P1 list until someone at {company.name} shows high intent again.
            </p>
            <p className="body-100 text-foreground">
              You can view your dismissed companies using the "Worked Status" selector.
            </p>
          </div>
          <DialogFooter className="sm:justify-start gap-2">
            <Button variant="destructive" onClick={() => setIsDismissModalOpen(false)}>
              Dismiss {company.name}
            </Button>
            <Button variant="outline" onClick={() => setIsDismissModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ContactFeedbackModal
        open={feedbackContactId !== null}
        contactName={feedbackContact?.name ?? ""}
        onOpenChange={(open) => {
          if (!open) setFeedbackContactId(null);
        }}
        onSubmit={handleFeedbackSubmit}
      />

      <AddContactsModal
        open={isAddModalOpen}
        companyName={company.name}
        availableContacts={availableToAdd}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddContacts}
      />
    </Card>
  );
};
export default CompanyCard;
