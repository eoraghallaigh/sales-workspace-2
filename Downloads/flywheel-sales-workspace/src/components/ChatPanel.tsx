import { X, Send, MoreHorizontal, Maximize2, ChevronDown, Star, Paperclip, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import sparkleIcon from "@/assets/sparkle-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string;
  context?: string;
}

export const ChatPanel = ({ isOpen, onClose, selectedText, context }: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState("");
  
  if (!isOpen) return null;

  const renderExplanationContent = () => {
    if (!selectedText) return null;
    
    return (
      <div className="space-y-4">
        {/* User Question */}
        <div className="bg-muted p-4 rounded-lg">
          <p className="body-200 text-foreground">
            Why was "<span className="body-125">{selectedText}</span>" included?
          </p>
        </div>
        
        {/* Star Icon */}
        <div className="flex justify-end">
          <Star className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {/* Assistant Response */}
        <div className="space-y-4">
          <h3 className="heading-50 text-foreground">Prospecting Assistant</h3>
          
          <div className="space-y-4">
            <p className="body-100 text-foreground">
              This insight was included because it represents a critical risk to your customer's renewal and expansion potential:
            </p>
            
            <ul className="space-y-2 body-100 text-foreground ml-4">
              <li>• <strong>Declining engagement:</strong> Sales activity metrics show a significant downward trend over 3 months, indicating reduced adoption</li>
              <li>• <strong>License utilization risk:</strong> Lower activity correlates with underused seats (197/300 used), affecting ROI perception</li>
              <li>• <strong>Deal momentum impact:</strong> Reduced calls and meetings suggest pipeline stagnation and potential churn risk</li>
            </ul>
            
            <p className="body-100 text-foreground">
              This data point directly supports the recommendation to re-engage the sales team with workflows and automation to maximize their investment.
            </p>
          </div>
          
          {/* Suggested Actions */}
          <div className="space-y-3 mt-6">
            <Button 
              variant="secondary-alt" 
              size="small"
              className="justify-start h-auto py-2 px-4 text-left rounded-full w-full"
            >
              <span className="detail-100">Tell me more about Sales usage trends</span>
            </Button>
            
            <Button 
              variant="secondary-alt"
              size="small" 
              className="justify-start h-auto py-2 px-4 text-left rounded-full w-full"
            >
              <span className="detail-100">Show me similar at-risk customers</span>
            </Button>
          </div>
          
          {/* Feedback Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <Button variant="ghost" size="sm" className="p-2">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultContent = () => (
    <div className="space-y-6">
      {/* Main Title */}
      <h2 className="heading-400 text-muted-foreground">Prospecting Assistant</h2>
      
      {/* Greeting */}
      <div className="space-y-2">
        <h3 className="heading-300 text-foreground">Hi Olivia 👋</h3>
        <p className="body-200 text-muted-foreground">How can Prospecting Assistant help you today?</p>
      </div>
      
      {/* Suggestion Buttons */}
      <div className="space-y-3">
        <Button 
          variant="secondary-alt"
          size="small"
          className="w-full justify-start gap-3 h-auto py-2 px-4 text-left rounded-full"
        >
          <img src={sparkleIcon} alt="Sparkle" className="h-4 w-4 flex-shrink-0" />
          <span className="detail-100">Discover Prospecting Assistant features</span>
        </Button>
        
        <Button 
          variant="secondary-alt"
          size="small"
          className="w-full justify-start gap-3 h-auto py-2 px-4 text-left rounded-full"
        >
          <img src={sparkleIcon} alt="Sparkle" className="h-4 w-4 flex-shrink-0" />
          <span className="detail-100">Summarize my BoB health</span>
        </Button>
        
        <Button 
          variant="secondary-alt"
          size="small"
          className="w-full justify-start gap-3 h-auto py-2 px-4 text-left rounded-full"
        >
          <img src={sparkleIcon} alt="Sparkle" className="h-4 w-4 flex-shrink-0" />
          <span className="detail-100">Suggest customers for cold call outreach</span>
        </Button>
        
        <Button 
          variant="secondary-alt"
          size="small"
          className="w-full justify-start gap-3 h-auto py-2 px-4 text-left rounded-full"
        >
          <img src={sparkleIcon} alt="Sparkle" className="h-4 w-4 flex-shrink-0" />
          <span className="detail-100">Draft a QBR account plan</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed top-12 right-0 w-96 h-[calc(100vh-48px)] bg-card border-l border-border shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="secondary-alt" size="small" className="flex items-center gap-2">
          <span className="body-200">Prospecting Assistant</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1 p-6">
        {selectedText ? renderExplanationContent() : renderDefaultContent()}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Input Area */}
        <div className="relative">
          <Input 
            placeholder="" 
            className="pr-12 min-h-[60px] resize-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-1">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <Star className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="primary"
              className="rounded-full p-2" 
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Bottom Controls */}
        <div className="flex items-center justify-center">
          
          <div className="flex items-center gap-2">
            <span className="detail-100 text-muted-foreground">AI-generated content may be inaccurate.</span>
            <Button variant="link" className="h-auto p-0 detail-100 text-pink-500">See terms</Button>
          </div>
        </div>
      </div>
    </div>
  );
};