# BarberBook.ma — Implementation Roadmap

**Last updated:** 2026-09-02 · **Working branch:** `arena/01a06225-barberbook-app` (mirrors `develop` + runtime fixes)

This roadmap merges three sources into one execution plan:

1. **Incubator business model PDF** (`docs/BarberBook_ma_Business_Model_Incubator_Updated.pdf`) — strategy, MVP scope, pricing, GTM stages, KPIs
2. **Screen map** (`docs/Design.md`) — 5 roles, ~180 screens, with an MVP shortlist
3. **Features.md** — the "Barber of the Future" AI/AR experience layer (Phase 6 below)

**North-star metric (from the PDF):** completed bookings per active shop per month.
**Strategy:** SaaS-first (merchant operating system) → city density in Casablanca → marketplace layering → monetization.

---

## Current state (after today's session ✅)

| Item | Status |
|---|---|
| `develop` merged into working branch (guest flow, 32-model schema, ar/en/fr i18n) | ✅ done |
| Local PostgreSQL 18 running (embedded, port 5432, db `barberbook`) | ✅ done |
| Schema deployed: 13 enums + 28 tables + 105 indexes (`scripts/schema.sql`) | ✅ done |
| Prisma Client generated & end-to-end booking domain smoke test passing | ✅ done |
| Web app runs: `/` → locale redirect fixed, all locales render, full 4-step guest booking flow 200 OK | ✅ done |
| Known gaps: booking flow still uses mock data; merchant dashboard is stock template; no notifications/billing | ⏳ next |

**Environment notes for this sandbox**
- `binaries.prisma.sh` is network-blocked → use `PRISMA_SKIP_ENGINE_DOWNLOAD=1` + `scripts/patch-prisma-sandbox.mjs` for `prisma generate`; apply DDL via `scripts/schema.sql` (regenerate with `scripts/gen-schema-sql.py`). `prisma db push`/`migrate` work normally on machines with open network (or against Neon).
- npm is unstable here (OOM kills) → use `bun install` (repo scripts already assume bun).
- Google Fonts blocked → Cairo/Manrope fall back locally; fine for dev.

---

## Phase 1 — Activate the data layer (Weeks 1–2)

**Goal:** replace every mock in the guest flow with real Prisma queries. This is the highest-leverage step — the entire schema already exists and is running.

1. **Seed script** (`packages/database/seed.ts`): 6–8 realistic Casablanca shops (Maarif, Gauthier, Anfa districts), barbers with availability, service catalogs with MAD pricing (150–650), gallery images, opening hours. Wire into `bun run seed`.
2. **Query layer** (`apps/web/app/[locale]/(guest)/` + server actions):
   - Explore/search → `shop.findMany` with city, service, price, rating filters + pagination (schema has `@@index` on city/status already)
   - Shop profile (`shops/[shopId]`) → shop + services + barbers + hours + gallery
   - Barber profile → barber + portfolio + reviews + services (`BarberService`)
3. **Availability engine** (core algorithmic piece):
   - Input: `BarberAvailability` (weekly grid, `DayOfWeek`), `BarberBlockedTime`, existing `Booking`s, service `duration`
   - Output: free slots per day per barber; slot join on booking → transactional create with overlap check (SELECT … FOR UPDATE or unique slot constraint)
   - Booking statuses already modeled: `PENDING → CONFIRMED → IN_PROGRESS → COMPLETED / CANCELLED`
4. **Guest → session**: persist booking-in-progress (cookie or `Booking` with `PENDING` + TTL cleanup cron) so the 4-step wizard survives reloads.
5. **Clerk auth roles**: map Clerk users to `User` rows (`clerkId` unique index exists) on `user.created` webhook (`apps/api`); enforce `UserRole` (CUSTOMER/BARBER/SHOP_OWNER/ADMIN) in server actions.

**Definition of done:** a visitor can book a real appointment at a seeded shop and the row lands in Postgres; booking appears in Prisma Studio.

---

## Phase 2 — Merchant OS, the SaaS wedge (Weeks 3–6)

**Goal:** the `apps/app` dashboard (port 3000) becomes the product merchants pay for. MVP screens per PDF/Design.md:

1. **Shop settings**: profile, branding, gallery, opening hours (`OpeningHours`), amenities (`ShopAmenity`), city/address
2. **Services**: CRUD + categories (`ServiceCategory`), pricing/duration, active toggle
3. **Team**: invite barbers (Clerk invite → `ShopBarber`), assign services, schedules, deactivate
4. **Booking calendar**: day/week view, create/edit/cancel, manual walk-in booking (`isWalkIn` + `WalkInQueue`), no-show marking
5. **CRM-lite**: customer list from bookings, `CustomerNote`, visit history, top customers
6. **Day dashboard**: today's appointments, revenue today, utilization %, walk-in queue
7. **Public booking page** per shop: `barberbook.ma/s/[slug]` (schema has `slug` unique) + QR code — the merchant distribution loop from the PDF (Instagram bio links, in-store QR)

