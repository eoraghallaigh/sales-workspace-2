import { Fragment, ReactNode, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { RecommendedContact } from "@/components/CompanyCard";
import AddContactsModal from "@/components/AddContactsModal";
import { SignalChipRow } from "@/components/SignalChip";
import { PreviewButton } from "@/components/PreviewButton";

/*
 * CompanyTable — the single, shared company/contact table used by every "book"
 * view (P1 list, Full Prospect Book, Full Customer Book). Each view passes its
 * own data columns; the shell, sticky checkbox + name columns, expandable
 * nested contact rows, the "Add Contacts" row + modal, and selection all live
 * here so behaviour changes are made once and apply everywhere.
 */

export interface CompanyTableRow {
  id: string;
  name: string;
  logo?: string;
  recommendedContacts: RecommendedContact[];
}

export interface CompanyTableColumn<T> {
  key: string;
  header: ReactNode;
  minWidth: number;
  cellClassName?: string;
  render: (row: T) => ReactNode;
}

export interface SelectedContact<T> {
  contact: RecommendedContact;
  row: T;
}

interface CompanyTableProps<T extends CompanyTableRow> {
  rows: T[];
  columns: CompanyTableColumn<T>[];
  /** Header label for the sticky name column. */
  primaryHeader?: string;
  primaryMinWidth?: number;
  minTableWidth?: number;
  /** Click handler for the name link. Omit for a plain (non-link) name. */
  onNameClick?: (row: T) => void;
  /** Provide to show a hover "Preview" icon per row that opens the side panel. */
  onPreview?: (row: T) => void;
  /** Extra content rendered under the name (e.g. play tags). */
  renderNameExtra?: (row: T) => ReactNode;
  /** Provide to enable the "Add Contacts" row + modal. */
  getAvailableContacts?: (rowId: string) => RecommendedContact[];
  /** Rendered above the table (e.g. a search toolbar). */
  toolbar?: ReactNode;
  /** Rendered above the table when contacts are selected (bulk actions). */
  renderBulkBar?: (
    selected: SelectedContact<T>[],
    clearSelection: () => void,
  ) => ReactNode;
}

const HEADER_CELL =
  "px-4 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]";
const BODY_CELL = "border-b border-border px-4 py-3 align-middle";

const contactKey = (rowId: string, contactId: string) => `${rowId}::${contactId}`;

// Contact mock data carries inconsistent avatar colours (light tints, or
// undefined palette families) that leave white-on-white initials. Assign a
// guaranteed-dark, legible colour deterministically so every avatar is visible.
const AVATAR_COLORS = [
  "bg-trellis-blue-900",
  "bg-trellis-green-900",
  "bg-trellis-purple-900",
  "bg-trellis-teal-900",
  "bg-trellis-orange-900",
  "bg-trellis-magenta-900",
];
const avatarColorFor = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export function CompanyTable<T extends CompanyTableRow>({
  rows,
  columns,
  primaryHeader = "Company",
  primaryMinWidth = 240,
  minTableWidth = 1100,
  onNameClick,
  onPreview,
  renderNameExtra,
  getAvailableContacts,
  toolbar,
  renderBulkBar,
}: CompanyTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [addedContacts, setAddedContacts] = useState<Record<string, RecommendedContact[]>>({});
  const [addModalRowId, setAddModalRowId] = useState<string | null>(null);

  const contactsFor = (row: T): RecommendedContact[] => [
    ...row.recommendedContacts,
    ...(addedContacts[row.id] ?? []),
  ];

  const toggleRow = (id: string) =>
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allRowsSelected = rows.length > 0 && rows.every((r) => selectedRows.has(r.id));
  const toggleSelectAll = () =>
    setSelectedRows((prev) =>
      rows.every((r) => prev.has(r.id)) ? new Set() : new Set(rows.map((r) => r.id)),
    );

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleContact = (rowId: string, contactId: string) =>
    setSelectedContacts((prev) => {
      const key = contactKey(rowId, contactId);
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const clearContactSelection = () => setSelectedContacts(new Set());

  const selectedContactList = useMemo(() => {
    const out: SelectedContact<T>[] = [];
    rows.forEach((row) =>
      contactsFor(row).forEach((contact) => {
        if (selectedContacts.has(contactKey(row.id, contact.id))) {
          out.push({ contact, row });
        }
      }),
    );
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, selectedContacts, addedContacts]);

  const addModalRow = addModalRowId ? rows.find((r) => r.id === addModalRowId) : null;

  const colSpanAfterName = columns.length;

  return (
    <div className="border border-border bg-card rounded-[4px] overflow-hidden">
      {toolbar}
      {renderBulkBar && selectedContactList.length > 0 &&
        renderBulkBar(selectedContactList, clearContactSelection)}
      <div className="overflow-x-auto">
        <Table style={{ minWidth: minTableWidth }}>
          <TableHeader>
            <TableRow className="bg-[var(--color-fill-surface-recessed)] hover:bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
              <TableHead className="w-12 px-4 sticky left-0 z-20 bg-[var(--color-fill-surface-recessed)] table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                <Checkbox checked={allRowsSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead
                className={`sticky left-12 z-20 bg-[var(--color-fill-surface-recessed)] ${HEADER_CELL}`}
                style={{ minWidth: primaryMinWidth }}
              >
                {primaryHeader}
              </TableHead>
              {columns.map((col, idx) => (
                <TableHead
                  key={col.key}
                  className={idx === columns.length - 1 ? HEADER_CELL.replace(" border-r border-[var(--color-border-transitional-core-subtle)]", "") : HEADER_CELL}
                  style={{ minWidth: col.minWidth }}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:last-child>td]:border-b-0">
            {rows.map((row) => {
              const isExpanded = expanded.has(row.id);
              const contacts = contactsFor(row);
              const hasContacts = contacts.length > 0;
              return (
                <Fragment key={row.id}>
                  <TableRow className="group bg-card hover:bg-fill-surface-recessed">
                    <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border px-4 py-3 align-middle">
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                      />
                    </td>
                    <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(row.id)}
                          disabled={!hasContacts && !getAvailableContacts}
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
                          src={row.logo || companyLogoPlaceholder}
                          alt={`${row.name} logo`}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          {onNameClick ? (
                            <Button
                              variant="link"
                              className="body-125 text-text-interactive hover:text-text-interactive-hover p-0 h-auto justify-start hover:no-underline"
                              onClick={() => onNameClick(row)}
                            >
                              {row.name}
                            </Button>
                          ) : (
                            <span className="body-125 text-foreground">{row.name}</span>
                          )}
                          {renderNameExtra?.(row)}
                        </div>
                        {onPreview && <PreviewButton onClick={() => onPreview(row)} />}
                      </div>
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className={col.cellClassName ?? BODY_CELL}>
                        {col.render(row)}
                      </td>
                    ))}
                  </TableRow>

                  {isExpanded && (
                    <>
                      {contacts.map((contact) => {
                        const recentConversions = contact.recentConversions ?? 0;
                        return (
                          <TableRow
                            key={`${row.id}-${contact.id}`}
                            className="bg-[var(--color-fill-surface-default)] hover:bg-fill-surface-recessed/80"
                          >
                            <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border pl-7 pr-1 py-3 align-middle">
                              <Checkbox
                                checked={selectedContacts.has(contactKey(row.id, contact.id))}
                                onCheckedChange={() => toggleContact(row.id, contact.id)}
                              />
                            </td>
                            <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                              <div className="flex items-center gap-3 pl-10">
                                <Avatar className={`h-7 w-7 ${avatarColorFor(contact.id || contact.name)}`}>
                                  <AvatarFallback className={`${avatarColorFor(contact.id || contact.name)} text-trellis-white detail-100`}>
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
                            <td className={BODY_CELL} colSpan={colSpanAfterName}>
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
                                  <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${recentConversions > 0 ? "bg-trellis-green-600" : "bg-muted-foreground"}`} />
                                  {recentConversions > 0
                                    ? `${recentConversions} recent conversion${recentConversions !== 1 ? "s" : ""}`
                                    : "No recent conversions"}
                                </div>
                                <div className="flex items-center gap-2 detail-200 text-muted-foreground w-[150px] flex-shrink-0 whitespace-nowrap">
                                  <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${contact.recentTouches > 0 ? "bg-trellis-green-600" : "bg-muted-foreground"}`} />
                                  {contact.recentTouches > 0
                                    ? `${contact.recentTouches} recent touch${contact.recentTouches !== 1 ? "es" : ""}`
                                    : "No recent touches"}
                                </div>
                                <div className="flex items-center gap-2 detail-200 text-muted-foreground w-[190px] flex-shrink-0 whitespace-nowrap">
                                  <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${contact.enrolledInSequence ? "bg-trellis-purple-600" : "bg-muted-foreground"}`} />
                                  {contact.enrolledInSequence
                                    ? "Enrolled in a sequence"
                                    : "Not enrolled in a sequence"}
                                </div>
                              </div>
                            </td>
                          </TableRow>
                        );
                      })}

                      {getAvailableContacts && contacts.length > 0 && (
                        <TableRow className="bg-[var(--color-fill-surface-default)] hover:bg-fill-surface-recessed/80">
                          <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border" />
                          <td
                            colSpan={colSpanAfterName + 1}
                            className="sticky left-12 z-10 bg-inherit border-b border-border px-4 py-3"
                          >
                            <button
                              type="button"
                              onClick={() => setAddModalRowId(row.id)}
                              className="flex items-center gap-2 pl-10 body-125 text-text-interactive hover:text-text-interactive-hover"
                            >
                              <Plus className="h-4 w-4" />
                              Add Contacts
                            </button>
                          </td>
                        </TableRow>
                      )}

                      {getAvailableContacts && contacts.length === 0 && (
                        <TableRow className="bg-[var(--color-fill-surface-default)] hover:bg-fill-surface-recessed/80">
                          <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border" />
                          <td
                            colSpan={colSpanAfterName + 1}
                            className="sticky left-12 z-10 bg-inherit border-b border-border px-4 py-3"
                          >
                            <div className="flex items-center gap-1.5 pl-10">
                              <span className="body-100 text-muted-foreground">No recommended contacts.</span>
                              <button
                                type="button"
                                onClick={() => setAddModalRowId(row.id)}
                                className="link-100 text-text-interactive hover:text-text-interactive-hover hover:underline"
                              >
                                Add contacts
                              </button>
                            </div>
                          </td>
                        </TableRow>
                      )}
                    </>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {getAvailableContacts && addModalRow && (() => {
        const existingIds = new Set(contactsFor(addModalRow).map((c) => c.id));
        const available = getAvailableContacts(addModalRow.id).filter(
          (c) => !existingIds.has(c.id),
        );
        return (
          <AddContactsModal
            open
            companyName={addModalRow.name}
            availableContacts={available}
            onOpenChange={(open) => { if (!open) setAddModalRowId(null); }}
            onAdd={(newContacts) => {
              if (newContacts.length === 0) return;
              setAddedContacts((prev) => ({
                ...prev,
                [addModalRow.id]: [...(prev[addModalRow.id] ?? []), ...newContacts],
              }));
              toast.success(
                `Added ${newContacts.length} contact${newContacts.length !== 1 ? "s" : ""}`,
              );
              setAddModalRowId(null);
            }}
          />
        );
      })()}
    </div>
  );
}

export default CompanyTable;
