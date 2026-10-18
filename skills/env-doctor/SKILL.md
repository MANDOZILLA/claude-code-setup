---
name: env-doctor
description: Audits required vs present env vars locally and in production; flags placeholders and leaked secrets. Use before deploying, after time away, or on "what keys am I missing" / "check my env vars".
---

# Env Doctor

Audit a project's environment variables end to end: what's required, what's present, what's missing, and what's dangerously placeholder or leaked.

## Steps

1. Detect the stack: check `package.json`, `requirements.txt`, and any `.mcp.json` in the project or `~/.claude/.mcp.json`.
2. Build the required-variable list by grepping the codebase for `process.env.`, `os.environ`, `os.getenv(`, and any `env` blocks inside `mcpServers.*` entries. Record each variable with the file:line where it's referenced.
3. Check what's actually set:
   - Local: `.env`, `.env.local`, `.env.example`, current OS/session env
   - Production: if a Vercel project is linked (`.vercel/project.json` exists), run `vercel env ls` to list what's set in prod. For other hosts, ask the user how to check.
4. Flag placeholder patterns wherever a real value should be: `YOUR_.*_HERE`, `xxx+`, `sk_test_dummy`, `CHANGEME`, `TODO`.
5. Flag any literal secret sitting in a file that is not gitignored or that Claude reads directly as config (`.mcp.json`, a committed `.env`) — this is a security issue, not just a config gap. Report it prominently, separate from the missing-var table, and recommend rotating the credential at its source (not just editing the file) since it may already be exposed in edit-history backups or git history.
6. Output one table: `var | required by (file:line) | local status | prod status | flag (missing/placeholder/leaked)`.

## Notes

- Never print secret values in output, even when confirming they exist — show presence/absence and flags only.
- If no Vercel/hosting link is found, state that prod status couldn't be checked rather than guessing.
