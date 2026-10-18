---
name: deploy-preflight
description: Checks CLI auth, git-link, env vars, and test freshness before a production deploy. Use before vercel --prod/deploy or prod-branch pushes, or on "am I ready to deploy" / "why did the deploy fail".
---

# Deploy Preflight

Confirm a project is actually ready to deploy — not just that the deploy command exists — before running it.

## Steps

1. Identify which CLIs the project needs from its config files present (`vercel`, `turso`, `stripe`, `gh`).
2. For each required CLI:
   - Check it's installed (`where <cli>` on Windows).
   - Check it's actually authenticated, not just installed (`vercel whoami`, `turso auth whoami`, `gh auth status`, `stripe config --list`). Installed-but-logged-out is a common false "ready" signal — call it out explicitly.
3. Confirm Vercel git-link: `.vercel/project.json` exists and its `projectId` resolves via `vercel project ls`.
4. Invoke the `env-doctor` skill to confirm no required env var is missing/placeholder/leaked, in both local and prod.
5. Run the project's test command (e.g. Playwright e2e). Before trusting a pass, check whether test file mtimes predate the most recent feature-touching commit — a stale pass on tests untouched since before a feature change is not a real green light; flag it and recommend re-running against current code.
6. Confirm `git status` is clean and on the expected branch.
7. Report a single verdict: READY, or NOT READY with the specific blocking item(s) — never a vague "looks mostly fine".

## Notes

- On Windows, some CLIs (e.g. Turso's official installer) assume a Unix shell. If the install command fails outright because of that, say so and point at the alternative (WSL, scoop, or manual binary download) rather than retrying the same failing command.
- Never mark a project READY on assumption — every checklist item must be verified from an actual command output, not inferred from file presence alone.
