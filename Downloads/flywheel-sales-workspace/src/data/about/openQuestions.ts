import type { OpenQuestion } from "./types";

export const openQuestions: OpenQuestion[] = [
  {
    id: "q-1",
    question:
      "Should the Priority Prospects view default to the Unworked filter, or to the rep's most-recent filter from their last session?",
    needsInputFrom: ["@martina", "@research"],
  },
  {
    id: "q-2",
    question:
      "How do we surface multi-threading progress at the company level without the row getting too dense?",
    needsInputFrom: ["@design"],
  },
];
