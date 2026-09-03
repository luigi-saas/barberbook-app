/**
 * Shared Prisma client for all seeders + preflight checks.
 *
 * Uses the pg driver adapter (Prisma 7 driver-adapter mode — same as the
 * apps). DATABASE_URL is read from the environment, then from the repo
 * root and per-app env files (.env, .env.local), and finally falls back
 * to the local demo database (docker compose up -d).
 */
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../packages/database/generated/client.ts";
import { classifyDbError, describeTarget, loadEnvFallback } from "./env.mjs";

loadEnvFallback();

export const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/barberbook";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
export const db = new PrismaClient({ adapter });

const log = (...args) => console.log("[seed]", ...args);

/**
 * Preflight: exit with an actionable banner when the database is
 * unreachable, rejects the credentials, or has no schema yet.
 */
export async function verifyDatabaseAccess() {
  log("database target:", describeTarget(DATABASE_URL));

  // 1. Connectivity + credentials
  try {
    const client = new pg.Client({
      connectionString: DATABASE_URL,
      connectionTimeoutMillis: 10_000,
    });
    await client.connect();
    await client.end();
  } catch (error) {
    const kind = classifyDbError(error);
    if (kind === "network") {
      log("❌ No database listening at the target above (ECONNREFUSED / unreachable).");
      log("   Start the local one:            docker compose up -d");
      log("   Or point DATABASE_URL elsewhere: DATABASE_URL=\"postgresql://…\" npm run db:seed");
      log("   (.env / .env.local / apps/*/.env.local are read automatically)");
      log("   Fresh empty database? Create the schema first: npm run db:setup");
    } else if (kind === "auth") {
      log("❌ DATABASE_URL was REJECTED — invalid credentials.");
      log("   docker compose default is postgres / postgres; otherwise check");
      log("   user, password and host in DATABASE_URL (URL-encode special");
      log("   characters like @ # % / : in the password).");
    } else {
      log("❌ Connection failed:", (error?.message || String(error)).slice(0, 200));
    }
    process.exit(1);
  }

  // 2. Schema presence — db:seed assumes tables exist; a fresh database
  //    needs `npm run db:setup` (schema push + seed) first.
  try {
    const client = new pg.Client({ connectionString: DATABASE_URL });
    await client.connect();
    const { rows } = await client.query("SELECT to_regclass('\"Shop\"') AS reg");
    await client.end();
    if (!rows[0]?.reg) {
      log("❌ Database is reachable but has no tables yet.");
      log("   Create the schema + seed in one step:  npm run db:setup");
      process.exit(1);
    }
  } catch {
    // Table-existence probe is best-effort; let the seed surface real errors.
  }
}
