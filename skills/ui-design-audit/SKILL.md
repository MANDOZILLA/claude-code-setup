---
name: ui-design-audit
description: Audit a running web UI for design defects (layout, typography, spacing, breakpoints, theme, accessibility, copy). Use on audit, review, critique, or QA of a site's design, or before launch or deploy.
---

# UI / design audit

Audit a **running** UI and return a ranked list of defects, each with evidence.
Combine a machine probe (facts) with rendered screenshots (judgment). Neither
alone is sufficient: the probe cannot see ugly, and eyes miss a 21px tap target.

## When to use

Triggers: "audit the design", "review the UI", "what looks broken", "check the
landing page", "does this look right on mobile", pre-launch/pre-deploy visual
QA, or verifying a design change actually landed.

Not for: pure copywriting passes, brand/visual-identity creation, or
implementing a redesign from scratch.

## Before starting

1. **Confirm a server is running and note the base URL.** Audit a real render,
   never source alone. If nothing is running, start the dev server first.
2. **Enumerate the routes.** List the actual page files or the router config
   rather than guessing. Include legal/help pages — they are consistently the
   least maintained.
3. **Read `references/browser-tooling.md`.** It prevents the expensive mistakes:
   viewport emulation that silently does not reflow, blank screenshots that are
   capture races, and logged-in sessions producing false readings.
4. **Establish scope.** Public marketing pages, the authenticated app, or both.

## Workflow

### 1. Broad static sweep

Fetch every route and parse the HTML for `<title>`, meta description, `h1`
count, heading outline, `alt`, and empty links. Cheap, covers every page at
once. Treat results as provisional — client-rendered pages will under-report.

### 2. Probe each page

Navigate to the page, then run `scripts/audit-page.js` through an in-page
evaluator. It is not a node script: paste the file's IIFE as the evaluated
expression (`() => <contents>`), and read the returned JSON.

It reports horizontal overflow, elements bleeding past the viewport (ignoring
those correctly contained by a scrolling ancestor), sub-24px tap targets (with
the inline-in-sentence exemption applied), heading order, missing `alt`,
nameless links/buttons, adjacent sections sharing a background, ragged section
left edges, media cropped by `object-fit`, and text under 11px.

Run it across the full matrix — **360 / 768 / 1440 × light / dark × logged-out /
logged-in**. Several defects appear in exactly one combination.

### 3. Look at it

Screenshot each page at desktop and mobile, in both themes. Scroll through
rather than capturing only the top. Judge what the probe cannot: vertical
rhythm, dead space, missing closing CTA, contrast over images, off-system
colours, and word-spacing collapse in display headings.

### 4. Read the copy against the code

Check CTA labels against where they actually link, marketing feature tables
against the entitlement config, and efficacy claims against whether any data
exists. Grep `metadata`, OpenGraph, Twitter, JSON-LD, and `llms.txt` — claims
hide there long after the visible page is corrected.

### 5. Check console

Per page, filtered to errors and warnings. Verify an API-shaped error against
the route with `curl` before treating it as a code bug.

## Interpreting results

Consult `references/defect-catalog.md` whenever a symptom's cause is not
immediately obvious. It maps symptom → underlying cause → fix for the defects
that recur and are routinely misdiagnosed: `overflow:hidden` breaking sticky
positioning, centred-vs-full-width container mismatches, merged background
bands, negative tracking eating word gaps, cropped media, and copy that
contradicts the product.

Not every flag is a defect. Sub-11px uppercase mono eyebrows are a legitimate
editorial style; a one-off colour with documented light/dark variants is a
deliberate token, not drift. Check intent — read the token definition or the
surrounding comment — before reporting.

## Fixing

When asked to fix as well as report:

- Fix the **class**, not the instance. One display heading with collapsed word
  spacing means every display heading has it.
- Comment non-obvious fixes with the symptom they prevent, so the next person
  does not revert them.
- Leave deliberate decisions alone; report them as observations instead.
- Never invent social proof. See the catalog's note on this.
- Re-run the probe after fixing and confirm the specific finding is gone.

## Reporting

Rank by user impact: broken/misleading first, then accessibility, then polish.
For each: what is wrong, where (`file:line`), why it happens, and the evidence
(measured value or screenshot). State plainly which pages, viewports, themes,
and auth states were actually checked, and which were not — an audit that
overstates its coverage is worse than a short one.

## Validating the probe

A clean report is only meaningful if the detectors fire. To sanity-check, inject
a defect via a temporary `<style>` (force two adjacent sections to the same
background, or shift one section's first child by 240px), re-run the relevant
detector, confirm it reports, then remove the style and confirm it goes quiet.