**Definition of done:** a shop owner can run a full day on BarberBook without pen and paper; the public page produces real bookings.

---

## Phase 3 — WhatsApp/SMS confirmations & reminders (Weeks 6–8)

**Goal:** the #1 must-have from the PDF — and the anti-no-show lever.

1. Provider abstraction in `packages/notifications` or new `packages/messaging`: WhatsApp Business API via 360dialog/Twilio (Morocco: WhatsApp > SMS), fallback SMS via local aggregator
2. Triggers: booking confirmed, 24h reminder, 2h reminder, reschedule/cancel, rebooking prompt 3–4 weeks post-visit (the "smart scheduling" hook — see Phase 6)
3. Cron jobs in `apps/api` (Vercel cron already scaffolded) for reminder queue scanning `Booking` × `Notification` (dedupe)
4. `Notification` table already models all types (`BOOKING_CONFIRMED`, `BOOKING_REMINDER`, …) — track delivery status per message
5. Template strings in ar/fr (+ darija later), locale-aware per `User.locale` (default "fr" already in schema)

**Definition of done:** reminders go out automatically; no-show rate measurable (KPI from PDF).

---

## Phase 4 — Monetization: prepaid access packs (Weeks 8–11)

**Goal:** revenue per the revised pricing in the incubator PDF (prepaid 30-day packs, not auto-subscriptions).

| Plan | Price | Included (schema-ready) |
|---|---|---|
| Free trial | MAD 0 | 1 barber, limited bookings, public page |
| Basic | MAD 99/30d | 1 barber, calendar, services, customers |
| Growth | MAD 199/30d | multi-barber, CRM-lite, reminders, basic analytics |
| Pro | MAD 349/30d | advanced analytics, reviews, reactivation tools, featured visibility |
| Enterprise | custom | chains, multi-location |

1. Payments: Stripe Checkout in MAD (works today) behind a `PaymentMethod` abstraction so CMI/PayZone can slot in for local cards later (PDF names CMI/PayZone)
2. New models: `AccessPack` (plan, price, days), `Entitlement` (shopId, packId, startsAt, expiresAt), `CreditLedger` (business credits for reminders/campaigns/seats) — small schema addition, keeps `Subscription` table for future auto-renew markets
3. Gating middleware: dashboard features check active entitlement; expiry → soft-lock with data retained (PDF: manual renewal support, low friction)
4. Admin side: manual pack activation for field-sales onboarding (Phase 1 GTM is founder-led with cash/transfer payments — build an admin "mark as paid" path FIRST, Stripe second)

**Definition of done:** a shop can be onboarded on a paid pack in under 10 minutes, including cash payments.

---

## Phase 5 — Marketplace layer: reviews, promos, featured listings (Weeks 11–14)

1. **Reviews**: post-booking review flow (`Review` + `ReviewStatus` moderation: VISIBLE/HIDDEN/FLAGGED), rating aggregate on shop cards, review-request message after `COMPLETED` bookings
2. **Promos**: `PromoCode` + `BookingPromo` (percentage/fixed, min amount, validity) applied in booking summary
3. **Featured listings**: paid visibility in explore results (Pro pack benefit + à-la-carte credit burn from `CreditLedger`)
4. **Saved shops** (`SavedShop`) + customer favorites
5. **Admin console** (`apps/app` admin role): shops approval (`ShopStatus.PENDING_REVIEW`), reviews moderation, users, platform analytics (the Admin screens from Design.md, kept minimal)
6. **KPI instrumentation**: shops onboarded/activated/paying, bookings per active shop (north-star), no-show rate, online-originated share, 30-day retention, ARPU, prepaid renewal rate — exportable from existing tables + `AdminLog`

**Definition of done:** discovery → review → rebook loop runs without manual intervention (growth loops from PDF §11).

---

## Phase 6 — "Barber of the Future": AI & AR experience layer (Features.md)

*Sequenced per Features.md's own implementation order: WhatsApp + loyalty first, then AR, then AI face-scan. Each item lists the schema/state it needs.*

