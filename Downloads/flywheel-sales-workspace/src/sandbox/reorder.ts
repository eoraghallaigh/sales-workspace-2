import { ElementSource } from "./fiber";

// A recorded DOM reorder performed in "Move" mode. Like style edits, these are
// captured as instructions for the agent to implement in source — the live DOM
// move is a design-time preview and may reset if React re-renders the subtree.
export interface MoveRecord {
  id: string;
  label: string;
  source: ElementSource;
  position: "before" | "after";
  referenceLabel: string;
  referenceSource: ElementSource;
}

const sourceLine = (source: ElementSource, fallback: string): string => {
  if (source.relativeFileName) {
    const name = source.componentName ? `<${source.componentName}> ` : "";
    const line = source.lineNumber ? `:${source.lineNumber}` : "";
    return `${name}${source.relativeFileName}${line}`;
  }
  return source.componentName ? `<${source.componentName}>` : fallback;
};

// One-line summary of a move, folded into an element's change list.
export const moveSummaryLine = (move: MoveRecord): string =>
  `DOM order: moved ${move.position} ${move.referenceLabel} (${sourceLine(move.referenceSource, move.referenceLabel)})`;

export const formatMovesBlock = (moves: MoveRecord[]): string => {
  if (moves.length === 0) return "";
  const lines = moves.map(
    (move, index) =>
      `${index + 1}. Move ${move.label} (${sourceLine(move.source, move.label)}) ` +
      `${move.position} ${move.referenceLabel} (${sourceLine(move.referenceSource, move.referenceLabel)})`,
  );
  return [
    `DOM reorder — ${moves.length} move(s):`,
    ...lines,
    "",
    "Apply by reordering the JSX in the source file(s) above so the element lands in its new position.",
  ].join("\n");
};
