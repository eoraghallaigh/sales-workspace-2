import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RegenerateSequenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName?: string;
  onRegenerate?: (instructions: string) => void;
}

const RegenerateSequenceModal = ({
  open,
  onOpenChange,
  contactName,
  onRegenerate,
}: RegenerateSequenceModalProps) => {
  const [instructions, setInstructions] = useState("");

  const handleRegenerate = () => {
    onRegenerate?.(instructions.trim());
    setInstructions("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] bg-fill-surface p-0 gap-0 [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between gap-2 space-y-0 px-6 py-4 border-b border-border-subtle text-left">
          <DialogTitle className="heading-200">
            Regenerate sequence{contactName ? ` for ${contactName}` : ""}
          </DialogTitle>
          <DialogClose className="rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="px-6 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="regenerate-instructions" className="heading-50 text-foreground">
              Instructions
            </label>
            <Textarea
              id="regenerate-instructions"
              autoFocus
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Regenerate this sequence but make sure to mention our previous engagement about 12 months ago…"
              rows={4}
              className="body-100 placeholder:body-100"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-start px-6 pb-6 pt-0 mt-6 gap-3">
          <Button variant="ai" size="small" onClick={handleRegenerate} disabled={!instructions.trim()}>
            Regenerate
          </Button>
          <Button variant="ghost" size="small" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegenerateSequenceModal;
