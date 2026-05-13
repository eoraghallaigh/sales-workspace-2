---
name: freeze-cycle
description: Kick off a new 6-week release cycle by namespacing the current cycle's prototype pages and forking them into a new cycle slug. Use when the calendar rolls a cycle boundary (e.g. Q2C2 → Q3C1) and you want the old prototype frozen while new work happens on a new URL. Pass the new cycle slug as the argument (e.g. `q3c1`).
---

# Freezing a release cycle

## What this does

The prototype has one set of page files at `src/pages/*.tsx` (Summary, Prospecting, PowerHour, etc.) that historically served every cycle slug via a shared `/:cycleSlug/*` route. When a new cycle starts, this skill:

1. Reads the current cycle slug from `src/data/cycles/index.ts`.
2. **Namespaces the current cycle's pages** by moving them into `src/pages/<currentSlug>/` (only on first freeze — subsequent freezes find them already namespaced).
3. **Forks** that namespaced directory into `src/pages/<newSlug>/` so the new cycle starts as a clone of the frozen one.
4. Rewrites `App.tsx` so each cycle's routes point at its own pages.
5. Creates `src/data/cycles/<newSlug>.ts` + `src/data/cycles/iterations/<newSlug>.ts`, registers them in `index.ts`, and bumps `currentCycleSlug` to the new slug.
6. Builds and smoke-tests so you catch any broken imports before merging.

Going forward, `/ship` appends to the new cycle's iterations file. Edits to `src/pages/<newSlug>/*` only affect the new cycle. The old cycle's pages still live in `src/pages/<oldSlug>/` and never change unless you edit them directly.

## What this does NOT do (known limitation)

Shared code under `src/components/`, `src/contexts/`, `src/hooks/`, `src/utils/`, and most of `src/data/` is **not** copied into the cycle namespace. If you later restyle a button or rewrite the company dataset, the frozen cycle's prototype will drift visually and behaviourally — it stays functional but isn't pixel-frozen. If you need true pixel-frozen archives (e.g. for a leadership review comparing cycles side-by-side), upgrade to a Netlify static-build snapshot approach instead. This skill is the pragmatic middle path.

## Prerequisites

- Working tree must be clean (no uncommitted changes). Halt and ask the user to commit/stash first if `git status --porcelain` returns anything.
- The new slug must exist in `cycleSchedule` in `src/data/cycles/index.ts`. If the calendar shape changes, update `cycleSchedule` first.
- The new slug must not already be registered in `cycles[]` (refuse to overwrite).

## Inputs

- **New cycle slug** (required, kebab-case, lowercase). From the user, e.g. `q3c1`.
- **Cycle name** (optional). Defaults to the current cycle's `name` if not provided — the user can edit it later in `<newSlug>.ts`.
- **Cycle tagline** (optional). Same default.

## Step-by-step

Run everything from the prototype root: `cd Downloads/flywheel-sales-workspace`.

### Step 1 — Read current state

- Open `src/data/cycles/index.ts` and capture `currentCycleSlug` (call it `OLD_SLUG`).
- Verify `cycleSchedule[NEW_SLUG]` exists. If missing, halt and tell the user to add the date range first.
- Verify `src/data/cycles/<NEW_SLUG>.ts` does **not** exist.

### Step 2 — Namespace the current cycle's pages (first-time only)

Check whether `src/pages/<OLD_SLUG>/` exists.

