export interface CaptureRoute {
  path: string;
  name: string;
  waitFor?: string;
}

export const captureRoutes: CaptureRoute[] = [
  { path: "/about", name: "about" },
  { path: "/summary", name: "summary" },
  { path: "/prospecting", name: "prospecting" },
  { path: "/power-hour", name: "power-hour" },
  { path: "/sales-workspace", name: "sales-workspace" },
  { path: "/deals", name: "deals" },
  { path: "/dashboard", name: "dashboard" },
];
