import { Sparkles } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { AlertType } from "@/components/ui/alert";

export type RefusalReason =
  | "duplicate"
  | "no-longer-at-company"
  | "not-real-individual"
  | "opted-out"
  | "unenriched-shell";

const REASON_CONFIG: Record<
  RefusalReason,
  { alertType: AlertType; detail: string }
> = {
  duplicate: {
    alertType: "warning",
    detail:
      "This contact appears to be a duplicate of an existing CRM record. The agent skipped sequence generation to avoid sending duplicate outreach.",
  },
  "no-longer-at-company": {
    alertType: "warning",
    detail:
      "This contact no longer appears to work at the associated company. The agent skipped sequence generation because outreach is unlikely to reach the right person.",
  },
  "not-real-individual": {
    alertType: "warning",
    detail:
      "This contact doesn’t appear to be a real individual — it may be a shared inbox, role-based address, or auto-generated record.",
  },
  "opted-out": {
    alertType: "danger",
    detail:
      "This contact has previously opted out or requested not to be contacted. The agent respected this preference and did not generate a sequence.",
  },
  "unenriched-shell": {
    alertType: "warning",
    detail:
      "This contact record has no name or job title. The agent needs more context to generate a relevant, personalized sequence.",
  },
};

const SequenceRefusalBanner = ({
  reason,
  onViewReasoning,
}: {
  reason: RefusalReason;
  onViewReasoning: () => void;
}) => {
  const config = REASON_CONFIG[reason];

  return (
    <Alert type={config.alertType}>
      <AlertTitle type={config.alertType}>Sequence not generated</AlertTitle>
      <AlertDescription type={config.alertType}>
        <p>{config.detail}</p>
        <button
          type="button"
          onClick={onViewReasoning}
          className="flex items-center gap-1.5 mt-3 detail-200 text-text-interactive hover:underline"
        >
          <Sparkles size={12} />
          View reasoning
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default SequenceRefusalBanner;
