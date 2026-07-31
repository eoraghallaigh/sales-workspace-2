import { useState, useMemo, useRef, useCallback, useEffect, type ReactNode } from "react";
import { Plus, Loader2, FileEdit, Mail, Phone, ListTodo, Calendar, MoreHorizontal, ChevronLeft, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import ContactFeedbackModal from "@/components/ContactFeedbackModal";

import { Link, useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useCyclePath } from "@/hooks/useCyclePath";
import { Layout } from "@/components/Layout";
import StrategyCompaniesSubNav from "@/components/StrategyCompaniesSubNav";
import { SignalChipRow } from "@/components/SignalChip";
import { ResearchEmptyCard } from "@/components/StrategyAgentPrompts";
import AgentReasoningSteps from "@/components/AgentReasoningSteps";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { ResearchSectionBody } from "@/components/ResearchSectionBody";
import { prospectingCompanies } from "@/data/prospectingCompanies";
import { companyDetails } from "@/data/companyDetails";
import { contactDetails } from "@/data/contactDetails";
import ContactDetailPanel from "@/components/ContactDetailPanel";
import ReasoningPanel from "@/components/ReasoningPanel";
import { calculateCompanyStatus } from "@/utils/companyStatusUtils";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { TextEditPopup } from "@/components/TextEditPopup";
import PreviousDealCard, { PreviousDeal } from "@/components/PreviousDealCard";
import EmailCommunicator from "@/components/EmailCommunicator";
import ProspectingAgent from "@/components/ProspectingAgent";
import { OutreachSequenceCard } from "@/components/OutreachSequenceCard";
import { TouchDots, type TouchStatus } from "@/components/TouchDot";

import { getCompanyStrategy } from "@/data/companyStrategies";
import { getContactDossier } from "@/data/contactDossier";
import PlayHeader from "@/components/PlayHeader";
import { usePlays } from "@/contexts/PlaysContext";
import { getPlaysForCompany, getPlayOutreachForCompany, rankContactsForPlay, getMostRecentPlayId, getEnrollmentPlayId, getEligiblePlayIdsForContact, PLAY_OUTREACH } from "@/data/playData";
import { useStrategyAssistant } from "@/contexts/StrategyAssistantContext";
import {
  getOutreachState,
  getAggregateSummary,
  getOutreachStripSegments,
} from "@/data/outreachStates";
import { getActivityTimeline } from "@/data/deriveTouches";

const REWRITE_STATUS_MESSAGES = [
  "Reading account history…",
  "Reviewing recent activity and signals…",
  "Drafting call script…",
  "Rewriting LinkedIn outreach…",
  "Rewriting email sequence…",
  "Finalizing the strategy…",
];

const RewritingStatusMessage = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => Math.min(i + 1, REWRITE_STATUS_MESSAGES.length - 1));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="body-125 text-foreground">{REWRITE_STATUS_MESSAGES[index]}</span>
  );
};

// Open the Flywheel Prospecting Agent with the full company research loaded.
const openFullResearch = (companyId: string, companyName: string) => {
  window.dispatchEvent(
    new CustomEvent("openProspectingAgent", {
      detail: { mode: "research", companyId, companyName },
    }),
  );
};

