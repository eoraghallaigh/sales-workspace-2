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
import { iterations, type IterationEntry as IterationEntryType } from "@/data/about";

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
}

const EntryHeader = ({ entry, showSummary = true }: EntryHeaderProps) => (
  <div className="flex flex-1 flex-wrap items-center gap-3 text-left min-w-0">
    <span className="detail-100 text-muted-foreground tabular-nums shrink-0">
      {formatDate(entry.date)}
    </span>
    <Badge variant="outline" className="detail-100 normal-case font-mono shrink-0">
      {entry.label}
    </Badge>
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

export const IterationsSection = () => {
  const ordered = [...iterations].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  if (ordered.length === 0) {
    return (
      <Section
        id="iterations"
        title="Iteration history"
        description="Each entry is captured automatically when the prototype ships. Newest first."
      >
        <p className="body-200 text-muted-foreground">
          No iterations logged yet. Run /ship to capture the first one.
        </p>
      </Section>
    );
  }

  const [latest, ...previous] = ordered;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visiblePrevious = previous.slice(0, visibleCount);
  const remaining = previous.length - visibleCount;
  const nextBatch = Math.min(PAGE_SIZE, remaining);

  return (
    <Section
      id="iterations"
      title="Iteration history"
      description="Each entry is captured automatically when the prototype ships. Newest first."
    >
      <div className="flex flex-col gap-6">
        {/* Latest iteration — always visible, not collapsed */}
        <article className="border border-border rounded-md bg-card p-4 flex flex-col gap-4">
          <EntryHeader entry={latest} showSummary={false} />
          <IterationEntry entry={latest} />
        </article>

        {/* Previous iterations — collapsed accordion */}
        {previous.length > 0 ? (
          <div className="flex flex-col gap-2">
            <h3 className="heading-50 text-muted-foreground uppercase tracking-wide">
              Previous iterations · {previous.length}
            </h3>
            <Accordion
              type="multiple"
              className="flex flex-col gap-2"
            >
              {visiblePrevious.map((entry) => (
                <AccordionItem
                  key={entry.id}
                  value={entry.id}
                  className="border border-border rounded-md bg-card overflow-hidden"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <EntryHeader entry={entry} />
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
    </Section>
  );
};
