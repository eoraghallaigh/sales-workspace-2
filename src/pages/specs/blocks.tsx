import type { ReactNode } from "react";

/* ── Page header ────────────────────────────────────────────────── */

export const SpecHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <header className="mb-10">
    <h1 className="heading-500 text-foreground mb-2">{title}</h1>
    {description && (
      <p className="body-100 text-muted-foreground max-w-2xl">{description}</p>
    )}
  </header>
);

/* ── Section divider ────────────────────────────────────────────── */

export const SpecSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <section className="mb-16">
    <h2 className="heading-200 text-foreground mb-1">{title}</h2>
    {description && (
      <p className="body-100 text-muted-foreground mb-6 max-w-2xl">
        {description}
      </p>
    )}
    <div className="space-y-6">{children}</div>
  </section>
);

/* ── State card ─────────────────────────────────────────────────── */

const stateAccents = {
  default: "border-l-trellis-blue-800",
  success: "border-l-trellis-green-800",
  warning: "border-l-trellis-yellow-800",
  error: "border-l-trellis-red-800",
} as const;

export const StateCard = ({
  label,
  description,
  variant = "default",
  children,
}: {
  label: string;
  description?: string;
  variant?: keyof typeof stateAccents;
  children: ReactNode;
}) => (
  <div
    className={`border border-core-subtle rounded-200 overflow-hidden border-l-4 max-w-2xl ${stateAccents[variant]}`}
  >
    <div className="px-5 py-3 bg-[var(--color-fill-surface-raised)] border-b border-core-subtle">
      <h3 className="heading-50 text-foreground">{label}</h3>
      {description && (
        <p className="detail-200 text-muted-foreground mt-0.5">{description}</p>
      )}
    </div>
    <div className="p-5 bg-[var(--color-fill-surface-recessed)]">{children}</div>
  </div>
);

/* ── Flow step (vertical timeline) ──────────────────────────────── */

export const FlowStep = ({
  step,
  label,
  description,
  isLast = false,
  children,
}: {
  step: number;
  label: string;
  description?: string;
  isLast?: boolean;
  children?: ReactNode;
}) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-trellis-blue-300 text-trellis-blue-1000 flex items-center justify-center heading-50 shrink-0">
        {step}
      </div>
      {!isLast && <div className="w-px flex-1 bg-trellis-blue-500 mt-2" />}
    </div>
    <div className={`flex-1 min-w-0 ${isLast ? "" : "pb-8"}`}>
      <h3 className="heading-50 text-foreground">{label}</h3>
      {description && (
        <p className="detail-200 text-muted-foreground mt-0.5">{description}</p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  </div>
);

/* ── Horizontal flow ────────────────────────────────────────────── */

export const HorizontalFlow = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="flex items-start gap-0 overflow-x-auto bg-[var(--color-fill-surface-recessed)] p-6 rounded-200">
    {children}
  </div>
);

export const HorizontalFlowStep = ({
  step,
  label,
  description,
  isLast = false,
  children,
}: {
  step: number;
  label: string;
  description?: string;
  isLast?: boolean;
  children?: ReactNode;
}) => (
  <div className="flex items-start shrink-0">
    <div className="flex flex-col items-start w-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-trellis-blue-300 text-trellis-blue-1000 flex items-center justify-center detail-100 font-semibold shrink-0">
          {step}
        </div>
        <h3 className="heading-50 text-foreground">{label}</h3>
      </div>
      {description && (
        <p className="detail-200 text-muted-foreground mb-3 px-2">
          {description}
        </p>
      )}
      {children && <div className="w-full">{children}</div>}
    </div>
    {!isLast && (
      <div className="flex items-center pt-3 px-3 shrink-0">
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" className="text-trellis-blue-500">
          <path d="M0 8h20m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )}
  </div>
);

/* ── Callout ────────────────────────────────────────────────────── */

const calloutStyles = {
  info: {
    border: "border-l-trellis-blue-800",
    bg: "bg-trellis-blue-300/50",
    label: "Info",
    labelColor: "text-trellis-blue-1000",
  },
  behavior: {
    border: "border-l-trellis-purple-800",
    bg: "bg-trellis-purple-200/50",
    label: "Behavior",
    labelColor: "text-trellis-purple-1000",
  },
  implementation: {
    border: "border-l-trellis-green-800",
    bg: "bg-trellis-green-200/50",
    label: "Implementation note",
    labelColor: "text-trellis-green-900",
  },
  "edge-case": {
    border: "border-l-trellis-yellow-800",
    bg: "bg-trellis-yellow-200/50",
    label: "Edge case",
    labelColor: "text-trellis-yellow-900",
  },
} as const;

export const Callout = ({
  type = "info",
  children,
}: {
  type?: keyof typeof calloutStyles;
  children: ReactNode;
}) => {
  const s = calloutStyles[type];
  return (
    <div className={`border-l-4 ${s.border} ${s.bg} rounded-r-200 px-4 py-3`}>
      <span
        className={`detail-100 font-semibold ${s.labelColor} uppercase tracking-wider`}
      >
        {s.label}
      </span>
      <div className="body-100 text-foreground mt-1">{children}</div>
    </div>
  );
};

/* ── Inline code reference ──────────────────────────────────────── */

export const CodeRef = ({ children }: { children: ReactNode }) => (
  <code className="detail-200 px-1 py-0.5 rounded bg-card text-foreground">
    {children}
  </code>
);
