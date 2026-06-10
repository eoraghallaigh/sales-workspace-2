// Intent-signal catalog, types, and per-signal popover detail.
//
// One source of truth for every intent signal shown across the workspace
// (card / table / list views, the strategy page, and the contact sidebar).
// A signal INSTANCE is just an id plus optional authored detail; the chip
// resolves its label, colour, and — when detail isn't authored inline —
// a seeded, record-specific detail body for the hover popover.

export type SignalLevel = "company" | "contact";

// Colours map to the existing Tag variants (intentionally reused; some
// colours repeat across signals).
export type SignalVariant = "green" | "blue" | "yellow" | "orange" | "neutral";

export type SignalId =
  // company-level
  | "new-hire"
  | "funding-round"
  | "hiring-surge"
  | "tech-stack-change"
  | "former-customer"
  // contact-level
  | "viewed-pricing"
  | "past-hubspot-user"
  | "recent-ql"
  | "attended-webinar"
  | "recent-hire";

export interface SignalDef {
  id: SignalId;
  level: SignalLevel;
  label: string;
  variant: SignalVariant;
  // One-line lead-in shown under the popover title.
  summary: string;
}

// A label/value row inside the popover body.
export interface SignalDetailRow {
  label: string;
  value: string;
}

// The resolved content of a signal's hover popover.
export interface SignalDetail {
  headline?: string;
  rows: SignalDetailRow[];
  footnote?: string;
}

// A signal attached to a company or contact. `detail` overrides the
// resolver when authored inline (used for hero records).
export interface SignalInstance {
  id: SignalId;
  detail?: SignalDetail;
}

// Context passed from a render site so generated detail can vary by record.
export interface SignalOwner {
  kind: SignalLevel;
  id: string;
  name: string;
  role?: string;
  companyName?: string;
}

export const SIGNAL_CATALOG: Record<SignalId, SignalDef> = {
  "new-hire": {
    id: "new-hire",
    level: "company",
    label: "New hire",
    variant: "blue",
    summary: "A senior leader recently joined — new mandates often unlock new budget.",
  },
  "funding-round": {
    id: "funding-round",
    level: "company",
    label: "Funding round",
    variant: "green",
    summary: "Fresh capital raised — likely investing in new tooling and headcount.",
  },
  "hiring-surge": {
    id: "hiring-surge",
    level: "company",
    label: "Hiring surge",
    variant: "orange",
    summary: "Rapid headcount growth signals expansion and new initiatives.",
  },
  "tech-stack-change": {
    id: "tech-stack-change",
    level: "company",
    label: "Tech stack change",
    variant: "yellow",
    summary: "A recent tooling change can open a replacement window.",
  },
  "former-customer": {
    id: "former-customer",
    level: "company",
    label: "Former customer",
    variant: "green",
    summary: "This company used HubSpot before — warm history to reopen.",
  },
  "viewed-pricing": {
    id: "viewed-pricing",
    level: "contact",
    label: "Viewed pricing page",
    variant: "orange",
    summary: "Active buying research — they've been reading pricing.",
  },
  "past-hubspot-user": {
    id: "past-hubspot-user",
    level: "contact",
    label: "Past HubSpot user",
    variant: "green",
    summary: "Knows the product from a previous company.",
  },
  "recent-ql": {
    id: "recent-ql",
    level: "contact",
    label: "Recent QL",
    variant: "yellow",
    summary: "Crossed the qualification threshold recently.",
  },
  "attended-webinar": {
    id: "attended-webinar",
    level: "contact",
    label: "Attended webinar",
    variant: "blue",
    summary: "Engaged with our content live.",
  },
  "recent-hire": {
    id: "recent-hire",
    level: "contact",
    label: "Recent hire",
    variant: "blue",
    summary: "New in seat — often re-evaluating tools and vendors.",
  },
};

export const getSignalDef = (id: SignalId): SignalDef | undefined => SIGNAL_CATALOG[id];

export const COMPANY_SIGNAL_IDS = (Object.keys(SIGNAL_CATALOG) as SignalId[]).filter(
  (id) => SIGNAL_CATALOG[id].level === "company",
);
export const CONTACT_SIGNAL_IDS = (Object.keys(SIGNAL_CATALOG) as SignalId[]).filter(
  (id) => SIGNAL_CATALOG[id].level === "contact",
);

// --- Deterministic, record-specific detail generation -----------------------
// No Math.random: detail is seeded from the owner id + signal id so a given
// record always renders the same plausible specifics.

