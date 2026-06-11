// Per-company content for the two right-rail cards on the strategy page:
// "Recent conversions" and "Hub summary". Both are derived deterministically
// (seeded on the company id, no Math.random / Date) so a company always renders
// the same values. Real data is used where it exists — the company's contacts
// and their intent signals drive conversions, and any HubSpot portal on the
// company (src/data/companyDetails.ts) seeds the hub summary — with plausible
// seeded fill-ins everywhere else.

import { companyDetails } from "@/data/companyDetails";
import { getOutreachState } from "@/data/outreachStates";
import { prospectingCompanies } from "@/data/prospectingCompanies";
import type { SignalId } from "@/data/signals";

// --- seeded helpers ----------------------------------------------------------

const hashSeed = (input: string): number => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const pick = <T>(arr: T[], seed: number, salt = 0): T => arr[(seed + salt) % arr.length];

const fmt = (n: number): string => n.toLocaleString("en-US");

// --- recent conversions ------------------------------------------------------

export interface RecentConversion {
  contactId: string;
  contactName: string;
  conversion: string;
  conversionWhen: string;
  lastTouchWhen: string;
  lastTouchBy: string;
  lastTouchAction: string;
}

// Only these signals represent an inbound conversion event worth listing.
const CONVERSION_LABELS: Partial<Record<SignalId, string>> = {
  "recent-ql": "Submitted a form",
  "viewed-pricing": "Viewed pricing page",
  "attended-webinar": "Registered for a webinar",
};

const WHEN_POOL = [
  "18 hours ago", "yesterday", "2 days ago", "3 days ago", "5 days ago",
  "last week", "2 weeks ago", "a month ago", "2 months ago",
];

const REPS = ["Darius Elmore", "Macey Montgomery", "Priya Anand", "Tom Becker", "Sofia Marsh"];

// Most recent outbound touch from the contact's outreach state, so the "Last
// touch" column stays consistent with everything else the workspace shows.
const lastTouchFromState = (
  contactId: string,
  firstName: string,
): { action: string; when: string } | null => {
  const s = getOutreachState(contactId, firstName);
  if (s.call.kind === "connected") return { action: "made a call", when: s.call.at };
  if (s.call.kind === "no-answer" || s.call.kind === "voicemail") {
    return { action: "made a call", when: s.call.lastAttemptAt };
  }
  if (s.linkedin.kind === "accepted") return { action: "connected on LinkedIn", when: s.linkedin.acceptedAt };
  if (s.linkedin.kind === "pending") return { action: "sent a LinkedIn request", when: s.linkedin.sentAt };
  if (s.sequence.kind !== "not-enrolled") {
    const sent = s.sequence.statuses.filter((x) => x.kind === "sent");
    const last = sent[sent.length - 1];
    if (last && last.kind === "sent") return { action: "sent an email", when: last.sentAt };
  }
  return null;
};

export const getRecentConversions = (companyId: string): RecentConversion[] => {
  const company = prospectingCompanies.find((c) => c.id === companyId);
  if (!company) return [];
  const rep = pick(REPS, hashSeed(companyId));

  return company.recommendedContacts
    .map((c): RecentConversion | null => {
      const convSignal = c.signals.find((s) => CONVERSION_LABELS[s.id]);
      if (!convSignal) return null;
      const seed = hashSeed(c.id);
      const label =
        convSignal.id === "recent-ql" && c.qlData?.requestType
          ? c.qlData.requestType
          : CONVERSION_LABELS[convSignal.id]!;
      const touch = lastTouchFromState(c.id, c.name.split(" ")[0]);
      return {
        contactId: c.id,
        contactName: c.name,
        conversion: label,
        conversionWhen: pick(WHEN_POOL, seed, 2),
        lastTouchWhen: touch?.when ?? pick(WHEN_POOL, seed, 5),
        lastTouchBy: rep,
        lastTouchAction: touch?.action ?? "added to a sequence",
      };
    })
    .filter((x): x is RecentConversion => x !== null)
    .slice(0, 5);
};

// --- hub summary -------------------------------------------------------------

export interface HubSummaryLimit {
  label: string;
  usedLabel: string;
  pct: number; // 0–100, for the progress bar
  note?: string;
}

export interface HubSummary {
  tier: string;
  hubId: string;
  customerName: string;
  created: string;
  domain: string;
  activeUsers: { active: number; total: number };
  usageIntentScore: string;
  usageIntentPlaybook: string;
  firstPurchase: string;
  eligibility: string;
  limits: HubSummaryLimit[];
  usageOverTime: {
    contacts: Array<{ month: string; value: number }>;
    emails: Array<{ month: string; value: number }>;
  };
  integrations: string[];
  trials: Array<{ name: string; dates: string }>;
}

