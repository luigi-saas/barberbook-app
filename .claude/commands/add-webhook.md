# Add Webhook Handler

Add a new webhook route in `apps/api` for a third-party provider.

Steps:
1. Ask for the provider name (e.g. `stripe`, `clerk`, `resend`)
2. Create `apps/api/app/webhooks/<provider>/route.ts`
3. Add signature verification appropriate for the provider:
   - Stripe: `stripe.webhooks.constructEvent(body, signature, secret)`
   - Clerk/Svix: verify with `new Webhook(secret).verify(body, headers)`
   - Other: ask the user for the verification method
4. Add a `switch` on `event.type` with a `default` case that logs unhandled events
5. Use `@repo/observability/log` for logging — never `console.log`
6. Use `@repo/observability/error` (`parseError`) in the catch block
7. Return `NextResponse.json({ ok: true })` on success, `{ ok: false, message }` with status 500 on error
8. Add the webhook secret variable name to `apps/api/env.ts`
