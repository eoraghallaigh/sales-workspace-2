---
description: Commit, PR, merge — then mirror master to the public github remote so Netlify redeploys. Auto-logs an iteration entry to the current cycle's page.
---

## Step 1 — Pre-commit: log a cycle iteration entry (feature-detected)

This step runs ONLY when the workspace has the cycles scaffolding. Detect by checking whether `Downloads/flywheel-sales-workspace/src/data/cycles/index.ts` exists.

If the file does NOT exist, **skip this entire step** and proceed to step 2.

If it exists, do the following BEFORE committing:

### 1a — Confirm the dev server is running

The screenshot capture script needs the local dev server. Check `lsof -i :8080`. If nothing is listening, halt with a message asking the user to run `/run-app` first. Do not auto-start the server — the user might want to control timing.

### 1b — Read the current cycle and pick a commitment

Open `Downloads/flywheel-sales-workspace/src/data/cycles/index.ts` and read the value of `currentCycleSlug` (e.g. `"q2c2"`). All new iterations are appended to the cycle whose slug matches. The iteration array for that cycle lives at `Downloads/flywheel-sales-workspace/src/data/cycles/iterations/<slug>.ts` and is exported as `<slug>Iterations` (e.g. `q2c2Iterations`).

Then open `Downloads/flywheel-sales-workspace/src/data/cycles/<currentSlug>.ts` and read the `commitments` array. Each entry has an `id`, `title`, and `summary`. Decide which commitment this iteration belongs to:

- **If there is exactly one commitment** on the cycle, use its `id` automatically without asking — only one option.
- **If there are zero commitments**, halt and ask the user to add one in `<currentSlug>.ts` before shipping. The cycle page can't render the iteration's context otherwise.
- **If there are multiple commitments**, infer from the conversation which one this work belongs to (the diff, branch name, and user intent usually make it obvious). If it's ambiguous, ask the user explicitly — list each commitment's `id` and `title` and let them pick. Don't guess.

Capture the chosen commitment id (call it `COMMITMENT_ID`); step 1e writes it onto the new iteration entry.

### 1c — Generate the iteration id

Format: `YYYY-MM-DD-<branch-name-kebab-case>`. Use today's date and the current git branch name (lowercased, non-alphanumeric → hyphens). If an entry with that id already exists in the cycle's iterations file, append `-2`, `-3`, etc.

Example: branch `rewrite-strategy-AI` on 2026-05-07 → id `2026-05-07-rewrite-strategy-ai`.

### 1d — Capture screenshots

Run from the prototype directory:

    cd Downloads/flywheel-sales-workspace
    npm run capture -- <iteration-id>

This writes PNGs to `Downloads/flywheel-sales-workspace/public/about/iterations/<iteration-id>/<route-name>.png`. The route list is in `src/data/cycles/screenshotConfig.ts`; the capture script prefixes each path with the current cycle slug automatically.

If the capture script fails, halt and surface the error — don't ship a half-logged entry.

### 1e — Prepend a new entry to the cycle's iterations file

Read `Downloads/flywheel-sales-workspace/src/data/cycles/iterations/<currentCycleSlug>.ts`. Add a new `IterationEntry` object at the TOP of the array (newest first). Use the conversation that led to this `/ship` call to write the entry — the diff is the *what*, the user's stated intent in the conversation is the *why*.

Required fields:

- `id`: the iteration id from step 1c
- `date`: today in `YYYY-MM-DD`
- `label`: branch name in kebab-case (same trailing slug as the id, without the date prefix)
- `whatChanged`: 1–2 sentence summary of the diff. Focus on what a viewer would notice if they opened the prototype.
- `why`: 1–2 sentence summary of the *user's* stated intent in this conversation. If the user asked for a specific outcome ("I want X so that Y"), capture the *Y*. Don't list every tangent.
- `commitment`: the `COMMITMENT_ID` from step 1b. Required so the cycle page can group iterations under the right commitment.
- `screenshots`: an array of `{ src, alt }` objects, one per route in `screenshotConfig.ts`. Format: `{ src: "/about/iterations/<id>/<name>.png", alt: "<route name> screenshot" }`. (Screenshots stay under `/about/iterations/` regardless of cycle — they're keyed by unique iteration id.)

Optional fields — leave omitted unless obvious from context:

- `shownTo`: only set if the user explicitly mentioned showing this to someone (research participants, exec, customer, etc.).

### 1f — Stage everything

Make sure the cycle iterations file AND the new `public/about/iterations/<id>/` folder both end up in the same commit as the rest of the change.

## Step 2 — Commit, PR, merge

Commit all uncommitted changes with a concise message focused on WHY (not WHAT). Then push the branch (set upstream if needed), open a PR against the workspace's target branch (`origin/master`) using `gh pr create`, and merge it with `gh pr merge --merge`.

If step 1 ran, after `gh pr create` returns the PR URL, edit the just-added entry in the cycle iterations file to set `prUrl` to that URL and amend it into the still-open PR (or push it as a fixup commit before merging — whichever is cleaner). After `gh pr merge` returns, the merge commit SHA can also be added as `commitSha`, but this is optional polish — skip if it adds friction.

Skip remote build monitoring — this is a Vite prototype, no Blazar build.

## Step 3 — Mirror to public remote (Netlify redeploy)

After the merge, mirror master to the public GitHub remote so Netlify picks up the change and triggers a fresh deploy:

    git push github origin/master:main

This is a fast-forward push of the just-merged tip — non-destructive. Netlify watches `github.com/eoraghallaigh/sales-workspace-2` `main` and builds on each push.
