// Company-specific details for the side panel

export interface CompanyDetail {
  id: string;
  companyName: string;
  description: string;
  industry: string;
  country: string;
  employeeSize: string;
  annualRevenue: string;
  lastUpdated: string;
  linkedInInfo: {
    industry: string;
    location: string;
    employeeCount: string;
    employeesOnLinkedIn: number;
  };
  leadQualification: {
    fitScore: number;
    salesIntent: number;
    marketingIntent: number;
    dms: number;
    associatedQLs: string[];
    compellingReasons: string[];
    competitorProducts: string;
  };
  portals?: Array<{
    id: string;
    portalName: string;
    portalId: string;
    customerName: string;
    totalActivePortalUsers: number;
    activePortalContactEmails: string;
    productsHubs: string;
    activeTrials: string;
    portalType: string;
  }>;
  deals: Array<{
    id: string;
    title: string;
    amount: number;
    closeDate: string;
    stage: string;
    progress: number;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'email' | 'call' | 'meeting';
    title: string;
    participant: string;
    date: string;
    time: string;
    preview?: string;
  }>;
}

export const companyDetails: Record<string, CompanyDetail> = {
  "1": {
    id: "1",
    companyName: "ACME Corp",
    description: "ACME Corp is a leading provider of enterprise software solutions, specializing in cloud-based productivity tools and collaboration platforms. They serve Fortune 500 companies and have recently expanded into AI-powered automation.",
    industry: "Software & Technology",
    country: "United States",
    employeeSize: "500 - 1000",
    annualRevenue: "$75,000,000",
    lastUpdated: "Nov 15, 2024",
    linkedInInfo: {
      industry: "Software Development",
      location: "San Francisco, California, United States",
      employeeCount: "501-1000",
      employeesOnLinkedIn: 782,
    },
    leadQualification: {
      fitScore: 95,
      salesIntent: 92,
      marketingIntent: 88,
      dms: 3,
      associatedQLs: [
        "Priya Sharma: Enterprise Demo Request",
        "Jennifer Park: Pricing Inquiry - 500+ seats",
      ],
      compellingReasons: [
        "ACME recently raised $50M Series C funding to expand their enterprise division",
        "Jennifer Park mentioned budget approval for Q1 2025 in last quarter's call",
        "Currently using 3 competitor products that could be consolidated with our platform",
      ],
      competitorProducts: "Salesforce, HubSpot, and 2 others",
    },
    portals: [
      {
        id: "p1",
        portalName: "ACME Corp",
        portalId: "147813996",
        customerName: "ACME Corp",
        totalActivePortalUsers: 3,
        activePortalContactEmails: "priya.sharma@acmecorp.com",
        productsHubs: "Sales Hub Enterprise",
        activeTrials: "--",
        portalType: "Paid",
      },
      {
        id: "p2",
        portalName: "ACME Corp",
        portalId: "144360698",
        customerName: "ACME Corp",
        totalActivePortalUsers: 0,
        activePortalContactEmails: "jennifer.park@acmecorp.com",
        productsHubs: "--",
        activeTrials: "--",
        portalType: "Free",
      },
    ],
    deals: [
      {
        id: "d1",
        title: "ACME Corp - Enterprise Platform Deal",
        amount: 250000,
        closeDate: "Jan 31, 2025",
        stage: "proposal",
        progress: 4,
      },
      {
        id: "d2",
        title: "ACME Corp - Additional Seats",
        amount: 50000,
        closeDate: "Dec 15, 2024",
        stage: "negotiation",
        progress: 5,
      },
    ],
    contacts: [
      {
        id: "c1",
        name: "Priya Sharma",
        company: "ACME Corp",
        email: "priya.sharma@acmecorp.com",
        phone: "+1 415 555 0123",
      },
      {
        id: "c2",
        name: "Jennifer Park",
        company: "ACME Corp",
        email: "jennifer.park@acmecorp.com",
        phone: "+1 415 555 0124",
      },
    ],
    recentActivity: [
      {
        id: "a1",
        type: "email",
        title: "Sent: Q1 2025 Enterprise Proposal",
        participant: "Jennifer Park",
        date: "Today",
        time: "9:30 AM",
        preview: "Hi Jennifer, Following up on our call last week, I've prepared a comprehensive proposal for your Q1 expansion...",
      },
      {
        id: "a2",
        type: "call",
        title: "Call: Discovery session",
        participant: "Priya Sharma",
        date: "Yesterday",
        time: "2:00 PM",
      },
      {
        id: "a3",
        type: "email",
        title: "Received: Re: Demo follow-up questions",
        participant: "Priya Sharma",
        date: "Nov 13",
        time: "11:45 AM",
        preview: "Thanks for the demo! Our team had a few questions about the API integrations and SSO capabilities...",
      },
    ],
  },
  "2": {
    id: "2",
    companyName: "TechVision Inc",
    description: "TechVision Inc is a rapidly growing B2B SaaS company focused on data analytics and business intelligence solutions. Recently secured Series B funding and is aggressively expanding their sales team.",
    industry: "Data Analytics",
    country: "Canada",
    employeeSize: "100 - 250",
    annualRevenue: "$15,000,000",
    lastUpdated: "Nov 10, 2024",
    linkedInInfo: {
      industry: "Technology, Information and Internet",
      location: "Toronto, Ontario, Canada",
      employeeCount: "101-250",
      employeesOnLinkedIn: 156,
    },
    leadQualification: {
      fitScore: 88,
      salesIntent: 85,
      marketingIntent: 72,
      dms: 5,
      associatedQLs: [
        "Marcus Chen: Sales enablement platform inquiry",
      ],
      compellingReasons: [
        "TechVision announced $30M Series B funding focused on sales expansion",
        "VP of Sales just hired and building out new team (15+ open positions)",
        "Currently using legacy tools with low adoption rates",
      ],
      competitorProducts: "Outreach, SalesLoft",
    },
    portals: [
      {
        id: "p3",
        portalName: "TechVision Inc",
        portalId: "158924731",
        customerName: "TechVision Inc",
        totalActivePortalUsers: 5,
        activePortalContactEmails: "marcus.chen@techvision.ca",
        productsHubs: "Marketing Hub Professional",
        activeTrials: "Sales Hub",
        portalType: "Paid",
      },
      {
        id: "p4",
        portalName: "TechVision Inc",
        portalId: "162047385",
        customerName: "TechVision Inc",
        totalActivePortalUsers: 0,
        activePortalContactEmails: "sarah.johnson@techvision.ca",
        productsHubs: "--",
        activeTrials: "--",
        portalType: "Free",
      },
    ],
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
    contacts: [
      {
        id: "c3",
        name: "Marcus Chen",
        company: "TechVision Inc",
        email: "marcus.chen@techvision.ca",
        phone: "+1 647 555 0201",
      },
      {
        id: "c4",
        name: "Sarah Johnson",
        company: "TechVision Inc",
        email: "sarah.johnson@techvision.ca",
        phone: "+1 647 555 0202",
      },
    ],
    recentActivity: [
      {
        id: "a4",
        type: "email",
        title: "Sent: Sales enablement best practices",
        participant: "Marcus Chen",
        date: "Today",
        time: "10:15 AM",
        preview: "Marcus, I wanted to share some insights on how companies your size typically approach sales enablement...",
      },
      {
        id: "a5",
        type: "meeting",
        title: "Scheduled: Initial discovery call",
        participant: "Marcus Chen",
        date: "Tomorrow",
        time: "3:00 PM",
      },
    ],
  },
  "3": {
    id: "3",
    companyName: "Innovate Solutions",
    description: "Innovate Solutions provides cutting-edge marketing automation and customer engagement tools for mid-market companies. Known for their innovative approach to customer retention.",
    industry: "Marketing Technology",
    country: "United Kingdom",
    employeeSize: "250 - 500",
    annualRevenue: "$35,000,000",
    lastUpdated: "Nov 12, 2024",
    linkedInInfo: {
      industry: "Marketing Services",
      location: "London, England, United Kingdom",
      employeeCount: "251-500",
      employeesOnLinkedIn: 312,
    },
    leadQualification: {
      fitScore: 82,
      salesIntent: 78,
      marketingIntent: 91,
      dms: 8,
      associatedQLs: [
        "Aisha Patel: Integration capabilities inquiry",
        "David Lee: ROI case study request",
      ],
      compellingReasons: [
        "Responded positively to last email with specific integration questions",
        "Multiple website visits to pricing and features pages in past week",
        "Director of Marketing attended our webinar on sales-marketing alignment",
      ],
      competitorProducts: "Marketo, Pardot, and 1 other",
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
    contacts: [
      {
        id: "c5",
        name: "Aisha Patel",
        company: "Innovate Solutions",
        email: "aisha.patel@innovatesolutions.co.uk",
        phone: "+44 20 7946 0234",
      },
      {
        id: "c6",
        name: "David Lee",
        company: "Innovate Solutions",
        email: "david.lee@innovatesolutions.co.uk",
        phone: "+44 20 7946 0235",
      },
    ],
    recentActivity: [
      {
        id: "a6",
        type: "call",
        title: "Call scheduled with Aisha Patel",
        participant: "Aisha Patel",
        date: "Tomorrow",
        time: "10:00 AM",
      },
      {
        id: "a7",
        type: "email",
        title: "Received: Integration requirements question",
        participant: "Aisha Patel",
        date: "Nov 11",
        time: "4:20 PM",
        preview: "Hi, Thanks for your email. We're very interested in understanding how your platform integrates with HubSpot and our CRM...",
      },
      {
        id: "a8",
        type: "email",
        title: "Sent: Webinar follow-up materials",
        participant: "Aisha Patel",
        date: "Nov 8",
        time: "9:15 AM",
      },
    ],
  },
  // Add more companies with varied data
  "4": {
    id: "4",
    companyName: "DataStream Analytics",
    description: "DataStream Analytics specializes in real-time data processing and predictive analytics for enterprise clients. They recently appointed new leadership focused on modernizing their tech stack.",
    industry: "Data & Analytics",
    country: "Germany",
    employeeSize: "50 - 100",
    annualRevenue: "$8,500,000",
    lastUpdated: "Nov 9, 2024",
    linkedInInfo: {
      industry: "Data Infrastructure & Analytics",
      location: "Munich, Bavaria, Germany",
      employeeCount: "51-100",
      employeesOnLinkedIn: 67,
    },
    leadQualification: {
      fitScore: 76,
      salesIntent: 68,
      marketingIntent: 55,
      dms: 2,
      associatedQLs: [],
      compellingReasons: [
        "New Chief Data Officer hired with mandate to modernize tech stack",
        "Company recently published blog post about improving sales efficiency",
        "Looking to consolidate 5+ point solutions into integrated platform",
      ],
      competitorProducts: "Various point solutions",
    },
    deals: [],
    contacts: [
      {
        id: "c7",
        name: "Sofia Martinez",
        company: "DataStream Analytics",
        email: "sofia.martinez@datastream.de",
        phone: "+49 89 1234 5678",
      },
      {
        id: "c8",
        name: "James Wilson",
        company: "DataStream Analytics",
        email: "james.wilson@datastream.de",
        phone: "+49 89 1234 5679",
      },
    ],
    recentActivity: [
      {
        id: "a9",
        type: "email",
        title: "Sent: LinkedIn connection request",
        participant: "Sofia Martinez",
        date: "This Week",
        time: "Mon 2:30 PM",
      },
    ],
  },
};
