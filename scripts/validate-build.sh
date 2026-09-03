#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Pre-commit build gate — replicates the Render build as closely as possible.
#
# Catches the "works on my machine" class of failures:
#   - generated artifacts from previous builds (prisma client, .next)
#   - missing workspace dependency declarations (turbo ^build tasks)
#   - dependency-package build steps (@repo/cms, @repo/database)
#
# Usage:  bash scripts/validate-build.sh [web|app|api|all]
# ---------------------------------------------------------------------------
set -euo pipefail

TARGETS=(${@:-web app})
cd "$(dirname "$0")/.."

echo "▶ [1/4] Environment checks"
if ! command -v bun >/dev/null 2>&1; then
  echo "  bun not found — npm i -g bun"; npm install -g bun --no-audit --no-fund >/dev/null
fi
for app in web app; do
  if [ ! -f "apps/$app/.env.local" ] && [ -f "apps/$app/.env.example" ]; then
    echo "  recreating apps/$app/.env.local from .env.example"
    grep -vE '^[A-Z_]+=""$' "apps/$app/.env.example" > "apps/$app/.env.local"
  fi
  # Render provides DATABASE_URL to every service (sync:false in render.yaml);
  # the booking feature imports @repo/database, so the gate needs it too.
  if ! grep -q '^DATABASE_URL=' "apps/$app/.env.local" 2>/dev/null; then
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/barberbook"' >> "apps/$app/.env.local"
  fi
done

echo "▶ [2/4] Install (fresh resolution)"
PUPPETEER_SKIP_DOWNLOAD=true bun install --no-progress

# Sandbox-only: queryCompiler Prisma without engine download.
# Harmless elsewhere; Render downloads engines normally.
export PRISMA_SKIP_ENGINE_DOWNLOAD="${PRISMA_SKIP_ENGINE_DOWNLOAD:-1}"
if [ -f scripts/patch-prisma-sandbox.mjs ]; then
  node scripts/patch-prisma-sandbox.mjs || true
fi

echo "▶ [3/4] Cleaning artifacts (fresh-clone simulation)"
rm -rf packages/database/generated
rm -rf apps/web/.next apps/app/.next apps/api/.next
rm -rf .turbo node_modules/.cache

echo "▶ [4/4] Turbo builds: ${TARGETS[*]} (with dependency tasks)"
for target in "${TARGETS[@]}"; do
  echo "── bun run build --filter $target"
  bun run build --filter "$target"
done

echo ""
echo "✅ Gate passed — safe to commit."
