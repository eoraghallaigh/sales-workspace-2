import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import SandboxPanel from "./SandboxPanel";
import { getElementSource } from "./fiber";
import { applyOverride, clearAllOverrides, clearOverride } from "./overrides";
import { applyButtonVariant, applyButtonSize } from "./buttonVariants";
import {
  Crumb,
  PanelState,
  SandboxEntry,
  buildOutput,
  changeCount,
  computeOriginal,
  formatEntryBlock,
  hasChanges,
  initialState,
} from "./model";
import { type MoveRecord } from "./reorder";

type DropHint = { rect: DOMRect; position: "before" | "after"; horizontal: boolean };

let idCounter = 0;
const nextId = () => `sbx-${(idCounter += 1)}`;

// The module-level counter resets on hot-reload, while stale data-sandbox-id
// attributes can linger on the DOM. Verify each new id is unused so two
// elements can never share one (which would make an override hit both).
const nextUniqueId = (): string => {
  let id = nextId();
  while (document.querySelector(`[data-sandbox-id="${id}"]`)) {
    id = nextId();
  }
  return id;
};

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

// Restore an element to the DOM position it held before its first move.
const restoreMove = (entry: SandboxEntry) => {
  if (!entry.moveUndo) return;
  try {
    entry.moveUndo.parent.insertBefore(entry.element, entry.moveUndo.next);
  } catch {
    /* original parent no longer in the DOM */
  }
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

const DropLine = ({ hint }: { hint: DropHint }) => {
  const { rect, position, horizontal } = hint;
  const style: CSSProperties = horizontal
    ? {
        top: rect.top,
        height: rect.height,
        width: 3,
        left: position === "before" ? rect.left - 2 : rect.right - 1,
      }
    : {
        left: rect.left,
        width: rect.width,
        height: 3,
        top: position === "before" ? rect.top - 2 : rect.bottom - 1,
      };
  return (
    <div
      data-sandbox-ui="true"
      className="pointer-events-none fixed z-[2147483646] rounded-full bg-[#FF4800]"
      style={style}
    />
  );
};

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

  // Drag-to-reorder (applies to the currently selected element).
  const [dragLabel, setDragLabel] = useState<string | null>(null);
  const [cursorPt, setCursorPt] = useState<{ x: number; y: number } | null>(null);
  const [dropHint, setDropHint] = useState<DropHint | null>(null);
  const dragPending = useRef<{ x: number; y: number; el: HTMLElement } | null>(null);
  const draggingRef = useRef(false);
  const dropRef = useRef<{ el: HTMLElement; position: "before" | "after" } | null>(null);
  const didDragRef = useRef(false);

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
      applyButtonSize(entry.element, entry.original, entry.original.buttonSize);
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
        targetId = nextUniqueId();
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
    applyButtonSize(entry.element, entry.original, state.buttonSize);
    setEntries((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], state } } : prev));
  }, []);

  // Reorder the selected element in the live DOM and record the move on its entry.
  const moveSelected = useCallback(
    (el: HTMLElement, target: HTMLElement, position: "before" | "after") => {
      const id = currentIdRef.current;
      if (!id) return;
      const parent = target.parentElement;
      if (!parent || el === target || el.contains(target)) return;
      const fromParent = el.parentNode;
      const fromNext = el.nextSibling;
      const record: MoveRecord = {
        id: nextId(),
        label: labelFor(el),
        source: getElementSource(el),
        position,
        referenceLabel: labelFor(target),
        referenceSource: getElementSource(target),
      };
      try {
        parent.insertBefore(el, position === "before" ? target : target.nextSibling);
      } catch {
        return;
      }
      flashKey.current += 1;
      setFlash({ element: el, key: flashKey.current });
      setEntries((prev) => {
        const entry = prev[id];
        if (!entry) return prev;
        return {
          ...prev,
          [id]: {
            ...entry,
            move: record,
            moveUndo:
              entry.moveUndo ?? (fromParent ? { parent: fromParent, next: fromNext } : undefined),
          },
        };
      });
    },
    [],
  );

  const resetCurrent = useCallback(() => {
    const id = currentIdRef.current;
    if (!id) return;
    const entry = entriesRef.current[id];
    if (!entry) return;
    clearOverride(id);
    applyButtonVariant(entry.element, entry.original, entry.original.variant);
    applyButtonSize(entry.element, entry.original, entry.original.buttonSize);
    restoreMove(entry);
    setEntries((prev) =>
      prev[id]
        ? { ...prev, [id]: { ...prev[id], state: initialState(entry.original), move: undefined, moveUndo: undefined, deleted: undefined } }
        : prev,
    );
  }, []);

  const removeEntry = useCallback((id: string) => {
    const entry = entriesRef.current[id];
    if (!entry) return;
    clearOverride(id);
    applyButtonVariant(entry.element, entry.original, entry.original.variant);
    applyButtonSize(entry.element, entry.original, entry.original.buttonSize);
    restoreMove(entry);
    if (id === currentIdRef.current) {
      setEntries((prev) =>
        prev[id]
          ? { ...prev, [id]: { ...prev[id], state: initialState(entry.original), move: undefined, moveUndo: undefined, deleted: undefined } }
          : prev,
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

  // Remove the selected element from the live DOM (preview) and stage the deletion.
  const deleteSelected = useCallback(() => {
    const id = currentIdRef.current;
    if (!id) return;
    const entry = entriesRef.current[id];
    if (!entry) return;
    const el = entry.element;
    const fromParent = el.parentNode;
    const fromNext = el.nextSibling;
    try {
      el.remove();
    } catch {
      return;
    }
    setEntries((prev) => {
      const e = prev[id];
      if (!e) return prev;
      return {
        ...prev,
        [id]: {
          ...e,
          deleted: true,
          moveUndo: e.moveUndo ?? (fromParent ? { parent: fromParent, next: fromNext } : undefined),
        },
      };
    });
    setCurrentId(null);
    setFlash(null);
  }, []);

  const copyAll = useCallback(() => {
    const blocks = Object.values(entriesRef.current)
      .filter((entry) => hasChanges(entry))
      .map((entry) => formatEntryBlock(entry.source, entry.element, buildOutput(entry.state, entry.original), entry.move, entry.deleted, entry.state.agentInstructions));
    if (!blocks.length) return;
    const text = `Design sandbox — ${blocks.length} element(s) to update:\n\n${blocks.join("\n\n---\n\n")}`;
    navigator.clipboard?.writeText(text).then(() => setCopiedAll(true)).catch(() => setCopiedAll(false));
  }, []);

  const clearAll = useCallback(() => {
    Object.values(entriesRef.current).forEach((entry) => {
      applyButtonVariant(entry.element, entry.original, entry.original.variant);
      applyButtonSize(entry.element, entry.original, entry.original.buttonSize);
      restoreMove(entry);
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
      if (event.key === "Backspace" || event.key === "Delete") {
        const node = event.target;
        const editing =
          node instanceof HTMLElement &&
          (node.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(node.tagName));
        if (currentIdRef.current && !editing) {
          event.preventDefault();
          deleteSelected();
        }
        return;
      }
      if (event.key === "Escape") {
        if (currentIdRef.current) deselect();
        else setActive(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deselect, deleteSelected]);

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

    const selectedElement = (): HTMLElement | null => {
      const id = currentIdRef.current;
      return id ? entriesRef.current[id]?.element ?? null : null;
    };

    const pickTarget = (x: number, y: number, dragged: HTMLElement): HTMLElement | null => {
      const stack = document.elementsFromPoint(x, y);
      for (const node of stack) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.closest("[data-sandbox-ui]")) continue;
        if (node === dragged || dragged.contains(node) || node.contains(dragged)) continue;
        if (node === document.body || node === document.documentElement) continue;
        if (!node.parentElement) continue;
        return node;
      }
      return null;
    };

    const onMove = (event: MouseEvent) => {
      if (draggingRef.current) return;
      const target = event.target;
      if (isSandboxUi(target) || !(target instanceof HTMLElement)) {
        setHovered(null);
        return;
      }
      setHovered(target);
    };

    const onPointerDown = (event: PointerEvent) => {
      didDragRef.current = false;
      if (isSandboxUi(event.target) || !(event.target instanceof HTMLElement)) return;
      const selected = selectedElement();
      // Only the already-selected element is draggable; pressing anything else
      // falls through to a normal click-to-select.
      if (selected && (event.target === selected || selected.contains(event.target))) {
        dragPending.current = { x: event.clientX, y: event.clientY, el: selected };
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const pending = dragPending.current;
      if (!pending) return;
      if (!draggingRef.current) {
        if (Math.hypot(event.clientX - pending.x, event.clientY - pending.y) < 5) return;
        draggingRef.current = true;
        setHovered(null);
        setDragLabel(labelFor(pending.el));
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
        window.getSelection()?.removeAllRanges();
      }
      event.preventDefault();
      setCursorPt({ x: event.clientX, y: event.clientY });
      const target = pickTarget(event.clientX, event.clientY, pending.el);
      if (!target) {
        dropRef.current = null;
        setDropHint(null);
        return;
      }
      const rect = target.getBoundingClientRect();
      const parentCs = target.parentElement ? getComputedStyle(target.parentElement) : null;
      const horizontal =
        !!parentCs && parentCs.display.includes("flex") && parentCs.flexDirection.startsWith("row");
      const before = horizontal
        ? event.clientX < rect.left + rect.width / 2
        : event.clientY < rect.top + rect.height / 2;
      const position: "before" | "after" = before ? "before" : "after";
      dropRef.current = { el: target, position };
      setDropHint({ rect, position, horizontal });
    };

    const onPointerUp = (event: PointerEvent) => {
      const pending = dragPending.current;
      dragPending.current = null;
      if (!draggingRef.current) return;
      draggingRef.current = false;
      didDragRef.current = true;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      const drop = dropRef.current;
      dropRef.current = null;
      setDragLabel(null);
      setDropHint(null);
      setCursorPt(null);
      if (pending && drop) {
        event.preventDefault();
        event.stopPropagation();
        moveSelected(pending.el, drop.el, drop.position);
      }
    };

    const onClick = (event: MouseEvent) => {
      if (isSandboxUi(event.target)) return;
      // Swallow the click that follows a drag so it doesn't re-select.
      if (didDragRef.current) {
        didDragRef.current = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
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
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition, true);

    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onContextMenu, true);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition, true);
      interactionEvents.forEach((type) => document.body.removeEventListener(type, stopSandboxInteraction));
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [active, selectElement, moveSelected]);

  useEffect(() => {
    document.body.style.cursor = active && !currentId ? "crosshair" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [active, currentId]);

  useEffect(() => {
    setCopiedAll(false);
  }, [entries]);

  useEffect(
    () => () => {
      clearAllOverrides();
      // Drop any data-sandbox-id attributes so they can't collide with a fresh
      // counter after a hot-reload / remount.
      document
        .querySelectorAll("[data-sandbox-id]")
        .forEach((el) => el.removeAttribute("data-sandbox-id"));
    },
    [],
  );

  if (!active) return null;

  const currentEntry = currentId ? entries[currentId] : undefined;
  const currentElement = currentEntry?.element ?? null;
  const hoveredRect = hovered && hovered !== currentElement ? hovered.getBoundingClientRect() : null;

  const trayItems = Object.values(entries)
    .map((entry) => ({ id: entry.id, label: entry.label, count: changeCount(entry) }))
    .filter((item) => item.count > 0);

  return (
    <>
      {hoveredRect && <OverlayBox rect={hoveredRect} color="#016DE1" />}
      {flash && <FlashRing key={flash.key} element={flash.element} onDone={() => setFlash(null)} />}
      {dropHint && <DropLine hint={dropHint} />}
      {dragLabel && cursorPt && (
        <div
          data-sandbox-ui="true"
          className="pointer-events-none fixed z-[2147483647] rounded bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow-lg"
          style={{ left: cursorPt.x + 14, top: cursorPt.y + 14, fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif" }}
        >
          {dragLabel}
        </div>
      )}

      <div
        data-sandbox-ui="true"
        className="fixed bottom-4 left-4 z-[2147483647] flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
        style={{ fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif", pointerEvents: "auto" }}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[#FF4800]" />
        Design mode
        <span className="font-normal text-slate-400">
          {currentId
            ? "drag to reorder · Backspace to delete · Esc to deselect"
            : "click an element · Esc to exit"}
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
