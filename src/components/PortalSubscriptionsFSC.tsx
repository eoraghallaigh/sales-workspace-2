import { toast } from "sonner";
import type { PortalSubscription, SubscriptionItem } from "@/data/installBase";
import { useHorizontalOverflow } from "@/hooks/useHorizontalOverflow";
import { Badge } from "@/components/ui/badge";
import { TrellisIcon } from "@/components/ui/trellis-icon";

interface PortalSubscriptionsFSCProps {
  subscription: PortalSubscription;
}

const linkClass =
  "text-[var(--color-specialty-text-core-alt-default)] hover:underline";

const Meta = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className="flex flex-col gap-0.5">
    <span className="detail-200 text-muted-foreground">{label}</span>
    <span className={strong ? "heading-100 text-foreground" : "body-100 text-foreground"}>{value}</span>
  </div>
);

const ROW_GRID =
  "grid gap-4 grid-cols-[minmax(200px,2.2fr)_minmax(90px,0.9fr)_minmax(150px,1.3fr)_96px_96px_72px_104px]";

const SubscriptionRow = ({ item }: { item: SubscriptionItem }) => (
  <div className={`${ROW_GRID} py-4 items-start border-b border-border-subtle last:border-b-0`}>
    <div className="flex items-start gap-2">
      <span className="mt-[7px] h-2 w-2 rounded-full bg-[var(--color-fill-accent-green-default,#00bda5)] shrink-0" />
      <span className="heading-50 text-foreground">{item.name}</span>
    </div>
    <div className="flex flex-col">
      <span className="body-100 text-foreground">{item.mrrGbp}</span>
      <span className="detail-200 text-muted-foreground">{item.mrrUsd}</span>
    </div>
    <div className="flex flex-col gap-0.5">
      {item.discounts.length > 0 ? (
        item.discounts.map((d) => (
          <span key={d} className="body-100 text-foreground">{d}</span>
        ))
      ) : (
        <span className="body-100 text-muted-foreground">N/A</span>
      )}
    </div>
    <span className="body-100 text-foreground">{item.purchaseDate}</span>
    <span className="body-100 text-foreground">{item.startDate}</span>
    <span className="body-100 text-foreground">{item.endDate}</span>
    <span className="body-100 text-foreground">{item.cancellationDate}</span>
  </div>
);

const PortalSubscriptionsFSC = ({ subscription }: PortalSubscriptionsFSCProps) => {
  const { ref: scrollRef, overflowing } = useHorizontalOverflow<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => toast.success("Opens subscription")}
          className={`heading-100 flex items-center gap-1 ${linkClass}`}
        >
          Subscription #{subscription.id}
          <TrellisIcon name="externalLink" size={12} />
        </button>
        <Badge variant="accent-green">{subscription.status}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Meta label="Renewal date" value={subscription.renewalDate} />
        <Meta label="Billing cycle" value={subscription.billingCycle} />
        <Meta label="Next bill date" value={subscription.nextBillDate} />
        <Meta label="Subscription MRR" value={subscription.mrrDisplay} strong />
      </div>

      <div className="relative">
        <div ref={scrollRef} className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className={`${ROW_GRID} pb-2 border-b border-border detail-200 text-muted-foreground`}>
              <span>Item</span>
              <span>MRR</span>
              <span>Discounts</span>
              <span>Purchase Date</span>
              <span>Start Date</span>
              <span>End Date</span>
              <span>Cancellation Date</span>
            </div>
            {subscription.items.map((item, i) => (
              <SubscriptionRow key={`fsc-${i}`} item={item} />
            ))}
          </div>
        </div>
        {overflowing && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-black/10 to-transparent"
          />
        )}
      </div>
    </div>
  );
};

export default PortalSubscriptionsFSC;
