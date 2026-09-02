#!/usr/bin/env node
/**
 * Sandbox/CI patch: let Prisma CLI skip downloading the Rust `schema-engine`
 * binary when network access to binaries.prisma.sh is unavailable.
 *
 * - `prisma generate` does NOT need that binary in Prisma 7 (the query
 *   compiler is WASM and ships in the npm package).
 * - `prisma db push` / `migrate` DO need it. In restricted environments,
 *   apply DDL with `scripts/schema.sql` instead (see docs/Roadmap.md).
 *
 * Usage:
 *   node scripts/patch-prisma-sandbox.mjs   # idempotent
 *   PRISMA_SKIP_ENGINE_DOWNLOAD=1 npx prisma generate
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const enginesPath = require.resolve("@prisma/engines/dist/index.js");
let src = readFileSync(enginesPath, "utf8");

const marker = "PRISMA_SKIP_ENGINE_DOWNLOAD";
if (src.includes(marker)) {
  console.log("[patch-prisma-sandbox] already applied");
  process.exit(0);
}

const anchor = "async function ensureNeededBinariesExist({ download }) {";
if (!src.includes(anchor)) {
  console.error("[patch-prisma-sandbox] anchor not found — Prisma version changed?");
  process.exit(1);
}

src = src.replace(
  anchor,
  `${anchor}
  if (process.env.${marker} === "1") {
    debug("skipping engine download (${marker}=1)");
    return;
  }`
);

writeFileSync(enginesPath, src);
console.log("[patch-prisma-sandbox] patched", enginesPath);
