import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircleQuestion, Copy, Sparkles, ArrowLeft, Edit3, Minimize2, FileText, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

interface ToolbarTooltipProps {
  position: { x: number; y: number };
  isVisible: boolean;
  selectedText: string;
  onWhyIncluded: (selectedText: string) => void;
  onCopy: (selectedText: string) => void;
  onClose: () => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
}

export const ToolbarTooltip = ({ 
  position, 
  isVisible, 
  selectedText, 
  onWhyIncluded, 
  onCopy, 
  onClose,
  onInteractionStart,
  onInteractionEnd
}: ToolbarTooltipProps) => {
  const [showRefineView, setShowRefineView] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState("");
  
  // Reset to main view when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      setShowRefineView(false);
      setRefinePrompt("");
    }
  }, [isVisible]);
  
  console.log('ToolbarTooltip render - isVisible:', isVisible, 'selectedText:', selectedText);
  
  if (!isVisible) return null;

  const handleWhyIncluded = (e: React.MouseEvent) => {
    console.log('Why included clicked! Selected text:', selectedText);
    e.preventDefault();
    e.stopPropagation();
    onWhyIncluded(selectedText);
    onClose();
    // Clear selection after handling
    window.getSelection()?.removeAllRanges();
  };

  const handleCopy = (e: React.MouseEvent) => {
    console.log('Copy clicked! Selected text:', selectedText);
    e.preventDefault();
    e.stopPropagation();
    onCopy(selectedText);
    onClose();
    // Clear selection after handling
    window.getSelection()?.removeAllRanges();
  };

  const handleRefineClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onInteractionStart();
    setShowRefineView(true);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRefineView(false);
    setRefinePrompt("");
    onInteractionEnd();
  };

  const handleShorthandRefine = (prompt: string) => {
    console.log('Shorthand refine clicked:', prompt, 'for text:', selectedText);
    // Here you could handle the refine action
    onClose();
    window.getSelection()?.removeAllRanges();
  };

  const handleCustomRefine = () => {
    if (refinePrompt.trim()) {
      console.log('Custom refine:', refinePrompt, 'for text:', selectedText);
      // Here you could handle the custom refine action
      // For now, we'll show an alert to demonstrate it's working
      alert(`Refining text: "${selectedText}" with prompt: "${refinePrompt}"`);
      setRefinePrompt("");
      onClose();
      window.getSelection()?.removeAllRanges();
    }
  };

  if (showRefineView) {
    return (
      <div
        data-tooltip
        className="fixed z-[10000] bg-card border border-border rounded-lg shadow-xl p-3 w-80"
        style={{
          left: position.x,
          top: position.y,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 hover:bg-accent"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="body-125">Refine</span>
        </div>
        
        <div className="space-y-3">
          <Textarea
            placeholder="Type your prompt and press Enter..."
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCustomRefine();
              }
              e.stopPropagation();
            }}
            className="body-100 h-9 resize-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-auto py-2 hover:bg-accent"
              onClick={() => handleShorthandRefine('Rephrase this text')}
            >
              <Edit3 className="h-4 w-4" />
              <span className="body-100">Rephrase</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-auto py-2 hover:bg-accent"
              onClick={() => handleShorthandRefine('Shorten this text')}
            >
              <Minimize2 className="h-4 w-4" />
              <span className="body-100">Shorten</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-auto py-2 hover:bg-accent"
              onClick={() => handleShorthandRefine('Elaborate on this text')}
            >
              <FileText className="h-4 w-4" />
              <span className="body-100">Elaborate</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-auto py-2 hover:bg-accent"
              onClick={() => handleShorthandRefine('Make this text more formal')}
            >
              <Briefcase className="h-4 w-4" />
              <span className="body-100">More formal</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-tooltip
      className="fixed z-[10000] bg-card border border-border rounded-lg shadow-xl p-2 flex gap-1"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={(e) => {
        console.log('Mouse down on tooltip');
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        console.log('Mouse up on tooltip');
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-auto py-2 px-3 text-left gap-2 hover:bg-accent"
        onClick={handleWhyIncluded}
      >
        <MessageCircleQuestion className="h-4 w-4" />
        <span className="body-125">
          Why is it included?
        </span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-auto py-2 px-3 text-left gap-2 hover:bg-accent"
        onClick={handleRefineClick}
      >
        <Sparkles className="h-4 w-4" />
        <span className="body-125">
          Refine
        </span>
      </Button>
    </div>
  );
};