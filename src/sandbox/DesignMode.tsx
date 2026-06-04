import { useCallback, useEffect, useRef, useState } from "react";
import SandboxPanel, { Crumb } from "./SandboxPanel";
import { ElementSource, getElementSource } from "./fiber";
import { clearOverride } from "./overrides";

let idCounter = 0;
const nextId = () => `sbx-${(idCounter += 1)}`;

interface Selection {
  element: HTMLElement;
  id: string;
  source: ElementSource;
  crumbs: Crumb[];
}

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
  const [selection, setSelection] = useState<Selection | null>(null);
  const [, forceTick] = useState(0);
  const [flash, setFlash] = useState<{ element: HTMLElement; key: number } | null>(null);
  const selectionRef = useRef<Selection | null>(null);
  const flashKey = useRef(0);

  const cleanupSelection = useCallback(() => {
    const current = selectionRef.current;
    if (current) {
      clearOverride(current.id);
      current.element.removeAttribute("data-sandbox-id");
    }
    selectionRef.current = null;
  }, []);

  const selectElement = useCallback(
    (element: HTMLElement) => {
      cleanupSelection();
      setFlash(null);
      const id = nextId();
      element.setAttribute("data-sandbox-id", id);
      const next: Selection = {
        element,
        id,
        source: getElementSource(element),
        crumbs: buildCrumbs(element),
      };
      selectionRef.current = next;
      setSelection(next);
    },
    [cleanupSelection],
  );

  const closePanel = useCallback(() => {
    cleanupSelection();
    setSelection(null);
  }, [cleanupSelection]);

  const flashRing = useCallback((element: HTMLElement) => {
    flashKey.current += 1;
    setFlash({ element, key: flashKey.current });
  }, []);

  const selectFromCrumb = useCallback(
    (element: HTMLElement) => {
      selectElement(element);
      flashRing(element);
    },
    [selectElement, flashRing],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === "d" || event.key === "D")) {
        event.preventDefault();
        setActive((prev) => !prev);
        return;
      }
      if (event.key === "Escape") {
        if (selectionRef.current) {
          closePanel();
        } else {
          setActive(false);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePanel]);

  useEffect(() => {
    if (!active) {
      setHovered(null);
      setFlash(null);
      closePanel();
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
  }, [active, selectElement, closePanel]);

  useEffect(() => {
    document.body.style.cursor = active && !selection ? "crosshair" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [active, selection]);

  useEffect(() => () => cleanupSelection(), [cleanupSelection]);

  if (!active) return null;

  const hoveredRect = hovered && hovered !== selection?.element ? hovered.getBoundingClientRect() : null;

  return (
    <>
      {hoveredRect && <OverlayBox rect={hoveredRect} color="#016DE1" />}
      {flash && <FlashRing key={flash.key} element={flash.element} onDone={() => setFlash(null)} />}

      <div
        data-sandbox-ui="true"
        className="fixed bottom-4 left-4 z-[2147483647] flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
        style={{ fontFamily: "'Lexend Deca', Helvetica, Arial, sans-serif" }}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[#FF4800]" />
        Design mode
        <span className="font-normal text-slate-400">{selection ? "click another element to switch" : "click an element · Esc to exit"}</span>
      </div>

      {selection && (
        <SandboxPanel
          key={selection.id}
          element={selection.element}
          sandboxId={selection.id}
          source={selection.source}
          crumbs={selection.crumbs}
          onSelectCrumb={selectFromCrumb}
          onClose={closePanel}
        />
      )}
    </>
  );
};

export default DesignMode;
