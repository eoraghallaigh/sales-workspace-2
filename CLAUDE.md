# Sales Workspace prototype

A standalone, interactive prototype of a prospecting experience for sales reps, built as a clickable design artifact (not a production app).

## Stack & tooling

- **Vite + React + TypeScript + Tailwind + shadcn/ui.** Standalone — **NOT a HubSpot `bend` project.** The `bend` / Trellis / CHIRP / `mcp__devex-mcp-server__bend_*` rules from the global `~/.claude/CLAUDE.md` do **not** apply here. Plain `npm`, `npx`, `vite`, and direct file edits are correct.
- Run it with `/run-app` (or `npm run dev`, port 8080). Build with `npm run build` (outputs `dist/`).
- Deploy: Netlify builds from `main`; `git push origin main` triggers a rebuild.

## Release cycles & environments

To stop engineers from being surprised by in-flight design changes, each release cycle gets its own **frozen URL** via a git branch + Netlify branch deploy:

- **`main` is the live playground.** Keep iterating and `/ship`-ing here. The bare URL `prospecting-strategy.netlify.app` = "latest / work in progress."
- **Lock a cycle with `/lock-cycle <date>`** (e.g. `/lock-cycle aug-3`). It cuts an immutable date-named branch from the current `main` tip and pushes it; Netlify serves it at `https://aug-3--prospecting-strategy.netlify.app`. **Never push to a locked branch again** — that prefixed URL is what engineers cite for a release's scope.
- **Looking back** = the set of cycle branch deploys (`aug-3--…`, `sep-15--…`), each a live frozen artifact. Netlify deploy permalinks (`<deploy-id>--…`) give byte-exact snapshots.
- **One-time setup:** in Netlify → Build & deploy → Branches and deploy contexts, enable **Branch deploys** (All).

The in-app "cycle" data (`src/data/cycles/index.ts`, slugs like `q2c2`) is unrelated metadata — cycle *isolation* comes from branches, not from that file.

## Design system — check before writing markup

UI primitives live in `src/components/ui/` (shadcn-style: `Button`, `Card`, `Badge`, `Dialog`, `Table`, etc.). Before hand-rolling any markup or styled component, grep there and match the call pattern from an existing usage. Only hand-roll when nothing equivalent exists, and say so. Design tokens are in `tailwind.config.ts` and `src/index.css`.

## Structure

- `src/pages/*` — route pages (Summary, Prospecting, Deals, Agents, Plays, Power Hour, …).
- Routing is flat: `/<page>` (e.g. `/summary`, `/prospecting`, `/deals`). `/` redirects to `/summary`. Release-cycle isolation is handled by branches/deploys, not by URL prefixes — see "Release cycles & environments" above.
- `src/components/`, `src/contexts/`, `src/hooks/`, `src/data/` — shared UI, providers, and mocked data.

## Conventions

- Match the patterns, naming, and comment density of surrounding code.
- Don't add new code comments unless asked.
