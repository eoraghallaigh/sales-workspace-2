import { useState, useEffect, useCallback } from "react";
import { X, Plus, Trash2, Copy, Search, Check, Hash, Calendar, Type, ChevronDown, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Tag from "@/components/Tag";
import { prospectingCompanies } from "@/data/prospectingCompanies";
interface CreateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}
type Step = "settings" | "filters" | "columns";
type FilterType = "string" | "number" | "boolean" | "date" | "list";
interface FilterItem {
  id: string;
  name: string;
  category: string;
  icon: "checkbox" | "hash" | "calendar" | "text";
  type: FilterType;
  listOptions?: string[];
}
interface ActiveFilter {
  id: string;
  filterId: string;
  filterName: string;
  filterType: FilterType;
  condition: string;
  value: string;
  listValues?: string[];
  dateValue?: Date;
  listOptions?: string[];
}
interface FilterGroup {
  id: string;
  filters: ActiveFilter[];
}

// String conditions
const STRING_CONDITIONS = ["is equal to any of", "is not equal to any of", "contains exactly", "doesn't contain exactly", "is known", "is unknown"];

// Number conditions
const NUMBER_CONDITIONS = ["is equal to", "is not equal to", "is greater than", "is greater than or equal to", "is less than", "is less than or equal to"];

// List conditions
const LIST_CONDITIONS = ["is any of", "is none of", "is all of"];

// Date conditions
const DATE_CONDITIONS = ["is equal to", "is before", "is after", "is between", "is known", "is unknown"];

