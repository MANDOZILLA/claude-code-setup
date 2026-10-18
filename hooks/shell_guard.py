#!/usr/bin/env python3
"""PreToolUse hook on Bash: block PowerShell cmdlets sent to the bash shell (exit 127 loop killer)."""
import json
import re
import sys

CMDLET = re.compile(
    r"\b(Select-Object|Where-Object|ForEach-Object|Get-ChildItem|Get-Content|"
    r"Set-Content|Out-File|Get-Process|Stop-Process|Test-Path|New-Item|"
    r"Remove-Item|Measure-Object|ConvertTo-Json|ConvertFrom-Json|Start-Sleep)\b"
)


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    command = (data.get("tool_input") or {}).get("command", "") or ""
    m = CMDLET.search(command)
    if not m:
        sys.exit(0)

    print(
        f"shell-guard: `{m.group(1)}` is a PowerShell cmdlet but this is the Bash tool "
        "(Git Bash). Use the PowerShell tool for cmdlets, or the bash equivalent here.",
        file=sys.stderr,
    )
    sys.exit(2)


if __name__ == "__main__":
    main()
