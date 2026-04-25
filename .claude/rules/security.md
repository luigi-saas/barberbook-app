# Security Rules (Arcjet + NoseCone)

- Use `@repo/security` (`secure()`) on any public route that needs bot protection
- Pass the allowed bot list explicitly: `await secure(['CATEGORY:SEARCH_ENGINE', 'CATEGORY:MONITOR'])`
- Arcjet runs in `LIVE` mode — a denied decision throws an error that surfaces as a 500 unless caught
- Never bypass Arcjet by checking `process.env.NODE_ENV` — use `DRY_RUN` mode during development instead
- The `ARCJET_KEY` lives in `apps/web/.env.local` and `apps/app/.env.local`
- NoseCone sets security headers (CSP, HSTS, etc.) — do not override these in `next.config.ts`
- Rate limiting is provided by `@repo/rate-limit` — use it on any user-facing mutation endpoint
- Never expose internal error details to the client — catch and return generic messages only
