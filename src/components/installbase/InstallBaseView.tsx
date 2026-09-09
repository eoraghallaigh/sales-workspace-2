import { useState } from "react";
import { ListFilter } from "lucide-react";
import { DataWell } from "@/components/ui/data-well";
import { Button } from "@/components/ui/button";
import FilterPill from "@/components/FilterPill";
import { SIGNAL_LABELS } from "@/data/signals";
import InstallBaseCompanyCard from "@/components/installbase/InstallBaseCompanyCard";
import InstallBaseTable from "@/components/installbase/InstallBaseTable";
import InstallBaseContactsTable from "@/components/installbase/InstallBaseContactsTable";
import {
  installBaseByTier,
  totalMrr,
  type IbTier,
} from "@/data/installBase";

// PPF tier framing for the install base. Labels/rubric mirror Net New; P1 = QL
// trigger, P3 = non-QL intent signal, P2 = top by IB Causal Rank, P4 = rest.
const TIER_META: Record<IbTier, { title: string; description: string }> = {
  P1: {
    title: "P1 - Now",
    description: "Customers who've triggered a high-value QL. Work these first.",
  },
  P2: {
    title: "P2 - Next",
    description:
      "High-potential customers surfaced by IB Causal Rank — your proactive expansion targets.",
  },
  P3: {
    title: "P3 - Later",
    description:
      "Customers showing intent signals below the QL bar. Valuable, lower urgency.",
  },
  P4: {
    title: "P4 - Last",
    description: "The rest of your book, ranked by IB Causal Rank.",
  },
};

type EntityView = "companies" | "contacts";
type CompanyView = "cards" | "table";

// Tier-conditional default within Companies: cards for P1/P3 (want the contacts
// up front), table for P2/P4 (higher volume, more to parse).
const defaultCompanyView = (tier: IbTier): CompanyView =>
  tier === "P1" || tier === "P3" ? "cards" : "table";

// A small segmented control matching the rest of the workspace's toggles.
const Segmented = <T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) => (
  <div className="flex items-center" role="group" aria-label={ariaLabel}>
    {options.map((opt, i) => (
      <button
        key={opt}
        type="button"
        aria-pressed={value === opt}
        onClick={() => onChange(opt)}
        className={`relative flex items-center px-3 py-1.5 detail-200 border border-core-subtle capitalize transition-colors ${
          i === 0 ? "rounded-l-[4px] -mr-px" : "rounded-r-[4px]"
        } ${
          value === opt
            ? "bg-[var(--page-bg)] z-[1] text-foreground"
            : "bg-card text-muted-foreground hover:bg-[var(--page-bg)]"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

interface InstallBaseViewProps {
  tier: IbTier;
  onWork: (companyId: string) => void;
  onContactClick?: (contactId: string) => void;
}

const InstallBaseView = ({ tier, onWork, onContactClick }: InstallBaseViewProps) => {
  const companies = installBaseByTier(tier);
  const [entity, setEntity] = useState<EntityView>("companies");
  const [companyView, setCompanyView] = useState<CompanyView>(
    defaultCompanyView(tier),
  );

  const meta = TIER_META[tier];
  const tierMrr = companies.reduce((sum, c) => sum + totalMrr(c), 0);
  const portalCount = companies.reduce((sum, c) => sum + c.portals.length, 0);
  const renewing90 = companies.reduce(
    (sum, c) => sum + c.portals.filter((p) => p.renewalInDays <= 90).length,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <DataWell
          label="Book MRR (this tier)"
          value={`$${tierMrr.toLocaleString("en-US")}`}
          tooltip="Total monthly recurring revenue across customers in this tier"
        />
        <DataWell
          label="Customers"
          value={`${companies.length}`}
          tooltip="Customers in this tier"
        />
        <DataWell
          label="Portals"
          value={`${portalCount}`}
          tooltip="Total HubSpot portals across these customers"
        />
        <DataWell
          label="Renewing in 90 days"
          value={`${renewing90}`}
          tooltip="Portals with a renewal in the next 90 days"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="heading-300">{tier} Customers</h2>
          <p className="detail-100 text-muted-foreground">
            {companies.length} {companies.length === 1 ? "customer" : "customers"}
          </p>
          <p className="body-100 text-muted-foreground mt-2">
            {meta.description}{" "}
            <span className="text-foreground font-semibold cursor-pointer">
              Learn more.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Segmented
            options={["companies", "contacts"] as EntityView[]}
            value={entity}
            onChange={(v) => setEntity(v as EntityView)}
            ariaLabel="Companies or contacts"
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
          <div className="flex-1" />
          {entity === "companies" && (
            <Segmented
              options={["cards", "table"] as CompanyView[]}
              value={companyView}
              onChange={(v) => setCompanyView(v as CompanyView)}
              ariaLabel="Card or table view"
            />
          )}
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="rounded border border-dashed border-border px-6 py-16 text-center body-100 text-muted-foreground">
          No customers in this tier yet.
        </div>
      ) : entity === "contacts" ? (
        <InstallBaseContactsTable
          companies={companies}
          onWork={onWork}
          onContactClick={onContactClick}
        />
      ) : companyView === "cards" ? (
        <div>
          {companies.map((company) => (
            <InstallBaseCompanyCard
              key={company.id}
              company={company}
              onWork={() => onWork(company.id)}
              onContactClick={onContactClick}
            />
          ))}
        </div>
      ) : (
        <InstallBaseTable
          companies={companies}
          onWork={onWork}
          onContactClick={onContactClick}
        />
      )}
    </div>
  );
};

export default InstallBaseView;
