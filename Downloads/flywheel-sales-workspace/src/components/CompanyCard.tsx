import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TouchDots, type TouchStatus } from "@/components/TouchDot";
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
import AddContactsModal from "@/components/AddContactsModal";
import PvsTooltip from "@/components/PvsTooltip";
import CompanyPlayTags from "@/components/CompanyPlayTags";
import { getPlayStatusBadge } from "@/utils/companyStatusUtils";
import SequenceEnrollmentModal from "@/components/SequenceEnrollmentModal";
import ContactFeedbackModal, {
  type ContactFeedbackPayload,
} from "@/components/ContactFeedbackModal";
import { useCompanyContacts } from "@/hooks/useCompanyContacts";
import { getAdditionalContactsForCompany } from "@/data/allContacts";
import { SignalChipRow } from "@/components/SignalChip";
import type { SignalInstance } from "@/data/signals";

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
  signals: SignalInstance[];
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
  signals: SignalInstance[];
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
  priority?: "P1" | "P2" | "P3" | "P4";
  hasGeneratedStrategy?: boolean;
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
  currentPlayId?: string;
}
const CompanyCard = ({
  company,
  onCompanyClick,
  onNameClick,
  onContactClick,
  onCallClick,
  onEmailClick,
  currentPlayId,
}: CompanyCardProps) => {
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [enrollContactIds, setEnrollContactIds] = useState<string[] | null>(
    null,
  );
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(),
  );
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);

  const {
    contacts,
    reorder,
    remove,
    add,
    recordFeedback,
  } = useCompanyContacts(company.recommendedContacts);

  const selectionMode = selectedContactIds.size > 0;

  const toggleContactSelection = (contactId: string, checked: boolean) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(contactId);
      else next.delete(contactId);
      return next;
    });
  };

  const enrollModalContacts = useMemo(() => {
    if (!enrollContactIds) return [];
    const idSet = new Set(enrollContactIds);
    return contacts
      .filter((c) => idSet.has(c.id))
      .map((c) => ({
        id: c.id,
        name: c.name,
        role: c.role,
        initials: c.initials,
        avatarColor: c.avatarColor,
      }));
  }, [contacts, enrollContactIds]);

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

  const handleAddContacts = (newContacts: RecommendedContact[]) => {
    if (newContacts.length === 0) return;
    add(newContacts);
    toast.success(
      `Added ${newContacts.length} contact${newContacts.length !== 1 ? "s" : ""}`,
    );
  };

  const handleConfirmDismiss = (contactId: string, reasons?: string[]) => {
    const target = contacts.find((c) => c.id === contactId);
    if (target && reasons && reasons.length > 0) {
      reasons.forEach((reason) => {
        recordFeedback({
          contactId: target.id,
          contactName: target.name,
          reason,
          removed: true,
          submittedAt: new Date().toISOString(),
        });
      });
    }
    const removed = remove(contactId);
    if (!removed) return;
    setSelectedContactIds((prev) => {
      if (!prev.has(contactId)) return prev;
      const next = new Set(prev);
      next.delete(contactId);
      return next;
    });
    toast.success(`Removed ${removed.contact.name}`);
  };

  const handleHideSelected = () => {
    if (selectedContactIds.size === 0) return;
    setIsHideModalOpen(true);
  };

  const handleConfirmHide = (payload: ContactFeedbackPayload) => {
    const ids = Array.from(selectedContactIds);
    const existing = ids.filter((id) => contacts.some((c) => c.id === id));
    if (existing.length > 0) {
      existing.forEach((id) => {
        const target = contacts.find((c) => c.id === id);
        if (target) {
          recordFeedback({
            contactId: target.id,
            contactName: target.name,
            reason: payload.reason,
            note: payload.note,
            removed: true,
            submittedAt: new Date().toISOString(),
          });
        }
        remove(id);
      });
      toast.success(
        `Removed ${existing.length} contact${existing.length !== 1 ? "s" : ""}`,
      );
    }
    setSelectedContactIds(new Set());
    setIsHideModalOpen(false);
  };

  const handleEnrollInSequence = (
    sequenceId: string,
    sequenceName: string,
    contactIds: string[],
  ) => {
    const count = contactIds.length;
    if (count === 0) return;
    const label =
      count === 1
        ? contacts.find((c) => c.id === contactIds[0])?.name ??
          `${count} contact`
        : `${count} contacts`;
    toast.success(`Enrolled ${label} in ${sequenceName}`);
    setEnrollContactIds(null);
    setSelectedContactIds(new Set());
    void sequenceId;
  };

  const handleCreateCallTask = () => {
    const count = selectedContactIds.size;
    if (count === 0) return;
    const label =
      count === 1
        ? contacts.find((c) => selectedContactIds.has(c.id))?.name ??
          `${count} contact`
        : `${count} contacts`;
    toast.success(
      `Created call task${count !== 1 ? "s" : ""} for ${label}`,
    );
    setSelectedContactIds(new Set());
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

  const statusBadge = currentPlayId
    ? getPlayStatusBadge(company.status)
    : getStatusBadgeVariant();

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
                <PvsTooltip pvsScore={company.pvsScore}>
                  <span className="cursor-default">
                    PVS {company.pvsScore ?? "—"}
                  </span>
                </PvsTooltip>
                {!currentPlayId && (
                  <>
                    <span>•</span>
                    <span>{company.conversionTrigger ?? "—"}</span>
                    <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </>
                )}
              </p>
              <CompanyPlayTags companyId={company.id} excludePlayId={currentPlayId} className="mt-1" />
              <SignalChipRow
                signals={company.signals}
                owner={{ kind: "company", id: company.id, name: company.name }}
                className="mt-3"
              />
            </div>
          </div>
        </div>

        {/* Status Badge and Touch Indicators */}
        <div className="flex flex-col items-end gap-2">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>

          {!currentPlayId && (
            <div className="flex flex-col items-end gap-1">
              <span className="detail-200 text-muted-foreground">
                {remainingTouches} more {remainingTouches === 1 ? "touch" : "touches"} required
                before {company.touches.deadline}
              </span>
              <TouchDots statuses={displayedTouchStatuses as TouchStatus[]} />
            </div>
          )}
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
            <div className="flex items-stretch gap-4 overflow-x-auto py-12 -my-12 px-1 -mx-1">
              {contacts.map((contact) => (
                <SortableContactCard
                  key={contact.id}
                  contact={contact}
                  companyLogo={company.logo}
                  selectionMode={selectionMode}
                  isSelected={selectedContactIds.has(contact.id)}
                  onToggleSelect={toggleContactSelection}
                  onContactClick={onContactClick}
                  onCallClick={(contactId) => onCallClick?.(contactId, "")}
                  onEmailClick={(contactId) => onEmailClick?.(contactId, "")}
                  onEnrollClick={(contactId) => setEnrollContactIds([contactId])}
                  onConfirmDismiss={handleConfirmDismiss}
                />
              ))}
              <AddContactTile onClick={() => setIsAddModalOpen(true)} />
            </div>
          </SortableContext>
        </DndContext>

        {selectionMode && (
          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="primary"
              size="small"
              onClick={() => setEnrollContactIds(Array.from(selectedContactIds))}
            >
              Enrol ({selectedContactIds.size})
              <TrellisIcon
                name="sequences"
                size={14}
                className="ml-1 brightness-0 invert"
              />
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={handleCreateCallTask}
            >
              Create Call Task ({selectedContactIds.size})
              <TrellisIcon name="tasks" size={14} className="ml-1" />
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={handleHideSelected}
            >
              Hide ({selectedContactIds.size})
              <TrellisIcon name="hide" size={14} className="ml-1" />
            </Button>
            <Button
              variant="link"
              className="body-100 text-foreground h-auto p-0"
              onClick={() => setSelectedContactIds(new Set())}
            >
              Clear
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <Button variant="link" className="body-100 text-foreground h-auto p-0">
            View all contacts
          </Button>

          <div className="flex items-center gap-2">
            {!currentPlayId && (
              <>
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
              </>
            )}
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

      <AddContactsModal
        open={isAddModalOpen}
        companyName={company.name}
        availableContacts={availableToAdd}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddContacts}
      />

      <SequenceEnrollmentModal
        open={enrollContactIds !== null}
        contacts={enrollModalContacts}
        companyLogo={company.logo}
        onOpenChange={(open) => {
          if (!open) setEnrollContactIds(null);
        }}
        onEnroll={handleEnrollInSequence}
      />

      <ContactFeedbackModal
        open={isHideModalOpen}
        contactCount={selectedContactIds.size}
        onOpenChange={setIsHideModalOpen}
        onSubmit={handleConfirmHide}
      />
    </Card>
  );
};
export default CompanyCard;
