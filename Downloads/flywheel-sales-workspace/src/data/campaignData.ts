export interface EnablementMaterial {
  id: string;
  title: string;
  type: "case-study" | "one-pager" | "talk-track" | "battle-card" | "video";
  description: string;
}

export interface Campaign {
  id: string;
  label: string;
  description: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  completionCriteria: string;
  enablementMaterials: EnablementMaterial[];
  metrics: {
    totalCompanies: number;
    worked: number;
    meetings: number;
    target: number;
  };
}

export const campaigns: Campaign[] = [
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
    metrics: {
      totalCompanies: 16,
      worked: 10,
      meetings: 4,
      target: 16
    }
  },
  {
    id: "q3-aeo-push",
    label: "Q3 AEO Push",
    description: "Accelerate pipeline for the AEO product line ahead of Q3 targets. Prioritize companies with 500+ employees that have shown intent signals around AI-powered analytics. Leadership wants 15 meetings booked by end of campaign.",
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
    metrics: {
      totalCompanies: 48,
      worked: 8,
      meetings: 2,
      target: 15
    }
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
    metrics: {
      totalCompanies: 22,
      worked: 15,
      meetings: 7,
      target: 12
    }
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
    metrics: {
      totalCompanies: 56,
      worked: 31,
      meetings: 9,
      target: 20
    }
  }
];
