---
description: Commit, PR, merge — then mirror master to the public github remote so Netlify redeploys. Auto-logs an iteration entry to the prototype homepage.
---

## Step 1 — Pre-commit: log a homepage iteration entry (feature-detected)

This step runs ONLY when the workspace has a prototype homepage scaffolded. Detect by checking whether `Downloads/flywheel-sales-workspace/src/data/about/iterations.ts` exists.

If the file does NOT exist, **skip this entire step** and proceed to step 2.

If it exists, do the following BEFORE committing:

### 1a — Confirm the dev server is running

The screenshot capture script needs the local dev server. Check `lsof -i :8080`. If nothing is listening, halt with a message asking the user to run `/run-app` first. Do not auto-start the server — the user might want to control timing.

### 1b — Generate the iteration id

Format: `YYYY-MM-DD-<branch-name-kebab-case>`. Use today's date and the current git branch name (lowercased, non-alphanumeric → hyphens). If an entry with that id already exists in `iterations.ts`, append `-2`, `-3`, etc.

Example: branch `rewrite-strategy-AI` on 2026-05-07 → id `2026-05-07-rewrite-strategy-ai`.

### 1c — Capture screenshots

Run from the prototype directory:

    cd Downloads/flywheel-sales-workspace
    npm run capture -- <iteration-id>

This writes PNGs to `Downloads/flywheel-sales-workspace/public/about/iterations/<iteration-id>/<route-name>.png`. The route list is in `src/data/about/screenshotConfig.ts`.

If the capture script fails, halt and surface the error — don't ship a half-logged entry.

### 1d — Prepend a new entry to `iterations.ts`

Read `Downloads/flywheel-sales-workspace/src/data/about/iterations.ts`. Add a new `IterationEntry` object at the TOP of the `iterations` array (newest first). Use the conversation that led to this `/ship` call to write the entry — the diff is the *what*, the user's stated intent in the conversation is the *why*.

Required fields:

- `id`: the iteration id from step 1b
- `date`: today in `YYYY-MM-DD`
- `label`: branch name in kebab-case (same trailing slug as the id, without the date prefix)
- `whatChanged`: 1–2 sentence summary of the diff. Focus on what a viewer would notice if they opened the prototype.
- `why`: 1–2 sentence summary of the *user's* stated intent in this conversation. If the user asked for a specific outcome ("I want X so that Y"), capture the *Y*. Don't list every tangent.
- `screenshots`: an array of `{ src, alt }` objects, one per route in `screenshotConfig.ts`. Format: `{ src: "/about/iterations/<id>/<name>.png", alt: "<route name> screenshot" }`. Skip the `/about` route's screenshot in this list (a viewer doesn't need a screenshot of the homepage on the homepage).

Optional fields — leave omitted unless obvious from context:

- `shownTo`: only set if the user explicitly mentioned showing this to someone (research participants, exec, customer, etc.).

### 1e — Stage everything

Make sure `iterations.ts` AND the new `public/about/iterations/<id>/` folder both end up in the same commit as the rest of the change.

## Step 2 — Commit, PR, merge

Commit all uncommitted changes with a concise message focused on WHY (not WHAT). Then push the branch (set upstream if needed), open a PR against the workspace's target branch (`origin/master`) using `gh pr create`, and merge it with `gh pr merge --merge`.

If step 1 ran, after `gh pr create` returns the PR URL, edit the just-added entry in `iterations.ts` to set `prUrl` to that URL and amend it into the still-open PR (or push it as a fixup commit before merging — whichever is cleaner). After `gh pr merge` returns, the merge commit SHA can also be added as `commitSha`, but this is optional polish — skip if it adds friction.

Skip remote build monitoring — this is a Vite prototype, no Blazar build.

## Step 3 — Mirror to public remote (Netlify redeploy)

After the merge, mirror master to the public GitHub remote so Netlify picks up the change and triggers a fresh deploy:

    git push github origin/master:main

This is a fast-forward push of the just-merged tip — non-destructive. Netlify watches `github.com/eoraghallaigh/sales-workspace-2` `main` and builds on each push.
