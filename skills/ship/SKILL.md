---
name: ship
description: Full stage -> commit -> push -> verify-deploy loop with common failure fixes. Use on "commit and push", "push this", "ship it", "commit this", or wanting changes pushed and confirmed live.
---

# Ship

One-command commit → push → verify pipeline. Replaces the manual "commit and push" back-and-forth and auto-recovers from the push failures that recur in this environment.

## Workflow

Run every step with `git -C "<repo-root>"` — never rely on the shell's current directory (nested monorepo folders like `stock_sense/` inside `Stock-Sense-Suite-cloned/` have caused repeated wrong-directory failures).

### 1. Pre-flight

```bash
git -C "<root>" status --porcelain
git -C "<root>" branch --show-current
```

- Nothing to commit and nothing unpushed → report "already shipped" and stop.
- Detached HEAD or unexpected branch → stop and tell the user which branch is checked out before committing anything.

### 2. Stage + commit

- Stage all changes unless the user scoped the request to specific files.
- Write a concise conventional message from the actual diff (`git diff --stat` for scope). Never `--amend` an already-pushed commit.

### 3. Push with auto-recovery

Attempt `git push`. On failure, match the error and recover — one retry per cause, then stop and report:

| Error | Recovery |
|---|---|
| `! [rejected] ... (fetch first)` | `git pull --rebase`, then push again |
| `cannot pull with rebase: You have unstaged changes` | commit happened in step 2, so this means new files appeared mid-run — `git stash -u`, rebase, `git stash pop`, push |
| `CONFLICT ... package-lock.json` | take local `package.json` side, regenerate lock with `npm install --package-lock-only`, `git add`, `git rebase --continue` |
| Any other conflict | stop; show conflicted files; do NOT auto-resolve source conflicts |
| auth failure | stop; tell user to check `gh auth status` / credential manager |

### 4. Verify deploy (only when repo is Vercel-linked)

If `.vercel/project.json` exists or the user asked "make sure it goes through to Vercel":

```bash
vercel ls --limit 3
```

Confirm a new deployment appeared for the pushed commit SHA and report its state (Building/Ready/Error). If Error, fetch build logs (`vercel inspect --logs <url>`) and summarize the failure — do not just say "pushed".

### 5. Report

Single line per outcome: commit SHA, branch, push status, deploy status (or "no Vercel link — push only").
