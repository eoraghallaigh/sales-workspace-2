import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CardVariant = "current" | "A" | "B" | "C";

const STORAGE_KEY = "prospecting-card-variant";
const DEFAULT_VARIANT: CardVariant = "C";

const isVariant = (v: unknown): v is CardVariant =>
  v === "current" || v === "A" || v === "B" || v === "C";

const VariantContext = createContext<{
  variant: CardVariant;
  setVariant: (v: CardVariant) => void;
}>({ variant: DEFAULT_VARIANT, setVariant: () => {} });

export const VariantProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariantState] = useState<CardVariant>(() => {
    if (typeof window === "undefined") return DEFAULT_VARIANT;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isVariant(stored) ? stored : DEFAULT_VARIANT;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, variant);
  }, [variant]);

  return (
    <VariantContext.Provider value={{ variant, setVariant: setVariantState }}>
      {children}
    </VariantContext.Provider>
  );
};

export const useVariant = () => useContext(VariantContext);