// Boolean conditions
const BOOLEAN_CONDITIONS = ["is true", "is false"];
const ALL_FILTERS: FilterItem[] = [{
  id: "abm-priority-score-apac",
  name: "ABM Priority Score [APAC]",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "about-us",
  name: "About us",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "account-coverage",
  name: "Account Coverage",
  category: "Account",
  icon: "text",
  type: "string"
}, {
  id: "account-group-subscription-status",
  name: "Account Group Subscription Status",
  category: "Account",
  icon: "text",
  type: "list",
  listOptions: ["Active", "Inactive", "Trial", "Expired", "Pending"]
}, {
  id: "account-group-territory",
  name: "Account Group Territory",
  category: "Account",
  icon: "text",
  type: "list",
  listOptions: ["APAC", "EMEA", "Americas", "LATAM", "ANZ"]
}, {
  id: "account-group-total-prospect-value-score-12-months",
  name: "Account Group Total Prospect Value Score 12 Months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "account-subscription-status",
  name: "Account Subscription Status",
  category: "Account",
  icon: "text",
  type: "list",
  listOptions: ["Active", "Inactive", "Trial", "Expired", "Pending"]
}, {
  id: "activity-type-xgeo-policy",
  name: "Activity Type xGeo Policy",
  category: "Activity",
  icon: "text",
  type: "list",
  listOptions: ["Inbound", "Outbound", "Mixed"]
}, {
  id: "adjusted-trust-rating",
  name: "Adjusted Trust Rating",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "affiliate-id",
  name: "Affiliate ID",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "annual-revenue",
  name: "Annual Revenue",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "annual-revenue-japac",
  name: "Annual Revenue (JAPAC enrichment - in US$)",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "annual-revenue-sot",
  name: "Annual Revenue (Source of Truth)",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "apac-abm-priority-score",
  name: "APAC: ABM Priority Score",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "apac-abmp-score-engagement",
  name: "APAC: ABMP Score (Engagement)",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "apac-abmp-score-fit",
  name: "APAC: ABMP Score (Fit)",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "apac-abmp-score-threshold",
  name: "APAC: ABMP Score (Threshold)",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "apac-ib-expansion-score",
  name: "APAC: IB Expansion Score",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "apac-ibe-score-engagement",
  name: "APAC: IBE Score (Engagement)",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "apac-ibe-score-fit",
  name: "APAC: IBE Score (Fit)",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "apac-ibe-score-threshold",
  name: "APAC: IBE Score (Threshold)",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "app-partner-flag",
  name: "App Partner Flag",
  category: "Partner",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "automated-company-creation-summary",
  name: "Automated Company Creation Summary",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "automated-company-creation-type",
  name: "Automated Company Creation Type",
  category: "Company Information",
  icon: "text",
  type: "list",
  listOptions: ["Manual", "Automated", "Enrichment", "Import"]
}, {
  id: "autoprospector-eligibility",
  name: "Autoprospector Eligibility",
  category: "Prospecting",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "bad-fit-reason",
  name: "Bad fit reason",
  category: "Qualification",
  icon: "text",
  type: "list",
  listOptions: ["Too small", "Wrong industry", "No budget", "Already customer", "Competitor"]
}, {
  id: "bad-fit-timestamp",
  name: "Bad fit timestamp",
  category: "Qualification",
  icon: "calendar",
  type: "date"
}, {
  id: "bdr-owner",
  name: "BDR Owner",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "bdr-target-account-last-updated",
  name: "BDR Target Account - Last Updated",
  category: "Ownership",
  icon: "calendar",
  type: "date"
}, {
  id: "bdr-workable",
  name: "BDR Workable",
  category: "Ownership",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "bdr-workable-assign-date",
  name: "BDR Workable Assign Date",
  category: "Ownership",
  icon: "calendar",
  type: "date"
}, {
  id: "bob-met-feedback",
  name: "BoB MET Feedback",
  category: "Feedback",
  icon: "text",
  type: "string"
}, {
  id: "bob-met-review",
  name: "BoB-MET Review",
  category: "Feedback",
  icon: "text",
  type: "string"
}, {
  id: "campaign-of-last-booking",
  name: "Campaign of last booking in meetings tool",
  category: "Activity",
  icon: "text",
  type: "string"
}, {
  id: "capacity-flooding-2026",
  name: "Capacity Flooding 2026",
  category: "Capacity",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "ceo-of-the-company",
  name: "CEO of the Company",
  category: "Contacts",
  icon: "text",
  type: "string"
}, {
  id: "city",
  name: "City",
  category: "Location",
  icon: "text",
  type: "string"
}, {
  id: "clay-lead-generation-presence",
  name: "Clay: Lead Generation Presence",
  category: "Enrichment",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "clay-recent-funding",
  name: "Clay: Recent Funding",
  category: "Enrichment",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "close-date",
  name: "Close date",
  category: "Deals",
  icon: "calendar",
  type: "date"
}, {
  id: "commerce-hub-platform-fee-custom-rate",
  name: "Commerce Hub Platform Fee Custom Rate",
  category: "Commerce",
  icon: "hash",
  type: "number"
}, {
  id: "commission-owner",
  name: "Commission Owner",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "company-creation-initiative",
  name: "Company Creation Initiative",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "company-domain-name",
  name: "Company domain name",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "company-fit-and-intent-tier",
  name: "Company Fit and Intent Tier",
  category: "Scores",
  icon: "text",
  type: "list",
  listOptions: ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Untiered"]
}, {
  id: "company-keywords",
  name: "Company Keywords",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "company-matched-duns-53",
  name: "Company Matched DUNS_53",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "company-name",
  name: "Company name",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "company-owner",
  name: "Company owner",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "company-scoops-news-date",
  name: "Company Scoops / News: Date",
  category: "Signals",
  icon: "calendar",
  type: "date"
}, {
  id: "company-scoops-news-details",
  name: "Company Scoops / News: Details",
  category: "Signals",
  icon: "text",
  type: "string"
}, {
  id: "company-scoops-news-type",
  name: "Company Scoops / News: Type",
  category: "Signals",
  icon: "text",
  type: "list",
  listOptions: ["Funding", "Acquisition", "New Product", "Leadership Change", "Expansion", "Partnership"]
}, {
  id: "company-unfit-reasons",
  name: "Company Unfit Reasons",
  category: "Qualification",
  icon: "text",
  type: "string"
}, {
  id: "company-workability",
  name: "Company Workability",
  category: "Qualification",
  icon: "text",
  type: "list",
  listOptions: ["Workable", "Not Workable", "Under Review"]
}, {
  id: "company-workability-reasons",
  name: "Company Workability Reasons",
  category: "Qualification",
  icon: "text",
  type: "string"
}, {
  id: "contact-enrichment-met",
  name: "Contact Enrichment MET",
  category: "Enrichment",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "contact-enrichment-met-date",
  name: "Contact Enrichment MET Date",
  category: "Enrichment",
  icon: "calendar",
  type: "date"
}, {
  id: "contact-has-completed-certification",
  name: "Contact has Completed Certification?",
  category: "Contacts",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "contacts-ai-discovery",
  name: "Contacts AI Discovery",
  category: "AI",
  icon: "text",
  type: "string"
}, {
  id: "contacts-currently-in-sequence-count",
  name: "Contacts currently in Sequence Count",
  category: "Contacts",
  icon: "hash",
  type: "number"
}, {
  id: "contacts-with-completed-certification",
  name: "Contacts with Completed Certification",
  category: "Contacts",
  icon: "hash",
  type: "number"
}, {
  id: "core-self-service-motion",
  name: "Core Self-Service Motion",
  category: "Motion",
  icon: "text",
  type: "list",
  listOptions: ["PLG", "Sales-Led", "Hybrid"]
}, {
  id: "count-of-associated-account-hierarchies",
  name: "Count of Associated Account Hierarchies",
  category: "Account",
  icon: "hash",
  type: "number"
}, {
  id: "country",
  name: "Country",
  category: "Location",
  icon: "text",
  type: "list",
  listOptions: ["United States", "United Kingdom", "Germany", "France", "Australia", "Canada", "Japan", "Singapore", "India", "Brazil"]
}, {
  id: "counts-towards-capacity",
  name: "Counts Towards Capacity",
  category: "Capacity",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "counts-towards-current-or-pending-capacity",
  name: "Counts Towards Current or Pending Capacity",
  category: "Capacity",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "counts-towards-systematic-capacity",
  name: "Counts towards Systematic Capacity",
  category: "Capacity",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "create-date",
  name: "Create date",
  category: "Dates",
  icon: "calendar",
  type: "date"
}, {
  id: "created-by-user-id",
  name: "Created by user ID",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "crm-system",
  name: "CRM System",
  category: "Tech Stack",
  icon: "text",
  type: "list",
  listOptions: ["Salesforce", "HubSpot", "Zoho", "Pipedrive", "Microsoft Dynamics", "Other", "None"]
}, {
  id: "crp-large-accounts-tier",
  name: "CRP Large Accounts Tier",
  category: "CRP",
  icon: "text",
  type: "list",
  listOptions: ["Tier 1", "Tier 2", "Tier 3"]
}, {
  id: "crp-completed-reference-company",
  name: "crp_completed_reference_company",
  category: "CRP",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "crp-opted-in-company",
  name: "crp_opted_in_company",
  category: "CRP",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "crp-reference-ready-company",
  name: "crp_reference_ready_company",
  category: "CRP",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "csm-sentiment",
  name: "CSM Sentiment",
  category: "Customer Success",
  icon: "text",
  type: "list",
  listOptions: ["Very Positive", "Positive", "Neutral", "Negative", "Very Negative"]
}, {
  id: "current-crm-renewal-date",
  name: "Current CRM Renewal Date",
  category: "Tech Stack",
  icon: "calendar",
  type: "date"
}, {
  id: "current-sales-automation-system-me",
  name: "Current Sales Automation System (ME)",
  category: "Tech Stack",
  icon: "text",
  type: "string"
}, {
  id: "current-sales-automation-system-renewal-date-me",
  name: "Current Sales Automation System Renewal Date (ME)",
  category: "Tech Stack",
  icon: "calendar",
  type: "date"
}, {
  id: "current-service-desk-system-me",
  name: "Current Service Desk System (ME)",
  category: "Tech Stack",
  icon: "text",
  type: "string"
}, {
  id: "current-service-desk-system-renewal-date-me",
  name: "Current Service Desk System Renewal Date (ME)",
  category: "Tech Stack",
  icon: "calendar",
  type: "date"
}, {
  id: "current-trigger-date",
  name: "Current Trigger Date",
  category: "Triggers",
  icon: "calendar",
  type: "date"
}, {
  id: "currently-enrolled-in-sales-assist-automation",
  name: "Currently Enrolled in Sales Assist Automation",
  category: "Automation",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "data-completeness-rating",
  name: "Data Completeness Rating",
  category: "Data Quality",
  icon: "text",
  type: "list",
  listOptions: ["Complete", "Partial", "Incomplete"]
}, {
  id: "date-confirmed-xgeo-policy",
  name: "Date Confirmed xGeo Policy",
  category: "Dates",
  icon: "calendar",
  type: "date"
}, {
  id: "date-first-deal-created",
  name: "Date First Deal Created",
  category: "Deals",
  icon: "calendar",
  type: "date"
}, {
  id: "date-of-last-meeting-booked",
  name: "Date of last meeting booked in meetings tool",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "date-updated-predicted-service-edition-change",
  name: "Date Updated Predicted Service Edition Change",
  category: "Predictions",
  icon: "calendar",
  type: "date"
}, {
  id: "days-remaining-in-first-60-days",
  name: "Days Remaining in First 60 Days",
  category: "Dates",
  icon: "hash",
  type: "number"
}, {
  id: "db-predicted-next-tech-purchase",
  name: "DB: Predicted Next Tech Purchase",
  category: "Predictions",
  icon: "text",
  type: "string"
}, {
  id: "db-predicted-next-tech-purchase-quarter",
  name: "DB: Predicted Next Tech Purchase Quarter",
  category: "Predictions",
  icon: "text",
  type: "list",
  listOptions: ["Q1", "Q2", "Q3", "Q4"]
}, {
  id: "description",
  name: "Description",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "dismissed-by-user-ids",
  name: "Dismissed by User IDs",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "do-not-consolidate",
  name: "Do not consolidate",
  category: "System",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "domain-capacity-score-for-account-group",
  name: "Domain Capacity Score for Account Group",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "domain-junk-score",
  name: "Domain Junk Score",
  category: "Data Quality",
  icon: "hash",
  type: "number"
}, {
  id: "domain-status-last-updated",
  name: "Domain Status Last Updated",
  category: "Dates",
  icon: "calendar",
  type: "date"
}, {
  id: "domain-type",
  name: "Domain Type",
  category: "Company Information",
  icon: "text",
  type: "list",
  listOptions: ["Corporate", "Personal", "Education", "Government", "Unknown"]
}, {
  id: "domestic-ultimate-duns-53",
  name: "Domestic Ultimate DUNS_53",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "earliest-high-ppf-task-due-date",
  name: "Earliest High PPF Task Due Date",
  category: "Tasks",
  icon: "calendar",
  type: "date"
}, {
  id: "earliest-p-task-due-date",
  name: "Earliest P-Task Due Date",
  category: "Tasks",
  icon: "calendar",
  type: "date"
}, {
  id: "earliest-ppf-task-due-date",
  name: "Earliest PPF Task Due Date",
  category: "Tasks",
  icon: "calendar",
  type: "date"
}, {
  id: "eligible-for-auto-capacity",
  name: "Eligible For Auto Capacity",
  category: "Capacity",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "eligible-for-trust-rating",
  name: "Eligible for Trust Rating",
  category: "Scores",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "employee-range",
  name: "Employee Range",
  category: "Company Information",
  icon: "text",
  type: "list",
  listOptions: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"]
}, {
  id: "employees-in-sales",
  name: "Employees in Sales",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "employees-in-support",
  name: "Employees in Support",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "enrichment-carve-territory",
  name: "Enrichment Carve Territory",
  category: "Enrichment",
  icon: "text",
  type: "string"
}, {
  id: "executive-sponsor",
  name: "Executive Sponsor",
  category: "Contacts",
  icon: "text",
  type: "string"
}, {
  id: "exempt-from-carve",
  name: "Exempt from Carve",
  category: "Territory",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "expected-billing-geography-xgeo-policy",
  name: "Expected Billing Geography xGeo Policy",
  category: "Territory",
  icon: "text",
  type: "string"
}, {
  id: "first-contact-create-date",
  name: "First contact create date",
  category: "Contacts",
  icon: "calendar",
  type: "date"
}, {
  id: "first-deal-created-date",
  name: "First deal created date",
  category: "Deals",
  icon: "calendar",
  type: "date"
}, {
  id: "first-marketing-free-signup-date",
  name: "First Marketing Free Signup Date",
  category: "Marketing",
  icon: "calendar",
  type: "date"
}, {
  id: "first-purchase-date",
  name: "First Purchase Date",
  category: "Commerce",
  icon: "calendar",
  type: "date"
}, {
  id: "fiscal-month",
  name: "Fiscal Month",
  category: "Dates",
  icon: "text",
  type: "list",
  listOptions: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
}, {
  id: "flywheel-last-activity-date",
  name: "Flywheel Last Activity Date",
  category: "Flywheel",
  icon: "calendar",
  type: "date"
}, {
  id: "flywheel-last-activity-engagement-id",
  name: "Flywheel Last Activity Engagement ID",
  category: "Flywheel",
  icon: "text",
  type: "string"
}, {
  id: "flywheel-last-activity-owner",
  name: "Flywheel Last Activity Owner",
  category: "Flywheel",
  icon: "text",
  type: "string"
}, {
  id: "flywheel-last-activity-owner-role",
  name: "Flywheel Last Activity Owner Role",
  category: "Flywheel",
  icon: "text",
  type: "list",
  listOptions: ["BDR", "SDR", "AE", "CSM", "Manager"]
}, {
  id: "flywheel-last-activity-preview",
  name: "Flywheel Last Activity Preview",
  category: "Flywheel",
  icon: "text",
  type: "string"
}, {
  id: "flywheel-last-activity-type",
  name: "Flywheel Last Activity Type",
  category: "Flywheel",
  icon: "text",
  type: "list",
  listOptions: ["Call", "Email", "Meeting", "Note", "Task"]
}, {
  id: "flywheel-next-activity-date",
  name: "Flywheel Next Activity Date",
  category: "Flywheel",
  icon: "calendar",
  type: "date"
}, {
  id: "flywheel-next-activity-engagement-id",
  name: "Flywheel Next Activity Engagement ID",
  category: "Flywheel",
  icon: "text",
  type: "string"
}, {
  id: "flywheel-next-activity-owner",
  name: "Flywheel Next Activity Owner",
  category: "Flywheel",
  icon: "text",
  type: "string"
}, {
  id: "flywheel-next-activity-owner-role",
  name: "Flywheel Next Activity Owner Role",
  category: "Flywheel",
  icon: "text",
  type: "list",
  listOptions: ["BDR", "SDR", "AE", "CSM", "Manager"]
}, {
  id: "flywheel-next-activity-preview",
  name: "Flywheel Next Activity Preview",
  category: "Flywheel",
  icon: "text",
  type: "string"
}, {
  id: "flywheel-next-activity-type",
  name: "Flywheel Next Activity Type",
  category: "Flywheel",
  icon: "text",
  type: "list",
  listOptions: ["Call", "Email", "Meeting", "Note", "Task"]
}, {
  id: "global-ultimate-duns",
  name: "Global Ultimate DUNS",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "grow-anz-invite-sent",
  name: "Grow ANZ Invite Sent",
  category: "Programs",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "grow-association",
  name: "GROW Association",
  category: "Programs",
  icon: "text",
  type: "string"
}, {
  id: "grow-europe-invite-sent",
  name: "Grow Europe Invite Sent",
  category: "Programs",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "has-active-shared-deal",
  name: "Has Active Shared Deal",
  category: "Deals",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "has-been-enriched",
  name: "Has been enriched",
  category: "Enrichment",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "has-pending-task",
  name: "Has Pending Task",
  category: "Tasks",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "has-recent-capacity-effecting-ql",
  name: "Has Recent Capacity Effecting QL",
  category: "Capacity",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "has-recent-conversion",
  name: "Has Recent Conversion",
  category: "Conversion",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "headquater-duns",
  name: "Headquater DUNS",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "high-asp",
  name: "High ASP",
  category: "Scores",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "high-value-domain-mm-usa",
  name: "High Value Domain (MM USA)",
  category: "Scores",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "hsfs-customer",
  name: "HSFS Customer",
  category: "Customer",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "hub-products-summary",
  name: "Hub Products Summary",
  category: "Products",
  icon: "text",
  type: "string"
}, {
  id: "hubs-with-dedicated-ip",
  name: "Hubs With Dedicated IP",
  category: "Products",
  icon: "text",
  type: "string"
}, {
  id: "hubspot-academy-lab",
  name: "HubSpot Academy Lab",
  category: "Programs",
  icon: "text",
  type: "string"
}, {
  id: "hubspot-academy-lab-invite-sent",
  name: "Hubspot Academy Lab Invite Sent",
  category: "Programs",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "hubspot-team",
  name: "HubSpot team",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "ib-expansion-score-apac",
  name: "IB Expansion Score [APAC]",
  category: "APAC Scores",
  icon: "hash",
  type: "number"
}, {
  id: "ib-outreach-suggested-positioning",
  name: "IB Outreach Suggested Positioning",
  category: "Outreach",
  icon: "text",
  type: "string"
}, {
  id: "in-dev-micro-audience-campaign-is-on",
  name: "IN DEV Micro Audience Campaign is On",
  category: "Campaigns",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "inbound-invite-sent",
  name: "INBOUND Invite Sent",
  category: "Programs",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "incumbent-crm-context",
  name: "Incumbent CRM: Context",
  category: "Tech Stack",
  icon: "text",
  type: "string"
}, {
  id: "incumbent-crm-contract-expiration-date",
  name: "Incumbent CRM: Contract Expiration Date",
  category: "Tech Stack",
  icon: "calendar",
  type: "date"
}, {
  id: "incumbent-crm-system",
  name: "Incumbent CRM: System",
  category: "Tech Stack",
  icon: "text",
  type: "list",
  listOptions: ["Salesforce", "HubSpot", "Zoho", "Pipedrive", "Microsoft Dynamics", "Other", "None"]
}, {
  id: "industry-breeze-intelligence",
  name: "Industry (Breeze Intelligence)",
  category: "Company Information",
  icon: "text",
  type: "list",
  listOptions: ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Education", "Real Estate", "Media", "Professional Services", "Other"]
}, {
  id: "industry-manual-entry",
  name: "Industry (Manual Entry)",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "industry-group",
  name: "Industry group",
  category: "Company Information",
  icon: "text",
  type: "list",
  listOptions: ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Education", "Real Estate", "Media", "Professional Services", "Other"]
}, {
  id: "install-base-owner",
  name: "Install Base Owner",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "install-base-staging-territory",
  name: "Install Base Staging Territory",
  category: "Territory",
  icon: "text",
  type: "string"
}, {
  id: "is-eligible-to-source",
  name: "Is Eligible to Source",
  category: "Sourcing",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "is-public",
  name: "Is public",
  category: "Company Information",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "key-company-feature",
  name: "Key Company Feature",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "last-activity-date",
  name: "Last activity date",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "last-booked-meeting-date",
  name: "Last Booked Meeting Date",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "last-contacted",
  name: "Last contacted",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "last-contacted-by-sales-rep-bdr-and-sdr",
  name: "Last Contacted By Sales Rep, BDR, and SDR",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "last-engagement-date",
  name: "Last Engagement Date",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "last-logged-call-date",
  name: "Last Logged Call Date",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "last-open-task-date",
  name: "Last Open Task Date",
  category: "Tasks",
  icon: "calendar",
  type: "date"
}, {
  id: "last-reengage-signal-date",
  name: "Last Reengage Signal Date",
  category: "Signals",
  icon: "calendar",
  type: "date"
}, {
  id: "latest-revmarketing-automation-date",
  name: "Latest RevMarketing Automation Date",
  category: "Marketing",
  icon: "calendar",
  type: "date"
}, {
  id: "latest-revmarketing-lead-date",
  name: "Latest RevMarketing Lead Date",
  category: "Marketing",
  icon: "calendar",
  type: "date"
}, {
  id: "latest-traffic-source",
  name: "Latest Traffic Source",
  category: "Traffic",
  icon: "text",
  type: "string"
}, {
  id: "latest-traffic-source-data-1",
  name: "Latest Traffic Source Data 1",
  category: "Traffic",
  icon: "text",
  type: "string"
}, {
  id: "latest-traffic-source-data-2",
  name: "Latest Traffic Source Data 2",
  category: "Traffic",
  icon: "text",
  type: "string"
}, {
  id: "latest-traffic-source-timestamp",
  name: "Latest Traffic Source Timestamp",
  category: "Traffic",
  icon: "calendar",
  type: "date"
}, {
  id: "lead-status",
  name: "Lead status",
  category: "Qualification",
  icon: "text",
  type: "list",
  listOptions: ["New", "Open", "In Progress", "Qualified", "Unqualified", "Attempted to Contact", "Connected", "Bad Timing"]
}, {
  id: "lifecycle-stage",
  name: "Lifecycle stage",
  category: "Qualification",
  icon: "text",
  type: "list",
  listOptions: ["Subscriber", "Lead", "MQL", "SQL", "Opportunity", "Customer", "Evangelist", "Other"]
}, {
  id: "lighthouse-bucketed-industry",
  name: "Lighthouse - Bucketed Industry",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "lighthouse-tracking",
  name: "Lighthouse Tracking",
  category: "Tracking",
  icon: "text",
  type: "string"
}, {
  id: "likelihood-to-close",
  name: "Likelihood to close",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "linkedin-handle",
  name: "Linkedin handle",
  category: "Social",
  icon: "text",
  type: "string"
}, {
  id: "loa-rep",
  name: "LOA Rep",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "logo-url",
  name: "Logo URL",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "lost-deal-opportunities",
  name: "Lost Deal Opportunities",
  category: "Deals",
  icon: "hash",
  type: "number"
}, {
  id: "lost-deal-reasons",
  name: "Lost Deal Reasons",
  category: "Deals",
  icon: "text",
  type: "list",
  listOptions: ["Price", "Competitor", "Timing", "No Decision", "Feature Gap", "Budget", "Other"]
}, {
  id: "low-pro-model-score",
  name: "Low Pro Model Score",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "marked-as-bad-fit-by",
  name: "Marked as bad fit by",
  category: "Qualification",
  icon: "text",
  type: "string"
}, {
  id: "marketing-hub-co-sell-partners",
  name: "Marketing Hub Co-Sell Partners",
  category: "Partner",
  icon: "text",
  type: "string"
}, {
  id: "marketing-usage-score",
  name: "Marketing Usage Score",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "medium-of-last-booking",
  name: "Medium of last booking in meetings tool",
  category: "Activity",
  icon: "text",
  type: "string"
}, {
  id: "merged-company-ids",
  name: "Merged Company IDs",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "mnda-completion-status",
  name: "MNDA Completion Status",
  category: "Legal",
  icon: "text",
  type: "list",
  listOptions: ["Not Started", "In Progress", "Completed", "Expired"]
}, {
  id: "mnda-completion-timestamp",
  name: "MNDA Completion Timestamp",
  category: "Legal",
  icon: "calendar",
  type: "date"
}, {
  id: "most-recent-academy-signup-date",
  name: "Most Recent Academy Signup Date",
  category: "Programs",
  icon: "calendar",
  type: "date"
}, {
  id: "most-recent-code-book-a-meeting-date",
  name: "Most Recent Code Book A Meeting Date",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "most-recent-crm-signup-date",
  name: "Most Recent CRM Signup Date",
  category: "Products",
  icon: "calendar",
  type: "date"
}, {
  id: "most-recent-pricing-page-viewed",
  name: "Most Recent Pricing Page Viewed",
  category: "Traffic",
  icon: "calendar",
  type: "date"
}, {
  id: "most-recent-sales-free-signup-date",
  name: "Most Recent Sales Free Signup Date",
  category: "Products",
  icon: "calendar",
  type: "date"
}, {
  id: "most-recent-upm-auto-campaign-name",
  name: "Most Recent UPM-Auto Campaign Name",
  category: "Campaigns",
  icon: "text",
  type: "string"
}, {
  id: "most-recent-visit",
  name: "Most Recent Visit",
  category: "Traffic",
  icon: "calendar",
  type: "date"
}, {
  id: "mrr-of-all-active-customer-subscriptions",
  name: "MRR of all Active Customer Subscriptions",
  category: "Revenue",
  icon: "hash",
  type: "number"
}, {
  id: "mso-starter-propensity-score",
  name: "MSO: Starter Propensity Score",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "named-csm-assigned-to-account",
  name: "Named CSM Assigned to Account?",
  category: "Customer Success",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "next-activity-date",
  name: "Next activity date",
  category: "Activity",
  icon: "calendar",
  type: "date"
}, {
  id: "next-best-product-to-sell",
  name: "Next Best Product to Sell",
  category: "Products",
  icon: "text",
  type: "list",
  listOptions: ["Marketing Hub", "Sales Hub", "Service Hub", "CMS Hub", "Operations Hub"]
}, {
  id: "number-of-associated-contacts",
  name: "Number of associated contacts",
  category: "Contacts",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-associated-deals",
  name: "Number of Associated Deals",
  category: "Deals",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-calls-since-ppf-assignment",
  name: "Number of Calls since PPF Assignment",
  category: "Activity",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-child-companies",
  name: "Number of child companies",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-contacts-engaged-in-last-60-days",
  name: "Number of Contacts Engaged in Last 60 Days",
  category: "Contacts",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-contacts-engaged-in-last-90-days",
  name: "Number of Contacts Engaged in Last 90 Days",
  category: "Contacts",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-employees",
  name: "Number of employees",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-lookalikes",
  name: "Number of Lookalikes",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-open-additional-url-opps",
  name: "Number of Open Additional URL Opps",
  category: "Deals",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-open-deals",
  name: "Number of open deals",
  category: "Deals",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-open-p-tasks",
  name: "Number of Open P-Tasks",
  category: "Tasks",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-overdue-open-p-tasks",
  name: "Number of Overdue Open P-Tasks",
  category: "Tasks",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-times-contacted",
  name: "Number of times contacted",
  category: "Activity",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-touches-in-last-60-days",
  name: "Number of Touches in Last 60 Days",
  category: "Activity",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-touches-in-last-90-days",
  name: "Number of Touches in Last 90 Days",
  category: "Activity",
  icon: "hash",
  type: "number"
}, {
  id: "number-of-touches-since-ppf-assignment",
  name: "Number of Touches since PPF Assignment",
  category: "Activity",
  icon: "hash",
  type: "number"
}, {
  id: "open-risk-alerts",
  name: "Open Risk Alerts",
  category: "Risk",
  icon: "hash",
  type: "number"
}, {
  id: "original-company-id",
  name: "Original Company Id",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "owner-assigned-date",
  name: "Owner assigned date",
  category: "Ownership",
  icon: "calendar",
  type: "date"
}, {
  id: "p2-p4-rank",
  name: "P2 & P4 Rank",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "page-rank",
  name: "Page Rank",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "parent-company",
  name: "Parent company",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "parent-duns",
  name: "Parent DUNS",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "partner-account-id",
  name: "Partner Account ID",
  category: "Partner",
  icon: "text",
  type: "string"
}, {
  id: "partner-account-name",
  name: "Partner Account Name",
  category: "Partner",
  icon: "text",
  type: "string"
}, {
  id: "partner-acquisition-fit",
  name: "Partner Acquisition Fit",
  category: "Partner",
  icon: "text",
  type: "list",
  listOptions: ["High", "Medium", "Low"]
}, {
  id: "partner-acquisition-fit-last-set-date",
  name: "Partner Acquisition Fit Last Set Date",
  category: "Partner",
  icon: "calendar",
  type: "date"
}, {
  id: "partner-program-status",
  name: "Partner Program Status",
  category: "Partner",
  icon: "text",
  type: "list",
  listOptions: ["Active", "Inactive", "Pending", "Expired"]
}, {
  id: "partner-registration-expiration-date",
  name: "Partner Registration Expiration Date",
  category: "Partner",
  icon: "calendar",
  type: "date"
}, {
  id: "partner-registration-partner-account-link",
  name: "Partner Registration Partner Account Link",
  category: "Partner",
  icon: "text",
  type: "string"
}, {
  id: "partner-registration-partner-account-name",
  name: "Partner Registration Partner Account Name",
  category: "Partner",
  icon: "text",
  type: "string"
}, {
  id: "partner-registration-registration-date",
  name: "Partner Registration Registration Date",
  category: "Partner",
  icon: "calendar",
  type: "date"
}, {
  id: "partner-specialist-owner",
  name: "Partner Specialist Owner",
  category: "Partner",
  icon: "text",
  type: "string"
}, {
  id: "partner-training-purchased-date",
  name: "Partner Training Purchased Date",
  category: "Partner",
  icon: "calendar",
  type: "date"
}, {
  id: "partner-type",
  name: "Partner Type",
  category: "Partner",
  icon: "text",
  type: "list",
  listOptions: ["Solutions Partner", "Agency Partner", "Technology Partner", "Affiliate"]
}, {
  id: "pep-involvement-in-pe-program",
  name: "PEP - Involvement in PE program",
  category: "Private Equity",
  icon: "text",
  type: "string"
}, {
  id: "pep-part-of-pe-pilot",
  name: "PEP - Part of PE Pilot?",
  category: "Private Equity",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "pep-private-equity-firm-name",
  name: "PEP - Private Equity Firm Name",
  category: "Private Equity",
  icon: "text",
  type: "string"
}, {
  id: "pep-private-equity-firm-preferred-partner",
  name: "PEP - Private Equity Firm Preferred Partner",
  category: "Private Equity",
  icon: "text",
  type: "string"
}, {
  id: "pep-private-equity-firm-relationship",
  name: "PEP - Private Equity Firm Relationship",
  category: "Private Equity",
  icon: "text",
  type: "list",
  listOptions: ["Portfolio Company", "Investor", "Strategic Partner"]
}, {
  id: "pep-type-of-company",
  name: "PEP - Type of Company",
  category: "Private Equity",
  icon: "text",
  type: "list",
  listOptions: ["PE Firm", "Portfolio Company", "VC Backed", "Not PE Related"]
}, {
  id: "pit-new-release-date",
  name: "PIT - New Release Date",
  category: "Dates",
  icon: "calendar",
  type: "date"
}, {
  id: "portal-usage-score",
  name: "Portal Usage Score",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "postal-code",
  name: "Postal Code",
  category: "Location",
  icon: "text",
  type: "string"
}, {
  id: "ppf-assignment-timestamp",
  name: "PPF Assignment Timestamp",
  category: "PPF",
  icon: "calendar",
  type: "date"
}, {
  id: "ppf-sla-due-date",
  name: "PPF SLA Due Date",
  category: "PPF",
  icon: "calendar",
  type: "date"
}, {
  id: "pre-outreach-internal-alignment",
  name: "Pre-Outreach: Internal Alignment",
  category: "Outreach",
  icon: "text",
  type: "string"
}, {
  id: "predicted-content-edition-change",
  name: "Predicted Content Edition Change",
  category: "Predictions",
  icon: "text",
  type: "list",
  listOptions: ["Upgrade", "Downgrade", "No Change"]
}, {
  id: "predicted-credits-limit-explanation",
  name: "Predicted Credits Limit Explanation",
  category: "Predictions",
  icon: "text",
  type: "string"
}, {
  id: "predicted-cross-sell-explanation",
  name: "Predicted Cross Sell Explanation",
  category: "Predictions",
  icon: "text",
  type: "string"
}, {
  id: "predicted-customer-agent-explanation",
  name: "Predicted Customer Agent Explanation",
  category: "Predictions",
  icon: "text",
  type: "string"
}, {
  id: "predicted-marketing-edition-change",
  name: "Predicted Marketing Edition Change",
  category: "Predictions",
  icon: "text",
  type: "list",
  listOptions: ["Upgrade", "Downgrade", "No Change"]
}, {
  id: "predicted-operations-edition-change",
  name: "Predicted Operations Edition Change",
  category: "Predictions",
  icon: "text",
  type: "list",
  listOptions: ["Upgrade", "Downgrade", "No Change"]
}, {
  id: "predicted-opportunity-explanation",
  name: "Predicted Opportunity Explanation",
  category: "Predictions",
  icon: "text",
  type: "string"
}, {
  id: "predicted-prospecting-agent-explanation",
  name: "Predicted Prospecting Agent Explanation",
  category: "Predictions",
  icon: "text",
  type: "string"
}, {
  id: "predicted-renewal-explanation",
  name: "Predicted Renewal Explanation",
  category: "Predictions",
  icon: "text",
  type: "string"
}, {
  id: "predicted-sales-edition-change",
  name: "Predicted Sales Edition Change",
  category: "Predictions",
  icon: "text",
  type: "list",
  listOptions: ["Upgrade", "Downgrade", "No Change"]
}, {
  id: "predicted-service-edition-change",
  name: "Predicted Service Edition Change",
  category: "Predictions",
  icon: "text",
  type: "list",
  listOptions: ["Upgrade", "Downgrade", "No Change"]
}, {
  id: "predicted-upgrade-explanation",
  name: "Predicted Upgrade Explanation",
  category: "Predictions",
  icon: "text",
  type: "string"
}, {
  id: "presales-solutions-architect-assigned-date",
  name: "PreSales Solutions Architect Assigned Date",
  category: "PreSales",
  icon: "calendar",
  type: "date"
}, {
  id: "presales-solutions-architect-owner",
  name: "PreSales Solutions Architect Owner",
  category: "PreSales",
  icon: "text",
  type: "string"
}, {
  id: "presales-solutions-engineer-assigned-date",
  name: "PreSales Solutions Engineer Assigned Date",
  category: "PreSales",
  icon: "calendar",
  type: "date"
}, {
  id: "presales-solutions-engineer-owner",
  name: "PreSales Solutions Engineer Owner",
  category: "PreSales",
  icon: "text",
  type: "string"
}, {
  id: "priority-number-of-touches",
  name: "Priority Number of Touches",
  category: "Activity",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score",
  name: "Prospect value score",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-12-months",
  name: "Prospect Value Score 12 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-18-months",
  name: "Prospect Value Score 18 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-3-months",
  name: "Prospect Value Score 3 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-6-months",
  name: "Prospect Value Score 6 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-conversion-probability-12-months",
  name: "Prospect Value Score Conversion Probability 12 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-conversion-probability-18-months",
  name: "Prospect Value Score Conversion Probability 18 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-conversion-probability-3-months",
  name: "Prospect Value Score Conversion Probability 3 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-conversion-probability-6-months",
  name: "Prospect Value Score Conversion Probability 6 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-explanation-12-months",
  name: "Prospect Value Score Explanation 12 months",
  category: "Scores",
  icon: "text",
  type: "string"
}, {
  id: "prospect-value-score-explanation-18-months",
  name: "Prospect Value Score Explanation 18 months",
  category: "Scores",
  icon: "text",
  type: "string"
}, {
  id: "prospect-value-score-explanation-3-months",
  name: "Prospect Value Score Explanation 3 months",
  category: "Scores",
  icon: "text",
  type: "string"
}, {
  id: "prospect-value-score-explanation-6-months",
  name: "Prospect Value Score Explanation 6 months",
  category: "Scores",
  icon: "text",
  type: "string"
}, {
  id: "prospect-value-score-predicted-mrr-12-months",
  name: "Prospect Value Score Predicted MRR 12 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-predicted-mrr-18-months",
  name: "Prospect Value Score Predicted MRR 18 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-predicted-mrr-3-months",
  name: "Prospect Value Score Predicted MRR 3 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospect-value-score-predicted-mrr-6-months",
  name: "Prospect Value Score Predicted MRR 6 months",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "prospecting-hidden-state",
  name: "Prospecting Hidden State",
  category: "Prospecting",
  icon: "text",
  type: "string"
}, {
  id: "prospecting-manually-marked-as-worked",
  name: "Prospecting Manually Marked As Worked",
  category: "Prospecting",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "pvs-bucket",
  name: "PVS Bucket",
  category: "Scores",
  icon: "text",
  type: "list",
  listOptions: ["High", "Medium", "Low", "Very Low"]
}, {
  id: "quick-context",
  name: "Quick context",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "rate-last-updated-date",
  name: "Rate Last Updated Date",
  category: "Dates",
  icon: "calendar",
  type: "date"
}, {
  id: "rating",
  name: "Rating",
  category: "Scores",
  icon: "text",
  type: "list",
  listOptions: ["A", "B", "C", "D", "F"]
}, {
  id: "rating-last-updated-date",
  name: "Rating Last Updated Date",
  category: "Dates",
  icon: "calendar",
  type: "date"
}, {
  id: "raw-trust-rating",
  name: "Raw Trust Rating",
  category: "Scores",
  icon: "text",
  type: "string"
}, {
  id: "raw-trust-score",
  name: "Raw Trust Score",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "recent-ads-pql-conversion-date-bet",
  name: "Recent Ads PQL Conversion Date (BET)",
  category: "Marketing",
  icon: "calendar",
  type: "date"
}, {
  id: "recent-deal-amount",
  name: "Recent deal amount",
  category: "Deals",
  icon: "hash",
  type: "number"
}, {
  id: "recent-deal-close-date",
  name: "Recent deal close date",
  category: "Deals",
  icon: "calendar",
  type: "date"
}, {
  id: "recent-high-value-trigger-date",
  name: "Recent High Value Trigger Date",
  category: "Triggers",
  icon: "calendar",
  type: "date"
}, {
  id: "recent-low-medium-value-trigger-date",
  name: "Recent Low/Medium Value Trigger Date",
  category: "Triggers",
  icon: "calendar",
  type: "date"
}, {
  id: "recent-non-ql-date",
  name: "Recent Non-QL Date",
  category: "Qualification",
  icon: "calendar",
  type: "date"
}, {
  id: "record-source-detail-1",
  name: "Record source detail 1",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "record-source-detail-2",
  name: "Record source detail 2",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "record-source-detail-3",
  name: "Record source detail 3",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "reengage-explanation",
  name: "Reengage Explanation",
  category: "Signals",
  icon: "text",
  type: "string"
}, {
  id: "reengage-signal",
  name: "Reengage Signal",
  category: "Signals",
  icon: "text",
  type: "list",
  listOptions: ["Website Visit", "Email Open", "Content Download", "Event Registration", "Other"]
}, {
  id: "rep-on-loa",
  name: "Rep on LOA",
  category: "Ownership",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "revenue-range-source-of-truth",
  name: "Revenue Range (Source of Truth)",
  category: "Company Information",
  icon: "text",
  type: "list",
  listOptions: ["$0-1M", "$1M-10M", "$10M-50M", "$50M-100M", "$100M-500M", "$500M-1B", "$1B+"]
}, {
  id: "revmarketing-lead",
  name: "RevMarketing Lead",
  category: "Marketing",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "sales-assist-eligible",
  name: "Sales Assist Eligible",
  category: "Automation",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "sales-hub-co-sell-partners",
  name: "Sales Hub Co-Sell Partners",
  category: "Partner",
  icon: "text",
  type: "string"
}, {
  id: "sales-usage-score",
  name: "Sales Usage Score",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "scaled-selling-meeting-rotator",
  name: "Scaled Selling Meeting Rotator",
  category: "Activity",
  icon: "text",
  type: "string"
}, {
  id: "sdr-owner",
  name: "SDR Owner",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "self-service-reason",
  name: "Self Service Reason",
  category: "Motion",
  icon: "text",
  type: "string"
}, {
  id: "service-hub-co-sell-partners",
  name: "Service Hub Co-Sell Partners",
  category: "Partner",
  icon: "text",
  type: "string"
}, {
  id: "service-usage-score",
  name: "Service Usage Score",
  category: "Scores",
  icon: "hash",
  type: "number"
}, {
  id: "shared-teams",
  name: "Shared teams",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "shared-users",
  name: "Shared users",
  category: "Ownership",
  icon: "text",
  type: "string"
}, {
  id: "social-media-ai-discovery",
  name: "Social Media AI Discovery",
  category: "AI",
  icon: "text",
  type: "string"
}, {
  id: "source-of-last-booking",
  name: "Source of last booking in meetings tool",
  category: "Activity",
  icon: "text",
  type: "string"
}, {
  id: "sourcing-eligibility-event-date",
  name: "Sourcing Eligibility Event Date",
  category: "Sourcing",
  icon: "calendar",
  type: "date"
}, {
  id: "sourcing-view-hidden-count",
  name: "Sourcing View Hidden Count",
  category: "Sourcing",
  icon: "hash",
  type: "number"
}, {
  id: "spotlight-event-association",
  name: "Spotlight Event Association",
  category: "Events",
  icon: "text",
  type: "string"
}, {
  id: "staging-account-group",
  name: "Staging Account Group",
  category: "Account",
  icon: "text",
  type: "string"
}, {
  id: "staging-account-group-updated-date",
  name: "Staging Account Group Updated Date",
  category: "Account",
  icon: "calendar",
  type: "date"
}, {
  id: "state-region",
  name: "State/Region",
  category: "Location",
  icon: "text",
  type: "string"
}, {
  id: "state-region-code",
  name: "State/Region Code",
  category: "Location",
  icon: "text",
  type: "string"
}, {
  id: "status",
  name: "Status",
  category: "Qualification",
  icon: "text",
  type: "list",
  listOptions: ["Active", "Inactive", "Churned", "Prospect"]
}, {
  id: "strategic-sales-account",
  name: "Strategic Sales Account",
  category: "Account",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "street-address",
  name: "Street address",
  category: "Location",
  icon: "text",
  type: "string"
}, {
  id: "street-address-2",
  name: "Street address 2",
  category: "Location",
  icon: "text",
  type: "string"
}, {
  id: "system-property-company-contacts-activity-summary",
  name: "System property - Company Contacts Activity Summary",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "system-property-company-re-selling-recommendations",
  name: "System property - Company Re-Selling Recommendations",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "system-property-domain-summary-enhanced-with-example-won-deals",
  name: "System property - Domain Summary Enhanced with Example Won Deals",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "system-property-html-summary",
  name: "System property - HTML Summary",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "system-property-most-engaged-contacts-on-deals",
  name: "System property - Most Engaged Contacts on Deals",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "system-property-previous-ql-history-summary",
  name: "System property - Previous QL History Summary",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "system-property-summary-of-closed-lost-deals",
  name: "System property - Summary of Closed Lost Deals",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "target-account-type",
  name: "Target Account Type",
  category: "Account",
  icon: "text",
  type: "list",
  listOptions: ["Enterprise", "Mid-Market", "SMB", "Startup"]
}, {
  id: "tech-stack-manual-entry",
  name: "Tech Stack (Manual Entry)",
  category: "Tech Stack",
  icon: "text",
  type: "string"
}, {
  id: "temp-property-3",
  name: "Temp Property #3",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "temp-property-5",
  name: "Temp Property 5",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "temp-property-6",
  name: "Temp Property 6",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "temp-property-7",
  name: "Temp Property 7",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "time-zone",
  name: "Time zone",
  category: "Location",
  icon: "text",
  type: "list",
  listOptions: ["UTC-12", "UTC-11", "UTC-10", "UTC-9", "UTC-8", "UTC-7", "UTC-6", "UTC-5", "UTC-4", "UTC-3", "UTC-2", "UTC-1", "UTC", "UTC+1", "UTC+2", "UTC+3", "UTC+4", "UTC+5", "UTC+6", "UTC+7", "UTC+8", "UTC+9", "UTC+10", "UTC+11", "UTC+12"]
}, {
  id: "total-amount-closed-won-deals",
  name: "Total Amount Closed Won Deals",
  category: "Deals",
  icon: "hash",
  type: "number"
}, {
  id: "total-money-raised",
  name: "Total money raised",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "total-open-deal-value",
  name: "Total open deal value",
  category: "Deals",
  icon: "hash",
  type: "number"
}, {
  id: "traffic-rank",
  name: "Traffic Rank",
  category: "Traffic",
  icon: "hash",
  type: "number"
}, {
  id: "trust-disqualification-reasons",
  name: "Trust Disqualification Reasons",
  category: "Scores",
  icon: "text",
  type: "string"
}, {
  id: "trust-rating",
  name: "Trust Rating",
  category: "Scores",
  icon: "text",
  type: "list",
  listOptions: ["High", "Medium", "Low", "Unknown"]
}, {
  id: "trust-rating-last-updated-date",
  name: "Trust Rating Last Updated Date",
  category: "Scores",
  icon: "calendar",
  type: "date"
}, {
  id: "trust-rating-status",
  name: "Trust Rating Status",
  category: "Scores",
  icon: "text",
  type: "list",
  listOptions: ["Active", "Pending Review", "Expired"]
}, {
  id: "type",
  name: "Type",
  category: "Company Information",
  icon: "text",
  type: "list",
  listOptions: ["Prospect", "Customer", "Partner", "Competitor", "Other"]
}, {
  id: "updated-by-user-id",
  name: "Updated by user ID",
  category: "System",
  icon: "text",
  type: "string"
}, {
  id: "web-technologies",
  name: "Web technologies",
  category: "Tech Stack",
  icon: "text",
  type: "string"
}, {
  id: "website-ai-discovery",
  name: "Website AI Discovery",
  category: "AI",
  icon: "text",
  type: "string"
}, {
  id: "website-url",
  name: "Website URL",
  category: "Company Information",
  icon: "text",
  type: "string"
}, {
  id: "won-deals",
  name: "Won Deals",
  category: "Deals",
  icon: "hash",
  type: "number"
}, {
  id: "worked-since-recent-conversion",
  name: "Worked Since Recent Conversion",
  category: "Prospecting",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "worked-since-recent-non-ql",
  name: "Worked Since Recent Non-QL",
  category: "Prospecting",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "worked-status-v3",
  name: "Worked Status v3",
  category: "Prospecting",
  icon: "text",
  type: "list",
  listOptions: ["Worked", "Not Worked", "In Progress"]
}, {
  id: "worked-within-sla",
  name: "Worked Within SLA",
  category: "Prospecting",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "worked-within-sla-v2",
  name: "Worked Within SLA (v2)",
  category: "Prospecting",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "year-founded",
  name: "Year founded",
  category: "Company Information",
  icon: "hash",
  type: "number"
}, {
  id: "zi-batch-id",
  name: "ZI: Batch ID",
  category: "ZoomInfo",
  icon: "text",
  type: "string"
}, {
  id: "zi-is-company-defunct",
  name: "ZI: Is Company Defunct",
  category: "ZoomInfo",
  icon: "checkbox",
  type: "boolean"
}, {
  id: "zi-number-of-marketing-decision-makers",
  name: "ZI: Number of Marketing Decision Makers",
  category: "ZoomInfo",
  icon: "hash",
  type: "number"
}, {
  id: "zi-number-of-sales-decision-makers",
  name: "ZI: Number of Sales Decision Makers",
  category: "ZoomInfo",
  icon: "hash",
  type: "number"
}];

