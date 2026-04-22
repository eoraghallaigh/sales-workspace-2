import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Tag from "@/components/Tag";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RecommendedContact } from "@/components/CompanyCard";

interface AddContactsModalProps {
  open: boolean;
  companyName: string;
  availableContacts: RecommendedContact[];
  onOpenChange: (open: boolean) => void;
  onAdd: (contacts: RecommendedContact[]) => void;
}

const AddContactsModal = ({
  open,
  companyName,
  availableContacts,
  onOpenChange,
  onAdd,
}: AddContactsModalProps) => {
  const [query, setQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedIds(new Set());
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableContacts;
    return availableContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q),
    );
  }, [availableContacts, query]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));
  const someVisibleSelected =
    filtered.some((c) => selectedIds.has(c.id)) && !allVisibleSelected;

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filtered.forEach((c) => {
        if (checked) {
          next.add(c.id);
        } else {
          next.delete(c.id);
        }
      });
      return next;
    });
  };

  const handleAdd = () => {
    const selected = availableContacts.filter((c) => selectedIds.has(c.id));
    onAdd(selected);
    onOpenChange(false);
  };

  const selectedCount = selectedIds.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add contacts at {companyName}</DialogTitle>
          <DialogDescription>
            Pull in other contacts that aren't in your recommended list.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search by name or role"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="max-h-[420px] overflow-y-auto border border-border rounded">
            {filtered.length === 0 ? (
              <div className="body-100 text-muted-foreground p-6 text-center">
                No contacts match that search.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          allVisibleSelected
                            ? true
                            : someVisibleSelected
                              ? "indeterminate"
                              : false
                        }
                        onCheckedChange={(value) => toggleAllVisible(value === true)}
                        aria-label="Select all visible contacts"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Recent engagement</TableHead>
                    <TableHead>Signals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((contact) => {
                    const isChecked = selectedIds.has(contact.id);
                    return (
                      <TableRow
                        key={contact.id}
                        className="cursor-pointer"
                        onClick={() => toggleOne(contact.id, !isChecked)}
                      >
                        <TableCell
                          className="w-10"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(value) =>
                              toggleOne(contact.id, value === true)
                            }
                            aria-label={`Select ${contact.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={contact.avatarColor}>
                                {contact.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="body-100 text-foreground">
                              {contact.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="body-100 text-muted-foreground">
                          {contact.role}
                        </TableCell>
                        <TableCell className="body-100 text-muted-foreground">
                          {contact.recentTouches > 0
                            ? `${contact.recentTouches} touch${contact.recentTouches !== 1 ? "es" : ""}`
                            : "None"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {contact.signals.length === 0 ? (
                              <span className="detail-200 text-muted-foreground">
                                —
                              </span>
                            ) : (
                              contact.signals.map((signal, idx) => (
                                <Tag key={idx} variant={signal.variant}>
                                  {signal.text}
                                </Tag>
                              ))
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <span className="body-100 text-muted-foreground self-center">
            {selectedCount === 0
              ? "No contacts selected"
              : `${selectedCount} contact${selectedCount !== 1 ? "s" : ""} selected`}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAdd}
              disabled={selectedCount === 0}
            >
              Add {selectedCount > 0 ? selectedCount : ""}{" "}
              {selectedCount === 1 ? "contact" : "contacts"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactsModal;
