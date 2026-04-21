import { TourDefinition } from "@/contexts/TourContext";

export const p1ProspectingTour: TourDefinition = {
  id: "p1-prospecting",
  label: "P1 Prospecting Block",
  steps: [
    {
      route: "/",
      targetSelector: '[data-tour="p1-prospecting-block"]',
      title: "Your Sales Workspace",
      description: "The rep logs into their sales workspace and sees today's schedule. A P1 Prospecting Block is up next — they click Start Now to begin working priority prospects.",
      position: "left",
    },
    {
      route: "/prospecting",
      targetSelector: '[data-tour="first-company-card"]',
      title: "P1 Prospect List",
      description: 'The rep lands on their P1 list. They\'ll work through each one, starting from the top. The rep clicks "View Strategy" to get started.',
      position: "right",
    },
    {
      route: "/prospecting/strategy/",
      targetSelector: '[data-tour="strategy-company-card"]',
      title: "Execute the Outreach",
      description: "The rep expands the outreach sequence to see suggested call scripts, LinkedIn messages, and emails. They can edit anything before sending — making the AI's suggestions their own.",
      position: "right",
    },
  ],
};

export const allTours: TourDefinition[] = [p1ProspectingTour];
