import type { RecommendedContact } from "@/components/CompanyCard";
import { sig, type SignalInstance } from "@/data/signals";

const avatarColors = [
  "bg-trellis-purple-600",
  "bg-trellis-blue-600",
  "bg-trellis-teal-600",
  "bg-trellis-green-600",
  "bg-trellis-orange-500",
  "bg-trellis-pink-600",
  "bg-trellis-indigo-600",
  "bg-trellis-magenta-800",
];

const pick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];

const SIGNALS = {
  VIEWED_PRICING: sig("viewed-pricing"),
  PAST_HUBSPOT_USER: sig("past-hubspot-user"),
  RECENT_QL: sig("recent-ql"),
  ATTENDED_WEBINAR: sig("attended-webinar"),
  RECENT_HIRE: sig("recent-hire"),
} satisfies Record<string, SignalInstance>;

type AdditionalContactSeed = {
  name: string;
  role: string;
  signals?: Array<keyof typeof SIGNALS>;
};

const initialsFromName = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const buildContact = (
  companyId: string,
  index: number,
  seed: AdditionalContactSeed,
): RecommendedContact => ({
  id: `ac-${companyId}-${index}`,
  name: seed.name,
  initials: initialsFromName(seed.name),
  role: seed.role,
  avatarColor: pick(avatarColors, seed.name.length + index),
  recentTouches: index % 3,
  enrolledInSequence: index % 2 === 0,
  recentConversions: index % 4 === 0 ? 1 : 0,
  signals: (seed.signals ?? []).map((key) => SIGNALS[key]),
});

