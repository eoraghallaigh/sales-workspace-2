import { useState, type CSSProperties } from "react";

// Drag-to-resize column widths for the workspace tables. Widths are keyed by a
// caller-chosen column id and seeded from each column's default width. Pair the
// returned `startResize` with the <ColumnResizeHandle> component.
const MIN_WIDTH = 80;

export function useResizableColumns(initial: Record<string, number>) {
  const [widths, setWidths] = useState<Record<string, number>>(initial);

  const startResize = (key: string, clientX: number) => {
    const startX = clientX;
    const startWidth = widths[key] ?? initial[key] ?? MIN_WIDTH;

    const onMove = (e: MouseEvent) => {
      const next = Math.max(MIN_WIDTH, startWidth + (e.clientX - startX));
      setWidths((prev) => ({ ...prev, [key]: next }));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  // Pin a column to its width. Used with `table-layout: fixed` so a resize
  // grows/shrinks only that column (and the table), never its neighbours.
  const colStyle = (key: string): CSSProperties => {
    const w = widths[key];
    return w ? { width: w, minWidth: w, maxWidth: w } : {};
  };

  // Sum of the given column widths (+ any fixed columns not in the map, e.g. a
  // checkbox), used as the table's own width under `table-layout: fixed`.
  const totalWidth = (keys: string[], extra = 0): number =>
    keys.reduce((sum, k) => sum + (widths[k] ?? 0), 0) + extra;

  // Scale the given columns proportionally so they fill `target` (e.g. the
  // container width) — so the table fills available space by default. Only
  // grows to fill; if the columns are already wider than the target we leave
  // them (the table scrolls). Call once from a layout effect on mount.
  const fit = (keys: string[], target: number, extra = 0) => {
    setWidths((prev) => {
      const base = keys.reduce((sum, k) => sum + (prev[k] ?? 0), 0);
      const avail = target - extra;
      if (base <= 0 || avail <= base) return prev;
      const scale = avail / base;
      const next = { ...prev };
      keys.forEach((k) => {
        if (prev[k]) next[k] = Math.round(prev[k] * scale);
      });
      return next;
    });
  };

  return { widths, startResize, colStyle, totalWidth, fit };
}
