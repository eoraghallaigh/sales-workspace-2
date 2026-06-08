import { useCallback, useEffect, useRef, useState } from "react";
import SandboxPanel from "./SandboxPanel";
import { getElementSource } from "./fiber";
import { applyOverride, clearAllOverrides, clearOverride } from "./overrides";
import { applyButtonVariant } from "./buttonVariants";
import {
  Crumb,
  PanelState,
  SandboxEntry,
  buildOutput,
  computeOriginal,
  formatEntryBlock,
  hasChanges,
  initialState,
} from "./model";

let idCounter = 0;
const nextId = () => `sbx-${(idCounter += 1)}`;

const isSandboxUi = (node: EventTarget | null): boolean =>
  node instanceof Element && !!node.closest("[data-sandbox-ui]");

const labelFor = (node: HTMLElement): string => {
  const testId = node.getAttribute("data-testid");
  if (testId) return `#${testId}`;
  if (node.id) return `#${node.id}`;
  const source = getElementSource(node);
  const base = source.componentName ?? node.tagName.toLowerCase();
  if (source.lineNumber) return `${base}:${source.lineNumber}`;
  const firstClass =
    typeof node.className === "string" && node.className.trim()
      ? `.${node.className.trim().split(/\s+/)[0]}`
      : "";
  return `${base}${firstClass}`;
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

const OverlayBox = ({ rect, color }: { rect: DOMRect; color: string }) => (
  <div
    data-sandbox-ui="true"
    className="pointer-events-none fixed z-[2147483646] rounded-[2px]"
    style={{
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      outline: `2px solid ${color}`,
      outlineOffset: "1px",
      background: `${color}14`,
    }}
  />
);

const FlashRing = ({ element, onDone }: { element: HTMLElement; onDone: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const animation = node.animate(
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.15 },
        { opacity: 0, offset: 1 },
      ],
      { duration: 5000, easing: "ease-out", fill: "forwards" },
    );
    animation.onfinish = () => doneRef.current();
    return () => animation.cancel();
  }, []);

  const rect = element.getBoundingClientRect();
  return (
    <div
      ref={ref}
      data-sandbox-ui="true"
      className="pointer-events-none fixed z-[2147483646] rounded-[2px]"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        outline: "2px solid #016DE1",
        outlineOffset: "1px",
        boxShadow: "0 0 0 4px rgba(1, 109, 225, 0.25)",
      }}
    />
  );
};

