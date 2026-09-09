// Install Base (customer) accounts for the IB PPF views.
//
// Mirrors the Net New prospecting model but the account — not the contact — is
// the unit. A customer company carries one or more HubSpot portals, each with
// its own MRR / renewal / seats / credits / usage, plus a curated set of
// contacts (economic buyer, champion, cross-functional leaders). See
// .context/ib-ppf-design.md for the design rationale.

import type { Company, RecommendedContact } from "@/components/CompanyCard";
import { sig, type SignalInstance, type SignalVariant } from "@/data/signals";

export type IbTier = "P1" | "P2" | "P3" | "P4";
export type IbSegment = "SMB" | "Mid-Market" | "Corporate";

export type HubName = "Marketing" | "Sales" | "Service" | "Content" | "Operations";
export type HubTier = "Starter" | "Pro" | "Enterprise";
export interface PortalHub {
  hub: HubName;
  tier: HubTier;
}

export type PortalHealth = "green" | "yellow" | "red";

// Portal-level health/growth signal — ad-hoc chip for the prototype (the
// signals.ts catalog only models company/contact intent signals today; see the
// design doc's note about extending it later).
export interface PortalSignal {
  variant: SignalVariant;
  text: string;
}

export interface Portal {
  id: string; // HubSpot portal id
  name: string; // rep/customer label, e.g. "Marketing – EMEA"
  hubs: PortalHub[];
  mrr: number; // monthly, USD
  mrrTrend?: "up" | "down" | "flat";
  renewalDate: string; // display date
  renewalInDays: number;
  seatsActive: number;
  seatsLicensed: number;
  creditsUsed?: number;
  creditsLimit?: number;
  health: PortalHealth;
  signals?: PortalSignal[];
}

// The trigger that placed a company in its tier. QL → P1 (highest value);
// non-QL intent signal → P3.
export interface IbTrigger {
  kind: "ql" | "signal";
  label: string; // e.g. "QL: Contact Sales" or "Pricing Pageview"
}

export interface CsEngagement {
  csmName?: string;
  renewalActive?: boolean; // a contract/renewal motion is live — mind toe-stepping
  note?: string;
}

export interface IbCompany {
  id: string;
  name: string;
  logo?: string;
  website: string;
  industry?: string;
  segment: IbSegment;
  tier: IbTier;
  trigger?: IbTrigger; // present for P1 (QL) and P3 (signal)
  companySignals: SignalInstance[]; // company-level intent signals (catalog)
  csEngagement?: CsEngagement;
  portals: Portal[];
  contacts: RecommendedContact[]; // curated: buyer, champion, cross-functional leaders
}

// Extra account/portal columns mirrored from the real Full Customer Book (kept
// in a separate keyed map so the company objects stay readable). Every field is
// optional — columns render "—" when absent.
export interface HubMrr {
  mrr: number;
  tier: HubTier;
}
export interface IbMetrics {
  portalId?: string;
  actionGuidance?: { count: number; label: string };
  ibSignals?: PortalSignal[]; // Customer Agent, Pre-Renewal Strategic Window, AI SQL…
  platformMrr?: number;
  totalHubMrr?: number;
  hubMrr?: Partial<Record<HubName, HubMrr>>;
  discountChanges?: Array<{ hub: string; from: number; to?: number }>;
  nextCancellationDate?: string;
  salesSeats?: { assigned: number; purchased: number };
  serviceSeats?: { assigned: number; purchased: number };
  openAlerts?: number;
  marketingContacts?: { used: number; limit: number };
  creditsConsumptionPct?: number;
  creditsConsumedMtd?: number;
  includedCreditsMonthly?: number;
  creditsLimit?: number;
  activeTrials?: string;
  integrationsCount?: number;
  lastActivityPreview?: string;
  lastActivityBy?: { name: string; role: string };
  nextActivity?: { name: string; when: string };
  usageScore?: number; // 0–100
  usageScoreTrend?: number; // +/- %
  whitespace?: string[]; // "Data Starter → Professional"
  usersLoggedIn30d?: number;
  recentSqlDate?: string;
  primaryPocEmail?: string;
  csmNotes?: string;
  successOwnerNextMeeting?: string;
  successOwner?: string;
  contractManager?: string;
  managingPartners?: string;
}

// --- Roll-up helpers ---------------------------------------------------------

export const totalMrr = (c: IbCompany): number =>
  c.portals.reduce((sum, p) => sum + p.mrr, 0);

export const earliestRenewal = (c: IbCompany): Portal | undefined =>
  c.portals.reduce<Portal | undefined>(
    (min, p) => (!min || p.renewalInDays < min.renewalInDays ? p : min),
    undefined,
  );

export const seatsRollup = (c: IbCompany): { active: number; licensed: number } =>
  c.portals.reduce(
    (acc, p) => ({
      active: acc.active + p.seatsActive,
      licensed: acc.licensed + p.seatsLicensed,
    }),
    { active: 0, licensed: 0 },
  );

export const formatMrr = (n: number): string =>
  `$${n.toLocaleString("en-US")}/mo`;

// --- Mock data ---------------------------------------------------------------

