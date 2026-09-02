# Check Types

Run TypeScript type checking across all apps and report errors.

Steps:
1. Run `cd apps/web && bun run typecheck` and capture output
2. Run `cd apps/app && bun run typecheck` and capture output
3. Run `cd apps/api && bun run typecheck` and capture output
4. For each error found:
   - Show the file path, line number, and error message
   - Propose a fix (or ask if the context is unclear)
5. Apply all fixes, then re-run the failing typecheck to confirm clean

Note: TypeScript errors in `packages/*/generated/` are safe to ignore — they are auto-generated.
