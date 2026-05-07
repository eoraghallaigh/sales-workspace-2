import { Section } from "./Section";
import { Card, CardContent } from "@/components/ui/card";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { projectMeta } from "@/data/about";

export const ProjectContextSection = () => {
  const { northStar, primaryPersona } = projectMeta;

  return (
    <Section
      id="project-context"
      title="Project context"
      description="The framing this prototype is designed against."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <TrellisIcon name="goal" size={16} />
              <p className="heading-50 text-muted-foreground uppercase tracking-wide">
                North star
              </p>
            </div>
            <p className="body-200 text-foreground">{northStar}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <TrellisIcon name="contact" size={16} />
              <p className="heading-50 text-muted-foreground uppercase tracking-wide">
                Primary persona
              </p>
            </div>
            {primaryPersona.href ? (
              <a
                href={primaryPersona.href}
                target="_blank"
                rel="noopener noreferrer"
                className="body-200 text-text-interactive hover:text-text-interactive-hover"
              >
                {primaryPersona.name}
              </a>
            ) : (
              <p className="body-200 text-foreground">{primaryPersona.name}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
};
