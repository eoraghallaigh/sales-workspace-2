import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableToolbar } from "@/components/ui/table-toolbar";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { Company } from "@/components/CompanyCard";
import SequenceEnrollmentModal from "@/components/SequenceEnrollmentModal";
import { SignalChipRow } from "@/components/SignalChip";
import PvsTooltip from "@/components/PvsTooltip";
import CompanyPlayTags from "@/components/CompanyPlayTags";
import ContactOutreachAvatars from "@/components/ContactOutreachAvatars";
import { MiniTouchDots, type TouchStatus } from "@/components/TouchDot";
import { getPlayStatusBadge } from "@/utils/companyStatusUtils";

interface CompaniesTableViewProps {
  companies: Company[];
  onCompanyClick?: (companyId: string) => void;
  onNameClick?: (companyId: string) => void;
  currentPlayId?: string;
}

const getStatusBadge = (
  status: Company["status"],
): {
  label: string;
  variant: "status-orange" | "status-blue" | "status-yellow" | "status-green" | "status-gray";
} => {
  switch (status) {
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
    default:
      return { label: "Dismissed", variant: "status-gray" };
  }
};

const getWhyNow = (company: Company): string =>
  company.conversionTrigger ?? "Ranked by urgency + account potential";

const headerCellClass =
  "h-[35px] pl-5 pr-5 pt-0 pb-0 bg-[var(--color-fill-surface-recessed)] table-header-text !capitalize align-middle border-r border-[var(--color-border-transitional-core-subtle)]";
const bodyCellClass = "border-b border-border px-4 py-3 align-middle";