// Group filters by category
const FILTER_CATEGORIES = ALL_FILTERS.reduce((acc, filter) => {
  const existingCategory = acc.find(cat => cat.name === filter.category);
  if (existingCategory) {
    existingCategory.filters.push(filter);
  } else {
    acc.push({
      name: filter.category,
      filters: [filter]
    });
  }
  return acc;
}, [] as {
  name: string;
  filters: FilterItem[];
}[]).sort((a, b) => a.name.localeCompare(b.name));
const getFilterIcon = (icon: string) => {
  switch (icon) {
    case "checkbox":
      return <Check className="h-4 w-4 text-[var(--color-text-core-subtle)]" />;
    case "hash":
      return <Hash className="h-4 w-4 text-[var(--color-text-core-subtle)]" />;
    case "calendar":
      return <Calendar className="h-4 w-4 text-[var(--color-text-core-subtle)]" />;
    case "text":
      return <span className="text-xs text-[var(--color-text-core-subtle)] font-medium">Abc</span>;
    default:
      return null;
  }
};
const getConditionsForType = (type: FilterType) => {
  switch (type) {
    case "string":
      return STRING_CONDITIONS;
    case "number":
      return NUMBER_CONDITIONS;
    case "boolean":
      return BOOLEAN_CONDITIONS;
    case "date":
      return DATE_CONDITIONS;
    case "list":
      return LIST_CONDITIONS;
    default:
      return STRING_CONDITIONS;
  }
};
const getDefaultCondition = (type: FilterType) => {
  switch (type) {
    case "string":
      return "is equal to any of";
    case "number":
      return "is equal to";
    case "boolean":
      return "is true";
    case "date":
      return "is equal to";
    case "list":
      return "is any of";
    default:
      return "is equal to any of";
  }
};
// Column interface for the columns step
interface ColumnItem {
  id: string;
  name: string;
  category: string;
}

