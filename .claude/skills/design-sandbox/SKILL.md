---
name: design-sandbox
description: Scaffold a live, dev-only "design sandbox" (a.k.a. token playground / live style editor) into a front-end prototype. It lets a designer enter a design mode, pick any element in the running app, and tweak colour, typography, spacing, size, borders, radius and shadow in the browser — then copy the resulting changes back for an AI agent to implement. Trigger when the user asks to "add a design sandbox", "build a token playground", "let me tweak styles live", "edit styles on the page", or anything similar. The skill DETECTS the project's framework and design-token source and ASKS the designer how strictly to constrain the options before building anything.
---

# Build a design sandbox

You are scaffolding a self-contained, **dev-only** visual editing tool into the prototype you're currently in. The end result: the designer presses a shortcut, clicks any element, adjusts a panel of controls, sees the change live, and copies an implementation-ready summary for an agent.

**Do not start writing the sandbox until you have completed Step 1 (detect) and Step 2 (interview).** Every project is different — the whole point of this skill is to adapt to the project's stack and to the designer's tolerance for off-token values.

---

## Guiding principles

- **Edit in token-space when tokens exist.** The output a designer pastes to an agent should name the project's own tokens/utility classes, not just raw px — otherwise the change can't be implemented faithfully. Raw CSS is the fallback, not the default.
- **Resolve values live; don't hard-code them.** Read computed values from the running app (`getComputedStyle`) so the sandbox can never drift from the real styles.
- **Non-destructive + dev-only.** Apply changes as removable overrides, and never ship the tool to a production/stakeholder build.
- **Adapt, don't assume.** React + Tailwind + CSS-variable tokens is the easy case; plain CSS with no tokens is also fine (it just means "free" mode). Handle what you find.

---

## Step 1 — Detect the stack (investigate; report back)

Look before you build. Determine each of these from the repo (package.json, config files, the main stylesheet, a quick grep):

1. **Framework** — React / Preact / Vue / Svelte / Solid / Angular / none. The element picker and live overrides are DOM-level and portable; only two things are framework-specific: *where you mount the overlay* and *how you derive an element→source/component hint* (see Step 4).
2. **Styling system** — Tailwind (`tailwind.config.*`), CSS custom properties (`:root { --… }`), CSS-in-JS (styled-components/emotion), CSS modules, vanilla CSS, or a component library (MUI, Chakra, shadcn, Mantine…). This decides how changes are applied and what the output looks like.
3. **Design-token source** — search in this priority order and use the first solid hit:
   - a dedicated tokens file/dir (`tokens.{ts,js,json}`, `design-tokens/`, Style Dictionary output);
   - CSS custom properties on `:root` (scan the entry CSS);
   - the Tailwind theme (`theme.extend.{colors,fontSize,spacing,borderRadius,borderWidth,boxShadow}`);
   - a UI library theme object (`createTheme`, Chakra `theme`);
   - a Figma/W3C design-tokens JSON export;
   - **none found** → tell the designer there are no tokens to constrain to; only "free" mode is possible.
4. **How the app runs** (dev server command + port) so you can compile-check afterward.

Summarise what you found in a sentence or two before moving on.

---

## Step 2 — Interview the designer (REQUIRED — wait for answers)

Ask these and wait. Use the structured question tool if available; otherwise ask plainly. Lead with strictness — it's the decision that shapes everything.

1. **How strict should the controls be?**
   - **Strict (tokens only)** — every control is a dropdown of existing tokens; a non-token value is impossible to pick. Spacing/size are limited to the token scale. Best when changes must be implementable exactly as shown. *(Recommend this when a clear token source exists.)*
   - **Balanced (tokens + nudges)** — token dropdowns, but a few properties (spacing, size, letter-spacing) also accept free values, clearly flagged "off-token".
   - **Free (anything)** — full colour pickers and free numeric inputs; output is raw CSS with no token guarantee. *(The only option when no token source was found.)*
