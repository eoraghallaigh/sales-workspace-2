---
description: Freeze the current main tip as an immutable, date-named release-cycle branch deploy on Netlify.
---

# Lock cycle

Freezes the current `main` tip as a permanent, never-again-touched branch so it gets a stable
Netlify branch-deploy URL engineers can rely on for a release's scope. Use this once a cycle's
designs are locked in.

`main` (and the bare `prospecting-strategy.netlify.app`) stays the **live playground** — keep
iterating and `/ship`-ing there. A lock just snapshots that playground at a moment in time.

Usage: `/lock-cycle <release-date-slug>` — e.g. `/lock-cycle aug-3`.

The branch name is `$ARGUMENTS`. If it is empty, ask the user for the date slug (e.g. `aug-3`,
`sep-15`) and stop.

## Step 1 — Confirm clean, current main

The state we freeze is the current `main` tip (you iterate on main; locked = a snapshot of it):

```bash
git checkout main && git pull origin main
```

Confirm the working tree is clean (`git status`). If there are uncommitted changes the user wants
in the lock, tell them to `/ship` first, then stop.

## Step 2 — Refuse to clobber an existing lock

A locked cycle branch is immutable — re-pushing it would silently change a URL engineers treat as
fixed. Check it doesn't already exist:

```bash
git ls-remote --heads origin <branch>
```

If it already exists, STOP and warn the user. Only proceed past this if they explicitly say to
overwrite.

## Step 3 — Create the snapshot branch

```bash
git branch <branch> main
```

## Step 4 — Push to both remotes

`origin` has two push URLs (EMU + public Netlify mirror), so one push reaches both:

```bash
git push origin <branch>
```

No PR, no merge — a lock is an immutable snapshot ref, not a change to review.

## Done

Report:

- The frozen URL: `https://<branch>--prospecting-strategy.netlify.app` (Netlify builds it
  automatically once branch deploys are enabled — see prerequisite below).
- That this branch must **never** be pushed to again. For a byte-exact permanent snapshot, grab the
  deploy permalink from the Netlify deploy log (`https://<deploy-id>--prospecting-strategy.netlify.app`)
  — permalinks never change even if a branch is later touched.
- That the bare URL `prospecting-strategy.netlify.app` remains the live playground (`main`).

## Notes

- **One-time prerequisite.** Netlify → Site configuration → Build & deploy → Branches and deploy
  contexts → enable **Branch deploys** (All, or add each cycle branch). Without this, the pushed
  branch won't build. The existing `netlify.toml` and the `postbuild` 404 copy apply to branch
  deploys automatically.
- **Looking back** = the list of cycle branch deploys (`aug-3--…`, `sep-15--…`), each a live frozen
  artifact of what that release shipped.