// Recursive org tree node component for Access dropdown
interface OrgNodeType {
  id: string;
  label: string;
  children?: OrgNodeType[];
}

const OrgTreeNode = ({
  node,
  depth,
  selectedTeams,
  expandedNodes,
  toggleExpand,
  toggleNode,
  getNodeState,
  searchQuery,
}: {
  node: OrgNodeType;
  depth: number;
  selectedTeams: string[];
  expandedNodes: Set<string>;
  toggleExpand: (id: string) => void;
  toggleNode: (node: OrgNodeType) => void;
  getNodeState: (node: OrgNodeType) => "all" | "some" | "none";
  searchQuery: string;
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const state = getNodeState(node);
  const lowerQuery = searchQuery.toLowerCase();

  // Check if this node or any descendant matches search
  const matchesSelf = node.label.toLowerCase().includes(lowerQuery);
  const matchesDescendant = (n: OrgNodeType): boolean => {
    if (n.label.toLowerCase().includes(lowerQuery)) return true;
    return (n.children || []).some(matchesDescendant);
  };
  const isVisible = !searchQuery || matchesDescendant(node);

  if (!isVisible) return null;

  // Auto-expand when searching
  const shouldExpand = searchQuery ? true : isExpanded;

  return (
    <div>
      <div
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-[var(--color-fill-secondary-hover)] cursor-pointer"
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={(e) => {
          e.stopPropagation();
          toggleNode(node);
        }}
      >
        {hasChildren ? (
          <button
            className="p-0.5 hover:bg-[var(--color-fill-surface-recessed)] rounded shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(node.id);
            }}
          >
            <ChevronDown className={`h-3 w-3 text-[var(--color-text-core-subtle)] transition-transform ${shouldExpand ? "" : "-rotate-90"}`} />
          </button>
        ) : (
          <span className="w-4" />
        )}
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
          state === "all"
            ? "bg-white border-[var(--color-fill-core-default)]"
            : state === "some"
            ? "bg-white border-[var(--color-fill-core-default)]"
            : "border-[var(--color-border-core-default)]"
        }`}>
          {state === "all" && <Check className="h-3 w-3 text-[var(--color-text-core-default)]" />}
          {state === "some" && <div className="w-2 h-0.5 bg-[var(--color-text-core-default)] rounded-full" />}
        </div>
        <span className="body-75 text-[var(--color-text-core-default)] truncate">{node.label}</span>
      </div>
      {hasChildren && shouldExpand && (
        <div>
          {node.children!.map(child => (
            <OrgTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedTeams={selectedTeams}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
              toggleNode={toggleNode}
              getNodeState={getNodeState}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CreateViewModal = ({
  isOpen,
  onClose
}: CreateViewModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("settings");
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([{
    id: "group-1",
    filters: []
  }, {
    id: "group-2",
    filters: []
  }]);
  const [viewName, setViewName] = useState("Campaign name");
  const [viewDescription, setViewDescription] = useState("Campaign description");
  const [editingFilter, setEditingFilter] = useState<{
    groupId: string;
    filterId: string;
  } | null>(null);
  const [listSearchQuery, setListSearchQuery] = useState("");
  const [addFilterPopoverOpen, setAddFilterPopoverOpen] = useState<string | null>(null);
  const [addFilterSearchQuery, setAddFilterSearchQuery] = useState("");
  const [conditionPopoverOpen, setConditionPopoverOpen] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [draggedFilter, setDraggedFilter] = useState<{ filter: ActiveFilter; sourceGroupId: string } | null>(null);
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);
  const [previewCompanies, setPreviewCompanies] = useState(prospectingCompanies.slice(0, 10));
  const [filterVersion, setFilterVersion] = useState(0);
  const [filterMode, setFilterMode] = useState<"prompt" | "manual">("prompt");
  const [filterPromptText, setFilterPromptText] = useState("");
  
  // Columns step state
  const [selectedColumns, setSelectedColumns] = useState<ColumnItem[]>([]);
  const [columnSearchQuery, setColumnSearchQuery] = useState("");
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [draggedTableColumnId, setDraggedTableColumnId] = useState<string | null>(null);
  const [dragOverTableColumnId, setDragOverTableColumnId] = useState<string | null>(null);

  // Settings step state
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [viewType, setViewType] = useState<"table" | "nested" | "book">("table");
  const [campaignBasis, setCampaignBasis] = useState<"companies" | "portals">("companies");
  const [completionAction, setCompletionAction] = useState<string>("add-to-sequence");
  const [completionCount, setCompletionCount] = useState<number>(1);
  const [completionPer, setCompletionPer] = useState<"company" | "contact">("company");

  // Hierarchical sales org for access control
  interface OrgNode {
    id: string;
    label: string;
    children?: OrgNode[];
  }

  const salesOrgTree: OrgNode[] = [
    {
      id: "nam", label: "NAM", children: [
        { id: "nam-us", label: "US", children: [
          { id: "nam-us-corp", label: "Corporate", children: [
            { id: "nam-us-corp-d-jharris", label: "Dir: J. Harris", children: [
              { id: "nam-us-corp-m-chen", label: "Mgr: M. Chen" },
              { id: "nam-us-corp-m-davis", label: "Mgr: R. Davis" },
            ]},
            { id: "nam-us-corp-d-kwilson", label: "Dir: K. Wilson", children: [
              { id: "nam-us-corp-m-garcia", label: "Mgr: L. Garcia" },
            ]},
          ]},
          { id: "nam-us-mm", label: "Mid Market", children: [
            { id: "nam-us-mm-d-tlee", label: "Dir: T. Lee", children: [
              { id: "nam-us-mm-m-patel", label: "Mgr: S. Patel" },
              { id: "nam-us-mm-m-brown", label: "Mgr: A. Brown" },
            ]},
          ]},
          { id: "nam-us-sb", label: "Small Business", children: [
            { id: "nam-us-sb-d-nthompson", label: "Dir: N. Thompson", children: [
              { id: "nam-us-sb-m-martinez", label: "Mgr: D. Martinez" },
            ]},
          ]},
        ]},
        { id: "nam-ca", label: "Canada", children: [
          { id: "nam-ca-corp", label: "Corporate", children: [
            { id: "nam-ca-corp-d-omalley", label: "Dir: P. O'Malley", children: [
              { id: "nam-ca-corp-m-taylor", label: "Mgr: J. Taylor" },
            ]},
          ]},
          { id: "nam-ca-mm", label: "Mid Market", children: [
            { id: "nam-ca-mm-d-singh", label: "Dir: R. Singh", children: [
              { id: "nam-ca-mm-m-nguyen", label: "Mgr: H. Nguyen" },
            ]},
          ]},
        ]},
      ]
    },
    {
      id: "emea", label: "EMEA", children: [
        { id: "emea-dach", label: "DACH", children: [
          { id: "emea-dach-corp", label: "Corporate", children: [
            { id: "emea-dach-corp-d-mueller", label: "Dir: F. Müller", children: [
              { id: "emea-dach-corp-m-schmidt", label: "Mgr: K. Schmidt" },
              { id: "emea-dach-corp-m-weber", label: "Mgr: T. Weber" },
            ]},
          ]},
          { id: "emea-dach-mm", label: "Mid Market", children: [
            { id: "emea-dach-mm-d-fischer", label: "Dir: M. Fischer", children: [
              { id: "emea-dach-mm-m-braun", label: "Mgr: L. Braun" },
            ]},
          ]},
        ]},
        { id: "emea-uki", label: "UKI", children: [
          { id: "emea-uki-corp", label: "Corporate", children: [
            { id: "emea-uki-corp-d-smith", label: "Dir: G. Smith", children: [
              { id: "emea-uki-corp-m-jones", label: "Mgr: E. Jones" },
              { id: "emea-uki-corp-m-williams", label: "Mgr: O. Williams" },
            ]},
          ]},
          { id: "emea-uki-sb", label: "Small Business", children: [
            { id: "emea-uki-sb-d-clark", label: "Dir: I. Clark", children: [
              { id: "emea-uki-sb-m-wright", label: "Mgr: B. Wright" },
            ]},
          ]},
        ]},
        { id: "emea-nordics", label: "Nordics", children: [
          { id: "emea-nordics-mm", label: "Mid Market", children: [
            { id: "emea-nordics-mm-d-larsson", label: "Dir: E. Larsson", children: [
              { id: "emea-nordics-mm-m-berg", label: "Mgr: A. Berg" },
            ]},
          ]},
        ]},
        { id: "emea-france", label: "France", children: [
          { id: "emea-france-corp", label: "Corporate", children: [
            { id: "emea-france-corp-d-dubois", label: "Dir: C. Dubois", children: [
              { id: "emea-france-corp-m-martin", label: "Mgr: P. Martin" },
            ]},
          ]},
        ]},
      ]
    },
    {
      id: "latam", label: "LATAM", children: [
        { id: "latam-brazil", label: "Brazil", children: [
          { id: "latam-brazil-corp", label: "Corporate", children: [
            { id: "latam-brazil-corp-d-silva", label: "Dir: R. Silva", children: [
              { id: "latam-brazil-corp-m-santos", label: "Mgr: M. Santos" },
            ]},
          ]},
          { id: "latam-brazil-mm", label: "Mid Market", children: [
            { id: "latam-brazil-mm-d-costa", label: "Dir: A. Costa", children: [
              { id: "latam-brazil-mm-m-oliveira", label: "Mgr: F. Oliveira" },
            ]},
          ]},
        ]},
        { id: "latam-mexico", label: "Mexico", children: [
          { id: "latam-mexico-corp", label: "Corporate", children: [
            { id: "latam-mexico-corp-d-hernandez", label: "Dir: J. Hernandez", children: [
              { id: "latam-mexico-corp-m-lopez", label: "Mgr: V. Lopez" },
            ]},
          ]},
        ]},
        { id: "latam-ssa", label: "Spanish South America", children: [
          { id: "latam-ssa-sb", label: "Small Business", children: [
            { id: "latam-ssa-sb-d-gutierrez", label: "Dir: D. Gutierrez", children: [
              { id: "latam-ssa-sb-m-rodriguez", label: "Mgr: C. Rodriguez" },
            ]},
          ]},
        ]},
      ]
    },
    {
      id: "apac", label: "APAC", children: [
        { id: "apac-anz", label: "ANZ", children: [
          { id: "apac-anz-corp", label: "Corporate", children: [
            { id: "apac-anz-corp-d-kelly", label: "Dir: S. Kelly", children: [
              { id: "apac-anz-corp-m-murphy", label: "Mgr: W. Murphy" },
            ]},
          ]},
          { id: "apac-anz-mm", label: "Mid Market", children: [
            { id: "apac-anz-mm-d-campbell", label: "Dir: L. Campbell", children: [
              { id: "apac-anz-mm-m-stewart", label: "Mgr: N. Stewart" },
            ]},
          ]},
        ]},
        { id: "apac-sea", label: "Southeast Asia", children: [
          { id: "apac-sea-corp", label: "Corporate", children: [
            { id: "apac-sea-corp-d-tanaka", label: "Dir: Y. Tanaka", children: [
              { id: "apac-sea-corp-m-wong", label: "Mgr: D. Wong" },
            ]},
          ]},
          { id: "apac-sea-sb", label: "Small Business", children: [
            { id: "apac-sea-sb-d-lim", label: "Dir: J. Lim", children: [
              { id: "apac-sea-sb-m-park", label: "Mgr: S. Park" },
            ]},
          ]},
        ]},
        { id: "apac-japan", label: "Japan", children: [
          { id: "apac-japan-corp", label: "Corporate", children: [
            { id: "apac-japan-corp-d-sato", label: "Dir: K. Sato", children: [
              { id: "apac-japan-corp-m-ito", label: "Mgr: T. Ito" },
            ]},
          ]},
        ]},
        { id: "apac-india", label: "India", children: [
          { id: "apac-india-mm", label: "Mid Market", children: [
            { id: "apac-india-mm-d-sharma", label: "Dir: V. Sharma", children: [
              { id: "apac-india-mm-m-gupta", label: "Mgr: P. Gupta" },
            ]},
          ]},
          { id: "apac-india-sb", label: "Small Business", children: [
            { id: "apac-india-sb-d-kumar", label: "Dir: A. Kumar", children: [
              { id: "apac-india-sb-m-reddy", label: "Mgr: R. Reddy" },
            ]},
          ]},
        ]},
      ]
    },
  ];

  // Collect all leaf IDs under a node
  const getAllDescendantIds = useCallback((node: OrgNode): string[] => {
    if (!node.children || node.children.length === 0) return [node.id];
    return [node.id, ...node.children.flatMap(getAllDescendantIds)];
  }, []);

  // Check selection state of a node
  const getNodeState = useCallback((node: OrgNode): "all" | "some" | "none" => {
    const allIds = getAllDescendantIds(node);
    const selectedCount = allIds.filter(id => selectedTeams.includes(id)).length;
    if (selectedCount === allIds.length) return "all";
    if (selectedCount > 0) return "some";
    return "none";
  }, [selectedTeams, getAllDescendantIds]);

  // Toggle a node (select/deselect all descendants)
  const toggleNode = useCallback((node: OrgNode) => {
    const allIds = getAllDescendantIds(node);
    const state = getNodeState(node);
    if (state === "all") {
      // Deselect all
      setSelectedTeams(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      // Select all
      setSelectedTeams(prev => [...new Set([...prev, ...allIds])]);
    }
  }, [getAllDescendantIds, getNodeState]);

  const [expandedOrgNodes, setExpandedOrgNodes] = useState<Set<string>>(new Set());
  const toggleExpand = useCallback((nodeId: string) => {
    setExpandedOrgNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const [accessSearchQuery, setAccessSearchQuery] = useState("");

  // Get summary of selected items for the dropdown trigger
  const getAccessSummary = useCallback((): string => {
    if (selectedTeams.length === 0) return "Select teams...";
    // Show top-level selected geos, otherwise count
    const topSelected = salesOrgTree.filter(geo => getNodeState(geo) === "all").map(g => g.label);
    const partialTop = salesOrgTree.filter(geo => getNodeState(geo) === "some");
    if (topSelected.length === salesOrgTree.length) return "All Geos";
    if (topSelected.length > 0 && partialTop.length === 0) return topSelected.join(", ");
    return `${selectedTeams.length} selected`;
  }, [selectedTeams, getNodeState]);

  // Sync selected columns with active filters when navigating to columns step
  useEffect(() => {
    if (currentStep === "columns") {
      // Get all unique filter IDs from all groups
      const activeFilterIds = new Set<string>();
      filterGroups.forEach(group => {
        group.filters.forEach(filter => {
          activeFilterIds.add(filter.filterId);
        });
      });
      
      // Add filter-based columns that aren't already selected
      const newColumns: ColumnItem[] = [...selectedColumns];
      activeFilterIds.forEach(filterId => {
        if (!newColumns.find(col => col.id === filterId)) {
          const filterDef = ALL_FILTERS.find(f => f.id === filterId);
          if (filterDef) {
            newColumns.push({
              id: filterDef.id,
              name: filterDef.name,
              category: filterDef.category
            });
          }
        }
      });
      
      if (newColumns.length !== selectedColumns.length) {
        setSelectedColumns(newColumns);
      }
    }
  }, [currentStep, filterGroups]);

  // Alternative company names for simulated filtering
  const alternativeCompanyNames = [
    "Zenith Dynamics", "Apex Solutions", "Vanguard Tech", "Nexus Industries",
    "Catalyst Group", "Pinnacle Systems", "Horizon Labs", "Summit Digital",
    "Aurora Enterprises", "Quantum Works", "Stellar Corp", "Vertex Partners",
    "Nova Ventures", "Prism Technologies", "Eclipse Holdings", "Frontier Group",
    "Beacon Analytics", "Stratos Inc", "Meridian Co", "Cypher Solutions"
  ];

  // Shuffle and regenerate preview companies when filters change
  const regeneratePreviewData = useCallback(() => {
    const shuffledNames = [...alternativeCompanyNames].sort(() => Math.random() - 0.5);
    const baseCompanies = prospectingCompanies.slice(0, 10);
    const newCompanies = baseCompanies.map((company, index) => ({
      ...company,
      name: shuffledNames[index % shuffledNames.length],
      id: `${company.id}-${Date.now()}-${index}`
    }));
    setPreviewCompanies(newCompanies);
  }, []);

  // Trigger loading state when filters change
  const triggerTableReload = useCallback(() => {
    setIsTableLoading(true);
    setFilterVersion(prev => prev + 1);
  }, []);

  // Handle the loading timeout
  useEffect(() => {
    if (isTableLoading) {
      const timer = setTimeout(() => {
        regeneratePreviewData();
        setIsTableLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTableLoading, filterVersion, regeneratePreviewData]);

  const steps: {
    key: Step;
    label: string;
  }[] = [{
    key: "settings",
    label: "Settings"
  }, {
    key: "filters",
    label: "Filters"
  }, {
    key: "columns",
    label: "Columns"
  }];
  const currentStepIndex = steps.findIndex(s => s.key === currentStep);
  const findFilterDefinition = (filterId: string): FilterItem | undefined => {
    return ALL_FILTERS.find(f => f.id === filterId);
  };
  const handleAddFilterToGroup = (filter: FilterItem, groupId: string) => {
    const newFilter: ActiveFilter = {
      id: `${filter.id}-${Date.now()}`,
      filterId: filter.id,
      filterName: filter.name,
      filterType: filter.type,
      condition: getDefaultCondition(filter.type),
      value: filter.type === "boolean" ? "true" : "",
      listValues: [],
      listOptions: filter.listOptions
    };
    setFilterGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, filters: [...group.filters, newFilter] }
        : group
    ));

    // Automatically open editor for the new filter
    setEditingFilter({
      groupId: groupId,
      filterId: newFilter.id
    });
    
    // Close the add filter popover
    setAddFilterPopoverOpen(null);
    setAddFilterSearchQuery("");
  };
  const handleRemoveFilter = (groupId: string, filterId: string) => {
    setFilterGroups(prev => prev.map(group => group.id === groupId ? {
      ...group,
      filters: group.filters.filter(f => f.id !== filterId)
    } : group));
    if (editingFilter?.filterId === filterId) {
      setEditingFilter(null);
    }
    triggerTableReload();
  };
  const handleAddGroup = () => {
    setFilterGroups(prev => [...prev, {
      id: `group-${Date.now()}`,
      filters: []
    }]);
  };
  const handleDeleteGroup = (groupId: string) => {
    if (filterGroups.length > 1) {
      setFilterGroups(prev => prev.filter(g => g.id !== groupId));
    }
  };
  const handleDuplicateGroup = (groupId: string) => {
    const groupToDuplicate = filterGroups.find(g => g.id === groupId);
    if (groupToDuplicate) {
      setFilterGroups(prev => [...prev, {
        id: `group-${Date.now()}`,
        filters: groupToDuplicate.filters.map(f => ({
          ...f,
          id: `${f.filterId}-${Date.now()}`
        }))
      }]);
    }
  };
  const handleUpdateFilter = (groupId: string, filterId: string, updates: Partial<ActiveFilter>) => {
    setFilterGroups(prev => prev.map(group => group.id === groupId ? {
      ...group,
      filters: group.filters.map(f => f.id === filterId ? {
        ...f,
        ...updates
      } : f)
    } : group));
  };
  const handleListValueToggle = (groupId: string, filterId: string, value: string) => {
    const group = filterGroups.find(g => g.id === groupId);
    const filter = group?.filters.find(f => f.id === filterId);
    if (!filter) return;
    const currentValues = filter.listValues || [];
    const newValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
    handleUpdateFilter(groupId, filterId, {
      listValues: newValues,
      value: newValues.join(", ")
    });
  };
  const getEditingFilterData = () => {
    if (!editingFilter) return null;
    const group = filterGroups.find(g => g.id === editingFilter.groupId);
    return group?.filters.find(f => f.id === editingFilter.filterId);
  };
  const editingFilterData = getEditingFilterData();
  
  const handleFilterEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setEditingFilter(null);
      triggerTableReload();
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, filter: ActiveFilter, sourceGroupId: string) => {
    setDraggedFilter({ filter, sourceGroupId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', filter.id);
  };

  const handleDragEnd = () => {
    setDraggedFilter(null);
    setDragOverGroupId(null);
  };

  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverGroupId(groupId);
  };

  const handleDragLeave = () => {
    setDragOverGroupId(null);
  };

  const handleDrop = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault();
    setDragOverGroupId(null);
    
    if (!draggedFilter) return;
    
    const { filter, sourceGroupId } = draggedFilter;
    
    // Don't do anything if dropping in the same group
    if (sourceGroupId === targetGroupId) {
      setDraggedFilter(null);
      return;
    }
    
    // Remove from source group and add to target group
    setFilterGroups(prev => prev.map(group => {
      if (group.id === sourceGroupId) {
        return {
          ...group,
          filters: group.filters.filter(f => f.id !== filter.id)
        };
      }
      if (group.id === targetGroupId) {
        return {
          ...group,
          filters: [...group.filters, filter]
        };
      }
      return group;
    }));
    
    // Update editing filter context if the moved filter was being edited
    if (editingFilter?.filterId === filter.id) {
      setEditingFilter({
        groupId: targetGroupId,
        filterId: filter.id
      });
    }
    
    setDraggedFilter(null);
    triggerTableReload();
  };

  // Column handling functions
  const handleToggleColumn = (filter: FilterItem) => {
    const isSelected = selectedColumns.some(col => col.id === filter.id);
    if (isSelected) {
      setSelectedColumns(prev => prev.filter(col => col.id !== filter.id));
    } else {
      setSelectedColumns(prev => [...prev, {
        id: filter.id,
        name: filter.name,
        category: filter.category
      }]);
    }
  };

  const handleMoveColumnUp = (columnId: string) => {
    const index = selectedColumns.findIndex(col => col.id === columnId);
    if (index > 0) {
      const newColumns = [...selectedColumns];
      [newColumns[index - 1], newColumns[index]] = [newColumns[index], newColumns[index - 1]];
      setSelectedColumns(newColumns);
    }
  };

  const handleMoveColumnDown = (columnId: string) => {
    const index = selectedColumns.findIndex(col => col.id === columnId);
    if (index < selectedColumns.length - 1) {
      const newColumns = [...selectedColumns];
      [newColumns[index], newColumns[index + 1]] = [newColumns[index + 1], newColumns[index]];
      setSelectedColumns(newColumns);
    }
  };

  // Column list drag handlers
  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumnId(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumnId(columnId);
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumnId || draggedColumnId === targetColumnId) {
      setDraggedColumnId(null);
      setDragOverColumnId(null);
      return;
    }

    const dragIndex = selectedColumns.findIndex(col => col.id === draggedColumnId);
    const dropIndex = selectedColumns.findIndex(col => col.id === targetColumnId);

    if (dragIndex !== -1 && dropIndex !== -1) {
      const newColumns = [...selectedColumns];
      const [removed] = newColumns.splice(dragIndex, 1);
      newColumns.splice(dropIndex, 0, removed);
      setSelectedColumns(newColumns);
    }

    setDraggedColumnId(null);
    setDragOverColumnId(null);
  };

  // Table header drag handlers
  const handleTableColumnDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedTableColumnId(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);
  };

  const handleTableColumnDragEnd = () => {
    setDraggedTableColumnId(null);
    setDragOverTableColumnId(null);
  };

  const handleTableColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTableColumnId(columnId);
  };

  const handleTableColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTableColumnId || draggedTableColumnId === targetColumnId) {
      setDraggedTableColumnId(null);
      setDragOverTableColumnId(null);
      return;
    }

    const dragIndex = selectedColumns.findIndex(col => col.id === draggedTableColumnId);
    const dropIndex = selectedColumns.findIndex(col => col.id === targetColumnId);

    if (dragIndex !== -1 && dropIndex !== -1) {
      const newColumns = [...selectedColumns];
      const [removed] = newColumns.splice(dragIndex, 1);
      newColumns.splice(dropIndex, 0, removed);
      setSelectedColumns(newColumns);
    }

    setDraggedTableColumnId(null);
    setDragOverTableColumnId(null);
  };

  // Get filtered columns list for search
  const getFilteredColumnsList = () => {
    const query = columnSearchQuery.toLowerCase();
    if (!query) return ALL_FILTERS;
    return ALL_FILTERS.filter(f => 
      f.name.toLowerCase().includes(query) || 
      f.category.toLowerCase().includes(query)
    );
  };

  // Get sorted columns list (selected at top, then alphabetically)
  const getSortedColumnsList = () => {
    const filtered = getFilteredColumnsList();
    const selected = filtered.filter(f => selectedColumns.some(col => col.id === f.id));
    const unselected = filtered.filter(f => !selectedColumns.some(col => col.id === f.id));
    
    // Sort selected by their order in selectedColumns
    selected.sort((a, b) => {
      const indexA = selectedColumns.findIndex(col => col.id === a.id);
      const indexB = selectedColumns.findIndex(col => col.id === b.id);
      return indexA - indexB;
    });
    
    return [...selected, ...unselected];
  };

  const renderFilterEditor = () => {
    if (!editingFilter || !editingFilterData) return null;
    const filterDef = findFilterDefinition(editingFilterData.filterId);
    const conditions = getConditionsForType(editingFilterData.filterType);
    return <div className="border border-[var(--color-border-core-default)] rounded-[4px] p-4 bg-[var(--color-fill-surface-default)]">
        {/* Filter name header */}
        <div className="flex items-center justify-between mb-4">
          <span className="heading-100 text-[var(--color-text-core-default)]">
            {editingFilterData.filterName}
          </span>
          <button onClick={() => handleRemoveFilter(editingFilter.groupId, editingFilter.filterId)} className="p-1 rounded hover:bg-[var(--color-fill-secondary-hover)]">
            <Trash2 className="h-4 w-4 text-[var(--color-text-core-subtle)]" />
          </button>
        </div>

        {/* Condition selector */}
        {editingFilterData.filterType !== "boolean" && <div className="mb-4">
            <Popover open={conditionPopoverOpen} onOpenChange={setConditionPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center justify-between px-3 py-2 border border-[var(--color-border-core-default)] rounded-[4px] bg-[var(--color-fill-surface-default)] hover:bg-[var(--color-fill-secondary-hover)]">
                  <span className="body-100 text-[var(--color-text-core-default)]">
                    {editingFilterData.condition}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[var(--color-text-core-subtle)]" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0 bg-[var(--color-fill-surface-default)] border-[var(--color-border-core-default)] z-[100]" align="start">
                <div className="py-1">
                  {conditions.map(condition => <button key={condition} onClick={() => {
                handleUpdateFilter(editingFilter.groupId, editingFilter.filterId, {
                  condition
                });
                setConditionPopoverOpen(false);
              }} className={`w-full px-4 py-2 text-left body-100 hover:bg-[var(--color-fill-secondary-hover)] ${editingFilterData.condition === condition ? "bg-[var(--color-fill-secondary-subtle)]" : ""}`}>
                      {condition}
                    </button>)}
                </div>
              </PopoverContent>
            </Popover>
          </div>}

        {/* Value input based on type */}
        {editingFilterData.filterType === "string" && !["is known", "is unknown"].includes(editingFilterData.condition) && <Input placeholder="Enter value..." value={editingFilterData.value} onChange={e => handleUpdateFilter(editingFilter.groupId, editingFilter.filterId, {
        value: e.target.value
      })} onKeyDown={handleFilterEditorKeyDown} className="w-full" />}

        {editingFilterData.filterType === "number" && <Input type="number" placeholder="Enter number..." value={editingFilterData.value} onChange={e => handleUpdateFilter(editingFilter.groupId, editingFilter.filterId, {
        value: e.target.value
      })} onKeyDown={handleFilterEditorKeyDown} className="w-full" />}

        {editingFilterData.filterType === "boolean" && <RadioGroup value={editingFilterData.condition} onValueChange={value => handleUpdateFilter(editingFilter.groupId, editingFilter.filterId, {
        condition: value,
        value: value === "is true" ? "Yes" : "No"
      })} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="is true" id="bool-true" />
              <Label htmlFor="bool-true" className="body-100 text-[var(--color-text-core-default)]">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="is false" id="bool-false" />
              <Label htmlFor="bool-false" className="body-100 text-[var(--color-text-core-default)]">False</Label>
            </div>
          </RadioGroup>}

        {editingFilterData.filterType === "date" && !["is known", "is unknown"].includes(editingFilterData.condition) && <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center justify-between px-3 py-2 border border-[var(--color-border-core-default)] rounded-[4px] bg-[var(--color-fill-surface-default)] hover:bg-[var(--color-fill-secondary-hover)]">
                <span className="body-100 text-[var(--color-text-core-default)]">
                  {editingFilterData.dateValue ? format(editingFilterData.dateValue, "PPP") : "Pick a date"}
                </span>
                <Calendar className="h-4 w-4 text-[var(--color-text-core-subtle)]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[var(--color-fill-surface-default)] border-[var(--color-border-core-default)] z-[100]" align="start">
              <CalendarComponent mode="single" selected={editingFilterData.dateValue} onSelect={date => handleUpdateFilter(editingFilter.groupId, editingFilter.filterId, {
            dateValue: date,
            value: date ? format(date, "PPP") : ""
          })} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>}

        {editingFilterData.filterType === "list" && <div className="space-y-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-core-subtle)]" />
              <Input placeholder="Search..." value={listSearchQuery} onChange={e => setListSearchQuery(e.target.value)} className="pl-10" />
            </div>

            {/* List options */}
            <ScrollArea className="h-[200px]">
              <div className="space-y-1">
                {(editingFilterData.listOptions || []).filter(option => option.toLowerCase().includes(listSearchQuery.toLowerCase())).map(option => <div key={option} className="flex items-center space-x-2 px-2 py-1.5 rounded-[4px] hover:bg-[var(--color-fill-secondary-hover)]">
                      <Checkbox id={`list-${option}`} checked={(editingFilterData.listValues || []).includes(option)} onCheckedChange={() => handleListValueToggle(editingFilter.groupId, editingFilter.filterId, option)} />
                      <Label htmlFor={`list-${option}`} className="body-100 text-[var(--color-text-core-default)] cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>)}
              </div>
            </ScrollArea>
          </div>}

        {/* Done button */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border-core-subtle)]">
          <Button size="sm" onClick={() => {
            setEditingFilter(null);
            triggerTableReload();
          }} className="w-full rounded-[4px] bg-[var(--color-fill-primary-default)] hover:bg-[var(--color-fill-primary-hover)] text-[var(--color-text-primary-default)]">
            Done
          </Button>
        </div>
      </div>;
  };
  const getFilterDisplayValue = (filter: ActiveFilter) => {
    if (filter.filterType === "boolean") {
      return filter.condition === "is true" ? "Yes" : "No";
    }
    if (filter.filterType === "list" && filter.listValues && filter.listValues.length > 0) {
      return filter.listValues.length > 2 ? `${filter.listValues.slice(0, 2).join(", ")} +${filter.listValues.length - 2} more` : filter.listValues.join(", ");
    }
    if (["is known", "is unknown"].includes(filter.condition)) {
      return "";
    }
    return filter.value || "(not set)";
  };

  // Shared preview table renderer — used by filters, columns, and settings steps
  const renderPreviewTable = () => (
    <div className="overflow-x-auto relative">
      {/* Loading Overlay */}
      {isTableLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-fill-surface-default)]/60 backdrop-blur-[2px] rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-fill-brand-default)]" />
            <span className="body-100 text-[var(--color-text-core-subtle)]">Applying filters...</span>
          </div>
        </div>
      )}
      <div className={`overflow-hidden bg-[var(--color-fill-surface-default)] border border-[var(--color-border-container-default)] rounded-lg shadow-100 transition-all duration-300 ${isTableLoading ? 'opacity-40 blur-[1px]' : ''}`} style={{ minWidth: '800px' }}>
        {/* Table Header */}
        <div className="flex border-b border-[var(--color-border-container-default)]">
          {["Company name", "Industry", "PVS Score", "Signals"].map((col, i) => (
            <div
              key={col}
              className={`flex flex-col justify-center items-start bg-[var(--color-fill-surface-recessed)] min-h-[44px] max-h-[44px] py-3 px-6 ${i === 0 ? 'w-[260px]' : 'flex-1'}`}
            >
              <button className="flex items-center gap-2 body-125">
                {col}
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div>
          {previewCompanies.map((company, index) => (
            <div
              key={company.id}
              className={`flex transition-colors hover:bg-[var(--color-fill-secondary-hover)] ${index < 9 ? 'border-b border-[var(--color-border-container-default)]' : ''} ${index % 2 === 1 ? 'bg-[var(--color-fill-surface-recessed)]' : ''}`}
            >
              {/* Company name */}
              <div className="flex flex-col justify-center items-start w-[260px] min-h-[56px] py-4 px-6 self-stretch">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-[var(--color-fill-secondary-subtle)]">
                      {company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="body-125 text-[var(--color-text-core-default)]">
                    {company.name}
                  </span>
                </div>
              </div>
              {/* Industry */}
              <div className="flex flex-col justify-center items-start flex-1 min-h-[56px] py-4 px-6 self-stretch">
                <span className="body-100 text-[var(--color-text-core-subtle)]">
                  {company.industry || "—"}
                </span>
              </div>
              {/* PVS Score */}
              <div className="flex flex-col justify-center items-start flex-1 min-h-[56px] py-4 px-6 self-stretch">
                <span className={`body-100 ${
                  company.pvsScore === "High"
                    ? "text-[var(--color-text-success-default)]"
                    : company.pvsScore === "Medium"
                    ? "text-[var(--color-text-warning-default)]"
                    : "text-[var(--color-text-core-subtle)]"
                }`}>
                  {company.pvsScore || "—"}
                </span>
              </div>
              {/* Signals */}
              <div className="flex flex-col justify-center items-start flex-1 min-h-[56px] py-4 px-6 self-stretch">
                <div className="flex flex-wrap gap-1">
                  {company.signals.slice(0, 2).map((signal, idx) => (
                    <Tag
                      key={idx}
                      variant={(signal.variant as "green" | "blue" | "yellow" | "orange" | "neutral") || "neutral"}
                    >
                      {signal.text}
                    </Tag>
                  ))}
                  {company.signals.length > 2 && (
                    <span className="body-100 text-[var(--color-text-core-subtle)]">
                      +{company.signals.length - 2}
                    </span>
                  )}
                  {company.signals.length === 0 && (
                    <span className="body-100 text-[var(--color-text-core-subtle)]">—</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Shared preview header (view-as, name, description)
  const renderPreviewHeader = () => (
    <>
      <div className="mb-4">
        <span className="body-75 text-[var(--color-text-core-subtle)]">View as</span>
        <div className="flex items-center gap-1 mt-1">
          <span className="heading-100 text-[var(--color-text-core-default)]">Eoin Ó Raghallaigh</span>
          <ChevronDown className="h-4 w-4 text-[var(--color-text-core-subtle)]" />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="heading-200 text-[var(--color-text-core-default)]">{viewName}</span>
          <button className="p-1 hover:bg-[var(--color-fill-secondary-hover)] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.333 2.00001C11.5081 1.82491 11.7169 1.68602 11.9473 1.59126C12.1777 1.4965 12.4251 1.44772 12.6751 1.44772C12.925 1.44772 13.1724 1.4965 13.4028 1.59126C13.6332 1.68602 13.842 1.82491 14.0171 2.00001C14.1922 2.17511 14.3311 2.38391 14.4259 2.6143C14.5206 2.8447 14.5694 3.09211 14.5694 3.34201C14.5694 3.59192 14.5206 3.83933 14.4259 4.06972C14.3311 4.30012 14.1922 4.50892 14.0171 4.68401L5.00008 13.701L1.33341 14.667L2.30008 11.0003L11.333 2.00001Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-core-subtle)]"/>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="body-100 text-[var(--color-text-core-subtle)]">{viewDescription}</span>
          <button className="p-1 hover:bg-[var(--color-fill-secondary-hover)] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.333 2.00001C11.5081 1.82491 11.7169 1.68602 11.9473 1.59126C12.1777 1.4965 12.4251 1.44772 12.6751 1.44772C12.925 1.44772 13.1724 1.4965 13.4028 1.59126C13.6332 1.68602 13.842 1.82491 14.0171 2.00001C14.1922 2.17511 14.3311 2.38391 14.4259 2.6143C14.5206 2.8447 14.5694 3.09211 14.5694 3.34201C14.5694 3.59192 14.5206 3.83933 14.4259 4.06972C14.3311 4.30012 14.1922 4.50892 14.0171 4.68401L5.00008 13.701L1.33341 14.667L2.30008 11.0003L11.333 2.00001Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-core-subtle)]"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  // Shared results count
  const renderResultsCount = () => (
    <div className="mt-4">
      <span className="body-100 text-[var(--color-text-core-subtle)]">
        Showing {previewCompanies.length} of {prospectingCompanies.length} companies
      </span>
    </div>
  );
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Full screen white background */}
      <div className="absolute inset-0 bg-[var(--color-fill-surface-default)]" />
      
      {/* Header/Navigation Bar */}
      <div className="relative flex items-center justify-between h-16 px-6 border-b border-[var(--color-border-container-default)]">
        {/* Left - Back button */}
        <div className="w-32 flex items-center">
          {currentStep !== "settings" && (
            <Button 
              variant="outline" 
              onClick={() => {
                if (currentStep === "filters") setCurrentStep("settings");
                else if (currentStep === "columns") setCurrentStep("filters");
              }} 
              className="h-10 px-6 rounded-[4px] border-[var(--color-border-core-default)]"
            >
              Back
            </Button>
          )}
        </div>
        
        {/* Center - Stepper */}
        <div className="flex items-center gap-0">
          {steps.map((step, index) => <div key={step.key} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 transition-colors ${index <= currentStepIndex ? "border-[var(--color-fill-brand-default)] bg-[var(--color-fill-brand-default)]" : "border-[var(--color-border-core-subtle)] bg-transparent"}`} />
                </div>
                <span className={`mt-2 body-100 ${index === currentStepIndex ? "text-[var(--color-text-core-default)]" : "text-[var(--color-text-core-subtle)]"}`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && <div className={`w-48 h-0.5 mx-2 ${index < currentStepIndex ? "bg-[var(--color-fill-brand-default)]" : "bg-[var(--color-border-core-subtle)]"}`} style={{
            marginTop: "-18px"
          }} />}
            </div>)}
        </div>
        
        {/* Right - Action buttons */}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onClose} className="h-10 px-6 rounded-[4px] border-[var(--color-border-core-default)]">
            Exit
          </Button>
          <Button onClick={() => {
          if (currentStep === "settings") setCurrentStep("filters");else if (currentStep === "filters") setCurrentStep("columns");else onClose();
        }} className="h-10 px-6 rounded-[4px] bg-[var(--color-fill-primary-default)] hover:bg-[var(--color-fill-primary-hover)] text-[var(--color-text-primary-default)]">
            {currentStep === "columns" ? "Save" : "Next"}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {currentStep === "filters" && <>
            {/* Single Column: Filter Groups with Add Filter Popovers */}
            <div className="w-[320px] border-r border-[var(--color-border-container-default)] flex flex-col">
              {filterMode === "prompt" ? (
                <div className="flex flex-col p-4">
                  <div className="flex flex-col">
                    <textarea
                      value={filterPromptText}
                      onChange={(e) => setFilterPromptText(e.target.value)}
                      placeholder="Which companies do you want to include in your campaign?"
                      rows={4}
                      className="w-full resize-none rounded-[var(--borderRadius-100,4px)] border border-[var(--color-border-core-default)] bg-[var(--color-fill-field-default)] p-3 body-100 text-[var(--color-text-core-default)] placeholder:text-[var(--color-text-core-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      className="w-full h-10 rounded-[4px] bg-[var(--color-fill-primary-default)] hover:bg-[var(--color-fill-primary-hover)] text-[var(--color-text-primary-default)]"
                      disabled={!filterPromptText.trim()}
                    >
                      Create list
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-10 rounded-[4px] border border-solid border-[var(--color-border-secondary-default,#8A8A8A)] bg-[var(--color-fill-secondary-default,#FFF)] hover:bg-[var(--color-fill-secondary-hover)]"
                      onClick={() => setFilterMode("manual")}
                    >
                      Select filters manually
                    </Button>
                  </div>
                </div>
              ) : (
              <>
              <div className="p-4 pb-2 border-b border-[var(--color-border-container-default)] flex items-center justify-between">
                <h3 className="heading-200 text-[var(--color-text-core-default)]">Filter groups</h3>
                <button
                  onClick={() => setFilterMode("prompt")}
                  className="body-100 text-[var(--color-text-brand-default)] hover:underline"
                >
                  Use AI
                </button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {filterGroups.map((group, groupIndex) => {
                    // Filter categories for this group's popover
                    const popoverFilteredCategories = FILTER_CATEGORIES.map(category => ({
                      ...category,
                      filters: category.filters.filter(f => 
                        f.name.toLowerCase().includes(addFilterSearchQuery.toLowerCase())
                      )
                    })).filter(category => category.filters.length > 0);

                    return (
                      <div 
                        key={group.id}
                        onDragOver={(e) => handleDragOver(e, group.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, group.id)}
                        className={`transition-colors rounded-[4px] ${
                          dragOverGroupId === group.id && draggedFilter?.sourceGroupId !== group.id
                            ? 'bg-[var(--color-fill-primary-subtle)] ring-2 ring-[var(--color-border-primary-default)]'
                            : ''
                        }`}
                      >
                        {/* Group Header */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="heading-100 text-[var(--color-text-core-default)]">
                            Group {groupIndex + 1}
                          </h4>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDuplicateGroup(group.id)} className="p-1 rounded hover:bg-[var(--color-fill-secondary-hover)]">
                              <Copy className="h-4 w-4 text-[var(--color-text-core-subtle)]" />
                            </button>
                            <button onClick={() => handleDeleteGroup(group.id)} className="p-1 rounded hover:bg-[var(--color-fill-secondary-hover)]">
                              <Trash2 className="h-4 w-4 text-[var(--color-text-core-subtle)]" />
                            </button>
                          </div>
                        </div>

                        {/* Filter Cards */}
                        <div className="space-y-2">
                          {group.filters.length === 0 ? (
                            <div className={`border border-dashed rounded-[4px] p-4 text-center ${
                              dragOverGroupId === group.id && draggedFilter?.sourceGroupId !== group.id
                                ? 'border-[var(--color-border-primary-default)] bg-[var(--color-fill-primary-subtle)]'
                                : 'border-[var(--color-border-core-subtle)]'
                            }`}>
                              <span className="body-100 text-[var(--color-text-core-subtle)]">
                                {dragOverGroupId === group.id && draggedFilter?.sourceGroupId !== group.id
                                  ? 'Drop filter here'
                                  : 'Add a filter to this group'}
                              </span>
                            </div>
                          ) : (
                            group.filters.map((filter, filterIndex) => (
                              <div 
                                key={filter.id}
                                draggable={editingFilter?.filterId !== filter.id}
                                onDragStart={(e) => handleDragStart(e, filter, group.id)}
                                onDragEnd={handleDragEnd}
                                className={`${
                                  draggedFilter?.filter.id === filter.id 
                                    ? 'opacity-50' 
                                    : ''
                                }`}
                              >
                                {editingFilter?.filterId === filter.id ? (
                                  renderFilterEditor()
                                ) : (
                                  <div
                                    onClick={() => setEditingFilter({
                                      groupId: group.id,
                                      filterId: filter.id
                                    })}
                                    className="w-full border border-[var(--color-border-core-default)] rounded-[4px] p-3 text-left hover:bg-[var(--color-fill-secondary-hover)] transition-colors cursor-grab active:cursor-grabbing"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <span className="body-100 text-[var(--color-text-core-default)]">
                                          <strong>{filter.filterName}</strong>{" "}
                                          <span className="text-[var(--color-text-core-subtle)]">{filter.condition}</span>{" "}
                                          {getFilterDisplayValue(filter) && <strong>{getFilterDisplayValue(filter)}</strong>}
                                        </span>
                                      </div>
                                      <button
                                        onClick={e => {
                                          e.stopPropagation();
                                          handleRemoveFilter(group.id, filter.id);
                                        }}
                                        className="p-1 rounded hover:bg-[var(--color-fill-secondary-hover)] ml-2"
                                      >
                                        <Trash2 className="h-4 w-4 text-[var(--color-text-core-subtle)]" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {filterIndex < group.filters.length - 1 && !editingFilter && (
                                  <div className="text-center py-1">
                                    <span className="body-75 text-[var(--color-text-core-subtle)]">and</span>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* "and" connector before Add Filter button */}
                        {group.filters.length > 0 && !editingFilter && (
                          <div className="text-center py-2">
                            <span className="body-75 text-[var(--color-text-core-subtle)]">and</span>
                          </div>
                        )}

                        {/* Add Filter Button with Popover */}
                        <Popover 
                          open={addFilterPopoverOpen === group.id} 
                          onOpenChange={(open) => {
                            setAddFilterPopoverOpen(open ? group.id : null);
                            if (!open) setAddFilterSearchQuery("");
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-3 rounded-[4px] border border-solid border-[var(--color-border-secondary-default,#8A8A8A)] bg-[var(--color-fill-secondary-default,#FFF)] hover:bg-[var(--color-fill-secondary-hover)]"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add filter
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent 
                            className="w-[320px] p-0 bg-[var(--color-fill-surface-default)] border-[var(--color-border-core-default)] z-[100]" 
                            align="start"
                            side="right"
                            sideOffset={8}
                            style={{ height: 'calc(100vh - 200px)', maxHeight: '700px' }}
                          >
                            <div className="p-3 border-b border-[var(--color-border-core-subtle)]">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-core-subtle)]" />
                                <Input 
                                  placeholder="Search properties..." 
                                  value={addFilterSearchQuery} 
                                  onChange={e => setAddFilterSearchQuery(e.target.value)} 
                                  className="pl-10" 
                                />
                              </div>
                            </div>
                            <ScrollArea className="h-[calc(100%-60px)]">
                              <div className="p-2 space-y-4">
                                {popoverFilteredCategories.map(category => (
                                  <div key={category.name}>
                                    <h4 className="heading-50 text-[var(--color-text-core-default)] mb-1 px-2">
                                      {category.name}
                                    </h4>
                                    <div className="space-y-0.5">
                                      {category.filters.map(filter => (
                                        <button 
                                          key={filter.id} 
                                          onClick={() => handleAddFilterToGroup(filter, group.id)} 
                                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[4px] hover:bg-[var(--color-fill-secondary-hover)] transition-colors text-left"
                                        >
                                          {getFilterIcon(filter.icon)}
                                          <span className="body-100 text-[var(--color-text-core-default)] truncate">
                                            {filter.name}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                                {popoverFilteredCategories.length === 0 && (
                                  <div className="text-center py-4">
                                    <span className="body-100 text-[var(--color-text-core-subtle)]">
                                      No properties found
                                    </span>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>

                        {/* OR separator between groups */}
                        {groupIndex < filterGroups.length - 1 && (
                          <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-[var(--color-border-core-subtle)]" />
                            <span className="body-100 text-[var(--color-text-core-subtle)] font-medium">OR</span>
                            <div className="flex-1 h-px bg-[var(--color-border-core-subtle)]" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add filter group button */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex-1 h-px bg-[var(--color-border-core-subtle)]" />
                    <span className="body-100 text-[var(--color-text-core-subtle)] font-medium">OR</span>
                    <div className="flex-1 h-px bg-[var(--color-border-core-subtle)]" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddGroup} 
                    className="rounded-[4px] border border-solid border-[var(--color-border-secondary-default,#8A8A8A)] bg-[var(--color-fill-secondary-default,#FFF)] hover:bg-[var(--color-fill-secondary-hover)]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add filter group
                  </Button>
                </div>
              </ScrollArea>
              </>
              )}
            </div>

            {/* Column 3: Preview (~50%) */}
            <div className="flex-1 flex flex-col bg-[var(--color-fill-surface-recessed)]">
              <div className="p-6">
                {renderPreviewHeader()}
                {renderPreviewTable()}
                {renderResultsCount()}
              </div>
            </div>
          </>}

        {currentStep === "columns" && <>
          {/* Left Panel - Column Selection */}
          <div className="w-[320px] border-r border-[var(--color-border-core-default)] flex flex-col">
            <div className="p-6 border-b border-[var(--color-border-core-default)]">
              <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">Select Columns</h3>
              
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-text-core-subtle)]" />
                <Input
                  placeholder="Search"
                  value={columnSearchQuery}
                  onChange={(e) => setColumnSearchQuery(e.target.value)}
                  className="pl-10 bg-[var(--color-fill-surface-default)] border-[var(--color-border-core-default)]"
                />
              </div>
            </div>

            {/* Columns list */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {getSortedColumnsList().map((filter) => {
                  const isSelected = selectedColumns.some(col => col.id === filter.id);
                  const selectedIndex = selectedColumns.findIndex(col => col.id === filter.id);
                  
                  return (
                    <div
                      key={filter.id}
                      draggable={isSelected}
                      onDragStart={(e) => isSelected && handleColumnDragStart(e, filter.id)}
                      onDragEnd={handleColumnDragEnd}
                      onDragOver={(e) => isSelected && handleColumnDragOver(e, filter.id)}
                      onDrop={(e) => isSelected && handleColumnDrop(e, filter.id)}
                      onClick={() => handleToggleColumn(filter)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-[var(--color-fill-secondary-subtle)]" 
                          : "hover:bg-[var(--color-fill-secondary-hover)]"
                      } ${dragOverColumnId === filter.id ? "border-t-2 border-[var(--color-fill-brand-default)]" : ""} ${
                        isSelected ? "cursor-grab" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected 
                          ? "bg-[var(--color-fill-core-default)] border-[var(--color-fill-core-default)]" 
                          : "border-[var(--color-border-core-default)]"
                      }`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      
                      {/* Column name */}
                      <span className="body-100 text-[var(--color-text-core-default)] flex-1 truncate">
                        {filter.name}
                      </span>

                      {/* Reorder buttons for selected columns */}
                      {isSelected && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveColumnUp(filter.id);
                            }}
                            disabled={selectedIndex === 0}
                            className={`p-0.5 rounded hover:bg-[var(--color-fill-secondary-hover)] ${
                              selectedIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
                            }`}
                          >
                            <ChevronDown className="h-3 w-3 text-[var(--color-text-core-subtle)] rotate-180" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveColumnDown(filter.id);
                            }}
                            disabled={selectedIndex === selectedColumns.length - 1}
                            className={`p-0.5 rounded hover:bg-[var(--color-fill-secondary-hover)] ${
                              selectedIndex === selectedColumns.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                            }`}
                          >
                            <ChevronDown className="h-3 w-3 text-[var(--color-text-core-subtle)]" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Selected count */}
            <div className="p-4 border-t border-[var(--color-border-core-default)]">
              <span className="body-75 text-[var(--color-text-core-subtle)]">
                {selectedColumns.length} columns selected
              </span>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 flex flex-col bg-[var(--color-fill-surface-recessed)] overflow-y-auto">
            <div className="p-6">
            {renderPreviewHeader()}
            {renderPreviewTable()}
            {renderResultsCount()}
            </div>
          </div>
        </>}

        {currentStep === "settings" && <>
          {/* Left Panel - Settings Controls */}
          <div className="w-[320px] border-r border-[var(--color-border-core-default)] flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6 divide-y divide-[var(--color-border-container-default)] [&>div:not(:first-child)]:pt-6">
                {/* Based on Section - FIRST */}
                <div>
                  <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">Based on</h3>
                  <RadioGroup value={campaignBasis} onValueChange={(v) => setCampaignBasis(v as "companies" | "portals")} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="companies" id="basis-companies" />
                      <Label htmlFor="basis-companies" className="body-75 text-[var(--color-text-core-default)] cursor-pointer">Companies</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="portals" id="basis-portals" />
                      <Label htmlFor="basis-portals" className="body-75 text-[var(--color-text-core-default)] cursor-pointer">Portals</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Campaign Type Section */}
                <div>
                  <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">Campaign type</h3>
                  <div className="space-y-4">
                    {/* Table View */}
                    <div>
                      <span className="body-75 text-[var(--color-text-core-default)] mb-2 block">Table view</span>
                      <button
                        onClick={() => setViewType("table")}
                        className={`w-full p-4 rounded-lg border-2 transition-colors ${
                          viewType === "table"
                            ? "border-[var(--color-fill-brand-default)] bg-[var(--color-fill-surface-default)] shadow-100"
                            : "border-[var(--color-border-core-default)] bg-[var(--color-fill-surface-default)] hover:border-[var(--color-border-core-subtle)]"
                        }`}
                      >
                        {/* Mini table illustration */}
                        <div className="rounded border border-[var(--color-border-container-default)] overflow-hidden">
                          {/* Header row */}
                          <div className="flex gap-1.5 px-2 py-1.5 bg-[var(--color-fill-surface-recessed)]">
                            <div className="h-1.5 w-10 bg-[var(--color-border-core-default)] rounded-full" />
                            <div className="h-1.5 w-14 bg-[var(--color-border-core-default)] rounded-full" />
                            <div className="h-1.5 flex-1 bg-[var(--color-border-core-default)] rounded-full" />
                          </div>
                          {/* Data rows */}
                          {[0, 1, 2].map(r => (
                            <div key={r} className={`flex gap-1.5 px-2 py-1.5 ${r < 2 ? 'border-b border-[var(--color-border-container-default)]' : ''}`}>
                              <div className="h-1.5 w-10 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                              <div className="h-1.5 w-14 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                              <div className="h-1.5 flex-1 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                            </div>
                          ))}
                        </div>
                      </button>
                    </div>

                    {/* Nested Contact View */}
                    <div>
                      <span className="body-75 text-[var(--color-text-core-default)] mb-2 block">Nested contact view</span>
                      <button
                        onClick={() => setViewType("nested")}
                        className={`w-full p-4 rounded-lg border-2 transition-colors ${
                          viewType === "nested"
                            ? "border-[var(--color-fill-brand-default)] bg-[var(--color-fill-surface-default)] shadow-100"
                            : "border-[var(--color-border-core-default)] bg-[var(--color-fill-surface-default)] hover:border-[var(--color-border-core-subtle)]"
                        }`}
                      >
                        {/* Mini nested table illustration */}
                        <div className="rounded border border-[var(--color-border-container-default)] overflow-hidden">
                          {/* Parent row 1 */}
                          <div className="flex gap-1.5 px-2 py-1.5 bg-[var(--color-fill-surface-recessed)] border-b border-[var(--color-border-container-default)]">
                            <div className="h-1.5 w-3 bg-[var(--color-border-core-default)] rounded-full" />
                            <div className="h-1.5 flex-1 bg-[var(--color-border-core-default)] rounded-full" />
                            <div className="h-1.5 w-10 bg-[var(--color-border-core-default)] rounded-full" />
                          </div>
                          {/* Child rows */}
                          {[0, 1].map(r => (
                            <div key={r} className={`flex gap-1.5 px-2 py-1 pl-5 ${r < 1 ? 'border-b border-[var(--color-border-container-default)]' : ''}`}>
                              <div className="h-1 w-2 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                              <div className="h-1 flex-1 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                              <div className="h-1 w-8 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                            </div>
                          ))}
                          {/* Parent row 2 */}
                          <div className="flex gap-1.5 px-2 py-1.5 bg-[var(--color-fill-surface-recessed)] border-t border-[var(--color-border-container-default)]">
                            <div className="h-1.5 w-3 bg-[var(--color-border-core-default)] rounded-full" />
                            <div className="h-1.5 flex-1 bg-[var(--color-border-core-default)] rounded-full" />
                            <div className="h-1.5 w-10 bg-[var(--color-border-core-default)] rounded-full" />
                          </div>
                          <div className="flex gap-1.5 px-2 py-1 pl-5">
                            <div className="h-1 w-2 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                            <div className="h-1 flex-1 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                            <div className="h-1 w-8 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Book of Business View */}
                    <div>
                      <span className="body-75 text-[var(--color-text-core-default)] mb-2 block">Book of business view</span>
                      <button
                        onClick={() => setViewType("book")}
                        className={`w-full p-4 rounded-lg border-2 transition-colors ${
                          viewType === "book"
                            ? "border-[var(--color-fill-brand-default)] bg-[var(--color-fill-surface-default)] shadow-100"
                            : "border-[var(--color-border-core-default)] bg-[var(--color-fill-surface-default)] hover:border-[var(--color-border-core-subtle)]"
                        }`}
                      >
                        {/* Mini card list illustration */}
                        <div className="space-y-1.5">
                          {[0, 1, 2].map(r => (
                            <div key={r} className="flex items-center gap-2 rounded border border-[var(--color-border-container-default)] px-2 py-1.5">
                              <div className="h-5 w-5 bg-[var(--color-fill-secondary-subtle)] rounded-full shrink-0" />
                              <div className="flex-1 space-y-1">
                                <div className="h-1.5 w-3/4 bg-[var(--color-border-core-default)] rounded-full" />
                                <div className="h-1 w-1/2 bg-[var(--color-fill-secondary-subtle)] rounded-full" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Completion Criteria Section */}
                <div>
                  <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">Completion criteria</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select value={completionAction} onValueChange={setCompletionAction}>
                      <SelectTrigger className="w-auto min-w-[160px] h-9 rounded-[4px] border-[var(--color-border-secondary-default,#8A8A8A)] bg-[var(--color-fill-secondary-default,#FFF)] body-75 text-[var(--color-text-core-default)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--color-fill-surface-default,#FFF)] border-[var(--color-border-core-default)] z-[9999]">
                        <SelectItem value="add-to-sequence">Add to a sequence</SelectItem>
                        <SelectItem value="cold-call">Cold Call</SelectItem>
                        <SelectItem value="log-email">Log an email</SelectItem>
                        <SelectItem value="log-meeting">Log a meeting</SelectItem>
                        <SelectItem value="log-linkedin">Log a linkedin message</SelectItem>
                      </SelectContent>
                    </Select>
                    <input
                      type="number"
                      min={1}
                      value={completionCount}
                      onChange={(e) => setCompletionCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-9 rounded-[4px] border border-[var(--color-border-secondary-default,#8A8A8A)] bg-[var(--color-fill-secondary-default,#FFF)] body-75 text-[var(--color-text-core-default)] text-center px-2"
                    />
                    <span className="body-75 text-[var(--color-text-core-default)]">time per</span>
                    <Select value={completionPer} onValueChange={(v) => setCompletionPer(v as "company" | "contact")}>
                      <SelectTrigger className="w-auto min-w-[110px] h-9 rounded-[4px] border-[var(--color-border-secondary-default,#8A8A8A)] bg-[var(--color-fill-secondary-default,#FFF)] body-75 text-[var(--color-text-core-default)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--color-fill-surface-default,#FFF)] border-[var(--color-border-core-default)] z-[9999]">
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Expiry Date Section */}
                <div>
                  <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">Expiry date</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-between px-3 py-2 border border-[var(--color-border-core-default)] rounded-[4px] bg-[var(--color-fill-surface-default)] hover:bg-[var(--color-fill-secondary-hover)]">
                        <span className="body-100 text-[var(--color-text-core-default)]">
                          {expiryDate ? format(expiryDate, "PPP") : "Select expiry date"}
                        </span>
                        <Calendar className="h-4 w-4 text-[var(--color-text-core-subtle)]" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[var(--color-fill-surface-default)] border-[var(--color-border-core-default)] z-[100]" align="start">
                      <CalendarComponent 
                        mode="single" 
                        selected={expiryDate} 
                        onSelect={setExpiryDate}
                        disabled={(date) => date < new Date()}
                        initialFocus 
                        className="p-3 pointer-events-auto" 
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Access Section */}
                <div>
                  <h3 className="heading-200 text-[var(--color-text-core-default)] mb-4">Access</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] border border-[var(--color-border-secondary-default,#8A8A8A)] bg-[var(--color-fill-secondary-default,#FFF)] body-100 text-[var(--color-text-core-default)] hover:bg-[var(--color-fill-secondary-hover)]"
                      >
                        <span className="truncate">{getAccessSummary()}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 ml-2 text-[var(--color-text-core-subtle)]" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[340px] p-0 bg-[var(--color-fill-surface-default,#FFF)] border border-[var(--color-border-core-default)] shadow-lg z-[9999]"
                      align="start"
                      sideOffset={4}
                    >
                      <div className="p-2 border-b border-[var(--color-border-core-default)]">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-[var(--color-fill-surface-recessed)]">
                          <Search className="h-3.5 w-3.5 text-[var(--color-text-core-subtle)]" />
                          <input
                            type="text"
                            placeholder="Search teams..."
                            value={accessSearchQuery}
                            onChange={(e) => setAccessSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent body-75 text-[var(--color-text-core-default)] placeholder:text-[var(--color-text-core-subtle)] outline-none"
                          />
                        </div>
                      </div>
                      <ScrollArea className="max-h-[400px]">
                        <div className="p-1">
                          {salesOrgTree.map(geo => (
                            <OrgTreeNode
                              key={geo.id}
                              node={geo}
                              depth={0}
                              selectedTeams={selectedTeams}
                              expandedNodes={expandedOrgNodes}
                              toggleExpand={toggleExpand}
                              toggleNode={toggleNode}
                              getNodeState={getNodeState}
                              searchQuery={accessSearchQuery}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 flex flex-col bg-[var(--color-fill-surface-recessed)] overflow-y-auto">
            <div className="p-6">
            {renderPreviewHeader()}
            {renderPreviewTable()}
            {renderResultsCount()}
            </div>
          </div>
        </>}
      </div>
    </div>;
};
export default CreateViewModal;