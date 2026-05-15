import { useEffect, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { useScrollSpy } from "./useScrollSpy";
import { cn } from "@/lib/utils";
import {
  TrellisIcon,
  type TrellisIconName,
} from "@/components/ui/trellis-icon";

export interface FloatingNavSection {
  id: string;
  label: string;
  icon: TrellisIconName;
}

interface FloatingNavProps {
  sections: FloatingNavSection[];
  scrollRoot?: RefObject<HTMLElement | null>;
}

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 264;
const LABEL_MAX_WIDTH = 168;

const widthTransition = {
  type: "spring" as const,
  stiffness: 480,
  damping: 38,
  mass: 0.7,
};

export const FloatingNav = ({ sections, scrollRoot }: FloatingNavProps) => {
  const sectionIds = sections.map((s) => s.id);
  const activeId = useScrollSpy(sectionIds, { root: scrollRoot });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash && sectionIds.includes(hash)) {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "auto", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <motion.aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onFocusCapture={() => setIsExpanded(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsExpanded(false);
        }
      }}
      animate={{ width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      initial={{ width: COLLAPSED_WIDTH }}
      transition={widthTransition}
      aria-label="Page sections"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 overflow-hidden rounded-[40px] border border-border bg-white p-4 shadow-[0px_1px_24px_0px_rgba(0,0,0,0.08)]"
    >
      <nav>
        <ul className="flex flex-col gap-2">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  aria-current={isActive ? "true" : undefined}
                  title={section.label}
                  className={cn(
                    "flex items-center rounded-[24px] py-2 transition-colors",
                    "outline-none focus-visible:ring-2 focus-visible:ring-text-interactive",
                    isExpanded ? "px-2" : "justify-center px-2",
                    isActive
                      ? "bg-fill-secondary-hover"
                      : "hover:bg-fill-surface-raised/60",
                  )}
                >
                  <TrellisIcon
                    name={section.icon}
                    size={32}
                    className={cn(
                      "shrink-0 transition-opacity",
                      isActive ? "opacity-100" : "opacity-80",
                    )}
                  />
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isExpanded ? 1 : 0,
                      maxWidth: isExpanded ? LABEL_MAX_WIDTH : 0,
                      marginLeft: isExpanded ? 16 : 0,
                    }}
                    transition={{
                      opacity: { duration: isExpanded ? 0.16 : 0.08 },
                      maxWidth: widthTransition,
                      marginLeft: widthTransition,
                    }}
                    className={cn(
                      "overflow-hidden whitespace-nowrap body-200",
                      isActive
                        ? "text-foreground heading-100"
                        : "text-muted-foreground",
                    )}
                  >
                    {section.label}
                  </motion.span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
};
