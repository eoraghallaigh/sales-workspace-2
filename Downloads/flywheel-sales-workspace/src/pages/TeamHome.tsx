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
  role?: string;
  initials: string;
  photoUrl?: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Martina Locke",
    role: "Senior Product Manager",
    initials: "ML",
    photoUrl:
      "https://avatars.slack-edge.com/2026-04-10/10883998149862_7f54331f9bb21fcc2cf7_original.png",
  },
  {
    name: "Eoin Ó Raghallaigh",
    role: "Senior Product Designer II",
    initials: "EÓ",
    photoUrl:
      "https://avatars.slack-edge.com/2022-07-12/3791072922083_4f54cb10ee87e1db35bb_original.jpg",
  },
  {
    name: "Conor McDonald",
    role: "Technical Lead",
    initials: "CM",
    photoUrl:
      "https://avatars.slack-edge.com/2026-01-29/10401076136482_072003633f8c08e708be_original.jpg",
  },
  {
    name: "Alicia Chui",
    role: "Engineering Lead",
    initials: "AC",
    photoUrl:
      "https://avatars.slack-edge.com/2015-12-24/17361959680_2e2bba0fe9310f7008c9_original.jpg",
  },
  {
    name: "Anirudha Simha",
    role: "Senior Software Engineer II",
    initials: "AS",
    photoUrl:
      "https://avatars.slack-edge.com/2026-04-01/10824215373027_f061c7b5715934a28289_original.jpg",
  },
  {
    name: "Andy Lee",
    role: "Software Engineer",
    initials: "AL",
    photoUrl:
      "https://avatars.slack-edge.com/2020-12-09/1567868339204_e6e6a624af02a4c4a3e3_original.jpg",
  },
  {
    name: "Blaise Bowman",
    role: "Senior Software Engineer II",
    initials: "BB",
    photoUrl:
      "https://avatars.slack-edge.com/2023-10-02/5978035178386_cdd7052064000f7342a2_original.jpg",
  },
  {
    name: "Cameron Hutton-Brown",
    role: "Senior Software Engineer I",
    initials: "CH",
    photoUrl:
      "https://avatars.slack-edge.com/2026-04-01/10829142341906_a58e54e5cd7b2b39f12c_original.png",
  },
  {
    name: "Marc Fernandez Veiga",
    role: "Senior Software Engineer I",
    initials: "MV",
    photoUrl:
      "https://avatars.slack-edge.com/2026-04-08/10899556569328_459544cfc5e07910c746_original.jpg",
  },
  {
    name: "Nate Renner",
    role: "Senior Software Engineer II",
    initials: "NR",
    photoUrl:
      "https://avatars.slack-edge.com/2025-06-03/9005198659249_1857705b62cea78dc6d0_original.jpg",
  },
  {
    name: "Thiago de Andrade Feliciano",
    role: "Senior Software Engineer II, Frontend",
    initials: "TF",
    photoUrl:
      "https://avatars.slack-edge.com/2026-03-30/10792171495831_410e9480c64c64778d9f_original.png",
  },
  {
    name: "Iris Wang",
    role: "Software Engineer",
    initials: "IW",
    photoUrl:
      "https://avatars.slack-edge.com/2026-04-02/10862752782752_7ee3819650ea9daa2380_original.jpg",
  },
  {
    name: "Rumeza Fatima",
    role: "Software Engineer Intern",
    initials: "RF",
    photoUrl:
      "https://avatars.slack-edge.com/2026-05-19/11165656350513_9d7b47f8014df5057f61_original.png",
  },
];

type QuickLinkIcon = "asana" | "slack" | "github";

type QuickLink = {
  label: string;
  description: string;
  href: string;
  icon: QuickLinkIcon;
};

const QUICK_LINKS: QuickLink[] = [
  {
    label: "Asana project",
    description: "Tasks, deadlines, dependencies",
    href: "#",
    icon: "asana",
  },
  {
    label: "Slack channel",
    description: "#flywheel-prospecting",
    href: "https://hubspot.enterprise.slack.com/archives/C09K1PVGZ2R",
    icon: "slack",
  },
  {
    label: "GitHub repo",
    description: "Prototype source",
    href: "https://github.com/eoraghallaigh/sales-workspace-2",
    icon: "github",
  },
];

type BrandLogoProps = { className?: string };

const AsanaLogo = ({ className }: BrandLogoProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <circle cx="12" cy="5.5" r="4" fill="#F06A6A" />
    <circle cx="5.4" cy="16.5" r="4" fill="#F06A6A" />
    <circle cx="18.6" cy="16.5" r="4" fill="#F06A6A" />
  </svg>
);

