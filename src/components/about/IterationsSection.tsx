import { Section } from "./Section";
import { IterationEntry } from "./IterationEntry";
import { iterations } from "@/data/about";

export const IterationsSection = () => {
  const ordered = [...iterations].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <Section
      id="iterations"
      title="Iteration history"
      description="Each entry is captured automatically when the prototype ships. Newest first."
    >
      {ordered.length === 0 ? (
        <p className="body-200 text-muted-foreground">
          No iterations logged yet. Run /ship to capture the first one.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {ordered.map((entry) => (
            <IterationEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </Section>
  );
};
