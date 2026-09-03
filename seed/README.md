# seed/ — BarberBook demo data

Modular seeder for the launch content (Casablanca pilot). Replaces the old
`scripts/seed-demo.mjs` monolith — same data, same fixed IDs, same
idempotency guarantees, now one file per domain.

## Run

```bash
DATABASE_URL=postgres://… bunx tsx seed/index.mjs   # explicit
bun run db:seed                                     # repo root script
node scripts/db-setup.mjs                           # boot path: schema + seed
```

On Render, `db-setup.mjs` runs automatically at every service start and
seeds **only when the database has no shops** (so it never touches real
data). `SEED_FORCE=1 node scripts/db-setup.mjs` reseeds on top of existing
rows (upserts — it overwrites seed-managed fields, never deletes).

## What gets seeded

| Seeder | Data |
|---|---|
| `seeders/accounts.mjs` | 3 shop owners (`SHOP_OWNER`), 6 barbers (user + verified `Barber` profile) |
| `seeders/shops.mjs` | 3 shops (Casablanca ×2, Marrakech ×1), hours 09:00–20:00 7/7, 8 categories, 11 services, rosters + weekly availability |
| `seeders/history.mjs` | 8 demo customers, 8 `COMPLETED` bookings with CASH payments and visible reviews |

## Layout

```
seed/
├── index.mjs           # entry — runs seeders in dependency order, prints counts
├── lib/
│   ├── db.mjs          # shared PrismaClient (pg driver adapter)
│   └── helpers.mjs     # DAYS weekday enum, daysAgo()
├── data/               # pure datasets — edit these to change demo content
│   ├── barbers.mjs
│   ├── shops.mjs       # shops + nested categories/services/roster
│   ├── guests.mjs
│   └── history.mjs     # bookings + reviews (indexes into guests/shops)
└── seeders/            # upsert logic per domain
    ├── accounts.mjs
    ├── shops.mjs
    └── history.mjs
```

## Extending the demo

- **New shop / service / barber** → add an entry in `data/shops.mjs` or
  `data/barbers.mjs` with a unique fixed id (`shop_4`, `svc_12`, …) and run
  `bun run db:seed`.
- **New booking / review** → append to `data/history.mjs` (`g` = guest
  index, `days` = days ago, `svc`/`shop`/`barber` = fixed ids).
- Ids are permanent: never reuse or renumber them, seeded rows reference
  each other by id.

## Handy demo identifiers

- My-bookings lookup: phone **+212 6 62 11 12 22** (Mehdi Kettani — 2
  completed bookings at Royal Blade) or any phone in `data/guests.mjs`
- Shop slugs: `royal-blade`, `heritage-grooming`, `atlas-barbering`
- Booking references: last 8 chars of the id, e.g. `seed_bk_1` → `SEED_BK_1`
