# Deploying BarberBook.ma on Render

This repo is Render-ready via a **Blueprint** (`render.yaml` at the repo root).
It replaces the three Vercel projects + Neon with four Render services and a
managed Postgres.

## What moves where

| Vercel (before) | Render (after) | Source | Notes |
|---|---|---|---|
| `barberbook-app` (web project) | **barberbook-web** web service | `apps/web` | marketing + guest booking, the public site |
| `barberbook-app` (dashboard project) | **barberbook-app** web service | `apps/app` | merchant dashboard (needs Clerk keys) |
| `barberbook-app` (api project) | **barberbook-api** web service | `apps/api` | webhooks + cron routes; its build runs `prisma db push` |
| Vercel cron (`vercel.json`) | **barberbook-cron** cron job | — | daily keep-alive ping (delete if unwanted) |
| Neon Postgres | **barberbook-db** Postgres | — | connection string is injected automatically |

Already handled in code (no Vercel lock-in):

- `packages/database` — picks the Neon driver only for `*.neon.tech` hosts; any
  standard Postgres (Render, RDS, Supabase, local) uses `adapter-pg` with TLS.
- `robots.ts` / `sitemap.ts` / blog JSON-LD — canonical host comes from
  `VERCEL_PROJECT_PRODUCTION_URL` → `NEXT_PUBLIC_WEB_URL` → localhost fallback,
  so they work on any platform.
- Analytics/CMS/feature-flags keys are optional and self-disable when unset.

## Quick start (Blueprint, ~10 minutes)

1. **Push this branch to GitHub** (already done from the workspace).
2. Render Dashboard → **New + → Blueprint** → select `luigi-saas/barberbook-app`
   → when asked for a branch, pick the branch containing `render.yaml`
   (currently `arena/01a06225-barberbook-app`; switch to `main` after merging).
3. Render shows the services from `render.yaml`. For the `sync: false` vars,
   fill in real values (see matrix below). Copy any you already have from the
   Vercel project settings before deleting them there.
4. **Apply** → first builds start. The API build applies the Prisma schema to
   the new Postgres automatically.
5. Check `https://barberbook-web.onrender.com/fr` (or the URL Render assigned).

### Environment variables to fill in the dashboard

| Service | Variable | Where to get it |
|---|---|---|
| `barberbook-app` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Vercel project env vars (Clerk dashboard) |
| `barberbook-app` | `CLERK_SECRET_KEY` | idem — also add `barberbook-app.onrender.com` to Clerk's allowed origins |
| `barberbook-api` | `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` | idem — update the Clerk webhook target URL to the Render API URL |
| `barberbook-api` | `RESEND_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | copy from Vercel; update Stripe webhook endpoint to Render |
| all | `NEXT_PUBLIC_*` URL trio | keep in sync if Render assigns different subdomains or you add a custom domain |

Everything else (PostHog, GA, BaseHub, Sentry, BetterStack, Knock, Liveblocks,
Svix) is optional and off until you set real keys.

## Postgres notes

- **Free plan databases expire after 30 days** — fine for a smoke test, then
  upgrade `barberbook-db` to Starter before onboarding real shops.
- Services connect with the **external** connection string Render injects
  (`fromDatabase: connectionString`); TLS is enforced and handled by the
  adapter. For lower latency you can switch the `DATABASE_URL` values to the
  **internal** URL Render shows on the database page.
- Schema changes: edit `packages/database/prisma/schema.prisma` → the next
  `barberbook-api` deploy applies them (`prisma db push` in its build command).

## ⚠️ Build memory (read before choosing plans)

Next.js 16 + Turbopack needs roughly **1.5–2 GB RAM to build** this app.
Render's Free **and Starter** instances have 512 MB, which can OOM during the
first build. Options, cheapest-first:

1. **Try Starter anyway** — filtered builds (`--filter web`) build one app, not
   the whole monorepo; if it fits, you're done at ~$7/service.
2. **Standard (2 GB) for the first deploy**, then **Suspend/resize down**.
   Subsequent deploys reuse the build cache and usually fit in less memory.
3. **Build on GitHub Actions, run on Render** (most cost-efficient): a GH
   workflow builds a Docker image (runners have 7 GB, free for public repos)
   and pushes to GHCR; the Render service becomes *"Deploy an existing image"*.
   Free-tier Render can then RUN the prebuilt image (runtime fits in 512 MB
   for this app). Ask if you want this pipeline scaffolded.

Also note: Free web services **sleep after 15 min idle** (cold start ~30–60 s).
The `barberbook-cron` keep-alive ping prevents DB expiry surprises; upgrade
plans don't sleep.

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
