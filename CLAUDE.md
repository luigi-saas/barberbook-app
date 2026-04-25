# BarberBook App

## Context

BarberBook is a Barber Booking SaaS platform built on the next-forge (v6.0.2) Turborepo template. It is a full-stack monorepo with multiple deployable apps and shared packages.

## Project Structure

```
barberbook-app/
├── apps/
│   ├── app/        (port 3000) — Main authenticated SaaS app
│   ├── web/        (port 3001) — Marketing website (i18n, CMS, SEO)
│   ├── api/        (port 3002) — Serverless API (webhooks, payments)
│   ├── email/      (port 3003) — React Email preview server
│   ├── docs/       (port 3004) — Mintlify documentation
│   ├── storybook/  (port 6006) — Design system workshop
│   └── studio/     (port 3005) — Prisma Studio
├── packages/       — Shared @repo/* packages
├── skills/         — Claude skill definitions
└── .claude/        — Claude Code configuration
```

## Stack

- **Monorepo**: Turborepo 2.8.14, npm workspaces
- **Framework**: Next.js (latest), React 19, TypeScript 5 (strict)
- **Styling**: Tailwind CSS 4, Shadcn/ui, Radix UI, Geist font
- **Auth**: Clerk (`@clerk/nextjs` v7)
- **Database**: Prisma 7 + Neon serverless PostgreSQL (`@neondatabase/serverless`)
- **Payments**: Stripe v20 + `@stripe/agent-toolkit`
- **Email**: React Email + Resend
- **CMS**: BaseHub (headless)
- **Analytics**: PostHog + Vercel Analytics
- **Observability**: Sentry + Logtail
- **Security**: Arcjet + NoseCone
- **i18n (web)**: next-intl v4 with `[locale]` route segments
- **i18n (packages)**: next-international v1 with Languine translations
- **Notifications**: Knock Labs
- **Real-time**: Liveblocks
- **Storage**: Vercel Blob
- **Feature flags**: Vercel Toolbar + Flags SDK
- **AI**: OpenAI + Vercel AI SDK
- **Webhooks**: Svix
- **Linting**: Biome 2 (Ultracite)
- **Testing**: Vitest + React Testing Library (in `apps/app`)

## Rules

- Use functional components and React hooks only — no class components
- TypeScript strict mode everywhere — no `any`, no type assertions without justification
- Import shared packages as `@repo/<package-name>` (e.g. `@repo/database`, `@repo/auth`)
- Never edit generated files in `node_modules/`, `.next/`, or `prisma/generated/`
- Never commit `.env` files or secrets — each app has its own `.env.local`
- Run `bun run lint` before committing; run `bun run migrate` after schema changes
- Never edit files in `packages/typescript-config/` or `packages/next-config/` without asking
- Prefer editing existing files over creating new ones
- Keep components in `apps/web` i18n-aware: use `useTranslations()` and message keys, not hardcoded strings
- Message files live in `apps/web/messages/{locale}.json` — always update all locale files together

## Key Commands

```bash
bun run dev           # Start all apps concurrently
bun run build         # Build all apps (respects Turbo dependency graph)
bun run test          # Run Vitest across monorepo
bun run migrate       # Format + generate Prisma + db push
bun run lint          # Biome lint
bun run fix           # Biome lint --fix
bun run analyze       # Bundle size analysis
```

Per-app dev (faster):
```bash
cd apps/web && bun run dev    # Web only (port 3001)
cd apps/app && bun run dev    # App only (port 3000)
```

Additional commands:
```bash
bun run typecheck         # TypeScript type check (per-app)
bun run db:push           # Prisma format + generate + db push (no migration file)
bun run bump-deps         # Update all dependencies
bun run translate         # Run Languine translations
```

## Environment Variables

| Location | Purpose |
|---|---|
| `packages/database/.env` | `DATABASE_URL` — Neon PostgreSQL (required) |
| `apps/app/.env.local` | Clerk, Stripe, PostHog, Sentry keys |
| `apps/web/.env.local` | CMS (BaseHub), analytics |
| `apps/api/.env.local` | Stripe webhooks, Svix |

## i18n Notes (apps/web)

- Supported locales: `en`, `fr`, `es`, `de`, `pt`, `zh`, `ar`
- Default locale: `en`
- Route pattern: `/[locale]/...` (e.g. `/en/blog`, `/fr/contact`)
- Config: `apps/web/next-intl.config.js` and `apps/web/i18n/request.ts`
- Provider: `apps/web/app/[locale]/NextIntlProvider.tsx`
- Messages: `apps/web/messages/{locale}.json`
- Middleware: `apps/web/middleware.ts` → chains i18n routing then auth/security
