# Driving the browser for a UI audit

Hard-won behaviour of the browser tooling on this machine. Reading this first
avoids the failure modes that cost the most time.

## Pick the right tool for the job

Two independent stacks are usually available. They are good at different things.

| Need | Use |
|---|---|
| True viewport / device emulation | **chrome-devtools MCP** `emulate` |
| Running the audit probe, reading computed styles | **chrome-devtools MCP** `evaluate_script` |
| Reliable repeat screenshots | **chrome-devtools MCP** `take_screenshot` (`fullPage` supported) |
| Console + network inspection | either |
| Driving the user's own logged-in session/profile | **claude-in-chrome** |

Default to chrome-devtools MCP for auditing. Reach for claude-in-chrome when the
audit must run against the user's real session or real browser profile.

## Viewport emulation

**`resize_window` (claude-in-chrome) does not reflow the page.** It resizes the
OS window; the captured page keeps its previous layout, and it floors at roughly
485px wide, so a phone breakpoint can never be reached that way.

Use chrome-devtools MCP instead:

```
emulate  viewport: "360x740x3,mobile,touch"    # phone
emulate  viewport: "768x1024x2,touch"          # tablet
emulate  viewport: "1440x900x1"                # desktop
```

Confirm it took effect by reading `document.documentElement.clientWidth` back
inside the probe rather than trusting the tool's response — the probe reports
`viewport` for exactly this reason.

## Screenshots

- **A blank/solid-colour screenshot is almost always a capture race**, not a
  broken page. Wait ~1-2s and retake before concluding anything. Confirm with
  `evaluate_script` reading real geometry.
- CDP `Page.captureScreenshot` intermittently times out (~30s). Just retry; it
  usually succeeds on the second or third attempt.
- After a `zoom`-style action, claude-in-chrome may keep returning a clipped
  capture at the zoom region's size. Fix by taking a fresh full screenshot or a
  new tab.
- `Failed to deserialize params.clip.scale` from claude-in-chrome means the tab
  group is wedged. Close **every** tab in the group (the group auto-removes when
  empty), then `tabs_context_mcp { createIfEmpty: true }` for a clean one.

## Auth state poisons results

A logged-in session silently redirects `/signin` and `/signup`, so an audit of
those pages measures a "Redirecting…" stub and reports nonsense such as
`h1Count: 0`.

- Always record which auth state each observation came from.
- Audit public pages logged **out**.
- To get a clean logged-out context in chrome-devtools MCP, open the page with
  `new_page` using `isolatedContext: "<name>"`.
- Conversely, a logged-in session is the only way to audit the authenticated
  app — do both passes deliberately rather than by accident.

## Static HTML vs rendered DOM

Fetching a URL and parsing the HTML is fast and good for sweeping many pages for
`<title>`, meta description, heading outline, and `alt`. It **misses everything
client-rendered**, which on an SPA/App-Router app can be the entire page body.

Use `fetch()` + `DOMParser` for the broad sweep, then navigate to each page and
run the probe for anything layout-, size-, or style-dependent.

Rendering fetched HTML into an offscreen `<iframe srcdoc>` to batch-measure many
pages at once works but is flaky — scripts and fonts may not settle, and some
pages return null documents. Prefer real navigation per page.

## Console

Check console per page after navigation, filtered to errors/warnings.

An error like next-auth `CLIENT_FETCH_ERROR ... Unexpected token '<'` means an
API route returned an HTML error page instead of JSON. Before hunting for a code
bug, curl the route directly — a crashed dev-server worker
(`Jest worker encountered N child process exceptions`) produces exactly this and
is fixed by restarting the dev server, not by editing code.

## Coverage checklist per page

Run the matrix, not just the happy path:

- viewports: 360, 768, 1440
- themes: light **and** dark (toggle via the app's own control, and separately
  via `emulate colorScheme` to test the system-preference path)
- auth: logged out **and** logged in
- states: default, hover/focus on primary CTAs, expanded accordions/toggles,
  and any form with a field revealed by a disclosure toggle
