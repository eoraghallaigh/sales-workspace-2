---
name: spec
description: Generate an engineer-facing spec page documenting a feature's interaction flows, component states, and wider context. Use when the user asks to create a spec, document a feature for engineers, or says "spec" / "new spec page".
---

# Generate Spec Page

Generate an engineer-facing spec page that documents a feature's interaction flows, component states, and wider context — so engineers can see exactly what to build without clicking through the prototype.

## When to use

Use when the user asks to create a spec page, document a feature for engineers, or says `/spec`. The user will describe a feature (or point you at specific components/pages in the prototype). Your job is to find the relevant components and data, then build a spec page that renders them in all their states.

## Use the real design system — no shadow components

Spec pages live in the **same repo as the prototype** (`src/pages/specs/*`), so the entire design system (`src/components/ui/*`) and every prototype component are importable via the `@/*` alias. There is **no reason to hand-roll markup that a component already provides.** (Earlier specs were authored in a separate repo without design-system access — that is why some existing specs contain look-alike "shadow" markup. That constraint is gone; don't add more, and prefer replacing shadow markup with the real component when you touch it.)

Before writing markup for any primitive — button, badge, popover, dialog, tabs, calendar, input, split button, avatar, tag, switch, tooltip, and so on:

1. **Grep `src/components/ui/` for it and import the real one.** Also check `src/components/` for higher-level prototype components.
2. **Match the call pattern** from a real usage in the prototype (props, wrapper structure, tokens).
3. **Only hand-roll when nothing equivalent exists** — and say so in your summary.

Never reproduce a design-system primitive's look with raw `<div>` + Tailwind. Tell-tale shadow markup to avoid: `rounded-full` pills standing in for `Badge`/`Button`, hand-built dropdown menus, fake calendars, or `border … bg-white shadow` chrome mirroring `PopoverContent`. If you find yourself writing any of these, stop and import the real component instead. Shadow copies drift from the real UI — which is the whole problem this rule exists to prevent.

## Before you start

1. **Review the conversation history.** The user is usually designing a feature in this same session — the conversation contains decisions about interactions, states, edge cases, and component structure that aren't yet captured anywhere else. Read back through the chat to understand what was built, what states were discussed, and what behaviour was decided. This is your primary source of truth for what the spec should document.
2. **Find the feature's components.** Grep for the component names, state types, and data the user mentions (or that you identified from the conversation). Read the source to understand every state/variant.
3. **Find where it's used in context.** Search for where the component is rendered on a real page (e.g., strategy page, prospecting page). This tells you what surrounding card/layout to show for the "wider context" section.
4. **Read the reference spec page** at `src/pages/specs/feedback-popover.tsx` — this is the canonical example of a finished spec page. Match its **structure and patterns** (sections, showcase wrappers, mock data). But note it predates some primitives and contains a hand-rolled `PopoverFrame` shadow div — **do not copy that**. When you need to show popover contents, use the real `Popover`/`PopoverContent`; if a floating popover is awkward to lay out inline in a flow diagram, keep the wrapper minimal and token-matched and put the real components *inside* it.

## Spec page structure

Every spec page follows this order. Include sections that apply; skip sections that don't.

### 1. Header
- `SpecHeader` with a title and one-sentence description of what the feature is and where it appears.

### 2. Context section (if the feature lives inside a larger component)
- Use `StateCard` to render the **actual parent component** from the prototype (e.g., the full OutreachSequenceCard) so engineers see where the feature sits.
- Wrap the parent component in a container: `<div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">`.
- Create a showcase wrapper component that manages state (useState hooks for all interactive props) and passes mock data. All callbacks should be wired up so the component is interactive.

### 3. Interaction flow (one per distinct user flow)

**Default to vertical `FlowStep` layout.** Most prototype components are 500–800px wide and get crushed inside `HorizontalFlowStep`'s fixed 280px columns. Only use `HorizontalFlow` + `HorizontalFlowStep` for narrow elements (popovers, chips, badges — anything under ~300px natural width).

- Wrap each group of `FlowStep`s in a recessed container: `<div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">`.
- **Each step must render the actual component in that exact state** — not a description, not a placeholder, not a simplified version. A "done" step must show the full done output, not the idle component.
- **Match actual UI widths.** Read the source to find the container width the component lives in (e.g. `w-[800px]`). Set that same width on the wrapper div inside each step. Never use arbitrary `max-w-lg` or guess at widths.
- Steps have: `step` (number), `label` (short, e.g., "Hover on chip"), `description` (one sentence explaining what happens).
- The last step gets `isLast` prop.
- If the feature has a trigger element (chip, button, etc.), render it below the component in each step to show the spatial relationship.
- The step `description` should carry the explanation. Only add `Callout` blocks for genuinely non-obvious behaviour an engineer would miss — don't annotate what the visual already shows.

### 4. Component states
- Use `StateCard` for each distinct state of the component. `StateCard` uses `w-fit` so it expands to fit content — don't add extra max-width constraints.
- `label`: state name (e.g., "Detail view (default)", "Loading", "Error", "Empty").
- `description`: when this state occurs and any notable behavior.
- `variant`: use `"success"` for success/completion states, `"error"` for error states, `"warning"` for warnings, `"default"` for everything else.
- Render the **actual component** inside each StateCard, not a copy.
- **Match actual UI widths** on the wrapper div inside each StateCard, same as for flow steps.
- **Include surrounding UI context.** When showing a button or header pattern, include the real subline text, labels, and layout that appear in the actual UI — not just the isolated element.

## Key rules

### Use real components
- Import and render the **actual prototype components and design-system primitives** — never recreate markup that already exists as a component (see "Use the real design system" above).
- If a component has too many required props to render standalone (like OutreachSequenceCard), create a `...Showcase` wrapper component that manages state and provides mock data.
- If a piece of UI is an internal, non-exported sub-component, first try to reproduce it by **composing exported design-system primitives** (real `Popover`/`PopoverContent`, `Calendar`, `Badge`, `Button`, `SplitButton`, `Input`, etc.). Only recreate raw markup when it genuinely can't be composed from real primitives — and then copy the original source exactly (same classes, same tokens) so it can't drift. If the sub-component would be reused across specs, consider exporting it from the prototype instead of copying it.

### Mock data
- Define mock data as constants at the top of the file (`MOCK_CONTACT`, `MOCK_EMAILS`, etc.).
- Use realistic data, not "lorem ipsum" — engineers need to see how real content fits.

### Callbacks
- Wire up interactive callbacks with `useState` so the component actually works (expand/collapse, edit fields, etc.).
- Non-interactive callbacks get `() => {}`.

### No nav
- Spec pages use `SpecLayout` which has no navigation — they're designed to be viewed standalone or iframed.

### Iframe auto-sizing
- `SpecLayout` posts a `{ type: "spec-height", height }` message to `window.parent` on load and on resize, so a containing iframe can auto-size. This is built into the layout — **do not add height-posting code to individual spec pages**.

## Files to create/modify

### 1. Create the spec page
- File: `src/pages/specs/{feature-slug}.tsx`
- Default export: `{FeatureName}Spec` component

### 2. Add the route in `src/App.tsx`
- Import the spec page at the top (alongside other spec imports)
- Add a `<Route path="/specs/{feature-slug}" element={<FeatureNameSpec />} />` inside the `<Routes>` block (next to other `/specs/*` routes)

### 3. Add to the index in `src/pages/specs/SpecsIndex.tsx`
- Add an entry to the `specs` array with `slug`, `title`, `description`, and `category`

### 4. Verify the build
- Run `npx vite build` to confirm no compilation errors.
- Also re-scan your spec for shadow markup: if any block re-implements the look of something in `src/components/ui/` (a pill instead of `Badge`, framed div instead of `PopoverContent`, fake dropdown/calendar, etc.), swap in the real component before finishing.

## Available building blocks

All imported from `./blocks`:

| Block | Use for |
|---|---|
| `SpecHeader` | Page title + description |
| `SpecSection` | Titled section with description |
| `StateCard` | Labelled state showcase (variants: default/success/warning/error) |
| `FlowStep` | Vertical timeline step (**default for interaction flows**) |
| `HorizontalFlow` | Container for horizontal flow (only for narrow elements < 300px) |
| `HorizontalFlowStep` | Numbered step inside HorizontalFlow |
| `Callout` | Annotated note — use sparingly (types: info/behavior/implementation/edge-case) |
| `CodeRef` | Inline code reference |

## Example file structure

```tsx
import { useState } from "react";
import { SpecLayout } from "./SpecLayout";
import { SpecHeader, SpecSection, StateCard, FlowStep } from "./blocks";
import { ActualComponent } from "@/components/ActualComponent";

// Mock data
const MOCK_DATA = { /* ... */ };

// Showcase wrapper (manages state for complex components)
const ComponentShowcase = () => {
  const [state, setState] = useState(/* ... */);
  return (
    <div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">
      <ActualComponent {...props} />
    </div>
  );
};

const FeatureNameSpec = () => (
  <SpecLayout>
    <SpecHeader title="Feature name" description="..." />

    {/* Context — where this feature lives */}
    <SpecSection title="Context" description="...">
      <StateCard label="Parent component" description="...">
        <ComponentShowcase />
      </StateCard>
    </SpecSection>

    {/* Interaction flow — vertical by default, match actual UI width */}
    <SpecSection title="Interaction flow" description="...">
      <div className="bg-[var(--color-fill-surface-recessed)] p-8 rounded-200">
        <FlowStep step={1} label="..." description="...">
          <div className="w-[800px]">{/* actual component in state 1 */}</div>
        </FlowStep>
        <FlowStep step={2} label="..." description="...">
          <div className="w-[800px]">{/* actual component in state 2 */}</div>
        </FlowStep>
        <FlowStep step={3} label="..." description="..." isLast>
          <div className="w-[800px]">{/* actual component in state 3 */}</div>
        </FlowStep>
      </div>
    </SpecSection>

    {/* Component states — match actual UI width */}
    <SpecSection title="Component states" description="...">
      <StateCard label="Default" description="...">
        <div className="w-[800px]">{/* actual component */}</div>
      </StateCard>
      <StateCard label="Error" description="..." variant="error">
        <div className="w-[800px]">{/* actual component in error state */}</div>
      </StateCard>
    </SpecSection>
  </SpecLayout>
);

export default FeatureNameSpec;
```
