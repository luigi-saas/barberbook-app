# Add Marketing Page (apps/web)

Scaffold a new page on the marketing site with full i18n and SEO support.

Steps:
1. Ask for the page slug (e.g. `about`, `features/ai`)
2. Create `apps/web/app/[locale]/<slug>/page.tsx` as a server component:
   - Call `setRequestLocale(params.locale)` at the top
   - Add `generateMetadata` using `createMetadata` from `@repo/seo`
   - Load messages with `getMessages({ locale: params.locale })`
3. Add translation keys under a matching namespace in `apps/web/messages/en.json`
   (e.g. slug `about` → namespace `web.about`)
4. Sync all 6 other locale files with English placeholders
5. Add the route to the header nav if appropriate (`apps/web/app/[locale]/components/header/`)
6. Run `bun run lint` and `bun run typecheck` — fix any errors

Note: Never add Clerk auth or database imports to `apps/web` — it is a public site.