export const installBaseCompanies: IbCompany[] = [
  // ---- P1 · SMB · single portal · buyer == user -----------------------------
  {
    id: "brightpath-studio",
    name: "Brightpath Studio",
    website: "brightpathstudio.com",
    industry: "Creative agency",
    segment: "SMB",
    tier: "P1",
    trigger: { kind: "ql", label: "QL: Demo" },
    companySignals: [sig("hiring-surge")],
    csEngagement: { csmName: "Priya Anand" },
    portals: [
      {
        id: "45844085",
        name: "Brightpath Studio",
        hubs: [
          { hub: "Marketing", tier: "Pro" },
          { hub: "Sales", tier: "Starter" },
        ],
        mrr: 1180,
        mrrTrend: "flat",
        renewalDate: "18 Nov 2026",
        renewalInDays: 72,
        seatsActive: 4,
        seatsLicensed: 5,
        creditsUsed: 3200,
        creditsLimit: 5000,
        health: "green",
        signals: [{ variant: "yellow", text: "Sales seat whitespace" }],
      },
    ],
    contacts: [
      {
        id: "bp-owner",
        name: "Alex Rivera",
        initials: "AR",
        role: "Founder & CEO",
        avatarColor: "bg-trellis-purple-600",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 1,
        signals: [sig("recent-ql")],
        qlData: {
          requestType: "Requested a demo of Sales Hub",
          requestDate: "5 Sep 2026 09:14",
          deadline: "9 September",
        },
      },
      {
        id: "bp-ops",
        name: "Jordan Kim",
        initials: "JK",
        role: "Operations Lead",
        avatarColor: "bg-trellis-blue-600",
        recentTouches: 2,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [],
      },
    ],
  },

  // ---- P1 · Corporate · multi-portal · buyer != user ------------------------
  {
    id: "northwind-traders",
    name: "Northwind Traders",
    website: "northwind.com",
    industry: "Logistics & supply chain",
    segment: "Corporate",
    tier: "P1",
    trigger: { kind: "ql", label: "QL: Contact Sales" },
    companySignals: [sig("new-hire"), sig("funding-round")],
    csEngagement: { csmName: "Dana Whitfield", renewalActive: true },
    portals: [
      {
        id: "23947299",
        name: "Marketing – EMEA",
        hubs: [
          { hub: "Marketing", tier: "Pro" },
          { hub: "Sales", tier: "Starter" },
        ],
        mrr: 4100,
        mrrTrend: "up",
        renewalDate: "12 Mar 2026",
        renewalInDays: 22,
        seatsActive: 18,
        seatsLicensed: 25,
        creditsUsed: 6200,
        creditsLimit: 10000,
        health: "yellow",
        signals: [{ variant: "yellow", text: "Seat whitespace" }],
      },
      {
        id: "34201583",
        name: "Service – Global",
        hubs: [{ hub: "Service", tier: "Pro" }],
        mrr: 3200,
        mrrTrend: "flat",
        renewalDate: "4 Aug 2026",
        renewalInDays: 167,
        seatsActive: 31,
        seatsLicensed: 40,
        creditsUsed: 8800,
        creditsLimit: 10000,
        health: "green",
        signals: [{ variant: "orange", text: "Credit limit approaching" }],
      },
      {
        id: "44655774",
        name: "Sales – NA (partner-sold)",
        hubs: [{ hub: "Sales", tier: "Pro" }],
        mrr: 1940,
        mrrTrend: "down",
        renewalDate: "19 Nov 2026",
        renewalInDays: 73,
        seatsActive: 9,
        seatsLicensed: 25,
        creditsUsed: 0,
        creditsLimit: 5000,
        health: "red",
        signals: [{ variant: "orange", text: "Low adoption" }],
      },
    ],
    contacts: [
      {
        id: "nw-cro",
        name: "Marcus Bell",
        initials: "MB",
        role: "Chief Revenue Officer",
        avatarColor: "bg-trellis-orange-800",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [sig("recent-ql")],
        qlData: {
          requestType: "Submitted a contact-sales form",
          requestDate: "4 Sep 2026 16:02",
          deadline: "8 September",
        },
      },
      {
        id: "nw-vp-service",
        name: "Helen Choi",
        initials: "HC",
        role: "VP, Customer Experience",
        avatarColor: "bg-trellis-green-800",
        recentTouches: 1,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [sig("past-hubspot-user")],
      },
      {
        id: "nw-ops",
        name: "Tomás Rivera",
        initials: "TR",
        role: "Head of RevOps (champion)",
        avatarColor: "bg-trellis-blue-800",
        recentTouches: 3,
        enrolledInSequence: true,
        recentConversions: 2,
        signals: [],
      },
    ],
  },

  // ---- P1 · Mid-Market · single portal --------------------------------------
  {
    id: "vela-health",
    name: "Vela Health",
    website: "velahealth.io",
    industry: "Healthcare technology",
    segment: "Mid-Market",
    tier: "P1",
    trigger: { kind: "ql", label: "QL: Hand Raise" },
    companySignals: [sig("funding-round")],
    csEngagement: { csmName: "Marcus Bell" },
    portals: [
      {
        id: "8814402",
        name: "Vela Health",
        hubs: [
          { hub: "Marketing", tier: "Enterprise" },
          { hub: "Operations", tier: "Pro" },
        ],
        mrr: 5600,
        mrrTrend: "up",
        renewalDate: "2 Feb 2026",
        renewalInDays: 18,
        seatsActive: 42,
        seatsLicensed: 45,
        creditsUsed: 9400,
        creditsLimit: 10000,
        health: "green",
        signals: [
          { variant: "orange", text: "Contacts near tier limit" },
          { variant: "green", text: "High adoption" },
        ],
      },
    ],
    contacts: [
      {
        id: "vela-cmo",
        name: "Sofia Marchetti",
        initials: "SM",
        role: "Chief Marketing Officer",
        avatarColor: "bg-trellis-magenta-800",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 1,
        signals: [sig("recent-ql")],
        qlData: {
          requestType: "Raised hand for Service Hub",
          requestDate: "6 Sep 2026 11:30",
          deadline: "10 September",
        },
      },
      {
        id: "vela-ops",
        name: "Daniel Osei",
        initials: "DO",
        role: "Marketing Ops Manager",
        avatarColor: "bg-trellis-teal-800",
        recentTouches: 1,
        enrolledInSequence: true,
        recentConversions: 0,
        signals: [],
      },
    ],
  },

  // ---- P3 · SMB · single portal · intent signal (non-QL) --------------------
  {
    id: "ridgeline-logistics",
    name: "Ridgeline Logistics",
    website: "ridgelinelogistics.com",
    industry: "Freight & logistics",
    segment: "SMB",
    tier: "P3",
    trigger: { kind: "signal", label: "Pricing Pageview" },
    companySignals: [sig("viewed-pricing")],
    csEngagement: { csmName: "Priya Anand" },
    portals: [
      {
        id: "6620145",
        name: "Ridgeline Logistics",
        hubs: [{ hub: "Sales", tier: "Pro" }],
        mrr: 900,
        mrrTrend: "flat",
        renewalDate: "27 Jan 2026",
        renewalInDays: 12,
        seatsActive: 8,
        seatsLicensed: 8,
        health: "yellow",
        signals: [{ variant: "orange", text: "All seats in use" }],
      },
    ],
    contacts: [
      {
        id: "rl-sales",
        name: "Priya Nair",
        initials: "PN",
        role: "Head of Sales",
        avatarColor: "bg-trellis-blue-800",
        recentTouches: 2,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [sig("viewed-pricing")],
      },
    ],
  },

  // ---- P3 · Mid-Market · multi-portal · intent signal -----------------------
  {
    id: "coastal-media-group",
    name: "Coastal Media Group",
    website: "coastalmedia.co",
    industry: "Media & publishing",
    segment: "Mid-Market",
    tier: "P3",
    trigger: { kind: "signal", label: "Competitive Renewal" },
    companySignals: [sig("tech-stack-change")],
    csEngagement: { csmName: "Dana Whitfield" },
    portals: [
      {
        id: "5591220",
        name: "Coastal – Brand",
        hubs: [{ hub: "Marketing", tier: "Pro" }],
        mrr: 2100,
        mrrTrend: "flat",
        renewalDate: "15 Apr 2026",
        renewalInDays: 96,
        seatsActive: 12,
        seatsLicensed: 15,
        health: "green",
        signals: [],
      },
      {
        id: "5591221",
        name: "Coastal – Agency",
        hubs: [{ hub: "Sales", tier: "Starter" }],
        mrr: 640,
        mrrTrend: "flat",
        renewalDate: "15 Apr 2026",
        renewalInDays: 96,
        seatsActive: 5,
        seatsLicensed: 10,
        health: "yellow",
        signals: [{ variant: "yellow", text: "Product whitespace: Service" }],
      },
    ],
    contacts: [
      {
        id: "cm-cmo",
        name: "Laura Bennett",
        initials: "LB",
        role: "VP, Marketing",
        avatarColor: "bg-trellis-purple-800",
        recentTouches: 1,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [sig("tech-stack-change")],
      },
    ],
  },

  // ---- P2 · top of IB Causal Rank (no trigger) · proactive expansion --------
  {
    id: "summit-gear",
    name: "Summit Gear Co",
    website: "summitgear.co",
    industry: "Outdoor retail",
    segment: "SMB",
    tier: "P2",
    companySignals: [],
    csEngagement: { csmName: "Priya Anand" },
    portals: [
      {
        id: "7712004",
        name: "Summit Gear Co",
        hubs: [{ hub: "Marketing", tier: "Pro" }],
        mrr: 1450,
        mrrTrend: "up",
        renewalDate: "22 Apr 2026",
        renewalInDays: 103,
        seatsActive: 6,
        seatsLicensed: 10,
        health: "green",
        signals: [{ variant: "yellow", text: "Product whitespace: Sales" }],
      },
    ],
    contacts: [
      {
        id: "sg-owner",
        name: "Erin Walsh",
        initials: "EW",
        role: "Founder",
        avatarColor: "bg-trellis-blue-800",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [sig("past-hubspot-user")],
      },
      {
        id: "sg-mktg",
        name: "Priya Kapoor",
        initials: "PK",
        role: "Head of Marketing",
        avatarColor: "bg-trellis-purple-800",
        recentTouches: 1,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [],
      },
      {
        id: "sg-sales",
        name: "Ben Carter",
        initials: "BC",
        role: "Sales Manager",
        avatarColor: "bg-trellis-green-800",
        recentTouches: 0,
        enrolledInSequence: true,
        recentConversions: 1,
        signals: [],
      },
    ],
  },
  {
    id: "atlas-freight",
    name: "Atlas Freight",
    website: "atlasfreight.com",
    industry: "Transportation",
    segment: "Mid-Market",
    tier: "P2",
    companySignals: [],
    csEngagement: { csmName: "Dana Whitfield" },
    portals: [
      {
        id: "9021551",
        name: "Atlas – Commercial",
        hubs: [
          { hub: "Sales", tier: "Pro" },
          { hub: "Service", tier: "Starter" },
        ],
        mrr: 3400,
        mrrTrend: "up",
        renewalDate: "9 Jun 2026",
        renewalInDays: 151,
        seatsActive: 22,
        seatsLicensed: 30,
        creditsUsed: 4100,
        creditsLimit: 10000,
        health: "green",
        signals: [{ variant: "yellow", text: "Seat whitespace" }],
      },
      {
        id: "9021552",
        name: "Atlas – Ops sandbox",
        hubs: [{ hub: "Operations", tier: "Starter" }],
        mrr: 300,
        mrrTrend: "flat",
        renewalDate: "9 Jun 2026",
        renewalInDays: 151,
        seatsActive: 3,
        seatsLicensed: 5,
        health: "yellow",
        signals: [],
      },
    ],
    contacts: [
      {
        id: "af-vp",
        name: "Reuben Ford",
        initials: "RF",
        role: "VP, Sales",
        avatarColor: "bg-trellis-green-800",
        recentTouches: 1,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [],
      },
      {
        id: "af-ops",
        name: "Marta Nowak",
        initials: "MN",
        role: "Head of Operations",
        avatarColor: "bg-trellis-orange-800",
        recentTouches: 2,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [sig("past-hubspot-user")],
      },
      {
        id: "af-cs",
        name: "Daniel Wu",
        initials: "DW",
        role: "Customer Success Lead",
        avatarColor: "bg-trellis-teal-800",
        recentTouches: 0,
        enrolledInSequence: true,
        recentConversions: 1,
        signals: [],
      },
    ],
  },
  {
    id: "verdant-foods",
    name: "Verdant Foods",
    website: "verdantfoods.com",
    industry: "Food & beverage",
    segment: "SMB",
    tier: "P2",
    companySignals: [],
    portals: [
      {
        id: "5540021",
        name: "Verdant Foods",
        hubs: [{ hub: "Marketing", tier: "Starter" }],
        mrr: 620,
        mrrTrend: "flat",
        renewalDate: "3 Mar 2026",
        renewalInDays: 47,
        seatsActive: 3,
        seatsLicensed: 5,
        health: "yellow",
        signals: [{ variant: "yellow", text: "Upgrade opportunity: Pro" }],
      },
    ],
    contacts: [
      {
        id: "vf-marketing",
        name: "Nadia Haas",
        initials: "NH",
        role: "Marketing Manager",
        avatarColor: "bg-trellis-purple-800",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [],
      },
      {
        id: "vf-coo",
        name: "Tomás Ferreira",
        initials: "TF",
        role: "COO",
        avatarColor: "bg-trellis-blue-800",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [sig("viewed-pricing")],
      },
      {
        id: "vf-demand",
        name: "Aisha Bello",
        initials: "AB",
        role: "Demand Gen Lead",
        avatarColor: "bg-trellis-magenta-800",
        recentTouches: 1,
        enrolledInSequence: true,
        recentConversions: 0,
        signals: [],
      },
    ],
  },

  // ---- P4 · the rest of the book (lowest IB Causal Rank) --------------------
  {
    id: "harbor-dental",
    name: "Harbor Dental",
    website: "harbordental.com",
    industry: "Healthcare",
    segment: "SMB",
    tier: "P4",
    companySignals: [],
    portals: [
      {
        id: "3320145",
        name: "Harbor Dental",
        hubs: [{ hub: "Marketing", tier: "Starter" }],
        mrr: 240,
        mrrTrend: "flat",
        renewalDate: "14 Jul 2026",
        renewalInDays: 186,
        seatsActive: 2,
        seatsLicensed: 2,
        health: "green",
        signals: [],
      },
    ],
    contacts: [
      {
        id: "hd-office",
        name: "Grace Lim",
        initials: "GL",
        role: "Office Manager",
        avatarColor: "bg-trellis-teal-800",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [],
      },
    ],
  },
  {
    id: "quill-co",
    name: "Quill & Co",
    website: "quillandco.com",
    industry: "Professional services",
    segment: "SMB",
    tier: "P4",
    companySignals: [],
    portals: [
      {
        id: "2210773",
        name: "Quill & Co",
        hubs: [{ hub: "Sales", tier: "Starter" }],
        mrr: 180,
        mrrTrend: "flat",
        renewalDate: "28 Sep 2026",
        renewalInDays: 262,
        seatsActive: 1,
        seatsLicensed: 2,
        health: "yellow",
        signals: [{ variant: "orange", text: "Low adoption" }],
      },
    ],
    contacts: [
      {
        id: "qc-owner",
        name: "Owen Pratt",
        initials: "OP",
        role: "Principal",
        avatarColor: "bg-trellis-orange-800",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [],
      },
    ],
  },
  {
    id: "metro-plumbing",
    name: "Metro Plumbing",
    website: "metroplumbing.com",
    industry: "Home services",
    segment: "SMB",
    tier: "P4",
    companySignals: [],
    portals: [
      {
        id: "1180994",
        name: "Metro Plumbing",
        hubs: [{ hub: "Marketing", tier: "Starter" }],
        mrr: 300,
        mrrTrend: "flat",
        renewalDate: "5 May 2026",
        renewalInDays: 110,
        seatsActive: 2,
        seatsLicensed: 3,
        health: "green",
        signals: [],
      },
    ],
    contacts: [
      {
        id: "mp-owner",
        name: "Carla Núñez",
        initials: "CN",
        role: "Owner",
        avatarColor: "bg-trellis-magenta-800",
        recentTouches: 0,
        enrolledInSequence: false,
        recentConversions: 0,
        signals: [],
      },
    ],
  },
];

