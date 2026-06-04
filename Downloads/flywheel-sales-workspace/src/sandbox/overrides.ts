const STYLE_ID = "__sandbox_overrides__";

const rules = new Map<string, Record<string, string>>();

const ensureStyleEl = (): HTMLStyleElement => {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    el.setAttribute("data-sandbox-ui", "true");
    document.head.appendChild(el);
  }
  return el;
};

const declarationsToCss = (declarations: Record<string, string>): string =>
  Object.entries(declarations)
    .map(([property, value]) => `${property}: ${value} !important;`)
    .join(" ");

const render = (): void => {
  const el = ensureStyleEl();
  el.textContent = Array.from(rules.entries())
    .map(([id, declarations]) => `[data-sandbox-id="${id}"] { ${declarationsToCss(declarations)} }`)
    .join("\n");
};

export const applyOverride = (id: string, declarations: Record<string, string>): void => {
  if (Object.keys(declarations).length === 0) {
    rules.delete(id);
  } else {
    rules.set(id, declarations);
  }
  render();
};

export const clearOverride = (id: string): void => {
  rules.delete(id);
  render();
};

export const clearAllOverrides = (): void => {
  rules.clear();
  render();
};
