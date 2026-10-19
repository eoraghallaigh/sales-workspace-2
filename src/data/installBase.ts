// Install Base (customer) accounts for the IB PPF views.
//
// Mirrors the Net New prospecting model but the account — not the contact — is
// the unit. A customer company carries one or more HubSpot portals, each with
// its own MRR / renewal / seats / credits / usage, plus a curated set of
// contacts (economic buyer, champion, cross-functional leaders). See
// .context/ib-ppf-design.md for the design rationale.

import type { Company, RecommendedContact } from "@/components/CompanyCard";
import { getHubSummary, type HubSummary } from "@/data/companyCards";
import { companyDetails } from "@/data/companyDetails";
import { prospectingCompanies } from "@/data/prospectingCompanies";
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

export interface HubSpotTeam {
  salesOwner: string;
  salesSpecialistOwner: string;
  successOwner: string;
  contractManager: string;
}

const SALES_OWNERS = ["Shreya Khadka", "Tomás Alvarez", "Hannah Brooks", "Callum Reid", "Nia Okafor"];
const SALES_SPECIALIST_OWNERS = ["AJ Waterer", "Ines Moreau", "Daniel Cho", "Priyanka Rao"];

const seedFromId = (id: string): number =>
  [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

const pick = (pool: string[], seed: number): string => pool[seed % pool.length];

export const getHubSpotTeam = (id: string): HubSpotTeam | undefined => {
  const company = installBaseCompanies.find((c) => c.id === id);
  if (!company) return undefined;
  const metrics = getIbMetrics(id);
  const seed = seedFromId(id);
  return {
    salesOwner: pick(SALES_OWNERS, seed),
    salesSpecialistOwner: pick(SALES_SPECIALIST_OWNERS, seed + 1),
    successOwner:
      metrics.successOwner ?? company.csEngagement?.csmName ?? pick(P2_OWNERS, seed + 2),
    contractManager: metrics.contractManager ?? pick(P2_CONTRACT_MGRS, seed + 3),
  };
};

// --- Portals card: per-portal usage + managing team -------------------------
// The "Portals" card merges the Hub Summary (usage) with the managing team
// (HubSpot, customer and partner contacts). Teams are assigned per portal, so
// everything here is keyed on the portal id and generated deterministically.

export interface TeamContact {
  name: string;
  email?: string;
}

export interface CustomerTeamRole {
  role: string; // "Billing contact" | "Primary contact" | "Decision maker"
  contacts: TeamContact[];
}

export interface PartnerTeamRow {
  type: string; // "Sold Partner" | "Managing Partner"
  hubs?: string; // e.g. "Marketing Hub" — the hubs the partner sold
  partner: string;
  contact: TeamContact;
}

export interface PortalHubSpotTeam {
  salesOwner: string;
  contractManager: string;
  successOwner: string;
}

export interface PortalTeam {
  hubSpot?: PortalHubSpotTeam; // omitted for prospect (free) portals
  customer: CustomerTeamRole[];
  partners: PartnerTeamRow[];
}

export interface SubscriptionItem {
  name: string;
  mrrGbp: string; // "£1,800.00"
  mrrUsd: string; // "US$2,412.00"
  discounts: string[]; // each rendered on its own line; empty => "N/A"
  purchaseDate: string;
  startDate: string;
  endDate: string; // "-" when open-ended
  cancellationDate: string; // "-" when not cancelled
  inactive?: boolean; // grey dot + "Inactive" badge
  statusNote?: string; // sub-label, e.g. "Unknown status"
  cancelledByOrderId?: string; // renders "Cancelled by order #<id>" link instead of statusNote
}

export interface PortalSubscription {
  id: string; // subscription number, e.g. "5033837"
  status: string; // "Active"
  renewalDate: string;
  billingCycle: string; // "Monthly" | "Quarterly" | "Semi-annually" | "Annually"
  nextBillDate: string;
  mrrDisplay: string; // "£5,401.23" — sum of active item MRR
  items: SubscriptionItem[];
  inactiveItems: SubscriptionItem[];
}

export interface PortalCardData {
  id: string;
  name: string;
  summary: HubSummary;
  team: PortalTeam;
  subscription?: PortalSubscription; // omitted for prospect (free) portals
}

const CUSTOMER_FIRST = [
  "Scott Reynolds", "Angharad Parry-Jones", "Priya Nair", "Daniel Osei", "Laura Bennett",
  "Erin Walsh", "Ben Carter", "Marta Nowak", "Helen Choi", "Sofia Marchetti",
];

const PARTNER_FIRMS: Array<{ name: string; contact: string; domain: string }> = [
  { name: "JDR Group", contact: "Leanne Mordue", domain: "jdrgroup.co.uk" },
  { name: "Quattro", contact: "Neil Clarke", domain: "quattro.co.uk" },
  { name: "RevQore Consulting Ltd", contact: "Tanja Mitchell", domain: "revqore.com" },
  { name: "Six & Flow", contact: "Rhiannon Blackwell", domain: "sixandflow.com" },
  { name: "Huble", contact: "Marcus Feld", domain: "huble.com" },
  { name: "Avidly", contact: "Sara Lindqvist", domain: "avidly.com" },
];

const PORTAL_PLAYBOOKS = [
  "No predicted opportunity", "Expansion: Sales Hub", "Expansion: Service Hub", "Upgrade: Marketing Pro",
];
const PORTAL_INTEGRATIONS = [
  "Salesforce", "Slack", "Gmail", "Outlook", "Zapier", "Zoom", "Stripe", "Aircall", "Segment",
];
const PORTAL_MONTHS = ["Mar '26", "Apr '26", "May '26", "Jun '26"];
const PORTAL_CREATE_DATES = ["14 Mar 2018", "22 Jun 2019", "9 Sep 2020", "3 Feb 2021", "27 Jul 2022"];

const fmtNum = (n: number): string => n.toLocaleString("en-US");

const domainFromWebsite = (website?: string): string =>
  (website ?? "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") || "example.com";

const emailFor = (name: string, domain: string): string =>
  `${name.toLowerCase().replace(/[^a-z\s-]/g, "").trim().replace(/\s+/g, ".")}@${domain}`;

const HUB_TIER_RANK: Record<HubTier, number> = { Starter: 1, Pro: 2, Enterprise: 3 };

const portalTierLabel = (hubs: PortalHub[]): string => {
  const top = hubs.reduce<HubTier>(
    (max, h) => (HUB_TIER_RANK[h.tier] > HUB_TIER_RANK[max] ? h.tier : max),
    "Starter",
  );
  return top === "Pro" ? "Professional" : top;
};

const portalHubSummary = (company: IbCompany, portal: Portal): HubSummary => {
  const seed = seedFromId(portal.id);
  const tier = portalTierLabel(portal.hubs);
  const contactsUsed = 400 + (seed % 9600);
  const emailsSent = 120 + (seed % 4800);
  const emailLimit = 50000;
  const creditsUsed = portal.creditsUsed ?? 0;
  const creditsLimit = portal.creditsLimit ?? 5000;

  return {
    tier,
    hubId: portal.id,
    customerName: portal.id,
    created: PORTAL_CREATE_DATES[seed % PORTAL_CREATE_DATES.length],
    domain: domainFromWebsite(company.website),
    activeUsers: { active: portal.seatsActive, total: portal.seatsLicensed },
    usageIntentScore: `US$${80 + (seed % 320)}`,
    usageIntentPlaybook: PORTAL_PLAYBOOKS[seed % PORTAL_PLAYBOOKS.length],
    firstPurchase: PORTAL_CREATE_DATES[(seed + 2) % PORTAL_CREATE_DATES.length],
    eligibility: `This portal is eligible for marketing contacts`,
    limits: [
      {
        label: "Contacts",
        usedLabel: `${fmtNum(contactsUsed)} of No limit contacts used`,
        pct: 6,
      },
      {
        label: "Core Seats",
        usedLabel: `${portal.seatsActive} of ${portal.seatsLicensed} Core Seats assigned`,
        pct: Math.min(100, Math.round((portal.seatsActive / Math.max(portal.seatsLicensed, 1)) * 100)),
        note: `(${tier})`,
      },
      {
        label: "Credits",
        usedLabel: `${fmtNum(creditsUsed)} of ${fmtNum(creditsLimit)} credits used this month`,
        pct: Math.min(100, Math.round((creditsUsed / Math.max(creditsLimit, 1)) * 100)),
      },
      {
        label: "Emails",
        usedLabel: `${fmtNum(emailsSent)} of ${fmtNum(emailLimit)} emails sent this month`,
        pct: Math.max(2, Math.round((emailsSent / emailLimit) * 100)),
      },
    ],
    usageOverTime: {
      contacts: PORTAL_MONTHS.map((month, i) => ({
        month,
        value: contactsUsed - (3 - i) * (40 + (seed % 120)),
      })),
      emails: PORTAL_MONTHS.map((month, i) => ({
        month,
        value: (seed + i * 11) % 60,
      })),
    },
    integrations: PORTAL_INTEGRATIONS.filter((_, i) => (seed >> i) % 3 === 0).slice(0, 4),
    trials: [],
  };
};

const portalTeam = (company: IbCompany, portal: Portal): PortalTeam => {
  const seed = seedFromId(portal.id);
  const metrics = getIbMetrics(company.id);
  const domain = domainFromWebsite(company.website);

  const named = company.contacts.map((c) => c.name).filter(Boolean);
  const pool = named.length > 0 ? named : CUSTOMER_FIRST;
  const customerName = (salt: number) => pool[(seed + salt) % pool.length];

  const primary = customerName(0);
  const decisionMaker = customerName(1);

  const customer: CustomerTeamRole[] = [
    {
      role: "Billing contact",
      contacts: [
        { name: "Finance Team", email: `finance@${domain}` },
        { name: customerName(2), email: emailFor(customerName(2), domain) },
      ],
    },
    {
      role: "Primary contact",
      contacts: [{ name: primary, email: emailFor(primary, domain) }],
    },
    {
      role: "Decision maker",
      contacts: [{ name: decisionMaker, email: emailFor(decisionMaker, domain) }],
    },
  ];

  // Sold partners are tied to specific hubs; a managing partner oversees the account.
  const soldCount = seed % 3; // 0–2 sold-partner rows
  const partners: PartnerTeamRow[] = [];
  for (let i = 0; i < soldCount; i += 1) {
    const firm = PARTNER_FIRMS[(seed + i) % PARTNER_FIRMS.length];
    const hub = portal.hubs[i % portal.hubs.length];
    partners.push({
      type: "Sold Partner",
      hubs: `${hub.hub} Hub`,
      partner: firm.name,
      contact: { name: firm.contact, email: emailFor(firm.contact, firm.domain) },
    });
  }
  const managing = PARTNER_FIRMS[(seed + soldCount + 2) % PARTNER_FIRMS.length];
  partners.push({
    type: "Managing Partner",
    partner: managing.name,
    contact: { name: managing.contact, email: emailFor(managing.contact, managing.domain) },
  });

  return {
    hubSpot: {
      salesOwner: pick(SALES_OWNERS, seed),
      contractManager: metrics.contractManager ?? pick(P2_CONTRACT_MGRS, seed + 1),
      successOwner:
        metrics.successOwner ?? company.csEngagement?.csmName ?? pick(P2_OWNERS, seed + 2),
    },
    customer,
    partners,
  };
};

const GBP_TO_USD = 1.34;
const money = (symbol: string, n: number): string =>
  `${symbol}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const gbp = (n: number): string => money("£", n);
const usd = (n: number): string => money("US$", n * GBP_TO_USD);

const BILLING_CYCLES = ["Monthly", "Quarterly", "Semi-annually", "Annually"];
const SUB_DATES = ["Apr 1, 2025", "Aug 12, 2025", "Jul 16, 2025", "Jan 3, 2025", "Nov 20, 2024"];
const SUB_BILL_DATES = ["Jan 26, 2027", "Mar 12, 2027", "Nov 19, 2026", "Aug 4, 2027"];
const SUB_ADDONS: Array<{ name: string; gbp: number; discounts?: string[] }> = [
  { name: "20,000 Additional Marketing Contacts", gbp: 98.4, discounts: ["Custom discount (40%) £65.60"] },
  { name: "10 Core Seats (Enterprise)", gbp: 700 },
  { name: "8 Granted Core Seats", gbp: 0 },
  { name: "Reporting Limit Increase (1 Unit)", gbp: 175 },
  { name: "Dedicated IP", gbp: 300 },
  { name: "API Limit Increase (2 Units)", gbp: 250 },
];
const SUB_DISCOUNTS: string[][] = [
  [],
  ["Custom discount (40%) £1,200.00"],
  ["Price Migration Discount £278.55", "Custom discount (30.8%) £828.97"],
  ["Price Migration Discount £93.52", "Custom discount (30.2%) £331.14"],
];

const SUB_INACTIVE_TEMPLATES: Array<{
  name: string;
  gbp: number;
  pct?: number;
  cancelled?: boolean;
}> = [
  { name: "Marketing Hub Professional - Marketing Contacts (Includes 2,000 Marketing Contacts)", gbp: 617.44, pct: 25 },
  { name: "35,000 Additional Marketing Contacts", gbp: 1245, pct: 25 },
  { name: "Sales Hub Professional (Includes 5 Users)", gbp: 230, pct: 50, cancelled: true },
  { name: "Sales Hub Professional Additional Users (2 Users)", gbp: 90, pct: 50, cancelled: true },
  { name: "Service Hub Starter (2 Seats)", gbp: 40, cancelled: true },
  { name: "Legacy Reporting Add-on", gbp: 120 },
  { name: "Operations Hub Starter", gbp: 50 },
];
const SUB_END_DATES = ["Jun 15, 2026", "Jun 22, 2023", "Dec 1, 2025", "Mar 30, 2024", "Sep 9, 2025"];
const round2 = (n: number): number => Math.round(n * 100) / 100;

const hubTierFull = (tier: HubTier): string => (tier === "Pro" ? "Professional" : tier);

const hubBaseMrr = (tier: HubTier, seed: number): number => {
  const base = tier === "Enterprise" ? 1800 : tier === "Pro" ? 765 : 200;
  return base + (seed % 7) * 25;
};

const hubDetail = (hub: PortalHub, portal: Portal): string => {
  if (hub.hub === "Marketing") return "(Includes 5 Core Seats, 10,000 Marketing Contacts)";
  if (hub.hub === "Sales") return `(${portal.seatsLicensed} Sales Seats)`;
  if (hub.hub === "Service") return `(${portal.seatsLicensed} Service Seats)`;
  return "";
};

const portalSubscription = (portal: Portal): PortalSubscription => {
  const seed = seedFromId(portal.id);

  const hubItems: SubscriptionItem[] = portal.hubs.map((hub, idx) => {
    const amount = hubBaseMrr(hub.tier, seed + idx);
    const detail = hubDetail(hub, portal);
    return {
      name: `${hub.hub} Hub ${hubTierFull(hub.tier)}${detail ? ` ${detail}` : ""}`,
      mrrGbp: gbp(amount),
      mrrUsd: usd(amount),
      discounts: SUB_DISCOUNTS[(seed + idx) % SUB_DISCOUNTS.length],
      purchaseDate: SUB_DATES[(seed + idx) % SUB_DATES.length],
      startDate: SUB_DATES[(seed + idx) % SUB_DATES.length],
      endDate: "-",
      cancellationDate: "-",
    };
  });

  const addonCount = 2 + (seed % 3); // 2–4 add-ons
  const addonItems: SubscriptionItem[] = Array.from({ length: addonCount }, (_, k) => {
    const addon = SUB_ADDONS[(seed + k) % SUB_ADDONS.length];
    const date = SUB_DATES[(seed + k + 1) % SUB_DATES.length];
    return {
      name: addon.name,
      mrrGbp: gbp(addon.gbp),
      mrrUsd: usd(addon.gbp),
      discounts: addon.discounts ?? [],
      purchaseDate: date,
      startDate: date,
      endDate: "-",
      cancellationDate: "-",
    };
  });

  const items = [...hubItems, ...addonItems];
  const total = [...portal.hubs].reduce((sum, h, idx) => sum + hubBaseMrr(h.tier, seed + idx), 0)
    + addonItems.reduce((sum, _, k) => sum + SUB_ADDONS[(seed + k) % SUB_ADDONS.length].gbp, 0);

  const inactiveCount = 4 + (seed % 4); // 4–7 inactive items
  const inactiveItems: SubscriptionItem[] = Array.from({ length: inactiveCount }, (_, k) => {
    const t = SUB_INACTIVE_TEMPLATES[(seed + k) % SUB_INACTIVE_TEMPLATES.length];
    const date = SUB_DATES[(seed + k) % SUB_DATES.length];
    return {
      name: t.name,
      mrrGbp: gbp(t.gbp),
      mrrUsd: usd(t.gbp),
      discounts: t.pct ? [`Custom discount (${t.pct}%) ${gbp(round2(t.gbp * (t.pct / 100)))}`] : [],
      purchaseDate: date,
      startDate: date,
      endDate: SUB_END_DATES[(seed + k) % SUB_END_DATES.length],
      cancellationDate: SUB_END_DATES[(seed + k + 1) % SUB_END_DATES.length],
      inactive: true,
      statusNote: t.cancelled ? undefined : "Unknown status",
      cancelledByOrderId: t.cancelled ? String(16_000_000 + ((seed + k) % 900_000)) : undefined,
    };
  });

  return {
    id: String(5_000_000 + (seed % 900_000)),
    status: "Active",
    renewalDate: portal.renewalDate,
    billingCycle: BILLING_CYCLES[seed % BILLING_CYCLES.length],
    nextBillDate: SUB_BILL_DATES[seed % SUB_BILL_DATES.length],
    mrrDisplay: gbp(total),
    items,
    inactiveItems,
  };
};

export const getPortalsCardData = (companyId: string): PortalCardData[] => {
  const company = installBaseCompanies.find((c) => c.id === companyId);
  if (!company) return [];
  return company.portals.map((portal) => ({
    id: portal.id,
    name: portal.name,
    summary: portalHubSummary(company, portal),
    team: portalTeam(company, portal),
    subscription: portalSubscription(portal),
  }));
};

// Net-new prospects reuse the Portals card as a free-portal variant: the Hub
// Summary usage plus a Customer team, but no subscription (free, 0 MRR) and no
// HubSpot or partner team.
export const getProspectPortalsCardData = (companyId: string): PortalCardData[] => {
  const company = prospectingCompanies.find((c) => c.id === companyId);
  if (!company) return [];
  // Most net-new prospects have no HubSpot portal at all — only those with a
  // portal on their record get a (free) portal card; everyone else is empty.
  if (!companyDetails[companyId]?.portals?.length) return [];
  const summary = getHubSummary(companyId);
  const domain = domainFromWebsite(company.website);
  const names = company.recommendedContacts.map((c) => c.name).filter(Boolean);

  const customer: CustomerTeamRole[] = [];
  if (names[0]) {
    customer.push({
      role: "Primary contact",
      contacts: [{ name: names[0], email: emailFor(names[0], domain) }],
    });
  }
  const decisionMaker = names[1] ?? names[0];
  if (decisionMaker) {
    customer.push({
      role: "Decision maker",
      contacts: [{ name: decisionMaker, email: emailFor(decisionMaker, domain) }],
    });
  }

  return [
    {
      id: summary.hubId,
      name: company.name,
      summary,
      team: { customer, partners: [] },
    },
  ];
};

// --- FSC (Flexible Seats & Credits) portal card -----------------------------
// Under FSC customers buy seats + credits rather than Hubs: the portal has a
// single edition, the tiers-limits block is replaced by a Credits & Capacity
// view, and subscription line items are seats/capacity packs. This is a
// separate card variant — the legacy card above is untouched for non-FSC
// customers. Only companies in FSC_COMPANY_IDS use the FSC card.
const FSC_COMPANY_IDS = new Set<string>(["harbor-dental"]);
export const isFscCompany = (companyId: string): boolean => FSC_COMPANY_IDS.has(companyId);

export interface CreditCapacityRow {
  label: string;
  group: "top" | "usage"; // top = seats/credits; usage = "HubSpot on Credits Usage"
  usedLabel?: string; // "2 of 2 GTM Seats assigned"
  pct?: number; // 0–100 bar fill
  message?: string; // e.g. "This portal does not have a Email Sends Bundle"
  note?: string; // e.g. "Additional workflow actions used 36 credits"
}

export interface CreditUsageDatum {
  label: string;
  billed: number;
  nonBilled: number;
}

export interface FscPortalCardData {
  id: string;
  edition: string; // single portal-level edition
  summary: HubSummary; // reused for key facts / integrations / charts
  capacity: CreditCapacityRow[];
  creditUsage: CreditUsageDatum[];
  team: PortalTeam;
  subscription: PortalSubscription;
}

const fscCapacity = (): CreditCapacityRow[] => [
  { group: "top", label: "GTM Seats", usedLabel: "2 of 2 GTM Seats assigned", pct: 100 },
  { group: "top", label: "HubSpot Credits", usedLabel: `0 of ${fmtNum(20000)} HubSpot Credits used`, pct: 0 },
  { group: "usage", label: "Records", usedLabel: `16 of ${fmtNum(250000)} Records assigned`, pct: 1 },
  { group: "usage", label: "Calling", usedLabel: "0 of 500 minutes", pct: 0 },
  { group: "usage", label: "Custom Events", usedLabel: `0 of ${fmtNum(2500000)} event completions`, pct: 0 },
  { group: "usage", label: "Email Sends", message: "This portal does not have a Email Sends Bundle", pct: 0 },
  {
    group: "usage",
    label: "Workflow Actions (Non-AI Executions)",
    message: "This portal does not have a Workflow Actions Bundle",
    note: "Additional workflow actions used 36 credits",
    pct: 0,
  },
  {
    group: "usage",
    label: "CONVERSATIONAL_CONTEXT_RECORD_ANALYSIS",
    usedLabel: "0 of 500 CONVERSATIONAL_CONTEXT_RECORD_ANALYSIS assigned",
    pct: 0,
  },
];

const fscCreditUsage = (seed: number): CreditUsageDatum[] =>
  Array.from({ length: 12 }, (_, i) => ({
    label: `${i * 2 + 1} Nov`,
    billed: (seed + i * 7) % 6,
    nonBilled: (seed + i * 3) % 3,
  }));

const fscSubscription = (portal: Portal, edition: string): PortalSubscription => {
  const seed = seedFromId(portal.id);
  const seats = 3 + (seed % 5);
  const date = "Oct 5, 2026";
  const items: SubscriptionItem[] = [
    {
      name: `${seats} GTM Seats (${edition})`,
      mrrGbp: gbp(153.33),
      mrrUsd: usd(153.33),
      discounts: ["Custom discount (43.21%) £116.67"],
      purchaseDate: date,
      startDate: date,
      endDate: "-",
      cancellationDate: "-",
    },
    {
      name: "Growth Workflow Actions Capacity Pack (500,000 Workflow Actions)",
      mrrGbp: gbp(76.67),
      mrrUsd: usd(76.67),
      discounts: ["Custom discount (43.21%) £58.33"],
      purchaseDate: date,
      startDate: date,
      endDate: "-",
      cancellationDate: "-",
    },
  ];
  return {
    id: String(113_000_000 + (seed % 900_000)),
    status: "Active",
    renewalDate: portal.renewalDate,
    billingCycle: "Monthly",
    nextBillDate: SUB_BILL_DATES[seed % SUB_BILL_DATES.length],
    mrrDisplay: gbp(230),
    items,
    inactiveItems: [],
  };
};

export const getFscPortalsCardData = (companyId: string): FscPortalCardData[] => {
  const company = installBaseCompanies.find((c) => c.id === companyId);
  if (!company) return [];
  return company.portals.map((portal) => {
    const edition = portalTierLabel(portal.hubs); // single portal-level edition
    return {
      id: portal.id,
      edition,
      summary: { ...portalHubSummary(company, portal), tier: edition },
      capacity: fscCapacity(),
      creditUsage: fscCreditUsage(seedFromId(portal.id)),
      team: portalTeam(company, portal),
      subscription: fscSubscription(portal, edition),
    };
  });
};
