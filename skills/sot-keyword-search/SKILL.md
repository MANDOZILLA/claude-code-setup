---
name: sot-keyword-search
description: Finds Source of Truth (SOT) markers in the project using localized terminal tools to minimize context window consumption.
---

# SOT Keyword Search

## Instructions

1. Before modifying or implementing code, do not read through entire directories.
2. Execute a local `grep` or `ripgrep` command in the workspace to locate the predefined SOT keywords (e.g., `// @SOT`, `/* SOURCE OF TRUTH */`).
3. Read ONLY the specific execution paths and files containing these matches to preserve the session's context window.

## When to Use

- Before making architectural decisions, search for existing SOT markers.
- Before implementing a new feature, check if a canonical implementation already exists and is marked.
- When multiple similar files exist, find the SOT version and use it as the reference implementation.

## Common SOT Keywords

- `// @SOT` — Single-line marker
- `/* SOURCE OF TRUTH */` — Block comment marker
- `@sot:` — Inline comment marker
- Custom project markers (check project docs)

## Workflow

1. Grep the codebase for SOT keywords: `grep -r "@SOT\|SOURCE OF TRUTH" .`
2. Read ONLY those files (use offset/limit if they're large).
3. Extend or reference the SOT file rather than creating alternatives.
