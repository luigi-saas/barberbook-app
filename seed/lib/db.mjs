/**
 * Shared Prisma client for all seeders.
 *
 * Uses the pg driver adapter (Prisma 7 driver-adapter mode — same as the
 * apps). DATABASE_URL falls back to the local demo database.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../packages/database/generated/client.ts";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/barberbook",
});

export const db = new PrismaClient({ adapter });
