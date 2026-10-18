---
name: brain-sync
description: Saves the current session's key insights (decisions, files touched, problems solved, next steps) to a NotebookLM notebook. Use on /brain-sync or "save/sync/log this session to NotebookLM".
---

# Brain-Sync

Save a structured summary of the current Claude Code session to the user's "Claude Code Sessions" NotebookLM notebook. Each session becomes one searchable source in NotebookLM.

## Step 1: Generate Session Summary

Synthesize the current conversation into a structured markdown note. Be concise — this is a log entry, not documentation.

Use this template:

```
# [ProjectName] — YYYY-MM-DD HH:MM

## What Happened
- (3–5 bullets: key work done, features built, changes made)

## Files Touched
- path/to/file.ts — what changed
- (list only files actually created or meaningfully edited)

## Problems Solved
- (bugs fixed, blockers cleared, errors resolved — one line each)

## Key Insights
- (non-obvious discoveries: API quirks, config gotchas, architectural decisions, tool behaviors)

## Next Steps
- (open threads, follow-ups, anything explicitly left unfinished)
```

Infer **ProjectName** from the working directory name. If no project context exists, use "General".

Omit any section that has nothing to put in it. Don't pad.

## Step 2: Show Draft and Get Approval

Present the summary to the user in a fenced code block. Ask:

> "Save this to NotebookLM? Reply with **yes**, paste edits, or **cancel**."

If the user pastes edits or corrections, apply them and re-show the updated draft. Repeat until approved or cancelled.

If cancelled, stop — do not save.

## Step 3: Find or Create the Sessions Notebook

Check `C:\Users\whyhe\.claude\brain-config.json` for a saved `notebookId`.

**If the file exists and has a `notebookId`:** use it, skip to Step 4.

**If missing or no ID:**
1. Call the `notebook_list` tool from the `notebooklm-mcp` MCP server.
2. Search the results for a notebook titled exactly **"Claude Code Sessions"**.
3. If found: save its ID to `brain-config.json` as `{ "notebookId": "<id>" }`.
4. If not found: call `notebook_create` with `title: "Claude Code Sessions"`. Save the returned notebook ID to `brain-config.json`.

The `brain-config.json` path is `C:\Users\whyhe\.claude\brain-config.json`. Create it if it doesn't exist.

## Step 4: Add Source to NotebookLM

Call the `source_add` tool from the `notebooklm-mcp` MCP server with:
- `notebook_id`: the ID from Step 3
- `title`: `[ProjectName] YYYY-MM-DD HH:MM` (e.g. `"designmeter-local 2026-07-07 15:30"`)
- `content`: the approved summary markdown text
- `type`: `"text"` (inline text, not a URL)

## Step 5: Confirm

Report: **"Saved to NotebookLM: [title]"** — one line, done.

## Error Handling

| Error | Action |
|---|---|
| MCP tools not available / server not connected | Tell user: "Run `! nlm login` then restart Claude Code to activate the NotebookLM MCP server." |
| `notebook_create` fails | Tell user to verify NotebookLM is accessible at notebooklm.google, then retry. |
| Source limit reached (50 sources per notebook) | Create a new notebook named "Claude Code Sessions 2" (increment suffix as needed), update `brain-config.json` with the new ID. |
| `brain-config.json` has a stale/invalid notebook ID | Clear the ID, fall back to `notebook_list` search, re-run Step 3. |

## MCP Server Reference

The NotebookLM MCP server is registered as **`notebooklm-mcp`** in Claude Code. Tools are accessible as deferred tools — load them via ToolSearch before calling if not already in context:

```
ToolSearch: select:mcp__notebooklm-mcp__notebook_list,mcp__notebooklm-mcp__notebook_create,mcp__notebooklm-mcp__source_add
```
