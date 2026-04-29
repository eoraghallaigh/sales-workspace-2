export interface PreviousDeal {
  name: string;
  amount: string;
  closeDate: string;
  stage: string;
  stageIndex: number;
  totalStages: number;
  footer?: string;
}

interface PreviousDealCardProps {
  deal: PreviousDeal;
}

const PreviousDealCard = ({ deal }: PreviousDealCardProps) => {
  return (
    <div className="bg-white border border-border rounded-lg p-3 flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <p className="heading-100 text-text-interactive cursor-pointer hover:text-text-interactive-hover">
          {deal.name}
        </p>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 detail-100">
            <span className="text-muted-foreground">Amount:</span>
            <span className="text-foreground">{deal.amount}</span>
          </div>
          <div className="flex items-center gap-1 detail-100">
            <span className="text-muted-foreground">Close date:</span>
            <span className="text-foreground">{deal.closeDate}</span>
          </div>
          <div className="flex items-baseline gap-2 detail-200">
            <span className="text-muted-foreground">Stage:</span>
            <span className="text-foreground">{deal.stage}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-1 w-full">
        {Array.from({ length: deal.totalStages }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded"
            style={{
              background:
                i === deal.stageIndex
                  ? "var(--color-fill-accent-neutral-default, #425b76)"
                  : "var(--color-fill-accent-neutral-subtle-alt, #eaf0f6)",
            }}
          />
        ))}
      </div>

      {deal.footer && (
        <p className="detail-100 text-foreground">{deal.footer}</p>
      )}
    </div>
  );
};

export default PreviousDealCard;
