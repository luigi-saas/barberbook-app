# Payments Rules (Stripe)

- Always import Stripe as `import { stripe } from '@repo/payments'` — never instantiate it directly
- Always use optional chaining: `stripe?.prices.list()` — Stripe may not be configured
- Always verify webhook signatures using `stripe.webhooks.constructEvent()` — never skip verification
- Never log full Stripe event objects — log only `event.type` and relevant IDs (customerId, subscriptionId)
- Store Stripe customer IDs in Clerk `privateMetadata.stripeCustomerId` — not in the database
- Emit PostHog analytics events on subscription state changes (subscribed, canceled, upgraded)
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` live in `apps/api/.env.local`
