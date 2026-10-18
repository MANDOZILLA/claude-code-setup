# Defect catalog

Recurring UI/design defects whose *cause* is non-obvious from the symptom. Each
entry: what it looks like → why it happens → how to confirm → fix.

Ordered roughly by how often they appear and how easily they are missed.

---

## Layout & structure

### Sticky nav silently stops sticking on one page
**Symptom:** header sticks on most pages, scrolls away on one.
**Cause:** an ancestor has `overflow: hidden`. That makes it the sticky
containing block, so the nav sticks relative to a box that scrolls with the
page. Usually added to a page-root wrapper to contain a full-bleed hero.
**Confirm:** walk ancestors of the nav for any `overflow` that is not `visible`.
**Fix:** `overflow-x: clip`. It still clips horizontal bleed but does not create
a scroll container, so sticky survives. Do not just delete the overflow — it was
usually load-bearing against a hero that bleeds.

### A section intro is centred while its content grid is full width
**Symptom:** the kicker/heading/subcopy of a band start ~100-200px right of the
cards below them. Reads as sloppy but no single rule looks wrong.
**Cause:** the same element carries both a container class
(`width: min(100% - 3rem, 75rem); margin-inline: auto`) and its own
`max-width`. The narrower max-width wins, and `margin-inline: auto` then centres
that narrow box inside the parent.
**Confirm:** `sectionsWithRaggedLeftEdges` in `scripts/audit-page.js`.
**Fix:** remove the `max-width` from the container element; cap the measure on
its children instead (headings/paragraphs usually already have their own).

