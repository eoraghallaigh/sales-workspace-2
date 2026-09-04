import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronDown, ChevronRight, Plus, EyeOff } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrellisIcon, type TrellisIconName } from "@/components/ui/trellis-icon";
import { OutreachStrategyPanel } from "@/components/OutreachStrategyPanel";
import { cn } from "@/lib/utils";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

const linkClass =
  "text-[var(--color-specialty-text-core-alt-default)] hover:underline cursor-pointer";

function CompanyLogo({ size = 40 }: { size?: number }) {
  return (
    <img
      src={companyLogoPlaceholder}
      alt=""
      className="rounded-[8px] border border-core-subtle object-cover shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

function CopyIcon() {
  return (
    <TrellisIcon
      name="copy"
      size={13}
      className="opacity-45 cursor-pointer hover:opacity-80 transition-opacity"
    />
  );
}

function ExternalIcon() {
  return <TrellisIcon name="externalLink" size={12} className="opacity-55" />;
}

function ActionsButton() {
  return (
    <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[var(--color-fill-accent-neutral-subtle-alt)] transition-colors">
      <span className="heading-50 text-foreground">Actions</span>
      <ChevronDown size={12} className="text-foreground" />
    </button>
  );
}

function AddLink() {
  return (
    <button className={cn("flex items-center gap-0.5", linkClass)}>
      <Plus size={14} />
      <span className="heading-50">Add</span>
    </button>
  );
}

function PropertyRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="detail-200 text-muted-foreground mb-0.5">{label}</p>
      <div className="body-100 text-foreground flex items-center gap-1.5">{children}</div>
    </div>
  );
}

function RecordSectionCard({
  title,
  count,
  action,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  action?: ReactNode;
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="border-core-subtle overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 min-w-0 text-left"
        >
          {open ? (
            <ChevronDown size={14} className="text-foreground shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-foreground shrink-0" />
          )}
          <span className="heading-50 text-foreground truncate">
            {title}
            {count !== undefined ? ` (${count})` : ""}
          </span>
        </button>
        {action}
      </div>
      {open && children && <div className="px-4 pb-4">{children}</div>}
    </Card>
  );
}

const recordActions: { icon: TrellisIconName; label: string }[] = [
  { icon: "edit", label: "Note" },
  { icon: "email", label: "Email" },
  { icon: "call", label: "Call" },
  { icon: "tasks", label: "Task" },
  { icon: "meetings", label: "Meeting" },
  { icon: "ellipses", label: "More" },
];

const tabs = ["Outreach Strategy", "Activities", "Intelligence"];

function EmptyIllustration() {
  return (
    <svg width="82" height="60" viewBox="0 0 82 60" fill="none" stroke="#b6b1af" strokeWidth="2">
      <rect x="15" y="9" width="40" height="30" rx="4" fill="#f5f3f2" />
      <line x1="22" y1="19" x2="42" y2="19" strokeLinecap="round" />
      <line x1="22" y1="26" x2="36" y2="26" strokeLinecap="round" />
      <circle cx="52" cy="39" r="11" fill="#ffffff" />
      <line x1="60" y1="47" x2="68" y2="55" strokeLinecap="round" />
    </svg>
  );
}

