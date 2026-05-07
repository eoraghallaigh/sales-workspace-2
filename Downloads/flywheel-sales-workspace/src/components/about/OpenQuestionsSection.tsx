import { Section } from "./Section";
import { Badge } from "@/components/ui/badge";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { openQuestions } from "@/data/about";

export const OpenQuestionsSection = () => {
  return (
    <Section
      id="open-questions"
      title="Open questions"
      description="What's still being worked out. Edit src/data/about/openQuestions.ts to add or resolve."
    >
      {openQuestions.length === 0 ? (
        <p className="body-200 text-muted-foreground">
          No open questions right now.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {openQuestions.map((q) => (
            <li
              key={q.id}
              className="flex gap-3 rounded-md border border-border bg-card p-4"
            >
              <TrellisIcon
                name="question"
                size={18}
                className="shrink-0 mt-0.5"
              />
              <div className="flex flex-col gap-2 min-w-0">
                <p className="body-300 text-foreground">{q.question}</p>
                {q.needsInputFrom && q.needsInputFrom.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {q.needsInputFrom.map((mention) => (
                      <Badge
                        key={mention}
                        variant="secondary"
                        className="detail-100"
                      >
                        {mention}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};
