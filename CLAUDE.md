# Sales Workspace prototype

A standalone, interactive prototype of a prospecting experience for sales reps, built as a clickable design artifact (not a production app).

## Stack & tooling

- **Vite + React + TypeScript + Tailwind + shadcn/ui.** Standalone — **NOT a HubSpot `bend` project.** The `bend` / Trellis / CHIRP / `mcp__devex-mcp-server__bend_*` rules from the global `~/.claude/CLAUDE.md` do **not** apply here. Plain `npm`, `npx`, `vite`, and direct file edits are correct.
- Run it with `/run-app` (or `npm run dev`, port 8080). Build with `npm run build` (outputs `dist/`).
- Deploy: Netlify builds from `main`; `git push origin main` triggers a rebuild.

## Design system — check before writing markup

UI primitives live in `src/components/ui/` (shadcn-style: `Button`, `Card`, `Badge`, `Dialog`, `Table`, etc.). Before hand-rolling any markup or styled component, grep there and match the call pattern from an existing usage. Only hand-roll when nothing equivalent exists, and say so. Design tokens are in `tailwind.config.ts` and `src/index.css`.

## Structure

- `src/pages/*` — route pages (Summary, Prospecting, Deals, Agents, Plays, Power Hour, …).
- Routing is cycle-scoped: `/:cycleSlug/<page>`. `/` and `/:cycleSlug` redirect into the current cycle's Summary. The current cycle is `currentCycleSlug` in `src/data/cycles/index.ts`.
- `src/components/`, `src/contexts/`, `src/hooks/`, `src/data/` — shared UI, providers, and mocked data.

## Conventions

- Match the patterns, naming, and comment density of surrounding code.
- Don't add new code comments unless asked.
