import React, { createContext, useContext, useState, useCallback } from "react";

export interface TourStep {
  route: string;
  targetSelector: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
}

export interface TourDefinition {
  id: string;
  label: string;
  steps: TourStep[];
}

interface TourContextValue {
  activeTour: TourDefinition | null;
  currentStepIndex: number;
  isActive: boolean;
  startTour: (tour: TourDefinition) => void;
  nextStep: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTour, setActiveTour] = useState<TourDefinition | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startTour = useCallback((tour: TourDefinition) => {
    setActiveTour(tour);
    setCurrentStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    if (!activeTour) return;
    if (currentStepIndex < activeTour.steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    } else {
      setActiveTour(null);
      setCurrentStepIndex(0);
    }
  }, [activeTour, currentStepIndex]);

  const endTour = useCallback(() => {
    setActiveTour(null);
    setCurrentStepIndex(0);
  }, []);

  return (
    <TourContext.Provider
      value={{
        activeTour,
        currentStepIndex,
        isActive: !!activeTour,
        startTour,
        nextStep,
        endTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
