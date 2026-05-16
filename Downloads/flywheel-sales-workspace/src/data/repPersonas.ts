export interface RepPersona {
  id: string;
  name: string;
  geo: string;
  segment: "SMB" | "Mid-Market" | "Enterprise";
  initials: string;
  matchRatio: number;
}

export const repPersonas: RepPersona[] = [
  {
    id: "jamie-carter",
    name: "Jamie Carter",
    geo: "US",
    segment: "Mid-Market",
    initials: "JC",
    matchRatio: 0.6,
  },
  {
    id: "lea-dubois",
    name: "Léa Dubois",
    geo: "France",
    segment: "SMB",
    initials: "LD",
    matchRatio: 0.4,
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    geo: "EMEA",
    segment: "Enterprise",
    initials: "PS",
    matchRatio: 0.5,
  },
];

export const defaultViewerLabel = "Eoin Ó Raghallaigh";
