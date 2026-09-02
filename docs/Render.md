# Deploying BarberBook.ma on Render

This repo is Render-ready via a **Blueprint** (`render.yaml` at the repo root).
It replaces the three Vercel projects. The Postgres database is created
manually in Render's dashboard (Render Blueprints can't provision the free
Postgres tier — see "Database" below).

## What moves where

| Vercel (before) | Render (after) | Source | Notes |
|---|---|---|---|
| `barberbook-app` (web project) | **barberbook-web** web service | `apps/web` | marketing + guest booking, the public site |
| `barberbook-app` (dashboard project) | **barberbook-app** web service | `apps/app` | merchant dashboard (needs Clerk keys) |
| `barberbook-app` (api project) | **barberbook-api** web service | `apps/api` | webhooks + cron routes; its build runs `prisma db push` |
| Vercel cron (`vercel.json`) | **barberbook-cron** cron job | — | daily keep-alive ping (delete if unwanted) |
| Neon Postgres | **PostgreSQL** instance (manual, free tier) | — | paste its Internal URL as `DATABASE_URL` |

Already handled in code (no Vercel lock-in):

- `packages/database` — picks the Neon driver only for `*.neon.tech` hosts; any
  standard Postgres (Render, RDS, Supabase, local) uses `adapter-pg` with TLS.
- `robots.txt` / `sitemap.xml` / blog JSON-LD — canonical host comes from
  `VERCEL_PROJECT_PRODUCTION_URL` → `NEXT_PUBLIC_WEB_URL` → localhost fallback,
  so they work on any platform.
- Analytics/CMS/feature-flags keys are optional and self-disable when unset.

## Database (5 minutes, before or during setup)

Render's free Postgres **cannot** be created from a Blueprint, so:

1. Render Dashboard → **New + → Postgres** → name it `barberbook-db`, region
   **Frankfurt**, plan **Free** → Create.
2. On the database page, copy the **Internal Database URL**.
3. You'll paste this URL when the Blueprint setup prompts for the
   `DATABASE_URL` fields of `barberbook-app` and `barberbook-api`
   (they're marked "sync: false").

> Free databases expire after 30 days — fine for validation, upgrade to
> Basic (~$6/mo) before real shops onboard. Alternatively keep Neon for now
> and paste your existing Neon URL instead.

## Quick start (Blueprint, ~10 minutes)

1. **Push this branch to GitHub** (already done from the workspace).
2. Render Dashboard → **New + → Blueprint** → select `luigi-saas/barberbook-app`
   → branch with `render.yaml` (currently
   `arena/01a06225-barberbook-app`; switch to `main` after merging).
3. Render lists 4 services. Fill the `sync: false` vars per the matrix below
   (DATABASE_URL = the Internal Database URL from the step above).
4. **Apply** → first builds start. The API build applies the Prisma schema to
   the database automatically.
5. Check `https://barberbook-web.onrender.com/fr` (or the URL Render assigned).

### Environment variables to fill in the dashboard

| Service | Variable | Where to get it |
|---|---|---|
| `barberbook-app` | `DATABASE_URL` | Render DB **Internal Database URL** (or Neon URL) |
| `barberbook-api` | `DATABASE_URL` | same URL |
| `barberbook-app` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Vercel project env vars (Clerk dashboard) |
| `barberbook-app` | `CLERK_SECRET_KEY` | idem — also add `barberbook-app.onrender.com` to Clerk's allowed origins |
| `barberbook-api` | `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` | idem — update the Clerk webhook target URL to the Render API URL |
| `barberbook-api` | `RESEND_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | copy from Vercel; update Stripe webhook endpoint to Render |
| all | `NEXT_PUBLIC_*` URL trio | keep in sync if Render assigns different subdomains or you add a custom domain |

Everything else (PostHog, GA, BaseHub, Sentry, BetterStack, Knock, Liveblocks,
Svix) is optional and off until you set real keys.

## Postgres notes

- Services connect with the **internal** connection string (paste it into
  `DATABASE_URL`); TLS is enforced and handled by the adapter automatically.
- Schema changes: edit `packages/database/prisma/schema.prisma` → the next
  `barberbook-api` deploy applies them (`prisma db push` in its build command).
- Prefer everything-in-file? Swap the manual DB for a paid one in the
  Blueprint by adding:

  ```yaml
  databases:
    - name: barberbook-db
      databaseName: barberbook
      user: barberbook
      region: frankfurt
      plan: basic # ~$6/mo — free is NOT allowed in Blueprints
  ```

  and replacing the two `DATABASE_URL` `sync: false` entries with:

  ```yaml
      - key: DATABASE_URL
        fromDatabase:
          name: barberbook-db
          property: connectionString
  ```

## Free tier realities (no payment info needed)

The Blueprint now provisions all three services on Render's **free** plan —
no card required. Know what you're signing up for:

- **Sleep**: free web services spin down after ~15 min idle; the next visit
  waits ~30–60 s for a cold start. Fine for demos, bad for production.
- **Build memory**: free instances have 512 MB RAM, and the build runs on the
  same instance. Next.js 16 + Turbopack typically wants more — if the first
  build dies with `Killed` / OOM / exit 137, the workaround is the **GitHub
  Actions image pipeline**: GH runners (7 GB, free for this repo's minutes)
  build Docker images, push to GHCR, and Render switches to
  `runtime: image` + `plan: free` to just *run* them (runtime fits in 512 MB).
  Ask and it gets scaffolded.
- **Free Postgres expires after 30 days.** Data is not migratable afterwards —
  upgrade the DB to Basic (~$6/mo) or dump/restore before then.
- **Shared instance hours**: the free plan includes 750 instance-hours/month
  across services; three always-on services need ~2,200 h. Sleeping services
  don't consume hours, so light demo usage fits; sustained traffic across all
  three will not.

## ⚠️ Build memory (paid path)

If you'd rather have reliable builds and always-on services, keep `plan:
starter` in `render.yaml` (Starter ≈ $7/service/mo; Render requires a card on
file for any paid instance, prorated by the second). Standard (2 GB) removes
all build-memory risk for the first deploy; you can resize down afterwards.

## Custom domain (barberbook.ma)

Render → service → Settings → Custom Domains → add `barberbook.ma` /
`www.barberbook.ma`, then point your DNS (CNAME or Render's nameservers).
After that, update `NEXT_PUBLIC_WEB_URL`, `NEXT_PUBLIC_APP_URL`,
`NEXT_PUBLIC_API_URL` and `VERCEL_PROJECT_PRODUCTION_URL` to the real domain
and add it to Clerk's allowed origins.

## Decommissioning Vercel

1. Confirm Render serves everything (pages, booking flow, dashboard login).
2. Copy any remaining env vars from Vercel → Render (see matrix above).
3. Update external targets: Clerk webhook URL, Stripe webhook endpoint,
   Resend domain (optional), social-media bio links.
4. Delete the Vercel projects (or keep them parked until DNS TTLs settle).

## Local development

Unchanged — `bun install && bun dev` with the embedded/local Postgres as
before. `render.yaml` only affects Render.
