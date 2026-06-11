import aeoMicrositePreview from "@/assets/microsite-aeo-preview.png";

export interface EnablementMaterial {
  id: string;
  title: string;
  type: "case-study" | "one-pager" | "talk-track" | "battle-card" | "video";
  description: string;
}

export interface PlayFilter {
  id: string;
  filterName: string;
  condition: string;
  displayValue: string;
}

export type PlayStatus = "draft" | "scheduled" | "live" | "ended" | "archived";

export interface Play {
  id: string;
  label: string;
  description: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  completionCriteria: string;
  enablementMaterials: EnablementMaterial[];
  micrositeUrl?: string;
  micrositeTitle?: string;
  micrositeDescription?: string;
  micrositePreview?: string;
  metrics: {
    totalCompanies: number;
    worked: number;
    meetings: number;
    target: number;
    contactsEngaged: number;
    contactsInPlay: number;
    pipelineCreated: number;
  };
  status: PlayStatus;
  owner: string;
  geo?: string[];
  marketSegment?: string[];
  teams?: string[];
  filters?: PlayFilter[];
}

export const plays: Play[] = [
  {
    id: "salesforce-switchers",
    label: "Salesforce Switchers",
    description: "Target companies currently on Salesforce who have shown signals of dissatisfaction or contract renewal. Focus on mid-market accounts where we have competitive win data. Use the provided case studies to highlight successful migrations and ROI.",
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    createdBy: "Sarah Chen (VP Sales)",
    completionCriteria: "1 meeting booked per company",
    enablementMaterials: [
      {
        id: "em-1",
        title: "Salesforce → HubSpot Migration: TechFlow Case Study",
        type: "case-study",
        description: "How TechFlow reduced CRM costs by 40% after switching"
      },
      {
        id: "em-2",
        title: "Competitive Battle Card: Salesforce vs HubSpot",
        type: "battle-card",
        description: "Key differentiators, objection handling, and pricing comparison"
      },
      {
        id: "em-3",
        title: "Migration Talk Track",
        type: "talk-track",
        description: "Recommended discovery questions and talk track for switcher conversations"
      },
      {
        id: "em-4",
        title: "DataNova Switching Story (Video)",
        type: "video",
        description: "3-min customer testimonial from DataNova's CRO"
      }
    ],
    micrositeUrl: "https://salesforce-switchers.lovable.app",
    micrositeTitle: "Salesforce Switchers Playbook",
    micrositeDescription: "Messaging, positioning, and resources to win Salesforce displacement deals.",
    metrics: {
      totalCompanies: 16,
      worked: 10,
      meetings: 4,
      target: 16,
      contactsEngaged: 38,
      contactsInPlay: 120,
      pipelineCreated: 240000
    },
    status: "live",
    owner: "Sarah Chen",
    geo: ["US"],
    marketSegment: ["Mid-Market"]
  },
  {
    id: "q3-aeo-push",
    label: "Q3 AEO Push",
    description: "Accelerate pipeline for the AEO product line ahead of Q3 targets. Prioritize companies with 500+ employees that have shown intent signals around AI-powered analytics. Leadership wants 15 meetings booked by end of play.",
    startDate: "2026-03-01",
    endDate: "2026-05-31",
    createdBy: "Marcus Johnson (Dir. Sales)",
    completionCriteria: "2 cold calls + 1 email sequence per company",
    enablementMaterials: [
      {
        id: "em-5",
        title: "AEO Product One-Pager",
        type: "one-pager",
        description: "Key features, pricing tiers, and ideal customer profile"
      },
      {
        id: "em-6",
        title: "AI Analytics ROI Calculator Talk Track",
        type: "talk-track",
        description: "Walk prospects through ROI scenarios during discovery"
      }
    ],
    micrositeUrl: "https://aeogtmplay.lovable.app/",
    micrositeTitle: "AEO GTM Playbook",
    micrositeDescription: "Messaging, positioning, and resources to help you capitalize on AEO demand.",
    micrositePreview: aeoMicrositePreview,
    metrics: {
      totalCompanies: 48,
      worked: 8,
      meetings: 2,
      target: 15,
      contactsEngaged: 21,
      contactsInPlay: 340,
      pipelineCreated: 95000
    },
    status: "live",
    owner: "Marcus Johnson",
    geo: ["US", "EMEA"],
    marketSegment: ["Mid-Market", "Enterprise"]
  },
  {
    id: "enterprise-expansion",
    label: "Enterprise Expansion",
    description: "Identify and engage enterprise accounts ($50M+ revenue) in our install base that are using fewer than 3 hubs. Cross-sell and upsell opportunity — coordinate with CSMs before outreach.",
    startDate: "2026-01-15",
    endDate: "2026-06-30",
    createdBy: "Sarah Chen (VP Sales)",
    completionCriteria: "1 meeting booked with expansion champion",
    enablementMaterials: [
      {
        id: "em-7",
        title: "Multi-Hub Value Proposition",
        type: "one-pager",
        description: "Why consolidating on HubSpot beats point solutions"
      },
      {
        id: "em-8",
        title: "Enterprise Expansion Playbook",
        type: "battle-card",
        description: "Step-by-step guide for identifying and engaging expansion champions"
      },
      {
        id: "em-9",
        title: "FinServ Corp Case Study: 1 Hub → 4 Hubs",
        type: "case-study",
        description: "How FinServ Corp expanded from Marketing Hub to full platform"
      }
    ],
    micrositeUrl: "https://multi-hub-expansion.lovable.app",
    micrositeTitle: "Multi-Hub Expansion Playbook",
    micrositeDescription: "Messaging, positioning, and resources to drive multi-hub expansion in the install base.",
    metrics: {
      totalCompanies: 22,
      worked: 15,
      meetings: 7,
      target: 12,
      contactsEngaged: 54,
      contactsInPlay: 160,
      pipelineCreated: 610000
    },
    status: "live",
    owner: "Sarah Chen",
    geo: ["US", "EMEA", "APAC"],
    marketSegment: ["Enterprise"]
  },
  {
    id: "smb-winback",
    label: "SMB Winback",
    description: "Re-engage SMB accounts that churned in the last 6 months. Many left due to pricing concerns — new SMB pricing tier makes us competitive again. Warm outreach only, reference their previous usage.",
    startDate: "2026-02-15",
    endDate: "2026-04-15",
    createdBy: "Lisa Park (Sales Manager)",
    completionCriteria: "1 re-engagement call per company",
    enablementMaterials: [
      {
        id: "em-10",
        title: "New SMB Pricing Comparison",
        type: "one-pager",
        description: "Updated pricing vs. competitors for the SMB segment"
      },
      {
        id: "em-11",
        title: "Winback Email Templates",
        type: "talk-track",
        description: "3 proven re-engagement email templates with personalization tips"
      }
    ],
    micrositeUrl: "https://smb-winback.lovable.app",
    micrositeTitle: "SMB Winback Playbook",
    micrositeDescription: "Messaging, positioning, and resources to re-engage churned SMB accounts.",
    metrics: {
      totalCompanies: 56,
      worked: 31,
      meetings: 9,
      target: 20,
      contactsEngaged: 72,
      contactsInPlay: 410,
      pipelineCreated: 180000
    },
    status: "live",
    owner: "Lisa Park",
    geo: ["US"],
    marketSegment: ["SMB"]
  }
];

