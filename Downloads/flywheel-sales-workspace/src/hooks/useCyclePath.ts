import { useLocation, useParams } from "react-router-dom";
import { cycles, currentCycleSlug, type CycleSlug } from "@/data/cycles";

const knownSlugs = new Set(cycles.map((c) => c.slug));

const slugFromPathname = (pathname: string): CycleSlug | undefined => {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && knownSlugs.has(first) ? first : undefined;
};

// Returns helpers for building cycle-prefixed paths inside the prototype.
// The slug comes from the `:cycleSlug` route param when present; if the
// caller is mounted outside a cycle route (e.g. GuidedTour), fall back to
// the URL pathname; finally, fall back to the current cycle so the helper
// still works on the Team Home before navigation.
export const useCyclePath = () => {
  const { cycleSlug: paramSlug } = useParams<{ cycleSlug?: string }>();
  const { pathname } = useLocation();
  const cycleSlug: CycleSlug =
    paramSlug ?? slugFromPathname(pathname) ?? currentCycleSlug;

  const cyclePath = (path: string) => {
    if (!path.startsWith("/")) return path;
    return `/${cycleSlug}${path === "/" ? "" : path}`;
  };

  return { cycleSlug, cyclePath };
};