export const installBaseByTier = (tier: IbTier): IbCompany[] =>
  installBaseCompanies.filter((c) => c.tier === tier);

// Real-world column data mirrored from the Full Customer Book, keyed by company.
const IB_METRICS: Record<string, IbMetrics> = {
  "brightpath-studio": {
    portalId: "45844085",
    actionGuidance: { count: 1, label: "CS: Active CM Deal, reach out to owner" },
    ibSignals: [{ variant: "orange", text: "Customer Agent" }],
    platformMrr: 1180,
    totalHubMrr: 1120,
    hubMrr: { Marketing: { mrr: 940, tier: "Pro" }, Sales: { mrr: 180, tier: "Starter" } },
    salesSeats: { assigned: 2, purchased: 5 },
    openAlerts: 0,
    marketingContacts: { used: 4685, limit: 12000 },
    creditsConsumptionPct: 0,
    creditsConsumedMtd: 0,
    includedCreditsMonthly: 5000,
    creditsLimit: 5000,
    integrationsCount: 13,
    lastActivityPreview: "Hi Alex, do you have any questions about Sales Hub?",
    lastActivityBy: { name: "Eoin Beecham", role: "Marketing Automation" },
    usageScore: 54,
    usageScoreTrend: 4,
    whitespace: ["Sales Starter → Professional"],
    usersLoggedIn30d: 30,
    primaryPocEmail: "alex@brightpathstudio.com",
    successOwner: "Denis Doherty",
    contractManager: "Jose Camarinha",
  },
  "northwind-traders": {
    portalId: "23947299",
    actionGuidance: { count: 3, label: "CS: Active CM Deal, Currently in Renewal Stage" },
    ibSignals: [
      { variant: "orange", text: "Customer Agent" },
      { variant: "green", text: "Pre-Renewal Strategic Window" },
    ],
    platformMrr: 9240,
    totalHubMrr: 8730,
    hubMrr: {
      Marketing: { mrr: 3319, tier: "Enterprise" },
      Sales: { mrr: 1940, tier: "Pro" },
      Service: { mrr: 3200, tier: "Pro" },
    },
    discountChanges: [
      { hub: "Marketing", from: 20, to: 15 },
      { hub: "Sales", from: 36, to: 31 },
      { hub: "Service", from: 10 },
    ],
    nextCancellationDate: "30 April 2029",
    salesSeats: { assigned: 9, purchased: 25 },
    serviceSeats: { assigned: 31, purchased: 40 },
    openAlerts: 1,
    marketingContacts: { used: 12563, limit: 20000 },
    creditsConsumptionPct: 62,
    creditsConsumedMtd: 6200,
    includedCreditsMonthly: 5000,
    creditsLimit: 10000,
    activeTrials: "Content Enterprise (Aug 20, 2026 – Sep 20, 2026)",
    integrationsCount: 27,
    lastActivityPreview: "Hi Marcus, following up on our platform conversation…",
    lastActivityBy: { name: "Dave Buonocore", role: "Renewal Manager" },
    nextActivity: { name: "Dave Buonocore", when: "In 3 days" },
    usageScore: 71,
    usageScoreTrend: 12,
    whitespace: ["Content — → Enterprise", "Operations — → Professional"],
    usersLoggedIn30d: 76,
    recentSqlDate: "9 September 2026",
    primaryPocEmail: "m.bell@northwind.com",
    csmNotes: "Last update: renewal risk low, expansion on Service likely",
    successOwnerNextMeeting: "18 September 2026",
    successOwner: "Shivani Thapa",
    contractManager: "Siobhan ODwyer",
    managingPartners: "GO2 Partners, Inc.",
  },
  "vela-health": {
    portalId: "8814402",
    actionGuidance: { count: 2, label: "CS: Currently in Renewal Stage" },
    ibSignals: [
      { variant: "green", text: "Pre-Renewal Strategic Window" },
      { variant: "yellow", text: "AI SQL" },
    ],
    platformMrr: 5600,
    totalHubMrr: 5320,
    hubMrr: { Marketing: { mrr: 4100, tier: "Enterprise" }, Operations: { mrr: 1220, tier: "Pro" } },
    salesSeats: { assigned: 0, purchased: 0 },
    openAlerts: 0,
    marketingContacts: { used: 44735, limit: 52000 },
    creditsConsumptionPct: 94,
    creditsConsumedMtd: 9400,
    includedCreditsMonthly: 5000,
    creditsLimit: 10000,
    integrationsCount: 24,
    lastActivityPreview: "Hi Sofia, smarter email marketing with Marketing Hub…",
    lastActivityBy: { name: "Eoin Beecham", role: "Marketing Automation" },
    usageScore: 82,
    usageScoreTrend: 9,
    whitespace: ["Service — → Professional"],
    usersLoggedIn30d: 42,
    recentSqlDate: "20 May 2026",
    primaryPocEmail: "sofia@velahealth.io",
    successOwner: "Aoife McLoughlin",
    contractManager: "Wala Ayadi",
  },
  "ridgeline-logistics": {
    portalId: "6620145",
    actionGuidance: { count: 1, label: "CS: HRC or Cancel Alert in last 30 days" },
    ibSignals: [{ variant: "orange", text: "Pricing Pageview" }],
    platformMrr: 900,
    totalHubMrr: 900,
    hubMrr: { Sales: { mrr: 900, tier: "Pro" } },
    salesSeats: { assigned: 8, purchased: 8 },
    openAlerts: 2,
    creditsConsumptionPct: 0,
    creditsLimit: 5000,
    integrationsCount: 9,
    usageScore: 47,
    usageScoreTrend: -3,
    whitespace: ["Marketing — → Starter"],
    usersLoggedIn30d: 8,
    primaryPocEmail: "priya@ridgelinelogistics.com",
    successOwner: "Gavin O'Leary",
    contractManager: "Jose Camarinha",
  },
  "coastal-media-group": {
    portalId: "5591220",
    actionGuidance: { count: 2, label: "Partner Managed: contact the partner(s)" },
    ibSignals: [{ variant: "green", text: "Competitive Renewal" }],
    platformMrr: 2740,
    totalHubMrr: 2610,
    hubMrr: { Marketing: { mrr: 2100, tier: "Pro" }, Sales: { mrr: 510, tier: "Starter" } },
    salesSeats: { assigned: 5, purchased: 10 },
    openAlerts: 0,
    marketingContacts: { used: 8100, limit: 15000 },
    integrationsCount: 16,
    usageScore: 58,
    usageScoreTrend: 2,
    whitespace: ["Service — → Professional", "Content Pro → Enterprise"],
    usersLoggedIn30d: 17,
    primaryPocEmail: "laura@coastalmedia.co",
    successOwner: "Dominika Murlak",
    contractManager: "Louis Howell",
    managingPartners: "Digital Media Stream Ltd",
  },
  "summit-gear": {
    portalId: "7712004",
    ibSignals: [{ variant: "yellow", text: "Seat Whitespace" }],
    platformMrr: 1450,
    totalHubMrr: 1450,
    hubMrr: { Marketing: { mrr: 1450, tier: "Pro" } },
    openAlerts: 0,
    marketingContacts: { used: 6200, limit: 10000 },
    integrationsCount: 6,
    usageScore: 61,
    usageScoreTrend: 5,
    whitespace: ["Sales — → Professional"],
    usersLoggedIn30d: 12,
    primaryPocEmail: "erin@summitgear.co",
    successOwner: "Aoife McLoughlin",
  },
  "atlas-freight": {
    portalId: "9021551",
    actionGuidance: { count: 1, label: "Partner Sold: New Brand" },
    ibSignals: [{ variant: "yellow", text: "Seat Whitespace" }],
    platformMrr: 3700,
    totalHubMrr: 3520,
    hubMrr: { Sales: { mrr: 2900, tier: "Pro" }, Service: { mrr: 620, tier: "Starter" } },
    salesSeats: { assigned: 22, purchased: 30 },
    serviceSeats: { assigned: 6, purchased: 10 },
    openAlerts: 0,
    creditsConsumptionPct: 41,
    creditsConsumedMtd: 4100,
    creditsLimit: 10000,
    integrationsCount: 19,
    usageScore: 66,
    usageScoreTrend: 7,
    whitespace: ["Marketing — → Professional"],
    usersLoggedIn30d: 25,
    primaryPocEmail: "reuben@atlasfreight.com",
    successOwner: "Denis Doherty",
    contractManager: "Jose Camarinha",
  },
  "verdant-foods": {
    portalId: "5540021",
    ibSignals: [{ variant: "yellow", text: "Upgrade Opportunity" }],
    platformMrr: 620,
    totalHubMrr: 620,
    hubMrr: { Marketing: { mrr: 620, tier: "Starter" } },
    openAlerts: 0,
    marketingContacts: { used: 481, limit: 20000 },
    integrationsCount: 4,
    usageScore: 39,
    usageScoreTrend: 1,
    whitespace: ["Marketing Starter → Professional"],
    usersLoggedIn30d: 3,
    primaryPocEmail: "nadia@verdantfoods.com",
    successOwner: "Gavin O'Leary",
  },
  "harbor-dental": {
    portalId: "3320145",
    platformMrr: 240,
    totalHubMrr: 240,
    hubMrr: { Marketing: { mrr: 240, tier: "Starter" } },
    openAlerts: 0,
    integrationsCount: 2,
    usageScore: 33,
    usageScoreTrend: 0,
    usersLoggedIn30d: 2,
    primaryPocEmail: "grace@harbordental.com",
    successOwner: "Gavin O'Leary",
  },
  "quill-co": {
    portalId: "2210773",
    ibSignals: [{ variant: "orange", text: "Low adoption" }],
    platformMrr: 180,
    totalHubMrr: 180,
    hubMrr: { Sales: { mrr: 180, tier: "Starter" } },
    salesSeats: { assigned: 1, purchased: 2 },
    openAlerts: 1,
    integrationsCount: 1,
    usageScore: 21,
    usageScoreTrend: -5,
    usersLoggedIn30d: 1,
    primaryPocEmail: "owen@quillandco.com",
  },
  "metro-plumbing": {
    portalId: "1180994",
    platformMrr: 300,
    totalHubMrr: 300,
    hubMrr: { Marketing: { mrr: 300, tier: "Starter" } },
    openAlerts: 0,
    integrationsCount: 3,
    usageScore: 44,
    usageScoreTrend: 2,
    usersLoggedIn30d: 2,
    primaryPocEmail: "carla@metroplumbing.com",
    successOwner: "Gavin O'Leary",
  },
};

