# claude-code-setup

Private snapshot of the Claude Code configuration for this Windows 11 machine
(GitHub: MANDOZILLA). Copied from `C:\Users\whyhe\.claude` and
`C:\Users\whyhe\.agents\bin`. No secrets — API keys appear only as
`${ENV_VAR}` placeholders (verified with gitleaks + custom regex scan).

## Folder map

| Path | Original location | Contents |
|------|-------------------|----------|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | Global agent instructions |
| `RTK.md` | `~/.claude/RTK.md` | RTK reference (loaded by CLAUDE.md) |
| `projects-reference.md` | `~/.claude/projects-reference.md` | Project registry (stacks, paths, env vars) |
| `settings.json` | `~/.claude/settings.json` | Hooks, permissions, skill overrides, plugins, statusline |
| `statusline.js` | `~/.claude/statusline.js` | Statusline script |
| `statusline.README.md` | `~/.claude/statusline.README.md` | Statusline design notes |
| `.mcp.json` | `~/.claude/.mcp.json` | Global MCP servers (filesystem, github, obsidian, stripe) |
| `agents/` | `~/.claude/agents/` | Subagent definitions |
| `hooks/` | `~/.claude/hooks/` | Hook scripts (deploy/port/shell guards, secret scan, obsidian summary, …) |
| `skills/` | `~/.claude/skills/` | Skills (synced + local) |
| `dev-mods/` | `~/.claude/dev-mods/` | Dev-mode plugin sources (e.g. agent-monitor) |
| `plugins/` | `~/.claude/plugins/` | `installed_plugins.json`, `known_marketplaces.json` only (no cache/repos) |
| `agents-bin/` | `~/.agents/bin/` | Delegation wrappers: `opencode-subagent.ps1`, `codex-subagent.ps1`, `agents-top.ps1`, `agent-registry.ps1`, `resolve-opencode-model.py` |

## Restore

1. Copy the top-level files and folders (except `agents-bin/`) back into
   `~/.claude/` on a new machine, merging/overwriting as needed:
   ```powershell
   robocopy . $env:USERPROFILE\.claude /E /XD agents-bin
   ```
2. Copy `agents-bin/` contents into `~/.agents/bin/`:
   ```powershell
   robocopy agents-bin $env:USERPROFILE\.agents\bin /E
   ```
3. Set the environment variables listed below (user-level, or in a gitignored
   `.env.local` referenced by your shell profile).
4. Install prerequisites: Node.js, Python 3, `rtk` (used by the Bash hook),
   and the `gitleaks` CLI if you want the secret-scan hook behavior.
5. Reinstall plugins from `plugins/known_marketplaces.json` /
   `plugins/installed_plugins.json` via the Claude Code plugin manager.

## Required environment variables

Referenced as `${ENV_VAR}` placeholders in this repo:

| Variable | Where used | Notes |
|----------|-----------|-------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | `.mcp.json` → `github` MCP server env | GitHub PAT for the MCP github server |
| `STRIPE_SECRET_KEY` | `.mcp.json` → `stripe` MCP server env | Stripe secret key (`sk_live_…` / `sk_test_…`) |

The delegation wrappers in `agents-bin/` also expect:

| Variable | Where used | Notes |
|----------|-----------|-------|
| `ARTIFICIAL_ANALYSIS_API_KEY` | `opencode-subagent.ps1` | Required by the model router; must fail rather than fall back to paid models |

Other tools referenced by hooks/settings expect their own env (e.g. Groq,
Brevo, IMAP credentials) only inside individual projects — not set globally.

## Not included (intentionally)

Secrets and machine-local state were excluded from this snapshot:
`.credentials.json`, `.claude.json`, `settings.local.json`, `history.jsonl`,
`*.bak*`/`*backup*`/`*.pre-*` files, `projects/`, `sessions/`, `session-env/`,
`shell-snapshots/`, `file-history/`, `paste-cache/`, `cache/`, `backups/`,
`_backups/`, `downloads/`, `jobs/`, `state/`, `daemon*`, `ide/`, `chrome/`,
`feedback/`, `plans/`, `skill-observations/`, `token-audit-*/`,
`token-optimizer/`, `stats-cache.json`, `mcp-needs-auth-cache.json`, any
`.env*` file, plugins cache/repos, and (in `skills/`) `node_modules/`,
`.venv/`, `__pycache__/`, `*.log`, files > 1 MB.
