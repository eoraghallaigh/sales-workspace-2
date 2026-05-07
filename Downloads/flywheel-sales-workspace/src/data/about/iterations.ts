import type { IterationEntry } from "./types";

// Iteration entries are auto-appended by the /ship slash command.
// New entries should be added at the TOP of this array (newest first).
// Each entry's `id` matches the folder name under public/about/iterations/.
export const iterations: IterationEntry[] = [
  {
    id: "2026-05-07-prototype-homepage-hub",
    date: "2026-05-07",
    label: "prototype-homepage-hub",
    whatChanged:
      "Added a project homepage at /about: hero with status badge and Open prototype CTA, iteration history, project context, links, and open questions, plus a sticky anchor nav with scroll-spy. On wide screens (≥ 2xl) the hero image of the Variant C company list moves to a third column that stays put while the content scrolls. About page renders in HubSpot Sans / HubSpot Serif (loaded from HubSpot's CDN) while the rest of the prototype keeps Lexend Deca.",
    why: "Viewers (PMs, eng leads, execs, customers) land on the prototype with no surrounding context today. The homepage is a single shareable URL that gives anyone the project framing, the iteration history, and a one-click jump into the prototype — and stays cheap to maintain because /ship populates the changelog automatically on every ship.",
    prUrl: "https://git.hubteam.com/eoraghallaigh/flywheel-sales-workspace/pull/28",
    screenshots: [
      { src: "/about/iterations/2026-05-07-prototype-homepage-hub/summary.png", alt: "Summary route screenshot" },
      { src: "/about/iterations/2026-05-07-prototype-homepage-hub/prospecting.png", alt: "Prospecting route screenshot" },
      { src: "/about/iterations/2026-05-07-prototype-homepage-hub/power-hour.png", alt: "Power Hour route screenshot" },
      { src: "/about/iterations/2026-05-07-prototype-homepage-hub/sales-workspace.png", alt: "Sales Workspace route screenshot" },
      { src: "/about/iterations/2026-05-07-prototype-homepage-hub/deals.png", alt: "Deals route screenshot" },
      { src: "/about/iterations/2026-05-07-prototype-homepage-hub/dashboard.png", alt: "Dashboard route screenshot" },
    ],
  },
];
