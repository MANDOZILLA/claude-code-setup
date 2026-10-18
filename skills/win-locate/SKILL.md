---
name: win-locate
description: Finds where an app, config file, or CLI binary lives on this Windows machine — highest-probability locations first, recorded for reuse. Use instead of guessing paths one at a time.
---

# Win Locate

Find installed apps, config folders, or CLI binaries on Windows without blind multi-location guessing (the pattern that previously wasted many turns hunting for the Hermes desktop app's install path).

## Steps

1. Check `%APPDATA%` and `%LOCALAPPDATA%` first — highest hit rate for Electron and most desktop apps' data/config.
2. If not found, check install location via registry: `Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*` and the `HKCU:\...` equivalent, filtering by display name.
3. For CLI binaries specifically, check in order: `Get-Command <name>` / `where.exe <name>`, then common global bin dirs that `where` sometimes misses: `%APPDATA%\npm`, `%USERPROFILE%\.local\bin`, `%USERPROFILE%\scoop\shims` — this is the exact class of miss that caused the Headroom plugin build to fail (binary present but not on the checked PATH).
4. If still not found, check package-manager-installed apps: `winget list`, `Get-Package`.
5. Once found, record the canonical path in the "Windows Environment Gotchas" section at the bottom of THIS file (append, don't overwrite) so the next lookup is instant. Do not write it back into `~/.claude/CLAUDE.md` — that log was moved here on 2026-08-13 to keep it out of every session's context.
6. Report back: path found, and which step found it — this tells future searches which step to try first for similar apps.

## Notes

- Don't guess a path and test it speculatively before checking the ordered list above — the ordering exists because it reflects where things are actually found most often on this machine.
- If a plugin/tool install fails and the binary can't be located anywhere in this list, check whether a prerequisite is missing (e.g. `uv` for Python-dependent installs, working SSH for some marketplace plugin installs) before concluding the binary doesn't exist.

## Windows Environment Gotchas (running log — append here, don't re-discover)

Moved out of `~/.claude/CLAUDE.md` on 2026-08-13 so it costs zero context until
this skill is actually loaded. **This is now the canonical home — append new
findings here, not to CLAUDE.md.**

- Electron/desktop app config/install paths: check `%APPDATA%`/`%LOCALAPPDATA%` FIRST before searching anywhere else.
- Plugin installs that build native/Python deps may fail with "npm global bin not found" — some marketplace plugins (e.g. Headroom) need `uv` installed to resolve Python dependency chains. Check `uv --version` before troubleshooting further.
- SSH connectivity must be working BEFORE a marketplace plugin install will succeed for some plugins — if a plugin install hangs/fails silently, check SSH first, not the plugin.
- Gradle wrappers fail with "JAVA_HOME is not set" — no system JDK on PATH (only a JRE 1.8). Export `JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"` before `./gradlew`.
- Pulling binary files off a phone: `adb exec-out run-as <pkg> cat <file> > out` — plain `adb shell cat` corrupts them (a pulled SQLite DB opens as "malformed database schema").
- WindowsApps `python3` alias silently drops piped stdin under PowerShell (script sees empty input, exits 0). Pipe-test hook scripts under Git Bash, not PowerShell — Claude Code runs hooks via bash here anyway.