export const companyPlayMembership: Record<string, string[]> = {
  "1": ["salesforce-switchers"],
  "2": ["salesforce-switchers", "q3-aeo-push"],
  "4": ["q3-aeo-push"],
  "5": ["salesforce-switchers"],
  "6": ["enterprise-expansion"],
  "8": ["q3-aeo-push"],
  "10": ["enterprise-expansion"],
  "12": ["q3-aeo-push"],
  "13": ["enterprise-expansion", "salesforce-switchers"],
  "14": ["enterprise-expansion"],
  "16": ["smb-winback"],
  "21": ["smb-winback"],
  "22": ["salesforce-switchers"],
  "23": ["smb-winback"],
};

const generatedPlayCompanyIds: Record<string, string[]> = {
  "salesforce-switchers": ["sf-1", "sf-2", "sf-3", "sf-4", "sf-5", "sf-6"],
  "q3-aeo-push": ["aeo-1", "aeo-2", "aeo-3", "aeo-4", "aeo-5", "aeo-6"],
  "enterprise-expansion": ["ent-1", "ent-2", "ent-3", "ent-4", "ent-5", "ent-6"],
  "smb-winback": ["wb-1", "wb-2", "wb-3", "wb-4", "wb-5", "wb-6"],
};

Object.entries(generatedPlayCompanyIds).forEach(([playId, ids]) => {
  ids.forEach((id) => {
    companyPlayMembership[id] = [...(companyPlayMembership[id] ?? []), playId];
  });
});

