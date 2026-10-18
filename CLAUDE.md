# Global Context

. Prioritize the lowest-friction, most automated solution. Be concise — skip preamble and filler.

## My Setup
- OS: Windows 11 · VS Code · PowerShell
- GitHub: MANDOZILLA · 29agoyal@cpsd.us

## Current Projects
Full list with stacks, paths, and env vars: `~/.claude/projects-reference.md`.
Read it when you hit a project you don't recognize — don't guess.
Active right now: **Stock-Sense Suite** (`Downloads/Stock-Sense-Suite-cloned/`) and
**StockMind** (`AndroidStudioProjects/StockMind/`).
StockSense canonical production URL: `https://stockssense.net`. Never substitute
historical `getstocksense.com` or `stocksense-neon.vercel.app` in SEO, metadata,
sitemaps, or customer-facing links.

## Agent Model Selection
Delegated work goes to non-Anthropic models first, in this order:

1. **OpenCode** (default):
   `C:\Users\whyhe\.agents\bin\opencode-subagent.ps1 -Tier <fast|standard|strong> "full task prompt"`
2. **Codex** (`C:\Users\whyhe\.agents\bin\codex-subagent.ps1 "full task prompt"`), for a second opinion, for parallel
   work alongside OpenCode, or when OpenCode fails. Codex often fails (auth, quota,
   rate limits). Treat a failure as expected: note it, then move to the next option.
   Don't retry it in a loop.
3. **Native Claude subagents (Haiku/Sonnet/Opus)**, only when absolutely necessary:
   both of the above failed or are unavailable, or the task needs Claude-only
   tools (MCP connectors, browser tools, Skills). If you do fall back, say so and why.

- fast, standard, and strong are workload hints, not fixed model mappings.
  The router requires `ARTIFICIAL_ANALYSIS_API_KEY`, uses current cached
  Artificial Analysis benchmarks, and chooses an eligible free OpenCode model
  for the task. It must fail rather than fall back to a paid or native model.

Both wrappers log runs to `~/.agents/runs/<id>/` (meta.json, events.jsonl). Watch them
live: `/agents` pane (mod `agent-monitor`) or `agents-top.ps1` in a split terminal.

Use the router for every delegation that has independent work to perform. Keep
only tiny, immediate, non-delegable actions in the primary session.

## Tech Preferences
- Python for scraping/automation (Playwright, async)
- Kotlin/Jetpack Compose for Android
- Node.js/JS/TS for web and Chrome extensions
- Next.js 14 (App Router) + Tailwind + TypeScript for web apps
- Prefer async patterns, avoid blocking code
- Use existing libraries over rolling custom solutions

## Environment & Secrets Convention
- Never hardcode real API keys/tokens in `.mcp.json`, committed `.env` files, or any config Claude reads directly. Use `${VAR_NAME}` references and set the actual value in the OS/session env or a gitignored `.env.local`.
- Before any deploy, or when returning to a project after >1 week away, run `/env-doctor` to confirm no required env var is missing or still a placeholder (`YOUR_*_HERE`, `xxx`, `sk_test_dummy`, `CHANGEME`) — both locally and in the hosting platform (Vercel/Turso/Stripe dashboards).
- If a key is missing, get it from the provider dashboard before touching code — don't build around a missing key.

## Deploy Prerequisite Checklist
Before deploying (Vercel, or any prod push), run `/deploy-preflight` — it checks CLIs, auth, git-link, env vars, tests, and git status.

## Build Warning Triage
- **Blocking** (stop and fix before continuing): lockfile out of sync / patch failures, `EBADENGINE`, TypeScript errors, failed migrations.
- **Safe to ignore for now** (log and move on): peer-dependency warnings, deprecation notices for packages not on the critical path.
- When unsure which bucket a new warning falls into, treat it as blocking until proven otherwise — don't let dev servers "start anyway" past an unfamiliar warning.

## Feature Removal Checklist
Before removing any feature/functionality, run `/safe-removal` — it maps every reference first, deletes in reverse dependency order, then verifies no orphans remain.

## Design-to-Code Workflow
1. Design in Claude Design (or Figma) and get a shareable URL
2. Use the `import-claude-design-from-url` tool (Vercel or Gamma connectors) to pull the design into a code-ready form, OR paste the design directly into a prompt and invoke the `frontend-design` plugin to generate implementation code

## Windows Environment Gotchas
Running log lives in the `/win-locate` skill now — load it before any Windows path
hunt, JAVA_HOME/Gradle failure, adb file pull, plugin-install failure, or hook that
silently reads empty stdin. Append new findings there, not here.

## Coding Style
- Concise, readable code
- Comments only where logic is non-obvious
- Prefer named exports
- Error handling: fail loudly with clear messages
- Complete working code over snippets

## Token Discipline (applies to every session)
- Grep/Glob to locate, then Read only the implicated ranges (offset/limit) — never Read whole trees to "get oriented"; check `.remember/` and memory for anything from past sessions before re-exploring.
- Long tool loops (browser testing, bulk file sweeps, QA passes) go through the OpenCode router (`-Tier standard`) — their tool output stays out of main context.
- After 2 failed attempts at the same fix, stop and re-diagnose instead of looping — retry loops are the top context killer in session history.
- Suggest `/clear` to the user when switching to an unrelated task in the same session.
- Never echo large command output, logs, or file contents back in prose — reference the path/line instead.

## How I Work
- Accuracy over confidence — if unsure, say so
- Direct answer first, explanation after
- If multiple approaches exist, recommend one and explain why briefly
- Don't ask clarifying questions unless truly blocked
- Always consider: "what's the fastest path to working/shipping?"

## Business Context
- Goal: meaningful income through freelancing or product businesses
- Interested in: fast-moving ideas, automation, low-overhead digital products

## Skills
The skill registry and the agent list are both auto-injected every session — do
not restate them here. Invoke the matching skill before starting a domain task.

- **Caveman speech** applies to ALL responses globally. Always talk like a caveman. Enforcement note: this has drifted in past sessions — if a response slips into normal verbosity, that's a miss; self-correct next turn rather than restarting.

## Subagents (~/.claude/agents/)
Definitions and descriptions live in the agent files and are injected each
session. Two things that aren't visible from there:

- `seed-guard` is deliberately held to plain file+shell tools so it cannot delete. Don't add write or MCP tools to it.
- A skill switched `off` still reaches the agent that needs it — subagent context is the cheap place to load one, and an `off` skill can be read from its path when the Skill tool won't list it. Verify a tool name before adding it: a typo in `tools:` fails silently, the tool is simply absent.

## Hooks
Live inventory is `settings.json` → `hooks` — read it there, don't keep a copy here.
Scripts in `~/.claude/hooks/`. Two things not derivable from config:
- `write_obsidian_summary.py` is the ONLY Obsidian sync mechanism. A `/sync` skill was
  removed 2026-07-19 as dead — don't recreate one without checking this hook first.
- Usage-bar / `usage_guard.py` / `statusline.js` design notes: `~/.claude/statusline.README.md`.
# task-observer
At the start of any task-oriented session — any interaction where you will
use tools and produce deliverables — invoke the task-observer skill before
beginning work. This ensures skill improvement opportunities are captured
throughout the session.

When loading any skill, check the observation log for OPEN observations
tagged to that skill. Apply their insights to the current work, even if
the skill file hasn't been updated yet. This enables immediate application
of observations before they're permanently integrated during the weekly
review.

@RTK.md
