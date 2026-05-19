import type { Cycle } from "./types";
import { q2c1Iterations } from "./iterations/q2c1";

export const q2c1: Cycle = {
  slug: "q2c1",
  label: "Q2C1",
  name: "Q2C1",
  tagline: "",
  dateRange: { start: "2026-04-06", end: "2026-05-15" },
  status: {
    label: "Past",
    badgeVariant: "status-gray",
  },
  milestones: [],
  primaryPersona: {
    name: "SMB sales reps — Growth Specialists & SDRs",
  },
  hero: {
    prototypeEntryPath: "/summary",
  },
  commitments: [
    {
      id: "bob-view-optimisations",
      title: "BoB view optimisations",
      summary: "UX optimisations to BoB views based on rep feedback.",
      problem:
        "Reps frequently tell us that certain contacts shouldn't be associated to companies, or that they want to add more contacts to the list of recommended contacts.",
      designGoals: [
        "Allow reps to remove contacts without leaving the company list view.",
        "Capture feedback from reps when they hide a contact.",
        "Implement the ability to reorder contacts in a seamless, intuitive way.",
      ],
      metrics: [],
      feedback: [],
    },
    {
      id: "performance-tab",
      title: "Performance Tab (inc. RPA and BoB Manager Dashboard)",
      summary:
        "Provide managers with a view of their reps' performance relative to the BoB expectations and the RPA framework.",
      problem:
        "Currently managers need to jump around into various different tools to understand their reps' performance. We want to bring all performance data under one roof in the sales workspace, so that managers have a one-stop shop to understand performance, and so that managers will push use of the workspace itself with their reps. If the managers are using something, the reps are more likely to use it as well.",
      designGoals: [
        "Clarify BoB expectations with both managers and reps by providing a neat visual presentation of the important data, in a format they can quickly scan and understand.",
      ],
      metrics: [],
      feedback: [],
    },
  ],
  iterations: q2c1Iterations,
};
