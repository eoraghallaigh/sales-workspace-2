import { useEffect, type RefObject } from "react";
import { useScrollSpy } from "./useScrollSpy";
import { cn } from "@/lib/utils";

export interface AnchorNavSection {
  id: string;
  label: string;
}

interface AnchorNavProps {
  sections: AnchorNavSection[];
  projectName: string;
  scrollRoot?: RefObject<HTMLElement | null>;
}

export const AnchorNav = ({
  sections,
  projectName,
  scrollRoot,
}: AnchorNavProps) => {
  const sectionIds = sections.map((s) => s.id);
  const activeId = useScrollSpy(sectionIds, { root: scrollRoot });

  // Honor URL hash on initial mount: scroll to the right section inside the
  // scroll container.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash && sectionIds.includes(hash)) {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "auto", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <aside className="hidden md:flex h-full w-60 shrink-0 flex-col border-r border-border bg-background px-6 py-10">
      <div className="mb-8">
        <p className="detail-100 uppercase tracking-wider text-muted-foreground">
          Project
        </p>
        <p className="heading-200 text-foreground mt-1 leading-tight">
          {projectName}
        </p>
      </div>
      <nav aria-label="Page sections">
        <ul className="flex flex-col gap-1">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={cn(
                    "block rounded-md px-3 py-2 body-100 transition-colors",
                    isActive
                      ? "bg-fill-surface-raised text-foreground heading-50"
                      : "text-muted-foreground hover:text-foreground hover:bg-fill-surface-raised/60",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
