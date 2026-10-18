#!/usr/bin/env python3
"""PostToolUse hook on Bash: advisory banner for blocking-class build warnings."""
import json
import re
import sys

BLOCKING_PATTERNS = [
    r"lockfile",
    r"EBADENGINE",
    r"error TS\d+",
    r"failed migration",
    r"Module not found",
]


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    command = (data.get("tool_input") or {}).get("command", "") or ""
    if not re.search(r"\b(npm|pnpm)\s+run\s+(dev|build)\b", command):
        sys.exit(0)

    output = ""
    for key in ("tool_response", "tool_output", "output", "result"):
        val = data.get(key)
        if isinstance(val, str):
            output += val
        elif isinstance(val, dict):
            output += json.dumps(val)

    hits = [pat for pat in BLOCKING_PATTERNS if re.search(pat, output, re.IGNORECASE)]
    if hits:
        print(
            "BUILD WARNING TRIAGE - blocking-class issue detected ("
            + ", ".join(hits)
            + "). See CLAUDE.md 'Build Warning Triage' before continuing.",
            file=sys.stderr,
        )

    sys.exit(0)


if __name__ == "__main__":
    main()
