import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const Section = ({
  id,
  title,
  description,
  children,
  className,
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn("scroll-mt-12 py-12 first:pt-0", className)}
      aria-labelledby={`${id}-heading`}
    >
      <header className="mb-6">
        <h2
          id={`${id}-heading`}
          className="heading-700 text-foreground"
        >
          {title}
        </h2>
        {description ? (
          <p className="body-200 text-muted-foreground mt-2 max-w-2xl">
            {description}
          </p>
        ) : null}
      </header>
      <div>{children}</div>
    </section>
  );
};
