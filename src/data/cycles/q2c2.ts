import type { Cycle } from "./types";
import { q2c2Iterations } from "./iterations/q2c2";

export const q2c2: Cycle = {
  slug: "q2c2",
  label: "Q2C2",
  name: "BoB in the Workspace",
  tagline: "A single workspace to view and engage all of a rep's prospects.",
  dateRange: { start: "2026-05-18", end: "2026-06-26" },
  status: {
    label: "Live",
    badgeVariant: "status-green",
  },
  milestones: [
    { label: "Alpha", date: "Dec 8, 2025" },
    { label: "GA", date: "Feb 1, 2026" },
  ],
  primaryPersona: {
    name: "SMB sales reps — Growth Specialists & SDRs",
  },
  hero: {
    image: {
      src: "/about/hero/latest.png",
      alt: "Priority Prospects company list (Variant C)",
    },
    prototypeEntryPath: "/summary",
  },
  commitments: [
    {
      id: "outreach-strategy",
      title: "Outreach strategy",
      summary:
        "Give reps a one-click prospecting execution experience.",
      problem:
        "Today, we are providing reps with lead prioritisation, recommended contacts, data points and intent signals in the sales workspace. This helps them, but they still need to parse all that information and use it to create crafted, compelling outreach. We want to use AI to do this for the rep so all they have to do is review, edit and send.",
      designGoals: [
        "Make it clear that the outreach is AI-generated and provide sources, citations and reasoning to increase trust.",
        "Make it obvious that the outreach content and sequencing steps can be edited.",
        "Design a full-page immersive company review page which provides not only the strategy, but also the raw company and contact data so the rep doesn't need to navigate away to the full company record page.",
      ],
      feedback: [],
      metrics: [],
    },
  ],
  iterations: q2c2Iterations,
};
