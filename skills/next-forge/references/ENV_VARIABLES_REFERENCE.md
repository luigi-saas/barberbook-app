# Environment Variables Reference

All environment variables are managed through `keys.ts` files in each package and extended into app `env.ts` files using `@t3-oss/env-nextjs`. All integrations except the database are optional and gracefully degrade if missing.

---

## apps/app (Main SaaS Application - Port 3000)

**Provider Packages:** `auth`, `analytics`, `collaboration`, `next-config`, `database`, `email`, `feature-flags`, `notifications`, `observability`, `security`, `webhooks`

### Server Environment Variables

| Variable | Provider | Type | Format | Required |
|----------|----------|------|--------|----------|
| `DATABASE_URL` | database | string | PostgreSQL URL (Neon) | ✅ Yes |
| `CLERK_SECRET_KEY` | auth | string | `sk_*` | ❌ Optional |
| `CLERK_WEBHOOK_SECRET` | auth | string | `whsec_*` | ❌ Optional |
| `RESEND_TOKEN` | email | string | `re_*` | ❌ Optional |
| `RESEND_FROM` | email | string | Email address | ❌ Optional |
| `FLAGS_SECRET` | feature-flags | string | - | ❌ Optional |
| `KNOCK_SECRET_API_KEY` | notifications | string | - | ❌ Optional |
| `LIVEBLOCKS_SECRET` | collaboration | string | `sk_*` | ❌ Optional |
| `SVIX_TOKEN` | webhooks | string | `sk_*` or `testsk_*` | ❌ Optional |
| `ARCJET_KEY` | security | string | `ajkey_*` | ❌ Optional |
| `UPSTASH_REDIS_REST_URL` | rate-limit | URL | - | ❌ Optional |
| `UPSTASH_REDIS_REST_TOKEN` | rate-limit | string | - | ❌ Optional |
| `BETTERSTACK_API_KEY` | observability | string | - | ❌ Optional |
| `BETTERSTACK_URL` | observability | URL | - | ❌ Optional |
| `SENTRY_ORG` | observability | string | - | ❌ Optional |
| `SENTRY_PROJECT` | observability | string | - | ❌ Optional |
| `ANALYZE` | next-config | string | - | ❌ Optional |
| `NEXT_RUNTIME` | next-config | enum | `"nodejs"` or `"edge"` | ❌ Optional |
| `VERCEL` | next-config | string | - | ❌ Optional |
| `VERCEL_ENV` | next-config | enum | `"development"`, `"preview"`, `"production"` | ❌ Optional |
| `VERCEL_URL` | next-config | string | - | ❌ Optional |
| `VERCEL_REGION` | next-config | string | - | ❌ Optional |
| `VERCEL_PROJECT_PRODUCTION_URL` | next-config | string | - | ❌ Optional |

### Client Environment Variables

| Variable | Provider | Type | Format | Required |
|----------|----------|------|--------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | auth | string | `pk_*` | ❌ Optional |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | auth | string | Path (e.g., `/sign-in`) | ❌ Optional |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | auth | string | Path (e.g., `/sign-up`) | ❌ Optional |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | auth | string | Path (e.g., `/`) | ❌ Optional |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | auth | string | Path (e.g., `/`) | ❌ Optional |
| `NEXT_PUBLIC_POSTHOG_KEY` | analytics | string | `phc_*` | ❌ Optional |
| `NEXT_PUBLIC_POSTHOG_HOST` | analytics | URL | - | ❌ Optional |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | analytics | string | `G-*` | ❌ Optional |
| `NEXT_PUBLIC_KNOCK_API_KEY` | notifications | string | - | ❌ Optional |
| `NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID` | notifications | string | - | ❌ Optional |
| `NEXT_PUBLIC_SENTRY_DSN` | observability | URL | - | ❌ Optional |
| `NEXT_PUBLIC_APP_URL` | next-config | URL | http://localhost:3000 | ✅ Yes |
| `NEXT_PUBLIC_WEB_URL` | next-config | URL | http://localhost:3001 | ✅ Yes |
| `NEXT_PUBLIC_API_URL` | next-config | URL | http://localhost:3002 | ❌ Optional |
| `NEXT_PUBLIC_DOCS_URL` | next-config | URL | http://localhost:3004 | ❌ Optional |

