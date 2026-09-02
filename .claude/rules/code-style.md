# Code Style Rules

- Functional components only — no class components
- TypeScript strict mode — no `any`, no unsafe type assertions
- Import shared packages as `@repo/<package-name>`, never with relative paths across app/package boundaries
- `page.tsx` and `layout.tsx` are always server components — never add `'use client'` to them
- Client components go in separate files with `'use client'` at the top
- Server actions go in separate files with `'use server'` at the top
- Use Tailwind CSS 4 for all styling — no inline styles, no CSS modules unless absolutely necessary
- Use components from `@repo/design-system` before reaching for custom HTML elements
- Never import from `node_modules` directly when a `@repo/*` wrapper exists
- Never write multi-paragraph comments or docstrings — one short line max if the WHY is non-obvious
