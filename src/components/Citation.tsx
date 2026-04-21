import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CitationProps {
  number: number;
  source: string;
}

export const Citation = ({ number, source }: CitationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-center w-5 h-5 detail-100 text-muted-foreground bg-muted rounded-full hover:bg-muted/80 transition-colors ml-1"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {number}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-3 body-100" 
        side="bottom"
        align="start"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="space-y-1">
          <p className="body-125 text-foreground">Source {number}</p>
          <p className="text-muted-foreground">{source}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};