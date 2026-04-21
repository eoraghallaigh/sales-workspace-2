import React, { useState, useEffect, useRef } from "react";
import { Minimize2, Maximize2, Briefcase, SmilePlus, Sparkles } from "lucide-react";

interface TextEditPopupProps {
  containerRef?: React.RefObject<HTMLElement>;
}

export const TextEditPopup = ({ containerRef }: TextEditPopupProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef?.current || document;

    // Track mouse position globally so we know where the cursor is on mouseup
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-edit-popup]")) return;

      // Use a short delay so the browser finalises the selection
      setTimeout(() => {
        const active = document.activeElement as HTMLTextAreaElement | null;
        if (!active || active.tagName !== "TEXTAREA") return;
        if (containerRef?.current && !containerRef.current.contains(active)) return;

        const selectedText = active.value.substring(active.selectionStart, active.selectionEnd);
        if (selectedText.trim().length === 0) return;

        // Position the popup's top-left corner at the cursor
        setPosition({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
        setCustomPrompt("");
      }, 10);
    };

    const handleMouseDown = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-edit-popup]")) return;
      setIsVisible(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [containerRef]);

  if (!isVisible) return null;

  const handleAction = (action: string) => {
    console.log("Edit action:", action);
    setIsVisible(false);
  };

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      console.log("Custom edit prompt:", customPrompt);
      setIsVisible(false);
      setCustomPrompt("");
    }
  };

  return (
    <div
      data-edit-popup
      className="fixed z-[10000] bg-card border border-border-core-subtle rounded-100 shadow-lg w-[280px]"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Custom prompt input */}
      <div className="p-3 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-icon-secondary shrink-0" />
          <input
            type="text"
            placeholder="Tell AI how to edit..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCustomSubmit();
              }
              e.stopPropagation();
            }}
            className="body-100 text-foreground bg-transparent border-0 outline-none w-full placeholder:text-text-placeholder"
            
          />
        </div>
      </div>

      <div className="border-t border-border-core-subtle" />

      {/* Quick actions */}
      <div className="p-1">
        <button
          className="w-full flex items-center gap-2 px-3 py-[6px] rounded-[var(--borderRadius-50)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
          onClick={() => handleAction("shorten")}
        >
          <Minimize2 className="h-3.5 w-3.5 text-icon-secondary" />
          <span className="body-100 text-foreground">Shorten</span>
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-[6px] rounded-[var(--borderRadius-50)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
          onClick={() => handleAction("expand")}
        >
          <Maximize2 className="h-3.5 w-3.5 text-icon-secondary" />
          <span className="body-100 text-foreground">Expand</span>
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-[6px] rounded-[var(--borderRadius-50)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
          onClick={() => handleAction("formal")}
        >
          <Briefcase className="h-3.5 w-3.5 text-icon-secondary" />
          <span className="body-100 text-foreground">More formal</span>
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-[6px] rounded-[var(--borderRadius-50)] hover:bg-[var(--color-fill-surface-recessed)] transition-colors"
          onClick={() => handleAction("casual")}
        >
          <SmilePlus className="h-3.5 w-3.5 text-icon-secondary" />
          <span className="body-100 text-foreground">More casual</span>
        </button>
      </div>
    </div>
  );
};
