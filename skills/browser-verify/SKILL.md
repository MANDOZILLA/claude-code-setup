---
name: browser-verify
description: "Verify UI changes in a browser: dev-server check, navigate, console read, screenshot. Use on \"test the site\", \"make sure everything works\", or after a frontend fix — not for Playwright test suites."
---

# Browser Verify

Standard loop for verifying web apps in a browser. Exists because ad-hoc browser testing here repeatedly hits three failure modes: testing against a stale dev server, CDP screenshot timeouts (renderer frozen), and the user hand-pasting console output across many turns.

## Tool choice

Prefer **agent-browser** (installed at `C:\Users\whyhe\tools\agent-browser`, loaded as plugin) over claude-in-chrome. claude-in-chrome's `Page.captureScreenshot` times out ~30s on heavy local dev pages — the single most frequent tool error in session history. Fall back to claude-in-chrome only when the task needs the user's logged-in Chrome session (OAuth flows, extensions).

## Workflow

### 1. Confirm the server serves CURRENT code

Before any browser step:

- Check the expected port answers: `curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>`
- Known ports: StockSense `3000`, OutreachHQ `5050`.
- If a listener exists but was started before the code change under test, restart it — Next.js dev servers frequently keep serving the pre-fix build, which wastes an entire verify cycle. The port-guard hook blocks double-starts; kill the old PID it reports first.

### 2. Drive the page

For each page/flow under test:

1. Navigate; wait for load (not fixed sleeps).
2. Read the browser console — errors here ARE the test result; capture them verbatim.
3. Interact (click/fill) per the checklist.
4. Screenshot only what needs visual confirmation.

### 3. Screenshot timeout handling

On a CDP screenshot timeout: do NOT retry the identical call more than once. Instead, in order: read page text/DOM (cheaper, usually sufficient), reload the tab, then switch tool (agent-browser ↔ claude-in-chrome). After 2–3 total failures, stop and report per the rabbit-hole rule.

### 4. Report

One line per checked item: `PASS`/`FAIL` + the exact console error when failing. Include reproduction steps for failures so the fix loop starts with a symptom, not "it doesn't work".
