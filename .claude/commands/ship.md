---
description: Commit, open a PR against main, merge it, sync both remotes, and log an iteration entry to the team-home repo.
---

# Ship

This command ships the current branch's changes through a PR on the internal repo, syncs both remotes (internal EMU + public Netlify mirror) so the deploy is live, then logs an iteration entry to the separate team-home repo via the GitHub API.

`/ship` targets `main`, which is the **live playground** (the bare `prospecting-strategy.netlify.app` URL). To freeze the current design as a stable, immutable URL for a release cycle, use `/lock-cycle <date>` instead — that's how engineers get a "what's in scope" URL that doesn't move.

## Step 1 — Commit

Stage and commit all uncommitted changes. Write a concise message focused on **why** the change was made — the diff shows the what. Always commit unsigned:

```bash
git -c commit.gpgsign=false commit …
```

If there are no uncommitted changes (everything is already committed), skip this step.

## Step 2 — Push the branch

Push the current branch to `origin`. Since `origin` has two push URLs (EMU + public), both repos receive the branch in one push:

```bash
git push -u origin HEAD
```

## Step 3 — Create a PR

Create a pull request targeting `main` on the internal EMU repo. The `gh` CLI's active account is the personal one, so use the EMU token explicitly:

```bash
GH_TOKEN=$(gh auth token --user eoraghallaigh_hubspot) gh pr create --base main --fill
```

`--fill` uses the commit message as the PR title/body. If there are multiple commits on the branch, draft a short title + body instead of `--fill`.

Surface the PR URL to the user.

## Step 4 — Merge the PR

Merge with a merge commit (not squash — preserves individual commit history):

```bash
GH_TOKEN=$(gh auth token --user eoraghallaigh_hubspot) gh pr merge --merge
```

## Step 5 — Sync both remotes

The merge happened server-side on the EMU repo only. The public repo (`sales-workspace-2`) still has the old `main`. Fetch the merged tip from EMU and push it out to both:

```bash
git fetch origin main
git push origin origin/main:refs/heads/main
```

This is a fast-forward push. The EMU repo is a no-op (already merged); the public repo advances `main`, which triggers the Netlify rebuild.

## Step 6 — Log iteration entry to team-home

Write an iteration entry to the team-home repo (`HubSpotShare/fpl-team-home`) using the GitHub API. This keeps the prototype repo "pure" while the iteration history lives in the team context repo.

### 6a. Build the iteration entry

From the PR and commits just merged, assemble an `IterationEntry` object:

- **`id`**: `YYYY-MM-DD-<slug>` — today's date + a kebab-case slug derived from the commit/PR title.
- **`date`**: today's date, `YYYY-MM-DD`.
- **`label`**: the slug portion of the id (same as the branch name or a short label).
- **`whatChanged`**: an array of bullet strings describing **what** changed. Each bullet should be a standalone, descriptive sentence that communicates the UX change to someone who hasn't seen the prototype. **Only include meaningful UX changes** — new features, redesigned flows, significant layout/interaction changes. Omit bug fixes, data changes, code refactors, and minor tweaks (e.g. swapping an icon direction, changing avatar colours, fixing alignment).
- **`why`**: an array of 1–3 bullet strings explaining **why** the changes were made — the design rationale, user problem, or stakeholder driver. This is the most important part.
- **`prUrl`**: the PR URL from Step 3.
- **`commitment`**: infer from the changes — typical values are `"plays"`, `"outreach-strategy"`, `"prospecting-tables"`, or omit if unclear.
- **`screenshots`**: `[]` (empty for now — screenshots can be added separately).

### 6a′. Present the entry for review

**Do not write the entry to the team-home repo yet.** First, present the assembled entry to the user in a readable format and ask them to review and sign off before proceeding. The user may want to reword bullets, add/remove items, or skip the entry entirely. Only proceed to 6b once the user confirms.

### 6b. Read the current iteration file

The current cycle is `q2c2`. Read the iteration data file:

```bash
GH_TOKEN=$(gh auth token --user eoraghallaigh_hubspot) \
  gh api repos/HubSpotShare/fpl-team-home/contents/src/data/cycles/iterations/q2c2.ts \
  --jq '{content: .content, sha: .sha}'
```

Base64-decode the `content` to get the current TypeScript source.

### 6c. Prepend the new entry

The file is a TypeScript array (newest-first). Insert the new entry object at the **top** of the array, right after the opening `[`. The entry must be valid TypeScript matching the `IterationEntry` interface:

```typescript
{
  id: "2026-07-02-example-slug",
  date: "2026-07-02",
  label: "example-slug",
  whatChanged: [
    "First change description.",
    "Second change description.",
  ],
  why: [
    "Reason the change was made.",
  ],
  prUrl: "https://github.com/eoraghallaigh_hubspot/flywheel-sales-workspace/pull/27",
  commitment: "plays",
  screenshots: [],
},
```

### 6d. Write the updated file back

Base64-encode the updated file and push it via the API. The `sha` from 6b is required to avoid conflicts:

```bash
GH_TOKEN=$(gh auth token --user eoraghallaigh_hubspot) \
  gh api repos/HubSpotShare/fpl-team-home/contents/src/data/cycles/iterations/q2c2.ts \
  -X PUT \
  -f message="Add iteration entry: <id>" \
  -f content="<base64-encoded-updated-file>" \
  -f sha="<sha-from-6b>" \
  -f branch="master"
```

### 6e. Verify

Confirm the API returned a `200` or `201`. Report the iteration id to the user.

If the API call fails (e.g. conflict, auth issue), report the error but do NOT fail the whole `/ship` — the code is already merged and deployed. The user can retry the iteration entry manually.

## Done

Report:
- The PR URL
- That both repos are synced
- The Netlify deploy URL: `https://prospecting-strategy.netlify.app`
- The iteration entry id logged to team-home (or an error if it failed)

## Notes

- **Iteration entries go to a separate repo** (`HubSpotShare/fpl-team-home`, branch `master`) via the GitHub Contents API. The prototype repo stays clean.
- **Screenshots are not captured automatically.** Entries are written with `screenshots: []`. Screenshots can be added to `public/about/iterations/<id>/` in the team-home repo later.
- **No build monitoring.** This is a standalone Vite prototype — there's no Blazar/CI pipeline to poll.
- **Both repos update from one push** because `origin` is configured with two push URLs. If that ever breaks, check `git remote get-url --push --all origin` — it should list both the EMU and public repo URLs.
- **The current cycle is `q2c2`** (Aug 3rd release). When the cycle changes, update the file path in Step 6 accordingly.
