import type { IterationEntry as IterationEntryType } from "@/data/about";

interface IterationEntryProps {
  entry: IterationEntryType;
}

export const IterationEntry = ({ entry }: IterationEntryProps) => {
  const hasScreenshots = entry.screenshots.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
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

      {entry.shownTo && entry.shownTo.length > 0 ? (
        <p className="detail-100 text-muted-foreground">
          Shown to: {entry.shownTo.join(", ")}
        </p>
      ) : null}

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
    </div>
  );
};
