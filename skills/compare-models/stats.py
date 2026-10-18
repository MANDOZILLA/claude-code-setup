"""Aggregate ~/.agents/runs telemetry for two models. Read-only.

Usage: python stats.py <modelA> <modelB> [--since DAYS]
Matches case-insensitive substring against meta.model and meta.backend.
"""
import argparse, json, statistics, sys, time
from pathlib import Path

RUNS = Path.home() / ".agents" / "runs"
NON_TOOL_ITEMS = {"error", "agent_message", "reasoning", "user_message"}


def load_json(p):
    try:
        return json.loads(p.read_text(encoding="utf-8-sig"))
    except Exception:
        return None


def scan_events(p):
    """Return (tool_calls, tool_errors) for opencode and codex event streams."""
    calls = errs = 0
    try:
        lines = p.read_text(encoding="utf-8-sig", errors="replace").splitlines()
    except Exception:
        return 0, 0
    for line in lines:
        try:
            e = json.loads(line)
        except Exception:
            continue
        t = e.get("type")
        if t == "tool_use":  # opencode
            calls += 1
            if (e.get("part", {}).get("state", {}) or {}).get("status") == "error":
                errs += 1
        elif t == "item.completed":  # codex
            it = e.get("item", {})
            if it.get("type") not in NON_TOOL_ITEMS:
                calls += 1
                if it.get("exit_code") not in (None, 0):
                    errs += 1
    return calls, errs


def pct(vals, q):
    if not vals:
        return None
    vals = sorted(vals)
    return vals[min(len(vals) - 1, int(round(q * (len(vals) - 1))))]


def summarize(name, runs):
    timed = [(m["endedAt"] - m["startedAt"]) / 1000 for m, _ in runs if m.get("endedAt")]
    done = sum(1 for m, _ in runs if m.get("status") == "done")
    failed = sum(1 for m, _ in runs if m.get("status") == "failed")
    calls, errs = [], 0
    for _, d in runs:
        c, er = scan_events(d / "events.jsonl")
        calls.append(c)
        errs += er
    tiers = {}
    for m, _ in runs:
        tiers[m.get("tier", "?")] = tiers.get(m.get("tier", "?"), 0) + 1
    recent = sorted(runs, key=lambda r: r[0].get("startedAt", 0), reverse=True)
    return {
        "query": name,
        "runs": len(runs),
        "models_matched": sorted({m.get("model", "?") for m, _ in runs}),
        "done": done,
        "failed": failed,
        "fail_pct": round(100 * failed / len(runs), 1) if runs else None,
        "secs_median": round(statistics.median(timed), 1) if timed else None,
        "secs_p90": round(pct(timed, 0.9), 1) if timed else None,
        "tool_calls_median": statistics.median(calls) if calls else None,
        "tool_errors_total": errs,
        "tiers": tiers,
        "titles": [m.get("title") for m, _ in recent[:5]],
        "summary_paths": [str(d / "summary.txt") for _, d in recent[:3] if (d / "summary.txt").exists()],
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("a")
    ap.add_argument("b")
    ap.add_argument("--since", type=float, default=None, help="only runs from last N days")
    args = ap.parse_args()
    if not RUNS.exists():
        sys.exit(f"no runs dir: {RUNS}")
    cutoff = (time.time() - args.since * 86400) * 1000 if args.since else 0
    metas = []
    for d in RUNS.iterdir():
        m = load_json(d / "meta.json") if d.is_dir() else None
        if m and m.get("startedAt", 0) >= cutoff:
            metas.append((m, d))
    out = {}
    for q in (args.a, args.b):
        ql = q.lower()
        hit = [(m, d) for m, d in metas if ql in str(m.get("model", "")).lower() or ql in str(m.get("backend", "")).lower()]
        out[q] = summarize(q, hit)
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
