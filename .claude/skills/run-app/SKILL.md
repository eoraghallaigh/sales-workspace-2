---
name: run-app
description: Start the Vite dev server for this project's React prototype. Use whenever the user asks to "run the app", "start the dev server", "run it locally", "boot up the app", or any equivalent phrasing. The runnable app lives in a nested subdirectory and has a few non-obvious quirks (custom port, the default npm registry is unreachable, checked-in node_modules can be partial); this skill captures them all so the dev server starts in seconds instead of minutes.
---

# Running the prototype locally

## TL;DR

```bash
cd Downloads/flywheel-sales-workspace
npm run dev    # serves on http://localhost:8080/
```

Run in the background (Bash `run_in_background: true`) so the dev server stays up across turns. Vite HMR picks up file changes automatically — don't restart for edits.

## Before running, check these in order

Skip the install step if the checks pass.

1. **Working directory**: the runnable Vite/React app is at `Downloads/flywheel-sales-workspace/`, **not** at the repo root. The repo root is a docs/design workspace; running `npm run dev` there will fail with "no package.json".
2. **Already running?** Don't start a duplicate. Check:
   ```bash
   lsof -i :8080
   ```
   If something is listening, the app is up — surface the existing URL and stop.
3. **node_modules health**: a checked-in `node_modules/` may be partial (missing the `.bin/` directory, which is what makes `vite: command not found` show up). Quick test:
   ```bash
   ls Downloads/flywheel-sales-workspace/node_modules/.bin/vite
   ```
   If that file doesn't exist, do a clean install before trying to run.

## Installing dependencies (only if needed)

The default npm registry on this machine is `npm.hubteam.com`, which **does not resolve** (the public Vite/React packages aren't mirrored there). Always pass the public registry explicitly:

```bash
cd Downloads/flywheel-sales-workspace
rm -rf node_modules
npm install --registry=https://registry.npmjs.org
```

Symptoms of forgetting `--registry`: long hang followed by `ENOTFOUND npm.hubteam.com` errors and a confusing `npm error Exit handler never called!`. If you see that, this is the cause.

## Useful facts about this app

- **Port**: 8080 (set in `vite.config.ts`), not the Vite default 5173.
- **Stack**: Vite + React + TypeScript + Tailwind + shadcn/ui. **Standalone — NOT a HubSpot bend project.** None of the `bend` / Trellis / CHIRP / `mcp__devex-mcp-server__bend_*` rules in `~/.claude/CLAUDE.md` apply here. Plain `npm`, `npx`, and direct file edits are correct.
- **HMR**: `.tsx` / `.ts` / `.css` edits hot-reload. After a non-trivial edit, tail the dev-server task output to confirm a clean update or surface parse errors:
  ```bash
  tail -3 <task-output-file>
  ```
- **Type/lint checking**: `npm run lint` works. There is no `bend` running and there won't be — don't suggest `bend hs-eslint` or `mcp__devex-mcp-server__bend_package_ts_get_errors` for this project.
- **Production build**: `npm run build` outputs `dist/`. Asset paths are baked at build time via `VITE_BASE_PATH` (defaults to `/` when unset). The Netlify deploy expects `/`.
- **Deploy**: Netlify watches `github.com/eoraghallaigh/sales-workspace-2` `main`. Publishing a fresh deploy after a `/ship` requires a separate `git push github origin/master:main` — `/ship` itself only updates the internal `git.hubteam.com` remote.
