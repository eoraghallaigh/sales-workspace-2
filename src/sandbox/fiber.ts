export interface ElementSource {
  fileName?: string;
  relativeFileName?: string;
  lineNumber?: number;
  componentName?: string;
}

interface FiberLike {
  _debugSource?: { fileName?: string; lineNumber?: number; columnNumber?: number };
  _debugOwner?: FiberLike | null;
  return?: FiberLike | null;
  type?: unknown;
}

const getFiber = (node: Element): FiberLike | null => {
  const key = Object.keys(node).find(
    (candidate) =>
      candidate.startsWith("__reactFiber$") ||
      candidate.startsWith("__reactInternalInstance$"),
  );
  return key ? ((node as unknown as Record<string, FiberLike>)[key] ?? null) : null;
};

const nameOfType = (type: unknown): string | undefined => {
  if (typeof type === "function") {
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName || fn.name || undefined;
  }
  if (type && typeof type === "object") {
    const obj = type as { displayName?: string; render?: { name?: string } };
    return obj.displayName || obj.render?.name || undefined;
  }
  return undefined;
};

const toRelative = (fileName?: string): string | undefined => {
  if (!fileName) return undefined;
  const marker = "/src/";
  const index = fileName.lastIndexOf(marker);
  return index >= 0 ? fileName.slice(index + 1) : fileName;
};

export const getElementSource = (node: Element): ElementSource => {
  try {
    const fiber = getFiber(node);
    let source = fiber?._debugSource;
    let cursor: FiberLike | null = fiber;
    while (cursor && !source) {
      source = cursor._debugSource;
      cursor = cursor.return ?? null;
    }

    let componentName: string | undefined;
    let owner = fiber?._debugOwner ?? null;
    while (owner && !componentName) {
      componentName = nameOfType(owner.type);
      owner = owner._debugOwner ?? null;
    }

    return {
      fileName: source?.fileName,
      relativeFileName: toRelative(source?.fileName),
      lineNumber: source?.lineNumber,
      componentName,
    };
  } catch {
    return {};
  }
};
