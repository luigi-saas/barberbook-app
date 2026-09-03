/**
 * Seed entry — the BarberBook demo content (Casablanca pilot).
 *
 * Idempotent: fixed IDs + upserts, safe to run on every deploy.
 *
 * Run:
 *   DATABASE_URL=... bunx tsx seed/index.mjs
 *   bun run db:seed            # from the repo root
 *
 * db-setup.mjs (service boot) calls this automatically when the database
 * has no shops yet — pass SEED_FORCE=1 to reseed a populated database.
 */
import { db, verifyDatabaseAccess } from "./lib/db.mjs";
import { seedAccounts } from "./seeders/accounts.mjs";
import { seedShops } from "./seeders/shops.mjs";
import { seedHistory } from "./seeders/history.mjs";

async function main() {
  console.log("[seed] start");
  await verifyDatabaseAccess();

  await seedAccounts(); // owners + barbers
  await seedShops(); // shops, hours, categories, services, roster
  await seedHistory(); // guests, completed bookings, payments, reviews

  const counts = {
    shops: await db.shop.count(),
    services: await db.service.count(),
    barbers: await db.barber.count(),
  };
  console.log("[seed] done", counts);
}

main()
  .catch((error) => {
    console.error("[seed] failed", error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