const InfoCard = ({
  title,
  maxHeight = "max-h-[600px]",
  collapsible = false,
  defaultCollapsed = false,
  children,
}: {
  title: string;
  maxHeight?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(!(collapsible && defaultCollapsed));
  const showContent = !collapsible || open;
  return (
    <div className={`bg-fill-secondary rounded-300 border border-core-subtle shadow-100 flex flex-col overflow-hidden ${showContent ? maxHeight : ""}`}>
      <div className={`px-6 py-6 shrink-0 ${showContent ? "border-b border-border-subtle" : ""}`}>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-2 w-full text-left"
          >
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${open ? "" : "-rotate-90"}`}
            />
            <h2 className="heading-100 text-foreground">{title}</h2>
          </button>
        ) : (
          <h2 className="heading-100 text-foreground">{title}</h2>
        )}
      </div>
      {showContent && <div className="overflow-y-auto px-6 py-4">{children}</div>}
    </div>
  );
};

const ProspectingStrategy = () => {
  const { companyId } = useParams<{companyId: string;}>();
  const navigate = useNavigate();
  const location = useLocation();
  // The page that linked here passes { from, fromLabel } so the back button
  // returns to that exact view; fall back to the P1 list for deep links.
  const backState = location.state as { from?: string; fromLabel?: string; playId?: string } | null;
  const [searchParams] = useSearchParams();
  const emptyParam = searchParams.get("empty");
  // hasResearch / hasSequences are owned per-company. Initial defaults come from:
  //   1. ?empty=… URL param (demo override) — wins if present
  //   2. company.hasGeneratedStrategy (data-driven default for P2+)
  //   3. true (P1 default — strategy pre-generated by the agent overnight)
  const [hasResearch, setHasResearch] = useState(true);
  const [hasSequences, setHasSequences] = useState(true);
  const [isRunningResearch, setIsRunningResearch] = useState(false);
  const [isBuildingSequences, setIsBuildingSequences] = useState(false);
  // Collapse the company header to just the back link + name once the content scrolls.
  const [condensed, setCondensed] = useState(false);
  const generationTimersRef = useRef<number[]>([]);

  const createStrategy = useCallback(() => {
    generationTimersRef.current.forEach((t) => window.clearTimeout(t));
    generationTimersRef.current = [];

    setHasResearch(false);
    setHasSequences(false);
    setIsBuildingSequences(false);
    setIsRunningResearch(true);

    const researchWindow = 30000 + Math.floor(Math.random() * 4000);
    const sequenceWindow = 18000 + Math.floor(Math.random() * 4000);

    const researchTimer = window.setTimeout(() => {
      setHasResearch(true);
      setIsRunningResearch(false);
      setIsBuildingSequences(true);
      const sequenceTimer = window.setTimeout(() => {
        setHasSequences(true);
        setIsBuildingSequences(false);
      }, sequenceWindow);
      generationTimersRef.current.push(sequenceTimer);
    }, researchWindow);
    generationTimersRef.current.push(researchTimer);
  }, []);
  const { cyclePath } = useCyclePath();
  const [selectedContactIndex, setSelectedContactIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("strategy");
  const [expandedEmails, setExpandedEmails] = useState<Record<string, boolean>>({});
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [addedContactIds, setAddedContactIds] = useState<Set<string>>(new Set());
  const [loadingContactIds, setLoadingContactIds] = useState<Set<string>>(new Set());
  const [regeneratingContactIds, setRegeneratingContactIds] = useState<Set<string>>(new Set());
  const [removedContactIds, setRemovedContactIds] = useState<Set<string>>(new Set());
  const [feedbackContactId, setFeedbackContactId] = useState<string | null>(null);
  const [emailReplyTo, setEmailReplyTo] = useState<{ name: string; email: string; subject: string } | null>(null);
  const [contactDrawerId, setContactDrawerId] = useState<string | null>(null);
  const [reasoningContactId, setReasoningContactId] = useState<string | null>(null);
  const [callScriptMode, setCallScriptMode] = useState<"script" | "bullets">(() => {
    if (typeof window === "undefined") return "script";
    return (localStorage.getItem("callScriptMode") as "script" | "bullets") || "script";
  });
  const [editedCallBullets, setEditedCallBullets] = useState<Record<string, string[]>>({});
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1600 : false,
  );
  const [isSubNavOpen, setIsSubNavOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1200 : true,
  );

  useEffect(() => {
    let prevSubNavNarrow = window.innerWidth < 1200;
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 1600);
      const nextSubNavNarrow = window.innerWidth < 1200;
      if (prevSubNavNarrow !== nextSubNavNarrow) {
        setIsSubNavOpen(!nextSubNavNarrow);
        prevSubNavNarrow = nextSubNavNarrow;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const outreachContainerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [tabIndicator, setTabIndicator] = useState({ left: 0, width: 0 });
  const [companyDataSearch, setCompanyDataSearch] = useState("");
  const [hideBlankProperties, setHideBlankProperties] = useState(false);
  const [expandedPropertyGroups, setExpandedPropertyGroups] = useState<Record<string, boolean>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevCompanyIdRef = useRef(companyId);

  useEffect(() => {
    const list = tabsListRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!active) return;
    setTabIndicator({ left: active.offsetLeft, width: active.offsetWidth });
  }, [activeTab, isNarrow]);

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


  // Look up the active company's priority bucket so the sub-nav can show its cohort.
  const activePriority = prospectingCompanies.find((c) => c.id === companyId)?.priority ?? "P1";

  // Get all companies with calculated status for sub-nav, scoped to the active priority bucket.
  // Filter and sort must match Prospecting list page so the company set is identical.
  const companies = useMemo(() => {
    const statusPriority: Record<string, number> = {
      "New": 1,
      "Unworked P1": 2,
      "In Progress": 3,
      "Over SLA": 4,
      "Worked": 5,
      "Snoozed": 6,
      "Dismissed": 7,
    };
    return prospectingCompanies
      .map((company) => ({
        ...company,
        status: calculateCompanyStatus(company, new Set()),
      }))
      .filter((c) =>
        c.status === "New" ||
        c.status === "Unworked P1" ||
        c.status === "In Progress" ||
        c.status === "Over SLA"
      )
      .filter((c) => (c.priority ?? "P1") === activePriority)
      .sort((a, b) => (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99));
  }, [activePriority]);

  const currentCompany = companies.find((c) => c.id === companyId) || companies[0];
  const currentCompanyDetails = companyDetails[currentCompany?.id || "1"];

  const { plays } = usePlays();
  const companyPlays = useMemo(
    () => getPlaysForCompany(currentCompany?.id ?? "", plays),
    [currentCompany?.id, plays],
  );
  const companyPlayIds = useMemo(() => companyPlays.map((p) => p.id), [companyPlays]);
  // Multi-play companies get a play selector; the whole strategy view is scoped
  // to the selected play. Default to the most recently created play. A user
  // selection is only honoured while it belongs to the current company, so
  // navigating to another company falls back to that company's default.
  const [selectedPlayId, setSelectedPlayId] = useState<string | undefined>(backState?.playId ?? searchParams.get("fromPlay") ?? undefined);
  const resolvedPlayId = useMemo(() => {
    if (selectedPlayId && companyPlays.some((p) => p.id === selectedPlayId)) {
      return selectedPlayId;
    }
    return getMostRecentPlayId(currentCompany?.id ?? "", plays);
  }, [selectedPlayId, companyPlays, currentCompany?.id, plays]);
  const selectedPlay = useMemo(
    () => companyPlays.find((p) => p.id === resolvedPlayId) ?? companyPlays[0],
    [companyPlays, resolvedPlayId],
  );

  // Re-initialize empty-state defaults whenever the current company changes.
  // ?empty=… URL param wins; otherwise read from the company's hasGeneratedStrategy.
  useEffect(() => {
    if (!currentCompany) return;
    generationTimersRef.current.forEach((t) => window.clearTimeout(t));
    generationTimersRef.current = [];
    const hasStrategy = currentCompany.hasGeneratedStrategy !== false;
    setHasResearch(emptyParam === "both" || emptyParam === "research" ? false : hasStrategy);
    setHasSequences(emptyParam === "both" || emptyParam === "sequences" ? false : hasStrategy);
    setIsRunningResearch(false);
    setIsBuildingSequences(false);
  }, [currentCompany?.id, emptyParam]);

  // On landing, expand any sequence email a contact has replied to, so the
  // reply is visible without the rep having to hunt for it. Existing manual
  // toggles win (prev spread last), so this only seeds the initial state.
  useEffect(() => {
    if (!currentCompany) return;
    const seed: Record<string, boolean> = {};
    for (const c of currentCompany.recommendedContacts ?? []) {
      const { sequence } = getOutreachState(c.id, c.name.split(" ")[0]);
      if (sequence.kind === "not-enrolled") continue;
      sequence.statuses.forEach((status, idx) => {
        if (status.kind === "sent" && status.reply) {
          seed[`${c.id}-email-${idx}`] = true;
        }
      });
    }
    if (Object.keys(seed).length > 0) {
      setExpandedEmails((prev) => ({ ...seed, ...prev }));
    }
  }, [currentCompany?.id]);
  const {
    activeVariantByCompany,
    isRewriting,
  } = useStrategyAssistant();
  // The selected play drives which research variant shows, so the company
  // research itself changes as the rep switches plays (the Salesforce Switchers
  // play surfaces the displacement research). A manual strategy-assistant
  // rewrite still wins if one has been set.
  const playResearchVariant =
    resolvedPlayId === "salesforce-switchers" ? "salesforce-displacement" : "default";
  const activeVariantId = activeVariantByCompany[currentCompany?.id || ""] || playResearchVariant;
  const strategy = getCompanyStrategy(currentCompany?.id)[activeVariantId];
  const isStrategyRewriting = !!isRewriting[currentCompany?.id || ""];

  // Outreach is driven by the company's play: float the play's target personas
  // (e.g. sales + marketing for Salesforce Switchers) to the top so the default
  // outreach targets match who the play is meant to reach.
  const playOutreach = useMemo(
    () =>
      (resolvedPlayId ? PLAY_OUTREACH[resolvedPlayId] : undefined) ??
      getPlayOutreachForCompany(currentCompany?.id ?? ""),
    [resolvedPlayId, currentCompany?.id],
  );
  const rankedRecommended = useMemo(
    () => rankContactsForPlay(currentCompany?.recommendedContacts ?? [], playOutreach),
    [currentCompany, playOutreach],
  );
  // Each play has its own contact set (with overlap). When a company runs more
  // than one play, scope the contacts to those eligible for the selected play.
  const playScopedContacts = useMemo(() => {
    if (companyPlayIds.length <= 1) return rankedRecommended;
    return rankedRecommended.filter((c) =>
      getEligiblePlayIdsForContact(c.id, companyPlayIds).includes(resolvedPlayId ?? ""),
    );
  }, [rankedRecommended, companyPlayIds, resolvedPlayId]);

  // Get contacts for the current company
  const baseOutreachTargets = playScopedContacts.slice(0, 3);
  const addedContacts = playScopedContacts.filter(c => addedContactIds.has(c.id));
  const outreachTargets = [...baseOutreachTargets, ...addedContacts].filter(c => !removedContactIds.has(c.id));

  // Other contacts: remaining contacts not in outreach targets.
  // When no contacts are play-scoped, fall back to the full ranked list so the
  // rep can still manually add targets.
  const otherContacts = useMemo(() => {
    const outreachIds = new Set(outreachTargets.map(c => c.id));
    const pool = playScopedContacts.length > 0 ? playScopedContacts : rankedRecommended;
    return pool.filter(c => !outreachIds.has(c.id)).slice(0, 10);
  }, [playScopedContacts, rankedRecommended, outreachTargets]);

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

  // Regenerating a sequence reruns the sequencing agent for that one contact,
  // showing the same "Building … sequence" loading state used at creation.
  const handleRegenerateSequence = useCallback((contactId: string) => {
    setRegeneratingContactIds(prev => new Set(prev).add(contactId));
    const timer = window.setTimeout(() => {
      setRegeneratingContactIds(prev => {
        const next = new Set(prev);
        next.delete(contactId);
        return next;
      });
    }, 9000);
    generationTimersRef.current.push(timer);
  }, []);

  const openFeedback = (contactId: string) => {
    setFeedbackContactId(contactId);
  };

  const submitFeedback = () => {
    if (feedbackContactId) {
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

  if (!currentCompany) return null;

  const leftTabValue = isNarrow ? activeTab : "strategy";

  const activityBody = (() => {
        type EmailItem = {
          type: "email";
          id: string;
          subject: string;
          from: string;
          to: string;
          timestamp: string;
          threadCount: number;
          preview: string;
          expanded: string;
          opens?: number;
          clicks?: number;
        };
        type CallItem = {
          type: "call";
          id: string;
          title: string;
          by: string;
          withWhom?: string;
          timestamp: string;
          outcome: string;
          callType: string;
          direction: string;
          duration?: string;
          contactsLabel: string;
          associations: string;
          notes?: string;
        };
        type ActivityItem = EmailItem | CallItem;

        const primaryContact = currentCompany?.recommendedContacts?.[0];
        const primaryFirst = primaryContact?.name.split(" ")[0] || "the contact";
        const primaryState = primaryContact
          ? getOutreachState(primaryContact.id, primaryFirst)
          : null;
        const timeline = primaryState ? getActivityTimeline(primaryState) : [];
        const repName = "Dan Taft";

        const items: ActivityItem[] = [];
        for (const entry of timeline) {
          if (entry.type === "email" && entry.status.kind === "sent") {
            const emailNumber = entry.index + 1;
            const replyText = entry.status.reply?.preview;
            const baseBody = replyText
              ? `Hi ${repName} — ${replyText}`
              : `Hi ${primaryFirst},\n\nQuick follow-up from the team at HubSpot — wanted to share a few ideas based on what we're seeing in your space.`;
            items.push({
              type: "email",
              id: `email-${entry.index}`,
              subject: `Email ${emailNumber} of sequence`,
              from: repName,
              to: primaryContact?.name || "",
              timestamp: entry.status.sentAt,
              threadCount: entry.status.reply ? 2 : 1,
              preview: baseBody.split("\n\n")[0],
              expanded: baseBody,
              opens: entry.status.opens,
              clicks: entry.status.clicks,
            });
          } else if (entry.type === "call") {
            const call = entry.state;
            if (call.kind === "no-answer") {
              items.push({
                type: "call",
                id: "call",
                title: `Logged call — No answer (${call.attempts} ${call.attempts === 1 ? "attempt" : "attempts"})`,
                by: repName,
                withWhom: primaryContact?.name,
                timestamp: call.lastAttemptAt,
                outcome: "No answer",
                callType: "Outbound",
                direction: "Outbound",
                contactsLabel: "1 contact",
                associations: "1 association",
              });
            } else if (call.kind === "voicemail") {
              items.push({
                type: "call",
                id: "call",
                title: "Logged call — Voicemail left",
                by: repName,
                withWhom: primaryContact?.name,
                timestamp: call.lastAttemptAt,
                outcome: "Left voicemail",
                callType: "Outbound",
                direction: "Outbound",
                contactsLabel: "1 contact",
                associations: "1 association",
              });
            } else if (call.kind === "connected") {
              items.push({
                type: "call",
                id: "call",
                title: "Logged call — Connected",
                by: repName,
                withWhom: primaryContact?.name,
                timestamp: call.at,
                outcome: "Connected",
                callType: "Outbound",
                direction: "Outbound",
                duration: `${call.durationMin}:00`,
                contactsLabel: "1 contact",
                associations: "1 association",
              });
            }
          } else if (entry.type === "linkedin") {
            const li = entry.state;
            const summary =
              li.kind === "pending"
                ? `LinkedIn request sent — pending ${li.daysWaiting} ${li.daysWaiting === 1 ? "day" : "days"}`
                : li.kind === "accepted"
                  ? "LinkedIn request accepted"
                  : li.kind === "declined"
                    ? "LinkedIn request declined"
                    : "Already connected on LinkedIn";
            const ts =
              li.kind === "pending"
                ? li.sentAt
                : li.kind === "accepted"
                  ? li.acceptedAt
                  : "";
            items.push({
              type: "call",
              id: "linkedin",
              title: summary,
              by: repName,
              withWhom: primaryContact?.name,
              timestamp: ts,
              outcome: li.kind,
              callType: "LinkedIn",
              direction: "Outbound",
              contactsLabel: "1 contact",
              associations: "1 association",
            });
          }
        }

        const sections: { label: string; items: ActivityItem[] }[] = items.length
          ? [{ label: "Recent activity", items }]
          : [];

        if (sections.length === 0) {
          return (
            <div className="py-12 text-center body-100 text-muted-foreground">
              No logged activity yet for {currentCompany.name}.
            </div>
          );
        }

        return sections.map((section) => (
          <div key={section.label} className="mb-8">
            <div className="space-y-3">
              {section.items.map((item) => {
                const isOpen = expandedEmails[item.id] ?? false;
                const onOpenChange = (open: boolean) =>
                  setExpandedEmails((prev) => ({ ...prev, [item.id]: open }));

                if (item.type === "email") {
                  return (
                    <Collapsible
                      key={item.id}
                      open={isOpen}
                      onOpenChange={onOpenChange}
                      className="bg-fill-tertiary border border-core-subtle rounded-300"
                    >
                      <CollapsibleTrigger className="w-full text-left px-4 py-3 group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <TrellisIcon
                              name="downCarat"
                              size={12}
                              className="text-muted-foreground mt-1.5 transition-transform group-data-[state=closed]:-rotate-90"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="body-100 text-foreground">
                                <strong className="heading-50">{item.subject}</strong> from {item.from}
                              </div>
                              <div className="body-100 text-foreground mt-1">to {item.to}</div>
                              <div className="flex items-center gap-2 detail-200 text-muted-foreground mt-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${item.opens && item.opens > 0 ? "bg-trellis-green-600" : "bg-muted-foreground"}`} />
                                {item.opens && item.opens > 0
                                  ? `Opens: ${item.opens}   Clicks: ${item.clicks ?? 0}`
                                  : "Sent"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <TrellisIcon name="email" size={12} className="text-muted-foreground" />
                            <span className="detail-100 text-muted-foreground">{item.threadCount}</span>
                            <span className="detail-100 text-muted-foreground ml-2">{item.timestamp}</span>
                          </div>
                        </div>
                        {!isOpen && (
                          <p className="body-100 text-foreground mt-3 ml-5 whitespace-pre-line line-clamp-3">
                            {item.preview}
                          </p>
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4 ml-5">
                        <p className="body-100 text-foreground whitespace-pre-line leading-relaxed">
                          {item.expanded}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                return (
                  <Collapsible
                    key={item.id}
                    open={isOpen}
                    onOpenChange={onOpenChange}
                    className="bg-fill-tertiary border border-core-subtle rounded-300"
                  >
                    <CollapsibleTrigger className="w-full text-left px-4 py-3 group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <TrellisIcon
                            name="downCarat"
                            size={12}
                            className="text-muted-foreground mt-1.5 transition-transform group-data-[state=closed]:-rotate-90"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="body-100 text-foreground">
                              <strong className="heading-50">{item.title}</strong> by {item.by}
                            </div>
                            {item.withWhom && (
                              <div className="detail-100 text-muted-foreground mt-1">with {item.withWhom}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <TrellisIcon name="calling" size={12} className="text-muted-foreground" />
                          <span className="detail-100 text-muted-foreground ml-2">{item.timestamp}</span>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 ml-5">
                      {item.notes && (
                        <p className="body-100 text-foreground whitespace-pre-line leading-relaxed mb-4">
                          {item.notes}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-8 gap-y-3 pt-3 border-t border-border-subtle">
                        <div className="flex flex-col">
                          <span className="detail-100 text-muted-foreground">Contacted</span>
                          <span className="body-100 text-foreground">{item.contactsLabel}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="detail-100 text-muted-foreground">Outcome</span>
                          <span className="body-100 text-foreground">{item.outcome}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="detail-100 text-muted-foreground">Type</span>
                          <span className="body-100 text-foreground">{item.callType}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="detail-100 text-muted-foreground">Direction</span>
                          <span className="body-100 text-foreground">{item.direction}</span>
                        </div>
                        {item.duration && (
                          <div className="flex flex-col">
                            <span className="detail-100 text-muted-foreground">Duration</span>
                            <span className="body-100 text-foreground">{item.duration}</span>
                          </div>
                        )}
                        <div className="flex flex-col ml-auto">
                          <span className="detail-100 text-muted-foreground">&nbsp;</span>
                          <span className="detail-100 text-muted-foreground">{item.associations}</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        ));
      })();

  const dealsBody = (
    <div className="flex flex-col gap-6 items-center">
        {(
          [
            {
              name: `${currentCompany.name} - New Pro Deal`,
              amount: "$10,000",
              closeDate: "Dec 31, 2024",
              stage: "Closed Lost",
              stageIndex: 5,
              totalStages: 7,
              footer: "Deal with Primary Company",
            },
            {
              name: `${currentCompany.name} - Starter Renewal`,
              amount: "$2,400",
              closeDate: "Jun 14, 2024",
              stage: "Closed Won",
              stageIndex: 6,
              totalStages: 7,
              footer: "Deal with Primary Company",
            },
            {
              name: `${currentCompany.name} - Marketing Hub Expansion`,
              amount: "$6,800",
              closeDate: "Feb 02, 2024",
              stage: "Closed Won",
              stageIndex: 6,
              totalStages: 7,
              footer: "Deal with Primary Company",
            },
          ] as PreviousDeal[]
        ).map((deal) => (
          <div key={deal.name} className="w-full max-w-[600px]">
            <PreviousDealCard deal={deal} />
          </div>
        ))}
      </div>
  );

  const notesBody = (
    <p className="body-100 text-muted-foreground">Notes content coming soon.</p>
  );

  const comingSoon = (label: string) => (
    <p className="body-100 text-muted-foreground">{label} content coming soon.</p>
  );

  const companyBody = (() => {
    type Property = { label: string; value?: string };
    type PropertyGroup = { id: string; label: string; properties: Property[] };
    const propertyGroups: PropertyGroup[] = [
      { id: "company-information", label: "Company Information", properties: Array.from({ length: 479 }, (_, i) => ({ label: `Company info property ${i + 1}` })) },
      { id: "revenue-product-group", label: "Revenue Product Group", properties: Array.from({ length: 104 }, (_, i) => ({ label: `Revenue property ${i + 1}` })) },
      { id: "zoominfo", label: "ZoomInfo", properties: Array.from({ length: 50 }, (_, i) => ({ label: `ZoomInfo property ${i + 1}` })) },
      { id: "delete", label: "Delete | These properties will be deleted", properties: Array.from({ length: 40 }, (_, i) => ({ label: `Deprecated property ${i + 1}` })) },
      {
        id: "prospecting-signals",
        label: "Prospecting Signals",
        properties: [
          { label: "3rd Party Intent Summary" },
          { label: "BDR Lead Status" },
          {
            label: "Compelling Reasons to Reach Out · Summary",
            value:
              "A prospect interacted with HubSpot's product page and completed a signup event on August 7, 2024. They also researched a competitor's offering shortly after.",
          },
          {
            label: "Compelling Reasons to Reach Out – Details",
            value:
              "- Downloaded free guide on ChatGPT at work on 2026-04-08.\n- Visited offer page about ChatGPT at work on 2026-04-08.\n- Research on Zoho's offerings occurred on 2026-02-17.",
          },
          {
            label: "Compelling Reasons to Reach Out · Summary",
            value: "Prospect engaged with HubSpot content related to ChatGPT usage at work.",
          },
          { label: "Content Hub Intent Signal", value: "ai content generation, ai content generation tools, ai generated content, ai search, copilot" },
          { label: "Content Hub Intent Signal Date", value: "18/05/2026" },
          { label: "CRM Intent Signal", value: "ai chatbot, crm, content experience, zoho" },
          { label: "CRM Intent Signal Date", value: "16/04/2026" },
          { label: "Q2 CMS Hub Buying Stage" },
          { label: "Q2 CMS Hub Most Recent Visit Date" },
          { label: "Q2 Marketing Hub Buying Stage", value: "Awareness" },
          { label: "Q2 Marketing Hub Most Recent Visit Date", value: "27/08/2025" },
          { label: "Q2 Operations Hub Buying Stage" },
        ],
      },
      { id: "company-lcs", label: "Company lifecycle stage properties", properties: Array.from({ length: 34 }, (_, i) => ({ label: `Lifecycle property ${i + 1}` })) },
      { id: "partner-channel", label: "Partner/Channel Info", properties: Array.from({ length: 28 }, (_, i) => ({ label: `Partner property ${i + 1}` })) },
      { id: "hsfs", label: "HubSpot For Startups (HSFS)", properties: Array.from({ length: 27 }, (_, i) => ({ label: `HSFS property ${i + 1}` })) },
    ];

    const query = (companyDataSearch || "").trim().toLowerCase();
    const matches = (text: string) => text.toLowerCase().includes(query);

    const filteredGroups = propertyGroups
      .map((group) => {
        const matchingProps = group.properties.filter((p) => {
          if (hideBlankProperties && !p.value) return false;
          if (!query) return true;
          return matches(p.label) || (p.value ? matches(p.value) : false);
        });
        const groupMatchesQuery = !query || matches(group.label);
        const visibleProps =
          query && !groupMatchesQuery
            ? matchingProps
            : hideBlankProperties
              ? group.properties.filter((p) => !!p.value)
              : group.properties;
        const totalCount = hideBlankProperties ? group.properties.filter((p) => !!p.value).length : group.properties.length;
        const isMatch = groupMatchesQuery || matchingProps.length > 0;
        return { ...group, visibleProps, totalCount, isMatch };
      })
      .filter((g) => g.isMatch && (!hideBlankProperties || g.totalCount > 0));

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="search"
              value={companyDataSearch}
              onChange={(e) => setCompanyDataSearch(e.target.value)}
              placeholder="Search"
              className="w-full h-9 px-3 pr-8 rounded-200 border border-core-subtle bg-fill-surface body-100 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <TrellisIcon name="search" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <button className="body-100 text-[var(--color-text-interactive-default)] hover:underline whitespace-nowrap flex items-center gap-1">
            Manage properties
            <TrellisIcon name="externalLink" size={12} />
          </button>
          <label className="flex items-center gap-2 body-100 text-foreground whitespace-nowrap cursor-pointer">
            <Checkbox
              checked={hideBlankProperties}
              onCheckedChange={(checked) => setHideBlankProperties(checked === true)}
            />
            Hide blank properties
          </label>
        </div>

        <div className="flex flex-col">
          {filteredGroups.length === 0 && (
            <p className="body-100 text-muted-foreground py-4">No properties match "{companyDataSearch}".</p>
          )}
          {filteredGroups.map((group) => {
            const forceOpen = !!query && group.visibleProps.length > 0 && group.visibleProps.length < group.properties.length;
            const isOpen = forceOpen || (expandedPropertyGroups[group.id] ?? group.id === "prospecting-signals");
            return (
              <Collapsible
                key={group.id}
                open={isOpen}
                onOpenChange={(open) => setExpandedPropertyGroups((prev) => ({ ...prev, [group.id]: open }))}
                className="border-b border-border-subtle"
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-3 group">
                  <TrellisIcon
                    name="downCarat"
                    size={12}
                    className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90"
                  />
                  <h4 className="heading-100 text-foreground">{group.label}</h4>
                  <span className="detail-200 text-muted-foreground">{group.totalCount} properties</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-4 pl-5">
                  <div className="flex flex-col gap-4">
                    {group.visibleProps.slice(0, 50).map((prop, idx) => (
                      <div key={`${group.id}-${idx}`} className="flex flex-col gap-1">
                        <div className="detail-200 text-muted-foreground">{prop.label}</div>
                        <div className="body-100 text-foreground whitespace-pre-line">
                          {prop.value ?? "--"}
                        </div>
                      </div>
                    ))}
                    {group.visibleProps.length > 50 && (
                      <div className="detail-200 text-muted-foreground">+ {group.visibleProps.length - 50} more</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    );
  })();

  return (
    <Layout>
      <div className="flex h-[var(--page-content-height)] bg-background">
        {/* Left column - Company sub-nav, full height to the top */}
        <StrategyCompaniesSubNav
          companies={companies}
          currentCompanyId={currentCompany.id}
          onSelect={(companyId) => navigate(cyclePath(`/prospecting/strategy/${companyId}`), { state: location.state })}
          isCollapsed={!isSubNavOpen}
          onToggle={() => setIsSubNavOpen((o) => !o)}
        />

        {/* Main column - company header + content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className={`bg-card border-b border-core-subtle px-8 transition-all duration-200 ${condensed ? "py-2.5" : "pt-6 pb-4"}`} onWheel={(e) => e.stopPropagation()}>
            <Link
              to={backState?.from ?? cyclePath("/prospecting")}
              className="inline-flex items-center gap-1 heading-25 text-text-interactive hover:underline"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>{backState?.fromLabel ?? "Prospecting"}</span>
            </Link>
            {condensed ? (
              <h1 className="heading-200 text-foreground mt-1.5 truncate">{currentCompany.name}</h1>
            ) : (
            <div className="flex items-start justify-between gap-4 mt-3">
              <div className="flex items-start gap-3">
                <img src={companyLogoPlaceholder} alt="" className="w-10 h-10 rounded" />
                <div>
                  <h1 className="heading-300 text-foreground">{currentCompany.name}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <a href={`https://${currentCompany.website}`} target="_blank" rel="noopener noreferrer" className="body-100 text-text-interactive hover:underline flex items-center gap-1">
                      https://{currentCompany.website} <TrellisIcon name="externalLink" size={12} />
                    </a>
                    <span className="body-100 text-muted-foreground">·</span>
                    <span className="body-100 text-muted-foreground">
                      {currentCompanyDetails?.industry || currentCompany.industry} | {currentCompanyDetails?.employeeSize || "—"} employees
                    </span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="link-100 text-text-interactive hover:underline flex items-center gap-1 mt-1"
                  >
                    Open company record <TrellisIcon name="externalLink" size={12} />
                  </a>
                  {currentCompany.signals.length > 0 && (
                    <SignalChipRow
                      signals={currentCompany.signals}
                      owner={{ kind: "company", id: currentCompany.id, name: currentCompany.name }}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Badge variant={getStatusBadgeVariant(currentCompany.status)}>
                  {getStatusLabel(currentCompany.status)}
                </Badge>
                {(() => {
                  const statuses = (currentCompany.touches?.touchStatuses || []) as TouchStatus[];
                  const remaining = statuses.filter((s) => s !== "completed").length + Math.max(0, 5 - statuses.length);
                  return (
                    <span className="detail-200 text-muted-foreground">
                      {remaining} more {remaining === 1 ? "touch" : "touches"} required before {currentCompany.touches?.deadline}
                    </span>
                  );
                })()}
                <TouchDots statuses={(currentCompany.touches?.touchStatuses || []) as TouchStatus[]} />
              </div>
            </div>
            )}
          </div>

          {/* Content row */}
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

            {/* Strategy rewrite overlay */}
            {isStrategyRewriting && (
              <div className="absolute inset-0 z-50 bg-card flex items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-trellis-green-800" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="heading-200 text-foreground">Rewriting strategy</span>
                    <RewritingStatusMessage />
                  </div>
                </div>
              </div>
            )}

          {/* Strategy content */}
          <div onScroll={(e) => setCondensed(e.currentTarget.scrollTop > 48)} className={`flex-1 overflow-y-auto p-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {companyPlays.length > 1 && selectedPlay && (
              <div className="flex items-center flex-wrap gap-x-1 gap-y-1 mb-6 body-100 text-muted-foreground">
                <span className="text-[var(--color-text-core-default)]">This company is eligible for multiple plays. Showing the prospecting strategy for</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-2 h-7 rounded heading-50 text-foreground hover:bg-[var(--color-fill-accent-neutral-subtle-alt)] transition-colors"
                    >
                      {selectedPlay.label}
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuRadioGroup
                      value={resolvedPlayId}
                      onValueChange={(value) => setSelectedPlayId(value)}
                    >
                      {companyPlays.map((p) => (
                        <DropdownMenuRadioItem key={p.id} value={p.id}>
                          {p.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div className="flex gap-8 items-start w-full">
            <div data-tour="strategy-company-card" className={`bg-fill-secondary rounded-300 border border-core-subtle shadow-100 overflow-hidden flex flex-col gap-12 ${isNarrow ? "flex-1 min-w-0 max-w-[1000px]" : "flex-[6_1_0%] min-w-0"}`}>

            <Tabs value={leftTabValue} onValueChange={setActiveTab} className="w-full">
              {isNarrow ? (
              <div className="px-6 pt-4">
              <TabsList ref={tabsListRef} className="relative w-full justify-start border-b border-border-subtle rounded-none bg-transparent px-0 h-auto gap-0">
                {["Strategy", "Company Data", "Activity", `Deals (${currentCompanyDetails?.deals?.length || 0})`, "Notes"].map((tab) => {
                    const tabValue = tab.toLowerCase().split(" ")[0].replace("(", "");
                    const isStrategy = tabValue === "strategy";
                    return (
                      <TabsTrigger
                        key={tab}
                        value={tabValue === "deals" ? "deals" : tabValue}
                        disabled={!isStrategy}
                        className={`rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-transparent px-4 heading-50 text-muted-foreground data-[state=active]:text-foreground disabled:opacity-100 ${isStrategy ? "py-3" : "flex-col h-auto py-2 gap-0.5"}`}>

                      {tab}
                      {!isStrategy && (
                        <span className="detail-100 font-normal text-muted-foreground">Coming soon</span>
                      )}
                    </TabsTrigger>);

                  })}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-[var(--color-fill-primary-default,#141414)]"
                  style={{
                    left: tabIndicator.left + 8,
                    width: Math.max(tabIndicator.width - 16, 0),
                    transition: "left 200ms cubic-bezier(0.33, 0, 0.4, 1), width 200ms cubic-bezier(0.33, 0, 0.4, 1)",
                    opacity: tabIndicator.width > 0 ? 1 : 0,
                  }}
                />
              </TabsList>
              </div>
              ) : null}

              <TabsContent value="strategy" className="px-6 pt-6 pb-6 mt-0">
                {selectedPlay && (
                  <PlayHeader play={selectedPlay} compact />
                )}
                {isRunningResearch ? (
                  <div className="flex items-center justify-center min-h-[420px] animate-fade-in">
                    <div className="px-6 py-6 w-full max-w-md">
                      <p className="heading-50 text-foreground mb-3 text-center">
                        Researching {currentCompany.name}…
                      </p>
                      <AgentReasoningSteps kind="research" stepMs={6000} />
                    </div>
                  </div>
                ) : !hasResearch ? (
                  <ResearchEmptyCard
                    companyName={currentCompany.name}
                    isRunning={isRunningResearch}
                    onRun={createStrategy}
                  />
                ) : strategy.showFullResearch ? (
                  <>
                    {strategy.sections.map((section, idx) => (
                      <Collapsible key={`${section.heading}-${idx}`} defaultOpen className="mb-12">
                        <CollapsibleTrigger className="flex items-center gap-2 w-full group">
                          <TrellisIcon name="downCarat" size={12} className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                          <h3 className="heading-200 text-foreground">{section.heading}</h3>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <ResearchSectionBody body={section.body} />
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </>
                ) : (
                  <Collapsible defaultOpen className="mb-12">
                    <CollapsibleTrigger className="flex items-center gap-2 w-full group">
                      <TrellisIcon name="downCarat" size={12} className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                      <h3 className="heading-200 text-foreground">Company Research</h3>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <ul className="list-disc pl-5 flex flex-col gap-2.5">
                        {strategy.summaryBullets.slice(0, 5).map((bullet, idx) => (
                          <li key={idx} className="body-100 text-foreground leading-relaxed">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="ai-secondary"
                        size="small"
                        className="mt-4"
                        onClick={() => openFullResearch(currentCompany.id, currentCompany.name)}
                      >
                        Read full research
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Outreach Targets */}
                <Collapsible defaultOpen className="mb-12">
                  <CollapsibleTrigger className="flex items-center gap-2 w-full group">
                    <TrellisIcon name="downCarat" size={12} className="text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                    <h3 className="heading-200 text-foreground">
                      {"Outreach targets"}{outreachTargets.length > 0 ? ` (${outreachTargets.length})` : ""}
                    </h3>
                    {(() => {
                      const seg = getOutreachStripSegments(outreachTargets);
                      if (seg.total === 0) return null;
                      const unit = 10; // px per contact
                      const buckets: Array<{ count: number; label: string; bg: string }> = [
                        { count: seg.engaged, label: "replied", bg: "var(--color-fill-accent-green-default)" },
                        { count: seg.inFlight, label: "awaiting response", bg: "var(--color-fill-accent-green-subtle)" },
                        { count: seg.notStarted, label: "not started", bg: "var(--color-fill-surface-recessed)" },
                      ];
                      return (
                        <div className="ml-auto flex items-center gap-3 shrink-0">
                          {buckets.map((b) =>
                            b.count > 0 ? (
                              <div key={b.label} className="flex items-center gap-1.5">
                                <div
                                  className="h-2 rounded-sm"
                                  style={{ width: `${b.count * unit}px`, background: b.bg, minWidth: "8px" }}
                                />
                                <span className="detail-200 text-muted-foreground whitespace-nowrap">
                                  {b.count} {b.label}
                                </span>
                              </div>
                            ) : null,
                          )}
                        </div>
                      );
                    })()}
                  </CollapsibleTrigger>
                  {selectedPlay && (
                    <p className="detail-100 text-muted-foreground mt-2 pl-5">
                      Contacts and sequences are optimised for the {selectedPlay.label} play.
                    </p>
                  )}
                  <CollapsibleContent className="mt-4" ref={outreachContainerRef}>
                  <div key={resolvedPlayId} className="animate-fade-in">

                  {outreachTargets.map((contact, index) => {
                        const contactDetail = contactDetails[contact.id];
                        // The active play (chosen by the top-of-page selector)
                        // drives this contact's sequence and copy.
                        const dossier = getContactDossier(
                          { id: contact.id, name: contact.name, role: contact.role, signals: contact.signals, qlData: contact.qlData },
                          { id: currentCompany.id, name: currentCompany.name, industry: currentCompany.industry },
                          playOutreach,
                        );
                        return (
                          <div
                            key={contact.id}
                            className="mb-6 rounded-300 border-100 border-core-subtle overflow-hidden pb-6">

                        {/* Card header */}
                        <div
                              className="flex items-center justify-between gap-3 px-6 py-4 bg-[var(--color-fill-surface-recessed)] cursor-pointer"
                              onClick={() => setSelectedContactIndex(index)}>

                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={contact.avatarColor + " text-white heading-50"}>
                                {contact.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <button
                                type="button"
                                className="heading-100 text-text-interactive hover:underline text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setContactDrawerId(contact.id);
                                }}
                              >
                                {contact.name}
                              </button>
                              <div className="body-100 text-muted-foreground">{contact.role}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
                              <TrellisIcon name="email" size={16} />
                            </button>
                            <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
                              <TrellisIcon name="calling" size={16} />
                            </button>
                            <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
                              <TrellisIcon name="linkedin" size={16} />
                            </button>
                            <button
                              className="flex items-center justify-center hover:opacity-70 transition-opacity"
                              onClick={() => openFeedback(contact.id)}
                              aria-label="Hide contact"
                            >
                              <TrellisIcon name="hide" size={16} />
                            </button>
                          </div>
                        </div>

                        {contact.signals.length > 0 && (
                          <div className="px-6 py-0 bg-card">
                            <SignalChipRow
                              signals={contact.signals}
                              owner={{ kind: "contact", id: contact.id, name: contact.name, role: contact.role }}
                              className="mt-4 mb-4"
                            />
                          </div>
                        )}

                        {/* Card body */}
                        {loadingContactIds.has(contact.id) ? (
                          <div key={`loading-${contact.id}`} className="px-6 py-8 bg-card flex items-center justify-center gap-3 animate-fade-in">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            <span className="body-100 text-muted-foreground">Outreach agent is working…</span>
                          </div>
                        ) : (isBuildingSequences || regeneratingContactIds.has(contact.id)) ? (
                          <div key={`building-${contact.id}`} className="px-6 py-5 bg-card animate-fade-in">
                            <p className="heading-50 text-foreground mb-3">
                              Building {contact.name.split(" ")[0]}'s sequence…
                            </p>
                            <AgentReasoningSteps kind="sequence" stepMs={6000} />
                          </div>
                        ) : !hasSequences ? (
                          <div key={`signals-${contact.id}`} className="px-6 py-5 bg-card animate-fade-in">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 detail-200 text-muted-foreground">
                                <div className={`h-2.5 w-2.5 rounded-full ${((contact.recentConversions ?? 0) > 0) ? "bg-trellis-green-600" : "bg-muted-foreground"}`} />
                                {(contact.recentConversions ?? 0) > 0
                                  ? `${contact.recentConversions} recent conversion${(contact.recentConversions ?? 0) !== 1 ? "s" : ""}`
                                  : "No recent conversions"}
                              </div>
                              <div className="flex items-center gap-2 detail-200 text-muted-foreground">
                                <div className={`h-2.5 w-2.5 rounded-full ${contact.recentTouches > 0 ? "bg-trellis-green-600" : "bg-muted-foreground"}`} />
                                {contact.recentTouches > 0
                                  ? `${contact.recentTouches} recent touch${contact.recentTouches !== 1 ? "es" : ""}`
                                  : "No recent touches"}
                              </div>
                              <div className="flex items-center gap-2 detail-200 text-muted-foreground">
                                <div className={`h-2.5 w-2.5 rounded-full ${contact.enrolledInSequence ? "bg-trellis-purple-600" : "bg-muted-foreground"}`} />
                                {contact.enrolledInSequence ? "Enrolled in a sequence" : "Not enrolled in a sequence"}
                              </div>
                            </div>
                          </div>
                        ) : (
                        <div key={`content-${contact.id}`} className="px-6 pt-4 pb-0 bg-card animate-fade-in">
                          {/* Description */}
                          <p className="body-100 text-foreground leading-relaxed mb-4">
                            {dossier.blurb}
                          </p>

                          {/* Primary Friction */}
                          <p className="heading-50 text-foreground mb-1">Primary Friction:</p>
                          <p className="body-100 text-foreground leading-relaxed mb-3">
                            {dossier.primaryFriction}
                          </p>
                          <div className="mb-12">
                            <Button variant="primary" size="small">
                              <Phone />
                              Call {contact.name.split(" ")[0]}
                            </Button>
                          </div>

                          {/* Call */}
                          {(() => {
                            const outreachState = getOutreachState(contact.id, contact.name.split(" ")[0]);
                            const defaultCallScript = dossier.callScript;
                            const defaultLinkedInMsg = dossier.linkedInMessage;
                            const emailTemplates = dossier.emails;
                            // If this contact's active sequence belongs to a
                            // different play than the one being viewed, surface
                            // a chip naming that play (one enrollment per
                            // contact, so they can't be enrolled here).
                            const owningPlayId = getEnrollmentPlayId(contact.id);
                            const playProvenanceLabel =
                              owningPlayId &&
                              owningPlayId !== resolvedPlayId &&
                              outreachState.sequence.kind !== "not-enrolled"
                                ? PLAY_OUTREACH[owningPlayId]?.label ??
                                  plays.find((p) => p.id === owningPlayId)?.label
                                : undefined;
                            return (
                              <OutreachSequenceCard
                                contact={{
                                  id: contact.id,
                                  name: contact.name,
                                  initials: contact.initials,
                                  avatarColor: contact.avatarColor,
                                }}
                                playProvenanceLabel={playProvenanceLabel}
                                callBullets={
                                  editedCallBullets[contact.id] ??
                                  dossier.callBullets
                                }
                                onCallBulletChange={(idx, value) => {
                                  setEditedCallBullets((prev) => {
                                    const current =
                                      prev[contact.id] ??
                                      dossier.callBullets;
                                    const next = [...current];
                                    next[idx] = value;
                                    return { ...prev, [contact.id]: next };
                                  });
                                }}
                                scriptMode={callScriptMode}
                                onScriptModeChange={(mode) => {
                                  setCallScriptMode(mode);
                                  localStorage.setItem("callScriptMode", mode);
                                }}
                                call={outreachState.call}
                                linkedin={outreachState.linkedin}
                                sequence={outreachState.sequence}
                                defaultCallScript={defaultCallScript}
                                defaultLinkedInMessage={defaultLinkedInMsg}
                                emailTemplates={emailTemplates}
                                expandedTouches={(() => {
                                  const map: Record<string, boolean> = {};
                                  for (const k in expandedEmails) {
                                    if (k.startsWith(`${contact.id}-`)) map[k] = expandedEmails[k];
                                  }
                                  return map;
                                })()}
                                onToggleTouch={(id) => {
                                  setExpandedEmails((prev) => ({ ...prev, [id]: !prev[id] }));
                                }}
                                getCallScript={() =>
                                  getEditableContent(`${contact.id}-call`, defaultCallScript)
                                }
                                onCallScriptChange={(v) =>
                                  setEditableContent(`${contact.id}-call`, v)
                                }
                                getLinkedInMessage={() =>
                                  getEditableContent(`${contact.id}-linkedin`, defaultLinkedInMsg)
                                }
                                onLinkedInMessageChange={(v) =>
                                  setEditableContent(`${contact.id}-linkedin`, v)
                                }
                                getEmailSubject={(idx) =>
                                  getEditableContent(
                                    `${contact.id}-email-${idx}-subject`,
                                    emailTemplates[idx].subject,
                                  )
                                }
                                onEmailSubjectChange={(idx, v) =>
                                  setEditableContent(`${contact.id}-email-${idx}-subject`, v)
                                }
                                getEmailBody={(idx) =>
                                  getEditableContent(`${contact.id}-email-${idx}`, emailTemplates[idx].body)
                                }
                                onEmailBodyChange={(idx, v) =>
                                  setEditableContent(`${contact.id}-email-${idx}`, v)
                                }
                                onReplyToEmail={(idx) => {
                                  const subject = getEditableContent(
                                    `${contact.id}-email-${idx}-subject`,
                                    emailTemplates[idx].subject,
                                  );
                                  setEmailReplyTo({
                                    name: contact.name,
                                    email: `${contact.name.toLowerCase().replace(/\s+/g, ".")}@${currentCompany.name.toLowerCase().replace(/\s+/g, "")}.com`,
                                    subject: `Re: ${subject}`,
                                  });
                                }}
                                onViewReasoning={() => setReasoningContactId(contact.id)}
                                onRegenerate={() => handleRegenerateSequence(contact.id)}
                              />
                            );
                          })()}
                        </div>
                        )}
                      </div>);


                      })}
                    {outreachTargets.length === 0 && selectedPlay && (
                      <div className="rounded-100 border border-dashed border-core-subtle bg-card px-6 py-8 text-center">
                        <p className="body-100 text-muted-foreground">
                          There are no contacts matching the criteria for this play.
                        </p>
                      </div>
                    )}
                    {otherContacts.length > 0 && (
                      <div className="mt-8">
                        <h3 className="heading-200 text-foreground mb-4">Other Contacts</h3>
                        <div className="space-y-2">
                          {otherContacts.map((contact) => {
                            const detail = contactDetails[contact.id];
                            const email = detail?.email || `${contact.name.toLowerCase().replace(/\s/g, '.')}@${currentCompany.website}`;
                            return (
                              <div key={contact.id} className="bg-card rounded-100 border border-core-subtle shadow-100 px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 min-w-0">
                                    <button
                                      className="heading-50 text-text-interactive hover:underline text-left"
                                      onClick={() => setContactDrawerId(contact.id)}
                                    >
                                      {contact.name}
                                    </button>
                                    <div className="detail-100 text-muted-foreground mb-1">{contact.role}</div>
                                    <div className="detail-100 text-muted-foreground truncate mb-1">{email}</div>
                                    {contact.lastContactedDate && (
                                      <div className="detail-100 text-muted-foreground mb-1">Last contacted: {contact.lastContactedDate}</div>
                                    )}
                                    {contact.signals.length > 0 && (
                                      <SignalChipRow
                                        signals={contact.signals}
                                        owner={{ kind: "contact", id: contact.id, name: contact.name, role: contact.role }}
                                        className="mt-2"
                                      />
                                    )}
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
                    <TextEditPopup containerRef={outreachContainerRef} />
                  </div>
                  </CollapsibleContent>
                </Collapsible>
              </TabsContent>

              {isNarrow && (
                <TabsContent value="company" className="px-6 pt-6 pb-6 mt-0">
                  {companyBody}
                </TabsContent>
              )}

              {isNarrow && (
                <TabsContent value="activity" className="px-6 pt-12 pb-6 mt-0">{activityBody}</TabsContent>
              )}
              {isNarrow && (
                <TabsContent value="deals" className="px-6 pt-6 pb-6 mt-0">{dealsBody}</TabsContent>
              )}
              {isNarrow && (
                <TabsContent value="notes" className="px-6 py-6 mt-0">{notesBody}</TabsContent>
              )}
            </Tabs>
            </div>
            {!isNarrow && (
              <div className="flex flex-col gap-4 flex-[4_1_0%] min-w-0">
                <InfoCard title="Company data" maxHeight="max-h-[640px]" collapsible>{comingSoon("Company data")}</InfoCard>
                <InfoCard title="Hub summary" maxHeight="max-h-[640px]" collapsible>{comingSoon("Hub summary")}</InfoCard>
                <InfoCard title="Recent conversions" maxHeight="max-h-[480px]" collapsible>{comingSoon("Recent conversions")}</InfoCard>
                <InfoCard title="Activity" maxHeight="max-h-[640px]" collapsible>{comingSoon("Activity")}</InfoCard>
                <InfoCard title="Deals" maxHeight="max-h-[480px]" collapsible>{comingSoon("Deals")}</InfoCard>
                <InfoCard title="Notes" maxHeight="max-h-[320px]" collapsible>{comingSoon("Notes")}</InfoCard>
              </div>
            )}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Contact details drawer (shared with the company list page) */}
      {contactDrawerId && (() => {
        const drawerContact = outreachTargets.find(c => c.id === contactDrawerId)
          || otherContacts.find(c => c.id === contactDrawerId);
        const detail = contactDetails[contactDrawerId];
        const drawerDossier = drawerContact
          ? getContactDossier(
              { id: drawerContact.id, name: drawerContact.name, role: drawerContact.role, signals: drawerContact.signals, qlData: drawerContact.qlData },
              { id: currentCompany.id, name: currentCompany.name, industry: currentCompany.industry },
              playOutreach,
            )
          : undefined;
        const fallbackContact = drawerContact && {
          id: contactDrawerId,
          name: drawerContact.name,
          initials: drawerContact.initials,
          role: drawerContact.role,
          company: currentCompany.name,
          email: '',
          phone: '',
          avatarColor: drawerContact.avatarColor,
          linkedInInfo: { role: drawerContact.role, location: '', yearsInRole: '', previousCompanies: '' },
          leadQualification: { engagementScore: 0, responseRate: 0, meetingAcceptance: 0, lastEngagement: '', associatedQLs: [], compellingReasons: [], interests: '' },
          deals: [],
          recentActivity: [],
          qlSummary: { hasRecentQL: false, hasPastQLs: false },
          notes: []
        };
        const contact = detail || fallbackContact;
        if (!contact) return null;
        const actionDefs = [
          { icon: FileEdit, label: "Note" },
          { icon: Mail, label: "Email" },
          { icon: Phone, label: "Call" },
          { icon: ListTodo, label: "Task" },
          { icon: Calendar, label: "Meeting" },
          { icon: MoreHorizontal, label: "More" },
        ];
        return (
          <ContactDetailPanel
            isOpen={true}
            onClose={() => setContactDrawerId(null)}
            contact={contact}
            companyLogo={companyLogoPlaceholder}
            signals={drawerContact?.signals ?? []}
            signalsOwner={
              drawerContact
                ? { kind: "contact", id: drawerContact.id, name: drawerContact.name, role: drawerContact.role }
                : undefined
            }
            dossier={drawerDossier}
            actionsRow={actionDefs.map((action) => {
              const handleClick =
                action.label === "Email"
                  ? () => setEmailReplyTo({ name: contact.name, email: contact.email, subject: "" })
                  : undefined;
              return (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="flex flex-col items-center gap-2 group h-auto p-1"
                  onClick={handleClick}
                >
                  <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                    <action.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="body-100 text-foreground">{action.label}</span>
                </Button>
              );
            })}
          />
        );
      })()}

      {/* Reasoning panel — agent's thought process */}
      <AnimatePresence>
        {reasoningContactId && (() => {
          const reasoningContact = outreachTargets.find(c => c.id === reasoningContactId)
            || otherContacts.find(c => c.id === reasoningContactId);
          if (!reasoningContact) return null;
          return (
            <ReasoningPanel
              key={reasoningContact.id}
              onClose={() => setReasoningContactId(null)}
              contactName={reasoningContact.name}
              companyName={currentCompany.name}
            />
          );
        })()}
      </AnimatePresence>

      {/* Feedback Dialog */}
      <ContactFeedbackModal
        open={feedbackContactId !== null}
        contactCount={1}
        onOpenChange={(open) => { if (!open) setFeedbackContactId(null); }}
        onSubmit={submitFeedback}
      />

      <EmailCommunicator
        isOpen={emailReplyTo !== null}
        onClose={() => setEmailReplyTo(null)}
        recipientName={emailReplyTo?.name}
        recipientEmail={emailReplyTo?.email}
        defaultSubject={emailReplyTo?.subject}
      />

      <ProspectingAgent />
    </Layout>);

};

export default ProspectingStrategy;