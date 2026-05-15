import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { MarkdownDoc } from "@/components/about/MarkdownDoc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { cn } from "@/lib/utils";
import { cycles } from "@/data/cycles";

import businessGoalsMd from "../../../../docs/business-goals.md?raw";
import customerFeedbackMd from "../../../../docs/customer-feedback.md?raw";
import metricsMd from "../../../../docs/metrics.md?raw";
import personasMd from "../../../../docs/personas.md?raw";
import designPrinciplesMd from "../../../../docs/design-principles.md?raw";

const TEAM_NAME = "Flywheel Prospecting";
const TEAM_MISSION =
  "Help HubSpot reps prospect as efficiently as possible — and grow pipeline dollars per rep.";

type TeamMember = {
  name: string;
  role: string;
  initials: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  { name: "Eoin Ó Raghallaigh", role: "Research / Design", initials: "EO" },
  { name: "PM Name", role: "Product Manager", initials: "PM" },
  { name: "Eng Lead", role: "Tech Lead", initials: "TL" },
  { name: "Engineer", role: "Engineer", initials: "E1" },
  { name: "Engineer", role: "Engineer", initials: "E2" },
];

type QuickLink = {
  label: string;
  description: string;
  href: string;
};

const QUICK_LINKS: QuickLink[] = [
  {
    label: "Asana project",
    description: "Tasks, deadlines, dependencies",
    href: "#",
  },
  {
    label: "Slack channel",
    description: "#flywheel-prospecting",
    href: "#",
  },
  {
    label: "Figma file",
    description: "Working designs and explorations",
    href: "#",
  },
  {
    label: "GitHub repo",
    description: "Prototype source",
    href: "https://github.com/eoraghallaigh/sales-workspace-2",
  },
];

