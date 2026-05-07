import type { ProjectMeta } from "./types";

export const projectMeta: ProjectMeta = {
  name: "BoB in the Workspace",
  tagline: "A single workspace to view and engage all of a rep's prospects.",
  status: {
    label: "Live",
    badgeVariant: "status-green",
    milestones: [
      { label: "Alpha", date: "Dec 8, 2025" },
      { label: "GA", date: "Feb 1, 2026" },
    ],
  },
  prototypeHref: "/",
  northStar:
    "Reduce CAC for SMB sales by giving reps a trustworthy daily cockpit that replaces fragmented dashboards and lets them prioritize, multi-thread, and take action without leaving the workspace.",
  primaryPersona: {
    name: "SMB sales reps — Growth Specialists & SDRs",
  },
  heroImage: {
    src: "/about/hero/latest.png",
    alt: "Priority Prospects company list (Variant C)",
  },
};
