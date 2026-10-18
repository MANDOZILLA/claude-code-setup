---
name: orchestrate
description: Main session plans and delegates independent research/review/audit lanes or multi-file builds to cheaper models, then verifies and synthesizes. Use when a task splits into parallel independent lanes.
---

# Orchestrate — strong model commands weaker ones

Main session = judgment only: decompose, write mandates, adjudicate, synthesize. Never grind, never pull raw dumps into main context.

## Route by shape
- Single-file edit / one lookup / tightly coupled design → do it yourself. No delegation.
- Independent research / audit / review lanes → **fan-out** (below).
- Multi-file feature → **build** (below).

## Tier map (user's delegation order, not Anthropic models)
| tier | job | dispatch |
|------|-----|----------|
| top | orchestrate, judge, decide | this session |
| high | verify/review writer's work, hardest territories | `opencode-subagent.ps1 -Tier strong`, or `codex exec` (different provider = independent check) |
| mid | default executor: code, searches, mechanical edits | `-Tier standard` |
| fast | mindless bulk sweeps, greps, censuses | `-Tier fast` |

Dispatch: `C:\Users\whyhe\.agents\bin\opencode-subagent.ps1 -Tier <t> "<mandate>"` (router picks a free model per task; needs `ARTIFICIAL_ANALYSIS_API_KEY`). Fallback order: Codex → native Claude subagents (say so + why). Failures are expected: note, move on, no retry loops.

Rules:
- **Verify with a different/stronger tier than the writer.** Prefer a different provider (OpenCode writes → Codex or `-Tier strong` reviews).
- Fast tier never computes a number someone acts on.
- Same-provider parallelism = several routed calls at the same tier; cross-provider = OpenCode + Codex side by side on the same question for a second opinion.

## Fan-out
1. Decompose into independent questions, one lane each. Launch all in ONE message (parallel `run_in_background` Bash/PowerShell calls).
2. Read-only lanes are free; anything running builds/tests/typecheck/browsers/dev servers = ONE at a time globally (a lane that holds the mutex says so in its report).
3. Each lane writes its report to disk (`<scratchpad>\orch\<lane>.md`), **line 1 = `VERDICT: <word>`** (or `DONE` / `FAILED: ...`). Lane returns ≤10 lines + path.
4. Fan-in: read verdict lines only; open failed/surprising reports; adjudicate conflicts yourself. A confirmed absence is a real result — don't re-run hoping for a positive.

## Build (multi-file)
1. You write the spec + pinned contracts (types, route shapes, file list) FIRST.
2. Disjoint file territories: one builder per territory, mid tier (`standard`), told which files it may touch and which it must not. `--auto` mode edits freely — territory discipline is the only guard.
3. Reviewer = different provider or `strong`, given an attack brief ("find ways this breaks X"), writes `VERDICT: PASS|NEEDS_FIXES`.
4. One integrator runs tsc/lint/tests once (the mutex). Builders never run production builds.
5. You hold the ship gate: read verdicts, spot-check diff, then `/ship` if asked.

## Mandate checklist (every delegated prompt)
- Absolute paths, not summaries; repo root stated (Path Discipline).
- Explicit NOT-list (files/dirs/actions off-limits: no git commit/push, no deletes, no `.env` reads, no kill-by-name, no starting servers on unlisted ports).
- Evidence format: file:line quotes, command output tails.
- Negative results authorized ("not found" is a valid answer; do not invent).
- Report path + line-1 verdict + termination: "stop after writing the report".
- Verbatim line: *If any command is denied by a permission prompt, stop that step and report it; never route around it.*

## Pacing
State an ETA at spawn. Slow past 1x ETA → check report/log; past 2x → kill that one PID (never by name), respawn tighter or one tier up. Sunk cost doesn't justify waiting.

## Don't
Hand-orchestrate what one agent can do; split coupled design across agents; trust a delegate's prose over its evidence; let a lane's "Done." substitute for reading its report.