// Broader pool of non-recommended contacts per company. These are
// intentionally less-targeted (support roles, adjacent departments,
// junior contacts) so reps can extend outreach when the recommended
// contacts aren't enough or aren't right.
const SEED: Record<string, AdditionalContactSeed[]> = {
  "1": [
    { name: "Liam Patterson", role: "Senior Content Strategist", signals: ["VIEWED_PRICING"] },
    { name: "Ava Coleman", role: "SEO Manager" },
    { name: "Noah Richards", role: "Brand Designer", signals: ["ATTENDED_WEBINAR"] },
    { name: "Isabella Nguyen", role: "Events Manager" },
    { name: "Ethan Walsh", role: "Partner Marketing Lead", signals: ["RECENT_HIRE"] },
    { name: "Mia Foster", role: "Customer Advocacy Manager" },
  ],
  "2": [
    { name: "Oliver Banks", role: "Staff Engineer" },
    { name: "Charlotte Reyes", role: "Senior Data Scientist", signals: ["RECENT_QL"] },
    { name: "Elijah Morris", role: "Solutions Engineer" },
    { name: "Amelia Carter", role: "Product Analytics Lead", signals: ["ATTENDED_WEBINAR"] },
    { name: "Mason Wright", role: "VP Finance" },
    { name: "Harper Bennett", role: "Chief of Staff", signals: ["PAST_HUBSPOT_USER"] },
  ],
  "3": [
    { name: "Lucas Hawkins", role: "Content Operations" },
    { name: "Evelyn Torres", role: "Marketing Ops Manager", signals: ["VIEWED_PRICING"] },
    { name: "Henry Diaz", role: "Creative Director" },
    { name: "Abigail Simmons", role: "Lifecycle Marketing" },
    { name: "Sebastian Hayes", role: "Head of Communications", signals: ["ATTENDED_WEBINAR"] },
    { name: "Emily Price", role: "Social Media Manager" },
  ],
  "4": [
    { name: "Aiden Brooks", role: "Principal Data Engineer", signals: ["RECENT_QL"] },
    { name: "Zoey Hughes", role: "BI Developer" },
    { name: "Daniel Ramos", role: "Head of ML" },
    { name: "Aria Mitchell", role: "VP Sales", signals: ["PAST_HUBSPOT_USER"] },
    { name: "Matthew Ward", role: "Data Platform Lead" },
    { name: "Scarlett Bell", role: "Analytics PM", signals: ["VIEWED_PRICING"] },
  ],
  "5": [
    { name: "Jackson Perry", role: "Cloud Architect" },
    { name: "Layla Jenkins", role: "Security Engineering Lead", signals: ["ATTENDED_WEBINAR"] },
    { name: "Levi Howard", role: "QA Director" },
    { name: "Chloe Barnes", role: "Release Manager" },
    { name: "Wyatt Gray", role: "SRE Lead", signals: ["RECENT_HIRE"] },
    { name: "Penelope Long", role: "Engineering Ops" },
  ],
  "6": [
    { name: "Owen Fletcher", role: "Procurement Manager" },
    { name: "Lily Sanders", role: "Warehouse Operations", signals: ["VIEWED_PRICING"] },
    { name: "Caleb Price", role: "Distribution Lead" },
    { name: "Ellie Rivera", role: "VP HR" },
    { name: "Julian Webb", role: "Finance Controller", signals: ["RECENT_QL"] },
    { name: "Stella Graham", role: "Operations Analyst" },
  ],
  "7": [
    { name: "Anthony Blake", role: "Channel Partnerships", signals: ["PAST_HUBSPOT_USER"] },
    { name: "Nora Powell", role: "BD Associate" },
    { name: "Nathan Ross", role: "Regional Partner Manager" },
    { name: "Hazel Cooper", role: "Account Executive", signals: ["VIEWED_PRICING"] },
    { name: "Thomas Lane", role: "Sales Engineer" },
    { name: "Victoria Reed", role: "VP Partnerships" },
  ],
  "8": [
    { name: "Charles Brooks", role: "Principal Product Designer" },
    { name: "Aurora Hill", role: "Product Marketing Manager", signals: ["ATTENDED_WEBINAR"] },
    { name: "Andrew Duncan", role: "UX Writer" },
    { name: "Luna Graham", role: "Design System Lead" },
    { name: "Joseph Snyder", role: "Head of Research", signals: ["RECENT_QL"] },
    { name: "Riley Perry", role: "Product Analyst" },
  ],
  "9": [
    { name: "Joshua Hart", role: "CX Manager" },
    { name: "Maya Washington", role: "Digital Merchandising Lead", signals: ["VIEWED_PRICING"] },
    { name: "Isaiah Ford", role: "Fulfillment Manager" },
    { name: "Aaliyah Bell", role: "Subscription Growth Lead" },
    { name: "Christian Grant", role: "Head of Paid Media", signals: ["RECENT_HIRE"] },
    { name: "Paisley Hunt", role: "Conversion Optimisation" },
  ],
  "10": [
    { name: "Ryan Mitchell", role: "Senior Field Marketer" },
    { name: "Natalie Ortiz", role: "Partner Marketing Manager", signals: ["PAST_HUBSPOT_USER"] },
    { name: "Carter West", role: "VP Revenue Operations" },
    { name: "Savannah Gardner", role: "Enablement Lead" },
    { name: "Hunter Stone", role: "Sales Ops Analyst", signals: ["RECENT_QL"] },
    { name: "Bella Fleming", role: "Deal Desk Lead" },
  ],
  "11": [
    { name: "Austin Wallace", role: "Commercial Counsel" },
    { name: "Camila Bryant", role: "Head of Compliance", signals: ["ATTENDED_WEBINAR"] },
    { name: "Leo Shaw", role: "Privacy Engineer" },
    { name: "Valentina Reese", role: "Procurement Lead" },
    { name: "Asher Lloyd", role: "Vendor Manager", signals: ["VIEWED_PRICING"] },
    { name: "Aubrey Warren", role: "IT Director" },
  ],
  "12": [
    { name: "Christopher Hunt", role: "Revenue Operations Lead", signals: ["RECENT_HIRE"] },
    { name: "Gabriella Craig", role: "Marketing Operations Manager" },
    { name: "David Osborne", role: "Sales Development Manager" },
    { name: "Jade Morales", role: "Customer Marketing Lead", signals: ["RECENT_QL"] },
    { name: "Samuel Cain", role: "Growth Marketing" },
    { name: "Willow Porter", role: "Senior Copywriter" },
  ],
  "13": [
    { name: "Jonah Bryant", role: "Finance Business Partner" },
    { name: "Clara Vaughn", role: "Strategic Finance Manager", signals: ["ATTENDED_WEBINAR"] },
    { name: "Theo Larson", role: "Controller" },
    { name: "Elena Chan", role: "FP&A Lead", signals: ["VIEWED_PRICING"] },
    { name: "Miles Doyle", role: "Treasurer" },
    { name: "Ruby Chase", role: "Head of Accounting" },
  ],
  "14": [
    { name: "Parker Ellis", role: "Growth Product Manager" },
    { name: "Sienna Wise", role: "Lifecycle Marketing Lead", signals: ["PAST_HUBSPOT_USER"] },
    { name: "Bennett Powell", role: "Retention Marketing" },
    { name: "Maeve Harding", role: "Head of Brand" },
    { name: "Xavier Tate", role: "Creative Operations", signals: ["RECENT_QL"] },
    { name: "Iris Malone", role: "PR Manager" },
  ],
  "15": [
    { name: "Declan Hooper", role: "Head of Engineering" },
    { name: "Rosalie Dean", role: "Senior Software Engineer" },
    { name: "Silas Knight", role: "Engineering Manager", signals: ["RECENT_HIRE"] },
    { name: "Delilah Franklin", role: "Tech Lead", signals: ["ATTENDED_WEBINAR"] },
    { name: "Rowan Barrett", role: "Staff SRE" },
    { name: "Josephine Price", role: "Platform Engineer" },
  ],
  "16": [
    { name: "August Blackburn", role: "VP Customer Success", signals: ["RECENT_QL"] },
    { name: "Margot Suarez", role: "CS Operations Lead" },
    { name: "Finn Avery", role: "Renewals Manager" },
    { name: "Cora Sullivan", role: "Support Team Lead" },
    { name: "Kai Preston", role: "Onboarding Manager", signals: ["VIEWED_PRICING"] },
    { name: "Adeline Pope", role: "Implementation Lead" },
  ],
  "17": [
    { name: "Beckett Flynn", role: "VP Marketing" },
    { name: "Elise Morgan", role: "Content Director", signals: ["PAST_HUBSPOT_USER"] },
    { name: "Rhett Porter", role: "Demand Gen Lead" },
    { name: "Juniper Banks", role: "ABM Manager" },
    { name: "Milo Greene", role: "Marketing Analyst", signals: ["ATTENDED_WEBINAR"] },
    { name: "Sloane Carroll", role: "Events Lead" },
  ],
  "18": [
    { name: "Reid Sullivan", role: "Enterprise AE" },
    { name: "Freya Mack", role: "Mid-Market AE", signals: ["VIEWED_PRICING"] },
    { name: "Crew Delaney", role: "Sales Manager" },
    { name: "Hattie Copeland", role: "Sales Ops" },
    { name: "Cyrus Barlow", role: "BDR Lead", signals: ["RECENT_HIRE"] },
    { name: "Blair Holt", role: "Revenue Enablement" },
  ],
  "19": [
    { name: "Sawyer Hanson", role: "Head of Product", signals: ["RECENT_QL"] },
    { name: "Lyla Pace", role: "Group Product Manager" },
    { name: "Kingston Drake", role: "Technical PM" },
    { name: "Emery Stafford", role: "Senior Product Manager", signals: ["PAST_HUBSPOT_USER"] },
    { name: "Dante Chase", role: "Product Marketing" },
    { name: "Ophelia Roberts", role: "UX Researcher" },
  ],
  "20": [
    { name: "Archer Woods", role: "Director of Strategy" },
    { name: "Celeste Abbott", role: "Strategy & Ops", signals: ["ATTENDED_WEBINAR"] },
    { name: "Gideon Moss", role: "Corporate Development" },
    { name: "Esme Vega", role: "BizOps Lead" },
    { name: "Ronan Burke", role: "VP Operations", signals: ["VIEWED_PRICING"] },
    { name: "Meadow Price", role: "Chief of Staff" },
  ],
};

