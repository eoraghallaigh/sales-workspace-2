import { useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  FloatingNav,
  type FloatingNavSection,
} from "@/components/about/FloatingNav";
import { Section } from "@/components/about/Section";
import { IterationsSection } from "@/components/about/IterationsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import {
  getCycle,
  type Commitment,
  type IterationEntry,
} from "@/data/cycles";

const formatCycleDates = (range?: { start: string; end?: string }) => {
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

const commitmentSectionId = (id: string) => `commitment-${id}`;

interface CommitmentSectionProps {
  commitment: Commitment;
  iterations: IterationEntry[];
}

const CommitmentSection = ({
  commitment,
  iterations,
}: CommitmentSectionProps) => {
  return (
    <Section
      id={commitmentSectionId(commitment.id)}
      title={commitment.title}
      description={commitment.summary}
    >
      <div className="flex flex-col gap-6">
        {commitment.engineeringDRI ? (
          <p className="detail-100 text-muted-foreground">
            Engineering DRI: {commitment.engineeringDRI}
          </p>
        ) : null}

        <div>
          <p className="heading-400 text-foreground mb-3">
            Problem / Opportunity
          </p>
          {commitment.problem ? (
            <p className="body-200 text-foreground whitespace-pre-line">
              {commitment.problem}
            </p>
          ) : (
            <p className="body-200 text-muted-foreground">
              No problem statement captured yet.
            </p>
          )}
        </div>

        <div>
          <p className="heading-400 text-foreground mb-3">
            Design goals
          </p>
          {commitment.designGoals.length === 0 ? (
            <p className="body-200 text-muted-foreground">
              No design goals captured yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {commitment.designGoals.map((goal, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-md border border-border bg-card p-4"
                >
                  <TrellisIcon
                    name="goal"
                    size={16}
                    className="shrink-0 mt-1"
                  />
                  <p className="body-200 text-foreground">{goal}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="heading-400 text-foreground mb-3">
            User feedback
          </p>
          {commitment.feedback.length === 0 ? (
            <p className="body-200 text-muted-foreground">
              No feedback captured yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {commitment.feedback.map((q) => (
                <li
                  key={q.id}
                  className="flex gap-3 rounded-md border border-border bg-card p-4"
                >
                  <TrellisIcon
                    name="comment"
                    size={18}
                    className="shrink-0 mt-0.5"
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="body-300 text-foreground italic">
                      “{q.quote}”
                    </p>
                    <p className="detail-100 text-muted-foreground">
                      — {q.attribution}
                      {q.source ? ` · ${q.source}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="heading-400 text-foreground mb-3">
            Metrics & KPIs
          </p>
          {commitment.metrics.length === 0 ? (
            <p className="body-200 text-muted-foreground">
              No metrics captured yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {commitment.metrics.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-col gap-1 rounded-md border border-border bg-card p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="heading-100 text-foreground">{m.label}</p>
                    {m.value ? (
                      <p className="heading-200 text-foreground tabular-nums">
                        {m.value}
                      </p>
                    ) : null}
                  </div>
                  {m.target ? (
                    <p className="detail-100 text-muted-foreground">
                      Target: {m.target}
                    </p>
                  ) : null}
                  {m.description ? (
                    <p className="body-100 text-muted-foreground">
                      {m.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <IterationsSection iterations={iterations} inline />
      </div>
    </Section>
  );
};

const CyclePage = () => {
  const { cycleSlug } = useParams<{ cycleSlug: string }>();
  const cycle = getCycle(cycleSlug);
  const scrollRef = useRef<HTMLElement | null>(null);

  if (!cycle) return <Navigate to="/" replace />;

  const prototypePath = `/${cycle.slug}${cycle.hero.prototypeEntryPath ?? "/summary"}`;

  const sections: FloatingNavSection[] = [
    { id: "hero", label: "Overview", icon: "home" },
    ...cycle.commitments.map<FloatingNavSection>((c) => ({
      id: commitmentSectionId(c.id),
      label: c.title,
      icon: "goal",
    })),
  ];

  const iterationsByCommitment = new Map<string, IterationEntry[]>();
  for (const entry of cycle.iterations) {
    const key = entry.commitment ?? "__untagged";
    const list = iterationsByCommitment.get(key) ?? [];
    list.push(entry);
    iterationsByCommitment.set(key, list);
  }

  return (
    <div className="about-doc h-screen overflow-hidden bg-background text-foreground">
      <FloatingNav sections={sections} scrollRoot={scrollRef} />
      <main
        ref={scrollRef}
        className="h-full overflow-y-auto bg-white px-6 md:px-12 py-10"
      >
        <div className="md:max-w-3xl mx-auto">
            <header
              id="hero"
              className="scroll-mt-12 pt-4 pb-16 border-b border-border"
              aria-labelledby="hero-heading"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Link
                    to="/"
                    className="detail-100 text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <TrellisIcon name="left" size={12} />
                    Team home
                  </Link>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h1
                    id="hero-heading"
                    className="heading-1000 text-foreground tracking-tight"
                  >
                    {cycle.label}
                  </h1>
                  {formatCycleDates(cycle.dateRange) ? (
                    <p className="body-300 text-muted-foreground">
                      {formatCycleDates(cycle.dateRange)}
                    </p>
                  ) : null}
                </div>

                {cycle.hero.image ? (
                  <figure className="w-full overflow-hidden rounded-lg border border-border shadow-200 bg-card">
                    <img
                      src={cycle.hero.image.src}
                      alt={cycle.hero.image.alt}
                      className="w-full h-auto block"
                      loading="eager"
                    />
                  </figure>
                ) : null}

                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild variant="primary" size="medium">
                    <Link to={prototypePath}>Open prototype</Link>
                  </Button>
                </div>

                <Card className="w-full mt-4">
                  <CardContent className="p-4 flex items-center gap-3">
                    <TrellisIcon name="contact" size={16} className="shrink-0" />
                    <div className="flex flex-col gap-0.5 min-w-0 text-left">
                      <p className="heading-50 text-muted-foreground uppercase tracking-wide">
                        Primary persona
                      </p>
                      <p className="body-100 text-foreground">
                        {cycle.primaryPersona.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {cycle.commitments.length > 0 ? (
                  <div className="w-full text-left mt-2">
                    <p className="heading-50 text-muted-foreground uppercase tracking-wide mb-2">
                      Commitments this cycle · {cycle.commitments.length}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {cycle.commitments.map((c) => (
                        <li key={c.id}>
                          <a
                            href={`#${commitmentSectionId(c.id)}`}
                            className="block group"
                          >
                            <Card className="transition-colors group-hover:border-border-hover">
                              <CardContent className="p-3 flex items-start gap-3">
                                <TrellisIcon
                                  name="goal"
                                  size={14}
                                  className="shrink-0 mt-1"
                                />
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <p className="heading-100 text-foreground group-hover:text-text-interactive transition-colors">
                                    {c.title}
                                  </p>
                                  {c.summary ? (
                                    <p className="body-100 text-muted-foreground">
                                      {c.summary}
                                    </p>
                                  ) : null}
                                </div>
                              </CardContent>
                            </Card>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </header>

            {cycle.commitments.length === 0 ? (
              <Section
                id="commitment-none"
                title="Commitments"
                description="No commitments scoped yet. Add one in src/data/cycles/<slug>.ts."
              >
                <p className="body-200 text-muted-foreground">
                  Each commitment is a feature with its own problem, design
                  goals, feedback, and KPIs.
                </p>
              </Section>
            ) : (
              cycle.commitments.map((c) => (
                <CommitmentSection
                  key={c.id}
                  commitment={c}
                  iterations={iterationsByCommitment.get(c.id) ?? []}
                />
              ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CyclePage;
