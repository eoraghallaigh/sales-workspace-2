import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export interface ContactFeedbackPayload {
  reason: string;
  note?: string;
  removed: boolean;
}

interface ContactFeedbackModalProps {
  open: boolean;
  contactName: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: ContactFeedbackPayload) => void;
}

const REASONS: Array<{ value: string; label: string }> = [
  { value: "no-longer-at-company", label: "No longer at the company" },
  { value: "wrong-role", label: "Wrong role / not a decision-maker" },
  { value: "bounced-unsubscribed", label: "Bounced or unsubscribed email" },
  { value: "duplicate", label: "Duplicate contact" },
  { value: "bad-data", label: "Bad contact data (phone / email)" },
  { value: "other", label: "Other" },
];

const ContactFeedbackModal = ({
  open,
  contactName,
  onOpenChange,
  onSubmit,
}: ContactFeedbackModalProps) => {
  const [reason, setReason] = useState<string>(REASONS[0].value);
  const [note, setNote] = useState<string>("");
  const [shouldRemove, setShouldRemove] = useState<boolean>(true);

  useEffect(() => {
    if (!open) return;
    setReason(REASONS[0].value);
    setNote("");
    setShouldRemove(true);
  }, [open]);

  const handleSubmit = () => {
    onSubmit({
      reason,
      note: note.trim() ? note.trim() : undefined,
      removed: shouldRemove,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Why isn't {contactName} a good fit?</DialogTitle>
          <DialogDescription>
            Your feedback helps improve the contacts we recommend.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
            {REASONS.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <RadioGroupItem value={option.value} id={`reason-${option.value}`} />
                <Label
                  htmlFor={`reason-${option.value}`}
                  className="body-100 cursor-pointer font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex flex-col gap-2">
            <Label htmlFor="feedback-note" className="body-100">
              Add a note (optional)
            </Label>
            <Textarea
              id="feedback-note"
              placeholder="What would help us recommend better contacts?"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="remove-contact"
              checked={shouldRemove}
              onCheckedChange={(value) => setShouldRemove(value === true)}
            />
            <Label
              htmlFor="remove-contact"
              className="body-100 cursor-pointer font-normal"
            >
              Remove {contactName} from recommended contacts
            </Label>
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFeedbackModal;