export const getPlayIdsForCompany = (companyId: string): string[] =>
  companyPlayMembership[companyId] ?? [];

export const getPlaysForCompany = (companyId: string, allPlays: Play[]): Play[] =>
  getPlayIdsForCompany(companyId)
    .map((id) => allPlays.find((p) => p.id === id))
    .filter((p): p is Play => Boolean(p));

// --- play-driven outreach -----------------------------------------------------
//
// A play defines WHO to reach (target personas) and HOW to position (the angle
// and proof points). This profile lets contact selection prioritise the right
// job titles and lets the per-contact outreach (src/data/contactDossier.ts)
// speak to the play's specific competitive story — e.g. Salesforce Switchers
// leads with displacement against Salesforce and why HubSpot is the better move.

export interface PlayOutreachProfile {
  playId: string;
  label: string;
  // Lowercased fragments matched against a contact's role to surface the right
  // personas for this play (e.g. sales + marketing for Salesforce Switchers).
  targetRoleKeywords: string[];
  // Human label for those personas, used in copy.
  personasLabel: string;
  // The incumbent being displaced, if the play is competitive.
  competitor?: string;
  // Why this account fits the play (woven into the contact blurb).
  framing: string;
  // The situational / competitive pain (woven into the friction summary).
  frictionFrame: string;
  // HubSpot-is-better proof points, each phrased to slot after "we …".
  differentiators: string[];
  // Case-study style line for the proof-point email.
  proofPoint: string;
  // Subject line for the opener email; "{company}" is replaced at render time.
  emailSubject: string;
  // Opening line for the opener email.
  emailOpener: string;
}

