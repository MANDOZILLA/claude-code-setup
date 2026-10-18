---
name: red-green-prompting
description: Enforces reuse of existing codebase patterns and structures to prevent duplicate code generation. Invoke when Claude starts creating redundant or fresh implementations.
---

# Red-Green Prompting

## Instructions

1. When instructed to build a feature, do NOT generate standalone logic or fresh baseline functions.
2. Assume that the application already has the core utilities, database contracts, styles, and architecture fully built.
3. Your primary objective is to search the project, locate existing patterns, and update or extend those files instead of creating new ones.

## Guidelines

- **Prioritize updating over creating** — If a pattern exists, extend it rather than duplicate.
- **Explicit justification required** — If you believe a file must be created, you must explicitly justify why an existing pattern cannot be extended.
- **Search first** — Use Grep/Glob to locate existing implementations before writing new code.
- **Reuse contracts** — Database schemas, API shapes, component props, style tokens all already exist.
- **Follow established architecture** — Match folder structure, naming conventions, and module organization of the codebase.
