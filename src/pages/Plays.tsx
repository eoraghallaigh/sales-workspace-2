import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCyclePath } from "@/hooks/useCyclePath";
import { usePlays } from "@/contexts/PlaysContext";
import { Play, PlayState, getPlayState, isPlayEditable } from "@/data/playData";

const STATE_OPTIONS: { value: PlayState; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "ended", label: "Ended" },
];

const ALLOWED_TRANSITIONS: Record<PlayState, PlayState[]> = {
  draft: ["draft", "upcoming", "active"],
  upcoming: ["draft", "upcoming", "active", "ended"],
  active: ["draft", "upcoming", "active", "ended"],
  ended: ["upcoming", "active", "ended"],
};

const SEGMENT_OPTIONS = ["SMB", "Mid-Market", "Enterprise"];
const GEO_OPTIONS = ["US", "EMEA", "APAC", "France"];

const STATE_PILL_CLASS: Record<PlayState, string> = {
  draft: "bg-[var(--color-fill-caution-subtle)] text-[var(--color-text-core-default)]",
  upcoming: "bg-fill-info-subtle text-[var(--color-text-core-default)]",
  active: "bg-fill-positive-subtle text-[var(--color-text-core-default)]",
  ended: "bg-trellis-neutral-200 text-foreground",
};

const STATE_PILL_LABEL: Record<PlayState, string> = {
  draft: "Draft",
  upcoming: "Upcoming",
  active: "Active",
  ended: "Ended",
};

const formatDateRange = (start: string, end: string) => {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const startFmt = new Date(start).toLocaleDateString(undefined, opts);
  const endFmt = new Date(end).toLocaleDateString(undefined, opts);
  return `${startFmt} – ${endFmt}`;
};

const getRepCount = (play: Play): number => {
  if (play.teams && play.teams.length > 0) {
    const leafCount = play.teams.filter(id => id.includes("-m-")).length;
    return Math.max(leafCount * 5, play.teams.length);
  }
  const geoCount = play.geo?.length ?? 1;
  const segmentCount = play.marketSegment?.length ?? 1;
  return geoCount * segmentCount * 8;
};

const getGeoLabel = (play: Play): string => {
  if (!play.geo || play.geo.length === 0) return "all regions";
  return play.geo.join(", ");
};

const getVisibilityTiming = (play: Play): string => {
  const today = new Date().toISOString().slice(0, 10);
  if (play.startDate > today) {
    const formatted = new Date(play.startDate + "T00:00:00").toLocaleDateString(
      undefined,
      { month: "short", day: "numeric", year: "numeric" }
    );
    return `on ${formatted} (launch date)`;
  }
  return "immediately";
};

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  onClear: () => void;
  width?: string;
}

