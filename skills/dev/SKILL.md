---
name: dev
description: Start, restart, check, or babysit a dev server — health-check, monitoring, first-error triage. Use on "start dev", "is localhost still up", "npm run dev", or port-in-use/server-died situations.
---

# Dev Server Lifecycle

One entry point for every "start / check / it died" moment. Assumes Windows +
PowerShell, Next.js 14 App Router default, but works for any `npm run dev`-shaped
server.

## Ground rules

- **Never start a server in the foreground.** Always `run_in_background: true`.
  A foreground dev server blocks the session until timeout.
- **`port_guard.py` will block a start when the port already has a listener.**
  That is the hook working, not an error. Go to Phase 0 and resolve it.
- **Never report "server is running" from exit code alone.** A dev server that
  crashes on boot still exits 0 from the spawn. Only an HTTP response counts.

## Phase 0 — Is something already on the port?

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen -EA SilentlyContinue |
  Select-Object -First 1 OwningProcess |
  ForEach-Object { Get-Process -Id $_.OwningProcess } |
  Select-Object Id, ProcessName, StartTime
```

- **Nothing listening** → Phase 1.
- **Listening, and it's `node`** → probably last session's server. Health-check it
  (Phase 2) before killing anything. If it answers, you are done — say so and stop.
  Do not restart a working server.
- **Listening, not node** → report what owns it and ask before killing. Never
  `taskkill` a process you did not identify.

To free the port once the user confirms:
`Stop-Process -Id <pid> -Force`

## Phase 1 — Start

Find the right directory first — this monorepo has several package.json files
(`stock_sense/`, `outreachhq/`, `resturant_leads/`). Confirm which app before
starting, don't guess from cwd.

```
npm run dev
```
with `run_in_background: true`. Capture the task id.

## Phase 2 — Health-check (mandatory, never skip)

Poll until it answers or 60s elapses. Do not `sleep` blindly.

```powershell
$deadline = (Get-Date).AddSeconds(60)
do {
  try {
    $r = Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 3
    "UP $($r.StatusCode)"; break
  } catch { Start-Sleep -Milliseconds 1500 }
} while ((Get-Date) -lt $deadline)
```

Then read the background task output for the compiled/ready line AND for errors.
A 200 with a hydration error in the log is not healthy — report both.

## Phase 3 — Triage first error, if any

Route by shape, using the Build Warning Triage rules already in CLAUDE.md:

| Symptom | Almost always |
|---|---|
| `EADDRINUSE` | Phase 0 was skipped or a zombie survived |
| `Module not found` | lockfile out of sync → **blocking**, `npm ci` |
| `Cannot find module 'better-sqlite3'` | native rebuild for this Node version |
| Missing/placeholder env var | run `/env-doctor` — do not build around it |
| TypeScript error | **blocking**, fix before continuing |
| Peer-dep / deprecation warning | log and move on |

## Phase 4 — "Monitor it and make sure it's working"

When the user asks you to watch it (this phrasing recurs in their history):

1. Confirm UP via Phase 2 first — never start monitoring an unverified server.
2. Use `Monitor` with an until-condition on the health endpoint. Do **not**
   poll in a `sleep` loop and do **not** schedule short wakeups; the harness
   re-invokes on completion.
3. On death: capture the **last 40 lines** of task output, not the whole log,
   and go to Phase 3.

## Phase 5 — Report

State plainly, in this order:
1. URL + status code, or **DOWN** and why.
2. Which app/directory it's serving.
3. Any error or blocking warning found in the log — quote the line, not the log.

Never say "should be running now." Either it answered or it didn't.
