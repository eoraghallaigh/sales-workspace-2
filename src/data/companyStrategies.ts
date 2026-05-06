// Strategy content per company, per variant (AI-generated business intelligence + outreach copy).

export type StrategyVariantId = "default" | "salesforce-displacement";

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface CompanyStrategyVariant {
  businessIntelligence: string;
  recentNews: { title: string; description: string };
  strategicIntegration: string;
  contactDescription: (firstName: string, companyName: string) => string;
  primaryFriction: (companyName: string) => string;
  callBullets: (companyName: string) => string[];
  callScript: (companyName: string, firstName: string) => string;
  linkedInMessage: (companyName: string, firstName: string) => string;
  emailTemplates: (companyName: string, firstName: string) => EmailTemplate[];
}

export type CompanyStrategy = Record<StrategyVariantId, CompanyStrategyVariant>;

// ---------- Default-tone copy shared across companies ----------

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

// ---------- Salesforce-displacement variant ----------

const makeSalesforceVariant = (
  bi: string,
  recentNews: { title: string; description: string },
  strategicIntegration: string,
): CompanyStrategyVariant => ({
  businessIntelligence: bi,
  recentNews,
  strategicIntegration,
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

// ---------- Per-company strategies ----------

export const companyStrategies: Record<string, CompanyStrategy> = {
  "1": {
    default: {
      businessIntelligence:
        "ACME Corp is an AI-driven B2B cloud CRM and sales data management platform specifically engineered for the multi-line selling ecosystem, including independent manufacturers' reps, manufacturers, and distributors. By consolidating CRM, commission tracking, and quoting, they eliminate administrative busywork for sales teams. Their primary customers are B2B organizations in the manufacturing, HVAC, plumbing, and electronics sectors.",
      recentNews: {
        title: "CRA Conference Presentation (Feb 2026)",
        description:
          "ACME recently presented at the CRA Conference on February 24, 2026, showcasing how their integration with Empowering Systems puts cutting-edge technology at users' fingertips. This indicates a strong current focus on leveraging their combined platforms to improve rep efficiency.",
      },
      strategicIntegration:
        "While the acquisition was announced previously, the company is actively moving Empowering Systems employees into the RepSonic fold, with Rich Gomez and Scott Mays joining the leadership team to drive product integration.",
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "ACME Corp runs a complex multi-line sales motion that's a textbook case for why Salesforce becomes a tax over time — every new product line and rep tier adds custom objects, validation rules, and admin hours. Their growth-stage profile means renewal costs will only accelerate without intervention.",
      {
        title: "Renewal cycle approaching — Salesforce contract review window",
        description:
          "Public hiring and integration signals point to ACME being in an active stack-rationalization mode. Manufacturers' rep firms historically pay outsized Salesforce premiums for use cases HubSpot now covers natively.",
      },
      "The integration of Empowering Systems is exactly the kind of post-acquisition data-stitching project where Salesforce admin overhead balloons. Migrating onto a unified Smart CRM consolidates this in one place rather than building yet another integration.",
    ),
  },
  "2": {
    default: {
      businessIntelligence:
        "TechVision Inc is a rapidly growing B2B SaaS company focused on data analytics and business intelligence solutions. Recently secured Series B funding and is aggressively expanding their sales team with 15+ open positions. Their VP of Sales is newly hired and actively building out the team.",
      recentNews: {
        title: "Series B Funding Round (Jan 2026)",
        description:
          "TechVision announced a $30M Series B round focused on expanding their enterprise sales capabilities and product development. The funding signals strong investor confidence and growth trajectory.",
      },
      strategicIntegration:
        "The company is in rapid hiring mode, with the new VP of Sales mandated to build a world-class sales organization. They are actively evaluating modern sales tools to replace legacy systems with low adoption rates.",
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "TechVision's Series B + new VP of Sales combination is the classic Salesforce-displacement profile: a leader being asked to scale revenue fast, inheriting a CRM no one trusts. The mandate to 'build a modern sales org' rarely survives contact with a legacy Salesforce instance.",
      {
        title: "New VP of Sales + funding round = stack reset window",
        description:
          "Newly funded growth-stage companies routinely consolidate vendors in their first 12 months. With a new sales leader actively evaluating tools, TechVision is in the buying window for a Salesforce alternative.",
      },
      "Replacing Salesforce now — before the team triples — avoids years of compounding admin debt. HubSpot's modern data model and AI-native workflow position the new sales org for productivity from day one.",
    ),
  },
  "3": {
    default: {
      businessIntelligence:
        "Innovate Solutions provides cutting-edge marketing automation and customer engagement tools for mid-market companies. Known for their innovative approach to customer retention, they serve companies with 500-5000 employees seeking digital transformation.",
      recentNews: {
        title: "Digital Transformation Summit (Mar 2026)",
        description:
          "Innovate Solutions recently hosted a summit focused on marketing-sales alignment, drawing over 500 attendees from mid-market companies. This indicates strong thought leadership positioning.",
      },
      strategicIntegration:
        "The company is actively consolidating from 3 separate marketing tools into a unified platform, creating a significant opportunity for comprehensive solution providers.",
      contactDescription: defaultContactDescription,
      primaryFriction: defaultPrimaryFriction,
      callBullets: defaultCallBullets,
      callScript: defaultCallScript,
      linkedInMessage: defaultLinkedInMessage,
      emailTemplates: defaultEmailTemplates,
    },
    "salesforce-displacement": makeSalesforceVariant(
      "Innovate Solutions is already in vendor-consolidation mode on the marketing side — extending that lens to the CRM is the obvious next move. Salesforce + Marketing Cloud is the most expensive way to align marketing and sales; HubSpot delivers it as one product.",
      {
        title: "Active vendor consolidation across the GTM stack",
        description:
          "Their summit messaging on marketing-sales alignment is the pitch. The team already believes in the thesis — they just haven't applied it to their CRM yet.",
      },
      "Migrating off Salesforce while consolidating marketing tools doubles the value of the project: one vendor, one data model, one integration footprint to maintain.",
    ),
  },
};

// ---------- Fallback strategy for companies without specific content ----------

export const defaultStrategy: CompanyStrategy = {
  default: {
    businessIntelligence:
      "This company represents a strategic target in our prospecting pipeline. Based on available data, they are actively evaluating solutions in our space and have shown significant engagement signals.",
    recentNews: {
      title: "Recent Market Activity (Q1 2026)",
      description:
        "This company has shown increased activity in our market segment, including website visits, content downloads, and engagement with industry events.",
    },
    strategicIntegration:
      "Current intelligence suggests the company is in an evaluation phase, looking to modernize their technology stack and improve operational efficiency.",
    contactDescription: defaultContactDescription,
    primaryFriction: defaultPrimaryFriction,
    callBullets: defaultCallBullets,
    callScript: defaultCallScript,
    linkedInMessage: defaultLinkedInMessage,
    emailTemplates: defaultEmailTemplates,
  },
  "salesforce-displacement": makeSalesforceVariant(
    "Engagement signals plus a likely Salesforce footprint make this account a strong fit for a displacement play. Most mid-market teams overspend on Salesforce by 40%+ relative to what they actually need.",
    {
      title: "Salesforce renewal window — typical pattern",
      description:
        "Companies in this profile typically reassess their CRM every 12–18 months. Reaching them ahead of renewal positions HubSpot as a credible alternative rather than a switching cost.",
    },
    "A migration from Salesforce to HubSpot is more straightforward than most teams expect. We have a structured playbook and dedicated migration resources that handle the historical data, integrations, and rep retraining.",
  ),
};

export const getCompanyStrategy = (companyId: string | undefined): CompanyStrategy =>
  (companyId && companyStrategies[companyId]) || defaultStrategy;
