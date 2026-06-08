import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

/*
 * Trellis theme switcher.
 *
 * Two design languages live in one codebase:
 *   - "transitional" — the current (master) Trellis look. DEFAULT.
 *   - "alpha"        — the Trellis Alpha look, opt-in.
 *
 * Selection precedence: ?theme= query param  >  localStorage  >  "transitional".
 * The active theme is written to <html data-trellis-theme="…">, which CSS and
 * (later) components key off. To avoid a flash of the wrong theme on first
 * paint, the attribute is ALSO set by a tiny inline script in index.html before
 * React mounts; this provider keeps React state in sync and lets us flip at
 * runtime.
 *
 * End state: when Alpha becomes the only design, delete the transitional token
 * block in index.css, drop this provider, and default everything to Alpha.
 */

export type TrellisTheme = "transitional" | "alpha";

const STORAGE_KEY = "trellis-theme";
const VALID: TrellisTheme[] = ["transitional", "alpha"];

const isValid = (v: string | null): v is TrellisTheme =>
  v !== null && (VALID as string[]).includes(v);

export const resolveInitialTheme = (): TrellisTheme => {
  if (typeof window === "undefined") return "transitional";
  const fromQuery = new URLSearchParams(window.location.search).get("theme");
  if (isValid(fromQuery)) return fromQuery;
  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (isValid(fromStorage)) return fromStorage;
  return "transitional";
};

interface ThemeContextValue {
  theme: TrellisTheme;
  setTheme: (theme: TrellisTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<TrellisTheme>(resolveInitialTheme);

  // Reflect onto <html> and persist whenever the theme changes.
  useEffect(() => {
    document.documentElement.setAttribute("data-trellis-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* localStorage unavailable (private mode) — attribute is enough */
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () =>
        setThemeState(prev => (prev === "alpha" ? "transitional" : "alpha")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
