import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { SignalChipRow } from "@/components/SignalChip";
import { Company, RecommendedContact } from "@/components/CompanyCard";
import { contactDetails } from "@/data/contactDetails";
import { AILoader } from "@/components/ui/ai-loader";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

type SequenceStatus = "enrolled" | "generated" | "generating" | "none";
type NotesStatus = "generated" | "generating" | "none";

interface AgentActivity {
  sequence: SequenceStatus;
  notes: NotesStatus;
}

export interface FlatContact {
  contact: RecommendedContact;
  company: Company;
}

interface ContactsTableViewProps {
  companies: Company[];
  activeCallTasks?: Record<string, number>;
  onCreateCallTasks?: (contacts: FlatContact[]) => void;
}

const HEADER_CELL =
  "px-4 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]";
const BODY_CELL = "border-b border-border px-4 py-3 align-middle";

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

const hashInt = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const deriveEmail = (contact: RecommendedContact, companyWebsite: string) => {
  const detail = contactDetails[contact.id];
  if (detail?.email) return detail.email;
  const first = contact.name.split(" ")[0]?.toLowerCase() ?? "user";
  const last = contact.name.split(" ").slice(-1)[0]?.toLowerCase() ?? "contact";
  return `${first}.${last}@${companyWebsite}`;
};

const derivePhone = (contact: RecommendedContact) => {
  const detail = contactDetails[contact.id];
  if (detail?.phone) return detail.phone;
  if ((contact as any).hasPhone === false) return "—";
  const h = hashInt(contact.id);
  return `+1 (${400 + (h % 600)}) ${100 + (h % 900)}-${1000 + (h % 9000)}`;
};

const deriveLastContacted = (contact: RecommendedContact) => {
  if (contact.lastContactedDate) return contact.lastContactedDate;
  return "—";
};