const hashSeed = (input: string): number => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const pick = <T>(arr: T[], seed: number, salt = 0): T => arr[(seed + salt) % arr.length];

const EXEC_NAMES = ["Dana Whitfield", "Marcus Bell", "Priya Anand", "Tomás Rivera", "Helen Choi"];
const EXEC_ROLES = ["Chief Revenue Officer", "VP of Marketing", "Chief Marketing Officer", "VP of Sales", "Head of Growth"];
const PREV_COMPANIES = ["Datadog", "Zendesk", "Gong", "Segment", "Asana", "Notion", "Klaviyo", "Ramp"];
const HIRE_DATES = ["3 weeks ago", "last month", "6 weeks ago", "in May 2026", "2 months ago"];

const FUNDING_ROUNDS = ["Series A", "Series B", "Series C", "Seed extension", "Series B"];
const FUNDING_AMOUNTS = ["$12M", "$28M", "$40M", "$65M", "$110M"];
const FUNDING_INVESTORS = ["Accel", "Sequoia", "Insight Partners", "a16z", "Bessemer"];
const FUNDING_DATES = ["12 Mar 2026", "28 Apr 2026", "2 Feb 2026", "19 May 2026", "8 Jan 2026"];

const SURGE_DEPTS = ["Sales", "Engineering", "Marketing", "Customer Success", "Revenue Operations"];
const SURGE_COUNTS = ["18", "24", "31", "42", "57"];
const SURGE_PCTS = ["32%", "45%", "60%", "28%", "51%"];

const TECH_PAIRS: Array<{ added: string; replaced: string; category: string }> = [
  { added: "Salesforce", replaced: "a legacy CRM", category: "CRM" },
  { added: "Marketo", replaced: "Pardot", category: "Marketing automation" },
  { added: "Outreach", replaced: "manual sequences", category: "Sales engagement" },
  { added: "Segment", replaced: "in-house tracking", category: "Customer data" },
  { added: "Intercom", replaced: "Zendesk", category: "Support" },
];
const TECH_DATES = ["detected this month", "detected 3 weeks ago", "detected in April 2026", "detected last quarter"];

const CUSTOMER_PRODUCTS = ["Marketing Hub", "Sales Hub", "Service Hub", "Starter CRM"];
const CUSTOMER_PERIODS = ["2021–2023", "2020–2022", "2019–2024", "for 18 months"];
const CUSTOMER_REASONS = ["downgraded during a cost review", "switched at renewal", "paused after a reorg", "outgrew the Starter tier"];

const PRICING_VIEWS = ["4", "6", "8", "11"];
const PRICING_WHEN = ["today", "2 days ago", "yesterday", "last week"];
const PRICING_PAGES = ["Pricing, Plans comparison", "Pricing, Sales Hub", "Pricing, add-ons", "Pricing, Enterprise"];

const HUBS = ["Marketing Hub", "Sales Hub", "Service Hub", "Operations Hub"];
const HUB_YEARS = ["2 years ago", "in a 2022 role", "at their last company", "earlier in their career"];

const QL_TRIGGERS = ["Requested a demo", "Started a free trial", "Submitted a contact-sales form", "Downloaded a pricing guide"];
const QL_DATES = ["2 days ago", "this morning", "yesterday", "4 days ago"];

const WEBINAR_TITLES = [
  "Scaling Outbound in 2026",
  "AI for Revenue Teams",
  "The Modern Prospecting Playbook",
  "Building a Repeatable Pipeline Engine",
  "From Lead to Closed-Won",
];
const WEBINAR_DATES = ["14 May 2026", "2 Apr 2026", "27 Mar 2026", "9 May 2026"];

