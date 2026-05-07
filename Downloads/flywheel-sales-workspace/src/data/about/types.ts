export type IterationId = string;

export type AudienceTag =
  | "internal"
  | "pm"
  | "eng"
  | "exec"
  | "customer"
  | "research-participant"
  | (string & {});

export type StatusBadgeVariant =
  | "status-blue"
  | "status-green"
  | "status-orange"
  | "status-yellow"
  | "status-gray";

export interface ProjectMilestone {
  label: string;
  date: string;
}

export interface ProjectMeta {
  name: string;
  tagline: string;
  status: {
    label: string;
    badgeVariant: StatusBadgeVariant;
    milestones: ProjectMilestone[];
  };
  prototypeHref: string;
  northStar: string;
  primaryPersona: { name: string; href?: string };
  heroImage?: { src: string; alt: string };
}

export interface OpenQuestion {
  id: string;
  question: string;
  needsInputFrom?: string[];
  postedAt?: string;
}

export interface IterationScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface IterationEntry {
  id: IterationId;
  date: string;
  label: string;
  whatChanged: string;
  why: string;
  shownTo?: AudienceTag[];
  screenshots: IterationScreenshot[];
  prUrl?: string;
  commitSha?: string;
  relatedDecisionIds?: string[];
  pinnedQuoteIds?: string[];
}

export type LinkCategory =
  | "spec"
  | "tracking"
  | "research"
  | "design"
  | "comms";

export interface ProjectLink {
  id: string;
  label: string;
  href: string;
  category?: LinkCategory;
  description?: string;
}

export interface Decision {
  id: string;
  date: string;
  title: string;
  rationale: string;
  alternatives?: string[];
  relatedIterationIds?: IterationId[];
}

export interface ResearchQuote {
  id: string;
  quote: string;
  attribution: string;
  source?: string;
  tags?: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  org?: string;
  involvement?: string;
}
