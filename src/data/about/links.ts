import type { ProjectLink } from "./types";

const REPO = "https://git.hubteam.com/eoraghallaigh/flywheel-sales-workspace/blob/master";

export const links: ProjectLink[] = [
  {
    id: "prd",
    label: "PRD — BoB in the Workspace",
    href: `${REPO}/docs/prds/prd-bob-workspace.md`,
    category: "spec",
    description: "Priority Prospects view spec, requirements, and milestones",
  },
  {
    id: "asana",
    label: "Asana — Project tasks",
    href: "https://app.asana.com/0/home/my_tasks",
    category: "tracking",
    description: "Source of truth for tasks, deadlines, and dependencies",
  },
  {
    id: "research-report",
    label: "Prospecting management research report",
    href: `${REPO}/docs/research/prospecting-management-research-report.md`,
    category: "research",
    description: "Manager-side view of effective prospecting behaviours",
  },
  {
    id: "customer-feedback",
    label: "Customer feedback themes",
    href: `${REPO}/docs/customer-feedback.md`,
    category: "research",
    description: "Synthesized rep pain points across interviews",
  },
  {
    id: "personas",
    label: "User personas",
    href: `${REPO}/docs/personas.md`,
    category: "research",
    description: "Growth Specialist and SDR profiles",
  },
];
