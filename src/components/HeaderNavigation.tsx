import { Link } from "react-router-dom";
import { Sheet, SheetTrigger, SheetPortal } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AssistantButton } from "./AssistantButton";
import { TrellisIcon } from "./ui/trellis-icon";
interface HeaderNavigationProps {
  onChatPanelToggle: (isOpen: boolean) => void;
  onNewChat: () => void;
  onChatHistory: () => void;
  onBack: () => void;
  onMeetingClick: (meetingId: string) => void;
  selectedMeeting: string | null;
  showChatHistory: boolean;
  CustomSheetContent: any;
}
export const HeaderNavigation = ({
  onChatPanelToggle,
  onNewChat,
  onChatHistory,
  onBack,
  onMeetingClick,
  selectedMeeting,
  showChatHistory,
  CustomSheetContent
}: HeaderNavigationProps) => {
  return <header className="fixed top-0 left-0 right-0 w-full h-12 bg-trellis-magenta-1400 border-b border-trellis-magenta-1100 z-50 flex items-center justify-between px-4 shrink-0" onWheel={(e) => e.stopPropagation()}>
      {/* Left section - HubSpot logo */}
      <div className="flex items-center space-x-4">
        <Link to="/design-system">
          <img src="/lovable-uploads/8417781b-a998-4579-859d-5b91035e3bb8.png" alt="Logo" width="24" height="24" className="object-contain cursor-pointer" />
        </Link>
        
        {/* Search */}
        <div className="relative">
          <TrellisIcon name="search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 brightness-0 invert opacity-60" />
          <input type="text" placeholder="Search HubSpot" className="w-96 pl-10 pr-12 py-1.5 bg-trellis-magenta-1200 border border-trellis-magenta-1100 rounded-full body-100 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 detail-100 text-gray-300 bg-trellis-magenta-1100 rounded border border-trellis-magenta-1100">⌘</kbd>
            <kbd className="px-1.5 py-0.5 detail-100 text-gray-300 bg-trellis-magenta-1100 rounded border border-trellis-magenta-1100">K</kbd>
          </div>
        </div>
        
        <div className="bg-transparent border border-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
          <TrellisIcon name="add" size={16} className="brightness-0 invert" />
        </div>
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Navigation icons */}
        <Sheet>
          <SheetTrigger asChild>
            <div className="text-white hover:text-orange-300 cursor-pointer">
              <TrellisIcon name="questionCircle" size={20} className="brightness-0 invert" />
            </div>
          </SheetTrigger>
          <CustomSheetContent className="w-[560px]">
            {/* Header with icons */}
            <div className="flex items-center justify-between p-4 border-b border-core-subtle">
              <div className="flex items-center space-x-2 flex-1 min-w-0 mr-4">
                {selectedMeeting === 'the-six' && <span className="body-125 truncate">Meeting prep: Lendlease Management | Hubspot</span>}
                {selectedMeeting === 'valley-forge' && <span className="body-125 truncate">Meeting Prep: Valley Forge – follow-up</span>}
                {selectedMeeting === 'owlcity' && <span className="body-125 truncate">Meeting prep: Owlcity | HubSpot</span>}
                {showChatHistory && <span className="body-125 truncate">Chat History</span>}
              </div>
              <div className="flex items-center gap-0">
                <Button variant="ghost" className="flex items-center space-x-1 body-125 text-foreground hover:bg-trellis-neutral-300 px-2 py-1 rounded h-auto">
                  <TrellisIcon name="star" size={16} />
                  <span>Favorites</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 body-125 text-foreground hover:bg-trellis-neutral-300 px-2 py-1 rounded h-auto">
                      <TrellisIcon name="comment" size={16} />
                      <span>Chats</span>
                      <TrellisIcon name="downCarat" size={12} className="opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border border-core-subtle shadow-lg z-50">
                     <DropdownMenuItem onClick={onNewChat} className="hover:bg-trellis-neutral-300 cursor-pointer">New chat</DropdownMenuItem>
                     <DropdownMenuItem onClick={onChatHistory} className="hover:bg-trellis-neutral-300 cursor-pointer">Chat history</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <SheetPrimitive.Close asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-trellis-neutral-300">
                    <TrellisIcon name="x" size={16} className="opacity-60" />
                  </Button>
                </SheetPrimitive.Close>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col h-[calc(100vh-73px)]">
              <div className="flex-1 overflow-y-auto p-4" id="chat-content">
                {showChatHistory ? <>
                    {/* Chat History Header */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-1 body-100 text-foreground hover:bg-trellis-neutral-300 px-2 py-1 rounded h-auto">
                          <TrellisIcon name="left" size={16} />
                          <span>Back</span>
                        </Button>
                      </div>
                    </div>

                    {/* Chat History List */}
                    <div className="space-y-1">
                      <div className="py-2 px-4 hover:bg-trellis-neutral-300 cursor-pointer transition-all duration-200" onClick={() => {
                    onMeetingClick('the-six');
                  }}>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="body-125 text-foreground">The Six</span>
                        </div>
                        <div className="detail-200 text-muted-foreground mt-1 ml-4">Tue, Jul 22, 13:48</div>
                      </div>
                      <div className="py-2 px-4 hover:bg-trellis-neutral-300 cursor-pointer transition-all duration-200" onClick={() => {
                    onMeetingClick('valley-forge');
                  }}>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="body-125 text-foreground">Valley Forge</span>
                        </div>
                        <div className="detail-200 text-muted-foreground mt-1 ml-4">Fri, Jul 18, 08:04</div>
                      </div>
                      <div className="py-2 px-4 hover:bg-trellis-neutral-300 cursor-pointer transition-all duration-200" onClick={() => {
                    onMeetingClick('owlcity');
                  }}>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="body-125 text-foreground">Meeting prep: Owlcity | Hubspot</div>
                        </div>
                        <div className="detail-200 text-muted-foreground mt-1 ml-4">Tue, Jul 8, 10:54</div>
                      </div>
                    </div>
                  </> : selectedMeeting ? <div className="mb-6">
                    <h2 className="body-125 text-foreground mb-2">Prospecting Assistant</h2>
                    <p className="body-100 text-black">
                      Here's your preparation note for the selected meeting.
                    </p>
                  </div> : <div className="text-center py-8">
                    <h2 className="body-125 text-foreground mb-2">Prospecting Assistant</h2>
                    <p className="body-100 text-muted-foreground">
                      Select a chat from history or start a new conversation.
                    </p>
                  </div>}
              </div>
            </div>
          </CustomSheetContent>
        </Sheet>
        
        <div className="text-white hover:text-orange-300 cursor-pointer">
          <TrellisIcon name="notification" size={20} className="brightness-0 invert" />
        </div>
        <div className="text-white hover:text-orange-300 cursor-pointer">
          <TrellisIcon name="settings" size={20} className="brightness-0 invert" />
        </div>
        <div className="text-white hover:text-orange-300 cursor-pointer">
          <TrellisIcon name="contact" size={20} className="brightness-0 invert" />
        </div>
        
        {/* Divider */}
        <div className="h-6 w-px bg-trellis-magenta-1100"></div>
        
        {/* Copilot */}
        <AssistantButton onClick={() => onChatPanelToggle(true)} />
        
        {/* HubSpot dropdown */}
        <div className="flex items-center space-x-1 text-white hover:text-orange-300 cursor-pointer">
          <span className="body-125">HubSpot</span>
          <TrellisIcon name="downCarat" size={12} className="brightness-0 invert" />
        </div>
      </div>
    </header>;
};