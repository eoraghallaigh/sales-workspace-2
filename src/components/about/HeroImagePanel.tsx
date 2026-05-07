import { projectMeta, iterations } from "@/data/about";

const HERO_ROUTE_NAME = "prospecting";

const resolveHeroImage = () => {
  const latest = iterations[0];
  const fromIteration = latest?.screenshots.find((s) =>
    s.src.endsWith(`/${HERO_ROUTE_NAME}.png`),
  );
  return fromIteration ?? projectMeta.heroImage;
};

export const HeroImagePanel = () => {
  const heroImage = resolveHeroImage();
  if (!heroImage) return null;

  return (
    <aside
      className="hidden 2xl:flex h-full bg-white px-6 py-10 items-start"
      aria-hidden="true"
    >
      <figure className="overflow-hidden rounded-lg border border-border shadow-200 bg-card w-full">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className="w-full h-auto block"
          loading="eager"
        />
      </figure>
    </aside>
  );
};
