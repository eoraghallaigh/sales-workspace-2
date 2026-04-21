// Contact-specific details for the side panel

export interface ContactDetail {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  avatarColor: string;
  linkedInInfo: {
    role: string;
    location: string;
    yearsInRole: string;
    previousCompanies: string;
  };
  leadQualification: {
    engagementScore: number;
    responseRate: number;
    meetingAcceptance: number;
    lastEngagement: string;
    associatedQLs: string[];
    compellingReasons: string[];
    interests: string;
  };
  deals: Array<{
    id: string;
    title: string;
    amount: number;
    closeDate: string;
    stage: string;
    progress: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'email' | 'call' | 'meeting';
    title: string;
    date: string;
    time: string;
    preview?: string;
  }>;
  qlSummary: {
    hasRecentQL: boolean;
    recentQLMessage?: string;
    hasPastQLs: boolean;
    pastQLsMessage?: string;
  };
  notes: Array<{
    id: string;
    content: string;
    date: string;
    time: string;
  }>;
}

export const contactDetails: Record<string, ContactDetail> = {
  "c1": {
    id: "c1",
    name: "Jennifer Park",
    initials: "JP",
    role: "VP, Marketing",
    company: "ACME Corp",
    email: "jennifer.park@acmecorp.com",
    phone: "+1 415 555 0124",
    avatarColor: "bg-trellis-purple-600",
    linkedInInfo: {
      role: "VP, Marketing",
      location: "San Francisco Bay Area, California",
      yearsInRole: "2 years 3 months",
      previousCompanies: "Salesforce, Adobe, Oracle",
    },
    leadQualification: {
      engagementScore: 92,
      responseRate: 85,
      meetingAcceptance: 78,
      lastEngagement: "2 hours ago",
      associatedQLs: [
        "Enterprise Platform Demo - Q1 2025",
        "Pricing discussion for 500+ seats",
      ],
      compellingReasons: [
        "Jennifer mentioned budget approval for Q1 2025 in recent call",
        "Actively researching competitors and requesting comparison materials",
        "Has authority to make purchasing decisions for marketing tech stack",
      ],
      interests: "Sales enablement, Marketing automation, Team collaboration",
    },
    deals: [
      {
        id: "d1",
        title: "ACME Corp - Enterprise Platform Deal",
        amount: 250000,
        closeDate: "Jan 31, 2025",
        stage: "proposal",
        progress: 4,
      },
    ],
    recentActivity: [
      {
        id: "a1",
        type: "email",
        title: "Sent: Q1 2025 Enterprise Proposal",
        date: "Today",
        time: "9:30 AM",
        preview: "Hi Jennifer, Following up on our call last week, I've prepared a comprehensive proposal for your Q1 expansion...",
      },
      {
        id: "a2",
        type: "meeting",
        title: "Meeting: Budget planning discussion",
        date: "Yesterday",
        time: "3:00 PM",
      },
      {
        id: "a3",
        type: "email",
        title: "Received: Re: Competitor comparison",
        date: "Nov 13",
        time: "11:20 AM",
        preview: "Thanks for the detailed comparison. I'd like to schedule time to discuss the integration capabilities in more detail...",
      },
    ],
    qlSummary: {
      hasRecentQL: true,
      recentQLMessage: "Jennifer was qualified as a lead on Nov 10, 2024 based on strong buying signals and budget confirmation for Q1 2025.",
      hasPastQLs: true,
      pastQLsMessage: "2 qualified leads in the last 90 days. Jennifer has shown consistent engagement and purchasing intent.",
    },
    notes: [
      {
        id: "n1",
        content: "Jennifer confirmed they have budget approved for Q1 2025. She mentioned they're looking to expand from 200 to 500+ seats.",
        date: "Nov 13",
        time: "4:15 PM",
      },
      {
        id: "n2",
        content: "Strong interest in API integrations and SSO capabilities. Need to follow up with technical team for deeper dive.",
        date: "Nov 10",
        time: "2:30 PM",
      },
      {
        id: "n3",
        content: "Previous customer at Salesforce - had great experience with our platform. This is a warm lead.",
        date: "Nov 8",
        time: "11:00 AM",
      },
    ],
  },
  "c2": {
    id: "c2",
    name: "Priya Sharma",
    initials: "PS",
    role: "Product Marketing Manager",
    company: "ACME Corp",
    email: "priya.sharma@acmecorp.com",
    phone: "+1 415 555 0123",
    avatarColor: "bg-trellis-purple-600",
    linkedInInfo: {
      role: "Product Marketing Manager",
      location: "San Francisco, California",
      yearsInRole: "1 year 5 months",
      previousCompanies: "HubSpot, Drift",
    },
    leadQualification: {
      engagementScore: 88,
      responseRate: 92,
      meetingAcceptance: 85,
      lastEngagement: "Yesterday",
      associatedQLs: [
        "Product demo request - Team collaboration features",
      ],
      compellingReasons: [
        "Recently requested detailed product demo focusing on API integrations",
        "High engagement with all email communications (95% open rate)",
        "Actively involved in vendor evaluation process",
      ],
      interests: "Product analytics, API integrations, User experience",
    },
    deals: [
      {
        id: "d1",
        title: "ACME Corp - Enterprise Platform Deal",
        amount: 250000,
        closeDate: "Jan 31, 2025",
        stage: "proposal",
        progress: 4,
      },
    ],
    recentActivity: [
      {
        id: "a4",
        type: "call",
        title: "Call: Discovery session",
        date: "Yesterday",
        time: "2:00 PM",
      },
      {
        id: "a5",
        type: "email",
        title: "Received: Re: Demo follow-up questions",
        date: "Nov 13",
        time: "11:45 AM",
        preview: "Thanks for the demo! Our team had a few questions about the API integrations and SSO capabilities...",
      },
      {
        id: "a6",
        type: "meeting",
        title: "Meeting: Product demo",
        date: "Nov 12",
        time: "10:00 AM",
      },
    ],
    qlSummary: {
      hasRecentQL: false,
      hasPastQLs: false,
    },
    notes: [
      {
        id: "n4",
        content: "Very responsive and engaged. Team seems aligned on the need for better collaboration tools.",
        date: "Nov 12",
        time: "3:45 PM",
      },
    ],
  },
  "c3": {
    id: "c3",
    name: "Marcus Chen",
    initials: "MC",
    role: "VP of Sales",
    company: "TechVision Inc",
    email: "marcus.chen@techvision.ca",
    phone: "+1 647 555 0201",
    avatarColor: "bg-trellis-blue-600",
    linkedInInfo: {
      role: "VP of Sales",
      location: "Toronto, Ontario, Canada",
      yearsInRole: "3 months (New hire)",
      previousCompanies: "LinkedIn, Zoom",
    },
    leadQualification: {
      engagementScore: 75,
      responseRate: 68,
      meetingAcceptance: 72,
      lastEngagement: "Today",
      associatedQLs: [
        "Sales enablement platform inquiry",
      ],
      compellingReasons: [
        "Just hired and building out new sales team (15+ open positions)",
        "Has budget authority for sales tools and enablement",
        "Previously used our platform at LinkedIn with great success",
      ],
      interests: "Sales enablement, Team onboarding, Performance analytics",
    },
    deals: [
      {
        id: "d3",
        title: "TechVision Inc - Sales Team Expansion",
        amount: 120000,
        closeDate: "Dec 31, 2024",
        stage: "qualification",
        progress: 2,
      },
    ],
    recentActivity: [
      {
        id: "a7",
        type: "email",
        title: "Sent: Sales enablement best practices",
        date: "Today",
        time: "10:15 AM",
        preview: "Marcus, I wanted to share some insights on how companies your size typically approach sales enablement...",
      },
      {
        id: "a8",
        type: "meeting",
        title: "Scheduled: Initial discovery call",
        date: "Tomorrow",
        time: "3:00 PM",
      },
    ],
    qlSummary: {
      hasRecentQL: false,
      hasPastQLs: false,
    },
    notes: [],
  },
  "c4": {
    id: "c4",
    name: "Aisha Patel",
    initials: "AP",
    role: "Director of Marketing",
    company: "Innovate Solutions",
    email: "aisha.patel@innovatesolutions.co.uk",
    phone: "+44 20 7946 0234",
    avatarColor: "bg-trellis-green-600",
    linkedInInfo: {
      role: "Director of Marketing",
      location: "London, England, United Kingdom",
      yearsInRole: "2 years 8 months",
      previousCompanies: "Mailchimp, Intercom",
    },
    leadQualification: {
      engagementScore: 82,
      responseRate: 78,
      meetingAcceptance: 75,
      lastEngagement: "4 hours ago",
      associatedQLs: [
        "Integration capabilities inquiry",
        "ROI case study request",
      ],
      compellingReasons: [
        "Attended our webinar on sales-marketing alignment",
        "Multiple website visits to pricing and features pages",
        "Responded with specific integration questions",
      ],
      interests: "Marketing automation, CRM integration, Campaign analytics",
    },
    deals: [
      {
        id: "d4",
        title: "Innovate Solutions - Marketing Alignment Suite",
        amount: 180000,
        closeDate: "Feb 15, 2025",
        stage: "prospecting",
        progress: 3,
      },
    ],
    recentActivity: [
      {
        id: "a9",
        type: "call",
        title: "Call scheduled with Aisha Patel",
        date: "Tomorrow",
        time: "10:00 AM",
      },
      {
        id: "a10",
        type: "email",
        title: "Received: Integration requirements question",
        date: "Nov 11",
        time: "4:20 PM",
        preview: "Hi, Thanks for your email. We're very interested in understanding how your platform integrates with HubSpot and our CRM...",
      },
      {
        id: "a11",
        type: "email",
        title: "Sent: Webinar follow-up materials",
        date: "Nov 8",
        time: "9:15 AM",
      },
    ],
    qlSummary: {
      hasRecentQL: false,
      hasPastQLs: false,
    },
    notes: [
      {
        id: "n5",
        content: "Aisha attended our webinar last week. She asked several detailed questions about ROI and implementation timeline.",
        date: "Nov 9",
        time: "1:20 PM",
      },
      {
        id: "n6",
        content: "Key decision maker for marketing tools. Mentioned they're currently using 3 different tools that could be consolidated.",
        date: "Nov 7",
        time: "10:15 AM",
      },
    ],
  },
  "c5": {
    id: "c5",
    name: "Sofia Martinez",
    initials: "SM",
    role: "Data Analytics Lead",
    company: "DataStream Analytics",
    email: "sofia.martinez@datastream.de",
    phone: "+49 89 1234 5678",
    avatarColor: "bg-trellis-teal-600",
    linkedInInfo: {
      role: "Data Analytics Lead",
      location: "Munich, Bavaria, Germany",
      yearsInRole: "1 year 2 months",
      previousCompanies: "SAP, Tableau",
    },
    leadQualification: {
      engagementScore: 65,
      responseRate: 55,
      meetingAcceptance: 60,
      lastEngagement: "This week",
      associatedQLs: [],
      compellingReasons: [
        "LinkedIn connection accepted, showing interest",
        "Works under new Chief Data Officer with modernization mandate",
        "Team is actively evaluating consolidation of multiple tools",
      ],
      interests: "Data analytics, Business intelligence, Sales efficiency",
    },
    deals: [],
    recentActivity: [
      {
        id: "a12",
        type: "email",
        title: "Sent: LinkedIn connection request",
        date: "This Week",
        time: "Mon 2:30 PM",
      },
    ],
    qlSummary: {
      hasRecentQL: false,
      hasPastQLs: false,
    },
    notes: [],
  },
};
