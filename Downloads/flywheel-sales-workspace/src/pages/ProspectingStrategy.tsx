import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { ThumbsUp, ThumbsDown, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { prospectingCompanies } from "@/data/prospectingCompanies";
import { companyDetails } from "@/data/companyDetails";
import { contactDetails } from "@/data/contactDetails";
import ContactDetailSections from "@/components/ContactDetailSections";
import { calculateCompanyStatus } from "@/utils/companyStatusUtils";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { TextEditPopup } from "@/components/TextEditPopup";

import { companyStrategies, defaultStrategy } from "@/data/companyStrategies";

const ProspectingStrategy = () => {
  const { companyId } = useParams<{companyId: string;}>();
  const navigate = useNavigate();
  const [selectedContactIndex, setSelectedContactIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("strategy");
  const [expandedOutreach, setExpandedOutreach] = useState<Record<string, boolean>>({});
  const [expandedEmails, setExpandedEmails] = useState<Record<string, boolean>>({});
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [addedContactIds, setAddedContactIds] = useState<Set<string>>(new Set());
  const [loadingContactIds, setLoadingContactIds] = useState<Set<string>>(new Set());
  const [removedContactIds, setRemovedContactIds] = useState<Set<string>>(new Set());
  const [feedbackContactId, setFeedbackContactId] = useState<string | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<string>("no-longer-works");
  const [feedbackOtherText, setFeedbackOtherText] = useState("");
  const [feedbackRemove, setFeedbackRemove] = useState(false);
  const [callScriptMode, setCallScriptMode] = useState<"script" | "bullets">(() => {
    return (localStorage.getItem("callScriptMode") as "script" | "bullets") || "script";
  });
  const outreachContainerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevCompanyIdRef = useRef(companyId);

  useEffect(() => {
    if (prevCompanyIdRef.current !== companyId) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 600);
      prevCompanyIdRef.current = companyId;
      return () => clearTimeout(timer);
    }
  }, [companyId]);

  const getEditableContent = (key: string, defaultValue: string) => {
    return editedContent[key] ?? defaultValue;
  };

  const setEditableContent = (key: string, value: string) => {
    setEditedContent(prev => ({ ...prev, [key]: value }));
  };


  // Get all companies with calculated status for sub-nav
  const companies = useMemo(() => {
    return prospectingCompanies.map((company) => ({
      ...company,
      status: calculateCompanyStatus(company, new Set())
    })).filter((c) => ["New", "Unworked P1", "Unworked QL", "In Progress", "Over SLA"].includes(c.status));
  }, []);

  const currentCompany = companies.find((c) => c.id === companyId) || companies[0];
  const currentCompanyDetails = companyDetails[currentCompany?.id || "1"];
  const strategy = companyStrategies[currentCompany?.id || ""] || defaultStrategy;

  // Get contacts for the current company
  const baseOutreachTargets = currentCompany?.recommendedContacts?.slice(0, 3) || [];
  const addedContacts = currentCompany?.recommendedContacts?.filter(c => addedContactIds.has(c.id)) || [];
  const outreachTargets = [...baseOutreachTargets, ...addedContacts].filter(c => !removedContactIds.has(c.id));

  // Other contacts: remaining contacts not in outreach targets
  const otherContacts = useMemo(() => {
    const outreachIds = new Set(outreachTargets.map(c => c.id));
    return (currentCompany?.recommendedContacts || []).filter(c => !outreachIds.has(c.id)).slice(0, 10);
  }, [currentCompany, addedContactIds]);

  const handleAddToOutreach = useCallback((contactId: string) => {
    setAddedContactIds(prev => new Set(prev).add(contactId));
    setLoadingContactIds(prev => new Set(prev).add(contactId));
    setTimeout(() => {
      setLoadingContactIds(prev => {
        const next = new Set(prev);
        next.delete(contactId);
        return next;
      });
    }, 3000);
  }, []);

  const openFeedback = (contactId: string) => {
    setFeedbackContactId(contactId);
    setFeedbackReason("no-longer-works");
    setFeedbackOtherText("");
    setFeedbackRemove(false);
  };

  const submitFeedback = () => {
    if (feedbackRemove && feedbackContactId) {
      setRemovedContactIds(prev => new Set(prev).add(feedbackContactId));
    }
    setFeedbackContactId(null);
  };

  const selectedContact = outreachTargets[selectedContactIndex];
  const selectedContactDetail = selectedContact ? contactDetails[selectedContact.id] : null;

  const getStatusBadgeVariant = (status: string): "status-orange" | "status-blue" | "status-yellow" | "status-green" | "status-gray" => {
    switch (status) {
      case "New":return "status-blue";
      case "Unworked QL":return "status-orange";
      case "Unworked P1":return "status-blue";
      case "In Progress":return "status-yellow";
      case "Over SLA":return "status-orange";
      case "Worked":return "status-green";
      default:return "status-gray";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "Unworked QL":return "QL";
      case "Unworked P1":return "Unworked";
      default:return status;
    }
  };

  const toggleOutreach = (contactId: string, section: string) => {
    const key = `${contactId}-${section}`;
    setExpandedOutreach((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isOutreachExpanded = (contactId: string, section: string) => {
    const key = `${contactId}-${section}`;
    return expandedOutreach[key] ?? section === "call";
  };

  if (!currentCompany) return null;

  return (
    <Layout>
      <WorkspaceHeader activeTab="prospecting" hideTabs hideTitle subtitle={
      <div>
          <button
          onClick={() => navigate("/prospecting")}
          className="flex items-center gap-1 body-100 text-muted-foreground hover:text-foreground transition-colors">
          
            <TrellisIcon name="left" size={12} />
            P1 companies
          </button>
          <h1 className="heading-200 text-foreground mt-1">Prospecting Strategy</h1>
        </div>
      } />
      <div className="flex flex-col h-[calc(100vh-96px)] bg-background">

        {/* Three-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left column - Company sub-nav */}
          <nav className="w-[280px] border-r border-core-subtle bg-card overflow-y-auto shrink-0 pt-[44px]">
            {companies.map((company) =>
            <button
              key={company.id}
              onClick={() => navigate(`/prospecting/strategy/${company.id}`)}
              className={`w-full text-left px-6 py-3 transition-colors ${
              company.id === currentCompany.id ?
              "rounded-l-[var(--borderRadius-100,4px)] rounded-r-none border-l-4 border-l-[var(--color-border-core-pressed,#141414)] bg-[var(--color-fill-tertiary-disabled,#F5F5F5)]" :
              "hover:bg-trellis-neutral-100"}`
              }>
              
                <div className="body-100 text-foreground">{company.name}</div>
                <div className="flex items-center gap-1 mt-1">
                  {(company.touches?.touchStatuses || []).slice(0, 5).map((status: string, i: number) =>
                <div key={i} className="h-3 w-3 rounded-full" style={{
                  background: status === "completed" ? "var(--color-fill-transitional-progress-success-gradient-color-1, #00823A)" : status === "scheduled" ? "var(--color-fill-caution-default, #E5780A)" : "var(--color-fill-surface-recessed, #F0F0F0)"
                }} />
                )}
                </div>
              </button>
            )}
          </nav>

          {/* Middle + Right columns wrapper */}
          <div className="flex flex-1 overflow-hidden relative">
            {/* Transition loading overlay */}
            {isTransitioning && (
              <div className="absolute inset-0 z-40 bg-card flex items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="body-100 text-muted-foreground">Loading company…</span>
                </div>
              </div>
            )}

          {/* Middle column - Strategy content */}
          <div className={`flex-[3] overflow-y-auto pl-12 pt-12 pb-12 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <div data-tour="strategy-company-card" className="bg-fill-secondary rounded-300 border border-core-subtle shadow-100 overflow-hidden flex flex-col gap-12">
            {/* Company header */}
            <div className="px-6 pt-4 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={companyLogoPlaceholder} alt="" className="w-10 h-10 rounded" />
                  <div>
                    <div className="flex items-center gap-2">
                      <a href={`https://${currentCompany.website}`} target="_blank" rel="noopener noreferrer" className="body-100 text-text-interactive hover:underline flex items-center gap-1">
                        https://{currentCompany.website} <TrellisIcon name="externalLink" size={12} />
                      </a>
                    </div>
                    <h2 className="heading-300 text-foreground">{currentCompany.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="body-100 text-muted-foreground">
                        {currentCompanyDetails?.industry || currentCompany.industry} | {currentCompanyDetails?.employeeSize || "—"} employees
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getStatusBadgeVariant(currentCompany.status)}>
                    {getStatusLabel(currentCompany.status)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {(currentCompany.touches?.touchStatuses || []).slice(0, 5).map((status: string, i: number) =>
                      <div key={i} className="h-3 w-3 rounded-full" style={{
                        background: status === "completed" ? "var(--color-fill-transitional-progress-success-gradient-color-1, #00823A)" : status === "scheduled" ? "var(--color-fill-caution-default, #E5780A)" : "var(--color-fill-surface-recessed, #F0F0F0)"
                      }} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b-0 rounded-none bg-transparent px-6 h-auto gap-0">
                {["Strategy", "Company Data", "Activity", `Deals (${currentCompanyDetails?.deals?.length || 0})`, "Notes"].map((tab) => {
                    const tabValue = tab.toLowerCase().split(" ")[0].replace("(", "");
                    return (
                      <TabsTrigger
                        key={tab}
                        value={tabValue === "deals" ? "deals" : tabValue}
                        className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 heading-50 text-muted-foreground data-[state=active]:text-foreground">
                        
                      {tab}
                    </TabsTrigger>);

                  })}
              </TabsList>

              <TabsContent value="strategy" className="px-6 pt-12 pb-6 mt-0">
                {/* Business Intelligence */}
                <Collapsible defaultOpen className="mb-12">
                  <CollapsibleTrigger className="flex items-center gap-2 w-full group">
                    <TrellisIcon name="downCarat" size={12} className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                    <h3 className="heading-200 text-foreground">Business Intelligence</h3>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <p className="body-100 text-foreground leading-relaxed">
                      {strategy.businessIntelligence}
                    </p>
                    {currentCompanyDetails &&
                      <p className="body-100 text-foreground leading-relaxed mt-4">
                        Currently, the company is in a growth phase. Their top revenue streams are: 1) SaaS recurring license fees for the core platform, 2) Professional services for implementation and data migration, and 3) Integration-led revenue through partnerships with existing and back-office systems.
                      </p>
                      }
                  </CollapsibleContent>
                </Collapsible>

                {/* Recent Company News & Triggers */}
                <Collapsible defaultOpen className="mb-12">
                  <CollapsibleTrigger className="flex items-center gap-2 w-full group">
                    <TrellisIcon name="downCarat" size={12} className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                    <h3 className="heading-200 text-foreground">Recent Company News & Triggers</h3>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <p className="heading-50 text-foreground mb-1">{strategy.recentNews.title}</p>
                    <p className="body-100 text-foreground leading-relaxed">
                      {strategy.recentNews.description}
                    </p>
                    <h4 className="heading-50 text-foreground mt-4 mb-1">Strategic Integration of Empowering Systems</h4>
                    <p className="body-100 text-foreground leading-relaxed">
                      {strategy.strategicIntegration}
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Outreach Targets */}
                <Collapsible defaultOpen className="mb-8">
                  <CollapsibleTrigger className="flex items-center gap-2 w-full group">
                    <TrellisIcon name="downCarat" size={12} className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                    <h3 className="heading-200 text-foreground">Outreach Targets</h3>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4" ref={outreachContainerRef}>

                  {outreachTargets.map((contact, index) => {
                        const contactDetail = contactDetails[contact.id];
                        return (
                          <div
                            key={contact.id}
                            className="mb-6 rounded-100 border border-core-subtle overflow-hidden">
                            
                        {/* Card header */}
                        <div
                              className="flex items-center gap-3 px-6 py-4 bg-[var(--color-fill-surface-recessed)] cursor-pointer"
                              onClick={() => setSelectedContactIndex(index)}>
                              
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={contact.avatarColor + " text-white heading-50"}>
                              {contact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="heading-100 text-text-interactive">{contact.name}</div>
                            <div className="body-100 text-muted-foreground">{contact.role}</div>
                          </div>
                        </div>

                        {/* Card body */}
                        {loadingContactIds.has(contact.id) ? (
                          <div key={`loading-${contact.id}`} className="px-6 py-8 bg-card flex items-center justify-center gap-3 animate-fade-in">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            <span className="body-100 text-muted-foreground">Outreach agent is working…</span>
                          </div>
                        ) : (
                        <div key={`content-${contact.id}`} className="px-6 py-5 bg-card animate-fade-in">
                          {/* Description */}
                          <p className="body-100 text-foreground leading-relaxed mb-4">
                            As the visionary behind the platform, {contact.name.split(" ")[0]} is the primary target for COO/CEO-level conversations regarding digital transformation and scaling the business through a unified Smart CRM.
                          </p>

                          {/* Primary Friction */}
                          <p className="heading-50 text-foreground mb-1">Primary Friction:</p>
                          <p className="body-100 text-foreground leading-relaxed mb-4">
                            Friction in scaling operations post-acquisition due to fragmented data silos between the legacy Empowering Systems and {currentCompany.name} platforms.
                          </p>

                          {/* Touch outreach sequence */}
                          <p className="heading-50 text-foreground mb-3" data-tour="outreach-section">5 touch outreach sequence:</p>

                          {/* Call */}
                          <div className="mb-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10 mt-3 shrink-0">
                                <AvatarFallback className="bg-[var(--color-fill-surface-recessed)] text-foreground border border-core-subtle">
                                  <TrellisIcon name="calling" size={16} />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 rounded-100 border border-core-subtle overflow-hidden">
                                <Collapsible
                                      open={isOutreachExpanded(contact.id, "call")}
                                      onOpenChange={() => toggleOutreach(contact.id, "call")}>
                                      
                                  <div className="flex items-center px-4 py-3">
                                    <CollapsibleTrigger className="flex items-center gap-2">
                                      <TrellisIcon name="downCarat" size={12} className={`text-muted-foreground transition-transform ${isOutreachExpanded(contact.id, "call") ? "" : "-rotate-90"}`} />
                                      <span className="heading-50 text-foreground">Call</span>
                                    </CollapsibleTrigger>
                                    <div className="ml-auto">
                                      <Button variant="primary" size="extra-small">
                                        <TrellisIcon name="calling" size={12} className="mr-1 brightness-0 invert" /> Call {contact.name.split(" ")[0]}
                                      </Button>
                                    </div>
                                  </div>
                                  <CollapsibleContent className="px-4 pb-4">
                                    {callScriptMode === "script" ? (
                                      <textarea
                                        className="body-100 text-foreground leading-relaxed ml-5 w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                                        style={{ fieldSizing: 'content' } as React.CSSProperties}
                                        value={getEditableContent(`${contact.id}-call`, `"I noticed ${currentCompany.name} recently partnered with Orbweaver to automate data exchange for manufacturers. Usually, increasing the volume of automated data leads to fragmented 'Franken-stacks' where reps struggle to find a single source of truth. HubSpot's Sales Hub consolidates these data streams into one view, using Breeze AI to automate prospecting so your team stays focused on closing."`)}
                                        onChange={(e) => setEditableContent(`${contact.id}-call`, e.target.value)}
                                        rows={2}
                                      />
                                    ) : (
                                      <ul className="ml-5 list-disc pl-4 space-y-1.5">
                                        <li className="body-100 text-foreground leading-relaxed">{currentCompany.name} partnered with Orbweaver to automate data exchange for manufacturers</li>
                                        <li className="body-100 text-foreground leading-relaxed">Automated data often leads to fragmented "Franken-stacks" — reps can't find a single source of truth</li>
                                        <li className="body-100 text-foreground leading-relaxed">HubSpot Sales Hub consolidates data streams into one view</li>
                                        <li className="body-100 text-foreground leading-relaxed">Breeze AI automates prospecting so team stays focused on closing</li>
                                      </ul>
                                    )}
                                    <div className="flex items-center gap-2 justify-end mt-2">
                                      <span className="detail-200 text-muted-foreground">Bullet points</span>
                                      <Switch
                                        className="h-4 w-7 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
                                        checked={callScriptMode === "bullets"}
                                        onCheckedChange={(checked) => {
                                          const mode = checked ? "bullets" : "script";
                                          setCallScriptMode(mode);
                                          localStorage.setItem("callScriptMode", mode);
                                        }}
                                      />
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            </div>
                          </div>

                          {/* LinkedIn Connection Request */}
                          <div className="mb-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10 mt-3 shrink-0">
                                <AvatarFallback className="bg-[var(--color-fill-surface-recessed)] text-foreground border border-core-subtle">
                                  <TrellisIcon name="linkedin" size={16} />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 rounded-100 border border-core-subtle overflow-hidden">
                                <Collapsible
                                      open={isOutreachExpanded(contact.id, "linkedin")}
                                      onOpenChange={() => toggleOutreach(contact.id, "linkedin")}>
                                      
                                  <div className="flex items-center px-4 py-3">
                                    <CollapsibleTrigger className="flex items-center gap-2">
                                      <TrellisIcon name="downCarat" size={12} className={`text-muted-foreground transition-transform ${isOutreachExpanded(contact.id, "linkedin") ? "" : "-rotate-90"}`} />
                                      <span className="heading-50 text-foreground">LinkedIn Connection Request</span>
                                    </CollapsibleTrigger>
                                    <div className="ml-auto">
                                      <Button variant="primary" size="extra-small">
                                        <TrellisIcon name="linkedin" size={12} className="mr-1 brightness-0 invert" /> Send request
                                      </Button>
                                    </div>
                                  </div>
                                  <CollapsibleContent className="px-4 pb-4">
                                    <textarea
                                      className="body-100 text-foreground leading-relaxed ml-5 w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                                      style={{ fieldSizing: 'content' } as React.CSSProperties}
                                      value={getEditableContent(`${contact.id}-linkedin`, `"I've been following your leadership in the multi-line sales space and would love to connect. Your work integrating Empowering Systems into ${currentCompany.name} is fascinating."`)}
                                      onChange={(e) => setEditableContent(`${contact.id}-linkedin`, e.target.value)}
                                      rows={2}
                                    />
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            </div>
                          </div>

                          {/* Email sequence */}
                          <div>
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10 mt-3 shrink-0">
                                <AvatarFallback className={index === 0 ? "bg-[var(--color-fill-positive-default)] text-white" : "bg-[var(--color-fill-surface-recessed)] text-foreground border border-core-subtle"}>
                                  {index === 0 ? <TrellisIcon name="success" size={16} className="brightness-0 invert" /> : <TrellisIcon name="email" size={16} />}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 rounded-100 border border-core-subtle overflow-hidden">
                                <Collapsible
                                      open={isOutreachExpanded(contact.id, "email")}
                                      onOpenChange={() => toggleOutreach(contact.id, "email")}>
                                      
                                  <div className="flex items-center px-4 py-3">
                                    <CollapsibleTrigger className="flex items-center gap-2">
                                      <TrellisIcon name="downCarat" size={12} className={`text-muted-foreground transition-transform ${isOutreachExpanded(contact.id, "email") ? "" : "-rotate-90"}`} />
                                      <span className="heading-50 text-foreground">
                                        {index === 0 ? "3 Email sequence" : "Email sequence"}
                                      </span>
                                    </CollapsibleTrigger>
                                    {index === 0 ?
                                        <span className="body-100 text-muted-foreground ml-auto">Already enrolled</span> :

                                        <div className="ml-auto">
                                        <Button variant="primary" size="extra-small">
                                          <TrellisIcon name="email" size={12} className="mr-1 brightness-0 invert" /> Enroll {contact.name.split(" ")[0]}
                                        </Button>
                                      </div>
                                        }
                                  </div>
                                  <CollapsibleContent className="px-4 pb-4">
                                    <div className="ml-5 divide-y divide-border-core-subtle">
                                      {[
                                        { subject: `Scaling ${currentCompany.name}'s Content ROI.`, body: `Hi ${contact.name.split(" ")[0]},\n\nI've been researching ${currentCompany.name}'s content strategy and noticed some impressive growth metrics. Many companies in your space are leaving significant ROI on the table by not connecting their content performance data directly to their sales pipeline.\n\nHubSpot's Content Hub can help you attribute revenue directly to content touchpoints, giving your team clear visibility into what's driving deals forward.\n\nWould you be open to a 15-minute conversation about how we could help scale your content ROI?` },
                                        { subject: `Doubling down on ${currentCompany.name}'s highest-ROI content`, body: `Hi ${contact.name.split(" ")[0]},\n\nFollowing up on my previous note — I wanted to share a quick case study. A company similar to ${currentCompany.name} was able to 2x their content-influenced pipeline by using AI-powered content recommendations to serve the right assets at the right stage of the buyer's journey.\n\nI'd love to walk you through how this could work for your team. Would next Tuesday or Wednesday work for a brief call?` },
                                        { subject: `Closing the loop on content ROI at ${currentCompany.name}`, body: `Hi ${contact.name.split(" ")[0]},\n\nI know things get busy, so I'll keep this brief. I've put together a short analysis of how ${currentCompany.name} could better leverage your existing content library to accelerate deals currently in your pipeline.\n\nNo commitment needed — happy to share the analysis either way. Just let me know if you'd like me to send it over.` },
                                      ].map((email, emailIdx) => {
                                        const emailKey = `${contact.id}-email-${emailIdx}`;
                                        const isEmailOpen = expandedEmails[emailKey] ?? false;
                                        return (
                                          <Collapsible
                                            key={emailIdx}
                                            open={isEmailOpen}
                                            onOpenChange={() => setExpandedEmails(prev => ({ ...prev, [emailKey]: !prev[emailKey] }))}
                                          >
                                            <CollapsibleTrigger className="flex items-center gap-2 w-full py-2">
                                              <TrellisIcon name="downCarat" size={12} className={`text-muted-foreground transition-transform ${isEmailOpen ? "" : "-rotate-90"}`} />
                                              <span className="body-100 text-foreground"><span className="heading-50">Subject:</span> {email.subject}</span>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-5 pb-3">
                                              <textarea
                                                className="body-100 text-foreground leading-relaxed whitespace-pre-line w-full bg-transparent resize-none border-0 p-0 focus:outline-none focus:ring-0 rounded-[var(--borderRadius-100)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors cursor-text"
                                                style={{ fieldSizing: 'content' } as React.CSSProperties}
                                                value={getEditableContent(emailKey, email.body)}
                                                onChange={(e) => setEditableContent(emailKey, e.target.value)}
                                                rows={2}
                                              />
                                            </CollapsibleContent>
                                          </Collapsible>
                                        );
                                      })}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            </div>
                          </div>
                          {/* Feedback */}
                          <div className="flex items-center justify-end gap-1 mt-3">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openFeedback(contact.id)}>
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        )}
                      </div>);


                      })}
                    <TextEditPopup containerRef={outreachContainerRef} />
                  </CollapsibleContent>
                </Collapsible>
              </TabsContent>

              <TabsContent value="company" className="px-6 py-6 mt-0">
                <p className="body-100 text-muted-foreground">Company data content coming soon.</p>
              </TabsContent>

              <TabsContent value="activity" className="px-6 py-6 mt-0">
                <p className="body-100 text-muted-foreground">Activity content coming soon.</p>
              </TabsContent>

              <TabsContent value="deals" className="px-6 py-6 mt-0">
                <p className="body-100 text-muted-foreground">Deals content coming soon.</p>
              </TabsContent>

              <TabsContent value="notes" className="px-6 py-6 mt-0">
                <p className="body-100 text-muted-foreground">Notes content coming soon.</p>
              </TabsContent>
            </Tabs>
            </div>
          </div>

          {/* Right column - Contact details panel */}
          <div className={`flex-[2] p-12 shrink-0 overflow-y-auto transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <div className="space-y-6">
              {outreachTargets.map((contact, index) => {
                const contactDetail = contactDetails[contact.id];
                return (
                  <div key={contact.id} className="bg-fill-tertiary rounded-300 border border-core-subtle">
                    {/* Contact header */}
                    <div className="px-4 py-8">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={contact.avatarColor + " text-white heading-50"}>
                              {contact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-2">
                            <div className="heading-100 text-foreground">{contact.name}</div>
                            <div className="detail-100 text-muted-foreground">{contact.role}</div>
                            {contactDetail && (
                              <div className="detail-100 text-muted-foreground">{contactDetail.email}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
                              <TrellisIcon name="email" size={16} />
                            </button>
                            <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
                              <TrellisIcon name="calling" size={16} />
                            </button>
                            <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
                              <TrellisIcon name="linkedin" size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible sections */}
                    <div>
                      <ContactDetailSections
                        contact={contactDetail || {
                          id: contact.id,
                          name: contact.name,
                          initials: contact.initials,
                          role: contact.role,
                          company: currentCompany.name,
                          email: '',
                          phone: '',
                          avatarColor: contact.avatarColor,
                          linkedInInfo: { role: contact.role, location: '', yearsInRole: '', previousCompanies: '' },
                          leadQualification: { engagementScore: 0, responseRate: 0, meetingAcceptance: 0, lastEngagement: '', associatedQLs: [], compellingReasons: [], interests: '' },
                          deals: [],
                          recentActivity: [],
                          qlSummary: { hasRecentQL: false, hasPastQLs: false },
                          notes: []
                        }}
                        defaultOpen={false}
                        showDeals={false}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Other Contacts */}
              {otherContacts.length > 0 && (
                <div className="mt-8">
                  <h3 className="heading-200 text-foreground mb-4">Other Contacts</h3>
                  <div className="space-y-2">
                    {otherContacts.map((contact) => {
                      const detail = contactDetails[contact.id];
                      const email = detail?.email || `${contact.name.toLowerCase().replace(/\s/g, '.')}@${currentCompany.website}`;
                      return (
                        <div key={contact.id} className="bg-card rounded-100 border border-core-subtle px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <button className="heading-50 text-text-interactive hover:underline text-left">{contact.name}</button>
                              <div className="detail-100 text-muted-foreground">{contact.role}</div>
                              <div className="detail-100 text-muted-foreground truncate">{email}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <Button
                                variant="secondary"
                                size="extra-small"
                                onClick={() => handleAddToOutreach(contact.id)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add to Outreach Targets
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
      {/* Feedback Dialog */}
      <Dialog open={feedbackContactId !== null} onOpenChange={(open) => { if (!open) setFeedbackContactId(null); }}>
        <DialogContent className="sm:max-w-[425px] bg-fill-surface">
          <DialogHeader>
            <DialogTitle className="heading-200">Contact Feedback</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <RadioGroup value={feedbackReason} onValueChange={setFeedbackReason}>
              {[
                { value: "no-longer-works", label: "Contact doesn't work at the company anymore" },
                { value: "not-decision-maker", label: "Contact is not a decision maker" },
                { value: "data-wrong", label: "Contact data is wrong" },
                { value: "other", label: "Other (please specify)" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <label htmlFor={option.value} className="body-100 cursor-pointer">{option.label}</label>
                </div>
              ))}
            </RadioGroup>
            {feedbackReason === "other" && (
              <Textarea
                placeholder="Please describe the issue…"
                value={feedbackOtherText}
                onChange={(e) => setFeedbackOtherText(e.target.value)}
                className="body-100"
                rows={3}
              />
            )}
            <div className="flex items-center space-x-2 pt-2 border-t border-core-subtle">
              <Checkbox
                id="remove-contact"
                checked={feedbackRemove}
                onCheckedChange={(checked) => setFeedbackRemove(checked === true)}
              />
              <label htmlFor="remove-contact" className="body-100 cursor-pointer">Remove this contact from the outreach targets</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setFeedbackContactId(null)}>Cancel</Button>
            <Button variant="primary" onClick={submitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>);

};

export default ProspectingStrategy;