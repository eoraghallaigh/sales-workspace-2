import { useEffect, useMemo, useRef, useState } from "react";
import InspectorPanel, { Crumb } from "./InspectorPanel";
import SpacingOverlay from "./SpacingOverlay";
import { inspectElement } from "./inspect";
import { getElementSource } from "../sandbox/fiber";

const HOVER_COLOR = "#016DE1";
const SELECT_COLOR = "#FF4800";

const isInspectorUi = (node: EventTarget | null): boolean =>
  node instanceof Element && !!node.closest("[data-inspector-ui]");

const labelFor = (node: HTMLElement): string => {
  const testId = node.getAttribute("data-testid");
  if (testId) return testId;
  if (node.id) return `#${node.id}`;
  const source = getElementSource(node);
  if (source.componentName) return source.componentName;
  const firstClass =
    typeof node.className === "string" && node.className.trim()
      ? `.${node.className.trim().split(/\s+/)[0]}`
      : "";
  return `${node.tagName.toLowerCase()}${firstClass}`;
};

const buildCrumbs = (element: HTMLElement): Crumb[] => {
  const chain: HTMLElement[] = [];
  let cursor: HTMLElement | null = element;
  while (cursor && cursor !== document.body && chain.length < 6) {
    chain.push(cursor);
    cursor = cursor.parentElement;
  }
  return chain.reverse().map((node) => ({ element: node, label: labelFor(node) }));
};

const Box = ({ rect, color, filled }: { rect: DOMRect; color: string; filled?: boolean }) => (
  <div
    data-inspector-ui="true"
    className="pointer-events-none fixed z-[2147483646] rounded-[2px]"
    style={{
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      outline: `2px solid ${color}`,
      outlineOffset: "1px",
      background: filled ? `${color}14` : "transparent",
    }}
  />
);

const Inspector = () => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [showSpacing, setShowSpacing] = useState(true);
  const [, forceTick] = useState(0);

  const selectedRef = useRef<HTMLElement | null>(null);
  selectedRef.current = selected;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === "i" || event.key === "I")) {
        event.preventDefault();
        setActive((prev) => !prev);
        setSelected(null);
        return;
      }
      if (event.key === "Escape" && active) {
        event.preventDefault();
        if (selectedRef.current) setSelected(null);
        else setActive(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    if (!active) {
      setHovered(null);
      return;
    }

    const onMove = (event: MouseEvent) => {
      const target = event.target;
      if (isInspectorUi(target) || !(target instanceof HTMLElement)) {
        setHovered(null);
        return;
      }
      setHovered(target);
    };

    const onClick = (event: MouseEvent) => {
      if (isInspectorUi(event.target)) return;
      if (!(event.target instanceof HTMLElement)) return;
      event.preventDefault();
      event.stopPropagation();
      setSelected(event.target);
      setHovered(null);
    };

    const onContextMenu = (event: MouseEvent) => {
      if (isInspectorUi(event.target)) return;
      if (!(event.target instanceof HTMLElement)) return;
      event.preventDefault();
      event.stopPropagation();
      setSelected(event.target);
    };

    const swallow = (event: Event) => {
      if (isInspectorUi(event.target)) return;
      if (event.target instanceof HTMLElement) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onReposition = () => forceTick((tick) => tick + 1);

    const swallowed = ["mousedown", "pointerdown", "mouseup", "pointerup", "dblclick"];
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    swallowed.forEach((type) => document.addEventListener(type, swallow, true));
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition, true);

    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onContextMenu, true);
      swallowed.forEach((type) => document.removeEventListener(type, swallow, true));
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition, true);
    };
  }, [active]);

  useEffect(() => {
    document.body.style.cursor = active && !selected ? "crosshair" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [active, selected]);

  const data = useMemo(() => (selected ? inspectElement(selected) : null), [selected]);
  const crumbs = useMemo(() => (selected ? buildCrumbs(selected) : []), [selected]);

  if (!active) return null;

  const hoveredRect =
    hovered && hovered !== selected ? hovered.getBoundingClientRect() : null;
  const selectedRect = selected ? selected.getBoundingClientRect() : null;

  return (
    <>
      {hoveredRect && <Box rect={hoveredRect} color={HOVER_COLOR} filled />}
      {selected && showSpacing && <SpacingOverlay element={selected} />}
      {selectedRect && <Box rect={selectedRect} color={SELECT_COLOR} />}

      <div
        data-inspector-ui="true"
        className="fixed bottom-4 left-4 z-[2147483647] flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
        style={{ fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif", pointerEvents: "auto" }}
      >
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: HOVER_COLOR }} />
        Inspect mode
        {selected && (
          <button
            type="button"
            onClick={() => setShowSpacing((prev) => !prev)}
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{
              background: showSpacing ? "#0BA5A5" : "transparent",
              color: showSpacing ? "#fff" : "#94a3b8",
              border: `1px solid ${showSpacing ? "#0BA5A5" : "#475569"}`,
            }}
          >
            Spacing
          </button>
        )}
        <span className="font-normal text-slate-400">
          {selected ? "Esc to deselect · ⌃I to exit" : "click an element · Esc to exit"}
        </span>
      </div>

      {data && selected && (
        <InspectorPanel
          data={data}
          crumbs={crumbs}
          onSelectCrumb={(element) => setSelected(element)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

export default Inspector;