const TIERS = ["Free", "Starter", "Professional", "Free", "Professional"];
const MONTHS = ["Mar '26", "Apr '26", "May '26", "Jun '26"];
const CREATE_DATES = ["1 Nov 2017", "14 Mar 2018", "22 Jun 2019", "9 Sep 2020", "3 Feb 2021", "27 Jul 2022"];
const INTEGRATIONS_POOL = [
  "Mailchimp", "Outlook", "Zapier", "Slack", "Gmail", "Zoom", "Stripe", "Calendly", "Google Drive",
];
const PLAYBOOKS = [
  "No predicted opportunity", "Expansion: Sales Hub", "Expansion: Service Hub", "Upgrade: Marketing Pro",
];
const TRIAL_NAMES = ["Marketing Professional", "Sales Hub Professional", "Service Hub Starter", "Content Hub"];
const TRIAL_DATES = [
  "12 May 2021 - 26 May 2021", "3 Feb 2022 - 17 Feb 2022", "8 Sep 2023 - 22 Sep 2023", "1 Mar 2024 - 15 Mar 2024",
];

const tierFromHubs = (hubs: string): string => {
  if (/Enterprise/.test(hubs)) return "Enterprise";
  if (/Professional/.test(hubs)) return "Professional";
  if (/Starter/.test(hubs)) return "Starter";
  return "Free";
};

const domainFrom = (website?: string): string =>
  (website ?? "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") || "—";

export const getHubSummary = (companyId: string): HubSummary => {
  const company = prospectingCompanies.find((c) => c.id === companyId);
  const details = companyDetails[companyId];
  const portal = details?.portals?.[0];
  const seed = hashSeed(`hub-${companyId}`);

  const tier = portal?.productsHubs ? tierFromHubs(portal.productsHubs) : pick(TIERS, seed);
  const paid = tier !== "Free";

  const contactsUsed = 120 + (seed % 880); // 120–999
  const totalUsers = 4 + (seed % 8); // 4–11
  const activeUsers = portal?.totalActivePortalUsers ?? 1 + (seed % totalUsers);
  const seatsUsed = 2 + (seed % 9); // 2–10
  const seatLimit = tier === "Enterprise" ? 5000 : tier === "Professional" ? 2500 : tier === "Starter" ? 250 : 2;
  const emailsSent = paid ? seed % 80 : 0;
  const emailLimit = tier === "Free" ? 2000 : 50000;
  const crmLimit = 1_000_000;

  const monthlyContacts = MONTHS.map((month, i) => ({
    month,
    value: contactsUsed - (3 - i) * (5 + (seed % 12)),
  }));
  const monthlyEmails = MONTHS.map((month, i) => ({
    month,
    value: paid ? (seed + i * 7) % 28 : 0,
  }));

  const integrations = INTEGRATIONS_POOL
    .filter((_, i) => (seed >> i) % 3 === 0)
    .slice(0, 4);

  const activeTrial = portal?.activeTrials && portal.activeTrials !== "--" ? portal.activeTrials : undefined;
  const trials = activeTrial
    ? [{ name: activeTrial, dates: pick(TRIAL_DATES, seed, 1) }]
    : seed % 2 === 0
      ? [{ name: pick(TRIAL_NAMES, seed, 2), dates: pick(TRIAL_DATES, seed, 3) }]
      : [];

  const customerName = portal?.customerName ?? company?.name ?? "—";

  return {
    tier,
    hubId: portal?.portalId ?? String(10_000_000 + (seed % 89_999_999)),
    customerName,
    created: pick(CREATE_DATES, seed, 4),
    domain: domainFrom(company?.website),
    activeUsers: { active: activeUsers, total: totalUsers },
    usageIntentScore: paid ? `US$${50 + (seed % 250)}` : `US$${seed % 60}`,
    usageIntentPlaybook: paid ? pick(PLAYBOOKS, seed, 3) : "No predicted opportunity",
    firstPurchase: paid ? pick(CREATE_DATES, seed, 5) : "--",
    eligibility: `${customerName} is eligible for marketing contacts`,
    limits: [
      {
        label: "Contacts",
        usedLabel: `${fmt(contactsUsed)} of No limit contacts used`,
        pct: 6,
      },
      {
        label: "Core Seats",
        usedLabel: `${seatsUsed} of ${fmt(seatLimit)} Core Seats assigned`,
        pct: Math.min(100, Math.round((seatsUsed / seatLimit) * 100) || 2),
        note: paid ? `(${tier})` : undefined,
      },
      {
        label: "CRM Contacts",
        usedLabel: `${fmt(contactsUsed)} of ${fmt(crmLimit)} contacts used`,
        pct: Math.max(2, Math.round((contactsUsed / crmLimit) * 100)),
      },
      {
        label: "Emails",
        usedLabel: `${fmt(emailsSent)} of ${fmt(emailLimit)} emails sent this month`,
        pct: Math.max(emailsSent > 0 ? 2 : 0, Math.round((emailsSent / emailLimit) * 100)),
      },
    ],
    usageOverTime: { contacts: monthlyContacts, emails: monthlyEmails },
    integrations,
    trials,
  };
};
