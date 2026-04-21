import { useState, useEffect } from "react";
import { ToolbarTooltip } from "@/components/ToolbarTooltip";
import { useToast } from "@/hooks/use-toast";

interface TextSelectionPopupProps {
  onWhyIncluded: (selectedText: string) => void;
}

export const TextSelectionPopup = ({ onWhyIncluded }: TextSelectionPopupProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [isInteracting, setIsInteracting] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseDown = () => {
      setIsSelecting(true);
      setIsVisible(false); // Hide tooltip when starting new selection
    };

    const handleMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
        // Small delay to ensure selection is complete
        setTimeout(() => {
          const selection = window.getSelection();
          if (selection && selection.toString().trim().length > 0 && selection.rangeCount > 0) {
            const text = selection.toString().trim();
            const range = selection.getRangeAt(0);
            
            // Get the end position of the selection (where cursor ends)
            const endRange = range.cloneRange();
            endRange.collapse(false); // Collapse to end
            const rect = endRange.getBoundingClientRect();
            
            console.log('Selection complete - setting up popup for text:', text);
            console.log('Popup position:', { x: rect.left, y: rect.bottom + 8 });
            
            setSelectedText(text);
            setPosition({
              x: rect.left - 12, // Move slightly to the left for overlap
              y: rect.bottom + 8 // Add small gap below cursor end position
            });
            setIsVisible(true);
          }
        }, 100);
      }
    };

    const handleSelection = () => {
      const selection = window.getSelection();
      console.log('Selection changed:', selection?.toString());
      
      // Only hide if not currently selecting and not interacting
      if (!isSelecting && !isInteracting && (!selection || selection.toString().trim().length === 0)) {
        console.log('No text selected, hiding popup');
        setIsVisible(false);
      }
    };

    const handleClickOutside = (e: Event) => {
      const target = e.target as Element;
      // Don't hide if clicking within the tooltip
      if (target?.closest('[data-tooltip]')) {
        return;
      }
      if (window.getSelection()?.toString().trim().length === 0 && !isInteracting) {
        console.log('Click outside - hiding popup');
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectionchange", handleSelection);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isInteracting, isSelecting]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text copied",
      description: "The selected text has been copied to your clipboard.",
    });
  };

  console.log('TextSelectionPopup render - isVisible:', isVisible, 'selectedText:', selectedText);

  return (
    <ToolbarTooltip
      position={position}
      isVisible={isVisible}
      selectedText={selectedText}
      onWhyIncluded={onWhyIncluded}
      onCopy={handleCopy}
      onClose={() => {
        setIsVisible(false);
        setIsInteracting(false);
      }}
      onInteractionStart={() => setIsInteracting(true)}
      onInteractionEnd={() => setIsInteracting(false)}
    />
  );
};