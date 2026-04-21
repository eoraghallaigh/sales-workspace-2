import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = false, 
  className 
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-0">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex min-h-[55px] py-[10px] pr-5 pl-4 justify-between items-center self-stretch border-t border-core-subtle w-full">
          <div className="flex items-center">
            <ChevronDown className={`h-3 w-3 text-foreground transition-transform mr-3 ${isOpen ? '' : '-rotate-90'}`} />
            <h3 className="heading-50 text-foreground">{title}</h3>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className={cn("pl-10 pr-4", className)}>
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleSection;
