import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTour } from "@/contexts/TourContext";
import { allTours } from "@/data/tours";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

const TourLauncher: React.FC = () => {
  const { startTour, isActive } = useTour();
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Auto-start tour from URL param
  useEffect(() => {
    const tourId = searchParams.get("tour");
    if (tourId) {
      const tour = allTours.find((t) => t.id === tourId);
      if (tour) {
        // Small delay so page renders first
        setTimeout(() => {
          startTour(tour);
          searchParams.delete("tour");
          setSearchParams(searchParams, { replace: true });
        }, 500);
      }
    }
  }, []);

  if (isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9990]">
      {isOpen && (
        <div className="mb-3 bg-card border border-border-core-subtle rounded-lg shadow-300 p-4 w-[260px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="heading-100 text-foreground">Demo Tours</h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {allTours.map((tour) => (
              <button
                key={tour.id}
                onClick={() => {
                  startTour(tour);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-fill-surface-recessed transition-colors body-100 text-foreground flex items-center gap-2"
              >
                <Play className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                {tour.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <Button
        variant="primary"
        size="small"
        className="rounded-full shadow-300 px-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Play className="h-4 w-4 mr-1" />
        Demo Tours
      </Button>
    </div>
  );
};

export default TourLauncher;
