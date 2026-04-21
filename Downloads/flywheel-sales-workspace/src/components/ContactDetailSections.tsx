import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TableHeaderCell } from "@/components/ui/table-header-cell";
import { TableDataCell } from "@/components/ui/table-data-cell";
import { Mail, Phone, Calendar, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import CollapsibleSection from "@/components/CollapsibleSection";
import QLSummary from "@/components/QLSummary";
import { ContactDetail } from "@/data/contactDetails";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

interface ContactDetailSectionsProps {
  contact: ContactDetail;
  companyLogo?: string;
  /** Whether LinkedIn & Activity sections start open (default true) */
  defaultOpen?: boolean;
  /** Whether to show the Deals section (default true) */
  showDeals?: boolean;
}

const ContactDetailSections = ({
  contact,
  companyLogo,
  defaultOpen = true,
  showDeals = true
}: ContactDetailSectionsProps) => {
  const [expandedActivityIds, setExpandedActivityIds] = useState<string[]>([]);

  return (
    <>
      {/* LinkedIn Sales Navigator Section */}
      <CollapsibleSection title="LinkedIn Sales Navigator" defaultOpen={defaultOpen}>
        <div className="mb-6 border border-[#0A66C2] rounded">
          <div className="bg-[#EDF3F8] px-3 py-2 border-b border-[#0A66C2] flex items-center gap-2">
            <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-xs font-semibold text-[#0A66C2] tracking-wider">SALES NAVIGATOR</span>
          </div>
          
          <div className="p-4">
            {/* Contact Avatar */}
            <div className="mb-3">
              <img
                src={companyLogo || companyLogoPlaceholder}
                alt={`${contact.company} logo`}
                className="w-12 h-12 rounded-full object-cover" />
              
            </div>

            {/* Contact Name */}
            <a href="#" className="text-[#0A66C2] hover:underline text-base font-normal mb-1 block">
              {contact.name}
            </a>

            {/* Role */}
            <p className="text-muted-foreground text-sm mb-2">{contact.linkedInInfo.role}</p>

            {/* Location */}
            <p className="text-muted-foreground text-sm mb-3">
              {contact.linkedInInfo.location}
            </p>

            <p className="text-muted-foreground text-sm mb-3">
              {contact.linkedInInfo.yearsInRole} in current role
            </p>

            {/* Previous Companies */}
            {contact.linkedInInfo.previousCompanies &&
            <p className="text-muted-foreground text-sm mb-4">
                Previously: {contact.linkedInInfo.previousCompanies}
              </p>
            }

            {/* View in Sales Navigator Button */}
            <Button variant="outline" className="mb-4 border-[#0A66C2] text-[#0A66C2] hover:bg-[#EDF3F8] w-auto px-4" size="small">
              View in Sales Navigator
            </Button>

            {/* Footer Links */}
            <div className="flex gap-4 pt-3 border-t border-core-subtle">
              <a href="#" className="text-muted-foreground text-sm hover:underline">Help</a>
              <a href="#" className="text-muted-foreground text-sm hover:underline">Privacy and Terms</a>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Recent Conversions Section */}
      <CollapsibleSection title="Recent Conversions">
        {/* Search Box */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search" className="w-full h-[44px] pl-12 pr-4 border border-core-subtle rounded-full bg-background text-foreground body-100 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            
            <Select defaultValue="3">
              <SelectTrigger className="w-[140px] h-[36px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 selected</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            
            <Select defaultValue="30">
              <SelectTrigger className="w-[160px] h-[36px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-core-subtle rounded-lg overflow-hidden mb-4">
          <table className="w-full">
            <thead>
              <tr className="flex">
                <TableHeaderCell className="flex-1 w-auto">
                  <Button variant="ghost" className="h-auto p-0 body-100 font-medium text-foreground hover:text-muted-foreground">
                    Contact
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHeaderCell>
                <TableHeaderCell className="flex-1 w-auto">
                  <Button variant="ghost" className="h-auto p-0 body-100 font-medium text-foreground hover:text-muted-foreground">
                    Recent Conversion
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {contact.name === "Jennifer Park" ?
              <>
                  <tr className="flex">
                    <TableDataCell className="flex-1 w-auto">
                      <span className="body-100 text-[#8B1538]">{contact.name}</span>
                    </TableDataCell>
                    <TableDataCell className="flex-1 w-auto">
                      <div className="flex flex-col gap-1">
                        <span className="body-100 text-foreground">Invited User Accepted Invitation</span>
                        <span className="body-50 text-muted-foreground">(Additional Info) | API</span>
                        <span className="body-50 text-muted-foreground">2 days ago</span>
                      </div>
                    </TableDataCell>
                  </tr>
                  <tr className="flex">
                    <TableDataCell className="flex-1 w-auto">
                      <span className="body-100 text-[#8B1538]">{contact.name}</span>
                    </TableDataCell>
                    <TableDataCell className="flex-1 w-auto">
                      <div className="flex flex-col gap-1">
                        <span className="body-100 text-foreground">Invited User Accepted Invitation</span>
                        <span className="body-50 text-muted-foreground">(Additional Info) | API</span>
                        <span className="body-50 text-muted-foreground">7 days ago</span>
                      </div>
                    </TableDataCell>
                  </tr>
                </> :
              contact.name === "Priya Sharma" ?
              <tr className="flex">
                  <TableDataCell className="flex-1 w-auto">
                    <span className="body-100 text-[#8B1538]">{contact.name}</span>
                  </TableDataCell>
                  <TableDataCell className="flex-1 w-auto">
                    <div className="flex flex-col gap-1">
                      <span className="body-100 text-foreground">Viewed Pricing Page</span>
                      <span className="body-50 text-muted-foreground">5 days ago</span>
                    </div>
                  </TableDataCell>
                </tr> :

              <tr className="flex">
                  <TableDataCell className="flex-1 w-auto" colSpan={2}>
                    <span className="body-100 text-muted-foreground">No recent conversions for this contact.</span>
                  </TableDataCell>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      {/* Recent Activity Section */}
      <CollapsibleSection title="Recent Activity" defaultOpen={defaultOpen}>
        {/* Search and Action Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search activities" className="w-full h-[44px] pl-12 pr-4 border border-core-subtle rounded-full bg-background text-foreground body-100 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <Select defaultValue="create">
            <SelectTrigger className="w-[180px] h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create">Create activities</SelectItem>
              <SelectItem value="email">Create email</SelectItem>
              <SelectItem value="call">Create call</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Select defaultValue="all-time">
              <SelectTrigger variant="transparent" className="w-auto min-h-[40px] px-3 gap-2 trellis-text-heading-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All time so far</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-activity">
              <SelectTrigger variant="transparent" className="w-auto min-h-[40px] px-3 gap-2 trellis-text-heading-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-activity">Activity</SelectItem>
                <SelectItem value="emails">Emails</SelectItem>
                <SelectItem value="calls">Calls</SelectItem>
                <SelectItem value="meetings">Meetings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select defaultValue="expand">
            <SelectTrigger variant="transparent" className="w-auto min-h-[40px] px-3 gap-2 trellis-text-heading-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expand">Collapse all</SelectItem>
              <SelectItem value="collapse">Expand all</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-3">
          {contact.recentActivity && contact.recentActivity.length > 0 ? contact.recentActivity.map((activity, index) => {
            const activityIcon = activity.type === 'email' ? Mail : activity.type === 'call' ? Phone : Calendar;
            const ActivityIcon = activityIcon;
            const isExpanded = expandedActivityIds.includes(activity.id);
            return (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className="flex flex-col items-center h-full">
                  <div className="w-8 h-8 rounded-full border border-core-subtle bg-trellis-white flex items-center justify-center flex-shrink-0">
                    <ActivityIcon className="h-4 w-4 text-foreground" />
                  </div>
                  {index < contact.recentActivity.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                </div>

                <div className="flex-1 border border-core-subtle rounded-lg p-4 bg-trellis-white">
                  <div
                    className="flex items-center justify-between mb-2 cursor-pointer"
                    onClick={() => setExpandedActivityIds((prev) =>
                    prev.includes(activity.id) ? prev.filter((i) => i !== activity.id) : [...prev, activity.id]
                    )}>
                    
                    <div className="flex items-center gap-2">
                      <ChevronRight className={`h-4 w-4 text-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      <span className="link-100 text-foreground">{activity.title}</span>
                    </div>
                    <span className="detail-100 text-muted-foreground whitespace-nowrap ml-2">
                      {activity.date} at {activity.time}
                    </span>
                  </div>
                  {isExpanded && activity.preview &&
                  <div className="body-100 text-muted-foreground ml-6 mt-2 italic">
                      {activity.preview}
                    </div>
                  }
                </div>
              </div>);

          }) : <p className="body-100 text-muted-foreground">No recent activity for this contact.</p>}
        </div>
      </CollapsibleSection>

      {/* QL Summary Section */}
      <CollapsibleSection title="QL Summary">
        <div className="pt-5">
          <QLSummary
            hasRecentQL={contact.qlSummary.hasRecentQL}
            recentQLMessage={contact.qlSummary.recentQLMessage}
            hasPastQLs={contact.qlSummary.hasPastQLs}
            pastQLsMessage={contact.qlSummary.pastQLsMessage} />
          
        </div>
      </CollapsibleSection>

      {/* Deals Section */}
      {showDeals &&
      <CollapsibleSection title="Deals">
        {contact.deals && contact.deals.length > 0 ? contact.deals.map((deal) =>
        <div key={deal.id} className="border border-core-subtle rounded-lg p-4 mb-4">
            <h4 className="heading-200 text-[#8B1538] mb-3">{deal.title}</h4>
            
            <div className="mb-2">
              <span className="body-100 text-muted-foreground">Amount: </span>
              <span className="body-100 text-foreground">${deal.amount.toLocaleString()}</span>
            </div>
            
            <div className="mb-3">
              <span className="body-100 text-muted-foreground">Close date: </span>
              <span className="body-100 text-foreground">{deal.closeDate}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="body-100 text-muted-foreground">Stage:</span>
              <Select defaultValue={deal.stage}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospecting">Prospecting</SelectItem>
                  <SelectItem value="qualification">Qualification</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed-won">Closed Won</SelectItem>
                  <SelectItem value="closed-lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step, idx) =>
            <div key={idx} className={`h-2 flex-1 rounded-sm ${idx < deal.progress ? 'bg-foreground' : 'bg-gray-200'}`} />
            )}
            </div>
            
            <p className="body-100 text-foreground">Deal with {contact.company}</p>
          </div>
        ) : <p className="body-100 text-muted-foreground mb-4">No deals associated with this contact.</p>}
      </CollapsibleSection>
      }

      {/* Notes Section */}
      <CollapsibleSection title="Notes">
        <div className="space-y-3">
          {contact.notes && contact.notes.length > 0 ? contact.notes.map((note) =>
          <div key={note.id} className="border-b border-core-subtle pb-3 last:border-0 last:pb-0">
              <p className="body-100 text-foreground mb-1">{note.content}</p>
              <p className="caption text-muted-foreground">{note.date} at {note.time}</p>
            </div>
          ) : <p className="body-100 text-muted-foreground">No notes for this contact yet.</p>}
          <Textarea placeholder="Add a new note..." className="min-h-[80px] resize-none" />
        </div>
      </CollapsibleSection>
    </>);

};

export default ContactDetailSections;