---

## apps/web (Marketing Website - Port 3001)

**Provider Packages:** `cms`, `next-config`, `email`, `observability`, `feature-flags`, `security`, `rate-limit`

### Server Environment Variables

| Variable | Provider | Type | Format | Required |
|----------|----------|------|--------|----------|
| `BASEHUB_TOKEN` | cms | string | `bshb_pk_*` | ❌ Optional |
| `RESEND_TOKEN` | email | string | `re_*` | ❌ Optional |
| `RESEND_FROM` | email | string | Email address | ❌ Optional |
| `FLAGS_SECRET` | feature-flags | string | - | ❌ Optional |
| `ARCJET_KEY` | security | string | `ajkey_*` | ❌ Optional |
| `UPSTASH_REDIS_REST_URL` | rate-limit | URL | - | ❌ Optional |
| `UPSTASH_REDIS_REST_TOKEN` | rate-limit | string | - | ❌ Optional |
| `BETTERSTACK_API_KEY` | observability | string | - | ❌ Optional |
| `BETTERSTACK_URL` | observability | URL | - | ❌ Optional |
| `SENTRY_ORG` | observability | string | - | ❌ Optional |
| `SENTRY_PROJECT` | observability | string | - | ❌ Optional |
| `ANALYZE` | next-config | string | - | ❌ Optional |
| `NEXT_RUNTIME` | next-config | enum | `"nodejs"` or `"edge"` | ❌ Optional |
| `VERCEL` | next-config | string | - | ❌ Optional |
| `VERCEL_ENV` | next-config | enum | `"development"`, `"preview"`, `"production"` | ❌ Optional |
| `VERCEL_URL` | next-config | string | - | ❌ Optional |
| `VERCEL_REGION` | next-config | string | - | ❌ Optional |
| `VERCEL_PROJECT_PRODUCTION_URL` | next-config | string | - | ❌ Optional |

### Client Environment Variables

| Variable | Provider | Type | Format | Required |
|----------|----------|------|--------|----------|
| `NEXT_PUBLIC_POSTHOG_KEY` | analytics | string | `phc_*` | ❌ Optional |
| `NEXT_PUBLIC_POSTHOG_HOST` | analytics | URL | - | ❌ Optional |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | analytics | string | `G-*` | ❌ Optional |
| `NEXT_PUBLIC_SENTRY_DSN` | observability | URL | - | ❌ Optional |
| `NEXT_PUBLIC_APP_URL` | next-config | URL | http://localhost:3000 | ✅ Yes |
| `NEXT_PUBLIC_WEB_URL` | next-config | URL | http://localhost:3001 | ✅ Yes |
| `NEXT_PUBLIC_API_URL` | next-config | URL | http://localhost:3002 | ❌ Optional |
| `NEXT_PUBLIC_DOCS_URL` | next-config | URL | http://localhost:3004 | ❌ Optional |

---

## apps/api (Serverless API - Port 3002)

**Provider Packages:** `auth`, `analytics`, `next-config`, `database`, `email`, `observability`, `payments`

### Server Environment Variables