const DesignMode = () => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<HTMLElement | null>(null);
  const [flash, setFlash] = useState<{ element: HTMLElement; key: number } | null>(null);
  const [entries, setEntries] = useState<Record<string, SandboxEntry>>({});
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [, forceTick] = useState(0);

  const entriesRef = useRef(entries);
  const currentIdRef = useRef(currentId);
  const flashKey = useRef(0);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);
  useEffect(() => {
    currentIdRef.current = currentId;
  }, [currentId]);

  const pruneIfEmpty = useCallback((id: string) => {
    const entry = entriesRef.current[id];
    if (entry && !hasChanges(entry)) {
      clearOverride(id);
      applyButtonVariant(entry.element, entry.original, entry.original.variant);
      entry.element.removeAttribute("data-sandbox-id");
      setEntries((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }, []);

  const selectElement = useCallback(
    (element: HTMLElement) => {
      const prevId = currentIdRef.current;
      const existingId = element.getAttribute("data-sandbox-id");
      let targetId: string;
      if (existingId && entriesRef.current[existingId]) {
        targetId = existingId;
      } else {
        targetId = nextId();
        element.setAttribute("data-sandbox-id", targetId);
        const original = computeOriginal(element);
        const entry: SandboxEntry = {
          id: targetId,
          element,
          source: getElementSource(element),
          label: labelFor(element),
          crumbs: buildCrumbs(element),
          original,
          state: initialState(original),
        };
        setEntries((prev) => ({ ...prev, [targetId]: entry }));
      }
      setCurrentId(targetId);
      flashKey.current += 1;
      setFlash({ element, key: flashKey.current });
      if (prevId && prevId !== targetId) {
        pruneIfEmpty(prevId);
      }
    },
    [pruneIfEmpty],
  );

  const handleStateChange = useCallback((state: PanelState) => {
    const id = currentIdRef.current;
    if (!id) return;
    const entry = entriesRef.current[id];
    if (!entry) return;
    applyOverride(id, buildOutput(state, entry.original).decls);
    applyButtonVariant(entry.element, entry.original, state.variant);
    setEntries((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], state } } : prev));
  }, []);

  const resetCurrent = useCallback(() => {
    const id = currentIdRef.current;
    if (!id) return;
    const entry = entriesRef.current[id];
    if (!entry) return;
    clearOverride(id);
    applyButtonVariant(entry.element, entry.original, entry.original.variant);
    setEntries((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], state: initialState(entry.original) } } : prev,
    );
  }, []);

  const removeEntry = useCallback((id: string) => {
    const entry = entriesRef.current[id];
    if (!entry) return;
    clearOverride(id);
    applyButtonVariant(entry.element, entry.original, entry.original.variant);
    if (id === currentIdRef.current) {
      setEntries((prev) =>
        prev[id] ? { ...prev, [id]: { ...prev[id], state: initialState(entry.original) } } : prev,
      );
    } else {
      entry.element.removeAttribute("data-sandbox-id");
      setEntries((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }, []);

  const selectStashItem = useCallback(
    (id: string) => {
      const entry = entriesRef.current[id];
      if (entry) selectElement(entry.element);
    },
    [selectElement],
  );

  const deselect = useCallback(() => {
    const id = currentIdRef.current;
    if (id) pruneIfEmpty(id);
    setCurrentId(null);
  }, [pruneIfEmpty]);

  const copyAll = useCallback(() => {
    const blocks = Object.values(entriesRef.current)
      .map((entry) => ({ entry, output: buildOutput(entry.state, entry.original) }))
      .filter((item) => item.output.summary.length > 0)
      .map((item) => formatEntryBlock(item.entry.source, item.entry.element, item.output));
    if (!blocks.length) return;
    const text = `Design sandbox — ${blocks.length} element(s) to update:\n\n${blocks.join("\n\n---\n\n")}`;
    navigator.clipboard?.writeText(text).then(() => setCopiedAll(true)).catch(() => setCopiedAll(false));
  }, []);

  const clearAll = useCallback(() => {
    Object.values(entriesRef.current).forEach((entry) => {
      applyButtonVariant(entry.element, entry.original, entry.original.variant);
      entry.element.removeAttribute("data-sandbox-id");
    });
    clearAllOverrides();
    setEntries({});
    setCurrentId(null);
    setFlash(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === "d" || event.key === "D")) {
        event.preventDefault();
        setActive((prev) => !prev);
        return;
      }
      if (event.key === "Escape") {
        if (currentIdRef.current) deselect();
        else setActive(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deselect]);

  useEffect(() => {
    if (!active) {
      setHovered(null);
      setFlash(null);
      return;
    }

    const stopSandboxInteraction = (event: Event) => {
      const target = event.target;
      const related = (event as FocusEvent).relatedTarget;
      const fromSandbox = target instanceof Element && !!target.closest("[data-sandbox-ui]");
      const toSandbox = related instanceof Element && !!related.closest("[data-sandbox-ui]");
      if (fromSandbox || toSandbox) {
        event.stopPropagation();
      }
    };
    const interactionEvents = ["pointerdown", "mousedown", "pointerup", "click", "focusin", "focusout"];
    interactionEvents.forEach((type) => document.body.addEventListener(type, stopSandboxInteraction));

    const onMove = (event: MouseEvent) => {
      const target = event.target;
      if (isSandboxUi(target) || !(target instanceof HTMLElement)) {
        setHovered(null);
        return;
      }
      setHovered(target);
    };

    const onClick = (event: MouseEvent) => {
      if (isSandboxUi(event.target)) return;
      if (!(event.target instanceof HTMLElement)) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(event.target);
    };

    const onContextMenu = (event: MouseEvent) => {
      if (isSandboxUi(event.target)) return;
      if (!(event.target instanceof HTMLElement)) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(event.target);
    };

    const onReposition = () => forceTick((tick) => tick + 1);

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition, true);

    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onContextMenu, true);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition, true);
      interactionEvents.forEach((type) => document.body.removeEventListener(type, stopSandboxInteraction));
    };
  }, [active, selectElement]);

  useEffect(() => {
    document.body.style.cursor = active && !currentId ? "crosshair" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [active, currentId]);

  useEffect(() => {
    setCopiedAll(false);
  }, [entries]);

  useEffect(() => () => clearAllOverrides(), []);

  if (!active) return null;

  const currentEntry = currentId ? entries[currentId] : undefined;
  const currentElement = currentEntry?.element ?? null;
  const hoveredRect = hovered && hovered !== currentElement ? hovered.getBoundingClientRect() : null;

  const trayItems = Object.values(entries)
    .map((entry) => ({ id: entry.id, label: entry.label, count: buildOutput(entry.state, entry.original).summary.length }))
    .filter((item) => item.count > 0);

  return (
    <>
      {hoveredRect && <OverlayBox rect={hoveredRect} color="#016DE1" />}
      {flash && <FlashRing key={flash.key} element={flash.element} onDone={() => setFlash(null)} />}

      <div
        data-sandbox-ui="true"
        className="fixed bottom-4 left-4 z-[2147483647] flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
        style={{ fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif", pointerEvents: "auto" }}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[#FF4800]" />
        Design mode
        <span className="font-normal text-slate-400">
          {currentId ? "Esc to deselect" : "click an element · Esc to exit"}
        </span>
        {trayItems.length > 0 && (
          <span className="ml-1 rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200">
            {trayItems.length} staged
          </span>
        )}
      </div>

      {currentEntry && (
        <SandboxPanel
          entry={currentEntry}
          output={buildOutput(currentEntry.state, currentEntry.original)}
          onStateChange={handleStateChange}
          onSelectCrumb={selectElement}
          onClose={deselect}
          onReset={resetCurrent}
          stash={trayItems}
          currentId={currentEntry.id}
          copiedAll={copiedAll}
          onSelectStashItem={selectStashItem}
          onRemoveStashItem={removeEntry}
          onCopyAll={copyAll}
          onClearAll={clearAll}
        />
      )}
    </>
  );
};

export default DesignMode;
