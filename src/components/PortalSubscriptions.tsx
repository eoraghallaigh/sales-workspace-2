import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { PortalSubscription, SubscriptionItem } from "@/data/installBase";
import { useHorizontalOverflow } from "@/hooks/useHorizontalOverflow";
import { Badge } from "@/components/ui/badge";
import { TrellisIcon } from "@/components/ui/trellis-icon";

interface PortalSubscriptionsProps {
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

// Columns match the HubSpot "Recurring subscriptions" view; the min width keeps
// the 7-column table readable and lets it scroll sideways inside the card.
const ROW_GRID =
  "grid gap-4 grid-cols-[minmax(200px,2.2fr)_minmax(90px,0.9fr)_minmax(150px,1.3fr)_96px_96px_72px_104px]";

const SubscriptionRow = ({ item }: { item: SubscriptionItem }) => (
  <div className={`${ROW_GRID} py-4 items-start border-b border-border-subtle last:border-b-0`}>
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <span
          className={`mt-[7px] h-2 w-2 rounded-full shrink-0 ${
            item.inactive ? "bg-muted-foreground" : "bg-[var(--color-fill-accent-green-default,#00bda5)]"
          }`}
        />
        <span className="heading-50 text-foreground">{item.name}</span>
        {item.inactive && (
          <Badge variant="koala" className="shrink-0">Inactive</Badge>
        )}
      </div>
      {item.cancelledByOrderId ? (
        <span className="detail-200 text-muted-foreground pl-4">
          Cancelled by order{" "}
          <button
            type="button"
            onClick={() => toast.success(`Opens order #${item.cancelledByOrderId}`)}
            className={`detail-200 inline-flex items-center gap-1 ${linkClass}`}
          >
            #{item.cancelledByOrderId}
            <TrellisIcon name="externalLink" size={11} />
          </button>
        </span>
      ) : item.statusNote ? (
        <span className="detail-200 text-muted-foreground pl-4">{item.statusNote}</span>
      ) : null}
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

const PortalSubscriptions = ({ subscription }: PortalSubscriptionsProps) => {
  const [showInactive, setShowInactive] = useState(false);
  const { ref: scrollRef, overflowing } = useHorizontalOverflow<HTMLDivElement>();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-11">
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
        </div>

        {/* Full item table — scrolls sideways within the card on narrow widths.
            The right-edge inner shadow hints that more columns are scrollable. */}
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
              <SubscriptionRow key={`active-${i}`} item={item} />
            ))}
            {showInactive &&
              subscription.inactiveItems.map((item, i) => (
                <SubscriptionRow key={`inactive-${i}`} item={item} />
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

        <button
          type="button"
          onClick={() => setShowInactive((v) => !v)}
          aria-expanded={showInactive}
          className="flex items-center gap-2 self-start heading-50 text-foreground"
        >
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${showInactive ? "rotate-180" : ""}`}
          />
          {showInactive ? "Hide" : "Show"} Inactive Items ({subscription.inactiveItems.length})
        </button>
      </div>
    </section>
  );
};

export default PortalSubscriptions;