| Variable | Provider | Type | Format | Required |
|----------|----------|------|--------|----------|
| `DATABASE_URL` | database | string | PostgreSQL URL (Neon) | ✅ Yes |
| `CLERK_SECRET_KEY` | auth | string | `sk_*` | ❌ Optional |
| `CLERK_WEBHOOK_SECRET` | auth | string | `whsec_*` | ❌ Optional |
| `RESEND_TOKEN` | email | string | `re_*` | ❌ Optional |
| `RESEND_FROM` | email | string | Email address | ❌ Optional |
| `STRIPE_SECRET_KEY` | payments | string | `sk_*` | ❌ Optional |
| `STRIPE_WEBHOOK_SECRET` | payments | string | `whsec_*` | ❌ Optional |
| `BETTERSTACK_API_KEY` | observability | string | - | ❌ Optional |
| `BETTERSTACK_URL` | observability | URL | - | ❌ Optional |
| `SENTRY_ORG` | observability | string | - | ❌ Optional |
| `SENTRY_PROJECT` | observability | string | - | ❌ Optional |
| `ANALYZE` | next-config | string | - | ❌ Optional |
| `NEXT_RUNTIME` | next-config | enum | `"nodejs"` or `"edge"` | ❌ Optional |
| `VERCEL` | next-config | string | - | ❌ Optional |
| `VERCEL_ENV` | next-config | enum | `"development"`, `"preview"`, `"production"` | ❌ Optional |
| `VERCEL_URL` | next-config | string | - | ❌ Optional |
| `VERCEL_REGION` | next-config | string | - | ❌ Optional |
| `VERCEL_PROJECT_PRODUCTION_URL` | next-config | string | - | ❌ Optional |

### Client Environment Variables

| Variable | Provider | Type | Format | Required |
|----------|----------|------|--------|----------|
| `NEXT_PUBLIC_POSTHOG_KEY` | analytics | string | `phc_*` | ❌ Optional |
| `NEXT_PUBLIC_POSTHOG_HOST` | analytics | URL | - | ❌ Optional |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | analytics | string | `G-*` | ❌ Optional |
| `NEXT_PUBLIC_SENTRY_DSN` | observability | URL | - | ❌ Optional |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | payments | string | `pk_*` | ❌ Optional |
| `NEXT_PUBLIC_APP_URL` | next-config | URL | http://localhost:3000 | ✅ Yes |
| `NEXT_PUBLIC_WEB_URL` | next-config | URL | http://localhost:3001 | ✅ Yes |
| `NEXT_PUBLIC_API_URL` | next-config | URL | http://localhost:3002 | ❌ Optional |
| `NEXT_PUBLIC_DOCS_URL` | next-config | URL | http://localhost:3004 | ❌ Optional |

---

## All Providers & Integration Services

