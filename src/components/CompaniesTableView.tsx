import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { Company } from "@/components/CompanyCard";
import {
  CompanyTable,
  type CompanyTableColumn,
} from "@/components/CompanyTable";
import SequenceEnrollmentModal from "@/components/SequenceEnrollmentModal";
import { SignalChipRow } from "@/components/SignalChip";
import PvsTooltip from "@/components/PvsTooltip";
import CompanyPlayTags from "@/components/CompanyPlayTags";
import ContactOutreachAvatars from "@/components/ContactOutreachAvatars";
import { MiniTouchDots, type TouchStatus } from "@/components/TouchDot";
import { getPlayStatusBadge } from "@/utils/companyStatusUtils";
import { getAdditionalContactsForCompany } from "@/data/allContacts";

interface CompaniesTableViewProps {
  companies: Company[];
  onCompanyClick?: (companyId: string) => void;
  onNameClick?: (companyId: string) => void;
  onPreview?: (companyId: string, companyName: string) => void;
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

const CompaniesTableView = ({
  companies,
  onCompanyClick,
  onNameClick,
  onPreview,
  currentPlayId,
}: CompaniesTableViewProps) => {
  const [search, setSearch] = useState("");
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(query));
  }, [companies, search]);

  const columns: CompanyTableColumn<Company>[] = [
    {
      key: "industry",
      header: "Industry",
      minWidth: 140,
      render: (c) => <span className="body-100 text-foreground">{c.industry ?? "—"}</span>,
    },
    {
      key: "pvs",
      header: "PVS",
      minWidth: 100,
      render: (c) => (
        <PvsTooltip pvsScore={c.pvsScore}>
          <span className="body-100 text-foreground cursor-default">{c.pvsScore ?? "—"}</span>
        </PvsTooltip>
      ),
    },
    {
      key: "signals",
      header: "Signals",
      minWidth: 260,
      render: (c) => {
        const displayed = c.signals.slice(0, 2);
        return displayed.length > 0 ? (
          <SignalChipRow signals={displayed} owner={{ kind: "company", id: c.id, name: c.name }} />
        ) : (
          <span className="body-100 text-muted-foreground">{getWhyNow(c)}</span>
        );
      },
    },
    {
      key: "contacts",
      header: "Sequence Summary",
      minWidth: 160,
      render: (c) => <ContactOutreachAvatars contacts={c.recommendedContacts} align="start" />,
    },
    ...((currentPlayId
      ? []
      : [
          {
            key: "touches",
            header: "Touches",
            minWidth: 180,
            render: (c: Company) => {
              const statuses = [...(c.touches.touchStatuses || [])];
              while (statuses.length < 5) statuses.push("empty");
              return (
                <div className="flex items-center gap-2">
                  <MiniTouchDots statuses={statuses.slice(0, 5) as TouchStatus[]} />
                  <span className="detail-200 text-muted-foreground whitespace-nowrap">
                    due {c.touches.deadline}
                  </span>
                </div>
              );
            },
          },
        ]) as CompanyTableColumn<Company>[]),
    {
      key: "status",
      header: "Status",
      minWidth: 120,
      render: (c) => {
        const badge = currentPlayId ? getPlayStatusBadge(c.status) : getStatusBadge(c.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
  ];

  return (
    <CompanyTable<Company>
      rows={filteredCompanies}
      columns={columns}
      primaryHeader="Company"
      primaryMinWidth={260}
      minTableWidth={1000}
      onNameClick={(c) => (onNameClick ?? onCompanyClick)?.(c.id)}
      onPreview={onPreview ? (c) => onPreview(c.id, c.name) : undefined}
      renderNameExtra={(c) => (
        <CompanyPlayTags companyId={c.id} compact excludePlayId={currentPlayId} />
      )}
      getAvailableContacts={getAdditionalContactsForCompany}
      toolbar={
        <TableToolbar
          searchPlaceholder="Search companies"
          searchValue={search}
          onSearchChange={setSearch}
        />
      }
      renderBulkBar={(selected, clearSelection) => {
        const count = selected.length;
        const label =
          count === 1 ? selected[0]?.contact.name ?? "1 contact" : `${count} contacts`;
        return (
          <>
            <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-card">
              <Button variant="primary" size="small" onClick={() => setIsEnrollOpen(true)}>
                Enrol ({count})
                <TrellisIcon name="sequences" size={14} className="ml-1 brightness-0 invert" />
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  toast.success(`Created call task${count !== 1 ? "s" : ""} for ${label}`);
                  clearSelection();
                }}
              >
                Create Call Task ({count})
                <TrellisIcon name="tasks" size={14} className="ml-1" />
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  toast.success(`Removed ${count} contact${count !== 1 ? "s" : ""}`);
                  clearSelection();
                }}
              >
                Hide ({count})
                <TrellisIcon name="hide" size={14} className="ml-1" />
              </Button>
              <Button
                variant="link"
                className="body-100 text-foreground h-auto p-0"
                onClick={clearSelection}
              >
                Clear
              </Button>
            </div>
            <SequenceEnrollmentModal
              open={isEnrollOpen}
              contacts={selected.map((s) => s.contact)}
              companyLogo={selected[0]?.row.logo}
              onOpenChange={setIsEnrollOpen}
              onEnroll={(_sequenceId, sequenceName) => {
                toast.success(`Enrolled ${label} in ${sequenceName}`);
                setIsEnrollOpen(false);
                clearSelection();
              }}
            />
          </>
        );
      }}
    />
  );
};

export default CompaniesTableView;
