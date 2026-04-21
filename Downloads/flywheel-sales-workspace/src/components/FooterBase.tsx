import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const FooterBase = () => {
  return (
    <div className="bg-muted/30 border-t border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <Button variant="primary" size="medium">
          Add to my capacity
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        <Button variant="secondary-alt" size="medium">
          Hide company
        </Button>
        
        <Button variant="transparent" size="medium">
          Open company record
        </Button>
      </div>
    </div>
  );
};

export default FooterBase;