import { Link } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCyclePath } from "@/hooks/useCyclePath";
import { useTheme } from "@/contexts/ThemeContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

const REPS = [
  "Eoin McCarthy",
  "Eoin Gallagher",
  "Eoin Doyle",
  "Eoin O'Connell",
  "Eoin Beecham",
  "Eoin Riddell",
  "Eoin Smith",
  "Eoin O'Riordan",
  "Eoin Ó Raghallaigh",
];

const RepSelector = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    if (typeof window === "undefined") return "Eoin Ó Raghallaigh";
    return localStorage.getItem("selectedRep") || "Eoin Ó Raghallaigh";
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 outline-none hover:opacity-80 transition-opacity"
        >
          <span>{selected}</span>
          <ChevronDown className="h-5 w-5 text-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <Command>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandEmpty>No reps found.</CommandEmpty>
            <CommandGroup>
              {REPS.map((rep) => (
                <CommandItem
                  key={rep}
                  value={rep}
                  onSelect={() => {
                    setSelected(rep);
                    localStorage.setItem("selectedRep", rep);
                    setOpen(false);
                  }}
                  className={`cursor-pointer body-125 ${rep === selected ? "bg-trellis-neutral-300" : ""}`}
                >
                  {rep}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface WorkspaceHeaderProps {
  activeTab?: "summary" | "prospecting" | "feed" | "deals" | "tasks" | "schedule" | "agents" | "performance";
  hideTabs?: boolean;
  hideTitle?: boolean;
  subtitle?: ReactNode;
  backLink?: { to: string; label: string };
  title?: string;
  // Right-aligned content for the back-link page header (e.g. status + CTA).
  actions?: ReactNode;
}

/*
 * WorkspaceHeader — themed page chrome (title + workspace tabs).
 * Transitional: heading-300 title, full-width underline tabs (master).
 * Alpha: Heading 03 title with 40/32px spacing, content-width grey-pill tabs
 *        with an animated sliding background + underline indicator.
 */
const WorkspaceHeader = ({
  activeTab = "summary",
  hideTabs = false,
  hideTitle = false,
  subtitle,
  backLink,
  title,
  actions,
}: WorkspaceHeaderProps) => {
  const { cyclePath } = useCyclePath();
  const { theme } = useTheme();
  const isAlpha = theme === "alpha";

  const tabs = [
    { id: "summary", label: "Summary", path: cyclePath("/summary") },
    { id: "prospecting", label: "Prospecting", path: cyclePath("/prospecting") },
    { id: "feed", label: "Feed", path: "#" },
    { id: "tasks", label: "Tasks", path: "#" },
    { id: "schedule", label: "Schedule", path: "#" },
    { id: "performance", label: "Performance", path: cyclePath("/dashboard") },
  ];

  // Alpha sliding-indicator state (unused in transitional, but hooks run always).
  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    if (!isAlpha) return;
    const el = tabRefs.current[activeTab];
    if (!el) {
      setIndicator(prev => ({ ...prev, width: 0 }));
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [activeTab, hideTabs, isAlpha]);

  useEffect(() => {
    if (!isAlpha) return;
    const handleResize = () => {
      const el = tabRefs.current[activeTab];
      if (!el) return;
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab, isAlpha]);

  const titleClass = isAlpha ? "trellis-text-heading-03" : "heading-300";

  if (backLink) {
    return (
      <div className="sticky top-0 z-30 bg-card border-b border-core-subtle" onWheel={(e) => e.stopPropagation()}>
        <div className="pl-12 pr-6 pt-6 pb-4 flex items-center justify-between gap-4">
          <div>
            <Link
              to={backLink.to}
              className="inline-flex items-center gap-1 heading-25 text-text-interactive hover:underline"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>{backLink.label}</span>
            </Link>
            {title && <h1 className={`${titleClass} mt-3`}>{title}</h1>}
            {subtitle && <div className="mt-2">{subtitle}</div>}
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-core-subtle" onWheel={(e) => e.stopPropagation()}>
      <div className={isAlpha ? "pl-12 pr-6 pt-10" : "pl-12 pr-6 pt-6"}>
        {!hideTitle && (
          <h1 className={`${titleClass} ${isAlpha ? "mb-8" : "mb-6"} flex items-center gap-3`}>
            <span>Sales</span>
            <span className="font-normal text-[var(--color-text-core-subtle)]">|</span>
            <RepSelector />
          </h1>
        )}
        {subtitle && <div className="mb-4">{subtitle}</div>}

        {!hideTabs && (
          isAlpha ? (
            // Alpha: content-width grey-pill tabs with animated sliding indicator
            <nav ref={navRef} className="relative inline-flex items-end gap-[8px] w-full">
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 h-[32px] rounded-[6px] bg-[#e6e6e6]"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.ready && indicator.width > 0 ? 1 : 0,
                  transition: "left 220ms cubic-bezier(0.33,0,0.4,1), width 220ms cubic-bezier(0.33,0,0.4,1), opacity 120ms ease-out",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-[#141414]"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.ready && indicator.width > 0 ? 1 : 0,
                  transition: "left 220ms cubic-bezier(0.33,0,0.4,1), width 220ms cubic-bezier(0.33,0,0.4,1), opacity 120ms ease-out",
                }}
              />
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    ref={(el) => { tabRefs.current[tab.id] = el; }}
                    className={`relative z-10 inline-flex items-center justify-center whitespace-nowrap min-h-[32px] px-[20px] mb-[10px] gap-[8px] rounded-[6px] text-[14px] leading-[20px] font-normal transition-colors outline-none ${
                      isActive ? "text-[#141414]" : "text-[#666666] hover:text-[#141414]"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          ) : (
            // Transitional: full-width underline tabs (master)
            <div className="border-b border-core-subtle">
              <nav className="flex space-x-8">
                {tabs.map(tab => (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`pb-4 px-1 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-foreground body-100 !font-bold"
                        : "border-transparent body-100 text-muted-foreground hover:text-foreground hover:border-core-subtle"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </nav>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default WorkspaceHeader;