const formatDateRange = (range?: { start: string; end?: string }) => {
  if (!range) return null;
  const start = new Date(range.start).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  if (!range.end) return start;
  const end = new Date(range.end).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${start} – ${end}`;
};

type TileCardProps = {
  id: string;
  title: string;
  preview: string;
  side: "left" | "right";
  children: ReactNode;
};

const MODAL_EASE = [0.16, 1, 0.3, 1] as const;
const OPEN_DURATION = 0.32;
const CLOSE_DURATION = 0.22;
const BACKDROP_OPEN = 0.28;
const BACKDROP_CLOSE = 0.18;
const CONTENT_FADE = 0.16;

const TileCard = ({ id, title, preview, side, children }: TileCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const layoutId = `tile-${id}`;
  const hoverX = side === "left" ? 4 : -4;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <section
        id={id}
        aria-labelledby={`${id}-heading`}
        className="scroll-mt-12"
      >
        <motion.button
          layoutId={layoutId}
          type="button"
          onClick={() => setIsOpen(true)}
          whileHover={{
            y: -4,
            x: hoverX,
            transition: { duration: 0.18, ease: MODAL_EASE },
          }}
          style={{ borderRadius: 8 }}
          transition={{ duration: CLOSE_DURATION, ease: MODAL_EASE }}
          className={cn(
            "group w-full border border-border bg-card shadow-100",
            "flex items-start justify-between gap-3 px-6 py-5 text-left",
            "hover:shadow-300 transition-shadow duration-200",
            isOpen && "invisible",
          )}
        >
          <div className="flex flex-col gap-1 min-w-0">
            <h2 id={`${id}-heading`} className="heading-400 text-foreground">
              {title}
            </h2>
            <p className="body-100 text-muted-foreground line-clamp-2">
              {preview}
            </p>
          </div>
          <span className="flex items-center gap-1.5 detail-100 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Expand
            <TrellisIcon name="expand" size={12} />
          </span>
        </motion.button>
      </section>

      <AnimatePresence>
        {isOpen ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{
                  opacity: 1,
                  backdropFilter: "blur(12px)",
                  transition: { duration: BACKDROP_OPEN, ease: MODAL_EASE },
                }}
                exit={{
                  opacity: 0,
                  backdropFilter: "blur(0px)",
                  transition: { duration: BACKDROP_CLOSE, ease: MODAL_EASE },
                }}
                style={{ willChange: "backdrop-filter, opacity" }}
                className="fixed inset-0 z-50 bg-background/40"
              />
            </DialogPrimitive.Overlay>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
              <DialogPrimitive.Content
                asChild
                forceMount
                aria-describedby={undefined}
              >
                <motion.div
                  layoutId={layoutId}
                  transition={{ duration: OPEN_DURATION, ease: MODAL_EASE }}
                  style={{ borderRadius: 12 }}
                  className={cn(
                    "about-doc pointer-events-auto",
                    "w-full max-w-7xl max-h-[85vh]",
                    "flex flex-col border border-border bg-card shadow-2xl",
                    "overflow-hidden focus:outline-none",
                  )}
                >
                  <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: CONTENT_FADE,
                      delay: 0.1,
                      ease: MODAL_EASE,
                    }}
                    className="flex items-start justify-between gap-4 px-8 pt-7 pb-5 border-b border-border"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <DialogPrimitive.Title className="heading-400 text-foreground">
                        {title}
                      </DialogPrimitive.Title>
                      <p className="body-100 text-muted-foreground">
                        {preview}
                      </p>
                    </div>
                    <DialogPrimitive.Close
                      className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-fill-tertiary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                  </motion.header>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        duration: CONTENT_FADE,
                        delay: 0.1,
                        ease: MODAL_EASE,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.1, ease: MODAL_EASE },
                    }}
                    className="flex-1 overflow-y-auto px-8 py-6"
                  >
                    {children}
                  </motion.div>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

const PeopleRow = () => (
  <div className="flex flex-col gap-3">
    <p className="detail-100 uppercase tracking-wider text-muted-foreground">
      Team
    </p>
    <ul className="flex flex-wrap gap-2">
      {TEAM_MEMBERS.map((member, idx) => (
        <li
          key={`${member.name}-${idx}`}
          className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fill-tertiary text-foreground detail-100 font-medium">
            {member.initials}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="body-100 text-foreground">{member.name}</span>
            <span className="detail-200 text-muted-foreground">
              {member.role}
            </span>
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const QuickLinks = () => (
  <div className="flex flex-col gap-3">
    <p className="detail-100 uppercase tracking-wider text-muted-foreground">
      Quick links
    </p>
    <ul className="flex flex-col gap-1.5">
      {QUICK_LINKS.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 hover:border-border-hover transition-colors"
          >
            <span className="flex flex-col leading-tight min-w-0">
              <span className="body-100 text-foreground group-hover:text-text-interactive transition-colors truncate">
                {link.label}
              </span>
              <span className="detail-200 text-muted-foreground truncate">
                {link.description}
              </span>
            </span>
            <TrellisIcon
              name="link"
              size={12}
              className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0"
            />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const TeamHome = () => {
  return (
    <div className="about-doc h-screen overflow-hidden bg-background text-foreground">
      <main className="h-full overflow-y-auto bg-trellis-neutral-100 px-6 md:px-10 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <header
              id="hero"
              className="scroll-mt-12 rounded-lg border border-border bg-card p-8 shadow-100"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <p className="detail-100 uppercase tracking-wider text-muted-foreground">
                    Team home
                  </p>
                  <h1 className="heading-1000 text-foreground tracking-tight">
                    {TEAM_NAME}
                  </h1>
                  <p className="body-100 text-muted-foreground">
                    {TEAM_MISSION}
                  </p>
                </div>
                <div className="lg:col-span-4">
                  <PeopleRow />
                </div>
                <div className="lg:col-span-3">
                  <QuickLinks />
                </div>
              </div>
            </header>

            <section
              id="release-cycles"
              aria-labelledby="release-cycles-heading"
              className="scroll-mt-12 rounded-lg border border-border bg-card p-6 shadow-100"
            >
              <header className="mb-4">
                <h2
                  id="release-cycles-heading"
                  className="heading-400 text-foreground"
                >
                  Release cycles
                </h2>
                <p className="body-100 text-muted-foreground mt-1">
                  6-week blocks. Open one to see its prototype, iterations, and metrics.
                </p>
              </header>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {cycles.map((cycle) => (
                  <li key={cycle.slug}>
                    <Link to={`/${cycle.slug}`} className="block group h-full">
                      <Card className="h-full shadow-100 transition-colors group-hover:border-border-hover">
                        <CardContent className="p-4 flex items-start gap-3">
                          <Badge
                            variant="outline"
                            className="detail-100 font-mono uppercase shrink-0 mt-0.5"
                          >
                            {cycle.label}
                          </Badge>
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <p className="heading-100 text-foreground group-hover:text-text-interactive transition-colors">
                              {cycle.name}
                            </p>
                            <p className="body-100 text-muted-foreground line-clamp-2">
                              {cycle.tagline}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant={cycle.status.badgeVariant}>
                                {cycle.status.label}
                              </Badge>
                              {formatDateRange(cycle.dateRange) ? (
                                <span className="detail-200 text-muted-foreground">
                                  {formatDateRange(cycle.dateRange)}
                                </span>
                              ) : null}
                              <span className="detail-200 text-muted-foreground">
                                {cycle.iterations.length} iteration
                                {cycle.iterations.length === 1 ? "" : "s"}
                              </span>
                            </div>
                          </div>
                          <TrellisIcon
                            name="right"
                            size={14}
                            className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0 mt-2"
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <TileCard
                id="business-goals"
                title="Business goals"
                preview="OKRs, target outcomes, and how this team's work ladders up to Flywheel."
                side="left"
              >
                <MarkdownDoc source={businessGoalsMd} />
              </TileCard>

              <TileCard
                id="user-research"
                title="User research"
                preview="Themes and quotes from rep interviews — what's working, what's broken, what they want next."
                side="right"
              >
                <MarkdownDoc source={customerFeedbackMd} />
              </TileCard>

              <TileCard
                id="metrics"
                title="Metrics & KPIs"
                preview="What we track for adoption, engagement, and pipeline impact."
                side="left"
              >
                <MarkdownDoc source={metricsMd} />
              </TileCard>

              <TileCard
                id="personas"
                title="Personas"
                preview="SDRs vs Growth Specialists — different jobs, different daily contexts."
                side="right"
              >
                <MarkdownDoc source={personasMd} />
              </TileCard>

              <TileCard
                id="design-principles"
                title="Design principles"
                preview="The non-negotiables we use to make UI decisions in the workspace."
                side="left"
              >
                <MarkdownDoc source={designPrinciplesMd} />
              </TileCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamHome;
