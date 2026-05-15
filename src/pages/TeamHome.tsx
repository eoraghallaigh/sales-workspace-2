import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  FloatingNav,
  type FloatingNavSection,
} from "@/components/about/FloatingNav";
import { Section } from "@/components/about/Section";
import { MarkdownDoc } from "@/components/about/MarkdownDoc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { cycles } from "@/data/cycles";

import businessGoalsMd from "../../../../docs/business-goals.md?raw";
import customerFeedbackMd from "../../../../docs/customer-feedback.md?raw";
import metricsMd from "../../../../docs/metrics.md?raw";
import personasMd from "../../../../docs/personas.md?raw";
import designPrinciplesMd from "../../../../docs/design-principles.md?raw";

const TEAM_NAME = "Flywheel Prospecting";
const TEAM_MISSION =
  "Help HubSpot reps prospect as efficiently as possible — and grow pipeline dollars per rep.";

const SECTIONS: FloatingNavSection[] = [
  { id: "hero", label: "Overview", icon: "home" },
  { id: "release-cycles", label: "Release cycles", icon: "globalGroup" },
  { id: "business-goals", label: "Business goals", icon: "goal" },
  { id: "user-research", label: "User research", icon: "test" },
  { id: "metrics", label: "Metrics & KPIs", icon: "reportingAndData" },
  { id: "personas", label: "Personas", icon: "user" },
  { id: "design-principles", label: "Design principles", icon: "conditionalFormulaDataSetField" },
];

const formatDateRange = (range?: { start: string; end?: string }) => {
  if (!range) return null;
  const start = new Date(range.start).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  if (!range.end) return start;
  const end = new Date(range.end).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${start} – ${end}`;
};

const TeamHome = () => {
  const scrollRef = useRef<HTMLElement | null>(null);

  return (
    <div className="about-doc h-screen overflow-hidden bg-background text-foreground">
      <FloatingNav sections={SECTIONS} scrollRoot={scrollRef} />
      <main
        ref={scrollRef}
        className="h-full overflow-y-auto bg-white px-6 md:px-12 py-10"
      >
        <div className="md:max-w-3xl mx-auto">
            <header
              id="hero"
              className="scroll-mt-12 pt-4 pb-16 border-b border-border"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <p className="detail-100 uppercase tracking-wider text-muted-foreground">
                  Team home
                </p>
                <h1 className="heading-1000 text-foreground tracking-tight">
                  {TEAM_NAME}
                </h1>
                <p className="body-300 text-muted-foreground max-w-2xl">
                  {TEAM_MISSION}
                </p>
              </div>
            </header>

            <Section
              id="release-cycles"
              title="Release cycles"
              description="Each cycle is a 6-week block. Click in to see the prototype, design goals, iterations, feedback, and metrics for that release."
            >
              <ul className="flex flex-col gap-3">
                {cycles.map((cycle) => (
                  <li key={cycle.slug}>
                    <Link
                      to={`/${cycle.slug}`}
                      className="block group"
                    >
                      <Card className="transition-colors group-hover:border-border-hover">
                        <CardContent className="p-4 flex items-start gap-4">
                          <Badge
                            variant="outline"
                            className="detail-100 font-mono uppercase shrink-0 mt-0.5"
                          >
                            {cycle.label}
                          </Badge>
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <p className="heading-100 text-foreground group-hover:text-text-interactive transition-colors">
                              {cycle.name}
                            </p>
                            <p className="body-100 text-muted-foreground">
                              {cycle.tagline}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant={cycle.status.badgeVariant}>
                                {cycle.status.label}
                              </Badge>
                              {formatDateRange(cycle.dateRange) ? (
                                <span className="detail-200 text-muted-foreground">
                                  {formatDateRange(cycle.dateRange)}
                                </span>
                              ) : null}
                              <span className="detail-200 text-muted-foreground">
                                {cycle.iterations.length} iteration
                                {cycle.iterations.length === 1 ? "" : "s"}
                              </span>
                            </div>
                          </div>
                          <TrellisIcon
                            name="right"
                            size={14}
                            className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0 mt-2"
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="business-goals" title="Business goals">
              <MarkdownDoc source={businessGoalsMd} />
            </Section>

            <Section id="user-research" title="User research">
              <MarkdownDoc source={customerFeedbackMd} />
            </Section>

            <Section id="metrics" title="Metrics & KPIs">
              <MarkdownDoc source={metricsMd} />
            </Section>

            <Section id="personas" title="Personas">
              <MarkdownDoc source={personasMd} />
            </Section>

          <Section id="design-principles" title="Design principles">
            <MarkdownDoc source={designPrinciplesMd} />
          </Section>
        </div>
      </main>
    </div>
  );
};

export default TeamHome;