2. **Which property groups?** colour (text / background / border), typography, spacing (padding / margin / gap), size (width / height), border (width / colour / radius), shadow. Default to all that the token source can support.
3. **Output format?** token + utility-class names plus resolved CSS (best for Tailwind / utility projects) vs. raw CSS only (best for CSS-in-JS / vanilla). Default from the detected styling system.
4. **Entry + gating** — a keyboard shortcut toggles "design mode" (suggest `Ctrl+D`). Confirm it should be **dev-only** (recommended — gate the mount behind the framework's dev flag, e.g. `import.meta.env.DEV`, `process.env.NODE_ENV !== 'production'`).
5. **Element → source hint** — for React you can surface the source file:line via the dev fiber (see Step 4); otherwise you'll include a DOM description. Confirm that's wanted.

---

## Step 3 — Build the token registry

Produce a small typed registry grouped by property (text/bg/border colours, type tokens, radius/border-width/shadow scales, spacing scale). Per token, store its **name** and a way to **resolve its value live**:

- **CSS-variable tokens:** store the var name; resolve with `getComputedStyle(document.documentElement).getPropertyValue('--x')`. Keep a hard-coded fallback only for first paint.
- **Tailwind tokens:** derive names + utility-class mappings from the config; emit classes like `text-[var(--token)]`, `rounded-300`, `p-4`.
- **JS/Figma token objects:** import/parse them directly.

Keep the **names + grouping curated** (which tokens count as "text" vs "fill", which type token a font maps to) but read **values live** so nothing drifts.

**Reverse-mapping** (so controls open pre-populated): given an element's computed style, find the nearest token — exact match for colours and named scales, nearest-value for numeric scales — and flag anything that doesn't match a token as "off-token".

---

## Step 4 — Build the sandbox

The core is DOM-level and portable. Adapt only the mount point and the source hint.

**Override injector (portable — apply live changes):** keep one `<style>` element; stamp the selected node with a unique `data-sandbox-id`; write a rule per id. Live, non-destructive, trivially reset, and the emitted CSS equals what's applied.

```js
// portable across any framework
const STYLE_ID = "__sandbox_overrides__";
const rules = new Map(); // id -> { [cssProp]: value }
function render() {
  let el = document.getElementById(STYLE_ID);
  if (!el) { el = document.createElement("style"); el.id = STYLE_ID; el.dataset.sandboxUi = "true"; document.head.appendChild(el); }
  el.textContent = [...rules].map(([id, decls]) =>
    `[data-sandbox-id="${id}"]{${Object.entries(decls).map(([p,v]) => `${p}:${v} !important;`).join("")}}`
  ).join("\n");
}
export const applyOverride = (id, decls) => { Object.keys(decls).length ? rules.set(id, decls) : rules.delete(id); render(); };
export const clearOverride = (id) => { rules.delete(id); render(); };
```

**Design-mode controller:** a keyboard toggle; while active, a hover outline + click-to-select via **capture-phase** document listeners. Mark all sandbox UI with `data-sandbox-ui` and ignore those targets in the picker; `preventDefault`/`stopPropagation` on a pick so the app's own handlers don't fire. Offer an **ancestor breadcrumb** so the designer can climb from the leaf they clicked to the box they meant.

**Panel:** controls constrained per the chosen strictness, bound live to the selected element (changes call `applyOverride`). Strongly consider an **auto-stash**: keep edits applied per element as the designer switches, list every edited element in a small tray, and offer a single **"copy all"** so multi-part components can be handed off together.

**Output (the payoff):** for each edited element produce a block with (a) a source/component hint, (b) the token or utility-class diff, and (c) the resolved CSS — formatted to paste straight to an AI agent.

**Framework-specific bits:**
- **Mount** the overlay once at the app root, gated to dev (`{import.meta.env.DEV && <DesignMode/>}` or equivalent).
- **Source hint (React, dev only):** read the fiber off a DOM node and use `_debugSource` for `{ fileName, lineNumber }`, walking `_debugOwner` for the component name. Requires the React dev JSX transform (on by default with `@vitejs/plugin-react` / CRA dev). Degrade gracefully when absent.
  ```js
  const key = Object.keys(node).find(k => k.startsWith("__reactFiber$"));
  const fiber = key ? node[key] : null;       // fiber._debugSource, fiber._debugOwner
  ```
- **Vue:** try `el.__vueParentComponent` / `el.__vnode` for a component hint; otherwise fall back to a DOM description.
- **Svelte / Solid / Angular / none:** use a DOM description — tag + first class + nearby text + a short ancestor path. Still useful to an agent.

**Known gotchas to handle if they arise:**
- **Overlay/modal libraries** (Radix, Headless UI, etc.) that dismiss-on-outside-interaction or trap focus will fight a panel rendered outside their layer. Stop sandbox-originated pointer/focus events from reaching `document` (so they don't dismiss), and set `pointer-events: auto` on the panel (modal libs often set `pointer-events: none` on the body).
- **Sticky/transformed ancestors** break `position: fixed` panels — render the panel at the document/app root, not inside the inspected tree.
- **Don't clobber the native context menu globally** — gate picking behind the explicit design-mode toggle.

---

## Step 5 — Verify and hand off

- Compile-check + lint with the project's own tooling (don't introduce a different toolchain).
- Don't drive a browser to "prove" it — tell the designer the shortcut and to refresh.
- Hand off with: the keybind, how to pick/stash/copy, and a one-line note that the output names their tokens (or is raw CSS, per the chosen strictness).

---

## Reference implementation

A complete worked example for the **React + Tailwind + CSS-variable-tokens, strict** case may exist in the repo this skill came from, under `src/sandbox/` (controller, panel, controls, override injector, fiber source lookup, model) and `src/design-tokens/` (registry + live resolver). If those paths exist, read them as a concrete template and adapt; if not, build from the patterns above.

---

## Output block — what "copy for agent" should look like

Strict / Tailwind:
```
Target: <CompanyCard> src/components/CompanyCard.tsx:42
Changes:
  - background: fill-surface-recessed (was fill-surface-default)
  - padding-x: 24px (was 16px)
Tailwind classes to apply: bg-[var(--color-fill-surface-recessed)] px-6
Resolved CSS: { background-color:#F0F0F0; padding-left:24px; padding-right:24px; }
```

Free / vanilla:
```
Target: button.cta (3rd in <header>)
Resolved CSS: { color:#1f2937; border-radius:10px; box-shadow:0 1px 3px rgba(0,0,0,.12); }
```
