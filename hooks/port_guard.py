#!/usr/bin/env python3
"""PreToolUse hook on Bash|PowerShell: block starting a dev server when its port is already taken."""
import json
import re
import socket
import subprocess
import sys

DEFAULT_PORT = 3000


def port_owner(port):
    try:
        r = subprocess.run(
            f'netstat -ano -p tcp | findstr ":{port} "',
            shell=True, capture_output=True, text=True, timeout=10,
        )
        for line in r.stdout.splitlines():
            if "LISTENING" in line:
                return line.split()[-1]
    except Exception:
        pass
    return None


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    command = (data.get("tool_input") or {}).get("command", "") or ""

    if not re.search(r"\b(npm|pnpm|yarn)\s+run\s+dev\b|\bnext\s+dev\b", command):
        sys.exit(0)

    m = re.search(r"(?:--port|-p)[=\s]+(\d+)", command)
    port = int(m.group(1)) if m else DEFAULT_PORT

    try:
        with socket.create_connection(("127.0.0.1", port), timeout=1):
            busy = True
    except Exception:
        busy = False

    if not busy:
        sys.exit(0)

    pid = port_owner(port)
    pid_hint = f" (PID {pid} — `taskkill /PID {pid} /F`)" if pid else ""
    print(
        f"port-guard: port {port} already has a listener{pid_hint}. "
        "Kill the stale dev server first or pass a different --port, "
        "otherwise Next.js silently starts on another port and tests hit the old build.",
        file=sys.stderr,
    )
    sys.exit(2)


if __name__ == "__main__":
    main()
