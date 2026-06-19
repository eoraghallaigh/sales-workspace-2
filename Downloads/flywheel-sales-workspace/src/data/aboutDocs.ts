import type { TrellisIconName } from "@/components/ui/trellis-icon";

import businessGoalsMd from "../../../../docs/business-goals.md?raw";
import customerFeedbackMd from "../../../../docs/customer-feedback.md?raw";
import metricsMd from "../../../../docs/metrics.md?raw";
import personasMd from "../../../../docs/personas.md?raw";
import designPrinciplesMd from "../../../../docs/design-principles.md?raw";

export interface AboutDoc {
  slug: string;
  title: string;
  description: string;
  source: string;
  icon: TrellisIconName;
}

// The team-context reference docs, surfaced as standalone pages from Team home.
// Each renders the matching markdown file under /docs at /about/<slug>.
export const aboutDocs: AboutDoc[] = [
  {
    slug: "business-goals",
    title: "Business goals",
    description:
      "OKRs, target outcomes, and how this team's work ladders up to Flywheel.",
    source: businessGoalsMd,
    icon: "goal",
  },
  {
    slug: "user-research",
    title: "User research",
    description:
      "Themes and quotes from rep interviews — what's working, what's broken, what they want next.",
    source: customerFeedbackMd,
    icon: "questionAnswer",
  },
  {
    slug: "metrics",
    title: "Metrics & KPIs",
    description: "What we track for adoption, engagement, and pipeline impact.",
    source: metricsMd,
    icon: "gauge",
  },
  {
    slug: "personas",
    title: "Personas",
    description:
      "SDRs vs Growth Specialists — different jobs, different daily contexts.",
    source: personasMd,
    icon: "contact",
  },
  {
    slug: "design-principles",
    title: "Design principles",
    description:
      "The non-negotiables we use to make UI decisions in the workspace.",
    source: designPrinciplesMd,
    icon: "styles",
  },
];

export const getAboutDoc = (slug: string | undefined): AboutDoc | undefined => {
  if (!slug) return undefined;
  return aboutDocs.find((doc) => doc.slug === slug);
};