const CompaniesTableView = ({
  companies,
  onCompanyClick,
  onNameClick,
  currentPlayId,
}: CompaniesTableViewProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // Contact ids are reused across companies, so selection is keyed by a
  // `${companyId}::${contactId}` composite to keep rows distinct.
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const contactKey = (companyId: string, contactId: string) =>
    `${companyId}::${contactId}`;

  const toggleContactSelection = (companyId: string, contactId: string) => {
    setSelectedContacts((prev) => {
      const key = contactKey(companyId, contactId);
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearContactSelection = () => setSelectedContacts(new Set());

  const selectedContactList = useMemo(() => {
    const out: { contact: Company["recommendedContacts"][number]; company: Company }[] = [];
    companies.forEach((company) =>
      company.recommendedContacts.forEach((contact) => {
        if (selectedContacts.has(contactKey(company.id, contact.id))) {
          out.push({ contact, company });
        }
      }),
    );
    return out;
  }, [companies, selectedContacts]);

  const selectionCount = selectedContactList.length;
  const selectionLabel =
    selectionCount === 1
      ? selectedContactList[0]?.contact.name ?? "1 contact"
      : `${selectionCount} contacts`;

  const handleEnroll = (
    _sequenceId: string,
    sequenceName: string,
    contactIds: string[],
  ) => {
    if (contactIds.length === 0) return;
    toast.success(`Enrolled ${selectionLabel} in ${sequenceName}`);
    setIsEnrollOpen(false);
    clearContactSelection();
  };

  const handleCreateCallTask = () => {
    if (selectionCount === 0) return;
    toast.success(
      `Created call task${selectionCount !== 1 ? "s" : ""} for ${selectionLabel}`,
    );
    clearContactSelection();
  };

  const handleHideSelected = () => {
    if (selectionCount === 0) return;
    toast.success(
      `Removed ${selectionCount} contact${selectionCount !== 1 ? "s" : ""}`,
    );
    clearContactSelection();
  };

  const bulkActions =
    selectionCount > 0 ? (
      <div className="flex items-center gap-3">
        <Button variant="primary" size="small" onClick={() => setIsEnrollOpen(true)}>
          Enrol ({selectionCount})
          <TrellisIcon
            name="sequences"
            size={14}
            className="ml-1 brightness-0 invert"
          />
        </Button>
        <Button variant="secondary" size="small" onClick={handleCreateCallTask}>
          Create Call Task ({selectionCount})
          <TrellisIcon name="tasks" size={14} className="ml-1" />
        </Button>
        <Button variant="secondary" size="small" onClick={handleHideSelected}>
          Hide ({selectionCount})
          <TrellisIcon name="hide" size={14} className="ml-1" />
        </Button>
        <Button
          variant="link"
          className="body-100 text-foreground h-auto p-0"
          onClick={clearContactSelection}
        >
          Clear
        </Button>
      </div>
    ) : undefined;

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(query));
  }, [companies, search]);

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected =
    filteredCompanies.length > 0 && filteredCompanies.every((c) => selected.has(c.id));
  const toggleSelectAll = () => {
    setSelected((prev) =>
      filteredCompanies.every((c) => prev.has(c.id))
        ? new Set()
        : new Set(filteredCompanies.map((c) => c.id)),
    );
  };

  return (
    <div className="border border-border bg-card rounded-[4px] overflow-hidden">
      <TableToolbar
        searchPlaceholder="Search companies"
        searchValue={search}
        onSearchChange={setSearch}
        actions={bulkActions}
      />
      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="bg-[var(--color-fill-surface-recessed)] hover:bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
              <TableHead className="w-12 h-[35px] px-4 pt-0 pb-0 sticky left-0 z-20 bg-[var(--color-fill-surface-recessed)] table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead className={`sticky left-12 z-20 bg-[var(--color-fill-surface-recessed)] min-w-[260px] ${headerCellClass}`}>
                Company
              </TableHead>
              <TableHead className={`min-w-[140px] ${headerCellClass}`}>Industry</TableHead>
              <TableHead className={`min-w-[100px] ${headerCellClass}`}>PVS</TableHead>
              <TableHead className={`min-w-[260px] ${headerCellClass}`}>Signals</TableHead>
              <TableHead className={`min-w-[160px] ${headerCellClass}`}>Contacts</TableHead>
              {!currentPlayId && (
                <TableHead className={`min-w-[180px] ${headerCellClass}`}>Touches</TableHead>
              )}
              <TableHead className="min-w-[120px] h-[35px] pl-5 pr-5 pt-0 pb-0 bg-[var(--color-fill-surface-recessed)] table-header-text !capitalize align-middle">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:last-child>td]:border-b-0">
            {filteredCompanies.map((company) => {
              const statusBadge = currentPlayId
                ? getPlayStatusBadge(company.status)
                : getStatusBadge(company.status);

              const touchStatuses = [...(company.touches.touchStatuses || [])];
              while (touchStatuses.length < 5) touchStatuses.push("empty");
              const displayedTouchStatuses = touchStatuses.slice(0, 5);

              const displayedSignals = company.signals.slice(0, 2);

              const isExpanded = expanded.has(company.id);
              const contacts = company.recommendedContacts;
              const hasContacts = contacts.length > 0;
              const contactColSpan = currentPlayId ? 5 : 6;

              return (
                <Fragment key={company.id}>
                <TableRow className="bg-card hover:bg-fill-surface-recessed">
                  <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border px-4 py-3 align-middle">
                    <Checkbox
                      checked={selected.has(company.id)}
                      onCheckedChange={() => toggleSelected(company.id)}
                    />
                  </td>
                  <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(company.id)}
                        disabled={!hasContacts}
                        className="flex items-center justify-center h-5 w-5 flex-shrink-0 rounded hover:bg-trellis-neutral-200 text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label={isExpanded ? "Collapse contacts" : "Expand contacts"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <img
                        src={company.logo || companyLogoPlaceholder}
                        alt={`${company.name} logo`}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <Button
                          variant="link"
                          className="body-125 text-text-interactive hover:text-text-interactive-hover p-0 h-auto justify-start hover:no-underline"
                          onClick={() => (onNameClick ?? onCompanyClick)?.(company.id)}
                        >
                          {company.name}
                        </Button>
                        <CompanyPlayTags companyId={company.id} compact excludePlayId={currentPlayId} />
                      </div>
                    </div>
                  </td>
                  <td className={bodyCellClass}>
                    <span className="body-100 text-foreground">{company.industry ?? "—"}</span>
                  </td>
                  <td className={bodyCellClass}>
                    <PvsTooltip pvsScore={company.pvsScore}>
                      <span className="body-100 text-foreground cursor-default">
                        {company.pvsScore ?? "—"}
                      </span>
                    </PvsTooltip>
                  </td>
                  <td className={bodyCellClass}>
                    {displayedSignals.length > 0 ? (
                      <SignalChipRow
                        signals={displayedSignals}
                        owner={{ kind: "company", id: company.id, name: company.name }}
                      />
                    ) : (
                      <span className="body-100 text-muted-foreground">{getWhyNow(company)}</span>
                    )}
                  </td>
                  <td className={bodyCellClass}>
                    <ContactOutreachAvatars
                      contacts={company.recommendedContacts}
                      align="start"
                    />
                  </td>
                  {!currentPlayId && (
                    <td className={bodyCellClass}>
                      <div className="flex items-center gap-2">
                        <MiniTouchDots statuses={displayedTouchStatuses as TouchStatus[]} />
                        <span className="detail-200 text-muted-foreground whitespace-nowrap">
                          due {company.touches.deadline}
                        </span>
                      </div>
                    </td>
                  )}
                  <td className="border-b border-border px-4 py-3 align-middle">
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  </td>
                </TableRow>
                {isExpanded &&
                  hasContacts &&
                  contacts.map((contact) => {
                    const recentConversions = contact.recentConversions ?? 0;
                    const isContactSelected = selectedContacts.has(
                      contactKey(company.id, contact.id),
                    );
                    return (
                    <TableRow
                      key={`${company.id}-${contact.id}`}
                      className="bg-[var(--color-fill-surface-default)] hover:bg-fill-surface-recessed/80"
                    >
                      <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border px-4 py-3 align-middle">
                        <Checkbox
                          checked={isContactSelected}
                          onCheckedChange={() =>
                            toggleContactSelection(company.id, contact.id)
                          }
                        />
                      </td>
                      <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                        <div className="flex items-center gap-3 pl-8">
                          <Avatar className={`h-7 w-7 ${contact.avatarColor}`}>
                            <AvatarFallback
                              className={`${contact.avatarColor} text-trellis-white detail-100`}
                            >
                              {contact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <Button
                              variant="link"
                              className="body-125 text-text-interactive hover:text-text-interactive-hover p-0 h-auto justify-start hover:no-underline"
                            >
                              {contact.name}
                            </Button>
                            {contact.role && (
                              <span className="detail-100 text-muted-foreground">
                                {contact.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className="border-b border-border px-4 py-3 align-middle"
                        colSpan={contactColSpan}
                      >
                        <div className="flex flex-row items-center gap-6">
                          <div className="w-[260px] flex-shrink-0">
                            {contact.signals.length > 0 && (
                              <SignalChipRow
                                signals={contact.signals}
                                owner={{ kind: "contact", id: contact.id, name: contact.name }}
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 detail-200 text-muted-foreground w-[160px] flex-shrink-0 whitespace-nowrap">
                            <div
                              className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                                recentConversions > 0
                                  ? "bg-trellis-green-600"
                                  : "bg-muted-foreground"
                              }`}
                            />
                            {recentConversions > 0
                              ? `${recentConversions} recent conversion${recentConversions !== 1 ? "s" : ""}`
                              : "No recent conversions"}
                          </div>
                          <div className="flex items-center gap-2 detail-200 text-muted-foreground w-[150px] flex-shrink-0 whitespace-nowrap">
                            <div
                              className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                                contact.recentTouches > 0
                                  ? "bg-trellis-green-600"
                                  : "bg-muted-foreground"
                              }`}
                            />
                            {contact.recentTouches > 0
                              ? `${contact.recentTouches} recent touch${contact.recentTouches !== 1 ? "es" : ""}`
                              : "No recent touches"}
                          </div>
                          <div className="flex items-center gap-2 detail-200 text-muted-foreground w-[190px] flex-shrink-0 whitespace-nowrap">
                            <div
                              className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
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
                      </td>
                    </TableRow>
                    );
                  })}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <SequenceEnrollmentModal
        open={isEnrollOpen}
        contacts={selectedContactList.map(({ contact }) => contact)}
        companyLogo={selectedContactList[0]?.company.logo}
        onOpenChange={setIsEnrollOpen}
        onEnroll={handleEnroll}
      />
    </div>
  );
};

export default CompaniesTableView;