### 6.1 Smart scheduling / regrowth prediction (lowest cost, highest lock-in)
- **What:** predict next-visit date from service type + client history; send WhatsApp rebooking prompt with one-click slot links
- **Data:** average regrowth interval per service (derived from `Booking` history per customer), `LoyaltyEntry` for points
- **Tech:** simple statistical model first (median interval per service tier), graduate to `@repo/ai` (Vercel AI SDK) for personalized timing; no new tables — `Notification.BOOKING_REMINDER` + deep links

### 6.2 Digital loyalty program
- **What:** auto-points per visit, reward after 5 visits (free service), delivered via WhatsApp/wallet
- **Data:** `LoyaltyEntry` table exists (points, source) — add reward redemption flow + `pointsSpent`
- **Done when:** owner configures reward rules; redemption creates a zero-cost `Booking`

### 6.3 Tiered experience packages (upsell engine)
- **What:** Basic / Executive / VIP / Event packages (Features.md §4) as bookable bundles
- **Data:** extend `Service` with `tier` enum (CLASSIC, PREMIUM, SIGNATURE, EVENT) + `ServiceBundle` (package → service[]) — booking wizard shows tier selector with price anchors (250/450/650 MAD pattern already mocked in the summary page)
- **Done when:** attach rate per tier is measurable (PDF success metric: upsells per day)

### 6.4 AR hairstyle try-on (Phase-2 differentiator)
- **What:** real-time hairstyle preview at the chair (tablet/phone), client approves before cutting
- **Tech:** Banuba/Perfect Corp SDK or 8th Wall webAR (camera-first web page fits mobile-first Morocco); hairstyle assets per barber portfolio
- **Data:** `BarberPortfolioImage` exists; add `StyleAsset` (hairstyle overlays) + `StyleTryOn` log (which styles clients actually choose — feeds 6.5)
- **Scope guard:** ship as Progressive Web App camera page linked from booking confirmation; native ARKit/ARCore only if web AR underperforms

### 6.5 AI face & hair scan → style recommendations
- **What:** analyze face shape/hair density on arrival; recommend 5 suitable styles; store history for consistency
- **Tech:** `@repo/ai` (OpenAI vision or AWS Rekognition per Features.md §7); run client-side photo capture → server analysis → ranked styles
- **Data:** new `StyleRecommendation` model (userId, imageHash, faceShape, recommendations JSON, chosenStyleId); privacy: explicit consent + auto-delete raw images (Morocco Law 09-08 / CNDP compliance — store derived features, not photos)
- **Done when:** recommendation → booking conversion tracked; stored "last style" auto-suggested on rebooking (the consistency promise)

### 6.6 CRM automation & reactivation
- **What:** win-back campaigns for lapsed clients, birthday offers, preferred-style memory at the chair
- **Tech:** segment queries over `Booking`/`LoyaltyEntry`/`CustomerNote` + credits-funded WhatsApp campaigns (`CreditLedger` burn from Phase 4)
- **Done when:** a lapsed 60-day client gets an automated personalized win-back with their last style referenced

**Phase 6 sequencing respects Features.md §8:** reminders+loyalty (6.1–6.2) → AR at the chair (6.4) → AI face scan premium add-on (6.5) → train owners to sell packages (6.3, 6.6). Success metrics from Features.md §9 wired into Phase 5 KPI dashboard: average ticket value, 30/60/90-day retention, WhatsApp conversion, upsells/day.

---

## Parallel workstreams (any phase)

- **Localization**: full ar RTL pass (schema `locale` default fr; messages exist for ar/en/fr — RTL layout QA for guest flow), darija for WhatsApp templates
- **Observability**: Sentry/PostHog keys when deploying; `AdminLog` for all admin actions
- **Security**: Arcjet rules on public endpoints; rate limiting on booking creation; GDPR/CNDP consent flows (data export/delete for customers)
- **Dependabot hygiene**: PRs #1–#10 are stale (based on the old boilerplate lineage) → close and regenerate against the current default branch
- **Branch hygiene**: merge `develop` → `main` so `main` stops lagging; make `develop` the integration branch again

## Suggested milestone map to business stages (PDF §12)

| Product phase | Business stage | Gate to advance |
|---|---|---|
| 1–2 | Stage 0–1: validation, 5–10 paying shops in Casablanca | Interviews + first prepaid packs sold |
| 3 | Stage 1–2: retention, 50 paying shops | 30-day merchant retention > 60%, no-show < 15% |
| 4–5 | Stage 2–3: PMF signals, marketplace ignition | North-star: completed bookings/active shop trending up 3 months |
| 6 | Stage 3–4: differentiation + scale (Rabat, Marrakech, then TN/DZ) | ARPU lift from AI/AR tiers + referrals |
