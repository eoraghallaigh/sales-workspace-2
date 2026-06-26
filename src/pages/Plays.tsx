import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrellisIcon } from "@/components/ui/trellis-icon";
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

const SEGMENT_OPTIONS = ["SMB", "Mid-Market", "Enterprise"];
const GEO_OPTIONS = ["US", "EMEA", "APAC", "France"];

const STATE_PILL_CLASS: Record<PlayState, string> = {
  draft: "bg-trellis-neutral-100 text-muted-foreground",
  upcoming: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
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

const Plays = () => {
  const navigate = useNavigate();
  const { cyclePath } = useCyclePath();
  const { plays } = usePlays();

  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set());
  const [selectedGeos, setSelectedGeos] = useState<Set<string>>(new Set());
  const [selectedOwners, setSelectedOwners] = useState<Set<string>>(new Set());

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
      <div className="flex flex-col h-screen overflow-hidden">
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
                      <TableHead className="min-w-[220px] px-6 table-header-text align-middle">Dates</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="[&>tr:last-child>td]:border-b-0">
                    {filtered.length === 0 ? (
                      <TableRow>
                        <td colSpan={6} className="border-b border-border px-6 py-12 text-center">
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
                          <TableRow key={play.id} className="bg-card hover:bg-fill-surface-recessed">
                            <td className="border-b border-border px-6 py-3 align-middle">
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
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground">{play.owner}</td>
                            <td className="border-b border-border px-6 py-3 align-middle">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full body-75 ${STATE_PILL_CLASS[state]}`}
                              >
                                {STATE_PILL_LABEL[state]}
                              </span>
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground">
                              {play.marketSegment && play.marketSegment.length > 0
                                ? play.marketSegment.join(", ")
                                : "—"}
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground">
                              {play.geo && play.geo.length > 0 ? play.geo.join(", ") : "—"}
                            </td>
                            <td className="border-b border-border px-6 py-3 align-middle body-100 text-muted-foreground">
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

    </Layout>
  );
};

export default Plays;
