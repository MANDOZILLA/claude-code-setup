#!/usr/bin/env python3
"""UserPromptSubmit hook: silent early-warning for the Anthropic Pro 5-hour
usage window, using the real `rate_limits.five_hour` reading Claude Code
exposes to statusLine scripts (native since CLI v2.1.80).

Hooks don't get the statusLine JSON payload directly, so `statusline.js`
(the statusLine command configured in settings.json) writes a small cache
file each time it renders; this hook just reads that cache. This replaced
a `ccusage`-based version (retired 2026-07-22) that estimated usage from
local transcript logs and diverged ~11 points / ~54 min from the real
`/usage` number -- this version reads the same live quota `/usage` does.

Fails open on any error (cache missing, stale, bad JSON, etc.) -- never
blocks the user's prompt.
"""
import json
import os
import subprocess
import sys
import time

CACHE_DIR = os.path.join(os.environ.get("LOCALAPPDATA", ""), "claude-usage-guard")
CACHE_PATH = os.path.join(CACHE_DIR, "state.json")
LIVE_CACHE_PATH = os.path.join(CACHE_DIR, "live.json")
MEASURE_PY = r"C:\Users\whyhe\.agents\skills\token-optimizer\scripts\measure.py"

# statusline.js refreshes this cache at least every 30s (settings.json
# refreshInterval) plus on every turn -- treat anything older as "no active
# session rendering right now" rather than trusting a stale number.
LIVE_CACHE_MAX_AGE_SEC = 120
WARN_PCT = 70
CRITICAL_PCT = 85
WARN_REANNOUNCE_SEC = 1200  # re-show user banner every 20 min while warn
CRITICAL_REANNOUNCE_SEC = 600  # every 10 min while critical
CRITICAL_CHECKPOINT_COOLDOWN_SEC = 900  # don't re-checkpoint more than every 15 min

WARN_INSTRUCTION = (
    "[usage-guard] Heads up: you're at ~{pct:.0f}% of the current Pro 5-hour usage "
    "window (~{mins} min until it resets). This is the real quota reading from Claude "
    "Code's own rate_limits field. Tell the user now, in plain language -- don't bury "
    "it in the response. If the user is about to start something that looks like many "
    "tool calls or a long task, mention this risk before starting, not mid-task. No "
    "need to checkpoint yet."
)
CRITICAL_INSTRUCTION = (
    "[usage-guard] CRITICAL: ~{pct:.0f}% of the current Pro 5-hour usage window used "
    "(~{mins} min left, real quota reading). Tell the user now, plainly. Finish only "
    "the current atomic step -- don't start a new large sub-task. At the next safe "
    "stopping point: a checkpoint was likely already auto-captured via "
    "`measure.py compact-capture --trigger usage-critical`; if it didn't fire, run it "
    "yourself. Then give the user, in chat, a short resume plan: what's done, what's "
    "left, and the exact prompt to paste in a new session after the window resets. "
    "Prefer stopping clean over getting cut off mid-tool-call."
)


def load_state():
    try:
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_state(state):
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        tmp = CACHE_PATH + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(state, f)
        os.replace(tmp, CACHE_PATH)
    except Exception:
        pass


def query_live_cache():
    """Returns dict {percent, minutes_left, block_id} or None if the cache
    is missing, stale, or malformed (including: no session has rendered a
    statusLine recently, so there's nothing fresh to report)."""
    try:
        with open(LIVE_CACHE_PATH, "r", encoding="utf-8") as f:
            live = json.load(f)
        now = time.time()
        if now - live.get("updated_at", 0) > LIVE_CACHE_MAX_AGE_SEC:
            return None
        percent = live.get("five_hour_pct")
        resets_at = live.get("five_hour_resets_at")
        if percent is None or resets_at is None:
            return None
        minutes_left = max(0, round((resets_at - now) / 60))
        return {
            "percent": float(percent),
            "minutes_left": minutes_left,
            "block_id": resets_at,  # changes when a new 5h window starts
        }
    except Exception:
        return None


def severity(level):
    return {"ok": 0, "warn": 1, "critical": 2}[level]


def should_show_banner(state, now, level):
    prev = state.get("prev_announced_level", "ok")
    if severity(level) > severity(prev):
        state["prev_announced_level"] = level
        state["last_announce_ts"] = now
        return True
    interval = CRITICAL_REANNOUNCE_SEC if level == "critical" else WARN_REANNOUNCE_SEC
    if now - state.get("last_announce_ts", 0) >= interval:
        state["last_announce_ts"] = now
        return True
    return False


def maybe_trigger_checkpoint(state, now, hook_stdin_bytes):
    if now - state.get("last_checkpoint_ts", 0) < CRITICAL_CHECKPOINT_COOLDOWN_SEC:
        return
    try:
        subprocess.run(
            ["python3", MEASURE_PY, "compact-capture", "--trigger", "usage-critical", "--quiet"],
            input=hook_stdin_bytes,
            text=True,
            timeout=20,
            capture_output=True,
        )
        state["last_checkpoint_ts"] = now
    except Exception:
        pass  # fail open -- CLAUDE.md instructs Claude to run it manually as a fallback


def main():
    try:
        raw = sys.stdin.read()
        now = time.time()
        state = load_state()

        fake_pct = os.environ.get("USAGE_GUARD_FAKE_PERCENT")
        if fake_pct is not None:
            state.update({
                "percent": float(fake_pct),
                "minutes_left": 42,
                "block_id": "debug-block",
            })
        else:
            fresh = query_live_cache()
            if fresh is not None:
                if fresh.get("block_id") != state.get("block_id"):
                    # new 5h block started (or first reading) -- reset announce state
                    state["prev_announced_level"] = "ok"
                    state["last_announce_ts"] = 0
                state.update(fresh)
            else:
                # no live reading available right now -- clear stale reading
                state.pop("percent", None)
            save_state(state)

        percent = state.get("percent")
        if percent is None:
            sys.exit(0)  # silent -- no usable reading, or between blocks

        level = "critical" if percent >= CRITICAL_PCT else "warn" if percent >= WARN_PCT else "ok"
        if level == "ok":
            save_state(state)
            sys.exit(0)  # silent, per requirement

        mins_left = state.get("minutes_left")
        show_banner = should_show_banner(state, now, level)

        if level == "critical":
            maybe_trigger_checkpoint(state, now, raw)
            instruction = CRITICAL_INSTRUCTION.format(pct=percent, mins=mins_left)
            banner = (
                f"USAGE WARNING: ~{percent:.0f}% of your Pro 5h window used "
                f"(~{mins_left} min left). Nearing the point this session could get cut off."
            )
        else:
            instruction = WARN_INSTRUCTION.format(pct=percent, mins=mins_left)
            banner = (
                f"Usage check: ~{percent:.0f}% of your Pro 5h window used "
                f"(~{mins_left} min left). Flagging early, plenty of room still."
            )

        save_state(state)
        out = {
            "hookSpecificOutput": {
                "hookEventName": "UserPromptSubmit",
                "additionalContext": instruction,
            }
        }
        if show_banner:
            out["systemMessage"] = banner
        print(json.dumps(out))
    except Exception:
        pass  # fail open, no matter what
    sys.exit(0)


if __name__ == "__main__":
    main()
