import { useState } from "react";
import { Section } from "./Section";
import { IterationEntry } from "./IterationEntry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type {
  Commitment,
  IterationEntry as IterationEntryType,
} from "@/data/cycles";

const PAGE_SIZE = 5;

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

interface EntryHeaderProps {
  entry: IterationEntryType;
  showSummary?: boolean;
  commitmentLabel?: string;
}

const EntryHeader = ({
  entry,
  showSummary = true,
  commitmentLabel,
}: EntryHeaderProps) => (
  <div className="flex flex-1 flex-wrap items-center gap-3 text-left min-w-0">
    <span className="detail-100 text-muted-foreground tabular-nums shrink-0">
      {formatDate(entry.date)}
    </span>
    <Badge variant="outline" className="detail-100 normal-case font-mono shrink-0">
      {entry.label}
    </Badge>
    {commitmentLabel ? (
      <Badge variant="secondary" className="detail-100 shrink-0">
        {commitmentLabel}
      </Badge>
    ) : null}
    {showSummary ? (
      <span className="body-100 text-foreground line-clamp-1 min-w-0">
        {entry.whatChanged}
      </span>
    ) : null}
    {entry.prUrl ? (
      <a
        href={entry.prUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="ml-auto inline-flex items-center gap-1 detail-100 text-text-interactive hover:text-text-interactive-hover shrink-0"
      >
        <TrellisIcon name="externalLink" size={12} />
        PR
      </a>
    ) : null}
  </div>
);

interface IterationsBodyProps {
  iterations: IterationEntryType[];
  getCommitmentLabel: (entry: IterationEntryType) => string | undefined;
  emptyMessage: string;
}

const IterationsBody = ({
  iterations,
  getCommitmentLabel,
  emptyMessage,
}: IterationsBodyProps) => {
  const ordered = [...iterations].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (ordered.length === 0) {
    return <p className="body-200 text-muted-foreground">{emptyMessage}</p>;
  }

  const [latest, ...previous] = ordered;
  const visiblePrevious = previous.slice(0, visibleCount);
  const remaining = previous.length - visibleCount;
  const nextBatch = Math.min(PAGE_SIZE, remaining);

  return (
    <div className="flex flex-col gap-6">
      <article className="border border-border rounded-md bg-card p-4 flex flex-col gap-4">
        <EntryHeader
          entry={latest}
          showSummary={false}
          commitmentLabel={getCommitmentLabel(latest)}
        />
        <IterationEntry entry={latest} />
      </article>

      {previous.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h4 className="detail-100 text-muted-foreground uppercase tracking-wide">
            Previous · {previous.length}
          </h4>
          <Accordion type="multiple" className="flex flex-col gap-2">
            {visiblePrevious.map((entry) => (
              <AccordionItem
                key={entry.id}
                value={entry.id}
                className="border border-border rounded-md bg-card overflow-hidden"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <EntryHeader
                    entry={entry}
                    commitmentLabel={getCommitmentLabel(entry)}
                  />
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <IterationEntry entry={entry} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {remaining > 0 ? (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Show {nextBatch} more
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

interface IterationsSectionProps {
  iterations: IterationEntryType[];
  commitments?: Commitment[];
  // When true, render as an inline sub-section (no outer <Section>, no big
  // heading) so it can sit inside a commitment alongside Problem / Design
  // goals / User feedback / Metrics.
  inline?: boolean;
}

export const IterationsSection = ({
  iterations,
  commitments = [],
  inline = false,
}: IterationsSectionProps) => {
  // Only surface commitment labels when there's more than one — otherwise the
  // badge on every row is noise. In inline mode, the commitment is the
  // surrounding section, so labels are redundant.
  const showCommitmentLabels = !inline && commitments.length > 1;
  const commitmentTitleById = new Map(
    commitments.map((c) => [c.id, c.title]),
  );
  const getCommitmentLabel = (entry: IterationEntryType) => {
    if (!showCommitmentLabels) return undefined;
    if (!entry.commitment) return undefined;
    return commitmentTitleById.get(entry.commitment) ?? entry.commitment;
  };

  if (inline) {
    return (
      <div>
        <p className="heading-400 text-foreground mb-3">
          Iteration history
        </p>
        <IterationsBody
          iterations={iterations}
          getCommitmentLabel={getCommitmentLabel}
          emptyMessage="No iterations logged for this commitment yet."
        />
      </div>
    );
  }

  return (
    <Section
      id="iterations"
      title="Iteration history"
      description="Each entry is captured automatically when the prototype ships. Newest first."
    >
      <IterationsBody
        iterations={iterations}
        getCommitmentLabel={getCommitmentLabel}
        emptyMessage="No iterations logged yet. Run /ship to capture the first one."
      />
    </Section>
  );
};
