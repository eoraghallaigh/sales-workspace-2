import { ReactNode, useState } from "react";
import { TextSelectionPopup } from "./TextSelectionPopup";
import { SelectableText } from "./SelectableText";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import regenerateIcon from "@/assets/regenerate-icon.png";

interface AIContentProps {
  children: ReactNode;
  className?: string;
  title?: string;
  showHeader?: boolean;
  onRegenerate?: () => void;
}

export const AIContent = ({ 
  children, 
  className = "", 
  title,
  showHeader = false,
  onRegenerate 
}: AIContentProps) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [generatedAt] = useState(new Date());
  const { toast } = useToast();

  const handleWhyIncluded = (selectedText?: string) => {
    let text = selectedText;
    
    console.log('handleWhyIncluded called with selectedText:', selectedText);
    
    if (!text) {
      const selection = window.getSelection();
      text = selection?.toString().trim() || "";
      console.log('Got text from selection:', text);
    }
    
    console.log('Final text to process:', text);
    
    if (text) {
      // Dispatch event to open assistant chat with explanation
      const event = new CustomEvent('openAssistantChat', {
        detail: {
          message: `Why was this text included in the AI-generated content: "${text}"?`,
          context: 'meeting-prep-explanation'
        }
      });
      console.log('Dispatching openAssistantChat event with detail:', event.detail);
      window.dispatchEvent(event);
      console.log('Event dispatched successfully');
    } else {
      console.log('No text selected - not dispatching event');
    }
  };

  const handleThumbsUp = () => {
    setFeedback('up');
    toast({
      title: "Feedback received",
      description: "Thank you for your positive feedback!",
    });
  };

  const handleThumbsDown = () => {
    setFeedback('down');
    toast({
      title: "Feedback received", 
      description: "Thank you for your feedback. We'll work to improve this content.",
    });
  };

  const handleCopyContent = () => {
    const contentElement = document.querySelector('.ai-content');
    if (contentElement) {
      navigator.clipboard.writeText(contentElement.textContent || '');
      toast({
        title: "Content copied",
        description: "AI-generated content has been copied to your clipboard.",
      });
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    } else {
      toast({
        title: "Regenerating content",
        description: "AI content is being regenerated...",
      });
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Generated just now";
    if (diffMins < 60) return `Generated ${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Generated ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    return `Generated on ${date.toLocaleDateString()}`;
  };

  return (
    <TooltipProvider>
      <div className={`relative ${className}`}>
        {showHeader && title && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h3 className="heading-200">{title}</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent"
                      onClick={handleRegenerate}
                    >
                      <img src={regenerateIcon} alt="Regenerate" className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Regenerate</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="bg-red-100 text-red-600 detail-100 px-2 py-1 rounded">
                AI
              </div>
            </div>
            <p className="detail-100 text-trellis-neutral-800">
              {formatTimestamp(generatedAt)}
            </p>
          </div>
        )}
        <SelectableText className="ai-content">
          {children}
        </SelectableText>
        
        {/* AI Content Feedback Buttons */}
        <div className="flex items-center justify-start gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 hover:bg-accent ${
                    feedback === 'up' ? 'bg-green-100 text-green-600 hover:bg-green-100' : ''
                  }`}
                  onClick={handleThumbsUp}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Good response</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 hover:bg-accent ${
                    feedback === 'down' ? 'bg-red-100 text-red-600 hover:bg-red-100' : ''
                  }`}
                  onClick={handleThumbsDown}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Poor response</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent"
                  onClick={handleCopyContent}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy content</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <TextSelectionPopup onWhyIncluded={handleWhyIncluded} />
      </div>
    </TooltipProvider>
  );
};