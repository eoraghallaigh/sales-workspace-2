// Strategy content per company, per variant (AI-generated company research + outreach copy).
//
// The Company Research Agent produces variable-headed sections per company —
// the headings ("The company", "Recent triggers", "Tech stack", "Gaps worth noting", etc.)
// shift based on what the agent actually finds. We model that as a `sections` array
// so the prototype can render the agent's real output shape rather than a fixed schema.
//
// `summaryBullets` is the agent's TL;DR — at most 5 scannable lines shown on the
// strategy page. The full `sections` are read in the assistant ("Read full research").

export type StrategyVariantId = "default" | "salesforce-displacement";

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface StrategySection {
  heading: string;
  body: string;
}

export interface ResearchTableRow {
  category: string;
  content: string;
}

export interface CompanyStrategyVariant {
  summary: string;
  summaryBullets: string[];
  sections: StrategySection[];
  researchTable?: ResearchTableRow[];
  researchConflicts?: string;
  generatedAt?: string;
  // When true, the strategy page prints the full `sections` inline instead of the
  // TL;DR bullets + "Read full research" link. Used to contrast the condensed vs.
  // full-research treatments side by side in the prototype.
  showFullResearch?: boolean;
  contactDescription: (firstName: string, companyName: string) => string;
  primaryFriction: (companyName: string) => string;
  callBullets: (companyName: string) => string[];
  callScript: (companyName: string, firstName: string) => string;
  linkedInMessage: (companyName: string, firstName: string) => string;
  emailTemplates: (companyName: string, firstName: string) => EmailTemplate[];
}

export type CompanyStrategy = Record<StrategyVariantId, CompanyStrategyVariant>;

// ---------- Default-tone outreach copy shared across companies ----------

const defaultContactDescription = (firstName: string, _companyName: string) =>
  `As the visionary behind the platform, ${firstName} is the primary target for COO/CEO-level conversations regarding digital transformation and scaling the business through a unified Smart CRM.`;

const defaultPrimaryFriction = (companyName: string) =>
  `Friction in scaling operations post-acquisition due to fragmented data silos between the legacy Empowering Systems and ${companyName} platforms.`;

const defaultCallBullets = (companyName: string) => [
  `${companyName} partnered with Orbweaver to automate data exchange for manufacturers`,
  `Automated data often leads to fragmented "Franken-stacks" — reps can't find a single source of truth`,
  "HubSpot Sales Hub consolidates data streams into one view",
  "Breeze AI automates prospecting so team stays focused on closing",
];

const defaultCallScript = (companyName: string, _firstName: string) =>
  `"I noticed ${companyName} recently partnered with Orbweaver to automate data exchange for manufacturers. Usually, increasing the volume of automated data leads to fragmented 'Franken-stacks' where reps struggle to find a single source of truth. HubSpot's Sales Hub consolidates these data streams into one view, using Breeze AI to automate prospecting so your team stays focused on closing."`;

const defaultLinkedInMessage = (companyName: string, _firstName: string) =>
  `"I've been following your leadership in the multi-line sales space and would love to connect. Your work integrating Empowering Systems into ${companyName} is fascinating."`;

const defaultEmailTemplates = (companyName: string, firstName: string): EmailTemplate[] => [
  {
    subject: `Scaling ${companyName}'s Content ROI.`,
    body: `Hi ${firstName},\n\nI've been researching ${companyName}'s content strategy and noticed some impressive growth metrics. Many companies in your space are leaving significant ROI on the table by not connecting their content performance data directly to their sales pipeline.\n\nHubSpot's Content Hub can help you attribute revenue directly to content touchpoints, giving your team clear visibility into what's driving deals forward.\n\nWould you be open to a 15-minute conversation about how we could help scale your content ROI?`,
  },
  {
    subject: `Doubling down on ${companyName}'s highest-ROI content`,
    body: `Hi ${firstName},\n\nFollowing up on my previous note — I wanted to share a quick case study. A company similar to ${companyName} was able to 2x their content-influenced pipeline by using AI-powered content recommendations to serve the right assets at the right stage of the buyer's journey.\n\nI'd love to walk you through how this could work for your team. Would next Tuesday or Wednesday work for a brief call?`,
  },
  {
    subject: `Closing the loop on content ROI at ${companyName}`,
    body: `Hi ${firstName},\n\nI know things get busy, so I'll keep this brief. I've put together a short analysis of how ${companyName} could better leverage your existing content library to accelerate deals currently in your pipeline.\n\nNo commitment needed — happy to share the analysis either way. Just let me know if you'd like me to send it over.`,
  },
];

// ---------- Salesforce-displacement variant helper ----------

const makeSalesforceVariant = (
  summary: string,
  summaryBullets: string[],
  sections: StrategySection[],
): CompanyStrategyVariant => ({
  summary,
  summaryBullets,
  sections,
  contactDescription: (firstName, companyName) =>
    `${firstName} is the right person to talk to about consolidating ${companyName}'s sales tech stack. Decision-makers at this level feel the cost of Salesforce most acutely — both in license spend and the admin overhead it creates for their reps.`,
  primaryFriction: (companyName) =>
    `${companyName}'s Salesforce instance has accumulated years of customizations, third-party integrations, and admin debt. Reps spend more time updating fields than selling, and renewal costs continue to climb without a clear ROI story.`,
  callBullets: (companyName) => [
    `${companyName}'s Salesforce contract renewal is approaching — a natural moment to revisit the stack`,
    "Salesforce TCO compounds: license fees + admin headcount + integration costs",
    "HubSpot delivers comparable enterprise-grade CRM with faster time-to-value",
    "Existing customers report 30%+ rep productivity gains after migrating from Salesforce",
  ],
  callScript: (companyName, _firstName) =>
    `"I'm reaching out because I know teams like ${companyName} are reassessing whether Salesforce is still the right fit. The pattern we keep seeing is reps drowning in admin work, AEs paying for seats they barely use, and renewal costs climbing every cycle. HubSpot is purpose-built for the way modern revenue teams actually sell — and we have a structured migration path that gets ${companyName} live in weeks, not quarters. Worth a 20-minute conversation to walk you through what that would look like?"`,
  linkedInMessage: (companyName, _firstName) =>
    `"Hi — I've been talking to a few revenue leaders this quarter who are quietly evaluating Salesforce alternatives ahead of renewal. Given ${companyName}'s growth trajectory, I'd love to share what we're seeing. Open to connecting?"`,
  emailTemplates: (companyName, firstName) => [
    {
      subject: `Salesforce renewal coming up at ${companyName}?`,
      body: `Hi ${firstName},\n\nMost revenue leaders I talk to start re-evaluating their CRM 6–9 months before a Salesforce renewal — usually because the line-item cost has crept past what their team is actually using.\n\nHubSpot is increasingly the answer for growth-stage teams: comparable feature depth, dramatically lower TCO, and a Smart CRM data model that doesn't require a Salesforce admin to maintain.\n\nWould a 20-minute walkthrough — focused on how a team like ${companyName}'s would migrate — be useful before your renewal cycle starts?`,
    },
    {
      subject: `What ${companyName}'s reps actually do in Salesforce all day`,
      body: `Hi ${firstName},\n\nQuick follow-up. In recent migrations from Salesforce to HubSpot, the most consistent finding has been the same: reps were spending 30–40% of their day on data hygiene and CPQ workarounds, not selling.\n\nWe just published a teardown of a typical Salesforce-to-HubSpot migration — happy to share it. The clearest takeaway: companies the size of ${companyName} usually recover their migration cost inside the first renewal cycle.\n\nWorth a look?`,
    },
    {
      subject: `Two paths forward for ${companyName}`,
      body: `Hi ${firstName},\n\nLast note from me. Two paths most teams in your position consider:\n\n1) Renew Salesforce, absorb the price increase, hope adoption improves\n2) Run a structured 30-day evaluation of HubSpot side-by-side, with your real data and your real reps\n\nWe'd cover the migration plan, the cost model, and a candid view of where Salesforce still wins. No pressure either way — just want to make sure ${companyName} has the comparison before the renewal clock runs out.\n\nLet me know if it's worth a conversation.`,
    },
  ],
});

// Generic Salesforce-displacement sections for companies that don't have hand-tuned variants.
const genericDisplacementSections = (companyName: string): StrategySection[] => [
  {
    heading: "Why displacement, why now",
    body: `${companyName} sits in the profile where Salesforce TCO has compounded faster than the team has grown into it: years of customizations, third-party connectors that no one fully owns, and an admin headcount that quietly tracks the license bill.\n\nThe last two renewal cycles in this segment have run 15–22% above prior — that's the inflection point where switching cost stops looking large relative to staying cost.`,
  },
  {
    heading: "What the stack tends to look like underneath",
    body: `- Process Builder / Flow logic written by an admin who has since left\n- 6–9 third-party AppExchange tools, each with its own license line and SSO setup\n- A handful of Apex triggers maintained by a contractor on retainer\n- A CPQ instance that nobody has confidence in\n- Reporting that requires a BI analyst to build because the native reporting "isn't enough"`,
  },
  {
    heading: "Migration path",
    body: `HubSpot's Salesforce-to-HubSpot migration playbook handles historical data, integration mapping, and rep retraining as a coordinated motion. Average mid-market migration is 8–10 weeks from kickoff to full cutover, with the historical Salesforce instance kept in read-only mode for 60 days as a fallback.\n\nWhere this is most useful for ${companyName} is the rep experience side — reps notice immediately that they're not toggling between 14 tabs to log a call.`,
  },
];

const genericDisplacementBullets = (companyName: string): string[] => [
  `${companyName}'s Salesforce TCO has compounded faster than the team has grown into it`,
  "Renewal cycles in this segment are running 15–22% above the prior term",
  "Admin headcount quietly tracks the license bill; reps lose time to data hygiene",
  "HubSpot migration playbook: ~8–10 weeks mid-market, 60-day read-only fallback",
  "Biggest win shows up in rep experience — fewer tabs, less toggling",
];

// ---------- Per-company strategies ----------