export const getIbMetrics = (id: string): IbMetrics => IB_METRICS[id] ?? {};

// --- Fill the P2 tier to 25 customers ---------------------------------------
// Deterministically generated P2 customers (ranked by IB Causal Rank — no intent
// trigger/QL) so the tier list looks realistic without hand-authoring every field.
const P2_FILL_SEEDS: Array<{ name: string; industry: string; segment: IbSegment }> = [
  { name: "Northgate Legal", industry: "Legal services", segment: "Mid-Market" },
  { name: "Brightwave Retail", industry: "Retail", segment: "SMB" },
  { name: "Meridian Analytics", industry: "Data analytics", segment: "Mid-Market" },
  { name: "Cedar & Bloom", industry: "Home & garden", segment: "SMB" },
  { name: "Ironclad Security", industry: "Cybersecurity", segment: "Corporate" },
  { name: "Lumen Health", industry: "Healthcare", segment: "Mid-Market" },
  { name: "Tidewater Shipping", industry: "Logistics", segment: "Corporate" },
  { name: "Fable Publishing", industry: "Media & publishing", segment: "SMB" },
  { name: "Quantia Fintech", industry: "Financial services", segment: "Mid-Market" },
  { name: "Greenfield Farms", industry: "Agriculture", segment: "SMB" },
  { name: "Aster Robotics", industry: "Manufacturing", segment: "Corporate" },
  { name: "Bluepeak Travel", industry: "Travel & hospitality", segment: "Mid-Market" },
  { name: "Corvus Consulting", industry: "Professional services", segment: "SMB" },
  { name: "Solstice Energy", industry: "Energy & utilities", segment: "Corporate" },
  { name: "Pinnacle Realty", industry: "Real estate", segment: "Mid-Market" },
  { name: "Harborview Foods", industry: "Food & beverage", segment: "SMB" },
  { name: "Vertex Education", industry: "Education", segment: "Mid-Market" },
  { name: "Nimbus Software", industry: "Software", segment: "Corporate" },
  { name: "Willow Cosmetics", industry: "Beauty & cosmetics", segment: "SMB" },
  { name: "Granite Construction", industry: "Construction", segment: "Mid-Market" },
  { name: "Echo Fitness", industry: "Health & fitness", segment: "SMB" },
  { name: "Orbit Telecom", industry: "Telecommunications", segment: "Corporate" },
];