const MultiSelectDropdown = ({ label, options, selected, onToggle, onClear, width = "w-48" }: MultiSelectDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="medium" className="border border-transparent heading-50">
        {label}{selected.size > 0 && ` (${selected.size})`} <TrellisIcon name="downCarat" size={12} />
        {selected.size > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-5 w-5"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className={`${width} bg-card border border-border shadow-lg`}>
      {options.map((value) => (
        <DropdownMenuItem
          key={value}
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            onToggle(value);
          }}
        >
          <div
            className={`w-4 h-4 border border-foreground rounded-sm flex items-center justify-center ${
              selected.has(value) ? "bg-foreground" : ""
            }`}
          >
            {selected.has(value) && <Check className="h-3 w-3 text-background" />}
          </div>
          <span className="body-100">{value}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

type PendingTransition = {
  play: Play;
  fromState: PlayState;
  toState: PlayState;
};

const Plays = () => {
  const navigate = useNavigate();
  const { cyclePath } = useCyclePath();
  const { plays, updatePlay } = usePlays();

  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set());
  const [selectedGeos, setSelectedGeos] = useState<Set<string>>(new Set());
  const [selectedOwners, setSelectedOwners] = useState<Set<string>>(new Set());

  const [pendingTransition, setPendingTransition] = useState<PendingTransition | null>(null);
  const [reactivateEndDate, setReactivateEndDate] = useState<Date | undefined>(undefined);
  const [rescheduleLaunchDate, setRescheduleLaunchDate] = useState<Date | undefined>(undefined);
  const [relaunchRange, setRelaunchRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);

  const ownerOptions = useMemo(
    () => Array.from(new Set(plays.map((c) => c.owner))).sort(),
    [plays]
  );

  const filtered = useMemo(() => {
    return plays.filter((c) => {
      if (selectedStatuses.size > 0 && !selectedStatuses.has(getPlayState(c))) return false;
      if (selectedSegments.size > 0) {
        const overlap = (c.marketSegment ?? []).some((s) => selectedSegments.has(s));
        if (!overlap) return false;
      }
      if (selectedGeos.size > 0) {
        const overlap = (c.geo ?? []).some((g) => selectedGeos.has(g));
        if (!overlap) return false;
      }
      if (selectedOwners.size > 0 && !selectedOwners.has(c.owner)) return false;
      return true;
    });
  }, [plays, selectedStatuses, selectedSegments, selectedGeos, selectedOwners]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (value: string) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };
  const clear = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => () => setter(new Set());

  const handleEditPlay = (play: Play) => {
    navigate(cyclePath(`/plays/${play.id}/edit`));
  };

  const handleCreateClick = () => {
    navigate(cyclePath("/plays/new"));
  };

  const applyStatusChange = (play: Play, newState: PlayState, endDate?: Date) => {
    const today = new Date().toISOString().slice(0, 10);
    const updates: Partial<Play> = {};

    switch (newState) {
      case "draft":
        updates.status = "draft";
        break;
      case "upcoming": {
        updates.status = "scheduled";
        if (play.startDate <= today) {
          const futureStart = new Date();
          futureStart.setDate(futureStart.getDate() + 7);
          updates.startDate = futureStart.toISOString().slice(0, 10);
        }
        break;
      }
      case "active": {
        updates.status = "live";
        if (play.startDate > today) updates.startDate = today;
        if (play.endDate < today) {
          if (endDate) {
            updates.endDate = endDate.toISOString().slice(0, 10);
          } else {
            const defaultEnd = new Date();
            defaultEnd.setDate(defaultEnd.getDate() + 30);
            updates.endDate = defaultEnd.toISOString().slice(0, 10);
          }
        }
        break;
      }
      case "ended": {
        updates.status = "live";
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        updates.endDate = yesterday.toISOString().slice(0, 10);
        break;
      }
    }

    updatePlay(play.id, updates);
  };

  const handleStatusChange = (play: Play, newState: PlayState) => {
    const currentState = getPlayState(play);
    if (newState === currentState) return;

    const needsConfirmation =
      ((currentState === "draft" || currentState === "upcoming") && newState === "active") ||
      (currentState === "active" && (newState === "draft" || newState === "upcoming" || newState === "ended")) ||
      (currentState === "upcoming" && newState === "ended") ||
      (currentState === "ended" && (newState === "active" || newState === "upcoming"));

    if (needsConfirmation) {
      setPendingTransition({ play, fromState: currentState, toState: newState });
      if (currentState === "ended" && newState === "active") {
        const defaultEnd = new Date();
        defaultEnd.setDate(defaultEnd.getDate() + 30);
        setReactivateEndDate(defaultEnd);
      }
      if (currentState === "ended" && newState === "upcoming") {
        setRelaunchRange(undefined);
      }
      if (currentState === "active" && newState === "upcoming") {
        const defaultLaunch = new Date();
        defaultLaunch.setDate(defaultLaunch.getDate() + 7);
        setRescheduleLaunchDate(defaultLaunch);
      }
      return;
    }

    applyStatusChange(play, newState);
  };

  const handleConfirm = () => {
    if (!pendingTransition) return;
    const { play, fromState, toState } = pendingTransition;
    if (fromState === "ended" && toState === "active") {
      applyStatusChange(play, toState, reactivateEndDate);
    } else if (fromState === "ended" && toState === "upcoming" && relaunchRange?.from && relaunchRange?.to) {
      updatePlay(play.id, {
        status: "scheduled",
        startDate: relaunchRange.from.toISOString().slice(0, 10),
        endDate: relaunchRange.to.toISOString().slice(0, 10),
      });
    } else if (fromState === "active" && toState === "upcoming" && rescheduleLaunchDate) {
      updatePlay(play.id, { status: "scheduled", startDate: rescheduleLaunchDate.toISOString().slice(0, 10) });
    } else {
      applyStatusChange(play, toState);
    }
    setPendingTransition(null);
    setReactivateEndDate(undefined);
    setRescheduleLaunchDate(undefined);
    setRelaunchRange(undefined);
  };

  const handleDismiss = () => {
    setPendingTransition(null);
    setReactivateEndDate(undefined);
    setRescheduleLaunchDate(undefined);
    setRelaunchRange(undefined);
  };

  const isActivateFromDraft =
    pendingTransition &&
    pendingTransition.fromState === "draft" &&
    pendingTransition.toState === "active";

  const isLaunchNow =
    pendingTransition &&
    pendingTransition.fromState === "upcoming" &&
    pendingTransition.toState === "active";

  const isDeactivateWarning =
    pendingTransition &&
    pendingTransition.fromState === "active" &&
    pendingTransition.toState === "draft";

  const isReschedule =
    pendingTransition &&
    pendingTransition.fromState === "active" &&
    pendingTransition.toState === "upcoming";

  const isReactivate =
    pendingTransition &&
    pendingTransition.fromState === "ended" &&
    pendingTransition.toState === "active";

  const isRelaunch =
    pendingTransition &&
    pendingTransition.fromState === "ended" &&
    pendingTransition.toState === "upcoming";

  const isEndPlay =
    pendingTransition &&
    pendingTransition.fromState === "active" &&
    pendingTransition.toState === "ended";

  const isCancelUpcoming =
    pendingTransition &&
    pendingTransition.fromState === "upcoming" &&
    pendingTransition.toState === "ended";

  const anyFilterActive =
    selectedStatuses.size > 0 || selectedSegments.size > 0 || selectedGeos.size > 0 || selectedOwners.size > 0;

  const clearAllFilters = () => {
    setSelectedStatuses(new Set());
    setSelectedSegments(new Set());
    setSelectedGeos(new Set());
    setSelectedOwners(new Set());
  };

  return (
    <Layout>
      <div className="flex flex-col h-[var(--page-content-height)] overflow-hidden">
        <WorkspaceHeader
          backLink={{ to: cyclePath("/prospecting"), label: "Prospecting" }}
          title="Plays"
        />

        <div className="flex-1 overflow-y-auto bg-muted/30">
          <div className="px-12 py-8">
            {/* Filters + CTA */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 flex-wrap">
                <MultiSelectDropdown
                  label="Status"
                  options={STATE_OPTIONS.map((s) => s.label)}
                  selected={new Set(Array.from(selectedStatuses).map((s) => STATE_PILL_LABEL[s as PlayState]))}
                  onToggle={(label) => {
                    const value = STATE_OPTIONS.find((s) => s.label === label)?.value;
                    if (value) toggle(setSelectedStatuses)(value);
                  }}
                  onClear={clear(setSelectedStatuses)}
                />
                <MultiSelectDropdown
                  label="Segment"
                  options={SEGMENT_OPTIONS}
                  selected={selectedSegments}
                  onToggle={toggle(setSelectedSegments)}
                  onClear={clear(setSelectedSegments)}
                />
                <MultiSelectDropdown
                  label="Geo"
                  options={GEO_OPTIONS}
                  selected={selectedGeos}
                  onToggle={toggle(setSelectedGeos)}
                  onClear={clear(setSelectedGeos)}
                />
                <MultiSelectDropdown
                  label="Owner"
                  options={ownerOptions}
                  selected={selectedOwners}
                  onToggle={toggle(setSelectedOwners)}
                  onClear={clear(setSelectedOwners)}
                  width="w-56"
                />
              </div>
              <Button onClick={handleCreateClick}>Create play</Button>
            </div>

            {/* Table */}
            <div className="border border-border bg-card rounded-[4px] overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow className="bg-[var(--color-fill-surface-recessed)] hover:bg-[var(--color-fill-surface-recessed)] border-[var(--color-border-transitional-core-subtle)]">
                      <TableHead className="min-w-[260px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Name</TableHead>
                      <TableHead className="min-w-[180px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Owner</TableHead>
                      <TableHead className="min-w-[120px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Status</TableHead>
                      <TableHead className="min-w-[160px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Segment</TableHead>
                      <TableHead className="min-w-[120px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Geo</TableHead>
                      <TableHead className="min-w-[220px] px-6 table-header-text align-middle border-r border-[var(--color-border-transitional-core-subtle)]">Sequence</TableHead>
                      <TableHead className="min-w-[220px] px-6 table-header-text align-middle">Dates</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="[&>tr:last-child>td]:border-b-0">
                    {filtered.length === 0 ? (
                      <TableRow>
                        <td colSpan={7} className="border-b border-border px-6 py-12 text-center">
                          <p className="body-100 text-muted-foreground mb-3">No plays match these filters</p>
                          {anyFilterActive && (
                            <Button variant="ghost" size="medium" onClick={clearAllFilters}>
                              Clear filters
                            </Button>
                          )}
                        </td>
                      </TableRow>
                    ) : (
                      filtered.map((play) => {
                        const state = getPlayState(play);
                        const editable = isPlayEditable(play);
                        return (
                          <TableRow key={play.id} className="bg-card">
                            <td className="border-b border-border px-6 py-3 align-middle hover:bg-fill-surface-recessed transition-colors">
                              <div className="flex items-center gap-2">
                                {editable ? (
                                  <button
                                    type="button"
                                    onClick={() => handleEditPlay(play)}
                                    className="body-125 text-text-interactive hover:text-text-interactive-hover hover:underline text-left"
                                  >
                                    {play.label}
                                  </button>
                                ) : (
                                  <span className="body-125 text-foreground">{play.label}</span>
                                )}
                                {play.isPotm && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span><Badge variant="lorax" className="cursor-default">POTM</Badge></span>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">Play of the Month</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground hover:bg-fill-surface-recessed transition-colors">{play.owner}</td>
                            <td className="border-b border-border align-middle hover:bg-fill-surface-recessed transition-colors p-0 group/status">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="w-full h-full px-6 py-3 flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full body-75 ${STATE_PILL_CLASS[state]}`}
                                    >
                                      {STATE_PILL_LABEL[state]}
                                    </span>
                                    <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover/status:opacity-100 transition-opacity" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-36 bg-card border border-border shadow-lg" align="start">
                                  {STATE_OPTIONS.filter((opt) => ALLOWED_TRANSITIONS[state].includes(opt.value)).map((opt) => (
                                    <DropdownMenuItem
                                      key={opt.value}
                                      className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                                      onSelect={() => handleStatusChange(play, opt.value)}
                                    >
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full detail-200 ${STATE_PILL_CLASS[opt.value]}`}
                                      >
                                        {opt.label}
                                      </span>
                                      {state === opt.value && (
                                        <Check className="h-3 w-3 ml-auto text-muted-foreground" />
                                      )}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground hover:bg-fill-surface-recessed transition-colors">
                              {play.marketSegment && play.marketSegment.length > 0
                                ? play.marketSegment.join(", ")
                                : "—"}
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground hover:bg-fill-surface-recessed transition-colors">
                              {play.geo && play.geo.length > 0 ? play.geo.join(", ") : "—"}
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 hover:bg-fill-surface-recessed transition-colors">
                              {play.sequence ? (
                                <button
                                  type="button"
                                  className="text-link-100 text-text-interactive hover:text-text-interactive-hover hover:underline text-left"
                                >
                                  {play.sequence}
                                </button>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground hover:bg-fill-surface-recessed transition-colors">
                              {formatDateRange(play.startDate, play.endDate)}
                            </td>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activate from draft (draft → active) */}
      <AlertDialog open={!!isActivateFromDraft} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate this play?</AlertDialogTitle>
            <AlertDialogDescription>
              This play will be visible to {getRepCount(pendingTransition?.play ?? {} as Play)} reps
              in {getGeoLabel(pendingTransition?.play ?? {} as Play)} {getVisibilityTiming(pendingTransition?.play ?? {} as Play)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDismiss}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Activate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Launch now (upcoming → active) */}
      <AlertDialog open={!!isLaunchNow} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Launch this play now?</AlertDialogTitle>
            <AlertDialogDescription>
              This will launch this play to {getRepCount(pendingTransition?.play ?? {} as Play)} reps
              in {getGeoLabel(pendingTransition?.play ?? {} as Play)} immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDismiss}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Launch Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule (active → upcoming) with date picker */}
      <Dialog open={!!isReschedule} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule launch</DialogTitle>
            <DialogDescription>
              What date do you want this play to launch on?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-2">
            <Calendar
              mode="single"
              selected={rescheduleLaunchDate}
              onSelect={setRescheduleLaunchDate}
              disabled={(date) => date <= new Date()}
              className="rounded-md border"
            />
          </div>
          {rescheduleLaunchDate && (
            <p className="body-100 text-muted-foreground text-center">
              Play will launch on {format(rescheduleLaunchDate, "MMM d, yyyy")}
            </p>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={handleDismiss}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirm} disabled={!rescheduleLaunchDate}>
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirmation (active → draft) */}
      <AlertDialog open={!!isDeactivateWarning} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to draft?</AlertDialogTitle>
            <AlertDialogDescription>
              {getRepCount(pendingTransition?.play ?? {} as Play)} reps
              in {getGeoLabel(pendingTransition?.play ?? {} as Play)} will lose access to this play immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDismiss}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Move to Draft</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End active play (active → ended) */}
      <AlertDialog open={!!isEndPlay} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this play?</AlertDialogTitle>
            <AlertDialogDescription>
              {getRepCount(pendingTransition?.play ?? {} as Play)} reps
              in {getGeoLabel(pendingTransition?.play ?? {} as Play)} will lose access to this play immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDismiss}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>End Play</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel upcoming play (upcoming → ended) */}
      <AlertDialog open={!!isCancelUpcoming} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this play?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the scheduled launch. The play will be marked as ended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDismiss}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>End Play</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate dialog (ended → active) with date picker */}
      <Dialog open={!!isReactivate} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reactivate this play</DialogTitle>
            <DialogDescription>
              Set an end date for this play. Reps
              in {getGeoLabel(pendingTransition?.play ?? {} as Play)} will
              see it immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-2">
            <Calendar
              mode="single"
              selected={reactivateEndDate}
              onSelect={setReactivateEndDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
          {reactivateEndDate && (
            <p className="body-100 text-muted-foreground text-center">
              Play will end on {format(reactivateEndDate, "MMM d, yyyy")}
            </p>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={handleDismiss}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirm} disabled={!reactivateEndDate}>
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Relaunch as upcoming (ended → upcoming) with range picker */}
      <Dialog open={!!isRelaunch} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule this play again</DialogTitle>
            <DialogDescription>
              Pick a launch date and an expiry date.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-2">
            <Calendar
              mode="range"
              selected={relaunchRange as import("react-day-picker").DateRange | undefined}
              onSelect={(range) => setRelaunchRange(range as { from?: Date; to?: Date } | undefined)}
              disabled={(date) => date <= new Date()}
              className="rounded-md border"
            />
          </div>
          {relaunchRange?.from && relaunchRange?.to && (
            <p className="body-100 text-muted-foreground text-center">
              {format(relaunchRange.from, "MMM d, yyyy")} – {format(relaunchRange.to, "MMM d, yyyy")}
            </p>
          )}
          {relaunchRange?.from && !relaunchRange?.to && (
            <p className="body-100 text-muted-foreground text-center">
              Launch: {format(relaunchRange.from, "MMM d, yyyy")} — now pick an expiry date
            </p>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={handleDismiss}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirm} disabled={!relaunchRange?.from || !relaunchRange?.to}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Plays;
