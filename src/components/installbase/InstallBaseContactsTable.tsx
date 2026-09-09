import { useLayoutEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Tag from "@/components/Tag";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { SignalChipRow } from "@/components/SignalChip";
import { useResizableColumns } from "@/hooks/useResizableColumns";
import { ColumnResizeHandle } from "@/components/ColumnResizeHandle";
import { cn } from "@/lib/utils";
import { type IbCompany } from "@/data/installBase";

/*
 * InstallBaseContactsTable — the "Contacts" entity view for Install Base. A flat
 * list of the curated contacts across the tier's customers (buyer / champion /
 * cross-functional leaders), each linking back to its account. No bulk-enrol —
 * actions route to targeted outreach.
 */

const HEADER_CELL =
  "px-4 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]";
const HEADER_CELL_LAST = "px-4 table-header-text align-middle";
const BODY_CELL = "border-b border-border px-4 py-3 align-middle";

interface InstallBaseContactsTableProps {
  companies: IbCompany[];
  onWork: (companyId: string) => void;
  onContactClick?: (contactId: string) => void;
}

const InstallBaseContactsTable = ({
  companies,
  onWork,
  onContactClick,
}: InstallBaseContactsTableProps) => {
  const rows = companies.flatMap((company) =>
    company.contacts.map((contact) => ({ contact, company })),
  );
  const { colStyle, startResize, totalWidth, fit } = useResizableColumns({
    contact: 260,
    customer: 200,
    signals: 300,
    actions: 160,
  });
  const columnKeys = ["contact", "customer", "signals", "actions"];
  const tableWidth = totalWidth(columnKeys);

  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (scrollRef.current) fit(columnKeys, scrollRef.current.clientWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border border-border bg-card rounded-[4px] overflow-hidden">
      <TableToolbar searchPlaceholder="Search contacts" />
      <div className="overflow-x-auto" ref={scrollRef}>
        <Table style={{ tableLayout: "fixed", width: tableWidth, minWidth: tableWidth }}>
          <TableHeader>
            <TableRow className="bg-[var(--color-fill-surface-recessed)] hover:bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
              <TableHead
                className={cn(
                  "sticky left-0 z-20 bg-[var(--color-fill-surface-recessed)]",
                  HEADER_CELL,
                )}
                style={colStyle("contact")}
              >
                Contact
                <ColumnResizeHandle onStart={(x) => startResize("contact", x)} />
              </TableHead>
              <TableHead className={cn("relative", HEADER_CELL)} style={colStyle("customer")}>
                Customer
                <ColumnResizeHandle onStart={(x) => startResize("customer", x)} />
              </TableHead>
              <TableHead className={cn("relative", HEADER_CELL)} style={colStyle("signals")}>
                Signals
                <ColumnResizeHandle onStart={(x) => startResize("signals", x)} />
              </TableHead>
              <TableHead className={cn("relative", HEADER_CELL_LAST)} style={colStyle("actions")}>
                Actions
                <ColumnResizeHandle onStart={(x) => startResize("actions", x)} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:last-child>td]:border-b-0">
            {rows.map(({ contact, company }) => (
              <TableRow
                key={`${company.id}-${contact.id}`}
                className="group bg-card hover:bg-fill-surface-recessed"
              >
                <td
                  className="sticky left-0 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle"
                  style={colStyle("contact")}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-8 w-8 ${contact.avatarColor}`}>
                      <AvatarFallback
                        className={`${contact.avatarColor} text-trellis-white detail-100`}
                      >
                        {contact.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <button
                        type="button"
                        onClick={() => onContactClick?.(contact.id)}
                        className="body-125 text-text-interactive hover:text-text-interactive-hover text-left"
                      >
                        {contact.name}
                      </button>
                      {contact.role && (
                        <span className="detail-100 text-muted-foreground">
                          {contact.role}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className={BODY_CELL} style={colStyle("customer")}>
                  <button
                    type="button"
                    onClick={() => onWork(company.id)}
                    className="body-100 text-text-interactive hover:text-text-interactive-hover text-left"
                  >
                    {company.name}
                  </button>
                </td>
                <td className={BODY_CELL} style={colStyle("signals")}>
                  <div className="flex flex-wrap items-center gap-1">
                    {contact.qlData && <Tag variant="orange">QL</Tag>}
                    <SignalChipRow
                      signals={contact.signals}
                      owner={{
                        kind: "contact",
                        id: contact.id,
                        name: contact.name,
                        role: contact.role,
                      }}
                      emptyLabel="No signals"
                    />
                  </div>
                </td>
                <td className={BODY_CELL} style={colStyle("actions")}>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="w-4 h-4 flex items-center justify-center"
                      onClick={() => toast.success("Opens targeted outreach")}
                      aria-label="Email"
                    >
                      <TrellisIcon name="email" size={16} />
                    </button>
                    <button
                      type="button"
                      className="w-4 h-4 flex items-center justify-center"
                      onClick={() => toast.success("Opens targeted outreach")}
                      aria-label="Call"
                    >
                      <TrellisIcon name="calling" size={16} />
                    </button>
                    <Button
                      variant="link"
                      className="body-100 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline"
                      onClick={() => onWork(company.id)}
                    >
                      Work
                    </Button>
                  </div>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InstallBaseContactsTable;
