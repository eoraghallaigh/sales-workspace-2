import { ReactNode, useState, useEffect } from "react";
import { GlobalNavigation } from "./GlobalNavigation";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  // Listen for chat panel state changes
  useEffect(() => {
    const handleChatPanelToggle = (event: CustomEvent) => {
      setIsChatPanelOpen(event.detail.isOpen);
    };

    window.addEventListener('chatPanelToggle', handleChatPanelToggle as EventListener);
    return () => window.removeEventListener('chatPanelToggle', handleChatPanelToggle as EventListener);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-background">
      <GlobalNavigation />
      
      {/* Main Content with responsive margin for chat panel */}
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