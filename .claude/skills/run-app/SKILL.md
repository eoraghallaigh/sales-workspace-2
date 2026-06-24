---
name: run-app
description: Start the Vite dev server for this React prototype. Use whenever the user asks to "run the app", "start the dev server", "run it locally", "boot up the app", or any equivalent phrasing. Captures this project's couple of non-obvious quirks (custom port, partial checked-in node_modules) so the dev server starts in seconds.
---

# Running the prototype locally

## TL;DR

```bash
npm run dev    # serves on http://localhost:8080/
```

Run in the background (Bash `run_in_background: true`) so the dev server stays up across turns. Vite HMR picks up file changes automatically — don't restart for edits.

## Before running, check these in order

Skip the install step if the checks pass.

1. **Working directory**: the app lives at the **repo root** (`package.json`, `vite.config.ts`, `src/` are all at root). Just run from the repo root.
2. **Already running?** Don't start a duplicate. Check:
   ```bash
   lsof -i :8080
   ```
   If something is listening, the app is up — surface the existing URL and stop.
3. **node_modules health**: a checked-in `node_modules/` may be partial (missing the `.bin/` directory, which is what makes `vite: command not found` show up). Quick test:
   ```bash
   ls node_modules/.bin/vite
   ```
   If that file doesn't exist, do a clean install before trying to run.

## Installing dependencies (only if needed)

This repo commits a `.npmrc` that pins the public npm registry (`registry=https://registry.npmjs.org/`), because HubSpot's default registry (`npm.hubteam.com`) doesn't mirror the public Vite/React/shadcn packages. So a plain install works:

```bash
rm -rf node_modules
npm install
```

If you ever see a long hang ending in `ENOTFOUND npm.hubteam.com`, the `.npmrc` isn't being picked up — pass the registry explicitly: `npm install --registry=https://registry.npmjs.org`.

## Useful facts about this app

- **Port**: 8080 (set in `vite.config.ts`), not the Vite default 5173.
- **Stack**: Vite + React + TypeScript + Tailwind + shadcn/ui. **Standalone — NOT a HubSpot bend project.** None of the `bend` / Trellis / CHIRP / `mcp__devex-mcp-server__bend_*` rules in `~/.claude/CLAUDE.md` apply here. Plain `npm`, `npx`, and direct file edits are correct.
- **HMR**: `.tsx` / `.ts` / `.css` edits hot-reload. After a non-trivial edit, tail the dev-server task output to confirm a clean update or surface parse errors:
  ```bash
  tail -3 <task-output-file>
  ```
- **Type/lint checking**: `npm run lint` works. There is no `bend` running and there won't be — don't suggest `bend hs-eslint` or `mcp__devex-mcp-server__bend_package_ts_get_errors` for this project.
- **Production build**: `npm run build` outputs `dist/`. Asset paths are baked at build time via `VITE_BASE_PATH` (defaults to `/` when unset). The Netlify deploy expects `/`.
- **Routing**: cycle-scoped routes (`/:cycleSlug/summary`, `/:cycleSlug/prospecting`, …). `/` and `/:cycleSlug` redirect into the current cycle's Summary (`currentCycleSlug` in `src/data/cycles/index.ts`).
- **Deploy**: Netlify builds from this repo's `main`. After your change is on `main`, `git push origin main` triggers the rebuild — `origin` is configured to fan the push out to every configured target.
