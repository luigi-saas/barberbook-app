# ============================================================================
# BarberBook — one parameterized image for all three Next.js services.
#
#   docker build --build-arg APP=web  -t barberbook-web  .
#   docker build --build-arg APP=app  -t barberbook-app  .
#   docker build --build-arg APP=api  -t barberbook-api  .
#
# Built automatically by .github/workflows/build-images.yml on GitHub's 7 GB
# runners and pushed to GHCR — Render free instances (512 MB) then only RUN
# the image, sidestepping the well-known `next build` OOM on tiny instances.
# ============================================================================
ARG APP=web

# ── Builder: full toolchain, 7 GB CI or any roomy machine ──────────────────
FROM oven/bun:1 AS builder
ARG APP
# Public URLs + placeholders are baked into the client bundle at BUILD time
# (the same non-secret values render.yaml sets on Render).
ARG NEXT_PUBLIC_APP_URL=https://barberbook-app.onrender.com
ARG NEXT_PUBLIC_WEB_URL=https://barberbook-web.onrender.com
ARG NEXT_PUBLIC_API_URL=https://barberbook-api.onrender.com
ARG VERCEL_PROJECT_PRODUCTION_URL=barberbook-web.onrender.com
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_WEB_URL=$NEXT_PUBLIC_WEB_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    VERCEL_PROJECT_PRODUCTION_URL=$VERCEL_PROJECT_PRODUCTION_URL \
    DATABASE_URL=postgresql://build:build@localhost:5432/build
WORKDIR /app

# Install first (cached until the lockfile changes)
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY apps/app/package.json apps/app/
COPY apps/web/package.json apps/web/
COPY packages/ai/package.json packages/ai/
COPY packages/analytics/package.json packages/analytics/
COPY packages/auth/package.json packages/auth/
COPY packages/cms/package.json packages/cms/
COPY packages/collaboration/package.json packages/collaboration/
COPY packages/database/package.json packages/database/
COPY packages/design-system/package.json packages/design-system/
COPY packages/email/package.json packages/email/
COPY packages/feature-flags/package.json packages/feature-flags/
COPY packages/internationalization/package.json packages/internationalization/
COPY packages/next-config/package.json packages/next-config/
COPY packages/notifications/package.json packages/notifications/
COPY packages/observability/package.json packages/observability/
COPY packages/payments/package.json packages/payments/
COPY packages/rate-limit/package.json packages/rate-limit/
COPY packages/security/package.json packages/security/
COPY packages/seo/package.json packages/seo/
COPY packages/storage/package.json packages/storage/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/webhooks/package.json packages/webhooks/
RUN bun install --frozen-lockfile

# Build only the requested app
COPY . .
RUN PRISMA_SCHEMA_ENGINE_BINARY=/bin/true bun run build --filter ${APP}

# ── Runner: prebuilt artifacts + runtime deps only ─────────────────────────
FROM oven/bun:1 AS runner
ARG APP
ENV APP=${APP}
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/seed ./seed

# apps/$APP/package.json "start" = db-setup (schema + seed, idempotent,
# never blocks) then `bun --bun next start`. PORT is injected by Render.
CMD ["sh", "-c", "cd apps/$APP && bun run start"]
