---
name: spec
description: Generate an engineer-facing spec page documenting a feature's interaction flows, component states, and wider context. Use when the user asks to create a spec, document a feature for engineers, or says "spec" / "new spec page".
---

# Generate Spec Page

Generate an engineer-facing spec page that documents a feature's interaction flows, component states, and wider context — so engineers can see exactly what to build without clicking through the prototype.

## When to use

Use when the user asks to create a spec page, document a feature for engineers, or says `/spec`. The user will describe a feature (or point you at specific components/pages in the prototype). Your job is to find the relevant components and data, then build a spec page that renders them in all their states.

## Before you start

1. **Review the conversation history.** The user is usually designing a feature in this same session — the conversation contains decisions about interactions, states, edge cases, and component structure that aren't yet captured anywhere else. Read back through the chat to understand what was built, what states were discussed, and what behaviour was decided. This is your primary source of truth for what the spec should document.
2. **Find the feature's components.** Grep for the component names, state types, and data the user mentions (or that you identified from the conversation). Read the source to understand every state/variant.
3. **Find where it's used in context.** Search for where the component is rendered on a real page (e.g., strategy page, prospecting page). This tells you what surrounding card/layout to show for the "wider context" section.
4. **Read the reference spec page** at `src/pages/specs/feedback-popover.tsx` — this is the canonical example of a finished spec page. Match its structure and patterns.

## Spec page structure

Every spec page follows this order. Include sections that apply; skip sections that don't.

### 1. Header
- `SpecHeader` with a title and one-sentence description of what the feature is and where it appears.

### 2. Context section (if the feature lives inside a larger component)
- Use `StateCard` to render the **actual parent component** from the prototype (e.g., the full OutreachSequenceCard) so engineers see where the feature sits.
- Wrap the parent component in a container: `<div className="bg-[var(--color-fill-surface-raised)] p-3 border border-border rounded-100">`.
- Create a showcase wrapper component that manages state (useState hooks for all interactive props) and passes mock data. All callbacks should be wired up so the component is interactive.

### 3. Interaction flow (one per distinct user flow)
- Use `HorizontalFlow` + `HorizontalFlowStep` to show the step-by-step progression.
- **Each step must render the actual component** in that state — not a description, not a screenshot.
- Steps have: `step` (number), `label` (short, e.g., "Hover on chip"), `description` (one sentence explaining what happens).
- The last step gets `isLast` prop.
- If the feature has a trigger element (chip, button, etc.), render it below the component in each step to show the spatial relationship.

### 4. Component states
- Use `StateCard` for each distinct state of the component.
- `label`: state name (e.g., "Detail view (default)", "Loading", "Error", "Empty").
- `description`: when this state occurs and any notable behavior.
- `variant`: use `"success"` for success/completion states, `"error"` for error states, `"warning"` for warnings, `"default"` for everything else.
- Render the **actual component** inside each StateCard, not a copy.

## Key rules

### Use real components
- Import and render the **actual prototype components** — never recreate markup that already exists as a component.
- If a component has too many required props to render standalone (like OutreachSequenceCard), create a `...Showcase` wrapper component that manages state and provides mock data.
- For isolated sub-components that are internal to a component (not exported), you may recreate them in the spec file — but match the original code exactly.

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

## Available building blocks

All imported from `./blocks`:

| Block | Use for |
|---|---|
| `SpecHeader` | Page title + description |
| `SpecSection` | Titled section with description |
| `StateCard` | Labelled state showcase (variants: default/success/warning/error) |
| `HorizontalFlow` | Container for horizontal interaction flow |
| `HorizontalFlowStep` | Numbered step with component inside |
| `FlowStep` | Vertical timeline step (use for longer flows) |
| `Callout` | Annotated note (types: info/behavior/implementation/edge-case) |
| `CodeRef` | Inline code reference |

## Example file structure

```tsx
import { useState } from "react";
import { SpecLayout } from "./SpecLayout";
import { SpecHeader, SpecSection, StateCard, HorizontalFlow, HorizontalFlowStep } from "./blocks";
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

    {/* Interaction flow */}
    <SpecSection title="Interaction flow" description="...">
      <HorizontalFlow>
        <HorizontalFlowStep step={1} label="..." description="...">
          {/* actual component in state 1 */}
        </HorizontalFlowStep>
        <HorizontalFlowStep step={2} label="..." description="...">
          {/* actual component in state 2 */}
        </HorizontalFlowStep>
        <HorizontalFlowStep step={3} label="..." description="..." isLast>
          {/* actual component in state 3 */}
        </HorizontalFlowStep>
      </HorizontalFlow>
    </SpecSection>

    {/* Component states */}
    <SpecSection title="Component states" description="...">
      <StateCard label="Default" description="...">
        {/* actual component */}
      </StateCard>
      <StateCard label="Error" description="..." variant="error">
        {/* actual component in error state */}
      </StateCard>
    </SpecSection>
  </SpecLayout>
);

export default FeatureNameSpec;
```
