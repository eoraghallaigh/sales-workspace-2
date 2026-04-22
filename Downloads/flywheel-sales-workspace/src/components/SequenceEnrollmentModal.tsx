import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

export interface Sequence {
  id: string;
  name: string;
  createdBy: string;
  lastUsed?: string;
  lastModified: string;
}

const SEQUENCES: Sequence[] = [
  { id: "alicia", name: "Alicia's Sequence", createdBy: "Alicia Chui", lastModified: "5 months ago" },
  { id: "andy-test", name: "Andy test", createdBy: "Andy Lee", lastModified: "5 months ago" },
  { id: "ashley-cobane-test", name: "Ashley Cobane Test Sequence", createdBy: "Ashley Cobane", lastModified: "2 years ago" },
  { id: "ashley-cobane-test-clone-1", name: "Ashley Cobane Test Sequence (clone)", createdBy: "Poulami Chakraborty", lastModified: "a year ago" },
  { id: "ashley-cobane-test-clone-2", name: "Ashley Cobane Test Sequence (clone)", createdBy: "Juan Pablo Macias", lastModified: "2 years ago" },
  { id: "blaise", name: "Blaise's Sequence", createdBy: "Blaise Bowman", lastModified: "a year ago" },
  { id: "smb-outbound-q2", name: "SMB Outbound — Q2", createdBy: "Eoin Ó Raghallaigh", lastUsed: "3 days ago", lastModified: "a week ago" },
  { id: "tier-2-warm", name: "Tier 2 Warm Outreach", createdBy: "Jamie Park", lastUsed: "yesterday", lastModified: "2 weeks ago" },
  { id: "re-engagement-cold", name: "Re-engagement — Cold Prospects", createdBy: "Priya Shah", lastModified: "a month ago" },
  { id: "emea-expansion", name: "EMEA Expansion Play", createdBy: "Marcus Kim", lastUsed: "last month", lastModified: "3 months ago" },
  { id: "hubspot-academy-follow-up", name: "HubSpot Academy follow-up", createdBy: "Dana Oyelaran", lastModified: "6 months ago" },
  { id: "winback-lost-q1", name: "Winback — Lost Q1", createdBy: "Leo Hart", lastModified: "2 months ago" },
];

export interface SequenceEnrollmentContact {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
}

interface SequenceEnrollmentModalProps {
  open: boolean;
  contacts: SequenceEnrollmentContact[];
  initialContactId?: string | null;
  companyLogo?: string;
  onOpenChange: (open: boolean) => void;
  onEnroll: (
    sequenceId: string,
    sequenceName: string,
    contactIds: string[],
  ) => void;
}

const SequenceEnrollmentModal = ({
  open,
  contacts,
  initialContactId,
  companyLogo,
  onOpenChange,
  onEnroll,
}: SequenceEnrollmentModalProps) => {
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(),
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSelectedContactIds(
      new Set(initialContactId ? [initialContactId] : []),
    );
  }, [open, initialContactId]);

  const toggleContact = (contactId: string, checked: boolean) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(contactId);
      else next.delete(contactId);
      return next;
    });
  };

  const allSelected =
    contacts.length > 0 && selectedContactIds.size === contacts.length;

  const toggleAll = (checked: boolean) => {
    setSelectedContactIds(
      checked ? new Set(contacts.map((c) => c.id)) : new Set(),
    );
  };

  const filteredSequences = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return SEQUENCES;
    return SEQUENCES.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.createdBy.toLowerCase().includes(term),
    );
  }, [search]);

  const canEnroll = selectedContactIds.size > 0;

  const handleSelectSequence = (sequence: Sequence) => {
    if (!canEnroll) return;
    onEnroll(sequence.id, sequence.name, Array.from(selectedContactIds));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[960px] p-0 gap-0 overflow-hidden bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <DialogTitle>Select sequence</DialogTitle>
        </div>

        <div className="flex h-[600px]">
          <div className="w-1/4 border-r border-border flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Checkbox
                id="select-all-contacts"
                checked={allSelected}
                onCheckedChange={(v) => toggleAll(v === true)}
              />
              <label
                htmlFor="select-all-contacts"
                className="heading-50 text-foreground cursor-pointer"
              >
                Contacts ({selectedContactIds.size}/{contacts.length})
              </label>
            </div>
            <div className="flex-1 overflow-y-auto">
              {contacts.map((contact) => {
                const checked = selectedContactIds.has(contact.id);
                const inputId = `sequence-enroll-contact-${contact.id}`;
                return (
                  <label
                    key={contact.id}
                    htmlFor={inputId}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer"
                  >
                    <Checkbox
                      id={inputId}
                      checked={checked}
                      onCheckedChange={(v) =>
                        toggleContact(contact.id, v === true)
                      }
                    />
                    <Avatar className="h-7 w-7 flex-shrink-0 border border-white">
                      <AvatarImage
                        src={companyLogo || companyLogoPlaceholder}
                        alt={`${contact.name} avatar`}
                      />
                      <AvatarFallback className={contact.avatarColor}>
                        {contact.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="body-100 text-foreground truncate">
                        {contact.name}
                      </div>
                      <div className="detail-200 text-muted-foreground truncate">
                        {contact.role}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="w-3/4 flex flex-col min-h-0">
            <div className="px-6 py-4 flex items-center gap-4 border-b border-border">
              <div className="relative flex-1 max-w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sequences"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-full"
                />
              </div>
              <div className="body-100 text-foreground">
                Owner: <span className="font-semibold">Any</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!canEnroll && (
                <div className="px-6 py-3 body-100 text-muted-foreground bg-accent/10 border-b border-border">
                  Select at least one contact to enrol.
                </div>
              )}
              <table className="w-full">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-6 py-3 detail-200 font-semibold text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 detail-200 font-semibold text-muted-foreground">
                      Created By
                    </th>
                    <th className="text-left px-4 py-3 detail-200 font-semibold text-muted-foreground">
                      Last Used
                    </th>
                    <th className="text-left px-4 py-3 detail-200 font-semibold text-muted-foreground">
                      Last Modified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSequences.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 body-100 text-muted-foreground text-center"
                      >
                        No sequences match "{search}"
                      </td>
                    </tr>
                  ) : (
                    filteredSequences.map((sequence) => (
                      <tr
                        key={sequence.id}
                        className="border-b border-border hover:bg-accent/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleSelectSequence(sequence)}
                            disabled={!canEnroll}
                            className="link-100 text-text-interactive hover:text-text-interactive-hover transition-colors text-left cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {sequence.name}
                          </button>
                        </td>
                        <td className="px-4 py-4 body-100 text-foreground">
                          {sequence.createdBy}
                        </td>
                        <td className="px-4 py-4 body-100 text-foreground">
                          {sequence.lastUsed ?? "—"}
                        </td>
                        <td className="px-4 py-4 body-100 text-foreground">
                          {sequence.lastModified}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SequenceEnrollmentModal;
