import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type PlayHeaderStyle = "tinted" | "banner";

const STORAGE_KEY = "play-header-style";
const DEFAULT_STYLE: PlayHeaderStyle = "tinted";

const isStyle = (v: unknown): v is PlayHeaderStyle =>
  v === "tinted" || v === "banner";

const PlayHeaderStyleContext = createContext<{
  style: PlayHeaderStyle;
  setStyle: (s: PlayHeaderStyle) => void;
}>({ style: DEFAULT_STYLE, setStyle: () => {} });

export const PlayHeaderStyleProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyleState] = useState<PlayHeaderStyle>(() => {
    if (typeof window === "undefined") return DEFAULT_STYLE;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isStyle(stored) ? stored : DEFAULT_STYLE;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, style);
  }, [style]);

  return (
    <PlayHeaderStyleContext.Provider value={{ style, setStyle: setStyleState }}>
      {children}
    </PlayHeaderStyleContext.Provider>
  );
};

export const usePlayHeaderStyle = () => useContext(PlayHeaderStyleContext);
