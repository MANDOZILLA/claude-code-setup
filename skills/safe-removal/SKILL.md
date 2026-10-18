---
name: safe-removal
description: Maps every reference before deleting, removes in dependency-safe order, verifies no orphans. Use when asked to remove, delete, rip out, or deprecate a feature, endpoint, table, or functionality.
---

# Safe Removal

Prevent the common failure mode where removing a feature leaves orphaned references that surface later as runtime errors (missing imports, dead API routes, broken UI links).

## Steps

1. **Map before deleting.** Grep the whole repo for every identifier tied to the feature: function/component names, routes, DB tables/columns, env vars, imports, UI copy/links referencing it. Build the full reference list first — do not start deleting while still discovering references.
2. **Remove in dependency order.** Delete leaf callers (UI components, route handlers that call into the feature) before shared/core code (the underlying service, DB schema, shared utils). Removing core code first breaks callers that haven't been cleaned up yet.
3. **Re-grep to verify.** After removal, search again for the same identifiers from step 1. Expect zero hits outside changelog/git history/comments. Any remaining hit is an orphaned reference — fix it before continuing.
4. **Run build + full test suite.** A clean build/test pass after removal is required, not optional — orphaned type references or dead imports often only surface here.
5. **Manually verify runtime behavior.** Hit the pages/endpoints that were previously connected to the removed feature (e.g. a page that linked to it, an API route that called it) to confirm no 500s/503s from dangling references. Static analysis (grep, build, types) can miss runtime-only breakage.

## Notes

- If the feature touches a database schema, treat column/table drops as a separate, more cautious step — confirm no other feature reads that data before dropping it, and prefer a migration with a rollback path over an irreversible `DROP`.
- If in doubt whether something is still referenced, treat it as referenced and check further rather than assuming it's dead.
