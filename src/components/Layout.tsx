import { ReactNode, useState, useEffect } from "react";
import { GlobalNavigation } from "./GlobalNavigation";

import { useTheme } from "@/contexts/ThemeContext";

/*
 * Layout — themed page shell.
 * Transitional: fixed dark top header + dark left rail; content sits on the
 *   recessed grey canvas below the 48px header.
 * Alpha: no top header (its controls move into the rail); content sits in a
 *   white rounded "dynamic surface" floating on the recessed grey canvas.
 */
interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const isAlpha = theme === "alpha";
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  useEffect(() => {
    const handleChatPanelToggle = (event: CustomEvent) => {
      setIsChatPanelOpen(event.detail.isOpen);
    };
    window.addEventListener('chatPanelToggle', handleChatPanelToggle as EventListener);
    return () => window.removeEventListener('chatPanelToggle', handleChatPanelToggle as EventListener);
  }, []);

  if (isAlpha) {
    return (
      <div className="h-screen overflow-hidden bg-[var(--t-ui-color-foundational-bg-subtle)]">{/* recessed grey canvas */}
        <GlobalNavigation />
        <button
          type="button"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', ctrlKey: true, bubbles: true }))}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#333333] hover:bg-[#444444] shadow-sm transition-colors cursor-pointer"
        >
          <span className="text-white text-xs font-medium whitespace-nowrap">Inspection Mode</span>
          <kbd className="text-[10px] text-white/70 border border-white/40 rounded px-1 py-px">⌃I</kbd>
        </button>
        <main
          className={`ml-16 p-3 h-screen overflow-hidden transition-all duration-300 ${
            isChatPanelOpen ? 'mr-96' : 'mr-0'
          }`}
        >
          <div className="h-full w-full bg-white rounded-[16px] shadow-100 overflow-hidden">{/* dynamic surface */}
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Transitional (master) shell
  return (
    <div className="h-screen overflow-hidden bg-background">
      <GlobalNavigation />
      <main
        className={`ml-16 mt-12 overflow-hidden overscroll-none transition-all duration-300 ${
          isChatPanelOpen ? 'mr-96' : 'mr-0'
        }`}
      >
        {children}
      </main>
    </div>
  );
};
