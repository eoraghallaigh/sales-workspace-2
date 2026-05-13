export type CycleSlug = string;

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

export interface CycleMilestone {
  label: string;
  date: string;
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
  // Which commitment within the cycle this iteration belongs to. Optional
  // for legacy entries; new entries written by /ship should always set it.
  commitment?: string;
}

export interface Commitment {
  id: string;
  title: string;
  // One-sentence framing shown in the section header.
  summary?: string;
  // Engineering DRI for this commitment.
  engineeringDRI?: string;
  problem: string;
  designGoals: string[];
  metrics: CycleMetric[];
  feedback: FeedbackQuote[];
}

export interface FeedbackQuote {
  id: string;
  quote: string;
  attribution: string;
  source?: string;
}

export interface CycleMetric {
  id: string;
  label: string;
  value?: string;
  target?: string;
  status?: "on-track" | "at-risk" | "off-track" | "pending";
  description?: string;
}

export interface CycleHero {
  image?: { src: string; alt: string };
  prototypeEntryPath?: string;
}

export interface Cycle {
  slug: CycleSlug;
  label: string;
  name: string;
  tagline: string;
  dateRange?: { start: string; end?: string };
  status: {
    label: string;
    badgeVariant: StatusBadgeVariant;
  };
  milestones: CycleMilestone[];
  primaryPersona: { name: string; href?: string };
  hero: CycleHero;
  commitments: Commitment[];
  iterations: IterationEntry[];
}
