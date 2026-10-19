import { useEffect, useRef, useState } from "react";

// Tracks whether a scroll container's content is wider than its visible box,
// i.e. whether horizontal scrolling is actually available. Re-measures after
// layout settles and on any size change, so callers can show a scroll
// affordance (e.g. an edge shadow) only when it's needed.
export function useHorizontalOverflow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    update();
    const raf = requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return { ref, overflowing };
}