### Two stacked bands merge into one block
**Symptom:** a section and the next one (often the footer) read as a single
region divided by a stray hairline.
**Cause:** both resolve to the same background token. Very easy to miss in code
review because the two sides reference *differently named* tokens
(`--soft` vs a component's own default) that happen to be the same value.
**Confirm:** `adjacentSectionsSameBackground` in the probe.
**Fix:** alternate the band backgrounds. Check the footer explicitly — it is the
most common second half of the pair.

### Full-bleed band's content ignores the page measure
**Symptom:** one section's content starts at the very page edge while every
other section aligns to a shared gutter.
**Cause:** in many CSS-module systems only *some* class names carry the measure
(`width: min(100% - 3rem, 75rem); margin-inline: auto`); "band" classes supply
padding/background only and expect an inner container element.
**Fix:** wrap the band's children in the project's container div. Grep the
stylesheet for which selectors actually declare the measure before adding a new
section — do not assume.

---

## Typography

### Words run together in display headings
**Symptom:** "Knowyournext" — letters inside words look fine, but the gaps
between words vanish at large sizes.
**Cause:** aggressive negative tracking (`letter-spacing: -0.07em` and tighter).
`letter-spacing` shrinks the space character too, and the effect scales with
font-size, so it only shows on the biggest text.
**Confirm:** zoom a screenshot of the largest heading. It does not show in DOM
measurements — this one needs eyes.
**Fix:** ease tracking to about `-0.05em` and add `word-spacing: 0.12em–0.14em`.
That keeps the tight display look while restoring the word gap. Apply to every
display-size head, not just the one spotted.

### Text under ~11px
Flagged by the probe, but **not automatically a bug** — uppercase mono eyebrows
and legal microcopy at 10px are a legitimate editorial style. Treat as "review",
and only act when it is body copy or an interactive label.

---

## Interaction & accessibility

### Tap targets under 24×24 (WCAG 2.5.8)
Standalone links are the usual offenders: footer link columns (~21px), nav links
(~20px), and "arrow" CTAs like `See more →` (~22px).
**Fix:** `display: inline-flex; align-items: center; min-height: 24px;` plus
`width: fit-content` so the hit area does not span the whole column.
**Exempt:** links inline within a sentence. Do not pad those — it wrecks leading.
The probe already applies this exemption.

### Two inline buttons render on one line with no separator
**Symptom:** copy reads `Have a beta invite code?Referred by someone?`.
**Cause:** consecutive `<button>` elements are inline-level. Margin classes like
`mb-4` do nothing horizontally, so they butt together.
**Fix:** `block` (or a flex wrapper with a gap) on each.

### Missing h1 / heading starts at h2
Common on client-rendered pages where the visual title is a styled `<div>`.
**Fix:** promote the page's real main heading to `h1`, demote the card title to
`h2`. Check the framework resets heading margins (Tailwind Preflight does), or
the swap will shift layout.

### Public page links into an auth-gated route
**Symptom:** a marketing footer link bounces logged-out visitors to sign-in.
**Cause:** the route is listed in the auth middleware matcher.
**Confirm:** `curl -o /dev/null -D - <url>` logged out and look for a 302/307.
**Fix:** point at a public equivalent. When adding a *new* public page, remember
the middleware matcher is the auth-required list — adding the page there gates
it, which is the opposite of the intent.

---

## Media

### Video/image silently cropped
**Cause:** the declared `aspect-ratio` does not match the asset's true
dimensions, so `object-fit: cover` shaves the frame.
**Confirm:** `media[].croppedByObjectFit` in the probe compares the rendered box
aspect against `videoWidth/videoHeight` (or `naturalWidth/Height`).
**Fix:** set `aspect-ratio` to the asset's real ratio.

### Artifacts baked into a screen recording
**Symptom:** a scrollbar, cursor, browser chrome, or a half-cut card inside a
product demo. Looks like a CSS bug; is not.
**Confirm:** open the poster image / extract a frame
(`ffmpeg -ss N -i in.webm -frames:v 1 out.png`) and inspect the pixels.
**Fix:** crop the asset (`ffmpeg -vf "crop=W:H:X:Y"`), re-encode, crop the poster
identically, and update the declared aspect-ratio to match. Check whether the
recording scrolls before cropping vertically — content that leaves the frame
early in the video may matter later.
**Cleanup:** never leave `.bak` copies in a public/static directory; they ship.

---

## Copy that contradicts the product

Design audits should read copy against the code. These are cheap to find and
disproportionately damaging.

### CTA label promises the wrong action
`Pay now` on a button whose `href` is `/signup`, on a plan with a card-free
trial. **Fix:** label the actual next step (`Start free trial`).

### Marketing feature matrix disagrees with the entitlement config
Per-tier bullet lists implying different feature sets when the plan config
grants all paid tiers the same features and only varies a cap. Undersells cheap
tiers and oversells the top one.
**Confirm:** read the plan/entitlement constants; do not trust the marketing
component. **Fix:** derive the shared list from one constant.

### Unsubstantiated efficacy claims
e.g. "Cut waste by 30%" or "customers report $X saved", where the figure is
actually an *assumption* inside an ROI calculator and no customer data exists.
These hide in `metadata.description`, OpenGraph, Twitter cards, JSON-LD, and
`llms.txt` — grep all of them, not just visible page copy.
**Fix:** describe what the product does. Keep modelled numbers only where they
are explicitly labelled as an estimate.
**Never** resolve a "no social proof" gap by inventing testimonials, logos, or
review counts. Substitute verifiable claims instead — backtesting, data-handling
commitments from the actual privacy policy, cancellation terms backed by a real
billing portal — and say plainly that real proof needs real customers.

---

## Judgment items the probe cannot check

Look at rendered screenshots for these:
- vertical rhythm — unintentional dead space between bands
- a page that ends on a content block with no closing CTA
- one-off colours that ignore the design system (check whether it is a
  deliberate token with light/dark variants before calling it drift)
- contrast in **both** themes, especially text over images and tinted panels
- focus-visible styling on every interactive element
- logo/wordmark legibility at actual render size (a brand glyph shrunk to 20px
  and recoloured is often unrecognisable — prefer a wordmark)
