export interface DealInsight {
  label: string;
  status: "positive" | "caution" | "alert";
  isBold?: boolean;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  hasGenerateEmail: boolean;
  generatedAt: string;
}

export const dealStages = [
  "Pre-qualification",
  "Discovery",
  "Solution considerations",
  "Business considerations",
  "Pricing and Terms",
  "Out for signature",
] as const;

export type DealStage = typeof dealStages[number];

export interface Deal {
  id: string;
  companyName: string;
  dealName: string;
  lastEngagement?: string;
  priority: string;
  amount: string;
  industry: string;
  daysInStage: number;
  score: number;
  keyData: string[];
  insights: DealInsight[];
  suggestedActions: SuggestedAction[];
  stage: DealStage;
}

export const dealsData: Deal[] = [
  {
    id: "deal-1",
    companyName: "[Company name]",
    dealName: "Globalsoft - new deal",
    priority: "P1",
    amount: "$4,250.00",
    industry: "Enterprise Software",
    daysInStage: 12,
    score: 86,
    keyData: ["$4,250.00 ARR", "Enterprise", "Q2 Close", "Multi-year"],
    insights: [
      { label: "Champion engaged", status: "positive" },
      { label: "Budget approved", status: "positive" },
      { label: "Champion saw the quote", status: "alert" },
      { label: "5 risks", status: "alert", isBold: true },
      { label: "3 stakeholders", status: "positive", isBold: true },
    ],
    stage: "Pricing and Terms",
    suggestedActions: [
      { id: "sa-1a", title: "Confirm approval and send signature email to Danni", description: "Internal Director approval gates signature; confirm approval with Danni and share contract link so she can sign confidently.", hasGenerateEmail: true, generatedAt: "Feb 27, 2026 7:08 PM" },
      { id: "sa-1b", title: "Align internally on contract flexibility options", description: "You need internal clarity on any contract flexibility before re-engaging Globalsoft, or you risk overpromising on terms.", hasGenerateEmail: false, generatedAt: "Feb 27, 2026 7:08 PM" },
    ],
  },
  {
    id: "deal-2",
    companyName: "Skyward Solutions",
    dealName: "Skyward Solutions",
    lastEngagement: "2 days ago",
    priority: "P1",
    amount: "$1,875.50",
    industry: "Financial Services",
    daysInStage: 8,
    score: 86,
    keyData: ["$1,875.50 ARR", "Mid-Market", "Q2 Close", "Expansion"],
    insights: [
      { label: "Champion identified", status: "positive" },
      { label: "Budget confirmed", status: "positive" },
      { label: "Decision delayed", status: "alert" },
    ],
    stage: "Business considerations",
    suggestedActions: [
      { id: "sa-2a", title: "Send recap email with resources and budget path", description: "Faswillah Nattabi needs recap, resources, and clear next step; one email can support budget talks and involve approvers.", hasGenerateEmail: true, generatedAt: "Feb 26, 2026 3:22 PM" },
      { id: "sa-2b", title: "Schedule executive alignment call", description: "Decision has stalled — an exec-to-exec call can unblock budget approval and reinforce urgency before quarter end.", hasGenerateEmail: false, generatedAt: "Feb 26, 2026 3:22 PM" },
    ],
  },
  {
    id: "deal-3",
    companyName: "Apex Innovations",
    dealName: "Apex Innovations",
    lastEngagement: "2 days ago",
    priority: "P1",
    amount: "$7,320.00",
    industry: "Healthcare",
    daysInStage: 21,
    score: 86,
    keyData: ["$7,320.00 ARR", "Enterprise", "Q3 Close", "New business"],
    insights: [
      { label: "Exec sponsor aligned", status: "positive" },
      { label: "POC completed", status: "positive" },
      { label: "Procurement started", status: "alert" },
    ],
    stage: "Solution considerations",
    suggestedActions: [
      { id: "sa-3a", title: "Reply to Allyce with phone options and next steps", description: "Allyce Hurren (Operations Manager) needs clear options on phones and contracts; one focused email can calm concerns and keep the deal viable.", hasGenerateEmail: true, generatedAt: "Feb 25, 2026 10:45 AM" },
      { id: "sa-3b", title: "Share POC results summary with procurement", description: "Procurement has started — send a concise POC results doc to accelerate their review and keep momentum.", hasGenerateEmail: true, generatedAt: "Feb 25, 2026 10:45 AM" },
    ],
  },
  {
    id: "deal-4",
    companyName: "Meridian Corp",
    dealName: "Meridian Corp",
    lastEngagement: "5 days ago",
    priority: "P2",
    amount: "$925.75",
    industry: "Manufacturing",
    daysInStage: 5,
    score: 72,
    keyData: ["$925.75 ARR", "Mid-Market", "Q3 Close", "Upsell"],
    insights: [
      { label: "Technical fit confirmed", status: "positive" },
      { label: "Competitor evaluation", status: "caution" },
      { label: "Budget TBD", status: "alert" },
    ],
    stage: "Discovery",
    suggestedActions: [
      { id: "sa-4a", title: "Send competitive differentiators one-pager", description: "Meridian is evaluating competitors — proactively share a tailored comparison to keep your solution top of mind.", hasGenerateEmail: true, generatedAt: "Feb 24, 2026 9:30 AM" },
    ],
  },
  {
    id: "deal-5",
    companyName: "Vanguard Tech",
    dealName: "Vanguard Tech - Platform",
    lastEngagement: "1 day ago",
    priority: "P1",
    amount: "$5,100.00",
    industry: "Technology",
    daysInStage: 3,
    score: 91,
    keyData: ["$5,100.00 ARR", "Enterprise", "Q2 Close", "New business"],
    insights: [
      { label: "Champion engaged", status: "positive" },
      { label: "Budget approved", status: "positive" },
      { label: "Legal review pending", status: "caution" },
    ],
    stage: "Out for signature",
    suggestedActions: [
      { id: "sa-5a", title: "Follow up with legal on contract review", description: "Contract is with legal — a quick check-in can prevent delays.", hasGenerateEmail: true, generatedAt: "Mar 2, 2026 9:00 AM" },
    ],
  },
  {
    id: "deal-6",
    companyName: "Pinnacle Group",
    dealName: "Pinnacle Group",
    lastEngagement: "3 days ago",
    priority: "P2",
    amount: "$2,340.00",
    industry: "Consulting",
    daysInStage: 14,
    score: 68,
    keyData: ["$2,340.00 ARR", "Mid-Market", "Q3 Close", "Expansion"],
    insights: [
      { label: "Multiple stakeholders", status: "caution" },
      { label: "Positive demo feedback", status: "positive" },
    ],
    stage: "Solution considerations",
    suggestedActions: [
      { id: "sa-6a", title: "Schedule multi-stakeholder alignment call", description: "Too many decision-makers without alignment — a group call can consolidate buy-in.", hasGenerateEmail: false, generatedAt: "Mar 1, 2026 2:15 PM" },
    ],
  },
  {
    id: "deal-7",
    companyName: "NovaBridge Inc",
    dealName: "NovaBridge Inc",
    lastEngagement: "4 days ago",
    priority: "P1",
    amount: "$8,750.00",
    industry: "Financial Services",
    daysInStage: 18,
    score: 79,
    keyData: ["$8,750.00 ARR", "Enterprise", "Q2 Close", "New business"],
    insights: [
      { label: "Executive sponsor engaged", status: "positive" },
      { label: "Security review in progress", status: "caution" },
      { label: "Competitor shortlisted", status: "alert" },
    ],
    stage: "Business considerations",
    suggestedActions: [
      { id: "sa-7a", title: "Share security compliance documentation", description: "Security review is blocking progress — proactively share compliance docs.", hasGenerateEmail: true, generatedAt: "Feb 28, 2026 11:00 AM" },
    ],
  },
  {
    id: "deal-8",
    companyName: "Helix Dynamics",
    dealName: "Helix Dynamics",
    lastEngagement: "6 days ago",
    priority: "P2",
    amount: "$1,200.00",
    industry: "Logistics",
    daysInStage: 9,
    score: 65,
    keyData: ["$1,200.00 ARR", "SMB", "Q3 Close", "New business"],
    insights: [
      { label: "Technical fit confirmed", status: "positive" },
      { label: "No executive sponsor", status: "alert" },
    ],
    stage: "Discovery",
    suggestedActions: [
      { id: "sa-8a", title: "Identify and engage executive sponsor", description: "Deal lacks executive backing — find and loop in a sponsor to de-risk.", hasGenerateEmail: false, generatedAt: "Feb 27, 2026 4:30 PM" },
    ],
  },
  {
    id: "deal-9",
    companyName: "Crestline Solutions",
    dealName: "Crestline Solutions",
    lastEngagement: "1 day ago",
    priority: "P1",
    amount: "$3,600.00",
    industry: "Retail",
    daysInStage: 6,
    score: 84,
    keyData: ["$3,600.00 ARR", "Mid-Market", "Q2 Close", "Upsell"],
    insights: [
      { label: "Champion identified", status: "positive" },
      { label: "Budget confirmed", status: "positive" },
      { label: "Timeline tight", status: "caution" },
    ],
    stage: "Pricing and Terms",
    suggestedActions: [
      { id: "sa-9a", title: "Send pricing proposal by EOD", description: "Timeline is tight — getting the proposal out today keeps Q2 close on track.", hasGenerateEmail: true, generatedAt: "Mar 2, 2026 8:00 AM" },
    ],
  },
  {
    id: "deal-10",
    companyName: "Stratos Enterprises",
    dealName: "Stratos Enterprises",
    lastEngagement: "7 days ago",
    priority: "P3",
    amount: "$650.00",
    industry: "Education",
    daysInStage: 30,
    score: 45,
    keyData: ["$650.00 ARR", "SMB", "Q4 Close", "New business"],
    insights: [
      { label: "Low engagement", status: "alert" },
      { label: "Budget uncertain", status: "alert" },
    ],
    stage: "Pre-qualification",
    suggestedActions: [
      { id: "sa-10a", title: "Re-engage with value-focused outreach", description: "Deal has gone cold — a value-driven touchpoint can revive interest.", hasGenerateEmail: true, generatedAt: "Feb 25, 2026 1:00 PM" },
    ],
  },
  {
    id: "deal-11",
    companyName: "Orion Systems",
    dealName: "Orion Systems - Migration",
    lastEngagement: "2 days ago",
    priority: "P1",
    amount: "$6,400.00",
    industry: "Technology",
    daysInStage: 11,
    score: 88,
    keyData: ["$6,400.00 ARR", "Enterprise", "Q2 Close", "Migration"],
    insights: [
      { label: "POC successful", status: "positive" },
      { label: "Champion aligned", status: "positive" },
      { label: "Procurement initiated", status: "caution" },
    ],
    stage: "Business considerations",
    suggestedActions: [
      { id: "sa-11a", title: "Prepare procurement requirements package", description: "Procurement is underway — having docs ready accelerates approval.", hasGenerateEmail: true, generatedAt: "Mar 1, 2026 10:00 AM" },
    ],
  },
  {
    id: "deal-12",
    companyName: "Cobalt Industries",
    dealName: "Cobalt Industries",
    lastEngagement: "3 days ago",
    priority: "P2",
    amount: "$1,950.00",
    industry: "Manufacturing",
    daysInStage: 16,
    score: 71,
    keyData: ["$1,950.00 ARR", "Mid-Market", "Q3 Close", "Expansion"],
    insights: [
      { label: "Technical validation done", status: "positive" },
      { label: "Decision-maker unavailable", status: "alert" },
    ],
    stage: "Solution considerations",
    suggestedActions: [
      { id: "sa-12a", title: "Request intro to alternate decision-maker", description: "Primary DM is unavailable — ask champion to connect you with backup.", hasGenerateEmail: true, generatedAt: "Feb 28, 2026 3:45 PM" },
    ],
  },
  {
    id: "deal-13",
    companyName: "Luminar Health",
    dealName: "Luminar Health",
    lastEngagement: "1 day ago",
    priority: "P1",
    amount: "$4,800.00",
    industry: "Healthcare",
    daysInStage: 7,
    score: 82,
    keyData: ["$4,800.00 ARR", "Enterprise", "Q2 Close", "New business"],
    insights: [
      { label: "Compliance review passed", status: "positive" },
      { label: "Budget approved", status: "positive" },
      { label: "Integration concerns", status: "caution" },
    ],
    stage: "Pricing and Terms",
    suggestedActions: [
      { id: "sa-13a", title: "Address integration concerns with tech team", description: "Integration questions are the last blocker — a quick tech call resolves them.", hasGenerateEmail: false, generatedAt: "Mar 2, 2026 11:30 AM" },
    ],
  },
  {
    id: "deal-14",
    companyName: "Zenith Partners",
    dealName: "Zenith Partners",
    lastEngagement: "5 days ago",
    priority: "P2",
    amount: "$2,100.00",
    industry: "Legal Services",
    daysInStage: 22,
    score: 58,
    keyData: ["$2,100.00 ARR", "Mid-Market", "Q3 Close", "New business"],
    insights: [
      { label: "Demo completed", status: "positive" },
      { label: "No follow-up scheduled", status: "alert" },
      { label: "Competitor preferred", status: "alert" },
    ],
    stage: "Discovery",
    suggestedActions: [
      { id: "sa-14a", title: "Send competitive win story relevant to legal", description: "They're leaning toward a competitor — a relevant case study can shift perception.", hasGenerateEmail: true, generatedAt: "Feb 26, 2026 9:15 AM" },
    ],
  },
  {
    id: "deal-15",
    companyName: "Atlas Freight",
    dealName: "Atlas Freight",
    lastEngagement: "2 days ago",
    priority: "P1",
    amount: "$3,200.00",
    industry: "Logistics",
    daysInStage: 4,
    score: 90,
    keyData: ["$3,200.00 ARR", "Mid-Market", "Q2 Close", "Upsell"],
    insights: [
      { label: "Champion driving urgency", status: "positive" },
      { label: "Budget locked in", status: "positive" },
    ],
    stage: "Out for signature",
    suggestedActions: [
      { id: "sa-15a", title: "Confirm signer details and send DocuSign", description: "Everything is aligned — send the contract for signature today.", hasGenerateEmail: true, generatedAt: "Mar 2, 2026 7:45 AM" },
    ],
  },
  {
    id: "deal-16",
    companyName: "Redwood Analytics",
    dealName: "Redwood Analytics",
    lastEngagement: "4 days ago",
    priority: "P2",
    amount: "$1,575.00",
    industry: "Data Analytics",
    daysInStage: 13,
    score: 67,
    keyData: ["$1,575.00 ARR", "SMB", "Q3 Close", "New business"],
    insights: [
      { label: "Strong technical interest", status: "positive" },
      { label: "Budget approval pending", status: "caution" },
    ],
    stage: "Solution considerations",
    suggestedActions: [
      { id: "sa-16a", title: "Share ROI calculator to support budget case", description: "Budget isn't approved yet — an ROI model gives the champion ammunition.", hasGenerateEmail: true, generatedAt: "Feb 27, 2026 2:00 PM" },
    ],
  },
  {
    id: "deal-17",
    companyName: "Cascade Networks",
    dealName: "Cascade Networks",
    lastEngagement: "8 days ago",
    priority: "P3",
    amount: "$780.00",
    industry: "Telecommunications",
    daysInStage: 35,
    score: 42,
    keyData: ["$780.00 ARR", "SMB", "Q4 Close", "New business"],
    insights: [
      { label: "Initial interest shown", status: "positive" },
      { label: "Gone dark", status: "alert" },
    ],
    stage: "Pre-qualification",
    suggestedActions: [
      { id: "sa-17a", title: "Send breakup email to re-engage", description: "Prospect has gone dark — a breakup email can prompt a response.", hasGenerateEmail: true, generatedAt: "Feb 24, 2026 11:00 AM" },
    ],
  },
  {
    id: "deal-18",
    companyName: "Summit Financial",
    dealName: "Summit Financial - Advisory",
    lastEngagement: "1 day ago",
    priority: "P1",
    amount: "$9,200.00",
    industry: "Financial Services",
    daysInStage: 10,
    score: 85,
    keyData: ["$9,200.00 ARR", "Enterprise", "Q2 Close", "New business"],
    insights: [
      { label: "Executive sponsor confirmed", status: "positive" },
      { label: "Multi-thread established", status: "positive" },
      { label: "Legal review started", status: "caution" },
    ],
    stage: "Business considerations",
    suggestedActions: [
      { id: "sa-18a", title: "Proactively share redline-friendly contract", description: "Legal has started review — a clean, redline-ready contract speeds things up.", hasGenerateEmail: true, generatedAt: "Mar 2, 2026 10:00 AM" },
    ],
  },
  {
    id: "deal-19",
    companyName: "Ironclad Security",
    dealName: "Ironclad Security",
    lastEngagement: "3 days ago",
    priority: "P2",
    amount: "$2,800.00",
    industry: "Cybersecurity",
    daysInStage: 19,
    score: 73,
    keyData: ["$2,800.00 ARR", "Mid-Market", "Q3 Close", "Expansion"],
    insights: [
      { label: "Existing customer", status: "positive" },
      { label: "New use case identified", status: "positive" },
      { label: "Internal champion changed", status: "caution" },
    ],
    stage: "Discovery",
    suggestedActions: [
      { id: "sa-19a", title: "Build relationship with new champion", description: "Champion has changed — schedule an intro call to reset the relationship.", hasGenerateEmail: false, generatedAt: "Feb 28, 2026 1:30 PM" },
    ],
  },
  {
    id: "deal-20",
    companyName: "Evergreen Media",
    dealName: "Evergreen Media",
    lastEngagement: "2 days ago",
    priority: "P1",
    amount: "$3,950.00",
    industry: "Media & Entertainment",
    daysInStage: 8,
    score: 81,
    keyData: ["$3,950.00 ARR", "Mid-Market", "Q2 Close", "New business"],
    insights: [
      { label: "Strong product fit", status: "positive" },
      { label: "Budget approved", status: "positive" },
      { label: "Timing pressure from renewal", status: "caution" },
    ],
    stage: "Pricing and Terms",
    suggestedActions: [
      { id: "sa-20a", title: "Send final pricing with renewal deadline incentive", description: "Renewal deadline creates urgency — a time-bound offer can accelerate close.", hasGenerateEmail: true, generatedAt: "Mar 1, 2026 4:00 PM" },
    ],
  },
  {
    id: "deal-21",
    companyName: "BluePeak Ventures",
    dealName: "BluePeak Ventures",
    lastEngagement: "6 days ago",
    priority: "P3",
    amount: "$500.00",
    industry: "Venture Capital",
    daysInStage: 28,
    score: 39,
    keyData: ["$500.00 ARR", "SMB", "Q4 Close", "New business"],
    insights: [
      { label: "Early stage exploration", status: "caution" },
      { label: "No budget discussion", status: "alert" },
    ],
    stage: "Pre-qualification",
    suggestedActions: [
      { id: "sa-21a", title: "Qualify budget and timeline in next call", description: "No budget discussion yet — next touchpoint must qualify or disqualify.", hasGenerateEmail: false, generatedAt: "Feb 25, 2026 3:00 PM" },
    ],
  },
  {
    id: "deal-22",
    companyName: "TerraCore Energy",
    dealName: "TerraCore Energy - Platform",
    lastEngagement: "1 day ago",
    priority: "P1",
    amount: "$11,500.00",
    industry: "Energy",
    daysInStage: 15,
    score: 87,
    keyData: ["$11,500.00 ARR", "Enterprise", "Q2 Close", "New business"],
    insights: [
      { label: "POC approved", status: "positive" },
      { label: "Multi-year interest", status: "positive" },
      { label: "Procurement complexity", status: "caution" },
    ],
    stage: "Business considerations",
    suggestedActions: [
      { id: "sa-22a", title: "Map procurement process with champion", description: "Procurement is complex — work with champion to identify all approvers and timelines.", hasGenerateEmail: false, generatedAt: "Mar 2, 2026 9:30 AM" },
    ],
  },
  {
    id: "deal-23",
    companyName: "Northstar Logistics",
    dealName: "Northstar Logistics",
    lastEngagement: "4 days ago",
    priority: "P2",
    amount: "$1,680.00",
    industry: "Supply Chain",
    daysInStage: 11,
    score: 70,
    keyData: ["$1,680.00 ARR", "Mid-Market", "Q3 Close", "Upsell"],
    insights: [
      { label: "Current customer satisfied", status: "positive" },
      { label: "New module interest", status: "positive" },
      { label: "Budget cycle mismatch", status: "caution" },
    ],
    stage: "Solution considerations",
    suggestedActions: [
      { id: "sa-23a", title: "Propose bridge agreement for budget cycle gap", description: "Budget cycle doesn't align — a short bridge deal keeps momentum.", hasGenerateEmail: true, generatedAt: "Feb 27, 2026 5:00 PM" },
    ],
  },
  {
    id: "deal-24",
    companyName: "Prism Biotech",
    dealName: "Prism Biotech",
    lastEngagement: "2 days ago",
    priority: "P1",
    amount: "$5,900.00",
    industry: "Biotechnology",
    daysInStage: 6,
    score: 83,
    keyData: ["$5,900.00 ARR", "Enterprise", "Q2 Close", "New business"],
    insights: [
      { label: "Regulatory fit confirmed", status: "positive" },
      { label: "Champion driving timeline", status: "positive" },
      { label: "Final vendor evaluation", status: "caution" },
    ],
    stage: "Pricing and Terms",
    suggestedActions: [
      { id: "sa-24a", title: "Deliver tailored proposal highlighting regulatory edge", description: "They're in final eval — a proposal that leads with compliance wins differentiates you.", hasGenerateEmail: true, generatedAt: "Mar 1, 2026 11:00 AM" },
    ],
  },
];
