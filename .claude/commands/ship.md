---
description: Commit, open a PR against main, merge it, then sync both remotes so Netlify redeploys.
---

# Ship

This command ships the current branch's changes through a PR on the internal repo, then syncs both remotes (internal EMU + public Netlify mirror) so the deploy is live.

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

## Done

Report:
- The PR URL
- That both repos are synced
- The Netlify deploy URL: `https://prospecting-strategy.netlify.app`

## Notes

- **No iteration logging.** Cycle documentation (iteration entries, screenshots) lives in the Team Home repo, not here. This `/ship` does not write iteration entries.
- **No build monitoring.** This is a standalone Vite prototype — there's no Blazar/CI pipeline to poll.
- **Both repos update from one push** because `origin` is configured with two push URLs. If that ever breaks, check `git remote get-url --push --all origin` — it should list both the EMU and public repo URLs.
