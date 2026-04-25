# Fix Lint

Run the full linting and type-checking pipeline and fix all reported issues.

Steps:
1. Run `bun run fix` (Biome auto-fix)
2. Run `bun run lint` and capture remaining errors
3. For each remaining error, open the file and apply the correct fix
4. Run `bun run typecheck` in `apps/app` and `apps/web` and fix TypeScript errors
5. Report a summary: files changed, errors fixed, any issues that need manual attention

Note: Biome is the linter (not ESLint). Config lives in `biome.jsonc` at the repo root.
