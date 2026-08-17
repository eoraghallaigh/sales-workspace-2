import { Company } from "@/components/CompanyCard";
import { deriveTouchesForContact } from "@/data/deriveTouches";
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

const getRandomColor = () => avatarColors[Math.floor(Math.random() * avatarColors.length)];

// Contact-level intent signals. Each references a signal id in the catalog
// (src/data/signals.ts); the chip resolves its label, colour, and popover.
const SIGNALS = {
  VIEWED_PRICING: sig("viewed-pricing"),
  PAST_HUBSPOT_USER: sig("past-hubspot-user"),
  RECENT_QL: sig("recent-ql"),
  ATTENDED_WEBINAR: sig("attended-webinar"),
  RECENT_HIRE: sig("recent-hire"),
} satisfies Record<string, SignalInstance>;

// Company-level intent signals, authored per company with specific detail.
const COMPANY_SIGNALS: Record<string, SignalInstance[]> = {
  "1": [
    sig("funding-round", {
      headline: "Raised $28M Series B",
      rows: [
        { label: "Round", value: "Series B" },
        { label: "Amount", value: "$28M" },
        { label: "Announced", value: "12 Mar 2026" },
        { label: "Lead investor", value: "Accel" },
      ],
      footnote: "Source: Crunchbase",
    }),
    sig("hiring-surge", {
      headline: "24 open roles, up 45% this quarter",
      rows: [
        { label: "Open roles", value: "24" },
        { label: "Concentrated in", value: "Sales" },
        { label: "Trend", value: "+45% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
  ],
  "2": [
    sig("new-hire", {
      headline: "Marcus Bell joined as Chief Revenue Officer",
      rows: [
        { label: "Joined", value: "last month" },
        { label: "Role", value: "Chief Revenue Officer" },
        { label: "Previously at", value: "Gong" },
      ],
      footnote: "Source: LinkedIn",
    }),
    sig("tech-stack-change", {
      headline: "Adopted Snowflake, replacing a legacy warehouse",
      rows: [
        { label: "Added", value: "Snowflake" },
        { label: "Replaced", value: "a legacy warehouse" },
        { label: "Category", value: "Data platform" },
        { label: "When", value: "detected this month" },
      ],
      footnote: "Source: BuiltWith",
    }),
  ],
  "3": [
    sig("hiring-surge", {
      headline: "18 open roles, up 32% this quarter",
      rows: [
        { label: "Open roles", value: "18" },
        { label: "Concentrated in", value: "Engineering" },
        { label: "Trend", value: "+32% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
    sig("former-customer", {
      headline: "Previously a Sales Hub customer",
      rows: [
        { label: "Product", value: "Sales Hub" },
        { label: "Active", value: "2020–2022" },
        { label: "Churned", value: "switched at renewal" },
      ],
      footnote: "Source: CRM history",
    }),
  ],
  "4": [
    sig("funding-round", {
      headline: "Raised $65M Series C",
      rows: [
        { label: "Round", value: "Series C" },
        { label: "Amount", value: "$65M" },
        { label: "Announced", value: "28 Apr 2026" },
        { label: "Lead investor", value: "Insight Partners" },
      ],
      footnote: "Source: Crunchbase",
    }),
    sig("new-hire", {
      headline: "Priya Anand joined as VP of Marketing",
      rows: [
        { label: "Joined", value: "6 weeks ago" },
        { label: "Role", value: "VP of Marketing" },
        { label: "Previously at", value: "Segment" },
      ],
      footnote: "Source: LinkedIn",
    }),
  ],
  "5": [
    sig("hiring-surge", {
      headline: "42 open roles, up 60% this quarter",
      rows: [
        { label: "Open roles", value: "42" },
        { label: "Concentrated in", value: "Engineering" },
        { label: "Trend", value: "+60% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
    sig("tech-stack-change", {
      headline: "Adopted Segment, replacing in-house tracking",
      rows: [
        { label: "Added", value: "Segment" },
        { label: "Replaced", value: "in-house tracking" },
        { label: "Category", value: "Customer data" },
        { label: "When", value: "detected 3 weeks ago" },
      ],
      footnote: "Source: BuiltWith",
    }),
  ],
  "6": [
    sig("former-customer", {
      headline: "Previously a Marketing Hub customer",
      rows: [
        { label: "Product", value: "Marketing Hub" },
        { label: "Active", value: "2019–2024" },
        { label: "Churned", value: "paused after a reorg" },
      ],
      footnote: "Source: CRM history",
    }),
    sig("new-hire", {
      headline: "Helen Choi joined as Chief Marketing Officer",
      rows: [
        { label: "Joined", value: "2 months ago" },
        { label: "Role", value: "Chief Marketing Officer" },
        { label: "Previously at", value: "Klaviyo" },
      ],
      footnote: "Source: LinkedIn",
    }),
  ],
  "7": [
    sig("funding-round", {
      headline: "Raised $12M Series A",
      rows: [
        { label: "Round", value: "Series A" },
        { label: "Amount", value: "$12M" },
        { label: "Announced", value: "2 Feb 2026" },
        { label: "Lead investor", value: "Bessemer" },
      ],
      footnote: "Source: Crunchbase",
    }),
    sig("hiring-surge", {
      headline: "18 open roles, up 28% this quarter",
      rows: [
        { label: "Open roles", value: "18" },
        { label: "Concentrated in", value: "Delivery" },
        { label: "Trend", value: "+28% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
  ],
  "8": [
    sig("new-hire", {
      headline: "Tomás Rivera joined as VP of Sales",
      rows: [
        { label: "Joined", value: "3 weeks ago" },
        { label: "Role", value: "VP of Sales" },
        { label: "Previously at", value: "Outreach" },
      ],
      footnote: "Source: LinkedIn",
    }),
    sig("tech-stack-change", {
      headline: "Adopted Outreach, replacing manual sequences",
      rows: [
        { label: "Added", value: "Outreach" },
        { label: "Replaced", value: "manual sequences" },
        { label: "Category", value: "Sales engagement" },
        { label: "When", value: "detected in April 2026" },
      ],
      footnote: "Source: BuiltWith",
    }),
  ],
  "9": [
    sig("funding-round", {
      headline: "Raised $40M Series B",
      rows: [
        { label: "Round", value: "Series B" },
        { label: "Amount", value: "$40M" },
        { label: "Announced", value: "19 May 2026" },
        { label: "Lead investor", value: "a16z" },
      ],
      footnote: "Source: Crunchbase",
    }),
    sig("hiring-surge", {
      headline: "31 open roles, up 51% this quarter",
      rows: [
        { label: "Open roles", value: "31" },
        { label: "Concentrated in", value: "Marketing" },
        { label: "Trend", value: "+51% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
  ],
  "10": [
    sig("former-customer", {
      headline: "Previously a Service Hub customer",
      rows: [
        { label: "Product", value: "Service Hub" },
        { label: "Active", value: "for 18 months" },
        { label: "Churned", value: "downgraded during a cost review" },
      ],
      footnote: "Source: CRM history",
    }),
    sig("new-hire", {
      headline: "Dana Whitfield joined as VP of Marketing",
      rows: [
        { label: "Joined", value: "last month" },
        { label: "Role", value: "VP of Marketing" },
        { label: "Previously at", value: "Ramp" },
      ],
      footnote: "Source: LinkedIn",
    }),
  ],
  "11": [
    sig("hiring-surge", {
      headline: "24 open roles, up 45% this quarter",
      rows: [
        { label: "Open roles", value: "24" },
        { label: "Concentrated in", value: "Content & Sales" },
        { label: "Trend", value: "+45% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
    sig("tech-stack-change", {
      headline: "Adopted Marketo, replacing Pardot",
      rows: [
        { label: "Added", value: "Marketo" },
        { label: "Replaced", value: "Pardot" },
        { label: "Category", value: "Marketing automation" },
        { label: "When", value: "detected last quarter" },
      ],
      footnote: "Source: BuiltWith",
    }),
  ],
  "12": [
    sig("funding-round", {
      headline: "Raised $18M Series A",
      rows: [
        { label: "Round", value: "Series A" },
        { label: "Amount", value: "$18M" },
        { label: "Announced", value: "8 Jan 2026" },
        { label: "Lead investor", value: "Sequoia" },
      ],
      footnote: "Source: Crunchbase",
    }),
    sig("new-hire", {
      headline: "Marcus Bell joined as Head of Growth",
      rows: [
        { label: "Joined", value: "6 weeks ago" },
        { label: "Role", value: "Head of Growth" },
        { label: "Previously at", value: "Notion" },
      ],
      footnote: "Source: LinkedIn",
    }),
  ],
  "13": [
    sig("tech-stack-change", {
      headline: "Adopted Salesforce, replacing a legacy CRM",
      rows: [
        { label: "Added", value: "Salesforce" },
        { label: "Replaced", value: "a legacy CRM" },
        { label: "Category", value: "CRM" },
        { label: "When", value: "detected this month" },
      ],
      footnote: "Source: BuiltWith",
    }),
    sig("hiring-surge", {
      headline: "57 open roles, up 60% this quarter",
      rows: [
        { label: "Open roles", value: "57" },
        { label: "Concentrated in", value: "Engineering" },
        { label: "Trend", value: "+60% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
    sig("former-customer", {
      headline: "Previously a Marketing Hub customer",
      rows: [
        { label: "Product", value: "Marketing Hub" },
        { label: "Active", value: "2020–2022" },
        { label: "Churned", value: "outgrew the Starter tier" },
      ],
      footnote: "Source: CRM history",
    }),
  ],
  "14": [
    sig("new-hire", {
      headline: "Helen Choi joined as Head of Platform",
      rows: [
        { label: "Joined", value: "2 months ago" },
        { label: "Role", value: "Head of Platform" },
        { label: "Previously at", value: "Asana" },
      ],
      footnote: "Source: LinkedIn",
    }),
    sig("hiring-surge", {
      headline: "12 open roles, up 28% this quarter",
      rows: [
        { label: "Open roles", value: "12" },
        { label: "Concentrated in", value: "Investment team" },
        { label: "Trend", value: "+28% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
  ],
  "15": [
    sig("funding-round", {
      headline: "Raised $32M Series B",
      rows: [
        { label: "Round", value: "Series B" },
        { label: "Amount", value: "$32M" },
        { label: "Announced", value: "28 Apr 2026" },
        { label: "Lead investor", value: "Insight Partners" },
      ],
      footnote: "Source: Crunchbase",
    }),
    sig("former-customer", {
      headline: "Previously a Sales Hub customer",
      rows: [
        { label: "Product", value: "Sales Hub" },
        { label: "Active", value: "2021–2023" },
        { label: "Churned", value: "switched at renewal" },
      ],
      footnote: "Source: CRM history",
    }),
  ],
  "16": [
    sig("new-hire", {
      headline: "Priya Anand joined as Chief Marketing Officer",
      rows: [
        { label: "Joined", value: "last month" },
        { label: "Role", value: "Chief Marketing Officer" },
        { label: "Previously at", value: "Zendesk" },
      ],
      footnote: "Source: LinkedIn",
    }),
    sig("hiring-surge", {
      headline: "28 open roles, up 32% this quarter",
      rows: [
        { label: "Open roles", value: "28" },
        { label: "Concentrated in", value: "Customer Success" },
        { label: "Trend", value: "+32% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
  ],
  "17": [
    sig("hiring-surge", {
      headline: "21 open roles, up 45% this quarter",
      rows: [
        { label: "Open roles", value: "21" },
        { label: "Concentrated in", value: "Delivery" },
        { label: "Trend", value: "+45% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
    sig("tech-stack-change", {
      headline: "Adopted Intercom, replacing Zendesk",
      rows: [
        { label: "Added", value: "Intercom" },
        { label: "Replaced", value: "Zendesk" },
        { label: "Category", value: "Support" },
        { label: "When", value: "detected 3 weeks ago" },
      ],
      footnote: "Source: BuiltWith",
    }),
  ],
  "18": [
    sig("funding-round", {
      headline: "Raised $65M Series C",
      rows: [
        { label: "Round", value: "Series C" },
        { label: "Amount", value: "$65M" },
        { label: "Announced", value: "19 May 2026" },
        { label: "Lead investor", value: "a16z" },
      ],
      footnote: "Source: Crunchbase",
    }),
    sig("new-hire", {
      headline: "Tomás Rivera joined as Chief Revenue Officer",
      rows: [
        { label: "Joined", value: "3 weeks ago" },
        { label: "Role", value: "Chief Revenue Officer" },
        { label: "Previously at", value: "Datadog" },
      ],
      footnote: "Source: LinkedIn",
    }),
  ],
  "19": [
    sig("tech-stack-change", {
      headline: "Adopted Salesforce, replacing a legacy CRM",
      rows: [
        { label: "Added", value: "Salesforce" },
        { label: "Replaced", value: "a legacy CRM" },
        { label: "Category", value: "CRM" },
        { label: "When", value: "detected in April 2026" },
      ],
      footnote: "Source: BuiltWith",
    }),
    sig("funding-round", {
      headline: "Raised $110M Series C",
      rows: [
        { label: "Round", value: "Series C" },
        { label: "Amount", value: "$110M" },
        { label: "Announced", value: "12 Mar 2026" },
        { label: "Lead investor", value: "Sequoia" },
      ],
      footnote: "Source: Crunchbase",
    }),
    sig("hiring-surge", {
      headline: "42 open roles, up 51% this quarter",
      rows: [
        { label: "Open roles", value: "42" },
        { label: "Concentrated in", value: "Sales" },
        { label: "Trend", value: "+51% vs. last quarter" },
      ],
      footnote: "Source: job listings",
    }),
  ],
  "20": [
    sig("former-customer", {
      headline: "Previously a Marketing Hub customer",
      rows: [
        { label: "Product", value: "Marketing Hub" },
        { label: "Active", value: "2020–2022" },
        { label: "Churned", value: "downgraded during a cost review" },
      ],
      footnote: "Source: CRM history",
    }),
    sig("new-hire", {
      headline: "Dana Whitfield joined as VP of Sales",
      rows: [
        { label: "Joined", value: "2 months ago" },
        { label: "Role", value: "VP of Sales" },
        { label: "Previously at", value: "Ramp" },
      ],
      footnote: "Source: LinkedIn",
    }),
  ],
};

const getRandomTouches = () => Math.floor(Math.random() * 4); // 0-3 touches
const getRandomEnrollment = () => Math.random() > 0.5; // 50% chance of being enrolled
const getRandomLastContactedDate = (): string => {
  const ordinal = (d: number) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
  };
  const base = new Date(2026, 6, 31);
  const daysAgo = Math.floor(Math.random() * 90) + 1;
  const d = new Date(base.getTime() - daysAgo * 86400000);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${day}${ordinal(day)} ${month} ${d.getFullYear()}`;
};
const getRandomSequenceStatus = (): "enrolled" | "not-currently-enrolled" | "never-enrolled" => {
  const r = Math.random();
  if (r < 0.4) return "enrolled";
  if (r < 0.7) return "not-currently-enrolled";
  return "never-enrolled";
};
const getRandomOutreachStrategy = () => Math.random() > 0.35; // ~65% chance of having strategy

const touchDeadlines = [
  "November 18th", "November 22nd", "November 29th", "December 3rd", "December 8th",
  "December 12th", "November 25th", "December 5th", "December 10th", "November 20th",
  "December 1st", "December 15th", "November 27th", "December 7th", "November 23rd",
  "December 4th", "December 11th", "November 19th", "December 9th", "December 2nd"
];

// Pre-defined contact signal combinations for each company (randomized, max 2 per contact)
const company1Contacts = [
  { id: "c1", name: "Jennifer Park", initials: "JP", role: "VP, Marketing", avatarColor: "bg-trellis-purple-600", recentTouches: 1, enrolledInSequence: true, recentConversions: 1, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER, SIGNALS.VIEWED_PRICING] },
  { id: "c2", name: "Keisha Blue", initials: "KB", role: "Marketing Director", avatarColor: "bg-trellis-blue-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE], hasPhone: false, automationCooldownUntil: new Date(Date.now() + 42 * 60 * 1000).toISOString() },
  { id: "c3", name: "Elowen Green", initials: "EG", role: "Head of Product", avatarColor: "bg-trellis-green-600", recentTouches: 0, enrolledInSequence: true, recentConversions: 2, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
  { id: "c1a", name: "Marcus Chen", initials: "MC", role: "Sr. Product Manager", avatarColor: getRandomColor(), recentTouches: 0, enrolledInSequence: getRandomEnrollment(), recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c1b", name: "Diana Ross", initials: "DR", role: "Content Lead", avatarColor: getRandomColor(), recentTouches: 0, enrolledInSequence: getRandomEnrollment(), recentConversions: 1, lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c1c", name: "Victor Huang", initials: "VH", role: "Growth Manager", avatarColor: getRandomColor(), recentTouches: 0, enrolledInSequence: getRandomEnrollment(), recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE, SIGNALS.ATTENDED_WEBINAR] },
  { id: "c1d", name: "Sophia Martinez", initials: "SM", role: "Demand Gen Lead", avatarColor: getRandomColor(), recentTouches: 0, enrolledInSequence: getRandomEnrollment(), recentConversions: 2, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
];

const company2Contacts = [
  { id: "c4", name: "Sarah Johnson", initials: "SJ", role: "CEO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), recentConversions: 1, lastContactedDate: getRandomLastContactedDate(), signals: [sig("recent-ql", { headline: "Requested a demo", rows: [{ label: "Trigger", value: "Requested a demo" }, { label: "Occurred", value: "22 Nov 2025" }], footnote: "Work or reject before 25 November" })], qlData: { requestType: "Requested a demo", requestDate: "22 Nov 2025 06:41", deadline: "25 November" } },
  { id: "c5", name: "Tom Williams", initials: "TW", role: "CTO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING, SIGNALS.RECENT_HIRE] },
  { id: "c5a", name: "Priya Sharma", initials: "PS", role: "VP Engineering", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
  { id: "c5b", name: "Kevin O'Malley", initials: "KO", role: "Head of Sales", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), recentConversions: 1, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c5c", name: "Mei Lin", initials: "ML", role: "Product Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [], hasPhone: false },
  { id: "c5d", name: "Robert Chang", initials: "RC", role: "Director of IT", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
];

const company3Contacts = [
  { id: "c6", name: "David Lee", initials: "DL", role: "CMO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c7", name: "Emily Rodriguez", initials: "ER", role: "VP Sales", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR, SIGNALS.RECENT_QL] },
  { id: "c8", name: "Michael O'Brien", initials: "MO", role: "Head of Growth", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c8a", name: "Jessica Wong", initials: "JW", role: "Revenue Operations", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c8b", name: "Ryan Peters", initials: "RP", role: "Enterprise AE", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
  { id: "c8c", name: "Taylor Kim", initials: "TK", role: "Customer Success", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER, SIGNALS.RECENT_QL] },
  { id: "c8d", name: "Alex Johnson", initials: "AJ", role: "Sales Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c8e", name: "Morgan Bailey", initials: "MB", role: "SDR Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
];

const company4Contacts = [
  { id: "c9", name: "James Wilson", initials: "JW", role: "VP Analytics", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [sig("recent-ql", { headline: "Pricing inquiry", rows: [{ label: "Trigger", value: "Pricing inquiry" }, { label: "Occurred", value: "3 Jan 2026" }], footnote: "Work or reject before 8 January" }), SIGNALS.VIEWED_PRICING], qlData: { requestType: "Pricing inquiry", requestDate: "3 Jan 2026 14:22", deadline: "8 January" } },
  { id: "c10", name: "Lisa Thompson", initials: "LT", role: "Chief Data Officer", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE, SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c10a", name: "Fernando Reyes", initials: "FR", role: "Data Science Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
  { id: "c10b", name: "Alicia Novak", initials: "AN", role: "BI Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c10c", name: "Chris Donovan", initials: "CD", role: "Analytics Engineer", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c10d", name: "Nadia Petrova", initials: "NP", role: "VP Product", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c10e", name: "Greg Tanaka", initials: "GT", role: "Solutions Architect", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
];

const company5Contacts = [
  { id: "c11", name: "Rachel Green", initials: "RG", role: "CTO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL, SIGNALS.ATTENDED_WEBINAR] },
  { id: "c12", name: "Nathan Brooks", initials: "NB", role: "Engineering Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c13", name: "Amanda Clarke", initials: "AC", role: "Tech Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c13a", name: "Derek Sullivan", initials: "DS", role: "Platform Architect", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
  { id: "c13b", name: "Hannah Liu", initials: "HL", role: "DevOps Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c13c", name: "Brandon Cole", initials: "BC", role: "VP Engineering", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR, SIGNALS.VIEWED_PRICING] },
];

const company6Contacts = [
  { id: "c14", name: "Carlos Santos", initials: "CS", role: "COO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
  { id: "c15", name: "Diana Peterson", initials: "DP", role: "VP Operations", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER, SIGNALS.RECENT_QL] },
  { id: "c15a", name: "Omar Hassan", initials: "OH", role: "Supply Chain Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
  { id: "c15b", name: "Julia Fernandez", initials: "JF", role: "Operations Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c15c", name: "Steve Park", initials: "SP", role: "Logistics Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c15d", name: "Tanya Ivanova", initials: "TI", role: "Process Engineer", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE, SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c15e", name: "Ben Whitaker", initials: "BW", role: "Quality Assurance", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c15f", name: "Linda Chow", initials: "LC", role: "Procurement Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
];

const company7Contacts = [
  { id: "c16", name: "Olivia Hayes", initials: "OH", role: "VP Business Development", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
  { id: "c17", name: "Ethan Kumar", initials: "EK", role: "Partnership Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING, SIGNALS.RECENT_HIRE] },
  { id: "c18", name: "Grace Allen", initials: "GA", role: "Strategic Accounts Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
];

const company8Contacts = [
  { id: "c19", name: "Samuel Turner", initials: "ST", role: "Head of Product", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c20", name: "Maya Patel", initials: "MP", role: "VP Product Strategy", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c20a", name: "Liam O'Connor", initials: "LO", role: "UX Research Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c20b", name: "Zara Ahmed", initials: "ZA", role: "Product Designer", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
  { id: "c20c", name: "Eric Johansson", initials: "EJ", role: "Technical PM", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
];

const company9Contacts = [
  { id: "c21", name: "Hannah Scott", initials: "HS", role: "VP E-commerce", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR, SIGNALS.VIEWED_PRICING] },
  { id: "c22", name: "Lucas Martin", initials: "LM", role: "Digital Strategy Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c22a", name: "Rebecca Stone", initials: "RS", role: "Marketplace Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c22b", name: "David Okafor", initials: "DO", role: "Growth Marketing", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c22c", name: "Amy Nakamura", initials: "AN", role: "Customer Insights", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
  { id: "c22d", name: "Paul Fitzgerald", initials: "PF", role: "E-commerce Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING, SIGNALS.ATTENDED_WEBINAR] },
  { id: "c22e", name: "Simone Dubois", initials: "SD", role: "CX Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c22f", name: "Raj Krishnan", initials: "RK", role: "Tech Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c22g", name: "Lisa Bergström", initials: "LB", role: "Conversion Analyst", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
];

const company10Contacts = [
  { id: "c23", name: "Patrick Walsh", initials: "PW", role: "CFO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE, sig("recent-ql", { headline: "ROI assessment requested", rows: [{ label: "Trigger", value: "ROI assessment requested" }, { label: "Occurred", value: "5 Jan 2026" }], footnote: "Work or reject before 10 January" })], qlData: { requestType: "ROI assessment requested", requestDate: "5 Jan 2026 09:15", deadline: "10 January" } },
  { id: "c24", name: "Nicole Rivera", initials: "NR", role: "VP Finance", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c25", name: "Andrew Kim", initials: "AK", role: "Finance Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
];

const company11Contacts = [
  { id: "c26", name: "Tyler Robinson", initials: "TR", role: "VP Content", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c27", name: "Mia Jackson", initials: "MJ", role: "Media Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR, SIGNALS.RECENT_HIRE] },
  { id: "c27a", name: "Connor Walsh", initials: "CW", role: "Creative Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c27b", name: "Yuki Tanaka", initials: "YT", role: "Content Strategist", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c27c", name: "Elena Vasquez", initials: "EV", role: "Social Media Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
];

const company12Contacts = [
  { id: "c28", name: "Chloe Martinez", initials: "CM", role: "VP Research", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c29", name: "Daniel Foster", initials: "DF", role: "Chief Scientist", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER, SIGNALS.VIEWED_PRICING] },
  { id: "c30", name: "Emma Wilson", initials: "EW", role: "Innovation Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
];

const company13Contacts = [
  { id: "c31", name: "Rachel White", initials: "RW", role: "CTO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
  { id: "c32", name: "Brandon Lee", initials: "BL", role: "VP Technology", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR, SIGNALS.RECENT_QL] },
  { id: "c32a", name: "Ingrid Larsen", initials: "IL", role: "Security Architect", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c32b", name: "Amir Farouk", initials: "AF", role: "Cloud Infrastructure", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c32c", name: "Sandra Kim", initials: "SK", role: "Engineering Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c32d", name: "Troy Anderson", initials: "TA", role: "DevRel Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE, SIGNALS.RECENT_QL] },
];

const company14Contacts = [
  { id: "c33", name: "Samantha Moore", initials: "SM", role: "Managing Partner", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c34", name: "Joshua Clark", initials: "JC", role: "VP Investments", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c35", name: "Natalie Brooks", initials: "NB", role: "Senior Associate", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE, SIGNALS.ATTENDED_WEBINAR] },
];

const company15Contacts = [
  { id: "c36", name: "Henry Adams", initials: "HA", role: "COO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL, SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c37", name: "Abigail Turner", initials: "AT", role: "Manufacturing Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c37a", name: "Desmond Clarke", initials: "DC", role: "Plant Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
  { id: "c37b", name: "Fiona McAllister", initials: "FM", role: "Quality Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
];

const company16Contacts = [
  { id: "c38", name: "Jacob Miller", initials: "JM", role: "VP Healthcare Operations", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING, SIGNALS.RECENT_HIRE] },
  { id: "c39", name: "Lily Thompson", initials: "LT", role: "Chief Medical Officer", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
  { id: "c39a", name: "Marcus Webb", initials: "MW", role: "Clinical Informatics", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c39b", name: "Patricia Gomez", initials: "PG", role: "Nursing Informatics Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c39c", name: "Ian McLeod", initials: "IM", role: "Health IT Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c39d", name: "Christine Ng", initials: "CN", role: "VP Patient Experience", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
];

const company17Contacts = [
  { id: "c40", name: "Ava Campbell", initials: "AC", role: "Principal Consultant", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER, SIGNALS.RECENT_QL] },
  { id: "c41", name: "Noah Mitchell", initials: "NM", role: "Practice Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
  { id: "c42", name: "Isabella Parker", initials: "IP", role: "Engagement Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
];

const company18Contacts = [
  { id: "c43", name: "Evelyn Reed", initials: "ER", role: "COO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR, SIGNALS.VIEWED_PRICING] },
  { id: "c44", name: "Logan Stewart", initials: "LS", role: "Fleet Operations Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
  { id: "c44a", name: "Bianca Morales", initials: "BM", role: "Sustainability Manager", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c44b", name: "Kai Nakamura", initials: "KN", role: "Route Optimization Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
  { id: "c44c", name: "Wendy Cho", initials: "WC", role: "VP Logistics", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [] },
];

const company19Contacts = [
  { id: "c45", name: "Jack Russell", initials: "JR", role: "CEO", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c46", name: "Aria Bennett", initials: "AB", role: "Product VP", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE, SIGNALS.ATTENDED_WEBINAR] },
  { id: "c47", name: "Carter Sanders", initials: "CS", role: "Engineering Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
];

const company20Contacts = [
  { id: "c48", name: "Julian Foster", initials: "JF", role: "VP Marketing", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL, SIGNALS.PAST_HUBSPOT_USER] },
  { id: "c49", name: "Penelope Ward", initials: "PW", role: "Brand Director", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
  { id: "c50", name: "Dominic Hayes", initials: "DH", role: "Marketing Analytics Lead", avatarColor: getRandomColor(), recentTouches: getRandomTouches(), enrolledInSequence: getRandomEnrollment(), lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR, SIGNALS.VIEWED_PRICING] },
];

// Task notes content for contextual outreach
const taskNotes = {
  t1: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: HubSpot Product Demo | Marketing Hub

Contact Profile: - Role Overview: Product Marketing Manager at ACME Corp, responsible for go-to-market strategies, competitive positioning, and product launch campaigns across multiple product lines.

- Key Challenges: Coordinating cross-functional teams for launches, measuring campaign ROI accurately, staying ahead of competitive messaging, and scaling content production without sacrificing quality.

- Goals & Metrics: Increase product adoption by 25%, improve time-to-market for new features, and enhance sales enablement materials to boost win rates.

- Background: 5 years in product marketing, previously at mid-sized SaaS companies. Strong focus on data-driven marketing and ABM strategies.

- Personalization Opportunities: Offer insights on competitive intelligence tools, automated content workflows, and integrated analytics for campaign measurement.

Business Model Summary: - Industry: Technology / SaaS

- Company Description from LinkedIn: ACME Corp delivers innovative enterprise software solutions that help businesses streamline operations and accelerate digital transformation.

- Primary Offering: Enterprise productivity and workflow automation software

- Average Selling Price: $50,000 ARR

- Target Audience: Mid-market and enterprise companies seeking operational efficiency

- Value Proposition: Comprehensive platform that reduces manual work and improves team collaboration.

Technologies used: Salesforce, HubSpot, Marketo, Google Analytics

Summary of Web Analysis: Website features multiple demo request CTAs, customer case studies section, and a resource center with downloadable whitepapers and ROI calculators.`,

  t2: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Webinar Registration | Sales Acceleration Summit

Contact Profile: - Role Overview: VP of Sales at TechVision Inc, leading a team of 45 sales reps across North America. Responsible for revenue targets, sales strategy, and pipeline management.

- Key Challenges: Inconsistent pipeline visibility, lengthy sales cycles in enterprise deals, rep onboarding and enablement at scale, and forecasting accuracy improvements.

- Goals & Metrics: Hit $15M ARR target, reduce sales cycle by 20%, and improve forecast accuracy to 90%+.

- Background: 12 years in B2B sales leadership, known for building high-performing teams. Previously scaled sales at two successful startups through Series C.

- Personalization Opportunities: Discuss sales intelligence tools, pipeline analytics, and conversation intelligence solutions for coaching.

Business Model Summary: - Industry: Technology / Software

- Company Description from LinkedIn: TechVision Inc provides cutting-edge computer vision and AI solutions for retail and manufacturing industries.

- Primary Offering: AI-powered visual recognition software

- Average Selling Price: $100,000+ ARR for enterprise

- Target Audience: Retail chains, manufacturing facilities, logistics companies

- Value Proposition: Reduce operational costs by 40% through automated visual inspection and inventory tracking.

Technologies used: AWS, Snowflake, Outreach, Gong

Summary of Web Analysis: Strong inbound focus with prominent "Get a Demo" buttons, customer logos from Fortune 500 companies, and video testimonials throughout.`,

  t3: `Recommended next steps: Please reach out to this contact by phone and identify additional stakeholders.

Use the following information to help with your outreach:

Recent Conversion Event: Content Download | Digital Marketing Playbook

Contact Profile: - Role Overview: Director of Marketing at Innovate Solutions, overseeing brand strategy, demand generation, and marketing operations for a growing B2B company.

- Key Challenges: Attribution modeling across channels, aligning marketing and sales on lead quality, scaling personalized campaigns, and proving marketing ROI to executives.

- Goals & Metrics: Generate 500 MQLs per quarter, achieve 30% conversion from MQL to opportunity, and reduce cost per lead by 15%.

- Background: 8 years in B2B marketing, transitioned from agency to in-house. Expert in marketing automation and ABM.

- Personalization Opportunities: Highlight multi-touch attribution, lead scoring optimization, and integrated CRM-marketing workflows.

Business Model Summary: - Industry: Professional Services / Consulting

- Company Description from LinkedIn: Innovate Solutions helps mid-market companies modernize their technology infrastructure and adopt cloud-first strategies.

- Primary Offering: IT consulting and digital transformation services

- Average Selling Price: $200,000 per engagement

- Target Audience: Mid-market companies with 500-5000 employees

- Value Proposition: Accelerate digital transformation with proven methodologies and experienced consultants.

Technologies used: Microsoft Dynamics, Pardot, LinkedIn Sales Navigator

Summary of Web Analysis: Website emphasizes thought leadership with weekly blog posts, downloadable frameworks, and consultation booking forms.`,

  t4: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Free Trial Signup | Analytics Platform

Contact Profile: - Role Overview: Data Analytics Lead at DataStream Analytics, managing a team of data scientists and analysts. Responsible for building analytics infrastructure and delivering insights to stakeholders.

- Key Challenges: Data quality and governance, tool sprawl across teams, democratizing analytics access, and reducing time from data to insight.

- Goals & Metrics: Reduce report generation time by 50%, increase self-service analytics adoption, and maintain data accuracy above 99%.

- Background: 6 years in data analytics, strong technical background in SQL, Python, and BI tools. Previously built analytics functions at two startups.

- Personalization Opportunities: Discuss data integration solutions, real-time dashboarding, and embedded analytics capabilities.

Business Model Summary: - Industry: Technology / Data & Analytics

- Company Description from LinkedIn: DataStream Analytics provides real-time data processing and analytics solutions for financial services and healthcare industries.

- Primary Offering: Real-time analytics platform and data pipeline tools

- Average Selling Price: $75,000 ARR

- Target Audience: Data-intensive enterprises in regulated industries

- Value Proposition: Process billions of events in real-time with enterprise-grade security and compliance.

Technologies used: Databricks, Tableau, Segment, dbt

Summary of Web Analysis: Technical documentation hub, free trial with no credit card required, and active community forums with 10,000+ members.`,

  t5: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Product Tour Completed | Cloud Infrastructure

Contact Profile: - Role Overview: VP of Engineering at CloudScale Systems, overseeing 80+ engineers across platform, infrastructure, and application teams. Key decision-maker for technical stack and vendor selection.

- Key Challenges: Scaling infrastructure for 10x growth, maintaining uptime SLAs, controlling cloud costs, and attracting top engineering talent.

- Goals & Metrics: Achieve 99.99% uptime, reduce infrastructure costs by 20%, and decrease deployment time to under 5 minutes.

- Background: 15 years in software engineering, scaled engineering teams at three unicorn startups. Deep expertise in distributed systems.

- Personalization Opportunities: Focus on developer experience tools, observability solutions, and cost optimization strategies.

Business Model Summary: - Industry: Technology / Cloud Infrastructure

- Company Description from LinkedIn: CloudScale Systems delivers enterprise-grade cloud infrastructure that scales automatically with demand.

- Primary Offering: Auto-scaling cloud compute and storage solutions

- Average Selling Price: Usage-based, typically $500K+ annually

- Target Audience: High-growth tech companies and digital natives

- Value Proposition: Zero-downtime scaling with transparent pricing and superior developer experience.

Technologies used: Kubernetes, Terraform, Datadog, PagerDuty

Summary of Web Analysis: Developer-focused with API documentation, CLI tools, and GitHub integrations prominently featured.`,

  t6: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: ROI Calculator Usage | Operations Optimization

Contact Profile: - Role Overview: Operations Manager at NextGen Industries, responsible for optimizing manufacturing processes, supply chain coordination, and quality assurance.

- Key Challenges: Legacy system integration, production bottlenecks, inventory optimization, and meeting sustainability targets.

- Goals & Metrics: Improve production efficiency by 25%, reduce waste by 30%, and achieve ISO certification.

- Background: 10 years in operations management, Six Sigma Black Belt certified, experience in both discrete and process manufacturing.

- Personalization Opportunities: Discuss IoT for manufacturing, predictive maintenance, and digital twin solutions.

Business Model Summary: - Industry: Manufacturing / Industrial

- Company Description from LinkedIn: NextGen Industries manufactures advanced materials and components for automotive and aerospace sectors.

- Primary Offering: Precision-engineered components and assemblies

- Average Selling Price: Varies by contract, typically $1M+ annually

- Target Audience: Tier 1 automotive suppliers, aerospace OEMs

- Value Proposition: Superior quality and on-time delivery with competitive pricing.

Technologies used: SAP, AutoCAD, Rockwell Automation

Summary of Web Analysis: Focus on quality certifications, case studies with major manufacturers, and RFQ form for custom projects.`,

  t7: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Event Registration | Partnership Summit

Contact Profile: - Role Overview: Business Development Manager at Horizon Enterprises, responsible for identifying strategic partnerships, negotiating deals, and expanding market presence.

- Key Challenges: Finding the right partners, measuring partnership ROI, scaling partner programs, and maintaining partner engagement.

- Goals & Metrics: Close 15 new strategic partnerships, generate $5M in partner-sourced revenue, and increase partner satisfaction scores.

- Background: 7 years in business development, strong network in tech and professional services. Track record of closing transformative partnerships.

- Personalization Opportunities: Highlight partner ecosystem platforms, co-marketing tools, and partnership analytics solutions.

Business Model Summary: - Industry: Professional Services

- Company Description from LinkedIn: Horizon Enterprises provides strategic consulting and implementation services for digital transformation initiatives.

- Primary Offering: Strategy consulting and technology implementation

- Average Selling Price: $150,000 per project

- Target Audience: C-suite executives at Fortune 1000 companies

- Value Proposition: Practical strategies with measurable outcomes delivered by industry veterans.

Technologies used: Microsoft 365, Salesforce, Zoom

Summary of Web Analysis: Thought leadership focus with executive briefings, industry reports, and partner directory.`,

  t8: `Recommended next steps: Please reach out to this contact by phone and identify additional stakeholders.

Use the following information to help with your outreach:

Recent Conversion Event: Competitive Analysis Download | Product Management

Contact Profile: - Role Overview: Product Manager at Pioneer Tech Group, owning the product roadmap for their flagship SaaS platform. Collaborates closely with engineering, design, and go-to-market teams.

- Key Challenges: Prioritizing features based on customer value, reducing time-to-market, gathering actionable user feedback, and managing stakeholder expectations.

- Goals & Metrics: Launch 4 major features per quarter, achieve 85% customer satisfaction on new releases, and reduce churn by 10%.

- Background: 5 years in product management, previously a software engineer. Strong technical skills combined with customer empathy.

- Personalization Opportunities: Discuss product analytics, feature flagging, and customer feedback platforms.

Business Model Summary: - Industry: Technology / SaaS

- Company Description from LinkedIn: Pioneer Tech Group develops innovative project management and collaboration tools for distributed teams.

- Primary Offering: Team collaboration and project management platform

- Average Selling Price: $30,000 ARR mid-market, $150,000 enterprise

- Target Audience: Remote-first companies, agencies, professional services

- Value Proposition: All-in-one platform that replaces 5+ point solutions.

Technologies used: Jira, Amplitude, LaunchDarkly, Intercom

Summary of Web Analysis: Product-led growth with freemium model, extensive template library, and customer community forum.`,

  t9: `Recommended next steps: Please reach out to this contact by phone and identify additional stakeholders.

Use the following information to help with your outreach:

Recent Conversion Event: Case Study Download | E-commerce Success Stories

Contact Profile: - Role Overview: E-commerce Director at Velocity Commerce, leading digital commerce strategy, platform operations, and online revenue growth.

- Key Challenges: Cart abandonment reduction, personalization at scale, omnichannel inventory visibility, and international expansion.

- Goals & Metrics: Grow online revenue by 40%, reduce cart abandonment to under 60%, and launch 3 new international markets.

- Background: 9 years in e-commerce, scaled online operations from $10M to $100M at previous company. Expert in conversion optimization.

- Personalization Opportunities: Highlight checkout optimization, personalization engines, and headless commerce solutions.

Business Model Summary: - Industry: Retail / E-commerce

- Company Description from LinkedIn: Velocity Commerce is a fast-growing DTC brand selling premium lifestyle products through digital channels.

- Primary Offering: Premium consumer goods through direct-to-consumer channels

- Average Selling Price: $75 AOV, subscription options available

- Target Audience: Urban millennials and Gen Z with high disposable income

- Value Proposition: Sustainable, high-quality products with exceptional customer experience.

Technologies used: Shopify Plus, Klaviyo, Attentive, Yotpo

Summary of Web Analysis: Mobile-optimized storefront, prominent reviews, and SMS capture for 15% discount.`,

  t10: `Recommended next steps: Please reach out to this contact by phone and identify additional stakeholders.

Use the following information to help with your outreach:

Recent Conversion Event: Pricing Page Visit (5+ times) | Financial Software

Contact Profile: - Role Overview: Financial Controller at Summit Financial, overseeing accounting operations, financial reporting, and compliance for a growing financial services firm.

- Key Challenges: Month-end close taking too long, manual data entry errors, audit preparation, and regulatory compliance complexity.

- Goals & Metrics: Reduce close time by 50%, achieve zero material audit findings, and automate 80% of routine entries.

- Background: 12 years in finance, CPA with Big 4 experience. Strong understanding of both technical accounting and operational efficiency.

- Personalization Opportunities: Discuss automation for accounting workflows, real-time reporting, and compliance management tools.

Business Model Summary: - Industry: Financial Services

- Company Description from LinkedIn: Summit Financial provides wealth management and investment advisory services to high-net-worth individuals and families.

- Primary Offering: Wealth management, investment advisory, estate planning

- Average Selling Price: 1% AUM fee on managed assets

- Target Audience: High-net-worth individuals with $1M+ in investable assets

- Value Proposition: Personalized financial planning with a fiduciary commitment.

Technologies used: Black Diamond, Salesforce Financial Services Cloud, DocuSign

Summary of Web Analysis: Trust-focused messaging, advisor bios with credentials, and secure client portal login prominent.`,

  t11: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Webinar Attendance | Content Strategy Best Practices

Contact Profile: - Role Overview: Content Strategy Lead at BrightPath Media, developing content programs across channels and managing a team of content creators.

- Key Challenges: Content production at scale, measuring content performance, maintaining brand voice, and repurposing content efficiently.

- Goals & Metrics: Publish 100 pieces of content monthly, achieve 25% increase in organic traffic, and improve content engagement rates.

- Background: 8 years in content marketing, previously at agencies working with Fortune 500 clients. Expert in SEO content and video production.

- Personalization Opportunities: Highlight content management systems, AI writing assistants, and content analytics platforms.

Business Model Summary: - Industry: Media / Marketing

- Company Description from LinkedIn: BrightPath Media is a full-service content marketing agency helping B2B tech companies build authority through thought leadership.

- Primary Offering: Content strategy, creation, and distribution services

- Average Selling Price: $15,000/month retainer

- Target Audience: B2B tech companies seeking to build brand awareness

- Value Proposition: End-to-end content programs that drive measurable pipeline impact.

Technologies used: WordPress, Ahrefs, HubSpot, Canva

Summary of Web Analysis: Portfolio showcase, blog with consistent publishing schedule, and newsletter signup with content upgrade.`,

  t12: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Research Paper Download | Quantum Computing Applications

Contact Profile: - Role Overview: Research Director at Quantum Dynamics, leading R&D initiatives and managing research partnerships with universities and government labs.

- Key Challenges: Funding for long-term research, attracting PhD-level talent, technology transfer to commercial applications, and maintaining competitive advantage.

- Goals & Metrics: Secure $10M in research grants, file 5 patents annually, and transition 2 research projects to commercial development.

- Background: PhD in Physics, 15 years in research leadership. Published 50+ papers in peer-reviewed journals. Named on 12 patents.

- Personalization Opportunities: Discuss research collaboration platforms, data management for research, and technology transfer services.

Business Model Summary: - Industry: Technology / Deep Tech

- Company Description from LinkedIn: Quantum Dynamics is pioneering practical quantum computing solutions for optimization and simulation problems.

- Primary Offering: Quantum computing hardware and algorithms

- Target Audience: Research institutions, defense contractors, pharmaceutical companies

- Value Proposition: Making quantum advantage accessible through hybrid classical-quantum solutions.

Technologies used: AWS Braket, IBM Quantum, custom quantum hardware

Summary of Web Analysis: Academic-style website with research publications, team credentials, and industry use cases section.`,

  t13a: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Demo Request | IT Service Management

Contact Profile: - Role Overview: IT Director at Fusion Technologies, responsible for enterprise IT infrastructure, cybersecurity, and digital workplace initiatives.

- Key Challenges: Shadow IT proliferation, security vulnerabilities, IT service delivery efficiency, and cloud migration complexity.

- Goals & Metrics: Achieve SOC 2 compliance, reduce IT ticket resolution time by 40%, and migrate 80% of workloads to cloud.

- Background: 14 years in IT leadership, certifications in AWS, Azure, and ITIL. Led IT transformations at three enterprise organizations.

- Personalization Opportunities: Discuss IT service management, security operations, and cloud governance solutions.

Business Model Summary: - Industry: Technology / Enterprise Software

- Company Description from LinkedIn: Fusion Technologies provides enterprise integration and data management solutions for complex IT environments.

- Primary Offering: Integration platform and master data management

- Average Selling Price: $200,000 ARR

- Target Audience: Large enterprises with complex, hybrid IT environments

- Value Proposition: Simplify integration complexity and unlock data value across systems.

Technologies used: MuleSoft, Azure, ServiceNow, Splunk

Summary of Web Analysis: Enterprise-focused with security certifications displayed, case studies from Global 2000 companies, and demo scheduling.`,

  t13b: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Whitepaper Download | Cloud Infrastructure Best Practices

Contact Profile: - Role Overview: Infrastructure Manager at Fusion Technologies, managing data centers, network operations, and cloud infrastructure for the organization.

- Key Challenges: Hybrid cloud complexity, infrastructure costs, capacity planning, and disaster recovery preparedness.

- Goals & Metrics: Reduce infrastructure costs by 25%, achieve 99.95% uptime, and implement zero-touch provisioning.

- Background: 10 years in infrastructure management, started as a systems administrator. Expert in virtualization and container orchestration.

- Personalization Opportunities: Highlight infrastructure automation, cost optimization tools, and multi-cloud management platforms.

Business Model Summary: - Industry: Technology / Enterprise Software

- Company Description from LinkedIn: Fusion Technologies provides enterprise integration and data management solutions for complex IT environments.

- Primary Offering: Integration platform and master data management

- Average Selling Price: $200,000 ARR

- Target Audience: Large enterprises with complex, hybrid IT environments

- Value Proposition: Simplify integration complexity and unlock data value across systems.

Technologies used: VMware, Kubernetes, Ansible, Prometheus

Summary of Web Analysis: Technical depth with architecture diagrams, API documentation, and infrastructure modernization guides.`,

  t14a: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Event Attendance | Private Equity Tech Summit

Contact Profile: - Role Overview: Investment Manager at Atlas Ventures, sourcing deals, conducting due diligence, and supporting portfolio companies in the technology sector.

- Key Challenges: Deal flow quality, due diligence efficiency, portfolio company support at scale, and competitive deal environments.

- Goals & Metrics: Close 4 investments annually, achieve 3x+ MOIC on portfolio, and source 50% of deals from proprietary networks.

- Background: 6 years in venture capital, MBA from top program. Previously worked in investment banking covering tech sector.

- Personalization Opportunities: Discuss deal sourcing platforms, portfolio management tools, and market intelligence services.

Business Model Summary: - Industry: Financial Services / Venture Capital

- Company Description from LinkedIn: Atlas Ventures is a growth-stage venture capital firm investing in B2B software companies disrupting traditional industries.

- Primary Offering: Growth equity investments ($10M-$50M checks)

- Target Audience: B2B SaaS companies with $5M-$20M ARR

- Value Proposition: Capital plus operational support from experienced operators.

Technologies used: PitchBook, Affinity, Carta

Summary of Web Analysis: Portfolio showcase, team backgrounds highlighting operating experience, and thesis-focused content.`,

  t14b: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Portfolio Company Referral

Contact Profile: - Role Overview: Portfolio Director at Atlas Ventures, managing relationships with portfolio companies and driving value creation initiatives.

- Key Challenges: Scaling support across 20+ portfolio companies, measuring impact of value-add services, and coordinating executive recruiting.

- Goals & Metrics: Improve portfolio company NPS to 80+, facilitate 10 executive hires annually, and increase average portfolio company revenue growth by 5%.

- Background: 8 years in VC portfolio operations, previously COO at a venture-backed startup. Deep expertise in scaling operations.

- Personalization Opportunities: Highlight portfolio management platforms, executive recruiting partnerships, and operational benchmarking tools.

Business Model Summary: - Industry: Financial Services / Venture Capital

- Company Description from LinkedIn: Atlas Ventures is a growth-stage venture capital firm investing in B2B software companies disrupting traditional industries.

- Primary Offering: Growth equity investments ($10M-$50M checks)

- Target Audience: B2B SaaS companies with $5M-$20M ARR

- Value Proposition: Capital plus operational support from experienced operators.

Technologies used: Notion, Airtable, Slack

Summary of Web Analysis: Resources section for portfolio companies, talent network page, and portfolio company success stories.`,

  t15a: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: ROI Assessment Request | Manufacturing Automation

Contact Profile: - Role Overview: Operations VP at Zenith Manufacturing, overseeing production, quality, and supply chain for multiple manufacturing facilities.

- Key Challenges: Labor shortages, production efficiency, supply chain disruptions, and sustainability compliance requirements.

- Goals & Metrics: Increase output by 30% without adding headcount, reduce defect rates to under 0.1%, and achieve carbon neutral operations.

- Background: 18 years in manufacturing operations, started on production floor. Black Belt in Lean Manufacturing.

- Personalization Opportunities: Discuss manufacturing automation, quality management systems, and sustainable manufacturing solutions.

Business Model Summary: - Industry: Manufacturing

- Company Description from LinkedIn: Zenith Manufacturing is a leading producer of precision metal components for medical device and aerospace applications.

- Primary Offering: CNC machined components and assemblies

- Average Selling Price: Contract-based, $5M+ annual relationships

- Target Audience: Medical device OEMs, aerospace primes

- Value Proposition: Tight tolerance manufacturing with FDA and AS9100 certifications.

Technologies used: ERP systems, MES, SCADA

Summary of Web Analysis: Certifications prominently displayed, virtual factory tour, and RFQ submission form.`,

  t15b: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Supply Chain Webinar Registration

Contact Profile: - Role Overview: Supply Chain Director at Zenith Manufacturing, managing supplier relationships, procurement, and logistics across global supply network.

- Key Challenges: Supplier diversification, inventory optimization, transportation cost increases, and supply chain visibility.

- Goals & Metrics: Reduce supply chain costs by 15%, maintain 98% on-time delivery, and onboard 5 alternative suppliers.

- Background: 12 years in supply chain management, APICS certified. Experience in both manufacturing and retail supply chains.

- Personalization Opportunities: Highlight supply chain visibility platforms, supplier risk management, and inventory optimization tools.

Business Model Summary: - Industry: Manufacturing

- Company Description from LinkedIn: Zenith Manufacturing is a leading producer of precision metal components for medical device and aerospace applications.

- Primary Offering: CNC machined components and assemblies

- Average Selling Price: Contract-based, $5M+ annual relationships

- Target Audience: Medical device OEMs, aerospace primes

- Value Proposition: Tight tolerance manufacturing with FDA and AS9100 certifications.

Technologies used: SAP SCM, Oracle, Blue Yonder

Summary of Web Analysis: Supplier portal, quality documentation downloads, and supply chain partnership program information.`,

  t16a: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Demo Completed | Healthcare Administration Platform

Contact Profile: - Role Overview: Healthcare Administrator at Meridian Health, managing clinical operations, patient experience, and regulatory compliance across a network of care facilities.

- Key Challenges: Staff scheduling efficiency, patient satisfaction scores, regulatory compliance burden, and revenue cycle optimization.

- Goals & Metrics: Improve patient satisfaction to 4.5+ stars, reduce denials by 25%, and maintain perfect compliance record.

- Background: 15 years in healthcare administration, Masters in Healthcare Management. Previously led operations for regional hospital system.

- Personalization Opportunities: Discuss clinical workflow optimization, patient engagement platforms, and compliance automation.

Business Model Summary: - Industry: Healthcare

- Company Description from LinkedIn: Meridian Health is a network of primary care and specialty clinics delivering patient-centered care across the tri-state region.

- Primary Offering: Primary care, specialty care, and urgent care services

- Target Audience: Individuals and families seeking quality healthcare

- Value Proposition: Convenient access to comprehensive care with personalized attention.

Technologies used: Epic, Docusign, Zoom for Healthcare

Summary of Web Analysis: Patient portal login, appointment scheduling, insurance accepted list, and provider search.`,

  t16b: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Content Download | Patient Experience Best Practices

Contact Profile: - Role Overview: Patient Care Director at Meridian Health, responsible for nursing staff, patient experience programs, and care quality initiatives.

- Key Challenges: Nurse retention, consistent care quality, patient communication, and care coordination across providers.

- Goals & Metrics: Reduce nurse turnover by 20%, achieve 95%+ HCAHPS scores, and implement care team communication improvements.

- Background: 20 years in nursing and healthcare leadership, MSN in Nursing Administration. Champion for patient-centered care models.

- Personalization Opportunities: Highlight nursing workflow tools, patient communication platforms, and care coordination solutions.

Business Model Summary: - Industry: Healthcare

- Company Description from LinkedIn: Meridian Health is a network of primary care and specialty clinics delivering patient-centered care across the tri-state region.

- Primary Offering: Primary care, specialty care, and urgent care services

- Target Audience: Individuals and families seeking quality healthcare

- Value Proposition: Convenient access to comprehensive care with personalized attention.

Technologies used: Cerner, Tiger Connect, Press Ganey

Summary of Web Analysis: Staff recognition program, nursing recruitment section, and community health initiatives highlighted.`,

  t17a: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Strategy Assessment Request | Consulting Services

Contact Profile: - Role Overview: Managing Consultant at Apex Consulting, leading client engagements, developing thought leadership, and mentoring junior consultants.

- Key Challenges: Client acquisition in competitive market, delivering consistent quality, scaling expertise, and differentiating from larger firms.

- Goals & Metrics: Grow practice revenue by 30%, maintain 90%+ client satisfaction, and develop 3 new service offerings.

- Background: 10 years in management consulting, MBA from top program. Expertise in operations transformation and technology strategy.

- Personalization Opportunities: Discuss consulting delivery platforms, knowledge management, and practice management tools.

Business Model Summary: - Industry: Professional Services / Consulting

- Company Description from LinkedIn: Apex Consulting provides strategic advisory and implementation services to help organizations achieve operational excellence.

- Primary Offering: Strategy consulting, operational improvement, technology advisory

- Average Selling Price: $200,000+ per engagement

- Target Audience: Mid-market and enterprise organizations seeking transformation

- Value Proposition: Practical, results-oriented consulting that delivers measurable value.

Technologies used: Microsoft 365, Miro, Monday.com

Summary of Web Analysis: Thought leadership blog, case studies with ROI metrics, and executive team bios.`,

  t17b: `Recommended next steps: Please reach out to this contact by phone and identify additional stakeholders.

Use the following information to help with your outreach:

Recent Conversion Event: Industry Report Download | Digital Transformation Trends

Contact Profile: - Role Overview: Strategy Director at Apex Consulting, developing go-to-market strategies for new practice areas and driving firm-wide strategic initiatives.

- Key Challenges: Market positioning, service portfolio expansion, talent development, and geographic expansion.

- Goals & Metrics: Launch 2 new practice areas, increase market awareness by 40%, and recruit 10 senior consultants.

- Background: 12 years in strategy roles, previously Partner at Big 4 consulting. Expertise in business model innovation.

- Personalization Opportunities: Highlight market intelligence platforms, talent acquisition tools, and brand building solutions.

Business Model Summary: - Industry: Professional Services / Consulting

- Company Description from LinkedIn: Apex Consulting provides strategic advisory and implementation services to help organizations achieve operational excellence.

- Primary Offering: Strategy consulting, operational improvement, technology advisory

- Average Selling Price: $200,000+ per engagement

- Target Audience: Mid-market and enterprise organizations seeking transformation

- Value Proposition: Practical, results-oriented consulting that delivers measurable value.

Technologies used: LinkedIn, HubSpot, Figma

Summary of Web Analysis: Annual industry outlook report, partner program page, and careers section highlighting culture.`,

  t17c: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Podcast Appearance | Business Strategy Show

Contact Profile: - Role Overview: Senior Partner at Apex Consulting, serving as client relationship owner for key accounts and contributing to firm governance and strategy.

- Key Challenges: Maintaining client relationships at executive level, succession planning, firm culture preservation, and market positioning.

- Goals & Metrics: Retain 100% of key accounts, mentor 5 consultants to Director level, and contribute to 20% of firm revenue.

- Background: 25 years in management consulting, built and sold previous consulting firm. Recognized thought leader in operational excellence.

- Personalization Opportunities: Focus on executive relationship management, thought leadership platforms, and strategic advisory services.

Business Model Summary: - Industry: Professional Services / Consulting

- Company Description from LinkedIn: Apex Consulting provides strategic advisory and implementation services to help organizations achieve operational excellence.

- Primary Offering: Strategy consulting, operational improvement, technology advisory

- Average Selling Price: $200,000+ per engagement

- Target Audience: Mid-market and enterprise organizations seeking transformation

- Value Proposition: Practical, results-oriented consulting that delivers measurable value.

Technologies used: Executive CRM, video conferencing, presentation tools

Summary of Web Analysis: Partner profiles with publications, speaking engagements, and board affiliations listed.`,

  t18a: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Fleet Assessment Request | Logistics Optimization

Contact Profile: - Role Overview: Logistics Manager at Sterling Logistics, overseeing fleet operations, route optimization, and driver management across regional distribution network.

- Key Challenges: Driver retention, fuel cost management, delivery accuracy, and fleet utilization optimization.

- Goals & Metrics: Reduce fuel costs by 15%, improve on-time delivery to 99%, and decrease driver turnover by 25%.

- Background: 10 years in logistics management, started as a dispatcher. Expert in fleet management systems and route optimization.

- Personalization Opportunities: Discuss fleet management platforms, route optimization AI, and driver engagement solutions.

Business Model Summary: - Industry: Transportation / Logistics

- Company Description from LinkedIn: Sterling Logistics provides regional and national freight solutions with a focus on reliability and sustainability.

- Primary Offering: LTL and FTL freight services, warehousing, distribution

- Average Selling Price: Contract-based, varies by volume

- Target Audience: Manufacturers and retailers needing reliable logistics partners

- Value Proposition: On-time delivery with sustainable practices and competitive pricing.

Technologies used: Samsara, Trimble, TMW Systems

Summary of Web Analysis: Real-time tracking portal, sustainability initiatives, and shipper onboarding information.`,

  t18b: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Industry Event Attendance | Supply Chain Summit

Contact Profile: - Role Overview: Transportation Director at Sterling Logistics, managing carrier relationships, freight procurement, and transportation strategy.

- Key Challenges: Carrier capacity constraints, rate volatility, modal optimization, and visibility across transportation modes.

- Goals & Metrics: Reduce transportation costs by 10%, improve carrier performance scorecards, and increase intermodal usage by 20%.

- Background: 15 years in transportation management, previously at shipper side managing $50M freight budget.

- Personalization Opportunities: Highlight freight procurement platforms, carrier management systems, and transportation visibility tools.

Business Model Summary: - Industry: Transportation / Logistics

- Company Description from LinkedIn: Sterling Logistics provides regional and national freight solutions with a focus on reliability and sustainability.

- Primary Offering: LTL and FTL freight services, warehousing, distribution

- Average Selling Price: Contract-based, varies by volume

- Target Audience: Manufacturers and retailers needing reliable logistics partners

- Value Proposition: On-time delivery with sustainable practices and competitive pricing.

Technologies used: DAT, Transplace, project44

Summary of Web Analysis: Carrier partner portal, lane coverage maps, and customer testimonials from major shippers.`,

  t18c: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Whitepaper Download | Supply Chain Resilience

Contact Profile: - Role Overview: VP Supply Chain at Sterling Logistics, overseeing end-to-end supply chain strategy, operations, and continuous improvement initiatives.

- Key Challenges: Supply chain resilience, digital transformation, sustainability targets, and talent development.

- Goals & Metrics: Achieve carbon neutral operations by 2027, reduce supply chain disruptions by 50%, and implement digital control tower.

- Background: 20 years in supply chain leadership, multiple industry awards. Board member of supply chain industry association.

- Personalization Opportunities: Focus on supply chain strategy consulting, digital transformation platforms, and sustainability solutions.

Business Model Summary: - Industry: Transportation / Logistics

- Company Description from LinkedIn: Sterling Logistics provides regional and national freight solutions with a focus on reliability and sustainability.

- Primary Offering: LTL and FTL freight services, warehousing, distribution

- Average Selling Price: Contract-based, varies by volume

- Target Audience: Manufacturers and retailers needing reliable logistics partners

- Value Proposition: On-time delivery with sustainable practices and competitive pricing.

Technologies used: Blue Yonder, Oracle, Kinaxis

Summary of Web Analysis: Sustainability report download, executive team profiles, and investor relations section.`,

  t19a: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Technology Assessment Completed | Platform Modernization

Contact Profile: - Role Overview: Chief Technology Officer at Pinnacle Solutions, responsible for technology vision, R&D, and engineering organization for a scaling tech company.

- Key Challenges: Technical debt management, platform scalability, security posture, and attracting senior engineering talent.

- Goals & Metrics: Reduce technical debt by 40%, achieve SOC 2 Type II, and build engineering team to 100+ by end of year.

- Background: 18 years in technology leadership, founded previous startup. Deep expertise in distributed systems and AI/ML.

- Personalization Opportunities: Discuss platform modernization, developer productivity tools, and engineering culture building.

Business Model Summary: - Industry: Technology / SaaS

- Company Description from LinkedIn: Pinnacle Solutions delivers AI-powered business intelligence solutions that transform how organizations make decisions.

- Primary Offering: AI-powered analytics and BI platform

- Average Selling Price: $100,000+ ARR enterprise

- Target Audience: Data-driven enterprises seeking competitive advantage

- Value Proposition: Turn data into actionable insights 10x faster with AI.

Technologies used: Snowflake, dbt, React, Python

Summary of Web Analysis: Product-led with free trial, extensive documentation, and customer success stories from enterprise clients.`,

  t19b: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Engineering Blog Subscription | Tech Architecture

Contact Profile: - Role Overview: VP Engineering at Pinnacle Solutions, managing engineering teams, technical architecture decisions, and delivery execution.

- Key Challenges: Engineering velocity, code quality, cross-team collaboration, and developer experience.

- Goals & Metrics: Reduce deployment cycle time by 50%, improve code coverage to 85%, and achieve 4.0+ developer satisfaction score.

- Background: 14 years in software engineering, progressed from developer to VP. Expert in agile practices and DevOps.

- Personalization Opportunities: Highlight CI/CD platforms, developer experience tools, and engineering analytics.

Business Model Summary: - Industry: Technology / SaaS

- Company Description from LinkedIn: Pinnacle Solutions delivers AI-powered business intelligence solutions that transform how organizations make decisions.

- Primary Offering: AI-powered analytics and BI platform

- Average Selling Price: $100,000+ ARR enterprise

- Target Audience: Data-driven enterprises seeking competitive advantage

- Value Proposition: Turn data into actionable insights 10x faster with AI.

Technologies used: GitHub, CircleCI, Datadog, Slack

Summary of Web Analysis: Engineering blog, open source contributions, and career page emphasizing engineering culture.`,

  t19c: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: IT Assessment Request | Infrastructure Review

Contact Profile: - Role Overview: Director of IT at Pinnacle Solutions, responsible for corporate IT infrastructure, security, and internal tools supporting company operations.

- Key Challenges: Shadow IT governance, endpoint security, remote work support, and IT cost optimization.

- Goals & Metrics: Achieve zero security incidents, reduce IT costs per employee by 20%, and improve IT satisfaction score to 4.5+.

- Background: 12 years in IT management, certifications in security and cloud. Previously IT leader at growing SaaS companies.

- Personalization Opportunities: Discuss IT service management, security operations, and IT cost optimization solutions.

Business Model Summary: - Industry: Technology / SaaS

- Company Description from LinkedIn: Pinnacle Solutions delivers AI-powered business intelligence solutions that transform how organizations make decisions.

- Primary Offering: AI-powered analytics and BI platform

- Average Selling Price: $100,000+ ARR enterprise

- Target Audience: Data-driven enterprises seeking competitive advantage

- Value Proposition: Turn data into actionable insights 10x faster with AI.

Technologies used: Okta, Jamf, Zendesk, 1Password

Summary of Web Analysis: Security certifications displayed, privacy policy detailed, and compliance documentation available.`,

  t19d: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Operations Webinar Attendance | Scaling Tech Operations

Contact Profile: - Role Overview: Tech Operations Manager at Pinnacle Solutions, managing production systems, incident response, and operational tooling.

- Key Challenges: Incident management efficiency, runbook automation, on-call burden, and system reliability.

- Goals & Metrics: Reduce MTTR by 40%, automate 80% of routine operations, and achieve 99.9% uptime.

- Background: 8 years in operations and SRE roles, started as systems administrator. Expert in observability and automation.

- Personalization Opportunities: Highlight incident management platforms, observability tools, and automation solutions.

Business Model Summary: - Industry: Technology / SaaS

- Company Description from LinkedIn: Pinnacle Solutions delivers AI-powered business intelligence solutions that transform how organizations make decisions.

- Primary Offering: AI-powered analytics and BI platform

- Average Selling Price: $100,000+ ARR enterprise

- Target Audience: Data-driven enterprises seeking competitive advantage

- Value Proposition: Turn data into actionable insights 10x faster with AI.

Technologies used: PagerDuty, Grafana, Terraform, AWS

Summary of Web Analysis: Status page, system architecture overview, and SLA commitments for enterprise customers.`,

  t20a: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Marketing Strategy Assessment | Digital Marketing

Contact Profile: - Role Overview: Digital Marketing Strategist at Titan Enterprises, developing and executing digital marketing strategies across paid, owned, and earned channels.

- Key Challenges: Attribution across channels, creative fatigue, audience targeting precision, and budget optimization.

- Goals & Metrics: Increase ROAS by 30%, reduce CAC by 20%, and grow marketing qualified leads by 50%.

- Background: 7 years in digital marketing, certifications in Google Ads and Meta advertising. Data-driven approach to campaign optimization.

- Personalization Opportunities: Discuss marketing attribution, creative testing platforms, and audience intelligence tools.

Business Model Summary: - Industry: Technology / Marketing Tech

- Company Description from LinkedIn: Titan Enterprises provides marketing technology solutions that help brands connect with customers across every touchpoint.

- Primary Offering: Marketing automation and customer engagement platform

- Average Selling Price: $75,000 ARR mid-market

- Target Audience: B2C brands seeking personalized customer engagement

- Value Proposition: Unified customer view with AI-powered personalization at scale.

Technologies used: Google Analytics, Meta Ads, Mixpanel, Braze

Summary of Web Analysis: Case studies with ROI metrics, product demos, and integration marketplace.`,

  t20b: `Recommended next steps: Please reach out to this contact by phone and identify additional stakeholders.

Use the following information to help with your outreach:

Recent Conversion Event: Demand Generation Masterclass Registration

Contact Profile: - Role Overview: Demand Generation Manager at Titan Enterprises, responsible for building and optimizing the demand generation engine across marketing channels.

- Key Challenges: Pipeline velocity, lead quality versus quantity, marketing-sales alignment, and multi-touch campaign orchestration.

- Goals & Metrics: Generate 1000 MQLs monthly, achieve 25% MQL to SQL conversion, and reduce cost per MQL by 15%.

- Background: 6 years in demand generation, previously at high-growth B2B SaaS. Expert in marketing automation and ABM.

- Personalization Opportunities: Highlight demand generation platforms, ABM tools, and intent data providers.

Business Model Summary: - Industry: Technology / Marketing Tech

- Company Description from LinkedIn: Titan Enterprises provides marketing technology solutions that help brands connect with customers across every touchpoint.

- Primary Offering: Marketing automation and customer engagement platform

- Average Selling Price: $75,000 ARR mid-market

- Target Audience: B2C brands seeking personalized customer engagement

- Value Proposition: Unified customer view with AI-powered personalization at scale.

Technologies used: Marketo, Demandbase, 6sense, LinkedIn Ads

Summary of Web Analysis: Resource center with ebooks and webinars, demo request forms, and customer community.`,

  t20c: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: Growth Marketing Conference Speaker

Contact Profile: - Role Overview: Growth Marketing Lead at Titan Enterprises, driving experimentation, product-led growth initiatives, and growth marketing strategies.

- Key Challenges: Experimentation velocity, balancing growth with brand, product adoption optimization, and growth team scaling.

- Goals & Metrics: Run 50 experiments monthly, improve activation rate by 25%, and reduce time to value by 40%.

- Background: 5 years in growth marketing, previously at unicorn startup. Expert in product analytics and experimentation.

- Personalization Opportunities: Discuss experimentation platforms, product analytics, and growth tooling.

Business Model Summary: - Industry: Technology / Marketing Tech

- Company Description from LinkedIn: Titan Enterprises provides marketing technology solutions that help brands connect with customers across every touchpoint.

- Primary Offering: Marketing automation and customer engagement platform

- Average Selling Price: $75,000 ARR mid-market

- Target Audience: B2C brands seeking personalized customer engagement

- Value Proposition: Unified customer view with AI-powered personalization at scale.

Technologies used: Amplitude, Optimizely, Segment, Mixpanel

Summary of Web Analysis: Product-led with freemium, extensive documentation, and community Slack with 5000+ members.`,

  t20d: `Recommended next steps: Please reach out to this contact by phone.

Use the following information to help with your outreach:

Recent Conversion Event: Marketing Ops Assessment Request | Tech Stack Review

Contact Profile: - Role Overview: Marketing Operations Specialist at Titan Enterprises, managing marketing technology stack, data flows, and campaign operations.

- Key Challenges: Tool sprawl, data hygiene, process documentation, and cross-platform reporting.

- Goals & Metrics: Reduce tech stack costs by 20%, improve data quality to 95%+, and automate 70% of campaign setup.

- Background: 4 years in marketing operations, certifications in major marketing platforms. Strong technical skills with integration experience.

- Personalization Opportunities: Highlight marketing ops automation, data management, and martech stack optimization.

Business Model Summary: - Industry: Technology / Marketing Tech

- Company Description from LinkedIn: Titan Enterprises provides marketing technology solutions that help brands connect with customers across every touchpoint.

- Primary Offering: Marketing automation and customer engagement platform

- Average Selling Price: $75,000 ARR mid-market

- Target Audience: B2C brands seeking personalized customer engagement

- Value Proposition: Unified customer view with AI-powered personalization at scale.

Technologies used: Zapier, Workato, Tray.io, Salesforce

Summary of Web Analysis: Integration documentation, API reference, and partner ecosystem directory.`,

  t20e: `Recommended next steps: Please connect with this contact on LinkedIn.

Use the following information to help with your outreach:

Recent Conversion Event: CMO Roundtable Participation | Marketing Leadership

Contact Profile: - Role Overview: CMO at Titan Enterprises, leading all marketing functions including brand, demand generation, product marketing, and marketing operations.

- Key Challenges: Brand awareness in competitive market, marketing ROI demonstration, team scaling, and marketing-sales alignment.

- Goals & Metrics: Grow marketing-sourced pipeline by 50%, increase brand awareness metrics by 30%, and build world-class marketing team.

- Background: 18 years in marketing leadership, CMO at three growth-stage companies. Known for building high-performing marketing organizations.

- Personalization Opportunities: Focus on CMO-level conversations about marketing strategy, brand building, and marketing organization design.

Business Model Summary: - Industry: Technology / Marketing Tech

- Company Description from LinkedIn: Titan Enterprises provides marketing technology solutions that help brands connect with customers across every touchpoint.

- Primary Offering: Marketing automation and customer engagement platform

- Average Selling Price: $75,000 ARR mid-market

- Target Audience: B2C brands seeking personalized customer engagement

- Value Proposition: Unified customer view with AI-powered personalization at scale.

Technologies used: Executive dashboards, board reporting tools, marketing analytics platforms

Summary of Web Analysis: About page with leadership team, company story, and mission/values prominently featured.`,
};

const rawProspectingCompanies: Company[] = [
  // 60% with 1 task (12 companies)
  {
    id: "1",
    name: "ACME Corp",
    website: "acme.com",
    industry: "Software & Technology",
    pvsScore: "High",
    conversionTrigger: "Viewed Pricing Page",
    status: "New",
    signals: COMPANY_SIGNALS["1"],
    tasks: [
      {
        id: "t1",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Yesterday",
        contact: {
          name: "Priya Sharma",
          initials: "PS",
          role: "Product Marketing Manager",
          avatarColor: "bg-trellis-purple-600",
        },
        contactId: "c2",
        action: "call",
        notes: taskNotes.t1,
      },
    ],
    touches: {
      contactsReached: { current: 1, total: 3 },
      totalTouches: 1,
      progress: 40,
      touchStatuses: ["completed", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[0],
    },
    recommendedContacts: company1Contacts,
  },
  {
    id: "2",
    name: "TechVision Inc",
    website: "techvision.com",
    industry: "Data Analytics",
    pvsScore: "High",
    conversionTrigger: "Requested Demo",
    status: "In Progress",
    signals: COMPANY_SIGNALS["2"],
    tasks: [
      {
        id: "t2",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Marcus Chen",
          initials: "MC",
          role: "VP of Sales",
          avatarColor: getRandomColor(),
        },
        contactId: "c3",
        action: "call",
        notes: taskNotes.t2,
      },
    ],
    touches: {
      contactsReached: { current: 0, total: 4 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["completed", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[1],
    },
    recommendedContacts: company2Contacts,
  },
  {
    id: "3",
    name: "Advanced Satellite Communications",
    website: "advancedsat.com",
    industry: "Commercial Technology Systems Integrator",
    pvsScore: "Medium",
    conversionTrigger: "Downloaded Whitepaper",
    status: "New",
    signals: COMPANY_SIGNALS["3"],
    tasks: [
      {
        id: "t3",
        title: "Call Contact and Source Additional Contacts : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Aisha Patel",
          initials: "AP",
          role: "Director of Marketing",
          avatarColor: getRandomColor(),
        },
        contactId: "c4",
        action: "call",
        notes: taskNotes.t3,
      },
    ],
    touches: {
      contactsReached: { current: 0, total: 5 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[2],
    },
    recommendedContacts: company3Contacts,
  },
  {
    id: "4",
    name: "DataStream Analytics",
    website: "datastream.io",
    industry: "Data Analytics",
    pvsScore: "High",
    conversionTrigger: "Attended Webinar",
    status: "In Progress",
    signals: COMPANY_SIGNALS["4"],
    tasks: [
      {
        id: "t4",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Yesterday",
        contact: {
          name: "Sofia Martinez",
          initials: "SM",
          role: "Data Analytics Lead",
          avatarColor: getRandomColor(),
        },
        contactId: "c5",
        action: "linkedin",
        notes: taskNotes.t4,
      },
    ],
    touches: {
      contactsReached: { current: 1, total: 3 },
      totalTouches: 2,
      progress: 33,
      touchStatuses: ["completed", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[3],
    },
    recommendedContacts: company4Contacts,
  },
  {
    id: "5",
    name: "CloudScale Systems",
    website: "cloudscale.io",
    industry: "Cloud Infrastructure",
    pvsScore: "High",
    conversionTrigger: "Requested Demo",
    status: "Over SLA",
    signals: COMPANY_SIGNALS["5"],
    tasks: [
      {
        id: "t5",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Benjamin Foster",
          initials: "BF",
          role: "VP of Engineering",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t5,
      },
    ],
    touches: {
      contactsReached: { current: 1, total: 2 },
      totalTouches: 1,
      progress: 50,
      touchStatuses: ["completed", "completed", "completed", "completed", "empty"],
      deadline: touchDeadlines[4],
    },
    recommendedContacts: company5Contacts,
  },
  {
    id: "6",
    name: "NextGen Industries",
    website: "nextgenindustries.com",
    industry: "Manufacturing",
    pvsScore: "Medium",
    conversionTrigger: "Viewed Pricing Page",
    status: "In Progress",
    signals: COMPANY_SIGNALS["6"],
    tasks: [
      {
        id: "t6",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Isabella Wong",
          initials: "IW",
          role: "Operations Manager",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t6,
      },
    ],
    touches: {
      contactsReached: { current: 0, total: 4 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[5],
    },
    recommendedContacts: company6Contacts,
  },
  {
    id: "7",
    name: "Horizon Enterprises",
    website: "horizonent.com",
    industry: "Professional Services",
    pvsScore: "Medium",
    conversionTrigger: "Downloaded Case Study",
    status: "In Progress",
    signals: COMPANY_SIGNALS["7"],
    tasks: [
      {
        id: "t7",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Ryan Mitchell",
          initials: "RM",
          role: "Business Development Manager",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t7,
      },
    ],
    touches: {
      contactsReached: { current: 2, total: 3 },
      totalTouches: 4,
      progress: 67,
      touchStatuses: ["completed", "completed", "completed", "empty", "empty"],
      deadline: touchDeadlines[6],
    },
    recommendedContacts: company7Contacts,
  },
  {
    id: "8",
    name: "Pioneer Tech Group",
    website: "pioneertechgroup.com",
    industry: "Software & Technology",
    pvsScore: "High",
    conversionTrigger: "Visited Product Page",
    status: "In Progress",
    signals: COMPANY_SIGNALS["8"],
    tasks: [
      {
        id: "t8",
        title: "Call Contact and Source Additional Contacts : Book of Business Priority 1",
        priority: "P1",
        dueDate: "This Week",
        contact: {
          name: "Victoria Davis",
          initials: "VD",
          role: "Product Manager",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t8,
      },
    ],
    touches: {
      contactsReached: { current: 1, total: 5 },
      totalTouches: 1,
      progress: 20,
      touchStatuses: ["completed", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[7],
    },
    recommendedContacts: company8Contacts,
  },
  {
    id: "9",
    name: "Velocity Commerce",
    website: "velocitycommerce.com",
    industry: "E-Commerce",
    pvsScore: "Medium",
    conversionTrigger: "Signed Up for Trial",
    status: "In Progress",
    signals: COMPANY_SIGNALS["9"],
    tasks: [
      {
        id: "t9",
        title: "Call Contact and Source Additional Contacts : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Next Week",
        contact: {
          name: "Connor Murphy",
          initials: "CM",
          role: "E-commerce Director",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t9,
      },
    ],
    touches: {
      contactsReached: { current: 0, total: 2 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["completed", "completed", "empty", "empty", "empty"],
      deadline: touchDeadlines[8],
    },
    recommendedContacts: company9Contacts,
  },
  {
    id: "10",
    name: "Summit Financial",
    website: "summitfinancial.com",
    industry: "Financial Services",
    pvsScore: "High",
    conversionTrigger: "Requested Consultation",
    status: "In Progress",
    signals: COMPANY_SIGNALS["10"],
    tasks: [
      {
        id: "t10",
        title: "Call Contact and Source Additional Contacts : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Zoe Anderson",
          initials: "ZA",
          role: "Financial Controller",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t10,
      },
    ],
    touches: {
      contactsReached: { current: 3, total: 4 },
      totalTouches: 5,
      progress: 75,
      touchStatuses: ["completed", "completed", "completed", "empty", "empty"],
      deadline: touchDeadlines[9],
    },
    recommendedContacts: company10Contacts,
  },
  {
    id: "11",
    name: "BrightPath Media",
    website: "brightpathmedia.com",
    industry: "Digital Media",
    pvsScore: "High",
    conversionTrigger: "Downloaded Whitepaper",
    status: "In Progress",
    signals: COMPANY_SIGNALS["11"],
    tasks: [
      {
        id: "t11",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Sophia Nguyen",
          initials: "SN",
          role: "Content Strategy Lead",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t11,
      },
    ],
    touches: {
      contactsReached: { current: 1, total: 3 },
      totalTouches: 2,
      progress: 33,
      touchStatuses: ["completed", "completed", "scheduled", "empty", "empty"],
      deadline: touchDeadlines[10],
    },
    recommendedContacts: company11Contacts,
  },
  {
    id: "12",
    name: "Quantum Dynamics",
    website: "quantumdynamics.io",
    industry: "Research & Development",
    pvsScore: "Medium",
    conversionTrigger: "Attended Conference",
    status: "In Progress",
    signals: COMPANY_SIGNALS["12"],
    tasks: [
      {
        id: "t12",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Adrian Cole",
          initials: "AC",
          role: "Research Director",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t12,
      },
    ],
    touches: {
      contactsReached: { current: 2, total: 3 },
      totalTouches: 3,
      progress: 67,
      touchStatuses: ["completed", "completed", "completed", "empty", "empty"],
      deadline: touchDeadlines[11],
    },
    recommendedContacts: company12Contacts,
  },

  // 20% with 2 tasks (4 companies)
  {
    id: "13",
    name: "Fusion Technologies",
    website: "fusiontech.io",
    industry: "Software & Technology",
    pvsScore: "High",
    conversionTrigger: "Viewed Pricing Page",
    status: "In Progress",
    signals: COMPANY_SIGNALS["13"],
    tasks: [
      {
        id: "t13a",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "This Week",
        contact: {
          name: "Jessica Taylor",
          initials: "JT",
          role: "IT Director",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t13a,
      },
      {
        id: "t13b",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Kevin Brown",
          initials: "KB",
          role: "Infrastructure Manager",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t13b,
      },
    ],
    touches: {
      contactsReached: { current: 1, total: 4 },
      totalTouches: 2,
      progress: 25,
      touchStatuses: ["completed", "scheduled", "empty", "empty", "empty"],
      deadline: touchDeadlines[12],
    },
    recommendedContacts: company13Contacts,
  },
  {
    id: "14",
    name: "Atlas Ventures",
    website: "atlasventures.com",
    industry: "Venture Capital",
    pvsScore: "Medium",
    conversionTrigger: "Requested Demo",
    status: "In Progress",
    signals: COMPANY_SIGNALS["14"],
    tasks: [
      {
        id: "t14a",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "This Week",
        contact: {
          name: "Laura Phillips",
          initials: "LP",
          role: "Investment Manager",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t14a,
      },
      {
        id: "t14b",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "This Week",
        contact: {
          name: "Michael Chang",
          initials: "MC",
          role: "Portfolio Director",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t14b,
      },
    ],
    touches: {
      contactsReached: { current: 2, total: 5 },
      totalTouches: 3,
      progress: 40,
      touchStatuses: ["completed", "completed", "completed", "empty", "empty"],
      deadline: touchDeadlines[13],
    },
    recommendedContacts: company14Contacts,
  },
  {
    id: "15",
    name: "Zenith Manufacturing",
    website: "zenithmfg.com",
    industry: "Manufacturing",
    pvsScore: "Medium",
    conversionTrigger: "Visited Product Page",
    status: "In Progress",
    signals: COMPANY_SIGNALS["15"],
    tasks: [
      {
        id: "t15a",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "William Roberts",
          initials: "WR",
          role: "Operations VP",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t15a,
      },
      {
        id: "t15b",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Charlotte Evans",
          initials: "CE",
          role: "Supply Chain Director",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t15b,
      },
    ],
    touches: {
      contactsReached: { current: 2, total: 6 },
      totalTouches: 4,
      progress: 33,
      touchStatuses: ["completed", "completed", "empty", "empty", "empty"],
      deadline: touchDeadlines[14],
    },
    recommendedContacts: company15Contacts,
  },
  {
    id: "16",
    name: "Meridian Health",
    website: "meridianhealth.com",
    industry: "Healthcare",
    pvsScore: "High",
    conversionTrigger: "Attended Webinar",
    status: "In Progress",
    signals: COMPANY_SIGNALS["16"],
    tasks: [
      {
        id: "t16a",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Next Week",
        contact: {
          name: "Oliver Wright",
          initials: "OW",
          role: "Healthcare Administrator",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t16a,
      },
      {
        id: "t16b",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Next Week",
        contact: {
          name: "Emma Harris",
          initials: "EH",
          role: "Patient Care Director",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t16b,
      },
    ],
    touches: {
      contactsReached: { current: 0, total: 3 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[15],
    },
    recommendedContacts: company16Contacts,
  },

  // 10% with 3 tasks (2 companies)
  {
    id: "17",
    name: "Apex Consulting",
    website: "apexconsulting.com",
    industry: "Management Consulting",
    pvsScore: "Medium",
    conversionTrigger: "Downloaded Case Study",
    status: "In Progress",
    signals: COMPANY_SIGNALS["17"],
    tasks: [
      {
        id: "t17a",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Alexander King",
          initials: "AK",
          role: "Managing Consultant",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t17a,
      },
      {
        id: "t17b",
        title: "Call Contact and Source Additional Contacts : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Madison Scott",
          initials: "MS",
          role: "Strategy Director",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t17b,
      },
      {
        id: "t17c",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Liam Anderson",
          initials: "LA",
          role: "Senior Partner",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t17c,
      },
    ],
    touches: {
      contactsReached: { current: 3, total: 5 },
      totalTouches: 6,
      progress: 60,
      touchStatuses: ["completed", "completed", "completed", "completed", "empty"],
      deadline: touchDeadlines[16],
    },
    recommendedContacts: company17Contacts,
  },
  {
    id: "18",
    name: "Sterling Logistics",
    website: "sterlinglogistics.com",
    industry: "Logistics & Supply Chain",
    pvsScore: "High",
    conversionTrigger: "Signed Up for Trial",
    status: "In Progress",
    signals: COMPANY_SIGNALS["18"],
    tasks: [
      {
        id: "t18a",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Ethan Collins",
          initials: "EC",
          role: "Logistics Manager",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t18a,
      },
      {
        id: "t18b",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "This Week",
        contact: {
          name: "Harper Bailey",
          initials: "HB",
          role: "Transportation Director",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t18b,
      },
      {
        id: "t18c",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "This Week",
        contact: {
          name: "Mason Cooper",
          initials: "MC",
          role: "VP Supply Chain",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t18c,
      },
    ],
    touches: {
      contactsReached: { current: 1, total: 4 },
      totalTouches: 2,
      progress: 25,
      touchStatuses: ["completed", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[17],
    },
    recommendedContacts: company18Contacts,
  },

  // 3% with 4 tasks (1 company) - rounded up
  {
    id: "19",
    name: "Pinnacle Solutions",
    website: "pinnaclesolutions.com",
    industry: "Enterprise Software",
    pvsScore: "High",
    conversionTrigger: "Requested Consultation",
    status: "In Progress",
    signals: COMPANY_SIGNALS["19"],
    tasks: [
      {
        id: "t19a",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Avery Morgan",
          initials: "AM",
          role: "Chief Technology Officer",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t19a,
      },
      {
        id: "t19b",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Ella Peterson",
          initials: "EP",
          role: "VP Engineering",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t19b,
      },
      {
        id: "t19c",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Sebastian Gray",
          initials: "SG",
          role: "Director of IT",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t19c,
      },
      {
        id: "t19d",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Scarlett Hughes",
          initials: "SH",
          role: "Tech Operations Manager",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t19d,
      },
    ],
    touches: {
      contactsReached: { current: 2, total: 6 },
      totalTouches: 5,
      progress: 33,
      touchStatuses: ["completed", "completed", "completed", "empty", "empty"],
      deadline: touchDeadlines[18],
    },
    recommendedContacts: company19Contacts,
  },

  // 2% with 5 tasks (1 company) - rounded up
  {
    id: "20",
    name: "Titan Enterprises",
    website: "titanenterprises.com",
    industry: "Industrial Technology",
    pvsScore: "Medium",
    conversionTrigger: "Viewed Pricing Page",
    status: "In Progress",
    signals: COMPANY_SIGNALS["20"],
    tasks: [
      {
        id: "t20a",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Naomi Katsumoto",
          initials: "NK",
          role: "Digital Marketing Strategist",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t20a,
      },
      {
        id: "t20b",
        title: "Call Contact and Source Additional Contacts : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Jackson West",
          initials: "JW",
          role: "Demand Generation Manager",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t20b,
      },
      {
        id: "t20c",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Today",
        contact: {
          name: "Amelia Chen",
          initials: "AC",
          role: "Growth Marketing Lead",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t20c,
      },
      {
        id: "t20d",
        title: "Call contact to follow up : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Ricardo Silva",
          initials: "RS",
          role: "Marketing Operations Specialist",
          avatarColor: getRandomColor(),
        },
        action: "call",
        notes: taskNotes.t20d,
      },
      {
        id: "t20e",
        title: "Send Connection request : Book of Business Priority 1",
        priority: "P1",
        dueDate: "Tomorrow",
        contact: {
          name: "Victoria Lin",
          initials: "VL",
          role: "CMO",
          avatarColor: getRandomColor(),
        },
        action: "linkedin",
        notes: taskNotes.t20e,
      },
    ],
    touches: {
      contactsReached: { current: 4, total: 7 },
      totalTouches: 8,
      progress: 57,
      touchStatuses: ["completed", "completed", "completed", "completed", "completed"],
      deadline: touchDeadlines[19],
    },
    recommendedContacts: company20Contacts,
  },

  // -------- P2 companies (no pre-generated research or sequences) --------
  {
    id: "21",
    name: "Northwind Logistics",
    website: "northwindlogistics.com",
    industry: "Supply Chain & Logistics",
    pvsScore: "Medium",
    conversionTrigger: "Visited Pricing Page",
    status: "New",
    priority: "P2",
    hasGeneratedStrategy: false,
    lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING],
    tasks: [],
    touches: {
      contactsReached: { current: 0, total: 3 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[0],
    },
    recommendedContacts: [
      { id: "c21a", name: "Hannah Reeves", initials: "HR", role: "VP Operations", avatarColor: "bg-trellis-blue-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 1, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
      { id: "c21b", name: "Daniel Park", initials: "DP", role: "Director of Logistics", avatarColor: "bg-trellis-teal-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [] },
      { id: "c21c", name: "Renata Costa", initials: "RC", role: "Procurement Lead", avatarColor: "bg-trellis-orange-500", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
    ],
  },
  {
    id: "22",
    name: "Solaris Renewable",
    website: "solarisrenewable.com",
    industry: "Clean Energy",
    pvsScore: "Medium",
    conversionTrigger: "Downloaded Whitepaper",
    status: "New",
    priority: "P2",
    hasGeneratedStrategy: false,
    lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE],
    tasks: [],
    touches: {
      contactsReached: { current: 0, total: 3 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[1],
    },
    recommendedContacts: [
      { id: "c22a", name: "Owen Caldwell", initials: "OC", role: "Head of Growth", avatarColor: "bg-trellis-green-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_HIRE] },
      { id: "c22b", name: "Marisol Vega", initials: "MV", role: "Director of Marketing", avatarColor: "bg-trellis-pink-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [] },
      { id: "c22c", name: "Theo Nakamura", initials: "TN", role: "Revenue Operations", avatarColor: "bg-trellis-purple-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
    ],
  },
  {
    id: "23",
    name: "Brightline Health",
    website: "brightlinehealth.com",
    industry: "Healthcare Technology",
    pvsScore: "Medium",
    conversionTrigger: "Attended Webinar",
    status: "New",
    priority: "P2",
    hasGeneratedStrategy: false,
    lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL, SIGNALS.ATTENDED_WEBINAR],
    tasks: [],
    touches: {
      contactsReached: { current: 0, total: 3 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[2],
    },
    recommendedContacts: [
      { id: "c23a", name: "Ines Pereira", initials: "IP", role: "Chief of Staff", avatarColor: "bg-trellis-indigo-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 1, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.RECENT_QL] },
      { id: "c23b", name: "Andre Walters", initials: "AW", role: "VP Marketing", avatarColor: "bg-trellis-magenta-800", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.ATTENDED_WEBINAR] },
      { id: "c23c", name: "Sasha Petrov", initials: "SP", role: "Director, Demand Gen", avatarColor: "bg-trellis-blue-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [] },
    ],
  },
  {
    id: "24",
    name: "Verdant Foods",
    website: "verdantfoods.com",
    industry: "Consumer Packaged Goods",
    pvsScore: "Low",
    conversionTrigger: "Visited Product Page",
    status: "New",
    priority: "P2",
    hasGeneratedStrategy: false,
    lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER],
    tasks: [],
    touches: {
      contactsReached: { current: 0, total: 3 },
      totalTouches: 0,
      progress: 0,
      touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
      deadline: touchDeadlines[3],
    },
    recommendedContacts: [
      { id: "c24a", name: "Priscilla Hayes", initials: "PH", role: "Head of E-commerce", avatarColor: "bg-trellis-orange-500", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.PAST_HUBSPOT_USER] },
      { id: "c24b", name: "Mateo Alvarez", initials: "MA", role: "VP, Brand", avatarColor: "bg-trellis-green-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [] },
      { id: "c24c", name: "Lola Bennett", initials: "LB", role: "CRM Manager", avatarColor: "bg-trellis-teal-600", recentTouches: 0, enrolledInSequence: false, recentConversions: 0, lastContactedDate: getRandomLastContactedDate(), signals: [SIGNALS.VIEWED_PRICING] },
    ],
  },
];

type PlayCompanySeed = {
  id: string;
  name: string;
  website: string;
  industry: string;
  pvs: "High" | "Medium" | "Low";
  trigger: string;
  priority: "P1" | "P2" | "P3" | "P4";
  signal: SignalInstance;
  contacts: Array<[string, string]>;
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

let playDeadlineIdx = 0;
const buildPlayCompany = (seed: PlayCompanySeed): Company => ({
  id: seed.id,
  name: seed.name,
  website: seed.website,
  industry: seed.industry,
  pvsScore: seed.pvs,
  conversionTrigger: seed.trigger,
  status: "New",
  priority: seed.priority,
  hasGeneratedStrategy: false,
  lastContactedDate: getRandomLastContactedDate(), signals: [seed.signal],
  tasks: [],
  touches: {
    contactsReached: { current: 0, total: seed.contacts.length },
    totalTouches: 0,
    progress: 0,
    touchStatuses: ["empty", "empty", "empty", "empty", "empty"],
    deadline: touchDeadlines[playDeadlineIdx++ % touchDeadlines.length],
  },
  recommendedContacts: seed.contacts.map(([cn, role], i) => ({
    id: `${seed.id}-c${i + 1}`,
    name: cn,
    initials: initialsOf(cn),
    role,
    avatarColor: avatarColors[(i + seed.id.length) % avatarColors.length],
    recentTouches: 0,
    enrolledInSequence: false,
    recentConversions: 0,
    signals: i === 0 ? [seed.signal] : [],
  })),
});

const playCompanySeeds: PlayCompanySeed[] = [
  { id: "sf-1", name: "Cobalt CRM Group", website: "cobaltcrm.com", industry: "B2B Software", pvs: "High", trigger: "Evaluating CRM alternatives", priority: "P2", signal: SIGNALS.PAST_HUBSPOT_USER, contacts: [["Dana Mercer", "RevOps Director"], ["Paul Iverson", "Head of Sales"]] },
  { id: "sf-2", name: "Harbor & Finch", website: "harborfinch.com", industry: "Professional Services", pvs: "Medium", trigger: "Booked a demo", priority: "P2", signal: SIGNALS.RECENT_QL, contacts: [["Greta Holm", "VP Marketing"], ["Sam Devlin", "Sales Ops Lead"]] },
  { id: "sf-3", name: "Westbrook Retail Co.", website: "westbrookretail.com", industry: "Retail", pvs: "Medium", trigger: "Salesforce renewal approaching", priority: "P2", signal: SIGNALS.PAST_HUBSPOT_USER, contacts: [["Nina Patel", "CRM Manager"], ["Theo Brunner", "Director of Sales"]] },
  { id: "sf-4", name: "Lumen Software", website: "lumensoftware.io", industry: "Software", pvs: "High", trigger: "Compared pricing", priority: "P2", signal: SIGNALS.VIEWED_PRICING, contacts: [["Erin Cole", "COO"], ["Raj Malhotra", "RevOps Manager"]] },
  { id: "sf-5", name: "Tradewind Freight", website: "tradewindfreight.com", industry: "Logistics", pvs: "Medium", trigger: "Visited migration guide", priority: "P2", signal: SIGNALS.ATTENDED_WEBINAR, contacts: [["Mona Reyes", "VP Revenue"], ["Bill Hartley", "Sales Director"]] },
  { id: "sf-6", name: "Maple Financial", website: "maplefinancial.com", industry: "Financial Services", pvs: "Medium", trigger: "Requested ROI assessment", priority: "P2", signal: SIGNALS.PAST_HUBSPOT_USER, contacts: [["Aisha Karim", "Head of Operations"], ["Dan Foley", "CRM Administrator"]] },
  { id: "aeo-1", name: "Beacon Digital Media", website: "beacondigital.com", industry: "Marketing & Advertising", pvs: "High", trigger: "Downloaded AEO playbook", priority: "P3", signal: SIGNALS.ATTENDED_WEBINAR, contacts: [["Chloe Adams", "Content Lead"], ["Marco Bianchi", "SEO Manager"]] },
  { id: "aeo-2", name: "Northstar Content", website: "northstarcontent.com", industry: "Media", pvs: "Medium", trigger: "Read AI search guide", priority: "P3", signal: SIGNALS.VIEWED_PRICING, contacts: [["Iris Wagner", "Editor in Chief"], ["Leo Park", "Growth Manager"]] },
  { id: "aeo-3", name: "Prism Analytics Lab", website: "prismanalytics.io", industry: "Data Analytics", pvs: "High", trigger: "Attended AEO webinar", priority: "P3", signal: SIGNALS.RECENT_QL, contacts: [["Sara Quinn", "VP Marketing"], ["Tomas Vidal", "Analytics Lead"]] },
  { id: "aeo-4", name: "Evergreen Publishing", website: "evergreenpub.com", industry: "Publishing", pvs: "Medium", trigger: "Signed up for newsletter", priority: "P3", signal: SIGNALS.VIEWED_PRICING, contacts: [["Faye Mitchell", "Digital Director"], ["Owen Bradley", "Content Strategist"]] },
  { id: "aeo-5", name: "Skyline Marketing Group", website: "skylinemktg.com", industry: "Marketing & Advertising", pvs: "Medium", trigger: "Viewed AI content page", priority: "P3", signal: SIGNALS.ATTENDED_WEBINAR, contacts: [["Hana Sato", "Demand Gen Lead"], ["Eli Roth", "Brand Lead"]] },
  { id: "aeo-6", name: "Cadence Media", website: "cadencemedia.com", industry: "Media", pvs: "Low", trigger: "Researched competitors", priority: "P3", signal: SIGNALS.VIEWED_PRICING, contacts: [["Priya Anand", "Head of Content"], ["Jack Doyle", "SEO Specialist"]] },
  { id: "ent-1", name: "Continental Manufacturing", website: "continentalmfg.com", industry: "Manufacturing", pvs: "High", trigger: "Expansion inquiry", priority: "P2", signal: SIGNALS.PAST_HUBSPOT_USER, contacts: [["Karl Brandt", "VP IT"], ["Lucia Romano", "Procurement Director"]] },
  { id: "ent-2", name: "Granite Holdings", website: "graniteholdings.com", industry: "Financial Services", pvs: "High", trigger: "Multi-seat quote request", priority: "P2", signal: SIGNALS.RECENT_HIRE, contacts: [["Margaret Shaw", "CFO"], ["Devon Pierce", "IT Director"]] },
  { id: "ent-3", name: "Vanguard Industrial", website: "vanguardindustrial.com", industry: "Industrial Technology", pvs: "Medium", trigger: "Viewed enterprise plan", priority: "P2", signal: SIGNALS.VIEWED_PRICING, contacts: [["Hugo Vance", "COO"], ["Tara Singh", "Operations Director"]] },
  { id: "ent-4", name: "Imperial Foods Group", website: "imperialfoods.com", industry: "Food & Beverage", pvs: "Medium", trigger: "Requested security review", priority: "P2", signal: SIGNALS.ATTENDED_WEBINAR, contacts: [["Rosa Lind", "VP Digital"], ["Neil Carver", "IT Lead"]] },
  { id: "ent-5", name: "Sovereign Telecom", website: "sovereigntelecom.com", industry: "Telecommunications", pvs: "High", trigger: "Renewal plus expansion", priority: "P2", signal: SIGNALS.PAST_HUBSPOT_USER, contacts: [["Amir Haddad", "VP Sales"], ["Beth Cromwell", "RevOps Manager"]] },
  { id: "ent-6", name: "Atlas Aerospace", website: "atlasaerospace.com", industry: "Aerospace", pvs: "High", trigger: "Procurement engaged", priority: "P2", signal: SIGNALS.RECENT_HIRE, contacts: [["Greg Mason", "Director of Operations"], ["Yuki Tanaka", "Program Manager"]] },
  { id: "wb-1", name: "Bluebird Boutique", website: "bluebirdboutique.com", industry: "Retail", pvs: "Low", trigger: "Reopened account", priority: "P4", signal: SIGNALS.VIEWED_PRICING, contacts: [["Ella Frost", "Owner"], ["Marcus Reed", "Store Manager"]] },
  { id: "wb-2", name: "Corner Cafe Collective", website: "cornercafeco.com", industry: "Hospitality", pvs: "Low", trigger: "Re-engaged via email", priority: "P4", signal: SIGNALS.RECENT_QL, contacts: [["Joy Tan", "Founder"], ["Pete Salas", "Operations Lead"]] },
  { id: "wb-3", name: "Rapid Repair Auto", website: "rapidrepairauto.com", industry: "Automotive Services", pvs: "Low", trigger: "Requested a callback", priority: "P4", signal: SIGNALS.VIEWED_PRICING, contacts: [["Vince Marino", "Owner"], ["Dana Beck", "Service Manager"]] },
  { id: "wb-4", name: "Sunny Day Childcare", website: "sunnydaychildcare.com", industry: "Education", pvs: "Low", trigger: "Restarted trial", priority: "P4", signal: SIGNALS.ATTENDED_WEBINAR, contacts: [["Grace Howell", "Director"], ["Sam Ortiz", "Admin Lead"]] },
  { id: "wb-5", name: "Peak Fitness Studios", website: "peakfitnessstudios.com", industry: "Health & Fitness", pvs: "Low", trigger: "Viewed pricing again", priority: "P4", signal: SIGNALS.VIEWED_PRICING, contacts: [["Tyler Quinn", "Owner"], ["Mia Larson", "General Manager"]] },
  { id: "wb-6", name: "Hometown Hardware", website: "hometownhardware.com", industry: "Retail", pvs: "Low", trigger: "Won-back lead", priority: "P4", signal: SIGNALS.RECENT_QL, contacts: [["Roy Becker", "Owner"], ["Lena Voss", "Buyer"]] },
];

const generatedPlayCompanies: Company[] = playCompanySeeds.map(buildPlayCompany);

export const prospectingCompanies: Company[] = [...rawProspectingCompanies, ...generatedPlayCompanies].map((company) => {
  const primary = company.recommendedContacts?.[0];
  if (!primary) return company;
  const derived = deriveTouchesForContact(primary.id, primary.name);
  const reachedCount =
    derived.state.call.kind === "connected" ||
    derived.state.linkedin.kind === "accepted" ||
    derived.state.linkedin.kind === "already-connected" ||
    (derived.state.sequence.kind === "unenrolled" &&
      derived.state.sequence.reason.includes("replied"))
      ? Math.max(1, company.touches.contactsReached?.current ?? 1)
      : derived.count > 0
        ? Math.min(1, company.touches.contactsReached?.total ?? 1)
        : 0;
  return {
    ...company,
    touches: {
      ...company.touches,
      touchStatuses: derived.statuses,
      totalTouches: derived.count,
      progress: Math.min(100, Math.round((derived.count / 5) * 100)),
      contactsReached: {
        current: reachedCount,
        total: company.touches.contactsReached?.total ?? company.recommendedContacts?.length ?? 1,
      },
    },
  };
});
