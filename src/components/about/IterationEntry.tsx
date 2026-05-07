import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import type { IterationEntry as IterationEntryType } from "@/data/about";

interface IterationEntryProps {
  entry: IterationEntryType;
}

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

export const IterationEntry = ({ entry }: IterationEntryProps) => {
  const hasScreenshots = entry.screenshots.length > 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="detail-100 text-muted-foreground tabular-nums">
            {formatDate(entry.date)}
          </span>
          <Badge variant="outline" className="detail-100 normal-case font-mono">
            {entry.label}
          </Badge>
          {entry.shownTo?.map((tag) => (
            <Badge key={tag} variant="secondary" className="detail-100">
              shown to {tag}
            </Badge>
          ))}
          {entry.prUrl ? (
            <a
              href={entry.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 detail-100 text-text-interactive hover:text-text-interactive-hover"
            >
              <TrellisIcon name="externalLink" size={12} />
              View PR
            </a>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div>
            <p className="heading-50 text-muted-foreground uppercase tracking-wide mb-1">
              What changed
            </p>
            <p className="body-200 text-foreground">{entry.whatChanged}</p>
          </div>
          <div>
            <p className="heading-50 text-muted-foreground uppercase tracking-wide mb-1">
              Why
            </p>
            <p className="body-200 text-foreground">{entry.why}</p>
          </div>
        </div>

        {hasScreenshots ? (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {entry.screenshots.map((shot) => (
              <figure key={shot.src} className="flex flex-col gap-1">
                <a
                  href={shot.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md overflow-hidden border border-border bg-card hover:border-border-hover transition-colors"
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </a>
                {shot.caption ? (
                  <figcaption className="detail-100 text-muted-foreground">
                    {shot.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