const P2_HUB_COMBOS: PortalHub[][] = [
  [{ hub: "Marketing", tier: "Pro" }],
  [{ hub: "Sales", tier: "Pro" }],
  [{ hub: "Marketing", tier: "Enterprise" }, { hub: "Sales", tier: "Pro" }],
  [{ hub: "Service", tier: "Pro" }],
  [{ hub: "Marketing", tier: "Starter" }, { hub: "Sales", tier: "Starter" }],
  [{ hub: "Operations", tier: "Pro" }, { hub: "Marketing", tier: "Pro" }],
];
const P2_RENEWAL_DAYS = [12, 22, 18, 34, 47, 61, 73, 96, 110, 167];
const P2_COMPANY_SIGNALS = [
  "new-hire",
  "funding-round",
  "hiring-surge",
  "tech-stack-change",
  "viewed-pricing",
] as const;
const P2_IB_SIGNALS: PortalSignal[] = [
  { variant: "orange", text: "Customer Agent" },
  { variant: "green", text: "Pre-Renewal Strategic Window" },
  { variant: "yellow", text: "AI SQL" },
  { variant: "yellow", text: "Seat Whitespace" },
  { variant: "orange", text: "Upgrade Opportunity" },
];
const P2_WHITESPACES = [
  "Sales — → Professional",
  "Service — → Professional",
  "Content — → Enterprise",
  "Marketing Pro → Enterprise",
  "Operations — → Professional",
];
const P2_OWNERS = ["Shivani Thapa", "Dominika Murlak", "Aoife McLoughlin", "Denis Doherty", "Gavin O'Leary"];
const P2_CONTRACT_MGRS = ["Siobhan ODwyer", "Wala Ayadi", "Jose Camarinha", "Louis Howell"];
const P2_CSMS = ["Priya Anand", "Dana Whitfield", "Marcus Bell", "Aoife McLoughlin"];
const P2_AVATARS = [
  "bg-trellis-purple-800",
  "bg-trellis-blue-800",
  "bg-trellis-green-800",
  "bg-trellis-orange-800",
  "bg-trellis-teal-800",
  "bg-trellis-magenta-800",
];
const P2_CONTACT_NAMES = [
  "Jordan Ellis",
  "Sam Carter",
  "Robin Shah",
  "Alex Moreau",
  "Casey Lin",
  "Taylor Reed",
  "Jamie Fox",
  "Morgan Yu",
  "Riley Nash",
  "Devon Park",
  "Sky Adebayo",
  "Quinn Rivera",
];
const P2_ROLES = [
  "VP Marketing",
  "Head of Sales",
  "COO",
  "CMO",
  "RevOps Lead",
  "VP Customer Experience",
  "Founder",
  "Head of Growth",
];