const SlackLogo = ({ className }: BrandLogoProps) => (
  <svg viewBox="0 0 122.8 122.8" aria-hidden="true" className={className}>
    <path
      d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z"
      fill="#E01E5A"
    />
    <path
      d="M32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
      fill="#E01E5A"
    />
    <path
      d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2z"
      fill="#36C5F0"
    />
    <path
      d="M45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
      fill="#36C5F0"
    />
    <path
      d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z"
      fill="#2EB67D"
    />
    <path
      d="M90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
      fill="#2EB67D"
    />
    <path
      d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9z"
      fill="#ECB22E"
    />
    <path
      d="M77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
      fill="#ECB22E"
    />
  </svg>
);

const GitHubLogo = ({ className }: BrandLogoProps) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const QUICK_LINK_LOGOS: Record<QuickLinkIcon, (props: BrandLogoProps) => ReactNode> = {
  asana: AsanaLogo,
  slack: SlackLogo,
  github: GitHubLogo,
};

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

type CycleStatus = "Current" | "Upcoming" | "Past";

const getCycleStatus = (range?: {
  start: string;
  end?: string;
}): CycleStatus => {
  if (!range) return "Current";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(range.start);
  if (today < start) return "Upcoming";
  if (range.end) {
    const end = new Date(range.end);
    if (today > end) return "Past";
  }
  return "Current";
};

const CYCLE_STATUS_VARIANT: Record<
  CycleStatus,
  "status-green" | "status-blue" | "status-gray"
> = {
  Current: "status-green",
  Upcoming: "status-blue",
  Past: "status-gray",
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
    <ul className="flex flex-wrap justify-evenly gap-2">
      {TEAM_MEMBERS.map((member, idx) => (
        <li
          key={`${member.name}-${idx}`}
          className="flex flex-col items-center justify-center gap-2 rounded-md border-0 bg-[var(--color-fill-surface-default)] px-2.5 py-1.5"
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt=""
              loading="lazy"
              className="h-[80px] w-[80px] shrink-0 rounded-full object-cover bg-fill-tertiary"
            />
          ) : (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fill-tertiary text-foreground detail-100 font-medium">
              {member.initials}
            </span>
          )}
          <span className="flex flex-col leading-tight">
            <span className="body-100 text-foreground flex justify-center items-stretch">{member.name}</span>
            {member.role ? (
              <span className="detail-200 text-muted-foreground">
                {member.role}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const QuickLinks = () => (
  <div className="flex flex-col items-center justify-center gap-3">
    <p className="detail-100 uppercase tracking-wider text-muted-foreground">
      Quick links
    </p>
    <ul className="flex flex-row justify-start gap-4">
      {QUICK_LINKS.map((link) => {
        const Logo = QUICK_LINK_LOGOS[link.icon];
        return (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between gap-3 rounded-md border border-border bg-[var(--color-fill-surface-default)] px-3 py-2 hover:border-border-hover transition-colors"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Logo className="h-4 w-4 shrink-0" />
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="body-100 text-foreground group-hover:text-text-interactive transition-colors truncate">
                    {link.label}
                  </span>
                  <span className="detail-200 text-muted-foreground truncate">
                    {link.description}
                  </span>
                </span>
              </span>
              <TrellisIcon
                name="link"
                size={12}
                className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </a>
          </li>
        );
      })}
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
              <div className="flex flex-col gap-16">
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <h1 className="heading-1000 text-foreground tracking-tight flex justify-center">
                    {TEAM_NAME}
                  </h1>
                  <p className="body-100 text-muted-foreground flex justify-center">
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
                {cycles.map((cycle) => {
                  const status = getCycleStatus(cycle.dateRange);
                  const dateRangeText = formatDateRange(cycle.dateRange);
                  return (
                    <li key={cycle.slug}>
                      <Link to={`/${cycle.slug}`} className="block group h-full">
                        <Card className="h-full shadow-100 transition-colors group-hover:border-border-hover">
                          <CardContent className="p-4 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <p className="heading-300 text-foreground group-hover:text-text-interactive transition-colors">
                                  {cycle.label}
                                </p>
                                {dateRangeText ? (
                                  <p className="body-100 text-muted-foreground">
                                    {dateRangeText}
                                  </p>
                                ) : null}
                              </div>
                              <Badge
                                variant={CYCLE_STATUS_VARIANT[status]}
                                className="shrink-0"
                              >
                                {status}
                              </Badge>
                            </div>
                            {cycle.commitments.length > 0 ? (
                              <ul className="body-100 text-foreground flex flex-col gap-1 list-disc pl-5">
                                {cycle.commitments.map((c) => (
                                  <li key={c.id}>{c.title}</li>
                                ))}
                              </ul>
                            ) : null}
                          </CardContent>
                        </Card>
                      </Link>
                    </li>
                  );
                })}
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
