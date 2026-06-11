import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Tag from "@/components/Tag";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  resolveSignalDetail,
  SIGNAL_CATALOG,
  type SignalDetail,
  type SignalInstance,
  type SignalOwner,
} from "@/data/signals";

// Renders the record-specific detail for a signal as a plain-text sentence
// (who/what/how much/when), falling back to the headline or catalog summary.
const DetailBody = ({
  title,
  detail,
  summary,
}: {
  title: string;
  detail: SignalDetail;
  summary: string;
}) => (
  <div className="px-4 py-3.5">
    <p className="heading-100 text-foreground">{title}</p>
    <p className="body-100 text-muted-foreground mt-1">
      {detail.narrative ?? detail.headline ?? summary}
    </p>
    {detail.footnote && (
      <p className="detail-200 text-muted-foreground mt-2.5">{detail.footnote}</p>
    )}
  </div>
);

interface SignalChipProps {
  signal: SignalInstance;
  owner?: SignalOwner;
  className?: string;
}

export const SignalChip = ({ signal, owner, className }: SignalChipProps) => {
  const def = SIGNAL_CATALOG[signal.id];
  if (!def) return null;

  const detail = resolveSignalDetail(signal, owner);

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            "inline-flex cursor-default rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            className,
          )}
        >
          <Tag variant={def.variant}>{def.label}</Tag>
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-[280px] p-0"
      >
        <DetailBody title={def.label} detail={detail} summary={def.summary} />
      </HoverCardContent>
    </HoverCard>
  );
};

interface SignalChipRowProps {
  signals: SignalInstance[];
  owner?: SignalOwner;
  className?: string;
  emptyLabel?: string;
}

// A wrapped row of chips, with an optional empty state.
export const SignalChipRow = ({
  signals,
  owner,
  className,
  emptyLabel,
}: SignalChipRowProps) => {
  if (signals.length === 0) {
    return emptyLabel ? (
      <span className="detail-200 text-muted-foreground">{emptyLabel}</span>
    ) : null;
  }
  return (
    <div className={cn("flex flex-wrap items-start gap-2", className)}>
      {signals.map((signal, idx) => (
        <SignalChip key={`${signal.id}-${idx}`} signal={signal} owner={owner} />
      ))}
    </div>
  );
};

interface ContactSignalsHoverCardProps {
  contact: { id: string; name: string; role: string; signals: SignalInstance[] };
  children: ReactNode;
}

// Wraps a contact avatar; on hover/focus, shows that contact's signals with a
// one-line detail each. Used in table/list views where chips aren't inline.
export const ContactSignalsHoverCard = ({
  contact,
  children,
}: ContactSignalsHoverCardProps) => {
  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side="top" align="start" sideOffset={8} className="w-[280px] p-0">
        <div className="px-4 pt-3.5 pb-2 border-b border-border">
          <p className="heading-100 text-foreground">{contact.name}</p>
          <p className="detail-200 text-muted-foreground mt-0.5">{contact.role}</p>
        </div>
        <div className="px-4 py-3 flex flex-col gap-2.5">
          {contact.signals.length === 0 ? (
            <span className="detail-200 text-muted-foreground">No signals yet</span>
          ) : (
            contact.signals.map((signal, idx) => {
              const def = SIGNAL_CATALOG[signal.id];
              if (!def) return null;
              const detail = resolveSignalDetail(signal, {
                kind: "contact",
                id: contact.id,
                name: contact.name,
                role: contact.role,
              });
              return (
                <div key={`${signal.id}-${idx}`} className="flex flex-col gap-1">
                  <span className="inline-flex">
                    <Tag variant={def.variant}>{def.label}</Tag>
                  </span>
                  <span className="detail-200 text-muted-foreground">
                    {detail.narrative ?? detail.headline ?? def.summary}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SignalChip;
