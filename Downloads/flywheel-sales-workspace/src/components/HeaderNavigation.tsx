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
  return <header className="fixed top-0 left-0 right-0 w-full h-12 z-50 flex items-center justify-between px-3 shrink-0" style={{ background: "#333333" }} onWheel={(e) => e.stopPropagation()}>
      {/* Left section */}
      <div className="flex items-center gap-3">
        <Link to="/design-system" className="p-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center">
          <svg width="20" height="20" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-label="HubSpot">
            <path d="M11.6127 10.9174C10.4763 10.9174 9.55512 10.0374 9.55512 8.95201C9.55512 7.86645 10.4763 6.98646 11.6127 6.98646C12.749 6.98646 13.6702 7.86645 13.6702 8.95201C13.6702 10.0374 12.749 10.9174 11.6127 10.9174ZM12.2286 5.16801V3.41954C12.7064 3.20397 13.041 2.74229 13.041 2.20648V2.16612C13.041 1.42664 12.4077 0.821619 11.6336 0.821619H11.5915C10.8174 0.821619 10.1841 1.42664 10.1841 2.16612V2.20648C10.1841 2.74229 10.5187 3.20416 10.9965 3.41972V5.16801C10.2852 5.27306 9.63527 5.55332 9.09927 5.96578L4.07384 2.23138C4.107 2.10973 4.1303 1.9845 4.1305 1.85286C4.13129 1.0155 3.42174 0.335606 2.54479 0.334474C1.66822 0.333532 0.956311 1.01154 0.955323 1.84909C0.954337 2.68665 1.66388 3.36654 2.54084 3.36748C2.82651 3.36786 3.09106 3.29035 3.32283 3.16436L8.26614 6.83803C7.84582 7.44418 7.59944 8.17028 7.59944 8.95201C7.59944 9.77033 7.8701 10.5274 8.32734 11.1499L6.82415 12.5861C6.7053 12.5519 6.58211 12.5282 6.45141 12.5282C5.73101 12.5282 5.14684 13.086 5.14684 13.7742C5.14684 14.4626 5.73101 15.0205 6.45141 15.0205C7.17201 15.0205 7.75599 14.4626 7.75599 13.7742C7.75599 13.6498 7.73112 13.5319 7.69538 13.4184L9.18238 11.9978C9.85738 12.4899 10.698 12.7856 11.6127 12.7856C13.8292 12.7856 15.6257 11.0692 15.6257 8.95201C15.6257 7.03531 14.1517 5.45185 12.2286 5.16801Z" fill="#FF4800" />
          </svg>
        </Link>

        {/* Search */}
        <div className="relative">
          <TrellisIcon name="search" size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 brightness-0 invert opacity-60" />
          <input type="text" placeholder="Search HubSpot" className="w-[540px] h-8 pl-8 pr-16 bg-white/10 border border-white/20 rounded-lg body-100 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="w-4 h-4 flex items-center justify-center detail-100 text-gray-300 border border-white/30 rounded">⌘</kbd>
            <kbd className="w-4 h-4 flex items-center justify-center detail-100 text-gray-300 border border-white/30 rounded">K</kbd>
          </div>
        </div>

        <div className="border border-white/40 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
          <TrellisIcon name="add" size={12} className="brightness-0 invert" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors">
          <TrellisIcon name="calling" size={16} className="brightness-0 invert" />
        </div>
        <div className="p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors">
          <TrellisIcon name="integrations" size={16} className="brightness-0 invert" />
        </div>
        {/* Help */}
        <Sheet>
          <SheetTrigger asChild>
            <div className="p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors">
              <TrellisIcon name="questionCircle" size={16} className="brightness-0 invert" />
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
        
        <Link to="/outreach-states" className="p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors" title="Outreach card states">
          <TrellisIcon name="settings" size={16} className="brightness-0 invert" />
        </Link>
        <div className="p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors">
          <TrellisIcon name="notification" size={16} className="brightness-0 invert" />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-white/20 mx-1"></div>

        {/* Copilot */}
        <AssistantButton onClick={() => onChatPanelToggle(true)} />

        {/* Divider */}
        <div className="h-6 w-px bg-white/20 mx-1"></div>

        {/* Account menu */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors">
          <TrellisIcon name="contact" size={16} className="brightness-0 invert" />
          <span className="body-100 text-white">HubSpot</span>
          <TrellisIcon name="downCarat" size={8} className="brightness-0 invert" />
        </div>
      </div>
    </header>;
};