import * as React from "react";
import { cn } from "@/lib/utils";

interface FormControlProps {
  label: React.ReactNode;
  helpText?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormControl = ({ label, helpText, htmlFor, required, className, children }: FormControlProps) => (
  <div className={cn("flex flex-col gap-1 w-full", className)}>
    <div className="flex flex-col pt-2 pb-1 pr-3 w-full">
      <label
        htmlFor={htmlFor}
        className="heading-50 text-[var(--color-text-core-default)] inline-flex items-center gap-1"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-[var(--color-text-error-default,#c01818)]">
            *
          </span>
        )}
      </label>
      {helpText && (
        <p className="body-75 text-[var(--color-text-core-subtle)] mt-0">{helpText}</p>
      )}
    </div>
    {children}
  </div>
);

export { FormControl };