export const PLAY_OUTREACH: Record<string, PlayOutreachProfile> = {
  "salesforce-switchers": {
    playId: "salesforce-switchers",
    label: "Salesforce Switchers",
    targetRoleKeywords: [
      "marketing", "demand", "brand", "content", "growth", "cmo", "seo",
      "communications", "lifecycle", "abm",
      "sales", "revenue", "account executive", "sdr", "bdr", "cro",
      "business development", "revops", "revenue operations",
    ],
    personasLabel: "sales and marketing leaders",
    competitor: "Salesforce",
    framing:
      "they're running on Salesforce today, which is exactly the kind of displacement this play is built to win",
    frictionFrame:
      "On Salesforce that usually shows up as bolted-on clouds, heavy admin overhead, and a bill that climbs with every add-on.",
    differentiators: [
      "run marketing and sales off one data model instead of stitching Sales Cloud to Marketing Cloud",
      "get a team live in weeks, not the multi-quarter rollouts and consultant fees Salesforce is known for",
      "give reps a CRM they'll actually use, without an admin army to keep it running",
    ],
    proofPoint:
      "TechFlow moved off Salesforce, cut CRM costs 40%, and was live in six weeks.",
    emailSubject: "A cleaner path off Salesforce for {company}",
    emailOpener:
      "A lot of teams on Salesforce tell me it's become more overhead than leverage — bolt-on clouds, admin time, and a bill that keeps climbing.",
  },
  "q3-aeo-push": {
    playId: "q3-aeo-push",
    label: "Q3 AEO Push",
    targetRoleKeywords: [
      "marketing", "demand", "growth", "analytics", "data", "insights",
      "seo", "content", "revops", "revenue operations", "operations", "ops",
    ],
    personasLabel: "marketing and analytics leaders",
    framing:
      "they're scaling fast and the intent they've shown lines up directly with the AEO product line",
    frictionFrame:
      "At their size, reporting is usually scattered across tools and nobody fully trusts a single number.",
    differentiators: [
      "surface AI-powered insights on top of the data you already have",
      "answer the why behind the numbers, not just the what",
      "ship analytics without standing up a separate BI stack",
    ],
    proofPoint:
      "A team your size turned on AEO and cut their weekly reporting cycle from days to minutes.",
    emailSubject: "Putting {company}'s data to work with AI",
    emailOpener:
      "I've been looking at how teams your size are using AI to get ahead of their numbers instead of chasing them.",
  },
  "enterprise-expansion": {
    playId: "enterprise-expansion",
    label: "Enterprise Expansion",
    targetRoleKeywords: [
      "revops", "revenue operations", "operations", "ops", "enablement",
      "marketing", "sales", "success", "vp", "head", "chief", "director",
      "president",
    ],
    personasLabel: "RevOps and functional leaders",
    framing:
      "they're already in the install base on fewer than three hubs — a clear multi-hub expansion path",
    frictionFrame:
      "Running a couple of hubs while the rest of the stack lives elsewhere brings back the same data sprawl HubSpot was meant to remove.",
    differentiators: [
      "bring the rest of your go-to-market onto the platform your team already trusts",
      "consolidate point tools into hubs you already pay to run",
      "unlock cross-hub reporting a single hub can't give you",
    ],
    proofPoint:
      "FinServ Corp went from one hub to four and consolidated five separate tools along the way.",
    emailSubject: "Getting more out of HubSpot at {company}",
    emailOpener:
      "Since you're already on HubSpot, I wanted to flag where teams like yours are getting outsized value by expanding across hubs.",
  },
  "smb-winback": {
    playId: "smb-winback",
    label: "SMB Winback",
    targetRoleKeywords: [
      "founder", "owner", "ceo", "president", "marketing", "growth",
      "sales", "revenue", "head", "director", "operations",
    ],
    personasLabel: "founders and growth leads",
    framing:
      "they churned in the last six months — mostly on price — and the new SMB tier closes that gap",
    frictionFrame:
      "Since leaving, they've likely fallen back on a patchwork of cheaper tools that don't talk to each other.",
    differentiators: [
      "give you the all-in-one setup back at a price built for your size",
      "let you pick up close to where you left off — your data and playbooks still map",
      "skip the re-implementation tax most switches carry",
    ],
    proofPoint:
      "A team that left over pricing came back on the new SMB tier and was re-onboarded in under two weeks.",
    emailSubject: "Worth another look at HubSpot, {company}?",
    emailOpener:
      "I know HubSpot wasn't the right fit on price when you left — that's genuinely changed with the new SMB tier, so I wanted to reach back out.",
  },
};

// The primary play profile for a company — the first of its plays that has an
// outreach profile defined. Drives both contact selection and outreach copy.
export const getPlayOutreachForCompany = (
  companyId: string,
): PlayOutreachProfile | undefined => {
  for (const id of getPlayIdsForCompany(companyId)) {
    if (PLAY_OUTREACH[id]) return PLAY_OUTREACH[id];
  }
  return undefined;
};

const matchesPlayRole = (role: string, profile: PlayOutreachProfile): boolean => {
  const r = role.toLowerCase();
  return profile.targetRoleKeywords.some((k) => r.includes(k));
};

// Stable re-ordering that floats the play's target personas to the top while
// preserving the original order within each group, so the contacts picked for
// outreach match the play (e.g. sales + marketing for Salesforce Switchers).
export const rankContactsForPlay = <T extends { role: string }>(
  contacts: T[],
  profile?: PlayOutreachProfile,
): T[] => {
  if (!profile) return contacts;
  const fit: T[] = [];
  const rest: T[] = [];
  contacts.forEach((c) => {
    (matchesPlayRole(c.role, profile) ? fit : rest).push(c);
  });
  return [...fit, ...rest];
};
