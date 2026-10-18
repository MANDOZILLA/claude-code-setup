# Project Reference

Moved out of `~/.claude/CLAUDE.md` on 2026-08-13. Only one of these is ever relevant
in a given session, but the whole block was loading in all 15 project directories at
~650 est tokens a time.

**Read this file when you need to identify a project you don't recognize.**
Prune anything with no activity in 90+ days — this list stays load-bearing, not archival.

---

## Known paths (verified 2026-08-13)

| Project | Path | Has own CLAUDE.md |
|---|---|---|
| Stock-Sense Suite (monorepo) | `Downloads/Stock-Sense-Suite-cloned/` | yes |
| StockMind (Android) | `AndroidStudioProjects/StockMind/` | no |
| stock-research-agent | `stock-research-agent/` | no |

Paths below are undocumented — fill in as you touch them.

---

## Active

**StockSense / OutreachHQ / Restaurant Leads** — `Downloads/Stock-Sense-Suite-cloned/`
3-app monorepo.
- *StockSense production URL*: `https://stockssense.net` (canonical; do not use the historical `getstocksense.com` or `stocksense-neon.vercel.app` hosts)
- *StockSense*: Next.js 14 + better-sqlite3 inventory forecasting (Holt-Winters, Groq AI insights, POS OAuth)
- *OutreachHQ*: Next.js 14 cold-email platform (Brevo + IMAP + Groq sentiment)
- *Restaurant Leads*: Playwright/Node CLI scraper (Google Maps + Yelp) feeding OutreachHQ
- Shared env: `GROQ_API_KEY`, `BREVO_API_KEY`, `IMAP_*`

**StockMind** — `AndroidStudioProjects/StockMind/`
Kotlin/Compose stock app. Heaviest-traffic project in recent history (~293 prompt
mentions in the last month). Has its own CLAUDE.md and a `gradle-build` skill as
of 2026-08-29 — JAVA_HOME must be set inline to Android Studio's JBR on every
Gradle call.

**Pulse Dashboard** — path TBD
Local Next.js 14 analytics dashboard, GA4 + Google Search Console across 5–15 projects.
Multi-project switcher, real-time panel, alerts, cohort retention, UTM builder, uptime
monitor, weekly digest. Dark/techy UI (`#0a0a0a`, cyan `#06b6d4`, JetBrains Mono for
numbers). better-sqlite3 for uptime history, node-cron for digest + alerts.

**Android AI Agent** — path TBD
Kotlin + Jetpack Compose on-device AI agent. Sets alarms, reads notifications, sends
WhatsApp messages. Inspired by OpenClaw.

**[Vercel/Turso/Stripe project — name TBD]**
Not yet documented. Fill in: repo path, stack, Vercel project name, Turso DB name,
Stripe mode (test/live).

## Chrome extensions

**BillBot** — generates AI cancellation-threat emails to negotiate bills (Comcast, AT&T,
Planet Fitness). OpenRouter API + Gmail OAuth. Files: `manifest.json`, `background.js`,
`content.js`, `providers.js`, popup, settings pages.

**TOS Scanner** — summarizes Terms of Service pages. OpenRouter + `mistral-7b-instruct:free`,
caches by domain, returns JSON with letter grades.

**EdPuzzle Bot** — Playwright-based, auto-answers EdPuzzle videos. GitHub: `Edpuzzle-auto-bot`.

## Other

**Lead-Gen Scraper** — Playwright scraper finding small businesses without websites across
multiple cities. `/lead-gen-tool` with `scraper.py`, `cities.txt`, `category.txt`, `leads.md`.

**ExcuseAI** — web app. Background `#1a1714` (warm brownish dark).
