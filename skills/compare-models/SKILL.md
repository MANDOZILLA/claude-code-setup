---
name: compare-models
description: Compares two delegated agent models (OpenCode free models, Codex, native Claude) on agentic-coding speed, reliability, and code quality, then prints a strengths/weaknesses table and picks the better one per task type. Use on "compare X vs Y", "which agent/model is better", "benchmark my subagents", "who should I delegate this to".
---

# Compare Models

Orchestrator (this session) judges two delegate models using run telemetry + optional live head-to-head. Invoke: `/compare-models <A> vs <B> [task]`.

## Steps
1. **Parse** `A`, `B` (free text: `mimo`, `codex`, `opencode/glm`, `claude`) and optional task. Missing one name: ask once.
2. **Numbers** (never read raw `events.jsonl` into context):
   `python -I ~/.claude/skills/compare-models/stats.py "<A>" "<B>" [--since DAYS]`
   Gives runs, done/failed, median/p90 secs, median tool calls, tool errors, tier mix, recent titles, 3 `summary_paths`. Zero runs matched = say "no data for X", never invent.
   Caveat: `done + failed < runs` means stale `running` entries (crashed/killed); report them as unfinished, not as successes.
3. **Quality signals**: Read only the `summary_paths` (≤3 per model, first ~40 lines). Look for: line-1 `VERDICT:` present (instruction-following), file:line evidence cited, paths that don't exist (hallucination), later-contradicted verdicts, FAILED/partial reports, invented findings.
4. **Live test (only if a task was given)**: send the SAME self-contained prompt to both in parallel (`run_in_background`), each writing `<scratchpad>\cmp\<model>.md` with line-1 `VERDICT:`.
   - OpenCode: `C:\Users\whyhe\.agents\bin\opencode-subagent.ps1 -Tier <fast|standard|strong> "<prompt>"` (router picks the model; if user named a specific one and the router can't honor it, say so).
   - Codex: `C:\Users\whyhe\.agents\bin\codex-subagent.ps1 "<prompt>"`. Failure (auth/quota) is expected: note it, no retry loop.
   - Native Claude only as a stated fallback or if the user named a Claude model.
   - Mandate must include NOT-list (no commits/deletes/.env), absolute paths, "not found is valid". Time each from run `meta.json`. Judge outputs yourself against the task: correctness, completeness, evidence, diff size/cleanliness.
5. **Table** (one, compact):

   | | A | B |
   |---|---|---|
   | Speed (median / p90 s) | | |
   | Reliability (fail %, tool errors) | | |
   | Code quality | | |
   | Instruction-following / evidence | | |
   | Tool-use efficiency (calls/run) | | |
   | Strengths | | |
   | Weaknesses | | |
   | Sample / confidence | n runs, history/live | |

6. **Verdict by task type**: bulk sweeps/search, implementation, review/audit, hard debugging -> pick A, B, or tie, one line why each. End with **Claude's pick** (single overall recommendation + routing advice, e.g. "B writes, A reviews").

## Rules
- Speed and reliability = measured numbers. Quality = your judgment: label it subjective.
- <5 runs for a model = flag low confidence. Different tiers/tasks across the two models = say the comparison is not apples-to-apples.
- Fast tier never computes numbers someone acts on (see `orchestrate`).
- Caveman speech; reference paths, don't dump logs.
