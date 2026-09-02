# Analytics Rules (PostHog + Vercel Analytics)

- Server-side events: `import { analytics } from '@repo/analytics/server'`
- Client-side events: `import { analytics } from '@repo/analytics'` (PostHog via provider)
- Always call `await analytics?.shutdown()` at the end of serverless handlers (webhooks, cron) — PostHog batches events and needs a flush
- Use optional chaining everywhere: `analytics?.capture(...)` — PostHog may not be configured
- Standard event naming convention: `"<Entity> <Past-tense verb>"` e.g. `"User Subscribed"`, `"Booking Created"`
- User identification (`identify`) must be called before `capture` when associating properties
- Org-level events use `groupIdentify` with `groupType: "company"` and the Clerk org ID as `groupKey`
- Never track PII beyond what PostHog is configured to handle — no raw email addresses in event properties
