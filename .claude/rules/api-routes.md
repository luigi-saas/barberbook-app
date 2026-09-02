# API Route Rules (apps/api)

- All webhook handlers must verify the incoming signature before touching the payload — no exceptions
- Use `@repo/observability/log` for all logging in `apps/api` — never `console.log` or `console.error`
- Use `@repo/observability/error` (`parseError`) in every catch block to safely extract error messages
- Always return a valid JSON response — even on error — so Vercel and providers do not retry endlessly
- Cron routes must check `Authorization: Bearer $CRON_SECRET` to prevent public triggering
- Never import from `@repo/database` directly in `apps/api` — queries go in server actions in `apps/app`
- The keep-alive cron at `app/cron/keep-alive/route.ts` must not be removed or disabled