- **If it exists**, skip ahead to Step 3 — the previous freeze already namespaced this cycle.
- **If it does not exist**, do the following:

  1. Create the directory: `mkdir -p src/pages/<OLD_SLUG>`.
  2. Move every file under `src/pages/*.tsx` into `src/pages/<OLD_SLUG>/`, **except**:
     - `TeamHome.tsx` (stays at the top — it's not cycle-scoped)
     - `CyclePage.tsx` (stays at the top — it renders any cycle)
  3. Open `src/App.tsx` and update every `from "./pages/<X>"` import where `<X>` is a moved file. Change to `from "./pages/<OLD_SLUG>/<X>"`. Also rename the import binding to `<X><OLD_SLUG_CAMEL>` (e.g. `Summary` → `SummaryQ2C2`) so it doesn't collide with the forked copy you'll add in Step 4.
  4. Rewrite the cycle's routes in `App.tsx` from the dynamic `/:cycleSlug/<X>` pattern to a static `/<OLD_SLUG>/<X>` pattern with the renamed binding. Example:
     ```tsx
     <Route path="/q2c2/summary" element={<SummaryQ2C2 />} />
     <Route path="/q2c2/prospecting" element={<ProspectingQ2C2 />} />
     // ... one Route per prototype screen
     ```
     The dynamic `/:cycleSlug` (CyclePage) and `/` (TeamHome) routes stay as-is.

### Step 3 — Fork the namespaced cycle into the new slug

- `cp -R src/pages/<OLD_SLUG> src/pages/<NEW_SLUG>`. This clones the frozen pages as the starting point for the new cycle.

### Step 4 — Add the new cycle's routes to App.tsx

- Add a parallel set of imports at the top:
  ```tsx
  import Summary<NEW_SLUG_CAMEL> from "./pages/<NEW_SLUG>/Summary";
  // ...one per prototype screen
  ```
- Add the matching `<Route>` entries inside `<Routes>`:
  ```tsx
  <Route path="/<NEW_SLUG>/summary" element={<Summary<NEW_SLUG_CAMEL> />} />
  // ...one per prototype screen
  ```
- Keep alphabetical / logical grouping consistent with the existing routes for the old slug so the file stays readable.

### Step 5 — Create the new cycle's data files

Write `src/data/cycles/iterations/<NEW_SLUG>.ts`:

```ts
import type { IterationEntry } from "../types";

// Iteration entries are auto-appended by the /ship slash command.
// New entries should be added at the TOP of this array (newest first).
export const <NEW_SLUG_CAMEL>Iterations: IterationEntry[] = [];
```

Write `src/data/cycles/<NEW_SLUG>.ts`. Seed it from `cycleSchedule[NEW_SLUG]` and (if the user didn't supply overrides) the previous cycle's `name`, `tagline`, and `primaryPersona`:

```ts
import type { Cycle } from "./types";
import { <NEW_SLUG_CAMEL>Iterations } from "./iterations/<NEW_SLUG>";

export const <NEW_SLUG_CAMEL>: Cycle = {
  slug: "<NEW_SLUG>",
  label: "<UPPERCASE_SLUG>",
  name: "<NAME>",
  tagline: "<TAGLINE>",
  dateRange: { start: "<schedule.date>", end: "<schedule.end>" },
  status: {
    label: "Planned",
    badgeVariant: "status-blue",
  },
  milestones: [],
  primaryPersona: { name: "<previous cycle's persona>" },
  hero: {
    prototypeEntryPath: "/summary",
  },
  commitments: [],
  iterations: <NEW_SLUG_CAMEL>Iterations,
};
```

Leave `commitments: []` empty. As the cycle is scoped, the user adds one `Commitment` per feature (each with its own `id`, `title`, `problem`, `designGoals`, `feedback`, `metrics`). Until at least one commitment exists, `/ship` will refuse to log iterations against this cycle — that's intentional, since iterations carry a `commitment` id.

### Step 6 — Register the new cycle in src/data/cycles/index.ts

- Add `import { <NEW_SLUG_CAMEL> } from "./<NEW_SLUG>";` next to the existing cycle imports.
- Prepend the new cycle to `cycles: Cycle[]` so it's first (newest first).
- Update `currentCycleSlug` to `"<NEW_SLUG>"`.

### Step 7 — Verify

Run from the prototype root:

```bash
npm run lint
```

If lint fails, fix the issues (most often: stale imports left in `App.tsx` from Step 2). Don't proceed until lint is clean.

Then make sure the dev server is up (or start it with `/run-app`) and smoke-test the routes — at minimum:

- `/` (Team Home — should list the new cycle alongside the old one)
- `/<OLD_SLUG>` (Old cycle page — still renders, iterations intact)
- `/<OLD_SLUG>/summary` (Old prototype landing — still works)
- `/<NEW_SLUG>` (New cycle page — empty problem/goals/metrics, expected)
- `/<NEW_SLUG>/summary` (New prototype landing — clone of old)

Use Playwright or a manual browser pass. Watch for console errors.

### Step 8 — Commit

Single commit with a clear `Why:` message — something like:

> Kick off <NEW_LABEL> cycle and freeze <OLD_LABEL> prototype
>
> Why: <OLD_LABEL> wrapped on <date>. New work shouldn't touch the frozen prototype, so its pages are namespaced under `src/pages/<OLD_SLUG>/` and the new cycle starts from a clone at `src/pages/<NEW_SLUG>/`. `/ship` now appends iterations to <NEW_LABEL>.

Do not run `/ship` for this commit unless the user explicitly asks — this is a structural change, not a prototype iteration.

## Reference: slug casing helpers

When generating identifier names:

- `<NEW_SLUG>`: lowercase kebab-ish — `q3c1`
- `<UPPERCASE_SLUG>`: shown in UI badges — `Q3C1`
- `<NEW_SLUG_CAMEL>`: TypeScript identifier — `q3c1` for variables, `Q3C1` for React component import aliases. Use whatever React supports (PascalCase component aliases like `SummaryQ3C1`).
