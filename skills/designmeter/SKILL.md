---
name: designmeter
description: Score a website's UI/UX and detect "AI slop" using the local DesignMeter clone. Use on "score this site", "rate this design", "is this AI slop", or benchmarking against expert sites.
---

# DesignMeter — local UI/UX scorer with an expert-SaaS reference brain

A locally-runnable tool that screenshots a URL (full-page desktop + mobile), scores 10 UI/UX KPIs with
a Groq vision model, detects generic AI-slop, and measures visual proximity to a curated, growing set
of expert SaaS sites (Stripe, Linear, Vercel, Figma, Notion…). The expert benchmark runs on a **local
CLIP model** — no API, fully offline, user-controlled.

**Project location:** `C:\Users\whyhe\Downloads\designmeter-local`
Always run the commands below **from that directory**.

## Prerequisites (already set up — verify only if a command fails)
- `GROQ_API_KEY` is in `.env.local` (auto-loaded by the scan script). Get one at https://console.groq.com/keys.
- The expert reference index is built (~19 SaaS sites) in `data/designmeter.db`. If a scan returns no
  `expertProximity`, rebuild it: `npm run reference:build`.
- Deps installed (`npm install` once). First scan downloads a ~350MB CLIP model to the HF cache.

## Scan a site (headless — no dev server needed)
```bash
cd /c/Users/whyhe/Downloads/designmeter-local
npm run scan -- https://example.com            # prints scored JSON
npm run scan -- https://example.com --full     # + per-KPI feedback + prioritized fixes
npm run scan -- https://example.com --save      # also persists (viewable at /analysis/<id> in the web UI)
```
Exits 0 with a JSON object on stdout (npm prints two header lines first — parse from the first `{`).

### Output fields
- `overall`, `ui`, `ux` — 0–100. `overall` blends the model's judgment (65%) with expert-proximity (35%).
- `aiSlop` — `{ score, isGeneric, verdict, signals }`. **Higher score = more generic/templated.**
  70+ = full AI-slop template; under 30 = distinctive/hand-crafted.
- `expertProximity` — `{ score, nearest[] }`. **Higher score = visually closer to the expert SaaS cluster.**
  `nearest` lists the closest expert sites with cosine similarity (a self-match near 1.0 means the URL
  is itself in the catalog).
- `--full` adds `uiKPIs`, `uxKPIs`, `feedback` (per-KPI), `topPriorities` (fix list).

## Grow the "gold standard" (makes every future scan smarter)
```bash
npm run reference:add -- https://acme.com "Acme" "saas"   # capture + embed + index one expert site
npm run reference:build                                     # re-ingest the whole catalog
```
The catalog lives in `src/lib/reference/catalog.ts`; the design principles in
`src/lib/reference/playbook.ts`. Editing those is how you tune what "good UI" means to the scorer.

## Web UI (optional, for humans)
```bash
npm run dev    # http://localhost:3000 — homepage form, gallery, and /analysis/<id> result pages
```

## Interpreting results / caveats
- CLIP proximity partly clusters by theme (dark dashboards look alike), so it's a strong **proxy**
  blended with the LLM's judgment — not a perfect design oracle.
- Model is Groq `llama-4-scout` by default (a lenient judge). For sharper scoring, set
  `GROQ_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct` in `.env.local` (needs maverick tier access).
- A tidy-but-generic page scores ~50–65; reserve a mental "expert-tier" bar (75+) for genuinely
  distinctive, restrained design.
