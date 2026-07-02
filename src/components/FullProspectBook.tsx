import { DataWell } from "@/components/ui/data-well";
import { Button } from "@/components/ui/button";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { ExternalLink, ListFilter } from "lucide-react";
import FilterPill from "@/components/FilterPill";
import { SignalChip } from "@/components/SignalChip";
import { SIGNAL_LABELS } from "@/data/signals";
import { CompanyTable, type CompanyTableColumn } from "@/components/CompanyTable";
import { Company } from "@/components/CompanyCard";
import { prospectingCompanies } from "@/data/prospectingCompanies";
import { getAdditionalContactsForCompany } from "@/data/allContacts";

const FullProspectBook = ({
  onNameClick,
  onPreview,
}: {
  onNameClick?: (companyId: string) => void;
  onPreview?: (companyId: string, companyName: string) => void;
}) => {
  const columns: CompanyTableColumn<Company>[] = [
    {
      key: "industry",
      header: "Industry",
      minWidth: 140,
      render: (r) => <span className="body-100 text-foreground">{r.industry ?? "—"}</span>,
    },
    {
      key: "domain",
      header: "Domain",
      minWidth: 170,
      render: (r) => (
        <Button
          variant="link"
          className="body-100 text-text-interactive hover:text-text-interactive-hover p-0 h-auto hover:no-underline inline-flex items-center gap-1"
        >
          {r.website}
          <ExternalLink className="h-3 w-3" />
        </Button>
      ),
    },
    {
      key: "signals",
      header: "Intent Signals",
      minWidth: 260,
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.signals.map((signal, i) => (
            <SignalChip
              key={`${signal.id}-${i}`}
              signal={signal}
              owner={{ kind: "company", id: r.id, name: r.name }}
            />
          ))}
        </div>
      ),
    },
    {
      key: "recentConversion",
      header: "Recent Conversion",
      minWidth: 200,
      render: (r) => (
        <span className={r.conversionTrigger ? "body-100 text-foreground" : "body-100 text-muted-foreground"}>
          {r.conversionTrigger ?? "—"}
        </span>
      ),
    },
    {
      key: "recentConversionDate",
      header: "Recent Conversion Date",
      minWidth: 230,
      render: () => <span className="body-100 text-muted-foreground">—</span>,
    },
    {
      key: "lastActivityDate",
      header: "Last Activity Date",
      minWidth: 200,
      render: () => <span className="body-100 text-muted-foreground">—</span>,
    },
    {
      key: "nextStep",
      header: "Next Step",
      minWidth: 180,
      render: () => <span className="body-100 text-muted-foreground">—</span>,
    },
    {
      key: "rating",
      header: "Rating",
      minWidth: 120,
      render: () => <span className="body-100 text-muted-foreground">—</span>,
    },
    {
      key: "priority",
      header: "Priority",
      minWidth: 90,
      render: (r) => <span className="body-100 text-foreground">{r.priority ?? "P1"}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <DataWell
          label="Total book size"
          value="312"
          tooltip="Total prospects in the net new book"
        />
        <DataWell
          label="Total book worked"
          value="52%"
          tooltip="Share of the prospect book that has been worked"
        />
        <DataWell
          label="Net new deals created"
          value="18"
          tooltip="Net new deals created"
        />
        <DataWell
          label="% prospects with intent"
          value="34%"
          tooltip="Share of prospects with active intent signals"
        />
      </div>

      {/* Title + Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="heading-300">Full Prospect Book</h2>
          <p className="body-100 text-muted-foreground">312 prospects</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPill label="Priority" hasCarat options={["All", "P1", "P2", "P3", "P4"]} />
          <FilterPill label="Industry" hasCarat options={["All industries", "Technology", "Healthcare", "Finance", "Manufacturing", "Media", "Logistics", "Biotech", "E-commerce", "Education"]} />
          <FilterPill label="Signals" hasCarat options={["All signals", ...SIGNAL_LABELS]} />
          <Button variant="ghost" size="medium" className="border border-transparent heading-50">
            <ListFilter className="h-4 w-4" />
            Advanced filters
          </Button>
        </div>
      </div>

      <CompanyTable<Company>
        rows={prospectingCompanies}
        columns={columns}
        primaryHeader="Company"
        minTableWidth={1900}
        toolbar={<TableToolbar searchPlaceholder="Search prospects" />}
        getAvailableContacts={getAdditionalContactsForCompany}
        onNameClick={onNameClick ? (r) => onNameClick(r.id) : undefined}
        onPreview={onPreview ? (r) => onPreview(r.id, r.name) : undefined}
      />
    </div>
  );
};

export default FullProspectBook;
