import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DiallerCommunicator from "@/components/DiallerCommunicator";

import { Card } from "@/components/ui/card";
import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TableHeaderCell } from "@/components/ui/table-header-cell";
import { TableDataCell } from "@/components/ui/table-data-cell";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const contacts = [
  { id: "1", name: "John Mitchell", company: "Acme Corp", title: "President & Co-founder" },
  { id: "2", name: "Seraphina Dubois", company: "Zephyr Dynamics", title: "VP of Operations" },
  { id: "3", name: "Jasper Thornton", company: "Luminary Industries", title: "CTO" },
  { id: "4", name: "Genevieve Bellweather", company: "Stellar Solutions", title: "Head of Procurement" },
  { id: "5", name: "Barnaby Chumley", company: "Apex Innovations", title: "Director of Sales" },
  { id: "6", name: "Alistair Finch", company: "Veridian Systems", title: "CFO" },
  { id: "7", name: "Wilhelmina Quince", company: "Galactic Enterprises", title: "CEO" },
  { id: "8", name: "Montgomery Sterling", company: "Zenith Technologies", title: "VP Engineering" },
  { id: "9", name: "Beatrice Ainsworth", company: "Nova Dynamics", title: "Head of Marketing" },
  { id: "10", name: "Reginald Featherstonehaugh", company: "Celestial Innovations", title: "COO" },
  { id: "11", name: "Cecily Fairweather", company: "Ethereal Solutions", title: "Product Manager" },
];

const activityItems = [
  { id: "1", type: "email", direction: "inbound", date: "21 Dec 2022 at 16:49 GMT+1", subject: "Re: Partnership Opportunity", body: "Hi Matthew,\n\nThank you for reaching out regarding the partnership opportunity. I've reviewed the proposal and I'm very interested in exploring this further. Could we schedule a call next week to discuss the details?\n\nLooking forward to hearing from you.\n\nBest regards,\nJohn Mitchell" },
  { id: "2", type: "email", direction: "outbound", date: "20 Dec 2022 at 14:22 GMT+1", subject: "Q4 Budget Approval", body: "Hi John,\n\nI wanted to follow up on the Q4 budget discussion. Please let me know once your team has approved the allocation for the new tooling initiative and I'll send over the updated pricing sheet.\n\nThanks,\nMatthew Jones" },
  { id: "3", type: "email", direction: "inbound", date: "19 Dec 2022 at 10:15 GMT+1", subject: "Meeting Notes - Dec 15", body: "Hi Matthew,\n\nAttached are the meeting notes from our call on December 15th. Key takeaways include the timeline for onboarding and the integration requirements we discussed.\n\nLet me know if I missed anything.\n\nBest,\nJohn Mitchell" },
  { id: "4", type: "email", direction: "inbound", date: "18 Dec 2022 at 09:30 GMT+1", subject: "Re: Contract Review", body: "Hi Matthew,\n\nI've had our legal team review the contract and they have a few minor redlines. I'll send those over by end of day tomorrow. Nothing major — mostly standard compliance language.\n\nRegards,\nJohn Mitchell" },
  { id: "5", type: "email", direction: "outbound", date: "17 Dec 2022 at 11:45 GMT+1", subject: "Introduction - New Team Member", body: "Hi John,\n\nI wanted to introduce you to Maria Chen on our side, who will be supporting your account going forward for day-to-day questions.\n\nBest,\nMatthew Jones" },
  { id: "6", type: "email", direction: "inbound", date: "16 Dec 2022 at 15:00 GMT+1", subject: "Holiday Schedule", body: "Hi Matthew,\n\nJust a heads up that our office will be closed from December 23rd through January 2nd. If there's anything urgent, please reach out before then.\n\nHappy holidays!\nJohn Mitchell" },
];

const conversions = [
  { id: "1", name: "Invited User Accepted Invitation (Additional Info) | API", timeAgo: "2 days ago", lastTouch: "--", lastTouchDetail: "" },
  { id: "2", name: "Viewed Pricing Page", timeAgo: "5 days ago", lastTouch: "--", lastTouchDetail: "" },
  { id: "3", name: "Invited User Accepted Invitation (Additional Info) | API", timeAgo: "7 days ago", lastTouch: "4 months ago", lastTouchDetail: "Rosie Onslow Wyld sent an email" },
];

