import { ReactNode } from "react";

interface SelectableTextProps {
  children: ReactNode;
  className?: string;
}

export const SelectableText = ({ children, className = "" }: SelectableTextProps) => {
  return (
    <div className={`select-text cursor-text ${className}`}>
      {children}
    </div>
  );
};