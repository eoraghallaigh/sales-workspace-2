import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SnoozeOption = "1 week" | "1 month" | "1 year" | "Custom Date";

interface SnoozeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
  onConfirm?: (params: { duration: SnoozeOption; nextStep: string }) => void;
  defaultNextStep?: string;
}

const DURATION_OPTIONS: SnoozeOption[] = ["1 week", "1 month", "1 year", "Custom Date"];

const SnoozeModal = ({
  open,
  onOpenChange,
  companyName,
  onConfirm,
  defaultNextStep = "MM - Aug Rating - Good Fit",
}: SnoozeModalProps) => {
  const [selectedDuration, setSelectedDuration] = useState<SnoozeOption>("1 week");
  const [nextStep, setNextStep] = useState(defaultNextStep);

  const handleConfirm = () => {
    onConfirm?.({ duration: selectedDuration, nextStep });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[560px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Snooze {companyName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="heading-50 text-foreground">Snooze Until</label>
            <div className="flex items-center gap-2 flex-wrap">
              {DURATION_OPTIONS.map((option) => {
                const isSelected = selectedDuration === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedDuration(option)}
                    className={cn(
                      "min-h-[32px] px-3 rounded-[4px] border heading-50 transition-colors",
                      isSelected
                        ? "bg-[var(--color-fill-secondary-pressed)] border-[var(--color-border-core-default)] text-foreground"
                        : "bg-card border-[var(--color-border-core-subtle)] text-foreground hover:bg-[var(--color-fill-secondary-hover)]",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="snooze-next-step" className="heading-50 text-foreground">
              Next Step
            </label>
            <Input
              id="snooze-next-step"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-start gap-2">
          <Button variant="primary" size="medium" onClick={handleConfirm}>
            Snooze {companyName}
          </Button>
          <Button variant="secondary-alt" size="medium" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SnoozeModal;
