---
name: session-triage
description: Returns one verdict on whether to /compact, /clear, or keep going, plus a resume prompt. Use on "should I compact or clear", "is this session cooked", "should I start fresh", or /session-triage.
---

# Session Triage

Evaluate THIS conversation and give exactly one verdict. The user invokes this when unsure what to do — answer must be a decision, not a menu.

## Step 1: Assess the session (do this silently, from the conversation itself)

Score these signals:

1. **Context pressure** — how deep is this conversation? Signs of high pressure: harness low-context warnings, an earlier auto-compaction summary at the top, dozens of tool calls with big outputs (file dumps, console logs, screenshots).
2. **History value for the NEXT thing** — does the next task the user wants depend on state established here (file locations already found, a fix mid-flight, a plan in progress)? If unknown, ask the user the single question: "what do you want to do next?" — it decides everything.
3. **Noise ratio** — retry loops, dead-end explorations, pasted logs that no longer matter. High noise + low task relevance = history is a liability, not an asset.
4. **Task state** — mid-task (uncommitted changes, half-applied fix) vs. natural boundary (just shipped, just answered).

## Step 2: Verdict table

Pick the FIRST row that matches:

| Situation | Verdict |
|---|---|
| Mid-task, context not under pressure | **Continue** — do nothing, keep working |
| Mid-task, context under pressure, history holds needed state | **`/compact`** — summary preserves the state; best before a long next phase |
| Next task is UNRELATED to this session's history | **`/clear`** — wipes context in place; cheapest fresh start; claude-mem still remembers this session |
| Session polluted by long retry loops / huge pasted logs, even if same task | **`/clear` + resume prompt** — a clean restatement beats a compacted transcript of failures |
| Need a different working directory / different project | **New session** in that folder (`claude` from the project root) — CLAUDE.md and project skills load correctly there |

Rules of thumb: `/clear` beats a new session in almost all cases (same effect, less friction). `/compact` is only worth it when the history genuinely contains state that would be expensive to re-derive — compacting a session full of failed attempts just summarizes the failure.

## Step 3: Output

1. **Verdict line**: the command to type (or "keep going"), one sentence why.
2. **If leaving (`/clear` or new session): write the resume prompt FIRST** — a paste-ready block containing: current goal, exact file paths touched (with line numbers where relevant), what was tried and failed (one line each, so the next session doesn't repeat them), uncommitted-changes status (`git status` if unsure), and the single next step. Put it in a fenced code block the user can copy.
3. **If mid-task with uncommitted changes and verdict is leave**: warn to commit or stash first (offer `/ship` if the work is done).

Never output the whole decision table to the user — they asked for a decision.
