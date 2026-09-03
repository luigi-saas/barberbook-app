/**
 * Database setup — runs at service START (and build) so the deployed app can
 * never sit on an empty database.
 *
 * Why: seeding used to happen only in the api service's BUILD step. If that
 * build ran before DATABASE_URL was set (first deploy before the Postgres is
 * pasted in) or failed once, the database stayed empty forever and every
 * shop list showed "Aucun salon trouvé". Now every service boot ensures:
 *   1. schema is applied (prisma db push)
 *   2. demo content exists (skipped when shops already present)
 *
 * Guarantees:
 *   - exits 0 in every scenario so it can never block a deploy/boot
 *   - idempotent: seed/ uses fixed IDs + upserts, and is skipped entirely
 *     when the database already has shops (SEED_FORCE=1 overrides)
 *
 * Run: node scripts/db-setup.mjs
 */
import { execFileSync } from "node:child_process";
import pg from "pg";
import {
  classifyDbError,
  describeTarget,
  loadEnvFallback,
} from "../seed/lib/env.mjs";

const log = (...args) => console.log("[db-setup]", ...args);

async function main() {
  loadEnvFallback();
  if (!process.env.DATABASE_URL) {
    log("DATABASE_URL not set — skipping schema push + seed (paste the Postgres Internal Database URL in the service env to enable).");
    return;
  }

  // 0. Probe once and classify failures with actionable hints (Prisma hides
  // the underlying cause behind [Object], so classify at the driver level).
  const target = describeTarget(process.env.DATABASE_URL);
  log("database target:", target);
  try {
    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 10_000,
    });
    await client.connect();
    await client.end();
  } catch (error) {
    const kind = classifyDbError(error);
    if (kind === "auth") {
      log("❌──────────────────────────────────────────────────────────────────");
      log("❌ DATABASE_URL was REJECTED — invalid credentials.");
      log("❌ Target:", target);
      log("❌ Fix in Render Dashboard → your service → Environment:");
      log("❌  1. Copy the FULL \"Internal Database URL\" from the Render Postgres page (it contains user + password + host + db name).");
      log("❌  2. If the password has special characters (@ # % / :), URL-encode them — or reset the DB password to letters+numbers only.");
      log("❌  3. Set the SAME value on web, app AND api services, then Manual Deploy.");
      log("❌  4. Render free Postgres EXPIRES after 30 days — if expired, create a new DB and update the URL (then reboot: seeding is automatic).");
      log("❌──────────────────────────────────────────────────────────────────");
    } else if (kind === "network") {
      log("❌ cannot REACH the database host:", target);
      log("❌ Check: database service is Running (not suspended/expired), hostname and port copied exactly (Internal Database URL for Render DBs).");
    } else {
      log("database probe failed — continuing:", (error?.message || String(error)).slice(0, 200));
    }
    return; // nothing else can succeed — leave boot to Next.js
  }


  // 1. Apply the Prisma schema (no-op when already in sync).
  const repoRoot = new globalThis.URL("..", import.meta.url).pathname;
  try {
    execFileSync(
      "bunx",
      ["prisma", "db", "push", "--schema=packages/database/prisma/schema.prisma", "--skip-generate", "--accept-data-loss"],
      { stdio: "inherit", cwd: repoRoot },
    );
  } catch (error) {
    log("schema push failed — falling back to bundled scripts/schema.sql (applied only to EMPTY databases):", String(error).slice(0, 120));
    try {
      const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      const { rows } = await client.query(
        "SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public'",
      );
      if ((rows[0]?.n ?? 0) > 0) {
        log(`database already has ${rows[0].n} table(s) — schema.sql fallback skipped (it rebuilds tables).`);
      } else {
        const { readFileSync } = await import("node:fs");
        await client.query(readFileSync(`${repoRoot}scripts/schema.sql`, "utf8"));
        log("applied scripts/schema.sql — schema created.");
      }
      await client.end();
    } catch (fallbackError) {
      log("schema.sql fallback failed — continuing:", String(fallbackError).slice(0, 300));
    }
  }

  // 2. Seed demo content only when the database is empty (raw pg — the
  //    generated Prisma client is TS and needs tsx/bun to run). Also heals
  //    databases seeded by older app versions: rows pointing at dead
  //    external image URLs would render broken cards forever, so those
  //    trigger a one-shot reseed (upserts restore local assets + ACTIVE).
  try {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM "Shop"');
    const shops = rows[0]?.n ?? 0;
    let force = Boolean(process.env.SEED_FORCE);
    if (shops > 0 && !force) {
      const { rows: broken } = await client.query(
        `SELECT COUNT(*)::int AS n FROM "Shop" WHERE "coverUrl" IS NULL OR "coverUrl" NOT LIKE '/%'`,
      );
      if ((broken[0]?.n ?? 0) > 0) {
        force = true;
        log(`${broken[0].n} shop(s) carry non-local image URLs (old demo data) — reseeding to restore bundled assets.`);
      }
    }
    await client.end();
    if (shops > 0 && !force) {
      log(`database already has ${shops} shop(s) — seed skipped.`);
      return;
    }
  } catch {
    log("could not count shops (schema missing?) — attempting seed anyway.");
  }

  log("seeding demo content…");
  try {
    execFileSync("bunx", ["tsx", "seed/index.mjs"], {
      stdio: "inherit",
      cwd: new globalThis.URL("..", import.meta.url).pathname,
    });
  } catch (error) {
    log("seed failed — continuing:", String(error).slice(0, 300));
  }
}

main()
  .catch((error) => log("unexpected error — continuing:", String(error).slice(0, 300)))
  .finally(() => process.exit(0));