export const companyStrategies: Record<string, CompanyStrategy> = {
  "1": {
    default: {
      summary:
        "ACME Corp is an AI-driven B2B cloud CRM and sales data management platform purpose-built for the multi-line selling ecosystem — manufacturers' reps, manufacturers, and distributors.",
      summaryBullets: [
        "AI-driven CRM for the multi-line selling ecosystem (manufacturers' reps, distributors); ~500–1000 employees, ~$75M revenue",
        "$50M Series C (Oct 2025) funded the Empowering Systems acquisition + enterprise sales expansion",
        "Empowering Systems integration is mid-stream and a live pain point (\"two-instance reality\" per ex-employees)",
        "Leadership is heavily ex-Salesforce — relevant for displacement framing",
        "18 open roles incl. 6 enterprise AEs and a twice-posted VP Sales Engineering; no CMO, no confirmed marketing automation",
      ],
      sections: [
        {
          heading: "The company",
          body: `ACME Corp is a 12-year-old, privately held B2B SaaS company headquartered in San Francisco, CA. They build cloud CRM and sales data management software for the multi-line selling ecosystem — independent manufacturers' reps, manufacturers, and distributors. By consolidating CRM, commission tracking, and quoting in one platform, they eliminate administrative busywork for outside sales teams that have historically run on spreadsheets and email.\n\nTheir go-to-market is dual-channel: a direct enterprise motion targeting manufacturers above $50M in revenue, and a rep-firm channel covering roughly 600 independent manufacturers' rep firms in HVAC, plumbing, electrical, and electronics. CRM lists 500-1000 employees and $75M annual revenue. LinkedIn footprint puts them at 782 employees.`,
        },
        {
          heading: "Recent triggers",
          body: `- CRA Conference presentation, February 24, 2026: showcased the Empowering Systems integration to ~1,200 manufacturers' rep attendees. Their first major joint-product showing since the acquisition closed.\n- Orbweaver partnership announced January 2026: automates EDI data exchange between distributors and manufacturers. Public framing was the first leg of an "open data fabric" strategy.\n- Series C round, $50M (October 2025): used to fund the Empowering Systems acquisition and expand the enterprise sales team. Lead investor was Insight Partners.\n- Hiring signal: 18 open roles on Greenhouse as of May 25, including 6 enterprise AE seats and a VP of Sales Engineering opening — the latter posted twice since February.`,
        },
        {
          heading: "Leadership",
          body: `CEO is Daniel Hartwell, who came in from Salesforce's Industries Cloud team in 2019 and has been driving the enterprise expansion ever since. CFO Priya Ramanathan joined in 2023 from Workday. The Empowering Systems acquisition added Rich Gomez (now SVP Product) and Scott Mays (now VP Engineering) to the leadership team.\n\nNo public CRO; the revenue function appears to roll up to Hartwell directly, with two regional VPs of Sales reporting in. Board chair is an Insight Partners managing director.`,
        },
        {
          heading: "Signals and gaps worth noting",
          body: `- Heavy Salesforce-shop DNA in leadership: Hartwell, three of the four SVPs, and most of the new enterprise AEs all came from Salesforce. Worth knowing for displacement framing.\n- No confirmed marketing automation stack. They publish a blog and host two annual events, but the platform behind them isn't identifiable from public sources.\n- The Empowering Systems integration is mid-stream. Glassdoor reviews from former ES employees flag "data model mismatch" and "two-instance reality" as ongoing friction points — likely a live pain.\n- No CMO listed. The marketing function rolls up to a Director of Demand Gen, which suggests there's still room for a senior marketing voice.`,
        },
      ],
      researchTable: [
        {
          category: "Company Overview",
          content: "**12-year-old, privately held B2B SaaS** company headquartered in **San Francisco, CA**\nBuilds **cloud CRM and sales data management** for the multi-line selling ecosystem — manufacturers' reps, manufacturers, and distributors\nConsolidates **CRM, commission tracking, and quoting** in one platform\nTargets outside sales teams that historically ran on **spreadsheets and email**\n**500–1,000 employees**, **~$75M annual revenue** (CRM); **782 employees** on LinkedIn",
        },
        {
          category: "Business Model",
          content: "**Dual-channel B2B SaaS** model\n**Direct enterprise motion** targeting manufacturers above **$50M in revenue**\n**Rep-firm channel** covering ~**600 independent manufacturers' rep firms** in HVAC, plumbing, electrical, and electronics\nRevenue from **CRM, commission tracking, and quoting platform** subscriptions",
        },
        {
          category: "Go-to-Market & Sales Motion",
          content: "**Enterprise-led** sales motion with **AE-driven outbound**\nCurrently hiring **6 enterprise AEs** and a **VP of Sales Engineering** (posted twice since February)\n**No public CRO** — revenue function rolls up to **CEO Daniel Hartwell** directly\n**Two regional VPs of Sales** reporting to Hartwell",
        },
        {
          category: "Sales & Marketing Stack",
          content: "**No confirmed marketing automation** stack\nBlog and **two annual events** run, but the platform behind them is **unidentifiable** from public sources\n**No CMO** — marketing rolls up to a **Director of Demand Gen**\nLeadership DNA is **heavily Salesforce**, suggesting a likely **SF-based CRM stack** internally",
        },
        {
          category: "Pain Signals & Priorities",
          content: "**Empowering Systems integration is mid-stream** — Glassdoor reviews flag **\"data model mismatch\"** and **\"two-instance reality\"** as friction\nPost-acquisition **data-stitching creating Salesforce admin overhead**\n**Hiring burst** (18 open roles) signals **scaling pressure** across the enterprise sales team",
        },
        {
          category: "AI, Data & Automation Maturity",
          content: "**Orbweaver partnership** (Jan 2026) automates **EDI data exchange** between distributors and manufacturers\nFramed as first leg of an **\"open data fabric\" strategy**\n**AI-driven CRM** is their product positioning, but **internal automation maturity unclear**\n**No public references** to marketing automation or AI-assisted workflows for their own ops",
        },
        {
          category: "Key Personas & Stakeholders",
          content: "**CEO Daniel Hartwell** — ex-Salesforce Industries Cloud, joined 2019, drives enterprise expansion\n**CFO Priya Ramanathan** — ex-Workday, joined 2023\n**SVP Product Rich Gomez** — came in via Empowering Systems acquisition\n**VP Engineering Scott Mays** — came in via Empowering Systems acquisition\n**Board chair** — Insight Partners managing director\n**No public CRO**; two regional VPs of Sales report to Hartwell",
        },
        {
          category: "Growth Signals",
          content: "**$50M Series C** (October 2025) from **Insight Partners**\nFunded the **Empowering Systems acquisition** + enterprise sales expansion\n**18 open roles** on Greenhouse (as of May 25), including **6 enterprise AE seats**\n**CRA Conference presentation** (Feb 2026) — first major joint-product showing post-acquisition (~1,200 attendees)",
        },
        {
          category: "Strategic Partnerships",
          content: "**Orbweaver** — automates EDI data exchange between distributors and manufacturers (announced Jan 2026)\n**Empowering Systems** — acquired, integration ongoing\n**No other public technology alliances** or marketplace listings identified",
        },
        {
          category: "Positioning & Messaging",
          content: "Positions as the **purpose-built CRM for multi-line selling**\nCore message: **eliminating administrative busywork** for outside sales teams\nEmphasis on **consolidating CRM, commission tracking, and quoting** in one platform\nTargets reps who have been running on **spreadsheets and email**",
        },
        {
          category: "Website Quality",
          content: "**Professional B2B SaaS** site with product pages, blog, and event listings\nHosts **two annual industry events**\nContent focused on the **manufacturing/distribution vertical**\n**No pricing page** publicly visible",
        },
        {
          category: "Location",
          content: "**HQ: San Francisco, CA**\nNo additional offices confirmed\nPost-acquisition, **Empowering Systems team likely distributed**",
        },
        {
          category: "Recent News & Announcements",
          content: "**CRA Conference presentation** (Feb 24, 2026) — showcased ES integration to ~1,200 attendees\n**Orbweaver partnership** announced (Jan 2026)\n**$50M Series C** closed (Oct 2025)\n**VP of Sales Engineering** role posted twice since February",
        },
        {
          category: "Active Sales Plays",
          content: "**No HubSpot sales plays** currently assigned\n**Salesforce displacement** is the strongest angle given ex-SF leadership DNA\n**Post-acquisition stack rationalization** creates a natural evaluation window",
        },
      ],
      researchConflicts: "**Salesforce DNA in leadership** could cut either way — they know what SF does well but also know its limits at scale\n**No confirmed marketing automation** creates a blind spot for the marketing hub pitch\n**Empowering Systems integration status unclear** — could be nearly done or deeply stuck\n**No CMO** — marketing rolls up to Director of Demand Gen, which may limit enterprise marketing conversations",
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "ACME runs a complex multi-line motion that's a textbook case for why Salesforce becomes a tax over time — every new product line and rep tier adds custom objects, validation rules, and admin hours.",
      [
        "Multi-line motion = textbook Salesforce-tax: every product line/rep tier adds custom objects + admin hours",
        "Hiring and integration signals point to active stack rationalization",
        "Two heavily-customized Salesforce instances post-acquisition; 4 admins on LinkedIn",
        "HubSpot's data model handles the manufacturers'-rep hierarchy natively",
        "Empowering Systems data-stitching is exactly where SF admin overhead balloons",
      ],
      [
        {
          heading: "Renewal cycle in the window",
          body: `Public hiring and integration signals point to ACME being in active stack-rationalization mode. Manufacturers' rep firms historically pay outsized Salesforce premiums for use cases HubSpot now covers natively. The Empowering Systems integration is exactly the kind of post-acquisition data-stitching project where Salesforce admin overhead balloons.`,
        },
        {
          heading: "What it looks like underneath",
          body: `- Two Salesforce instances post-acquisition, both heavily customized\n- 7+ AppExchange tools layered on for quoting, commissions, and territory management\n- Process Builder logic touching the rep-firm hierarchy that's hard to migrate without breaking the channel\n- A Salesforce admin headcount of 4 confirmed via LinkedIn`,
        },
        {
          heading: "Migration angle",
          body: `Migrating onto a unified Smart CRM consolidates the data fabric ACME is building externally with Orbweaver, but doing it on top of the existing Salesforce footprint adds another integration layer. HubSpot's data model handles the manufacturers' rep hierarchy natively, which removes a class of customizations entirely.`,
        },
      ],
    ),
  },
  "2": {
    default: {
      summary:
        "TechVision is a Series-B-funded B2B data analytics platform in aggressive sales hiring mode under a brand-new VP of Sales.",
      summaryBullets: [
        "B2B data analytics/BI platform for mid-market; ~$30M ARR, ~300 employees",
        "$30M Series B (Jan 2026) explicitly earmarked for enterprise sales expansion",
        "New VP Sales Maria Esposito (ex-Looker) hired Mar 2026 — building the team right now",
        "15 open sales roles since March; ramping headcount is the throttle on growth",
        "No confirmed CRM — likely a near-term buying decision; no CMO (marketing under the COO)",
      ],
      sections: [
        {
          heading: "Who they are",
          body: `TechVision Inc is a B2B data analytics and BI platform founded in 2018, headquartered in Austin, TX. Their core product is a self-serve analytics layer for revenue teams — packaged dashboards for sales pipeline, marketing attribution, and CS health, with a notable focus on mid-market companies that have outgrown spreadsheets but aren't ready for an enterprise BI rollout. CRM has them at 200-500 employees and $30M ARR (public quote from their Series B announcement).`,
        },
        {
          heading: "What just happened",
          body: `- Series B funding round, $30M, January 8, 2026. Led by Battery Ventures with Foundation Capital and Tola Capital participating. Press release explicitly named "enterprise sales expansion" as use of funds.\n- Maria Esposito hired as VP of Sales, March 17, 2026. Came in from Looker (post-Google) where she ran a 40-person mid-market team. Her LinkedIn announcement post pulled 1,800+ reactions, mostly from competing sales reps.\n- 15 open sales roles posted between March 17 and May 20: 9 AE seats, 3 SDR seats, 2 Sales Engineer seats, 1 Director of Revenue Operations. The volume is unusual for a $30M ARR company and tracks with the Series B mandate.\n- Q1 portfolio update letter from Battery (excerpts leaked on Twitter): "TechVision is one of the few in our portfolio where every AE has been net-revenue positive in their first quarter." Suggests the GTM motion is working; ramping headcount is the throttle.`,
        },
        {
          heading: "Stack notes",
          body: `Public stack hints: Stripe for billing, Snowflake for product warehouse (referenced in a Snowflake case study, October 2024), Marketo for marketing automation (job listings reference Marketo proficiency). CRM is unconfirmed — no Salesforce or HubSpot job listings, no admin role posted. The new VP of Sales coming from a Salesforce-heavy shop is notable.`,
        },
        {
          heading: "Gaps worth noting",
          body: `- No confirmed CRM is a real gap. Either they're running on a CRM that's not generating public hiring signals, or they're at the "sales ops in a spreadsheet" stage that a Series B + new VP usually forces a decision on within 90 days.\n- No CMO; marketing rolls up to the COO. The new VP of Sales has no obvious peer relationship on the marketing side, which usually means GTM alignment is something the CEO is mediating.\n- Employee count is hard to verify. LinkedIn says 240, CRM says 200-500. Series B materials cited "over 300" which suggests rapid hiring in flight.\n- No public information on customer concentration, churn, or net retention. Series B announcement was light on the usual metrics, which can be a tell.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "TechVision's Series B + new VP of Sales is the classic Salesforce-displacement profile: a leader being asked to scale revenue fast, inheriting a CRM no one trusts.",
      [
        "Series B + new VP Sales = classic displacement profile (scale fast, inherit a CRM no one trusts)",
        "Buying window is open now — vendor consolidation is typical in the first 12 months post-raise",
        "Peer companies' Salesforce evaluations lost on time-to-value, not feature depth",
        "Replace before the team triples to avoid years of compounding admin debt",
        "Smart CRM data model also fits the self-serve analytics they sell",
      ],
      [
        {
          heading: "The buying window is open right now",
          body: `Newly funded growth-stage companies routinely consolidate vendors in their first 12 months post-raise. With a new sales leader actively evaluating tools and 15 open seats to fill, TechVision is squarely in the buying window for a Salesforce alternative.`,
        },
        {
          heading: "What we're seeing in peer companies",
          body: `Mid-market data analytics vendors that went through a similar funding-plus-new-VP combination in 2024-2025 reported:\n- 4-6 month decision cycles on CRM, usually concluded before the first 50 hires are onboarded\n- Salesforce evaluations that lost on time-to-value rather than feature depth\n- Marketing operations stack (Marketo) often replaced in parallel to consolidate vendor count`,
        },
        {
          heading: "Migration angle",
          body: `Replacing Salesforce now — before the team triples — avoids years of compounding admin debt. HubSpot's modern data model and AI-native workflow position the new sales org for productivity from day one. The Smart CRM data model also handles the kinds of self-serve analytics use cases TechVision sells, which becomes a relevant talking point.`,
        },
      ],
    ),
  },
  "3": {
    default: {
      summary:
        "Advanced Satellite Communications is a 35-year-old commercial technology systems integrator (satellite TV + integrated security) in Livonia, MI — a net-new P1 with a fresh inbound signal getting single-threaded email outreach.",
      summaryBullets: [
        "35-year-old commercial technology systems integrator (satellite TV + security); ~50 employees, Livonia, MI",
        "Net-new P1, no deal ever created across two engagement windows (2019 and now)",
        "Fresh inbound conversion (~May 15, 2026) from Michelle Rivera triggered the current cycle",
        "Single-threaded email outreach, no calls — 2 of 5 SLA touches with the clock ticking",
        "DIRECTV-dependent entertainment line; no visible marketing or sales-engagement stack",
      ],
      sections: [
        {
          heading: "Who they are to HubSpot",
          body: `Net-new prospect, rated P1 in the PPF. No deal has ever been created for this account despite two separate engagement windows (2019 and now). They've been in HubSpot since November 2019 when a Chris Morgan requested a demo, but that never converted. The current cycle was triggered about two weeks ago when Michelle Rivera had a conversion event (around May 15, 2026), likely a web or form-based inbound action.`,
        },
        {
          heading: "Current engagement status",
          body: `Macey Montgomery (AE) owns the outreach. She's sent 3 emails to Michelle Rivera between May 15 and May 22, all under the subject "HubSpot Intro," progressively asking about challenges, lead gen/management pain, and current tech stack. No reply from Michelle. No call attempts logged against any contact. The SLA requires 5 touches in 14 days, and they're at 2 of 5 with the clock ticking.`,
        },
        {
          heading: "The company",
          body: `Advanced Satellite Communications, Inc. (also operating as A.S.C. Security Systems) is a 35-year-old, privately held B2B commercial technology systems integrator in Livonia, Michigan. CRM says 50 employees. Two revenue lines:\n\n- Commercial entertainment/satellite TV: They're a DIRECTV "commercial VIP dealer," selling and installing satellite TV systems, digital signage, and their flagship Advanced Entertainment Platform (AEP) for hospitality and senior living. Minimum 75+ rooms/units.\n- Integrated security systems: cameras, alarms, access control (Keyscan), intercoms, including correctional-grade solutions.\n\nTheir go-to-market is consultative, inbound-weighted (demo and estimate request forms backed by phone follow-up), with long-term service contracts as recurring revenue. The Presbyterian Villages of Michigan relationship spans 14 years across 7 communities and ~800 residents, which gives you a sense of deal stickiness. (advancedsat.com/testimonials/)\n\nKey verticals: senior living, hospitality, correctional facilities, healthcare, restaurants/sports bars, and higher ed (University of Michigan Athletics is a named client). Senior living and corrections are the heaviest in their testimonials.`,
        },
        {
          heading: "Leadership",
          body: `This is where it gets thin. The only confirmed leader is Gus Semaan, whose LinkedIn lists him at "Advanced Satellite Comm's. Inc. & A.S.C. Security Systems" without a clear title (linkedin.com/in/gus-semaan-172b10b). Client testimonials reference him by first name as the primary point of contact for system design. A "Gerry" is also referenced in testimonials but no surname surfaced. No C-suite, no org chart, no leadership page on the website. This looks like an owner-operated firm.\n\nNo marketing function is visible: no blog, no social media presence, no content marketing. Growth appears to be referrals, direct outreach, and the DIRECTV dealer channel.`,
        },
        {
          heading: "CRM contacts (ranked)",
          body: `- Michelle Rivera (m.rivera@advancedsat.com) — currently enrolled in a sequence, 3 emails sent, no response, no title in CRM. She's the active contact.\n- Christopher Lelli (clelli@advancedsat.com) — completely untouched this cycle despite a conversion event ~2 years ago (May 2024). No title in CRM. Strong multi-threading candidate.\n- Chris Morgan — the original 2019 demo requester. His CRM email is a personal Gmail (ffisystems domain), and there's a likely duplicate record under cmorgan@advancedsat.com. Zero outreach this cycle.`,
        },
        {
          heading: "Signals and gaps worth noting",
          body: `- No funding, M&A, hiring, or recent press found. Very low public media footprint, consistent with a small private firm.\n- Their DIRECTV dependency is significant — the core entertainment revenue line is entirely built on that dealer relationship. DIRECTV is now a standalone entity after the AT&T divestiture, which could be creating uncertainty around commercial distribution strategy.\n- No CRM, marketing automation, or sales engagement stack is identifiable from public sources. Their website contact form is basic with no visible platform embed.\n- The "one-stop" integrator positioning (bundling entertainment and security under one vendor) is their stated differentiator.\n- Website was last fully overhauled in 2021, though a Fall 2024 AEP video update suggests ongoing product investment.`,
        },
        {
          heading: "What I'd flag",
          body: `This is a P1 with a fresh inbound signal that's getting single-threaded email outreach with no phone attempts. Michelle hasn't responded to 3 emails in 13 days, and the SLA needs 3 more touches. Christopher Lelli is sitting there untouched. If you or Macey want to salvage this window, a call to Michelle and a parallel thread to Lelli would be the move. The 2019 cycle died the same way (emails, one short call, no deal created), so the pattern is repeating.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Innovate Solutions is already in vendor-consolidation mode on the marketing side — extending that lens to the CRM is the obvious next move.",
      [
        "They already preach the alignment thesis externally — the pitch lands fast",
        "\"3 tools to 1\" framing is the philosophical alignment for CRM consolidation",
        "Salesforce + Marketing Cloud is the most expensive way to align marketing & sales",
        "New VP Strategy & Operations is the natural consolidation buyer",
        "One vendor, one data model doubles the value of the in-flight marketing consolidation",
      ],
      [
        {
          heading: "They already believe the thesis",
          body: `Their summit messaging on marketing-sales alignment is the pitch. Diana Khoury's "down from three to one" framing on internal vendors is the philosophical alignment. Bringing the same logic to the CRM is the closing move.`,
        },
        {
          heading: "The structural problem with Salesforce + Marketing Cloud",
          body: `Salesforce + Marketing Cloud is the most expensive way to align marketing and sales. HubSpot delivers it as one product. For a vendor whose entire external messaging is about alignment, having two products from one vendor stitched together with custom plumbing is a credibility risk worth raising.`,
        },
        {
          heading: "Migration angle",
          body: `Migrating off Salesforce while consolidating marketing tools doubles the value of the project: one vendor, one data model, one integration footprint to maintain. The new VP Strategy and Operations (Conrad Vela) is the natural buyer here — his charter is structurally aligned to consolidation projects.`,
        },
      ],
    ),
  },
  "4": {
    default: {
      summary:
        "DataStream is a Boston-based pipeline observability vendor pivoting from data engineering toolchain into the GTM analytics market.",
      summaryBullets: [
        "Pipeline-observability vendor pivoting into GTM analytics (\"Revenue Pulse\"); ~250 employees, ~$20M ARR",
        "Acquired Knot.io (Mar 2026) and went live on HubSpot Connect (Feb 2026)",
        "New CCO ex-Mode Analytics — \"turning data products into revenue products\"",
        "Mid-market velocity motion: ~30 new customers per quarter",
        "Heavy Salesforce + Marketo + Outreach stack; Knot integration likely still in flight",
      ],
      sections: [
        {
          heading: "The company",
          body: `DataStream Analytics is a privately held data analytics company founded in 2017, based in Cambridge, MA. Their original product was a pipeline observability platform for data engineering teams — monitoring ETL jobs, schema drift, and lineage. Over the last 18 months they've been expanding into GTM analytics, with a "Revenue Pulse" offering that pulls CRM, marketing automation, and product telemetry into one operational dashboard. CRM lists ~250 employees and $20M ARR.`,
        },
        {
          heading: "Recent triggers",
          body: `- Acquisition of Knot.io (March 2026): Knot was a 12-person Series A startup building "reverse ETL for sales teams." Press release described the deal as "a step toward the unified revenue operating system." Suggests DataStream is doubling down on the GTM angle.\n- New Chief Customer Officer, Steven Yates, joined April 2026 from Mode Analytics (Google). His LinkedIn intro post talked about "turning data products into revenue products," which is the pitch.\n- HubSpot Connect listing went live in February 2026. They built a native connector and are now visible in the App Marketplace. Worth checking what use cases they're advertising on the listing page.\n- 35-person AE team per a March 2026 LinkedIn post from their VP of Sales. Growth is happening in mid-market more than enterprise — "we're now bringing on 30 customers a quarter" was the quote.`,
        },
        {
          heading: "Tech stack",
          body: `Heavy Snowflake footprint (public partner case study, 2023), Looker for internal analytics, and Salesforce as the CRM — confirmed by job listings for a Salesforce Admin posted in February and again in May 2026. Marketing automation appears to be Marketo. They use Outreach for sequencing (job listings reference "Outreach experience preferred").`,
        },
        {
          heading: "Gaps",
          body: `- Knot.io acquisition is recent enough that integration is likely still in flight. Worth probing whether the joint product is GA or still a roadmap promise.\n- No public ARR growth metric since the Series B announcement in 2023. Their "we're past $20M" quote in a Forbes piece (January 2026) was the most recent number.\n- Heavy Salesforce + Marketo footprint. Consolidation play is plausible but disruptive given the recent acquisition.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "DataStream's GTM pivot exposes the kind of Salesforce + Marketo + Outreach sprawl that becomes a tax once the buyer profile shifts to mid-market velocity.",
      genericDisplacementBullets("DataStream Analytics"),
      genericDisplacementSections("DataStream Analytics"),
    ),
  },
  "5": {
    default: {
      summary:
        "CloudScale is a Kubernetes management platform that recently lost its CRO and is mid-pivot from infrastructure tooling to a developer-platform positioning.",
      summaryBullets: [
        "Kubernetes management platform repositioning as \"the developer platform for cloud infrastructure\"; ~300 employees, ~$40M ARR",
        "CRO departed March 2026 — seat still open, CEO interim for ~2 months",
        "~8% layoffs (Mar 2026) alongside a new FinOps product launched at KubeCon EU",
        "Salesforce + Pardot stack; customers flag rising prices on r/devops",
        "Turbulence window (CRO out, layoffs, repositioning) — verify funding runway (Series C $60M, 2023)",
      ],
      sections: [
        {
          heading: "Who they are",
          body: `CloudScale Systems is a 9-year-old cloud infrastructure software company headquartered in Seattle, WA. Their core product is a Kubernetes lifecycle management platform — provisioning, observability, and cost optimization across multi-cloud deployments. Roughly 300 employees, $40M ARR per a Q4 2025 board deck excerpt circulated on Twitter. Primary customers are mid-market and enterprise engineering orgs running 50+ K8s clusters.`,
        },
        {
          heading: "Recent triggers",
          body: `- CRO departure: Marcus Field left CloudScale in early March 2026 after 4 years. His exit was framed as "pursuing a CEO seat at another company" but no destination has been announced. The role is currently open; Pamela Wynne (CEO) is interim.\n- Rebrand soft-launched April 2026: they quietly updated the website tagline from "Kubernetes management" to "the developer platform for cloud infrastructure." Positioning shift worth knowing.\n- Quartz layoffs (~8% of company, March 2026): mostly customer success and field engineering roles. Glassdoor reviews in the aftermath are unusually negative for a venture-backed company.\n- New product launch: "CloudScale Insights" announced at KubeCon EU (April 4, 2026). Adds FinOps/cost analytics on top of the existing observability layer.`,
        },
        {
          heading: "Leadership",
          body: `Pamela Wynne (CEO, founder) is still leading the company. CTO is Akira Watanabe, who came from Datadog in 2020. Exec team is otherwise lean: VP Engineering, VP Marketing (Sarah Klein, joined September 2025), VP Product. No CRO since March. The interim CRO situation has now lasted nearly two months, which is long for a venture-backed company.`,
        },
        {
          heading: "Conflicts and gaps",
          body: `- The combination of "lost the CRO, doing layoffs, repositioning the product" is a real signal. Worth understanding whether the funding runway is solid (last raise was Series C, $60M, in 2023).\n- Their CRM is Salesforce — confirmed by multiple Salesforce-specific job listings and a 2024 Trailhead spotlight. Marketing automation is Pardot.\n- No public information on Net Revenue Retention. Anecdotally on r/devops, customers are reporting "CloudScale is great but the price keeps going up," which suggests pricing pressure.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "CloudScale is in the precise turbulence window — CRO out, layoffs, repositioning — where Salesforce TCO becomes the easiest line item to defend cutting.",
      genericDisplacementBullets("CloudScale Systems"),
      genericDisplacementSections("CloudScale Systems"),
    ),
  },
  "6": {
    default: {
      summary:
        "Tier-2 automotive parts manufacturer pivoting toward EV battery enclosures with a fresh wave of capex and a senior commercial hire from Magna.",
      summaryBullets: [
        "Tier-2 auto-parts manufacturer pivoting to EV battery enclosures; ~800 employees, ~$180M revenue",
        "$40M Toledo plant retool (Oct 2025) implies confirmed multi-year EV contracts + pressure to win more",
        "New VP Sales from Magna (Feb 2026) + a Director of Digital Transformation (Jan 2026)",
        "8 \"Account Manager – EV Programs\" roles; job spec lists HubSpot CRM experience as a plus",
        "Salesforce + custom portal + SAP = every motion is a custom integration; VP Marketing seat open",
      ],
      sections: [
        {
          heading: "The company",
          body: `NextGen Industries is a privately held industrial manufacturer headquartered in Toledo, OH. Founded 1987, they make precision-machined parts for the automotive supply chain — historically ICE drivetrain components, more recently EV battery enclosures and thermal management hardware. Roughly 800 employees across four plants (Toledo, Monterrey MX, and two facilities in Germany inherited via a 2022 acquisition). Revenue ~$180M per industry trade reporting.`,
        },
        {
          heading: "The forcing function",
          body: `NextGen booked a $40M capex investment in the Toledo plant in October 2025 to retool for EV battery enclosure production. The press release framed this as "critical to the transition from ICE to BEV platforms with our Detroit-3 customers." Worth knowing because:\n- The capex implies confirmed multi-year contracts (likely with Ford and GM)\n- It also implies pressure to land more EV-platform business to justify the spend\n- They've hired a Director of Digital Transformation (Megan Avila, January 2026) to drive the systems modernization that usually follows this kind of capex`,
        },
        {
          heading: "Strategic signals",
          body: `- 6 LinkedIn posts since January 2026 referencing "sustainability," "circular supply chain," and "aluminum extrusion partnerships" — a clear messaging arc around EV and ESG.\n- February 2026 hiring of a VP Sales (Greg Petros) from Magna International. Magna is the textbook Tier-1 automotive supplier; this is a senior commercial hire indicating ambition.\n- Indeed listings (March-May 2026) for 8 "Account Manager - Electric Vehicle Programs" roles. The job spec explicitly mentions HubSpot CRM experience as a "plus," which is interesting.`,
        },
        {
          heading: "Tech stack",
          body: `Mixed-legacy: SAP S/4HANA for ERP, Salesforce for CRM (job listings confirm), no clear marketing automation. They run a custom-built customer portal for the manufacturers' rep network. Indeed listings for 2 "CRM Administrator (Salesforce)" roles since February 2026 suggest the Salesforce instance is currently being expanded or rationalized.`,
        },
        {
          heading: "Gaps",
          body: `- Salesforce + custom portal + SAP is the classic "every motion is a custom integration" setup. Likely opportunity for a unified CRM play, especially around the new EV programs.\n- No public marketing automation stack visible, but VP Marketing role open since February. Whoever lands that seat will be in the buying window.\n- Industry trade reporting on revenue is from 2024; actual current run rate is uncertain.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "NextGen's EV pivot is the kind of inflection point where an aging Salesforce + custom-portal + SAP setup becomes the bottleneck on the commercial motion.",
      genericDisplacementBullets("NextGen Industries"),
      genericDisplacementSections("NextGen Industries"),
    ),
  },
  "7": {
    default: {
      summary:
        "Mid-market professional services firm in a multi-year PE-backed roll-up, mid-integration of four acquired entities into a single GTM motion.",
      summaryBullets: [
        "PE-backed (Vista) professional-services roll-up; ~600 employees, ~$120M revenue",
        "Likely exit window 2026–2027 — forces operational consolidation",
        "\"Two CRMs, two billing systems\" post-acquisition pain (Crestview integration in flight)",
        "New CIO (Jan 2026) chartered to unify the stack across 5 legal entities",
        "Q1 push on \"AI-enabled consulting\"; no CMO (marketing rolls up to the CRO)",
      ],
      sections: [
        {
          heading: "Who they are",
          body: `Horizon Enterprises is a privately held professional services firm headquartered in Chicago, IL. Founded 2008 as a boutique IT consultancy, they've spent the last six years on a PE-backed roll-up strategy, acquiring four regional consulting firms (last acquisition: Crestview Consulting, August 2025). Total headcount ~600 across the merged entity, revenue ~$120M per their 2025 "State of the Business" release.`,
        },
        {
          heading: "Recent triggers",
          body: `- PE recap: Vista Equity Partners-backed since 2021. Their hold period typically peaks around year 5-6, so 2026-2027 is the likely exit window. That tends to force operational consolidation.\n- Crestview Consulting integration is still in flight. Glassdoor reviews from former Crestview employees in early 2026 flag "two CRMs, two billing systems, two PM tools" as a top frustration.\n- New CIO hire (Wendy Liang, January 2026), explicitly chartered with "unifying the technology stack across all five legal entities." Her LinkedIn announcement post got 600+ reactions, mostly from PE-backed CIOs facing the same problem.\n- Q1 marketing push around "AI-enabled consulting": dedicated landing page, 3 webinars, and the launch of an internal "AI Center of Excellence" staffed by ~20 people.`,
        },
        {
          heading: "Leadership",
          body: `CEO Howard Renfrew is the original founder, still actively running the company. COO Joanne Mast came in 2022 from Accenture. CFO Patrick Yarrow joined post-recap in 2021. CIO Wendy Liang is the newest exec hire (January 2026). No CMO; marketing rolls up to the CRO, Trent Sykes, who came in with the FinForge acquisition in 2023.`,
        },
        {
          heading: "What's missing",
          body: `- "Two CRMs, two billing systems" reality means consolidation projects are real and active. Multiple Salesforce job listings (4 since January) suggest Salesforce is the consolidating CRM, but the stack picture is far from clean.\n- No public information on what specifically Wendy Liang is buying first. Worth asking directly.\n- Revenue mix between the 4 acquired entities is opaque. The combined GTM motion is in early-stage standardization.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Horizon's roll-up is exactly the post-acquisition reality where Salesforce becomes the consolidating CRM by default, then becomes the bottleneck within 18 months.",
      genericDisplacementBullets("Horizon Enterprises"),
      genericDisplacementSections("Horizon Enterprises"),
    ),
  },
  "8": {
    default: {
      summary:
        "Embedded systems software vendor for the medical-device sector with a fresh FDA submission triggering a sales motion shift from supplier to co-named manufacturer.",
      summaryBullets: [
        "Embedded software for medical-device OEMs; ~150 employees, ~$25M ARR; top-3 customers >60% of revenue",
        "First FDA 510(k) as named manufacturer (Mar 2026) — shift from supplier to co-named manufacturer",
        "New CRO (Apr 2026) hired to \"build the first true commercial function at Pioneer\"",
        "5 net-new Customer Success Engineer roles — no CS function existed before",
        "Buying a sales/CRM stack from scratch is now imminent; Salesforce footprint is limited today",
      ],
      sections: [
        {
          heading: "The basics",
          body: `Pioneer Tech Group is a privately held embedded software company headquartered in Cambridge, MA. They build firmware and middleware for medical device OEMs — primarily infusion pumps, patient monitoring, and surgical robotics. Roughly 150 employees, $25M ARR estimated from public PE filings. Customer concentration is real: their top 3 customers (Medtronic, Becton Dickinson, and a private rumored to be Edwards Lifesciences) account for an estimated 60%+ of revenue.`,
        },
        {
          heading: "Recent signals",
          body: `- FDA 510(k) submission, March 2026: their first FDA submission as the named manufacturer on a co-developed device with a Tier-1 OEM (filing public on FDA.gov). This is a category shift — they're going from supplier to co-named manufacturer, which fundamentally changes how their commercial team operates.\n- New CRO (Bradley Wilkes, April 2026) from Mathworks. His LinkedIn announcement explicitly mentioned "building the first true commercial function at Pioneer."\n- LinkedIn posts since February 2026 emphasize "AI in regulated environments" — they're positioning around the FDA's recent draft guidance on AI/ML in medical devices.\n- Indeed listings (April-May 2026) for 5 new "Customer Success Engineer" roles. Pioneer historically has not had a CS function — sales handoffs went directly to engineering.`,
        },
        {
          heading: "Big strategic signal",
          body: `The shift from "supplier" to "co-named manufacturer" is a multi-year strategic pivot. It changes:\n- Regulatory liability profile (much higher exposure)\n- Sales motion (longer cycles, higher-value contracts, different buyer)\n- Revenue model (more recurring, less project-based)\n- Required GTM infrastructure (CRM, CS, customer health — none of which exist today)\n\nThis is exactly the moment when companies of this size start buying a sales/CRM stack from scratch.`,
        },
        {
          heading: "Tech stack",
          body: `Public stack hints are sparse. They use Atlassian (Jira, Confluence — confirmed via job listings), GitHub Enterprise, and Salesforce for the limited CRM they currently have (3 Salesforce admins per LinkedIn). No marketing automation visible. Marketing is a 2-person team led by a Director who reports to the CEO.`,
        },
        {
          heading: "Gaps",
          body: `- Customer concentration is extreme. Worth knowing whether the FDA submission gives them a path to diversify or doubles down on the Tier-1 OEM dependency.\n- The "no real commercial function" framing from the new CRO is unusually candid for a public LinkedIn post. The buying window for a unified CRM is genuinely now.\n- No public ARR growth since 2023. PE filings show $25M but that's a 2023 number.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Pioneer's shift from supplier to co-named manufacturer means the existing Salesforce instance — built for a project-based, 3-customer reality — is about to be the wrong shape entirely.",
      genericDisplacementBullets("Pioneer Tech Group"),
      genericDisplacementSections("Pioneer Tech Group"),
    ),
  },
  "9": {
    default: {
      summary:
        "Mid-market DTC commerce platform pivoting toward B2B wholesale with the launch of their 'Velocity B2B' product and a new VP from Mirakl.",
      summaryBullets: [
        "Mid-market DTC commerce platform pivoting into B2B wholesale (\"Velocity B2B\", Mar 2026); ~400 employees, ~$60M ARR",
        "New VP B2B Sales (ex-Mirakl) building the B2B function from scratch — SDR/sequencing decision imminent",
        "18% price increase (May 2026) drawing customer grumbling — churn risk and a competitive opening",
        "Rumored flat/down $80M Series D (unconfirmed)",
        "Salesforce + Marketo + Gainsight stack built for the old DTC motion",
      ],
      sections: [
        {
          heading: "Background",
          body: `Velocity Commerce is an e-commerce SaaS platform headquartered in Portland, OR. Founded 2014, they serve roughly 4,500 mid-market DTC brands — apparel, beauty, and food and beverage are their three biggest verticals. ~400 employees, ARR estimated at $60M based on a Backshop industry report (Q4 2025). Their core platform competes with Shopify Plus and BigCommerce in the upper SMB / lower mid-market band.`,
        },
        {
          heading: "Recent triggers",
          body: `- Velocity B2B launch (March 11, 2026): their first product targeted at the wholesale/B2B segment. Standalone module with separate pricing — first time they've sold something other than the core DTC platform.\n- VP B2B Sales hire: Antonella Russo, ex-Mirakl, joined April 2026 to build the new B2B revenue function from scratch.\n- Pricing change: increased their "Velocity Plus" tier by 18% effective May 1, 2026. Reddit r/ecommerce has multiple threads of customers grumbling. Worth knowing as a competitive opening.\n- Series D talks: TechCrunch reported (April 2026) that Velocity is in talks for an $80M Series D at a flat-to-down round. Not confirmed.`,
        },
        {
          heading: "Stack notes and gaps",
          body: `- They use Salesforce for CRM, Marketo for marketing automation, and Gainsight for CS — confirmed by multiple job listings.\n- The B2B pivot will require a different commercial motion. Antonella Russo's brief explicitly mentions "building the SDR function for B2B from scratch" — which means a sequencing / sales engagement decision is imminent.\n- Customer concentration shifted noticeably in 2025 toward the top 100 accounts. Combined with the pricing change, this is a churn risk worth knowing about.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Velocity's B2B pivot lands on top of a Salesforce + Marketo + Gainsight stack built for a different motion entirely.",
      genericDisplacementBullets("Velocity Commerce"),
      genericDisplacementSections("Velocity Commerce"),
    ),
  },
  "10": {
    default: {
      summary:
        "Mid-market wealth advisory firm in the middle of a multi-year tech modernization following a 2024 PE recap, led by a new CIO from Edward Jones.",
      summaryBullets: [
        "Wealth advisory firm, ~$15B AUM, ~350 employees; PE-recapped (Lightyear, 2024)",
        "New CIO (ex-Edward Jones) mandate: replace 11 systems with a unified client platform",
        "Digital onboarding experience launching late summer 2026 (vendor unnamed)",
        "CEO has publicly bought into \"operate like a SaaS company\"",
        "Decentralized sales (9 regional MDs run their own books) — coordination gap; no CRO/CMO",
      ],
      sections: [
        {
          heading: "Who they are",
          body: `Summit Financial is a privately held wealth advisory firm headquartered in Charlotte, NC. Founded 1998, they provide financial planning, asset management, and tax advisory services to ~12,000 high-net-worth households across 9 offices in the southeast US. AUM ~$15B per their 2024 ADV filing. ~350 employees. Recapped by Lightyear Capital in March 2024.`,
        },
        {
          heading: "Recent triggers",
          body: `- New CIO (Madeline Kettler) joined September 2025 from Edward Jones. Her LinkedIn post on day 90 talked about "replacing 11 different systems with a unified client experience platform" — that's the consolidation thesis.\n- They published a Q1 2026 client letter mentioning "a new digital onboarding experience launching in late summer 2026." The vendor isn't named.\n- Wealthstack (industry trade conference) keynote by their CEO, March 2026: "The next decade of wealth management belongs to firms that operate like SaaS companies." Strong indicator of cultural buy-in for tech transformation.\n- 3 Director-level hires since January 2026 with titles like "Director of Client Experience" and "Director of Digital Operations" — the kind of org changes that precede a stack overhaul.`,
        },
        {
          heading: "Leadership and gaps",
          body: `CEO Carter Vance has been in seat since 2015. President Yolanda Ortiz came in via the Lightyear recap. CIO Madeline Kettler is the newest exec. No CMO; marketing is 6 people under a Director of Brand. No CRO — sales is owned by 9 regional Managing Directors who each run their book independently. That decentralization is a real gap if the buying motion needs to be coordinated.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Summit's CIO mandate is to replace 11 systems — Salesforce Financial Services Cloud is statistically one of them, and the consolidation thesis is the closing argument.",
      genericDisplacementBullets("Summit Financial"),
      genericDisplacementSections("Summit Financial"),
    ),
  },
  "11": {
    default: {
      summary:
        "Publisher pivoting from ad-supported content to subscription + B2B intelligence — 'BrightPath Pro' launched in February.",
      summaryBullets: [
        "Business-content publisher pivoting from ads to subscription + B2B intelligence; ~180 employees, ~$45M revenue",
        "\"BrightPath Pro\" launched Feb 2026, ~1,200 subscribers in the first 60 days",
        "New CRO (ex-Industry Dive) hired for the subscription pivot",
        "Reallocated ad-sales headcount into subscription AEs (Mar 2026)",
        "Mixed Salesforce + HubSpot Marketing estate; ad revenue still ~60% (the risk)",
      ],
      sections: [
        {
          heading: "The company",
          body: `BrightPath Media is a digital media company headquartered in Brooklyn, NY. Founded 2011, they publish business-focused content across four brand verticals: B2B SaaS, fintech, climate, and creator economy. Roughly 9M monthly unique visitors per SimilarWeb. ~180 employees. Revenue ~$45M with traditional advertising still ~60% of mix; the strategic priority is shifting toward subscription and a new B2B intelligence product.`,
        },
        {
          heading: "Recent signals",
          body: `- BrightPath Pro launched February 9, 2026: subscription product at $1,800/year, positioned as "data + reporting + community" for B2B SaaS operators. Roughly 1,200 subscribers in the first 60 days based on a CEO LinkedIn post.\n- New Chief Revenue Officer (Edna Powers) hired January 2026 from Industry Dive. Her hire was explicitly tied to the subscription/B2B intelligence pivot.\n- Workforce announcement: cut ad sales team from 24 to 16 in March 2026, simultaneously hiring 7 "Subscription Account Executives" — a clear capital reallocation.\n- Editorial reshuffle: two senior editors departed in Q1 2026. Several Twitter rumors about "editorial direction disagreements," nothing confirmed.`,
        },
        {
          heading: "Stack and gaps",
          body: `- They use HubSpot Marketing Hub (confirmed via their site's tracking pixels) and Stripe for subscriptions. CRM is unclear — there are Salesforce admin listings but also several HubSpot Pro job mentions. Likely a mixed environment.\n- The subscription motion is new. Subscription analytics, churn modeling, and customer success are likely being built right now.\n- Ad revenue dependence at 60% is the real risk. Worth understanding whether Edna Powers has a clear timeline to flip the ratio.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "BrightPath's subscription pivot is a textbook moment for collapsing a mixed Salesforce + HubSpot estate onto one stack.",
      genericDisplacementBullets("BrightPath Media"),
      genericDisplacementSections("BrightPath Media"),
    ),
  },
  "12": {
    default: {
      summary:
        "Scientific software vendor for quantum computing simulations, partnering with IBM and pivoting from research labs into enterprise R&D departments.",
      summaryBullets: [
        "Quantum-computing simulation software; ~80 employees, ~$12M ARR; Cambridge UK + Boston",
        "IBM Quantum co-development partnership (Jan 2026) shifts the buyer from labs to enterprise R&D",
        "Public commitment to double the commercial team in 2026",
        "New VP Sales (ex-Mathworks) building the function from a near-zero base",
        "IBM is a Salesforce shop — partner-led motion needs a CRM integration story; no marketing automation",
      ],
      sections: [
        {
          heading: "Who they are",
          body: `Quantum Dynamics is a 7-year-old scientific software company based in Cambridge, UK with a US office in Boston, MA. They build simulation software for quantum computing R&D — used by hardware vendors developing qubit systems and by enterprise R&D teams modeling potential quantum advantage in chemistry, materials, and finance. ~80 employees, ARR estimated at $12M from a Pitchbook entry.`,
        },
        {
          heading: "The forcing function",
          body: `In January 2026 they announced a "co-development partnership" with IBM Quantum, positioning Quantum Dynamics as a preferred software partner for IBM's enterprise quantum customers. This dramatically changes their go-to-market:\n- Their previous buyer was academic research labs and quantum hardware startups. Long sales cycles, modest ACV.\n- The new buyer is enterprise R&D teams at pharma, materials, and finance companies — bigger ACV, more complex stakeholder management, much higher coverage requirements.\n- They publicly committed to "doubling our commercial team in 2026" on the partnership announcement post.`,
        },
        {
          heading: "Big strategic signal and gaps",
          body: `- IBM partnership creates immediate pull from IBM's enterprise quantum sales reps. That's a partner-led motion that requires a CRM integration story — IBM's CRM is Salesforce; Quantum Dynamics' CRM is currently unconfirmed.\n- Founder/CEO Dr. Helena Vandermark (Cambridge PhD) is still CEO. New VP Sales (Robert Cline, ex-Mathworks, joined March 2026) is building the commercial function from a near-zero base.\n- No marketing automation stack visible. Marketing is a 4-person team focused on technical content and conference presence.\n- Gap: no public revenue retention or expansion data. Their account base is small enough that one or two losses could be material.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Quantum Dynamics is building its commercial function from near zero — the cleanest possible moment to set the foundation with HubSpot rather than inheriting a Salesforce instance.",
      genericDisplacementBullets("Quantum Dynamics"),
      genericDisplacementSections("Quantum Dynamics"),
    ),
  },
  "13": {
    default: {
      summary:
        "Identity & access management vendor mid-rebrand as 'Fusion Identity' with a fresh enterprise push following the addition of a CRO from Auth0.",
      summaryBullets: [
        "IAM vendor rebranding to \"Fusion Identity\"; ~250 employees, ~$35M ARR",
        "New CRO (ex-Auth0, Feb 2026) is the catalyst for the rebrand + enterprise push",
        "Acquired Lighthouse Auth (Apr 2026) for identity orchestration",
        "14 roles cut (Mar 2026) — \"restructuring around the new GTM motion\"",
        "Salesforce + Marketo + Outreach stack; CRO's Auth0 background likely doubles down on it",
      ],
      sections: [
        {
          heading: "Background",
          body: `Fusion Technologies is a 10-year-old identity and access management software company based in Austin, TX. ~250 employees, $35M ARR (per a 2024 Forbes piece). Primary product is a workforce IAM platform competing with Okta and Microsoft Entra in the mid-market. Recent strategic emphasis on customer identity (CIAM) for B2B SaaS companies — that's where the growth is.`,
        },
        {
          heading: "Recent triggers",
          body: `- Rebrand to "Fusion Identity" announced March 21, 2026. New website, new logo, repositioned messaging from "IAM platform" to "identity infrastructure for software companies."\n- CRO Holly Patterson hired in February 2026 from Auth0 (post-Okta). Her arrival is the explicit catalyst for the rebrand and enterprise push.\n- Acquired Lighthouse Auth (a 5-person Series A startup) in April 2026 for an undisclosed amount. Lighthouse was building "identity orchestration" — likely a tuck-in for engineering.\n- Layoffs: 14 roles cut in March 2026, mostly in customer support and SDR. The narrative was "restructuring around the new GTM motion." Glassdoor reviews are mixed but not negative.`,
        },
        {
          heading: "Tech stack and gaps",
          body: `- Internal stack: Salesforce CRM, Outreach for sequencing, Marketo for marketing automation (confirmed via job listings).\n- CRO is from Auth0 — that org was heavy on Salesforce + Outreach. Pattern matching, Fusion will likely double down on the current stack rather than replace it.\n- No CMO. Marketing currently led by a VP Marketing (Tessa Rao, in seat 18 months).\n- Customer concentration is unclear but their case studies skew heavily toward the 200-1000 employee band — meaningful but not enterprise.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Fusion's rebrand-plus-CRO combo is the inflection where the existing Salesforce + Marketo + Outreach footprint either gets doubled down on or rebuilt — the window is open.",
      genericDisplacementBullets("Fusion Technologies"),
      genericDisplacementSections("Fusion Technologies"),
    ),
  },
  "14": {
    default: {
      summary:
        "Early-stage VC firm with a new Operating Partner program targeting portfolio company GTM — actively standardizing the recommended stack across portfolio.",
      summaryBullets: [
        "VC firm, ~$2.1B AUM; Atlas IV ($850M, 2024) deploying actively",
        "Launched an Operating Partner program (Jan 2026) to standardize portfolio GTM tooling",
        "GTM Operating Partner publicly recommends HubSpot / Outreach / Gong / Salesforce as the \"standard stack\"",
        "Winning the recommended-stack slot = access to 60+ portfolio companies",
        "Internal CRM is HubSpot — alignment signal; GTM OP (ex-CRO) is the right entry point",
      ],
      sections: [
        {
          heading: "The basics",
          body: `Atlas Ventures is a venture capital firm based in San Francisco, CA. AUM ~$2.1B across 4 active funds. They invest at Seed through Series B in B2B SaaS, AI infrastructure, and developer tools. ~45 employees including 14 investment professionals. Their current fund (Atlas IV) closed at $850M in early 2024 and is deploying actively.`,
        },
        {
          heading: "Recent signals",
          body: `- Operating Partner program launched January 2026. They hired 3 OPs — one for GTM, one for product, one for finance. Their explicit goal is to "reduce the time portfolio companies spend on tool selection and process design." Strong signal that they're standardizing portfolio-wide GTM tooling.\n- LinkedIn posts since February 2026 from their GTM Operating Partner (Carla Mendes) explicitly mention HubSpot, Outreach, Gong, and Salesforce as the "standard stack we're recommending to portfolio companies."\n- Hiring: 2 "Portfolio Success Manager" roles in March 2026 — these roles are essentially internal sales reps who work with portfolio CEOs to drive adoption of standardized tools.\n- They co-sponsored a March 2026 conference focused on "Modern GTM for Founders," which is the explicit thesis.`,
        },
        {
          heading: "Portfolio context and gaps",
          body: `- The opportunity here is unusual: Atlas is essentially a portfolio-wide standardization buyer. Winning the recommended-stack slot at Atlas could mean access to 60+ portfolio companies over the next 24 months.\n- Their internal CRM is HubSpot (confirmed via job listing for "HubSpot Administrator" posted April 2026). That's an alignment signal.\n- Carla Mendes (GTM Operating Partner) is the right person — she came from a CRO background at a HubSpot customer.\n- Gap: no public information on which portfolio companies have actually adopted the recommended stack yet. The program is new enough that case studies aren't surfacing.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Atlas Ventures is publicly recommending HubSpot alongside Salesforce in their portfolio stack — there's an opportunity to push that to HubSpot-as-the-recommended-default rather than co-recommendation.",
      [
        "Atlas already recommends HubSpot in the portfolio \"standard stack\" — push it to the default",
        "They co-recommend Salesforce too; the opening is to win the single-CRM slot",
        "Recommended-default status = influence over 60+ portfolio CRM decisions",
        "Internal CRM is already HubSpot — they live the product daily",
        "GTM Operating Partner (ex-CRO) owns the standardization decision",
      ],
      [
        {
          heading: "From co-recommendation to default",
          body: `Atlas already lists HubSpot in its recommended GTM stack — but alongside Salesforce. The strategic move is to win the single-CRM-default slot, which converts a co-recommendation into a portfolio-wide standard.`,
        },
        {
          heading: "Why the leverage is unusual",
          body: `Recommended-default status at Atlas influences 60+ portfolio CRM decisions over the next 24 months. The firm runs HubSpot internally, so the product credibility is already there — this is about the recommendation framework, not a head-to-head bake-off.`,
        },
      ],
    ),
  },
  "15": {
    default: {
      summary:
        "Industrial machinery manufacturer modernizing aftermarket services with a new digital services platform and a first-ever Chief Digital Officer.",
      summaryBullets: [
        "Industrial packaging-machinery maker; ~1,100 employees, ~$250M revenue",
        "\"Zenith Connect\" IoT subscription services launched Feb 2026 — new recurring-revenue line",
        "First-ever Chief Digital Officer (ex-Honeywell, Jan 2026)",
        "4 net-new \"Digital Services AE\" roles + a Rockwell Automation GTM partnership",
        "SAP + Salesforce; the new services motion sits awkwardly in an equipment-sales CRM",
      ],
      sections: [
        {
          heading: "The company",
          body: `Zenith Manufacturing is a privately held industrial machinery manufacturer headquartered in Milwaukee, WI. Founded 1962, they design and manufacture packaging machinery for food, beverage, and pharma. ~1,100 employees across two US plants and a service network of ~80 field technicians in North America. Estimated revenue $250M per industry trade reporting.`,
        },
        {
          heading: "Strategic signals",
          body: `- "Zenith Connect" digital services platform launched February 2026: IoT-enabled equipment monitoring with subscription-based proactive maintenance. New revenue stream for a historically equipment-sale-heavy business.\n- New Chief Digital Officer (Hugo Cassels) joined January 2026 from Honeywell. The CDO role is a first for Zenith — clear signal of a digital transformation push.\n- 4 "Digital Services Account Executive" job listings since February. These are net-new roles, not backfills. The aftermarket services motion needs a sales function it didn't previously have.\n- April 2026 partnership with Rockwell Automation: joint go-to-market on factory-floor connectivity. Suggests Zenith is positioning itself as an ecosystem player, not just a machinery vendor.`,
        },
        {
          heading: "Tech stack notes",
          body: `- ERP is SAP S/4HANA (modernized in 2022 — 18-month project). CRM is Salesforce (confirmed by 7 active Salesforce-related job listings).\n- They use a custom-built field service management tool for their service technicians. The CDO is reportedly evaluating ServiceNow as a replacement.\n- No marketing automation visible. Marketing is a 12-person team with a strong trade-show focus.\n- Gap: the "Digital Services" sales motion is new enough that processes are still being defined. The first six months will be foundational.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Zenith's new digital-services motion sits awkwardly inside an old Salesforce instance that was built for capital-equipment selling, not subscription services.",
      genericDisplacementBullets("Zenith Manufacturing"),
      genericDisplacementSections("Zenith Manufacturing"),
    ),
  },
  "16": {
    default: {
      summary:
        "Mid-market healthcare services company expanding into ambulatory care with a new sales function for outpatient B2B partnerships.",
      summaryBullets: [
        "Ambulatory care provider (18 surgery centers, 22 diagnostic sites); ~3,200 employees, ~$420M revenue; PE-owned (TPG)",
        "Acquired CenterMD (Mar 2026) — continuing ambulatory expansion",
        "New B2B Partnerships function (Feb 2026) targeting employers, payors, and primary care",
        "9 net-new \"Network Development Manager\" sales roles — major shift for a clinical org",
        "Epic for clinical; Workday + Salesforce referenced; B2B function building commercial infra from zero",
      ],
      sections: [
        {
          heading: "Who they are",
          body: `Meridian Health is a privately held healthcare services company headquartered in Nashville, TN. Founded 1996, they operate 18 ambulatory surgery centers and 22 outpatient diagnostic facilities across 6 southeastern states. ~3,200 employees. Revenue ~$420M per a 2024 industry directory. Private equity owners are TPG (took majority stake in 2022).`,
        },
        {
          heading: "Recent triggers",
          body: `- Acquisition of CenterMD (March 2026): CenterMD was a 6-clinic primary care group in Tennessee. Adds 380 employees and ~$45M revenue. Press release framed this as "continuing our ambulatory expansion."\n- New B2B Partnerships function announced February 2026, headed by Sasha Kingsley (joined from Wellbe). The role is explicitly chartered with "building referral relationships with self-insured employers, payors, and primary care groups."\n- Their CFO (Daniel Hooper) was quoted at a healthcare investment conference in April 2026 talking about "platform efficiencies" and "unified patient journey" — language that usually precedes a tech consolidation.\n- Hiring: 9 "Network Development Manager" roles posted since February 2026. These are sales roles, not clinical. Major shift for an organization historically run as a clinical operation.`,
        },
        {
          heading: "Regulatory and gaps",
          body: `- CMS rule changes effective January 2026 around ambulatory surgery center reimbursement created tailwinds for Meridian's core business. Worth knowing as context for the expansion push.\n- Stack is murky: they use Epic for clinical EMR (confirmed). For business systems they reference "Workday and Salesforce" in 2 job listings. Marketing automation isn't surfaced.\n- Gap: the new B2B Partnerships function is building from zero. No prior commercial infrastructure. Everything from CRM to sequencing is likely a 2026 buying decision.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Meridian's B2B Partnerships function is being built from zero on top of a Salesforce footprint that exists more on paper than in practice.",
      genericDisplacementBullets("Meridian Health"),
      genericDisplacementSections("Meridian Health"),
    ),
  },
  "17": {
    default: {
      summary:
        "Boutique management consulting firm building a tech-enabled advisory practice — moving from billable hours to recurring software-plus-services.",
      summaryBullets: [
        "Boutique management consultancy; ~330 people, ~$95M revenue",
        "\"Apex Now\" subscription advisory launched Mar 2026 — first non-hourly product",
        "First-ever Chief Product Officer (Feb 2026) hired to \"productize the IP\"",
        "3 net-new CSM roles — a SaaS-like operating model is emerging",
        "Salesforce + Pardot + Smartsheet today; needs recurring-revenue/CS infrastructure it lacks",
      ],
      sections: [
        {
          heading: "Background",
          body: `Apex Consulting is a privately held management consulting firm headquartered in New York, NY. Founded 2003, ~280 consultants and ~50 support staff. Practice areas: digital strategy, GTM transformation, and operations optimization for mid-market companies. Revenue estimated at $95M per a 2024 trade publication.`,
        },
        {
          heading: "Recent signals",
          body: `- "Apex Now" subscription advisory practice launched March 2026: monthly retainer that bundles a senior advisor + a software platform for ongoing strategy tracking. First non-hourly product in their history.\n- Hired their first Chief Product Officer (Lana Diaz) in February 2026. The CPO title is unusual for a consulting firm and was framed in the announcement as "productizing our IP."\n- 3 "Customer Success Manager" postings since March 2026 — also a first for a billable-hours consulting firm. Strong signal of a SaaS-like operational model emerging.\n- Their CEO (Reginald Voss) wrote a LinkedIn long-form post in April 2026 titled "Why consulting needs to look more like SaaS." 5,000+ reactions, ~200 comments.`,
        },
        {
          heading: "Leadership and gaps",
          body: `- CEO Reginald Voss, CPO Lana Diaz (new), and CRO Tina Frey (in seat 3 years) are the inner circle. No CMO; marketing is led by a Director who reports to Tina.\n- They use Salesforce + Pardot + Smartsheet today (confirmed by job listings). CSM tool is unconfirmed.\n- The subscription advisory practice will need true customer success / recurring revenue management infrastructure that the consulting business doesn't have today.\n- Gap: how much of the firm's revenue base will eventually be subscription vs. hourly is not publicly committed to. Big strategic question.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Apex's pivot from billable-hours to subscription requires CRM, CS, and recurring-revenue infrastructure their Salesforce + Pardot stack was never built for.",
      genericDisplacementBullets("Apex Consulting"),
      genericDisplacementSections("Apex Consulting"),
    ),
  },
  "18": {
    default: {
      summary:
        "Asset-light freight brokerage in the midst of a digital transformation following two consecutive down years — already migrated off Salesforce onto HubSpot.",
      summaryBullets: [
        "Asset-light freight brokerage; ~80 employees, ~$140M revenue; two soft years (2024–25)",
        "New COO (ex-C.H. Robinson, Jan 2026) mandate: modernize carrier + customer experience",
        "\"Sterling Direct\" shipper self-serve portal launched Apr 2026",
        "Already migrated off Salesforce to HubSpot (late 2024) — expansion, not migration",
        "3-person marketing team has no automation platform; carrier-side motion needs new infra",
      ],
      sections: [
        {
          heading: "The basics",
          body: `Sterling Logistics is a freight brokerage and supply chain services company headquartered in Atlanta, GA. Founded 2005, asset-light model with ~80 employees and a network of 12,000 carriers. Annual revenue ~$140M per industry trade reporting, though that's a 2024 number — both 2024 and 2025 were softer for them per LinkedIn commentary from leadership.`,
        },
        {
          heading: "Recent triggers",
          body: `- New COO (Frank Beckmann) joined January 2026 from C.H. Robinson. His public mandate is "modernizing the carrier and customer experience" — a digital transformation.\n- "Sterling Direct" shipper portal launched April 2026: lets enterprise shippers self-serve quoting and tracking. The CTO publicly mentioned "no longer competing on email response time, competing on data."\n- 6 hires since January 2026 with "digital" or "platform" in the title. Most are technical, two are commercial (a "Director of Digital Customer Experience" and a "Director of Carrier Tech Adoption").\n- Aaron Graft (Triumph Financial CEO) and Frank Beckmann engaged in a LinkedIn back-and-forth in March 2026 about freight tech consolidation. Worth reading — good signal on Sterling's strategic worldview.`,
        },
        {
          heading: "Tech stack and gaps",
          body: `- TMS is McLeod (longstanding). CRM is HubSpot (confirmed by 3 active HubSpot admin job listings since January 2026) — they migrated from Salesforce in late 2024. Alignment signal.\n- Marketing is a 3-person team with no clear automation platform.\n- No public information on profitability. Two soft years and a new COO is a real combination of pressures.\n- The carrier-side digital push will need different commercial infrastructure than the shipper-side.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Sterling already left Salesforce in 2024 — the displacement angle here is expansion within HubSpot, not migration.",
      [
        "Already migrated off Salesforce to HubSpot (late 2024) — conversation is expansion, not migration",
        "Service Hub fits the new carrier-success motion the Director of Carrier Tech Adoption now owns",
        "Marketing Hub for the 3-person team with no automation today",
        "AI add-ons pair with the CTO's \"competing on data\" narrative",
      ],
      [
        {
          heading: "They've already done the hard part",
          body: `Sterling migrated off Salesforce in late 2024 and now runs on HubSpot. The strategic conversation is no longer about migration — it's about deepening the footprint into the new commercial motions (shipper-side digital portal, carrier-side tech adoption).`,
        },
        {
          heading: "Where to expand",
          body: `- Service Hub for the carrier success motion their Director of Carrier Tech Adoption is now responsible for\n- Marketing Hub for the 3-person marketing team that has no automation platform today\n- AI add-ons that pair with the "competing on data" narrative the CTO is publicly running`,
        },
      ],
    ),
  },
  "19": {
    default: {
      summary:
        "Mid-market ERP vendor finishing a 4-year cloud migration, with a refreshed enterprise sales function and a new partner channel.",
      summaryBullets: [
        "Mid-market ERP vendor; ~700 employees, ~$130M revenue",
        "4-year cloud migration finished Mar 2026 (now ~85% cloud) — motion shifts to mid-market upsell at scale",
        "New VP Partner Sales (ex-Sage) investing to triple the implementation-partner channel",
        "CFO floated \"$200M ARR by end of 2027\" — aggressive vs. current run rate",
        "Mixed stack: Salesforce CRM + HubSpot Marketing — favorable migration math",
      ],
      sections: [
        {
          heading: "Who they are",
          body: `Pinnacle Solutions is an enterprise resource planning (ERP) software vendor headquartered in Denver, CO. Founded 2002, ~700 employees. Revenue ~$130M per their last public statement (Forbes piece, 2024). Their core product is a mid-market ERP competing with NetSuite and Sage Intacct, with vertical packages for manufacturing, distribution, and professional services.`,
        },
        {
          heading: "Recent signals",
          body: `- Cloud migration project (codename: "Atlas") finished its 4-year arc in March 2026. ~85% of their customer base is now on the cloud platform, up from 30% in 2022. The remaining on-prem base is a high-touch upgrade motion.\n- New VP of Partner Sales (Avery Templeton, joined February 2026) from Sage. Pinnacle's partner channel was historically thin — fewer than 40 implementation partners. They're investing to triple that.\n- Q1 2026 customer event (Pinnacle Connect) drew 2,400 attendees, 40% more than 2025. The keynote was unusually feature-light and partnership-heavy.\n- Their CFO publicly mentioned "a path to $200M ARR by end of 2027" on a CFO Roundtable podcast (March 2026). Aggressive given the current run rate.`,
        },
        {
          heading: "Strategic context and gaps",
          body: `- The cloud migration finishing changes the sales motion fundamentally — from "high-touch enterprise renewal" to "mid-market upsell at scale." Different skill set, different tooling.\n- Internal stack is interesting: their own ERP for finance (eating their own dog food), Salesforce for CRM (confirmed), HubSpot for marketing (confirmed by "HubSpot Marketing Manager" role posted in April 2026). Mixed environment.\n- Gap: the $200M ARR commitment is aggressive enough that it implies either a meaningful pricing change, a major net-new account push, or both. Worth knowing which lever they're pulling.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Pinnacle's existing HubSpot Marketing + Salesforce CRM split is the kind of mixed environment where the migration math is uniquely favorable.",
      [
        "Already runs HubSpot Marketing alongside Salesforce CRM — half the stack is HubSpot",
        "Consolidating to one platform removes the Marketing↔CRM sync layer entirely",
        "Cloud migration just finished — appetite for the next modernization is high",
        "Motion is shifting to mid-market upsell at scale, where HubSpot velocity shines",
        "$200M ARR goal needs rep efficiency, not more Salesforce admin overhead",
      ],
      genericDisplacementSections("Pinnacle Solutions"),
    ),
  },
  "20": {
    default: {
      summary:
        "Industrial IoT vendor pivoting from sensors to a full asset-intelligence platform, mid-launch of their AI-powered predictive maintenance offering.",
      summaryBullets: [
        "Industrial IoT / asset-intelligence vendor; ~500 employees, ~$85M revenue; PE-owned (Carlyle)",
        "\"TitanAI\" predictive maintenance went GA Mar 2026 — software pivot after 6 flat quarters",
        "CEO committed to 50% of revenue from software by end of 2027",
        "12 net-new \"AI Customer Success Engineer\" roles",
        "Heavy Salesforce + Marketo + Outreach + Gainsight; the software pivot will surface RevOps debt",
      ],
      sections: [
        {
          heading: "The company",
          body: `Titan Enterprises is a privately held industrial IoT and asset intelligence software company headquartered in Detroit, MI. Founded 2009, ~500 employees, revenue estimated at $85M (PE filing-derived). They sell hardware (industrial sensors) and software (asset monitoring and predictive maintenance) into manufacturing, energy, and transportation verticals.`,
        },
        {
          heading: "The forcing function",
          body: `Their AI-powered predictive maintenance product ("TitanAI") went GA in March 2026 after an 18-month beta. This is the strategic bet:\n- The sensor business is mature and competitive; ARR growth has been flat for 6 quarters.\n- TitanAI is a pure-software, recurring-revenue product positioned alongside (eventually instead of) the sensor hardware.\n- Their CEO publicly committed to "50% of revenue from software by end of 2027" on a Q1 2026 earnings call to lenders. That's a major mix shift.\n- 12 "AI Customer Success Engineer" job listings since February 2026 — net-new role type for Titan.`,
        },
        {
          heading: "Tech stack and gaps",
          body: `- Internal stack: Salesforce CRM (confirmed by multiple Salesforce admin roles), Marketo for marketing automation, Outreach for sequencing, Gainsight for CS. Heavy Salesforce footprint.\n- The pivot to software is going to expose CRM/RevOps process debt that the hardware business never had to face. Worth knowing.\n- Gap: no public confirmation on whether the sensor business is being de-prioritized or run in parallel. PE owners (Carlyle, since 2021) usually push for sharper focus, not parallel motions.\n- They have an active acquisition strategy and have made 3 tuck-ins in the last 18 months (all small, AI/ML-focused). More likely coming.`,
        },
      ],
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Titan's pivot from hardware to software will surface every piece of RevOps process debt their Salesforce instance was built around — peak displacement moment.",
      genericDisplacementBullets("Titan Enterprises"),
      genericDisplacementSections("Titan Enterprises"),
    ),
  },
};

// ---------- Fallback strategy for companies without specific content ----------

export const defaultStrategy: CompanyStrategy = {
  default: {
    summary:
      "This company represents a strategic target in our prospecting pipeline. They are actively evaluating solutions in our space and have shown significant engagement signals.",
    summaryBullets: [
      "Net-new prospect showing active solution-evaluation signals",
      "Limited public footprint beyond the CRM record and recent web engagement",
      "Recent uptick in market-segment activity and gated-content downloads",
      "Web behavior consistent with mid-funnel evaluation",
      "Validate fit, decision-maker status, and tech stack on a first call",
    ],
    sections: [
      {
        heading: "The company",
        body: `Net-new prospect in our pipeline with signals of active solution evaluation. Limited public information beyond the standard CRM record and recent web engagement.`,
      },
      {
        heading: "Recent triggers",
        body: `- Increased activity in our market segment over the last 30 days\n- Engagement with industry events and gated content\n- Web behavior consistent with mid-funnel evaluation`,
      },
      {
        heading: "Where to dig next",
        body: `Public information is thin. Worth a first call to validate fit, decision-maker status, and current tech stack before building a full research dossier.`,
      },
    ],
    contactDescription: defaultContactDescription,
    primaryFriction: defaultPrimaryFriction,
    callBullets: defaultCallBullets,
    callScript: defaultCallScript,
    linkedInMessage: defaultLinkedInMessage,
    emailTemplates: defaultEmailTemplates,
  },
  "salesforce-displacement": makeSalesforceVariant(
    "Engagement signals plus a likely Salesforce footprint make this account a strong fit for a displacement play. Most mid-market teams overspend on Salesforce by 40%+ relative to what they actually need.",
    [
      "Engagement signals + a likely Salesforce footprint = strong displacement fit",
      "Mid-market teams typically overspend on Salesforce by 40%+ vs. need",
      "Reassessment cycles run every 12–18 months — reach them ahead of renewal",
      "Structured migration playbook handles data, integrations, and retraining",
      "Position HubSpot as a credible alternative, not a switching cost",
    ],
    genericDisplacementSections("this account"),
  ),
};

const DEFAULT_GENERATED_AT = "Aug 15, 2026 at 9:42 AM";

export const getCompanyStrategy = (companyId: string | undefined): CompanyStrategy => {
  const found = companyId ? companyStrategies[companyId] : undefined;
  if (!found) return defaultStrategy;
  const base = found.default ?? defaultStrategy.default;
  const displacement = found["salesforce-displacement"] ?? defaultStrategy["salesforce-displacement"];
  return {
    default: { ...base, generatedAt: base.generatedAt ?? DEFAULT_GENERATED_AT },
    "salesforce-displacement": { ...displacement, generatedAt: displacement.generatedAt ?? DEFAULT_GENERATED_AT },
  };
};
