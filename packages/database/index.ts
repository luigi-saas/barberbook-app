import "server-only";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import ws from "ws";
import { PrismaClient } from "./generated/client";
import { keys } from "./keys";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

neonConfig.webSocketConstructor = ws;

const connectionString = keys().DATABASE_URL;
const isLocal =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

// Neon's HTTP/WebSocket driver only speaks to Neon endpoints. Everything
// else (Render, RDS, Supabase, local Postgres) uses the standard pg adapter.
const isNeon = /neon\.(tech|build|com)/i.test(connectionString);

const adapter = isNeon
  ? new PrismaNeon({ connectionString })
  : new PrismaPg({
      connectionString,
      // Managed providers (Render, RDS, Supabase…) enforce TLS; local
      // sockets and the embedded dev server don't.
      ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
    });

export const database = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = database;
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = database;
}

export * from "./generated/client";
