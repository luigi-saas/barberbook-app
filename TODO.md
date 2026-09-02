# Fix 404 at localhost:3001/ (i18n middleware)

## Completed:
- [x] 1. Create apps/web/middleware.ts (next-intl i18n middleware, fixed config initialization error)
- [x] 2. Edit apps/web/proxy.ts (chain i18n middleware first, integrate with auth/security, fix TS)

## Remaining:
- [ ] 3. Start dev server: `cd apps/web && pnpm dev`
- [ ] 4. Test http://localhost:3001/ redirects to /en, loads home page without 404
- [ ] 5. Test http://localhost:3001/blog loads blog page
- [ ] 6. Check no console i18n errors
