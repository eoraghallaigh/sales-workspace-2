import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CardVariant = "current" | "C" | "table";

const STORAGE_KEY = "prospecting-card-variant";
const DEFAULT_VARIANT: CardVariant = "table";

const isVariant = (v: unknown): v is CardVariant =>
  v === "current" || v === "table";

const VariantContext = createContext<{
  variant: CardVariant;
  setVariant: (v: CardVariant) => void;
}>({ variant: DEFAULT_VARIANT, setVariant: () => {} });

export const VariantProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariantState] = useState<CardVariant>(() => {
    if (typeof window === "undefined") return DEFAULT_VARIANT;
    // A `?variant=` URL param wins so the view is shareable/deep-linkable.
    const fromUrl = new URLSearchParams(window.location.search).get("variant");
    if (isVariant(fromUrl)) return fromUrl;
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