| Provider | Service | Variables | Required | Link |
|----------|---------|-----------|----------|------|
| **auth** | Clerk | `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, auth URLs | ❌ Optional | https://clerk.com |
| **analytics** | PostHog + Google Analytics + Vercel Web Analytics | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ❌ Optional | [PostHog](https://posthog.com) / [GA](https://analytics.google.com) |
| **cms** | BaseHub | `BASEHUB_TOKEN` | ❌ Optional | https://basehub.com |
| **database** | PostgreSQL (Neon) | `DATABASE_URL` | ✅ **Required** | https://neon.tech |
| **email** | Resend + React Email | `RESEND_TOKEN`, `RESEND_FROM` | ❌ Optional | https://resend.com |
| **feature-flags** | Vercel Flags + PostHog | `FLAGS_SECRET` | ❌ Optional | https://vercel.com/features/flags |
| **payments** | Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ❌ Optional | https://stripe.com |
| **notifications** | Knock | `KNOCK_SECRET_API_KEY`, `NEXT_PUBLIC_KNOCK_API_KEY`, `NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID` | ❌ Optional | https://knock.app |
| **collaboration** | Liveblocks | `LIVEBLOCKS_SECRET` | ❌ Optional | https://liveblocks.io |
| **webhooks** | Svix | `SVIX_TOKEN` | ❌ Optional | https://svix.com |
| **security** | Arcjet | `ARCJET_KEY` | ❌ Optional | https://arcjet.com |
| **storage** | Vercel Blob | `BLOB_READ_WRITE_TOKEN` | ❌ Optional | https://vercel.com/storage/blob |
| **rate-limit** | Upstash Redis | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | ❌ Optional | https://upstash.com |
| **observability** | Sentry + BetterStack | `SENTRY_ORG`, `SENTRY_PROJECT`, `NEXT_PUBLIC_SENTRY_DSN`, `BETTERSTACK_API_KEY`, `BETTERSTACK_URL` | ❌ Optional | [Sentry](https://sentry.io) / [BetterStack](https://betterstack.com) |
| **internationalization** | Languine | `LANGUINE_PROJECT_ID` | ❌ Optional | https://languine.ai |
| **cron** | Vercel Cron | None | ✅ Built-in | https://vercel.com/docs/cron-jobs |
| **seo** | Sitemap + JSON-LD + Security Headers | None | ✅ Built-in | Built-in |
| **design-system** | shadcn/ui | None | ✅ Built-in | https://ui.shadcn.com |

---

## Packages Available for Use (Not Yet Extended in Current Apps)

### Storage (`@repo/storage`) - Vercel Blob

For file upload functionality via Vercel Blob storage. Available to extend in any app that needs file uploads.

**Environment Variables** (set in app `.env.local`):

| Variable | Type | Format | Required |
|----------|------|--------|----------|
| `BLOB_READ_WRITE_TOKEN` | string | `vercel_blob_*` | ❌ Optional |

**Usage**: 
- Server uploads: `put()` from `@repo/storage`
- Client uploads: `upload()` from `@repo/storage/client`
- Server uploads limited to 4.5MB; use client uploads for larger files

### Internationalization (`@repo/internationalization`) - Languine

For multilingual site support with automatic translation. Currently integrated in `packages/internationalization/`.

**Environment Variables** (set in `packages/internationalization/.env.local`):

| Variable | Type | Format | Required |
|----------|------|--------|----------|
| `LANGUINE_PROJECT_ID` | string | - | ❌ Optional |

**Configuration**: Edit `packages/internationalization/languine.json` to define source and target locales.

**Usage**: 
- Import `getDictionary(locale)` to access translated content
- Run `bun run translate` to sync translations with Languine
- Language-specific routing (`/en/*`, `/fr/*`) with automatic detection

---

## Setup Instructions

### Minimal Setup (Required Only)
```bash
# 1. Set DATABASE_URL in packages/database/.env
DATABASE_URL=postgresql://user:password@host/db

# 2. Run migrations
bun run migrate

# 3. Set inter-app URLs (defaults work for local development)
# apps/app/.env.local, apps/web/.env.local, apps/api/.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_URL=http://localhost:3004
```

### Optional Integrations

For each optional integration, retrieve API keys from the provider and add to the appropriate `.env.local`:

**Currently Active:**
- **Authentication:** Clerk → add keys to `apps/app/.env.local`
- **Payments:** Stripe → add keys to `apps/api/.env.local` and `apps/app/.env.local`
- **CMS:** BaseHub → add token to `apps/web/.env.local`
- **Notifications:** Knock → add keys to `apps/app/.env.local`
- **Collaboration:** Liveblocks → add keys to `apps/app/.env.local`
- **Webhooks:** Svix → add token to `apps/app/.env.local`
- **Email:** Resend → add keys to all apps
- **Analytics:** PostHog/Google Analytics → add keys to all apps
- **Security:** Arcjet → add keys to apps needing protection
- **Rate Limit:** Upstash Redis → add credentials to apps needing rate limiting
- **Observability:** Sentry/BetterStack → add credentials to all apps
- **Feature Flags:** Languine Flags → add secret to `apps/web/.env.local` and `apps/app/.env.local`

**Available to Enable:**
- **Storage:** Vercel Blob → add `BLOB_READ_WRITE_TOKEN` to any app needing file uploads
- **Internationalization:** Languine → set up in `packages/internationalization/.env.local` to enable i18n

### Vercel Deployment
Add environment variables via Vercel dashboard for each project (app, web, api).
