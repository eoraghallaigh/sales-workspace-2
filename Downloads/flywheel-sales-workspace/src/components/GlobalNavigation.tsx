import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SheetPortal } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { ChatPanel } from "./ChatPanel";
import { LeftNavigation } from "./LeftNavigation";
import { HeaderNavigation } from "./HeaderNavigation";
import { useTheme } from "@/contexts/ThemeContext";

// Custom SheetContent without overlay
const CustomSheetContent = ({ side = "right", className, children, ...props }: any) => (
  <SheetPortal>
    <SheetPrimitive.Content
      className={`fixed z-50 gap-0 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 top-0 bottom-0 right-0 h-screen border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right ${className || ''}`}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
);

export const GlobalNavigation = () => {
  const { theme } = useTheme();
  const isAlpha = theme === "alpha";
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [chatSelectedText, setChatSelectedText] = useState<string | undefined>(undefined);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);
  const [chatMode, setChatMode] = useState<"research" | undefined>(undefined);
  const [chatResearchCompanyId, setChatResearchCompanyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleOpenAssistantChat = (event: CustomEvent) => {
      const { message, context, selectedText, mode, companyId } = event.detail;

      // Research mode: open the assistant with the full company research loaded.
      if (mode === "research") {
        setChatSelectedText(undefined);
        setChatContext(undefined);
        setChatMode("research");
        setChatResearchCompanyId(companyId);
        setIsChatPanelOpen(true);
        handleChatPanelToggle(true);
        return;
      }

      // Extract selected text from the message if present
      const textMatch = message?.match(/Why was this text included in the AI-generated content: "(.+)"\?/);
      const extractedText = textMatch ? textMatch[1] : selectedText;

      // Open chat panel with selected text
      setChatMode(undefined);
      setChatResearchCompanyId(undefined);
      setIsChatPanelOpen(true);
      setChatSelectedText(extractedText);
      setChatContext(context);
      handleChatPanelToggle(true);
    };

    console.log('Adding event listener for openAssistantChat');
    window.addEventListener('openAssistantChat', handleOpenAssistantChat as EventListener);
    return () => {
      console.log('Removing event listener for openAssistantChat');
      window.removeEventListener('openAssistantChat', handleOpenAssistantChat as EventListener);
    };
  }, []);

  const handleNewChat = () => {
    setSelectedMeeting(null);
    setShowChatHistory(false);
  };

  const handleChatPanelToggle = (isOpen: boolean) => {
    setIsChatPanelOpen(isOpen);
    // Clear transient chat state when closing
    if (!isOpen) {
      setChatSelectedText(undefined);
      setChatContext(undefined);
      setChatMode(undefined);
      setChatResearchCompanyId(undefined);
    }
    // Dispatch custom event for Layout to listen to
    window.dispatchEvent(new CustomEvent('chatPanelToggle', { detail: { isOpen } }));
  };

  const handleChatHistory = () => {
    setShowChatHistory(true);
    setSelectedMeeting(null);
  };

  const handleBack = () => {
    setShowChatHistory(false);
    setSelectedMeeting(null);
  };

  const handleMeetingClick = (meetingId: string) => {
    setSelectedMeeting(meetingId);
    setShowChatHistory(false);
  };

  return (
    <>
      {/* Fixed Top Bar — transitional only; Alpha moves these controls into the rail */}
      {!isAlpha && (
        <HeaderNavigation
          onChatPanelToggle={handleChatPanelToggle}
          onNewChat={handleNewChat}
          onChatHistory={handleChatHistory}
          onBack={handleBack}
          onMeetingClick={handleMeetingClick}
          selectedMeeting={selectedMeeting}
          showChatHistory={showChatHistory}
          CustomSheetContent={CustomSheetContent}
        />
      )}

      {/* Left Navigation */}
      <LeftNavigation />

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatPanelOpen}
        onClose={() => handleChatPanelToggle(false)}
        selectedText={chatSelectedText}
        context={chatContext}
        mode={chatMode}
        researchCompanyId={chatResearchCompanyId}
      />
    </>
  );
};