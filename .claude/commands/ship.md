---
description: Commit, PR, merge — then mirror master to the public github remote so Netlify redeploys.
---

Commit all uncommitted changes with a concise message focused on WHY (not WHAT).
Then push the branch (set upstream if needed), open a PR against the workspace's
target branch (origin/master here) using `gh pr create`, and merge it with
`gh pr merge --merge`.

Skip remote build monitoring — this is a Vite prototype, no Blazar build.

After the merge, mirror master to the public GitHub remote so Netlify
picks up the change and triggers a fresh deploy:

    git push github origin/master:main

This is a fast-forward push of the just-merged tip — non-destructive.
Netlify watches `github.com/eoraghallaigh/sales-workspace-2` `main` and
builds on each push.
