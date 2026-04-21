// Strategy content per company (AI-generated business intelligence)
export const companyStrategies: Record<string, {
  businessIntelligence: string;
  recentNews: { title: string; description: string; };
  strategicIntegration: string;
}> = {
  "1": {
    businessIntelligence: "ACME Corp is an AI-driven B2B cloud CRM and sales data management platform specifically engineered for the multi-line selling ecosystem, including independent manufacturers' reps, manufacturers, and distributors. By consolidating CRM, commission tracking, and quoting, they eliminate administrative busywork for sales teams. Their primary customers are B2B organizations in the manufacturing, HVAC, plumbing, and electronics sectors.",
    recentNews: {
      title: "CRA Conference Presentation (Feb 2026)",
      description: "ACME recently presented at the CRA Conference on February 24, 2026, showcasing how their integration with Empowering Systems puts cutting-edge technology at users' fingertips. This indicates a strong current focus on leveraging their combined platforms to improve rep efficiency."
    },
    strategicIntegration: "While the acquisition was announced previously, the company is actively moving Empowering Systems employees into the RepSonic fold, with Rich Gomez and Scott Mays joining the leadership team to drive product integration."
  },
  "2": {
    businessIntelligence: "TechVision Inc is a rapidly growing B2B SaaS company focused on data analytics and business intelligence solutions. Recently secured Series B funding and is aggressively expanding their sales team with 15+ open positions. Their VP of Sales is newly hired and actively building out the team.",
    recentNews: {
      title: "Series B Funding Round (Jan 2026)",
      description: "TechVision announced a $30M Series B round focused on expanding their enterprise sales capabilities and product development. The funding signals strong investor confidence and growth trajectory."
    },
    strategicIntegration: "The company is in rapid hiring mode, with the new VP of Sales mandated to build a world-class sales organization. They are actively evaluating modern sales tools to replace legacy systems with low adoption rates."
  },
  "3": {
    businessIntelligence: "Innovate Solutions provides cutting-edge marketing automation and customer engagement tools for mid-market companies. Known for their innovative approach to customer retention, they serve companies with 500-5000 employees seeking digital transformation.",
    recentNews: {
      title: "Digital Transformation Summit (Mar 2026)",
      description: "Innovate Solutions recently hosted a summit focused on marketing-sales alignment, drawing over 500 attendees from mid-market companies. This indicates strong thought leadership positioning."
    },
    strategicIntegration: "The company is actively consolidating from 3 separate marketing tools into a unified platform, creating a significant opportunity for comprehensive solution providers."
  }
};

// Default strategy for companies without specific content
export const defaultStrategy = {
  businessIntelligence: "This company represents a strategic target in our prospecting pipeline. Based on available data, they are actively evaluating solutions in our space and have shown significant engagement signals.",
  recentNews: {
    title: "Recent Market Activity (Q1 2026)",
    description: "This company has shown increased activity in our market segment, including website visits, content downloads, and engagement with industry events."
  },
  strategicIntegration: "Current intelligence suggests the company is in an evaluation phase, looking to modernize their technology stack and improve operational efficiency."
};