const ALL_CONTACTS: Record<string, RecommendedContact[]> = Object.fromEntries(
  Object.entries(SEED).map(([companyId, seeds]) => [
    companyId,
    seeds.map((seed, index) => buildContact(companyId, index, seed)),
  ]),
);

export const getAdditionalContactsForCompany = (
  companyId: string,
): RecommendedContact[] => ALL_CONTACTS[companyId] ?? [];

// Generic pool offered by views whose rows aren't in the curated map above
// (e.g. the Full Prospect / Customer books), so "Add contacts" still works.
export const genericAdditionalContacts: RecommendedContact[] = [
  { id: "gen-morgan-avery", name: "Morgan Avery", initials: "MA", role: "VP Operations", avatarColor: "bg-trellis-blue-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, signals: [] },
  { id: "gen-riley-chen", name: "Riley Chen", initials: "RC", role: "Director of IT", avatarColor: "bg-trellis-purple-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, signals: [] },
  { id: "gen-sam-okafor", name: "Sam Okafor", initials: "SO", role: "Head of Procurement", avatarColor: "bg-trellis-green-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, signals: [] },
  { id: "gen-jordan-lee", name: "Jordan Lee", initials: "JL", role: "Finance Manager", avatarColor: "bg-trellis-orange-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, signals: [] },
];
