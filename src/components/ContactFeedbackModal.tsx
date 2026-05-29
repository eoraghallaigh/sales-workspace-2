import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export interface ContactFeedbackPayload {
  reason: string;
  note?: string;
}

interface ContactFeedbackModalProps {
  open: boolean;
  contactCount: number;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: ContactFeedbackPayload) => void;
}

const ContactFeedbackModal = ({
  open,
  contactCount,
  onOpenChange,
  onSubmit,
}: ContactFeedbackModalProps) => {
  const [reason, setReason] = useState("no-longer-works");
  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    if (!open) return;
    setReason("no-longer-works");
    setOtherText("");
  }, [open]);

  const isMultiple = contactCount > 1;

  const reasons = [
    {
      value: "no-longer-works",
      label: isMultiple
        ? "These contacts don't work at the company anymore"
        : "This contact doesn't work at the company anymore",
    },
    {
      value: "not-decision-maker",
      label: isMultiple
        ? "These contacts are not decision makers"
        : "This contact is not a decision maker",
    },
    {
      value: "data-wrong",
      label: isMultiple
        ? "These contacts' data is wrong"
        : "This contact's data is wrong",
    },
    { value: "other", label: "Other (please specify)" },
  ];

  const handleSubmit = () => {
    onSubmit({
      reason,
      note: otherText.trim() ? otherText.trim() : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-fill-surface">
        <DialogHeader>
          <DialogTitle className="heading-200">Contact Feedback</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            {reasons.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`feedback-${option.value}`} />
                <label
                  htmlFor={`feedback-${option.value}`}
                  className="body-100 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
          {reason === "other" && (
            <Textarea
              placeholder="Please describe the issue…"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              className="body-100"
              rows={3}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFeedbackModal;
