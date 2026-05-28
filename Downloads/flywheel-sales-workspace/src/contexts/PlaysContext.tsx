import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { Play, plays as seedPlays } from "@/data/playData";

interface PlaysContextValue {
  plays: Play[];
  addPlay: (play: Play) => void;
  updatePlay: (id: string, partial: Partial<Play>) => void;
}

const PlaysContext = createContext<PlaysContextValue | null>(null);

export const PlaysProvider = ({ children }: { children: ReactNode }) => {
  const [plays, setPlays] = useState<Play[]>(seedPlays);

  const addPlay = useCallback((play: Play) => {
    setPlays((prev: Play[]) => [...prev, play]);
  }, []);

  const updatePlay = useCallback((id: string, partial: Partial<Play>) => {
    setPlays((prev: Play[]) => prev.map(c => c.id === id ? { ...c, ...partial } : c));
  }, []);

  const value = useMemo(
    () => ({ plays, addPlay, updatePlay }),
    [plays, addPlay, updatePlay]
  );

  return <PlaysContext.Provider value={value}>{children}</PlaysContext.Provider>;
};

export const usePlays = (): PlaysContextValue => {
  const ctx = useContext(PlaysContext);
  if (!ctx) throw new Error("usePlays must be used inside PlaysProvider");
  return ctx;
};
