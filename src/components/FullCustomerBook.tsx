import { ListFilter } from "lucide-react";
import { DataWell } from "@/components/ui/data-well";
import { Button } from "@/components/ui/button";
import FilterPill from "@/components/FilterPill";
import { SIGNAL_LABELS } from "@/data/signals";
import InstallBaseTable from "@/components/installbase/InstallBaseTable";
import { installBaseCompanies, totalMrr } from "@/data/installBase";

interface FullCustomerBookProps {
  onWork: (companyId: string) => void;
  onContactClick?: (contactId: string) => void;
}

// The whole install base book across every tier — the same nested company →
// portal(s)/contacts table as the tier views, with a Tier column and the IB
// quick-filters. See .context/ib-ppf-design.md.
const FullCustomerBook = ({ onWork, onContactClick }: FullCustomerBookProps) => {
  const companies = installBaseCompanies;
  const bookMrr = companies.reduce((sum, c) => sum + totalMrr(c), 0);
  const portalCount = companies.reduce((sum, c) => sum + c.portals.length, 0);
  const renewing90 = companies.reduce(
    (sum, c) => sum + c.portals.filter((p) => p.renewalInDays <= 90).length,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top metrics */}
      <div className="grid grid-cols-4 gap-4">
        <DataWell
          label="Total book size"
          value={`${companies.length}`}
          tooltip="Total customers in the install base book"
        />
        <DataWell
          label="Total MRR"
          value={`$${bookMrr.toLocaleString("en-US")}`}
          tooltip="Total monthly recurring revenue across the book"
        />
        <DataWell
          label="Portals"
          value={`${portalCount}`}
          tooltip="Total HubSpot portals across the book"
        />
        <DataWell
          label="Renewing in 90 days"
          value={`${renewing90}`}
          tooltip="Portals with a renewal in the next 90 days"
        />
      </div>

      {/* Title + filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="heading-300">Full Customer Book</h2>
          <p className="body-100 text-muted-foreground">
            {companies.length} customers
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPill
            label="Tier"
            hasCarat
            options={["All tiers", "P1 - Now", "P2 - Next", "P3 - Later", "P4 - Last"]}
          />
          <FilterPill
            label="Products (Hubs)"
            hasCarat
            options={["All Hubs", "Marketing", "Sales", "Service", "Content", "Operations"]}
          />
          <FilterPill
            label="Next renewal date"
            hasCarat
            options={["Any", "Next 30 days", "Next 60 days", "Next 90 days"]}
          />
          <FilterPill
            label="Total MRR"
            hasCarat
            options={["Any", "< $500", "$500–$2k", "> $2k"]}
          />
          <FilterPill
            label="HubSpot Credits"
            hasCarat
            options={["Any", "Low", "Medium", "High"]}
          />
          <FilterPill label="Signals" hasCarat options={["All signals", ...SIGNAL_LABELS]} />
          <Button variant="ghost" size="medium" className="border border-transparent heading-50">
            <ListFilter className="h-4 w-4" />
            Advanced filters
          </Button>
        </div>
      </div>

      {/* Table — all tiers, with a Tier column */}
      <InstallBaseTable
        companies={companies}
        onWork={onWork}
        onContactClick={onContactClick}
        showTier
        searchPlaceholder="Search customers"
      />
    </div>
  );
};

export default FullCustomerBook;
