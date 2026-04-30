import { TrellisIcon, type TrellisIconName } from "@/components/ui/trellis-icon";

export type TouchStatus = "completed" | "scheduled" | "empty";

// Position-based channel mapping for the 5-touch outreach sequence:
// call → LinkedIn → 3 emails.
export const TOUCH_CHANNELS: TrellisIconName[] = [
  "calling",
  "linkedin",
  "email",
  "email",
  "email",
];

const BG_FOR_STATUS: Record<TouchStatus, string> = {
  completed: "var(--color-fill-positive-default)",
  scheduled: "var(--color-fill-surface-recessed)",
  empty: "var(--color-fill-surface-recessed)",
};

export const TouchDot = ({
  status,
  channel,
  size = 24,
  iconSize = 12,
  showIcon = true,
}: {
  status: TouchStatus;
  channel: TrellisIconName;
  size?: number;
  iconSize?: number;
  showIcon?: boolean;
}) => {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: BG_FOR_STATUS[status] }}
    >
      {showIcon && status === "completed" && (
        <TrellisIcon name={channel} size={iconSize} className="brightness-0 invert" />
      )}
    </div>
  );
};

export const TouchDots = ({
  statuses,
  size = 24,
  iconSize = 12,
  showIcons = true,
}: {
  statuses: TouchStatus[];
  size?: number;
  iconSize?: number;
  showIcons?: boolean;
}) => {
  const padded: TouchStatus[] = [...statuses];
  while (padded.length < 5) padded.push("empty");
  return (
    <div className="flex items-center gap-1">
      {padded.slice(0, 5).map((status, i) => (
        <TouchDot
          key={i}
          status={status}
          channel={TOUCH_CHANNELS[i]}
          size={size}
          iconSize={iconSize}
          showIcon={showIcons}
        />
      ))}
    </div>
  );
};

export const MiniTouchDots = ({ statuses }: { statuses: TouchStatus[] }) => (
  <TouchDots statuses={statuses} size={12} showIcons={false} />
);
