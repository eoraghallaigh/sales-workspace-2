import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  TrellisIcon,
  type TrellisIconName,
} from "@/components/ui/trellis-icon";
import { aboutDocs } from "@/data/aboutDocs";
import { researchReports } from "@/data/researchReports";
import { cycles } from "@/data/cycles";

interface NavItemProps {
  to: string;
  label: string;
  icon: TrellisIconName;
  sublabel?: string;
  isActive?: boolean;
}

const NavItem = ({ to, label, icon, sublabel, isActive }: NavItemProps) => (
  <li>
    <Link
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-text-interactive",
        isActive
          ? "bg-fill-secondary-hover"
          : "hover:bg-fill-surface-raised/60",
      )}
    >
      <TrellisIcon
        name={icon}
        size={16}
        className={cn("shrink-0", isActive ? "opacity-100" : "opacity-70")}
      />
      <span className="flex flex-col leading-tight min-w-0">
        <span
          className={cn(
            "body-100 truncate",
            isActive
              ? "text-foreground heading-100"
              : "text-foreground group-hover:text-text-interactive transition-colors",
          )}
        >
          {label}
        </span>
        {sublabel ? (
          <span className="detail-200 text-muted-foreground truncate">
            {sublabel}
          </span>
        ) : null}
      </span>
    </Link>
  </li>
);

const GroupLabel = ({ children }: { children: string }) => (
  <p className="detail-100 uppercase tracking-wider text-muted-foreground px-2.5 mb-1.5">
    {children}
  </p>
);

const formatCycleRange = (range?: { start: string; end?: string }) => {
  if (!range) return undefined;
  const start = new Date(range.start).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  if (!range.end) return start;
  const end = new Date(range.end).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return `${start} – ${end}`;
};

export const AboutSideNav = () => {
  const { docSlug, reportSlug } = useParams<{
    docSlug: string;
    reportSlug: string;
  }>();

  return (
    <aside
      aria-label="Team workspace navigation"
      className="hidden md:flex w-[264px] shrink-0 h-full flex-col overflow-y-auto border-r border-border bg-white px-3 py-6"
    >
      <Link
        to="/"
        className="px-2.5 mb-6 flex flex-col gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-text-interactive rounded-md"
      >
        <span className="heading-200 text-foreground">Flywheel Prospecting</span>
        <span className="detail-100 text-muted-foreground">Team workspace</span>
      </Link>

      <nav className="flex flex-col gap-6">
        <ul className="flex flex-col gap-0.5">
          <NavItem to="/" label="Team home" icon="home" />
        </ul>

        <div>
          <GroupLabel>Reference</GroupLabel>
          <ul className="flex flex-col gap-0.5">
            {aboutDocs.map((doc) => (
              <NavItem
                key={doc.slug}
                to={`/about/${doc.slug}`}
                label={doc.title}
                icon={doc.icon}
                isActive={doc.slug === docSlug}
              />
            ))}
          </ul>
        </div>

        <div>
          <GroupLabel>Research reports</GroupLabel>
          <ul className="flex flex-col gap-0.5">
            {researchReports.map((report) => (
              <NavItem
                key={report.slug}
                to={`/research/${report.slug}`}
                label={report.title}
                icon="description"
                isActive={report.slug === reportSlug}
              />
            ))}
          </ul>
        </div>

        <div>
          <GroupLabel>Release cycles</GroupLabel>
          <ul className="flex flex-col gap-0.5">
            {cycles.map((cycle) => (
              <NavItem
                key={cycle.slug}
                to={`/${cycle.slug}`}
                label={cycle.label}
                icon="date"
                sublabel={formatCycleRange(cycle.dateRange)}
              />
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};