const PowerHour = () => {
  const navigate = useNavigate();
  const [selectedContactId, setSelectedContactId] = useState("1");
  const [expandedActivityIds, setExpandedActivityIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [callOutcomes, setCallOutcomes] = useState<Record<string, string>>({});
  const [callScriptMode, setCallScriptMode] = useState<"script" | "bullets">(() => {
    return (localStorage.getItem("callScriptMode") as "script" | "bullets") || "script";
  });

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const handleCallClick = useCallback(() => {
    setIsDialerOpen(true);
  }, []);

  const handleEndCall = useCallback(() => {
    // Assign a simulated call outcome
    const outcomes = ["Connected", "No Answer", "Left Voicemail", "Busy"];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    setCallOutcomes((prev) => ({ ...prev, [selectedContactId]: outcome }));

    // Close dialer, show loading state, then advance to next contact
    setIsDialerOpen(false);
    const currentIndex = contacts.findIndex((c) => c.id === selectedContactId);
    if (currentIndex < contacts.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        const nextContact = contacts[currentIndex + 1];
        setSelectedContactId(nextContact.id);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }, 1200);
    }
  }, [selectedContactId]);

  const handleDialerClose = useCallback(() => {
    setIsDialerOpen(false);
  }, []);


  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const toggleActivity = (id: string) => {
    setExpandedActivityIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <style>{`
        @keyframes overlayFade {
          0% { opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex flex-col bg-fill-surface-default">
        {/* Header */}
        <div className="h-16 bg-trellis-magenta-1400 flex items-center justify-between px-6 shrink-0">
          <span className="heading-100 text-white">Power Hour</span>
          <button
            onClick={() => navigate("/prospecting")}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <TrellisIcon name="remove" size={20} className="brightness-0 invert" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Contact list */}
          <div className="w-[280px] border-r border-border-core-subtle overflow-y-auto shrink-0 pt-[44px]">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`w-full text-left px-6 py-3 transition-colors ${
                  selectedContactId === contact.id
                    ? "rounded-l-[var(--borderRadius-100,4px)] rounded-r-none border-l-4 border-l-[var(--color-border-core-pressed,#141414)] bg-[var(--color-fill-tertiary-disabled,#F5F5F5)]"
                    : "hover:bg-trellis-neutral-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="body-100 text-foreground truncate">{contact.name}</span>
                  {callOutcomes[contact.id] && (
                    <Tag variant={
                      callOutcomes[contact.id] === "Connected" ? "green" :
                      callOutcomes[contact.id] === "Left Voicemail" ? "blue" :
                      callOutcomes[contact.id] === "No Answer" ? "orange" :
                      "neutral"
                    }>
                      {callOutcomes[contact.id]}
                    </Tag>
                  )}
                </div>
                <div className="detail-200 text-muted-foreground">{contact.company}</div>
              </button>
            ))}
          </div>

          {/* Right area: header + content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Transition loading overlay */}
            {isTransitioning && (
              <div className="absolute inset-0 z-40 bg-fill-surface-default flex items-center justify-center transition-opacity duration-500"
                style={{ animation: 'overlayFade 2s ease-in-out' }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
                  <span className="body-100 text-muted-foreground">Loading next contact…</span>
                </div>
              </div>
            )}
            <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Contact header - full width, white bg */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-border-core-subtle shrink-0">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-trellis-neutral-300 text-foreground heading-50">
                    {getInitials(selectedContact.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="heading-200 text-foreground">{selectedContact.name}</h1>
                  <div className="body-100 text-muted-foreground">{selectedContact.title}</div>
                </div>
              </div>
              <Button variant="primary" size="medium" onClick={handleCallClick}>
                Call {selectedContact.name.split(" ")[0]}
                <TrellisIcon name="calling" size={16} className="brightness-0 invert ml-1" />
              </Button>
            </div>

            {/* Scrollable content area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Center content */}
              <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-fill-surface-recessed,#F0F0F0)]">

            {/* Recent Activity */}
            <Card className="border border-border-core-subtle rounded-[var(--borderRadius-100,4px)] mb-6">
              <div className="p-4">
                <h2 className="heading-200 text-foreground mb-4">Recent activity</h2>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-4">
                  <Select defaultValue="all-time">
                    <SelectTrigger className="w-auto gap-1 border border-border-core-default rounded-[var(--borderRadius-100,4px)] bg-fill-field-default h-8 px-3">
                      <SelectValue placeholder="All time so far" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-time">All time so far</SelectItem>
                      <SelectItem value="last-30">Last 30 days</SelectItem>
                      <SelectItem value="last-7">Last 7 days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="activity">
                    <SelectTrigger className="w-auto gap-1 border border-border-core-default rounded-[var(--borderRadius-100,4px)] bg-fill-field-default h-8 px-3">
                      <SelectValue placeholder="Activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="emails">Emails</SelectItem>
                      <SelectItem value="calls">Calls</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="ml-auto">
                    <Select defaultValue="collapse">
                      <SelectTrigger className="w-auto gap-1 border border-border-core-default rounded-[var(--borderRadius-100,4px)] bg-fill-field-default h-8 px-3">
                        <SelectValue placeholder="Collapse all" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collapse">Collapse all</SelectItem>
                        <SelectItem value="expand">Expand all</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Activity items */}
                <div className="space-y-2">
                  {activityItems.map((item, index) => (
                    <div key={item.id} className="flex items-stretch gap-4">
                      {/* Timeline column */}
                      <div className="relative flex flex-col items-center shrink-0 w-10">
                        {/* Circle icon */}
                        <div className="w-10 h-10 rounded-full border border-border-core-subtle bg-white flex items-center justify-center shrink-0 z-10">
                          <TrellisIcon name="email" size={18} className="opacity-70" />
                        </div>
                        {/* Connecting line */}
                        {index < activityItems.length - 1 && (
                          <div className="flex-1 w-px bg-border-core-subtle" />
                        )}
                      </div>

                      {/* Card */}
                      <div className="flex-1">
                        <div
                          className="flex items-center gap-4 px-4 py-3 border border-border-core-subtle rounded-[var(--borderRadius-100,4px)] cursor-pointer"
                          onClick={() => toggleActivity(item.id)}
                        >
                          {/* Chevron */}
                          <div className="shrink-0">
                            <TrellisIcon
                              name="right"
                              size={14}
                              className={`opacity-60 transition-transform ${expandedActivityIds.includes(item.id) ? "rotate-90" : "rotate-0"}`}
                            />
                          </div>

                          {/* Description */}
                          <div className="flex-1">
                            <span className="heading-50 text-foreground">
                              {item.direction === "inbound" ? "Inbound email from" : "Outbound email to"}{" "}
                              <span className="heading-50 text-foreground underline">
                                {item.direction === "inbound" ? selectedContact?.name : selectedContact?.name}
                              </span>
                            </span>
                          </div>

                          {/* Date */}
                          <span className="detail-100 text-muted-foreground whitespace-nowrap">
                            {item.date}
                          </span>
                        </div>

                        {/* Expanded email content */}
                        {expandedActivityIds.includes(item.id) && (
                          <div className="mt-1 border border-border-core-subtle rounded-[var(--borderRadius-100,4px)] p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <TrellisIcon name="email" size={14} className="opacity-60" />
                              <span className="heading-50 text-foreground">{item.subject}</span>
                            </div>
                            <div className="detail-100 text-muted-foreground mb-3">
                              From: {item.direction === "inbound" ? selectedContact?.name : "Matthew Jones"} &middot; {item.date}
                            </div>
                            <div className="body-100 text-foreground whitespace-pre-line">
                              {item.body}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Conversions */}
            <Card className="border border-border-core-subtle rounded-[var(--borderRadius-100,4px)]">
              <div className="p-4">
                <h2 className="heading-200 text-foreground mb-4">Recent Conversions</h2>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[160px] pl-3 pr-8 py-1.5 border border-border-core-default rounded-[var(--borderRadius-100,4px)] bg-fill-field-default body-100 text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <TrellisIcon name="search" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="body-100 text-muted-foreground">Conversions:</span>
                    <Select defaultValue="3-selected">
                      <SelectTrigger className="w-auto gap-1 border border-border-core-default rounded-[var(--borderRadius-100,4px)] bg-fill-field-default h-8 px-3">
                        <SelectValue placeholder="3 selected" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-selected">3 selected</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="body-100 text-muted-foreground">Date Range:</span>
                    <Select defaultValue="30-days">
                      <SelectTrigger className="w-auto gap-1 border border-border-core-default rounded-[var(--borderRadius-100,4px)] bg-fill-field-default h-8 px-3">
                        <SelectValue placeholder="Last 30 days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30-days">Last 30 days</SelectItem>
                        <SelectItem value="90-days">Last 90 days</SelectItem>
                        <SelectItem value="all-time">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Conversions table */}
                <table className="w-full">
                  <thead>
                    <tr className="flex">
                      <TableHeaderCell className="flex-1 w-auto">Recent Conversion</TableHeaderCell>
                      <TableHeaderCell className="flex-1 w-auto">Last Touch</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {conversions.map((conversion) => (
                      <tr key={conversion.id} className="flex">
                        <TableDataCell className="flex-1 w-auto">
                          <div className="body-100 text-foreground">{conversion.name}</div>
                          <div className="detail-200 text-muted-foreground">{conversion.timeAgo}</div>
                        </TableDataCell>
                        <TableDataCell className="flex-1 w-auto">
                          {conversion.lastTouch === "--" ? (
                            <span className="body-100 text-muted-foreground">--</span>
                          ) : (
                            <div>
                              <div className="body-100 text-foreground">{conversion.lastTouch}</div>
                              {conversion.lastTouchDetail && (
                                <div className="detail-200 text-muted-foreground">
                                  <span className="text-foreground font-medium underline">Rosie Onslow Wyld</span>{" "}
                                  sent an email
                                </div>
                              )}
                            </div>
                          )}
                        </TableDataCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
            </div>{/* end inner flex (center only) */}
            </div>{/* end opacity wrapper */}
          </div>{/* end column wrapper */}

          {/* Right sidebar - Talking Points */}
          <div className="w-[400px] border-l border-border-core-subtle overflow-y-auto shrink-0 p-6">
           <div className="flex items-center justify-between mb-4">
              <h2 className="heading-400 text-foreground">Talking Points</h2>
              <div className="flex items-center gap-2">
                <span className="detail-200 text-muted-foreground">Bullet points</span>
                <Switch
                  className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
                  checked={(localStorage.getItem("callScriptMode") || "script") === "bullets"}
                  onCheckedChange={(checked) => {
                    const mode = checked ? "bullets" : "script";
                    localStorage.setItem("callScriptMode", mode);
                    setCallScriptMode(mode);
                  }}
                />
              </div>
            </div>
            {callScriptMode === "script" ? (
              <p className="body-100 text-foreground leading-relaxed">
                "I noticed Repfabric recently partnered with Orbweaver to automate data exchange for manufacturers.
                Usually, increasing the volume of automated data leads to fragmented 'Franken-stacks' where reps
                struggle to find a single source of truth. HubSpot's Sales Hub consolidates these data streams into
                one view, using Breeze AI to automate prospecting so your team stays focused on closing."
              </p>
            ) : (
              <ul className="list-disc pl-4 space-y-1.5">
                <li className="body-100 text-foreground leading-relaxed">Repfabric partnered with Orbweaver to automate data exchange for manufacturers</li>
                <li className="body-100 text-foreground leading-relaxed">Automated data often leads to fragmented "Franken-stacks" — reps can't find a single source of truth</li>
                <li className="body-100 text-foreground leading-relaxed">HubSpot Sales Hub consolidates data streams into one view</li>
                <li className="body-100 text-foreground leading-relaxed">Breeze AI automates prospecting so team stays focused on closing</li>
              </ul>
            )}
            <div className="flex items-center gap-3 mt-4">
              <span className="detail-100 text-muted-foreground">Are these talking points helpful?</span>
              <TrellisIcon name="thumbsUp" size={16} className="opacity-60 cursor-pointer hover:opacity-100 transition-opacity" />
              <TrellisIcon name="thumbsDown" size={16} className="opacity-60 cursor-pointer hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>{/* end outer flex */}
      </div>

      <DiallerCommunicator
        isOpen={isDialerOpen}
        onClose={handleDialerClose}
        contactName={selectedContact.name}
        contactPhone="+1 (555) 123-4567"
        onEndCall={handleEndCall}
      />
    </>
  );
};

export default PowerHour;
