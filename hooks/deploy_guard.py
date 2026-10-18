#!/usr/bin/env python3
"""PreToolUse hook on Bash: block vercel prod deploys that would fail on auth/CLI."""
import json
import re
import subprocess
import sys


def sh(cmd):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=15)
        return r.returncode, (r.stdout + r.stderr)
    except Exception as e:
        return 1, str(e)


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    command = (data.get("tool_input") or {}).get("command", "") or ""

    if not re.search(r"\bvercel\b.*(--prod\b|\bdeploy\b|\bpromote\b)", command):
        sys.exit(0)

    rc, _ = sh("where vercel")
    if rc != 0:
        print(
            "deploy-preflight: vercel CLI not found on PATH. Install it before deploying.",
            file=sys.stderr,
        )
        sys.exit(2)

    rc, out = sh("vercel whoami")
    if rc != 0:
        print(
            f"deploy-preflight: vercel auth check failed:\n{out}\nRun `vercel login` before deploying.",
            file=sys.stderr,
        )
        sys.exit(2)

    # Manual `vercel --prod` / `vercel promote` calls are how the stock_sense
    # black/orange theme kept flip-flopping (2026-07-23): whichever branch
    # happened to be checked out locally got pushed straight to production,
    # overwriting whatever the main-only GitHub Actions bot
    # (.github/workflows/deploy.yml) had deployed. `promote` closed a second
    # hole the same day: it re-aliases production to an arbitrary existing
    # deployment (no --prod flag, so it wasn't caught by the first check) and
    # is exactly what was used to re-flip production earlier that day.
    # The Vercel project has no Git integration (repo owner can't connect it),
    # so there's no platform-level Production Branch setting to rely on
    # instead — this hook is the only real guardrail. Only production-facing
    # commands are blocked; preview deploys (`vercel deploy` with no --prod)
    # are unaffected.
    is_prod_deploy = re.search(r"--prod\b", command) and not re.search(r"\b(build|pull)\b", command)
    is_promote = re.search(r"\bpromote\b", command)
    if is_prod_deploy or is_promote:
        rc, toplevel = sh("git rev-parse --show-toplevel")
        rc2, remote = sh("git remote get-url origin")
        if rc == 0 and rc2 == 0 and "Stock-Sense-Suite" in remote:
            rc3, branch = sh("git rev-parse --abbrev-ref HEAD")
            branch = branch.strip()
            if rc3 == 0 and branch != "main":
                verb = "vercel promote" if is_promote else "vercel --prod"
                print(
                    f"deploy-preflight: refusing manual `{verb}` from branch "
                    f"'{branch}' in Stock-Sense-Suite.\n"
                    "Production deploys for this repo go through "
                    ".github/workflows/deploy.yml (push-to-main only) because the "
                    "Vercel project has no Git integration to enforce a Production "
                    "Branch setting. Push your change to main and let the workflow "
                    "deploy it, or run `git checkout main` first if you intend to "
                    "deploy or promote main's current tip.",
                    file=sys.stderr,
                )
                sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    main()
