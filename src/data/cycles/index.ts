export type CycleSlug = string;

// Slim cycle index. The prototype only needs the set of valid slugs (to
// recognise `/:cycleSlug` routes) and which slug is current (for the `/`
// redirect). Per-cycle documentation — commitments, iteration history,
// screenshots — lives in the Team Home repo, not here.
export interface CycleSummary {
  slug: CycleSlug;
  label: string;
}

export const cycles: CycleSummary[] = [
  { slug: "q2c2", label: "Q2C2" },
  { slug: "q2c1", label: "Q2C1" },
];

// The cycle the prototype lands on from `/`. Bump when a new cycle ships.
export const currentCycleSlug: CycleSlug = "q2c2";

export const getCycle = (slug: CycleSlug | undefined): CycleSummary | undefined =>
  slug ? cycles.find((c) => c.slug === slug) : undefined;
