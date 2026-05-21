export interface CaptureRoute {
  path: string;
  name: string;
  waitFor?: string;
}

// Routes captured by the /ship slash command. Paths are relative to the
// current cycle — the capture script prefixes them with /<currentCycleSlug>
// at runtime. Add new routes here when adding new prototype screens.
export const captureRoutes: CaptureRoute[] = [
  { path: "/summary", name: "summary" },
  { path: "/prospecting", name: "prospecting" },
  { path: "/prospecting/strategy/1", name: "prospecting-strategy" },
  { path: "/prospecting/strategy/1?empty=both", name: "prospecting-strategy-empty-both" },
  { path: "/prospecting/strategy/1?empty=research", name: "prospecting-strategy-empty-research" },
  { path: "/prospecting/strategy/1?empty=sequences", name: "prospecting-strategy-empty-sequences" },
  { path: "/campaigns", name: "campaigns" },
  { path: "/power-hour", name: "power-hour" },
  { path: "/sales-workspace", name: "sales-workspace" },
  { path: "/deals", name: "deals" },
  { path: "/dashboard", name: "dashboard" },
];
