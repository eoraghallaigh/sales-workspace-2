import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projectMeta, iterations } from "@/data/about";

const HERO_ROUTE_NAME = "prospecting";

const resolveHeroImage = () => {
  const latest = iterations[0];
  const fromIteration = latest?.screenshots.find((s) =>
    s.src.endsWith(`/${HERO_ROUTE_NAME}.png`),
  );
  return fromIteration ?? projectMeta.heroImage;
};

export const HeroSection = () => {
  const { name, tagline, status, prototypeHref } = projectMeta;
  const heroImage = resolveHeroImage();

  return (
    <header
      id="hero"
      className="scroll-mt-12 pt-4 pb-16 border-b border-border"
      aria-labelledby="hero-heading"
    >
      <div className="flex flex-col items-center text-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant={status.badgeVariant}>{status.label}</Badge>
          {status.milestones.map((m) => (
            <span
              key={m.label}
              className="detail-200 text-muted-foreground"
            >
              {m.label} · {m.date}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1
            id="hero-heading"
            className="heading-1000 text-foreground tracking-tight"
          >
            {name}
          </h1>
          <p className="body-300 text-muted-foreground max-w-2xl">
            {tagline}
          </p>
        </div>

        {heroImage ? (
          <figure className="w-full overflow-hidden rounded-lg border border-border shadow-200 bg-card">
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="w-full h-auto block"
              loading="eager"
            />
          </figure>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="primary" size="medium">
            <Link to={prototypeHref}>Open prototype</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
