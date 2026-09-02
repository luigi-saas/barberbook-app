# New Feature

Scaffold a new feature in `apps/app` following project conventions.

Steps:
1. Ask for the feature name and which section it belongs to: `(authenticated)` or `(unauthenticated)`
2. Create a new route directory under `apps/app/app/(authenticated)/<feature-name>/`
3. Create `page.tsx` as a server component (no `'use client'`)
4. If the feature needs client interaction, create a `components/` subfolder with a `<feature-name>-client.tsx` file marked `'use client'`
5. If it needs a server action, create `actions/<feature-name>.ts` using the `'use server'` directive
6. Import shared packages using `@repo/<package-name>` — never relative imports across apps
7. Run `bun run lint` and `bun run typecheck` and fix any errors

Note: Never add hardcoded strings or inline styles — use Tailwind classes and `@repo/design-system` components.
