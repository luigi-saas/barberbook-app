/**
 * Shared helpers for database tooling (seed/ and scripts/db-setup.mjs):
 * env-file fallback, safe URL description and error classification.
 */
import { existsSync } from "node:fs";

const repoRoot = new globalThis.URL("../../", import.meta.url).pathname;

/**
 * Plain `node` doesn't load .env files (Render injects real env vars, local
 * runs rely on files). process.loadEnvFile never overrides already-set
 * variables, so the first file that defines DATABASE_URL wins.
 */
export function loadEnvFallback(log = () => {}) {
  if (process.env.DATABASE_URL) return;
  for (const candidate of [
    `${repoRoot}.env`,
    `${repoRoot}.env.local`,
    `${repoRoot}apps/web/.env`,
    `${repoRoot}apps/web/.env.local`,
    `${repoRoot}apps/app/.env`,
    `${repoRoot}apps/app/.env.local`,
    `${repoRoot}apps/api/.env`,
    `${repoRoot}apps/api/.env.local`,
  ]) {
    if (existsSync(candidate)) {
      try {
        process.loadEnvFile(candidate);
        log(`loaded DATABASE_URL from ${candidate.replace(repoRoot, "")}`);
        return;
      } catch {
        /* ignore malformed files */
      }
    }
  }
}

/** host/db/user for logs — never prints the password. */
export function describeTarget(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.port ? `:${parsed.port}` : ""}/${parsed.pathname.replace(/^\//, "")} (user: ${parsed.username || "?"})`;
  } catch {
    return "UNPARSEABLE DATABASE_URL — expected postgresql://USER:PASSWORD@HOST:5432/DBNAME";
  }
}

/**
 * Classify a connection error: Prisma hides the cause behind an empty
 * message + [Object], so classify from message AND driver error code.
 */
export function classifyDbError(error) {
  const text = `${error?.code ?? ""} ${error?.message || String(error)}`;
  if (/28P01|password authentication failed|credentials .* not valid|Authentication failed/i.test(text)) {
    return "auth";
  }
  if (/ECONNREFUSED|ENOTFOUND|ETIMEDOUT|28P01|timeout|terminating|expired|does not exist/i.test(text)) {
    return "network";
  }
  return "other";
}