const Company = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <Layout>
      <div className="flex items-start gap-3 p-3 h-[var(--page-content-height)] bg-background overflow-y-auto overscroll-contain">
        {/* ── Left column ─────────────────────────────── */}
        <aside className="w-[350px] shrink-0 space-y-3">
          <div className="flex items-center justify-between px-1">
            <button className="flex items-center gap-1 hover:bg-[var(--color-fill-accent-neutral-subtle-alt)] rounded-md px-1.5 py-1 transition-colors">
              <ChevronLeft size={14} className="text-foreground" />
              <span className="heading-50 text-foreground">Companies</span>
            </button>
            <ActionsButton />
          </div>

          <Card className="border-core-subtle p-4 space-y-4">
            <div className="rounded-[var(--radius-card)] border border-core-subtle px-3 py-2.5">
              <p className="body-100 text-foreground">
                Your permissions don't allow you to edit this record.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CompanyLogo size={40} />
              <h1 className="heading-300 text-foreground">Advanced Satellite Communications</h1>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <a className={cn("body-100", linkClass)}>advancedsat.com</a>
                <ExternalIcon />
                <CopyIcon />
              </div>
              <div className="flex items-center gap-2">
                <a className={cn("body-100", linkClass)}>+1 734-462-3900</a>
                <CopyIcon />
              </div>
            </div>

            <div className="flex items-start justify-between">
              {recordActions.map((a) => (
                <div key={a.label} className="flex flex-col items-center gap-1.5">
                  <Button variant="tertiary" size="icon" className="h-10 w-10 rounded-full">
                    <TrellisIcon name={a.icon} size={16} />
                  </Button>
                  <span className="detail-100 text-muted-foreground">{a.label}</span>
                </div>
              ))}
            </div>

            <Separator className="bg-border" />

            <AboutSection />
          </Card>
        </aside>

        {/* ── Middle column ───────────────────────────── */}
        <div className="flex-1 min-w-0 relative">
          <Card className="flex flex-col border-0 shadow-none">
            <div className="flex rounded-t-[var(--radius-card)] overflow-hidden shrink-0 border-100 border-core-subtle">
              {tabs.map((tab, i) => {
                const active = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 h-12 flex items-center justify-center body-100 transition-colors",
                      i < tabs.length - 1 && "border-r border-core-subtle",
                      active
                        ? "bg-card text-foreground font-semibold"
                        : "bg-[var(--color-fill-surface-recessed)] text-muted-foreground border-b border-core-subtle hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            <div className="bg-[var(--color-fill-surface-recessed)]">
              {activeTab === "Outreach Strategy" && <OutreachStrategyPanel companyId="3" />}
            </div>
          </Card>

          {/* Right-panel collapse toggle, floating over the gutter */}
          <button className="absolute top-[58px] -right-[11px] z-10 h-[22px] w-[22px] rounded-full bg-white border border-core-subtle flex items-center justify-center shadow-100 hover:bg-[var(--color-fill-surface-recessed)] transition-colors">
            <TrellisIcon name="sidebarLeftCollapse" size={12} className="opacity-70" />
          </button>
        </div>

        {/* ── Right column ────────────────────────────── */}
        <aside className="w-[370px] shrink-0 space-y-3">
          <RecordSectionCard title="Domain Controls" />

          <RecordSectionCard title="Deals" count={0} action={<AddLink />} />

          <RecordSectionCard title="Associated Companies" count={0} />

          <RecordSectionCard title="Companies" count={0} action={<AddLink />} defaultOpen>
            <div className="flex flex-col items-center text-center py-4 gap-3">
              <EmptyIllustration />
              <p className="body-100 text-muted-foreground max-w-[250px]">
                See the businesses or organizations associated with this record.
              </p>
            </div>
          </RecordSectionCard>

          <RecordSectionCard title="Portals" count={0} action={<AddLink />} />

          <RecordSectionCard title="Contacts" count={3} action={<AddLink />} defaultOpen>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="relative w-[130px]">
                  <TrellisIcon
                    name="search"
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full h-8 pl-8 pr-3 rounded-full border border-core-subtle bg-white body-100 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="tertiary" size="small">
                    <TrellisIcon name="advancedFilters" size={14} />
                    Filters
                  </Button>
                  <Button variant="tertiary" size="small">
                    <TrellisIcon name="down" size={12} />
                    Sort
                  </Button>
                </div>
              </div>

              <div className="rounded-[var(--radius-card)] border border-core-subtle p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <CompanyLogo size={22} />
                  <a className={cn("link-100", linkClass)}>David Lee</a>
                </div>
                <p className="body-100 text-foreground">Advanced Satellite Communications</p>
                <div className="flex items-center gap-1.5 body-100">
                  <span className="text-foreground">Email:</span>
                  <a className={linkClass}>david.lee@advancedsat.com</a>
                  <CopyIcon />
                </div>
                <p className="body-100 text-foreground truncate">
                  <span>Job Title (Source of Truth): </span>Chief Marketing Officer
                </p>
                <Badge variant="koala">Contact with Primary Company</Badge>
              </div>
            </div>
          </RecordSectionCard>
        </aside>
      </div>
    </Layout>
  );
};

function AboutSection() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-left"
        >
          {open ? (
            <ChevronDown size={14} className="text-foreground shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-foreground shrink-0" />
          )}
          <span className="heading-50 text-foreground">About this company</span>
        </button>
        <ActionsButton />
      </div>

      {open && (
        <div className="space-y-4 pt-4 pl-6">
          <PropertyRow label="HubSpot Fit Score">82</PropertyRow>
          <PropertyRow label="Industry (Source of Truth)">Commercial Technology Systems Integrator</PropertyRow>
          <PropertyRow label="MHE/P Score">--</PropertyRow>
          <PropertyRow label="SHE/P Score">--</PropertyRow>
          <PropertyRow label="Company owner">Macey Montgomery</PropertyRow>
          <PropertyRow label="Website URL">
            <a className={linkClass}>https://advancedsat.com</a>
            <ExternalIcon />
          </PropertyRow>
          <PropertyRow label="Company Info Territory">NA/Commercial/US</PropertyRow>
          <PropertyRow label="Account Coverage">
            <EyeOff size={16} className="text-muted-foreground" />
          </PropertyRow>
          <PropertyRow label="Account Group">--</PropertyRow>
          <PropertyRow label="Domain Status">Domain Loads</PropertyRow>
          <PropertyRow label="Unique Domain">
            <a className={linkClass}>advancedsat.com</a>
            <ExternalIcon />
          </PropertyRow>
        </div>
      )}
    </div>
  );
}

export default Company;
