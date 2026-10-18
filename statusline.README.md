# statusline.js — 5-Hour Usage Bar

Reference notes for `~/.claude/statusline.js` and `~/.claude/hooks/usage_guard.py`.
Moved out of `~/.claude/CLAUDE.md` on 2026-08-13 — it's documentation, not
per-session guidance, and was costing ~600 est tokens every session in every project.

## How it works

Real automated tracking of the Pro/Max 5-hour usage window is possible as of
Claude Code v2.1.80 (March 2026): the `rate_limits` field (`five_hour` / `seven_day`,
each with `used_percentage` and `resets_at`) is natively populated on the JSON piped
to a `statusLine` command's stdin — the same live quota data `/usage` reads, not an
estimate. Confirmed working on this account/install (v2.1.219) on 2026-08-02.

**Live in the terminal:** `~/.claude/statusline.js` (wired via `settings.json` →
`statusLine`) renders it as a bar at the bottom:

```
5h [███░░░░░░░] 30%  ·  7d 61%
```

Color-coded green/yellow/red at the same 70/85 thresholds `usage_guard.py` uses.
It also writes `%LOCALAPPDATA%\claude-usage-guard\live.json` so hooks — which don't
receive the statusLine payload — can read the same live number.

**Proactive warnings:** `usage_guard.py` (`UserPromptSubmit`) reads that cache,
nudges at 70% / 85%, and auto-checkpoints at 85%.

## Known rough edges

From upstream GitHub issues, not hit on this account so far:

- `used_percentage` can briefly leak a raw epoch timestamp instead of `0`/`null`
  before real data exists early in a session. **Both scripts guard against this by
  rejecting any value > 100.**
- The field has been reported entirely absent on some Max-tier / org-scoped accounts.

## Superseded — do not resurrect

`ccusage`-based estimation diverged ~11 points / ~54 min from the real number
(confirmed 2026-07-22, then disabled). `-p "/usage"` just hallucinates a number.
Neither should ever be the data source again, now that the native field works.

An earlier version of this note claimed no automated tracking was possible at all.
That is no longer true.
