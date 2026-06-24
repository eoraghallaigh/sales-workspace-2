import { currentCycleSlug, type CycleSlug } from "@/data/cycles";

// Returns helpers for building paths inside the prototype. Routes are no
// longer cycle-prefixed, so `cyclePath` is now an identity helper for
// absolute paths; it stays in place so call sites don't all have to change.
// `cycleSlug` still reports the current cycle for any non-routing consumer.
export const useCyclePath = () => {
  const cycleSlug: CycleSlug = currentCycleSlug;

  const cyclePath = (path: string) => path;

  return { cycleSlug, cyclePath };
};
