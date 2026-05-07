import { useEffect, useRef, useState, type RefObject } from "react";

interface UseScrollSpyOptions {
  rootMargin?: string;
  root?: RefObject<HTMLElement | null>;
}

export const useScrollSpy = (
  sectionIds: string[],
  options: UseScrollSpyOptions = {},
) => {
  const { rootMargin = "-30% 0px -60% 0px", root } = options;
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  const intersectingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sectionIds.length === 0) return;

    intersectingRef.current.clear();

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            intersectingRef.current.add(id);
          } else {
            intersectingRef.current.delete(id);
          }
        }

        if (intersectingRef.current.size === 0) return;

        const orderedIds = sectionIds.filter((id) =>
          intersectingRef.current.has(id),
        );
        if (orderedIds.length > 0) {
          setActiveId(orderedIds[0]);
        }
      },
      {
        root: root?.current ?? null,
        rootMargin,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      intersectingRef.current.clear();
    };
  }, [sectionIds, rootMargin, root]);

  return activeId;
};