const deriveLastSequenceEnded = (contact: RecommendedContact) => {
  if (!contact.enrolledInSequence && contact.sequenceEnrollmentStatus !== "enrolled") {
    if (contact.sequenceEnrollmentStatus === "not-currently-enrolled") {
      const h = hashInt(contact.id + "seq");
      const daysAgo = 5 + (h % 60);
      const d = new Date(Date.now() - daysAgo * 86400000);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return "—";
  }
  return "Active";
};

const deriveAgentActivity = (
  contact: RecommendedContact,
  hasCallTask: boolean,
): AgentActivity => {
  let sequence: SequenceStatus = "none";
  if (contact.enrolledInSequence) {
    sequence = "enrolled";
  } else if (contact.outreachStrategyCreated) {
    sequence = "generated";
  }

  let notes: NotesStatus = "none";
  if (hasCallTask) {
    notes = "generating";
  }

  return { sequence, notes };
};

const ContactsTableView = ({
  companies,
  activeCallTasks = {},
  onCreateCallTasks,
}: ContactsTableViewProps) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const flatContacts = useMemo(() => {
    const out: FlatContact[] = [];
    for (const company of companies) {
      for (const contact of company.recommendedContacts) {
        out.push({ contact, company });
      }
    }
    return out;
  }, [companies]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return flatContacts;
    return flatContacts.filter(
      (fc) =>
        fc.contact.name.toLowerCase().includes(query) ||
        fc.contact.role.toLowerCase().includes(query) ||
        fc.company.name.toLowerCase().includes(query),
    );
  }, [flatContacts, search]);

  const toggleContact = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allSelected = filtered.length > 0 && filtered.every((fc) => selectedIds.has(fc.contact.id));
  const toggleSelectAll = () =>
    setSelectedIds(
      allSelected ? new Set() : new Set(filtered.map((fc) => fc.contact.id)),
    );

  const clearSelection = () => setSelectedIds(new Set());

  const selectedContacts = useMemo(
    () => filtered.filter((fc) => selectedIds.has(fc.contact.id)),
    [filtered, selectedIds],
  );

  return (
    <div className="border border-border bg-card rounded-[4px] overflow-hidden">
      <TableToolbar
        searchPlaceholder="Search contacts"
        searchValue={search}
        onSearchChange={setSearch}
        className="justify-start gap-7"
        actions={selectedContacts.length > 0 ? (
          <div className="flex items-center gap-6">
            <Button
              variant="primary"
              size="small"
              onClick={() => onCreateCallTasks?.(selectedContacts)}
            >
              Create Call Tasks ({selectedContacts.length})
              <TrellisIcon name="tasks" size={14} className="ml-1 brightness-0 invert" />
            </Button>
            <Button
              variant="link"
              className="body-100 text-foreground h-auto p-0"
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        ) : undefined}
      />

      <div className="overflow-x-auto">
        <Table style={{ minWidth: 1650 }}>
          <TableHeader>
            <TableRow className="bg-[var(--color-fill-surface-recessed)] hover:bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
              <TableHead className="w-12 px-4 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 220 }}>
                Contact Name
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 180 }}>
                Company
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 140 }}>
                Industry
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 200 }}>
                Email
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 150 }}>
                Phone Number
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 120 }}>
                Last Contacted
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 240 }}>
                Signals
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 140 }}>
                Recent Conversions
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 150 }}>
                Last Sequence Ended
              </TableHead>
              <TableHead className={HEADER_CELL} style={{ minWidth: 130 }}>
                Active Call Tasks
              </TableHead>
              <TableHead
                className={HEADER_CELL.replace(
                  " border-r border-[var(--color-border-transitional-core-subtle)]",
                  "",
                )}
                style={{ minWidth: 220 }}
              >
                AI Agent Activity
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:last-child>td]:border-b-0">
            {filtered.map((fc) => {
              const { contact, company } = fc;
              const recentConversions = contact.recentConversions ?? 0;
              return (
                <TableRow
                  key={`${company.id}-${contact.id}`}
                  className="group bg-card hover:bg-fill-surface-recessed"
                >
                  <td className="w-12 border-b border-border px-4 py-3 align-middle">
                    <Checkbox
                      checked={selectedIds.has(contact.id)}
                      onCheckedChange={() => toggleContact(contact.id)}
                    />
                  </td>
                  <td className={BODY_CELL}>
                    <div className="flex items-center gap-3">
                      <Avatar
                        className={`h-7 w-7 ${avatarColorFor(contact.id || contact.name)}`}
                      >
                        <AvatarFallback
                          className={`${avatarColorFor(contact.id || contact.name)} text-trellis-white detail-100`}
                        >
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="body-125 text-foreground">{contact.name}</span>
                        {contact.role && (
                          <span className="detail-100 text-muted-foreground">
                            {contact.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={BODY_CELL}>
                    <div className="flex items-center gap-2">
                      <img
                        src={company.logo || companyLogoPlaceholder}
                        alt={`${company.name} logo`}
                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                      />
                      <span className="body-100 text-foreground">{company.name}</span>
                    </div>
                  </td>
                  <td className={BODY_CELL}>
                    <span className="body-100 text-foreground">{company.industry ?? "—"}</span>
                  </td>
                  <td className={BODY_CELL}>
                    <span className="body-100 text-foreground truncate block max-w-[200px]">
                      {deriveEmail(contact, company.website)}
                    </span>
                  </td>
                  <td className={BODY_CELL}>
                    <span className="body-100 text-foreground whitespace-nowrap">
                      {derivePhone(contact)}
                    </span>
                  </td>
                  <td className={BODY_CELL}>
                    <span className="body-100 text-muted-foreground whitespace-nowrap">
                      {deriveLastContacted(contact)}
                    </span>
                  </td>
                  <td className={BODY_CELL}>
                    {contact.signals.length > 0 ? (
                      <SignalChipRow
                        signals={contact.signals.slice(0, 2)}
                        owner={{
                          kind: "contact",
                          id: contact.id,
                          name: contact.name,
                        }}
                      />
                    ) : (
                      <span className="body-100 text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className={BODY_CELL}>
                    <div className="flex items-center gap-2 detail-200 text-muted-foreground">
                      <div
                        className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                          recentConversions > 0
                            ? "bg-trellis-green-600"
                            : "bg-muted-foreground"
                        }`}
                      />
                      {recentConversions > 0
                        ? `${recentConversions} conversion${recentConversions !== 1 ? "s" : ""}`
                        : "None"}
                    </div>
                  </td>
                  <td className={BODY_CELL}>
                    <span className="body-100 text-muted-foreground whitespace-nowrap">
                      {deriveLastSequenceEnded(contact)}
                    </span>
                  </td>
                  <td className={BODY_CELL}>
                    <span className={`body-100 whitespace-nowrap ${activeCallTasks[contact.id] ? "text-foreground" : "text-muted-foreground"}`}>
                      {activeCallTasks[contact.id] ?? 0}
                    </span>
                  </td>
                  <td className={BODY_CELL}>
                    {(() => {
                      const activity = deriveAgentActivity(contact, !!activeCallTasks[contact.id]);
                      return (
                        <ul className="flex flex-col gap-1 list-none p-0 m-0">
                          <li className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
                            {activity.sequence === "generating" ? (
                              <>
                                <AILoader size={12} />
                                <span className="text-[var(--trellis-color-magenta-900,#d20688)]">Sequence generating</span>
                              </>
                            ) : activity.sequence === "enrolled" ? (
                              <>
                                <div className="h-1.5 w-1.5 rounded-full bg-trellis-green-600 flex-shrink-0" />
                                <span className="text-foreground">Sequence enrolled</span>
                              </>
                            ) : activity.sequence === "generated" ? (
                              <>
                                <div className="h-1.5 w-1.5 rounded-full bg-trellis-blue-600 flex-shrink-0" />
                                <span className="text-foreground">Sequence generated</span>
                              </>
                            ) : (
                              <>
                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">No sequence generated</span>
                              </>
                            )}
                          </li>
                          <li className="flex items-center gap-1.5 detail-200 whitespace-nowrap">
                            {activity.notes === "generating" ? (
                              <>
                                <AILoader size={24} />
                                <span className="text-[var(--trellis-color-magenta-900,#d20688)]">Call notes generating</span>
                              </>
                            ) : activity.notes === "generated" ? (
                              <>
                                <div className="h-1.5 w-1.5 rounded-full bg-trellis-green-600 flex-shrink-0" />
                                <span className="text-foreground">Notes generated</span>
                              </>
                            ) : (
                              <>
                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">No notes generated</span>
                              </>
                            )}
                          </li>
                        </ul>
                      );
                    })()}
                  </td>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContactsTableView;