const generateDetail = (id: SignalId, owner?: SignalOwner): SignalDetail => {
  const seed = hashSeed(`${owner?.id ?? "x"}:${id}`);
  switch (id) {
    case "new-hire": {
      const name = pick(EXEC_NAMES, seed);
      const role = pick(EXEC_ROLES, seed, 1);
      return {
        headline: `${name} joined as ${role}`,
        rows: [
          { label: "Joined", value: pick(HIRE_DATES, seed, 2) },
          { label: "Role", value: role },
          { label: "Previously at", value: pick(PREV_COMPANIES, seed, 3) },
        ],
        footnote: "Source: LinkedIn",
      };
    }
    case "funding-round": {
      const round = pick(FUNDING_ROUNDS, seed);
      const amount = pick(FUNDING_AMOUNTS, seed, 1);
      return {
        headline: `Raised ${amount} ${round}`,
        rows: [
          { label: "Round", value: round },
          { label: "Amount", value: amount },
          { label: "Announced", value: pick(FUNDING_DATES, seed, 2) },
          { label: "Lead investor", value: pick(FUNDING_INVESTORS, seed, 3) },
        ],
        footnote: "Source: Crunchbase",
      };
    }
    case "hiring-surge": {
      const count = pick(SURGE_COUNTS, seed);
      const dept = pick(SURGE_DEPTS, seed, 1);
      const pct = pick(SURGE_PCTS, seed, 2);
      return {
        headline: `${count} open roles, up ${pct} this quarter`,
        rows: [
          { label: "Open roles", value: count },
          { label: "Concentrated in", value: dept },
          { label: "Trend", value: `+${pct} vs. last quarter` },
        ],
        footnote: "Source: job listings",
      };
    }
    case "tech-stack-change": {
      const pair = pick(TECH_PAIRS, seed);
      return {
        headline: `Adopted ${pair.added}, replacing ${pair.replaced}`,
        rows: [
          { label: "Added", value: pair.added },
          { label: "Replaced", value: pair.replaced },
          { label: "Category", value: pair.category },
          { label: "When", value: pick(TECH_DATES, seed, 1) },
        ],
        footnote: "Source: BuiltWith",
      };
    }
    case "former-customer": {
      const product = pick(CUSTOMER_PRODUCTS, seed);
      return {
        headline: `Previously a ${product} customer`,
        rows: [
          { label: "Product", value: product },
          { label: "Active", value: pick(CUSTOMER_PERIODS, seed, 1) },
          { label: "Churned", value: pick(CUSTOMER_REASONS, seed, 2) },
        ],
        footnote: "Source: CRM history",
      };
    }
    case "viewed-pricing": {
      const views = pick(PRICING_VIEWS, seed);
      return {
        headline: `Viewed pricing ${views} times`,
        rows: [
          { label: "Views", value: views },
          { label: "Last viewed", value: pick(PRICING_WHEN, seed, 1) },
          { label: "Pages", value: pick(PRICING_PAGES, seed, 2) },
        ],
        footnote: "Source: web analytics",
      };
    }
    case "past-hubspot-user": {
      const hub = pick(HUBS, seed);
      return {
        headline: `Used ${hub} ${pick(HUB_YEARS, seed, 1)}`,
        rows: [
          { label: "Product", value: hub },
          { label: "When", value: pick(HUB_YEARS, seed, 1) },
          { label: "Previously at", value: pick(PREV_COMPANIES, seed, 2) },
        ],
        footnote: "Source: product history",
      };
    }
    case "recent-ql": {
      const trigger = pick(QL_TRIGGERS, seed);
      return {
        headline: trigger,
        rows: [
          { label: "Trigger", value: trigger },
          { label: "Occurred", value: pick(QL_DATES, seed, 1) },
        ],
        footnote: "Marketing-qualified lead",
      };
    }
    case "attended-webinar": {
      const title = pick(WEBINAR_TITLES, seed);
      return {
        headline: `Attended "${title}"`,
        rows: [
          { label: "Webinar", value: title },
          { label: "Date", value: pick(WEBINAR_DATES, seed, 1) },
        ],
        footnote: "Source: webinar registration",
      };
    }
    case "recent-hire": {
      const role = owner?.role ?? pick(EXEC_ROLES, seed);
      return {
        headline: `Joined as ${role}`,
        rows: [
          { label: "Role", value: role },
          { label: "Joined", value: pick(HIRE_DATES, seed, 1) },
          { label: "Previously at", value: pick(PREV_COMPANIES, seed, 2) },
        ],
        footnote: "Source: LinkedIn",
      };
    }
    default:
      return { rows: [] };
  }
};

// Resolve a signal's popover detail: authored inline detail wins, otherwise
// generate record-specific detail from the owner context.
export const resolveSignalDetail = (
  signal: SignalInstance,
  owner?: SignalOwner,
): SignalDetail => signal.detail ?? generateDetail(signal.id, owner);

// Helper for terse data definitions: `sig("recent-hire")` or with detail.
export const sig = (id: SignalId, detail?: SignalDetail): SignalInstance => ({ id, detail });
