import { q2c1 } from "./q2c1";
import { q2c2 } from "./q2c2";
import type { Cycle, CycleMilestone, CycleSlug } from "./types";

export * from "./types";

// Canonical 6-week cycle calendar. New cycle records pull their date range
// from here so dates stay in one place. Update when the calendar shifts.
export const cycleSchedule: Record<CycleSlug, CycleMilestone & { end: string }> = {
  q1c1: { label: "Q1C1", date: "2026-01-05", end: "2026-02-13" },
  q1c2: { label: "Q1C2", date: "2026-02-16", end: "2026-04-03" },
  q2c1: { label: "Q2C1", date: "2026-04-06", end: "2026-05-15" },
  q2c2: { label: "Q2C2", date: "2026-05-18", end: "2026-06-26" },
  q3c1: { label: "Q3C1", date: "2026-06-29", end: "2026-08-14" },
  q3c2: { label: "Q3C2", date: "2026-08-17", end: "2026-09-25" },
  q4c1: { label: "Q4C1", date: "2026-09-28", end: "2026-11-06" },
  q4c2: { label: "Q4C2", date: "2026-11-09", end: "2027-01-01" },
};

// All cycles with their own page record, newest first. New cycles are added
// at the top by the /freeze-cycle skill.
export const cycles: Cycle[] = [q2c2, q2c1];

// The cycle currently being shipped to. `/ship` appends iterations here.
// When a cycle wraps, run /freeze-cycle to fork pages into the next slug.
export const currentCycleSlug: CycleSlug = "q2c2";

export const getCycle = (slug: CycleSlug | undefined): Cycle | undefined => {
  if (!slug) return undefined;
  return cycles.find((c) => c.slug === slug);
};

export const getCurrentCycle = (): Cycle => {
  const c = getCycle(currentCycleSlug);
  if (!c) throw new Error(`Current cycle "${currentCycleSlug}" not found`);
  return c;
};
