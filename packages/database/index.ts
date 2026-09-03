import "server-only";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import ws from "ws";
import { PrismaClient } from "./generated/client";
import { keys } from "./keys";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

neonConfig.webSocketConstructor = ws;

const createClient = (): PrismaClient => {
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

  return new PrismaClient({ adapter });
};

/**
 * Lazy Prisma client. The client (and its env validation) initializes on
 * first QUERY, not at import time — a missing/unreachable DATABASE_URL then
 * surfaces as a catchable error in the calling feature with a clear log,
 * instead of a module-init crash that takes down every route importing it.
 */
export const database: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createClient();
    }
    const client = globalForPrisma.prisma;
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
