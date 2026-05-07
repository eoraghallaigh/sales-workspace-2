import { Section } from "./Section";
import { Card, CardContent } from "@/components/ui/card";
import { TrellisIcon, type TrellisIconName } from "@/components/ui/trellis-icon";
import { links } from "@/data/about";
import type { LinkCategory } from "@/data/about";

const CATEGORY_ICON: Record<LinkCategory, TrellisIconName> = {
  spec: "documents",
  tracking: "approvals",
  research: "book",
  design: "edit",
  comms: "comment",
};

const CATEGORY_LABEL: Record<LinkCategory, string> = {
  spec: "Spec",
  tracking: "Tracking",
  research: "Research",
  design: "Design",
  comms: "Comms",
};

export const LinksSection = () => {
  return (
    <Section
      id="links"
      title="Links"
      description="External systems with the canonical state for this project."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => {
          const iconName: TrellisIconName = link.category
            ? CATEGORY_ICON[link.category]
            : "externalLink";
          return (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="h-full transition-colors group-hover:border-border-hover">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 rounded-md bg-fill-surface-raised p-2">
                    <TrellisIcon name={iconName} size={16} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    {link.category ? (
                      <p className="detail-100 text-muted-foreground uppercase tracking-wide">
                        {CATEGORY_LABEL[link.category]}
                      </p>
                    ) : null}
                    <p className="heading-100 text-foreground group-hover:text-text-interactive transition-colors truncate">
                      {link.label}
                    </p>
                    {link.description ? (
                      <p className="body-100 text-muted-foreground">
                        {link.description}
                      </p>
                    ) : null}
                  </div>
                  <TrellisIcon
                    name="externalLink"
                    size={14}
                    className="ml-auto mt-1 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </Section>
  );
};