const p2Slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const p2RenewalDate = (days: number) => {
  const d = new Date(2026, 0, 15);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const p2Initials = (name: string) =>
  name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

const p2Fill: IbCompany[] = P2_FILL_SEEDS.map((seed, i) => {
  const id = p2Slug(seed.name);
  const renewalInDays = P2_RENEWAL_DAYS[i % P2_RENEWAL_DAYS.length];
  const seatsLicensed = 5 + (i % 6) * 5;
  const seatsActive = Math.max(1, Math.round(seatsLicensed * (0.5 + (i % 5) * 0.1)));
  const creditsLimit = [5000, 10000, 2500][i % 3];
  const creditsUsed = Math.round(creditsLimit * ((i % 5) * 0.2));
  const mrr = 600 + ((i * 173) % 5200);
  const health: PortalHealth =
    renewalInDays <= 25 ? "yellow" : i % 4 === 0 ? "red" : "green";
  return {
    id,
    name: seed.name,
    website: `${id}.com`,
    industry: seed.industry,
    segment: seed.segment,
    tier: "P2",
    companySignals: [sig(P2_COMPANY_SIGNALS[i % P2_COMPANY_SIGNALS.length])],
    csEngagement: { csmName: P2_CSMS[i % P2_CSMS.length], renewalActive: renewalInDays <= 30 },
    portals: [
      {
        id: String(10000000 + i * 137),
        name: seed.name,
        hubs: P2_HUB_COMBOS[i % P2_HUB_COMBOS.length],
        mrr,
        mrrTrend: i % 3 === 0 ? "up" : i % 3 === 1 ? "flat" : "down",
        renewalDate: p2RenewalDate(renewalInDays),
        renewalInDays,
        seatsActive,
        seatsLicensed,
        creditsUsed,
        creditsLimit,
        health,
      },
    ],
    contacts: [0, 1, 2, 3].map((k) => {
      const nm = P2_CONTACT_NAMES[(i * 4 + k) % P2_CONTACT_NAMES.length];
      return {
        id: `${id}-c${k}`,
        name: nm,
        initials: p2Initials(nm),
        role: P2_ROLES[(i + k) % P2_ROLES.length],
        avatarColor: P2_AVATARS[(i + k) % P2_AVATARS.length],
        recentTouches: (i + k) % 3,
        enrolledInSequence: (i + k) % 4 === 0,
        recentConversions: (i + k) % 2,
        signals:
          k === 0 ? [sig("past-hubspot-user")] : k === 1 ? [sig("viewed-pricing")] : [],
      };
    }),
  };
});

const p2FillMetrics: Record<string, IbMetrics> = Object.fromEntries(
  p2Fill.map((c, i) => {
    const p = c.portals[0];
    return [
      c.id,
      {
        portalId: p.id,
        actionGuidance: { count: (i % 3) + 1, label: "CS: Active CM Deal, reach out to owner" },
        ibSignals: [P2_IB_SIGNALS[i % P2_IB_SIGNALS.length]],
        platformMrr: p.mrr,
        totalHubMrr: p.mrr,
        integrationsCount: 2 + ((i * 3) % 40),
        creditsConsumedMtd: p.creditsUsed,
        creditsLimit: p.creditsLimit,
        usageScore: 30 + ((i * 7) % 60),
        usageScoreTrend: [-3, 1, 4, 9, 12, -1, 7, 2][i % 8],
        whitespace: [P2_WHITESPACES[i % P2_WHITESPACES.length]],
        usersLoggedIn30d: 2 + ((i * 5) % 60),
        primaryPocEmail: `poc@${c.website}`,
        successOwner: P2_OWNERS[i % P2_OWNERS.length],
        contractManager: P2_CONTRACT_MGRS[i % P2_CONTRACT_MGRS.length],
      },
    ];
  }),
);

installBaseCompanies.push(...p2Fill);
Object.assign(IB_METRICS, p2FillMetrics);

// Adapt IB customers into the prospect `Company` shape so they can flow through
// the shared outreach strategy page (`/prospecting/strategy/:id`). Built after
// the P2 fill so it includes every customer. Prospect-only fields default.
export const installBaseStrategyCompanies: Company[] = installBaseCompanies.map(
  (c) => ({
    id: c.id,
    name: c.name,
    logo: c.logo,
    website: c.website,
    industry: c.industry,
    conversionTrigger: c.trigger?.label,
    status: "New",
    signals: c.companySignals,
    tasks: [],
    touches: {
      contactsReached: { current: 0, total: c.contacts.length },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
      deadline: earliestRenewal(c)?.renewalDate ?? "",
    },
    recommendedContacts: c.contacts,
    priority: c.tier,
  }),
);
