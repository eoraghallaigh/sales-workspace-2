import prospectingManagementMd from "../../../../docs/research/prospecting-management-research-report.md?raw";
import ppfWorkspaceMd from "../../../../docs/research/ppf-workspace-user-testing.md?raw";
import playsDiscoveryMd from "../../../../docs/research/plays-discovery-rep-feedback.md?raw";

export interface ResearchReport {
  slug: string;
  title: string;
  // One-line framing shown in lists and on the report header.
  summary: string;
  // Free-text date label (e.g. "Nov 2025"). Optional — not every report is dated.
  date?: string;
  // Who we spoke to, in short.
  participants?: string;
  source: string;
}

// The original, full research reports — surfaced in full from the User research
// page and the side nav. Newest first.
export const researchReports: ResearchReport[] = [
  {
    slug: "plays-discovery",
    title: "Plays Discovery — Findings",
    summary:
      "Three reps react to the plays prototype: what a “play” means to them, where sequencing earns trust, and the missing connection to Power Hour.",
    date: "Q2C2 2026",
    participants: "Paul Boland, Leanne McGrenaghan, Oisín Lynch",
    source: playsDiscoveryMd,
  },
  {
    slug: "ppf-workspace-user-testing",
    title: "PPF in the Workspace — User Testing",
    summary:
      "How reps work BoB leads in today's task queue vs the new workspace prototype — distrust of P-rankings, context gaps, and task abandonment.",
    date: "Nov 2025",
    source: ppfWorkspaceMd,
  },
  {
    slug: "prospecting-management",
    title: "Prospecting Management — Research Report",
    summary:
      "The manager side: how SMB sales managers define, monitor, and coach effective prospecting — and where BoB still leaves them blind.",
    date: "Q1C1 2026",
    source: prospectingManagementMd,
  },
];

export const getResearchReport = (
  slug: string | undefined,
): ResearchReport | undefined => {
  if (!slug) return undefined;
  return researchReports.find((report) => report.slug === slug);
};
