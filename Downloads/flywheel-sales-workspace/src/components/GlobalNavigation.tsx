import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SheetPortal } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { ChatPanel } from "./ChatPanel";
import { LeftNavigation } from "./LeftNavigation";
import { HeaderNavigation } from "./HeaderNavigation";

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
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [chatSelectedText, setChatSelectedText] = useState<string | undefined>(undefined);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleOpenAssistantChat = (event: CustomEvent) => {
      console.log('Received openAssistantChat event:', event.detail);
      const { message, context, selectedText } = event.detail;
      
      // Extract selected text from the message if present
      const textMatch = message.match(/Why was this text included in the AI-generated content: "(.+)"\?/);
      const extractedText = textMatch ? textMatch[1] : selectedText;
      
      // Open chat panel with selected text
      setIsChatPanelOpen(true);
      setChatSelectedText(extractedText);
      setChatContext(context);
      handleChatPanelToggle(true);
      
      console.log('Opening assistant chat with selectedText:', extractedText);
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
    // Clear selected text when closing
    if (!isOpen) {
      setChatSelectedText(undefined);
      setChatContext(undefined);
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
      {/* Fixed Top Bar */}
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

      {/* Left Navigation */}
      <LeftNavigation />

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatPanelOpen} 
        onClose={() => handleChatPanelToggle(false)}
        selectedText={chatSelectedText}
        context={chatContext}
      />
    </>
  );
};