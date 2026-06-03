import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import Tag from "@/components/Tag";
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
  "h-11 px-6 py-3 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]";
const bodyCellClass = "border-b border-border px-4 py-3 align-middle";

const CompaniesTableView = ({
  companies,
  onCompanyClick,
  onNameClick,
  currentPlayId,
}: CompaniesTableViewProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

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
    <div className="border border-border bg-card">
      <TableToolbar
        searchPlaceholder="Search companies"
        searchValue={search}
        onSearchChange={setSearch}
      />
      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="bg-[var(--color-specialty-table-header-default)] hover:bg-[var(--color-specialty-table-header-default)]">
              <TableHead className="w-12 h-11 px-4 py-3 sticky left-0 z-20 bg-[var(--color-specialty-table-header-default)] table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">
                <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead className={`sticky left-12 z-20 bg-[var(--color-specialty-table-header-default)] min-w-[260px] ${headerCellClass}`}>
                Company
              </TableHead>
              <TableHead className={`min-w-[140px] ${headerCellClass}`}>Industry</TableHead>
              <TableHead className={`min-w-[100px] ${headerCellClass}`}>PVS</TableHead>
              <TableHead className={`min-w-[260px] ${headerCellClass}`}>Why now</TableHead>
              <TableHead className={`min-w-[160px] ${headerCellClass}`}>Contacts</TableHead>
              {!currentPlayId && (
                <TableHead className={`min-w-[180px] ${headerCellClass}`}>Touches</TableHead>
              )}
              <TableHead className="min-w-[120px] h-11 px-6 py-3 table-header-text align-middle">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => {
              const statusBadge = currentPlayId
                ? getPlayStatusBadge(company.status)
                : getStatusBadge(company.status);

              const touchStatuses = [...(company.touches.touchStatuses || [])];
              while (touchStatuses.length < 5) touchStatuses.push("empty");
              const displayedTouchStatuses = touchStatuses.slice(0, 5);

              const displayedSignals = company.signals.slice(0, 2);

              return (
                <TableRow key={company.id} className="bg-card hover:bg-fill-surface-recessed">
                  <td className="w-12 sticky left-0 z-10 bg-inherit border-b border-border px-4 py-3 align-middle">
                    <Checkbox
                      checked={selected.has(company.id)}
                      onCheckedChange={() => toggleSelected(company.id)}
                    />
                  </td>
                  <td className="sticky left-12 z-10 bg-inherit border-b border-border border-r border-border px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={company.logo || companyLogoPlaceholder}
                        alt={`${company.name} logo`}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <Button
                          variant="link"
                          className="body-100 text-text-interactive hover:text-text-interactive-hover p-0 h-auto justify-start hover:no-underline"
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
                      <div className="flex flex-wrap gap-1">
                        {displayedSignals.map((signal) => (
                          <Tag key={signal.text} variant={signal.variant}>
                            {signal.text}
                          </Tag>
                        ))}
                      </div>
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompaniesTableView;
