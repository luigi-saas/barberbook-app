---
name: prisma-schema-change
description: Triggered when modifying packages/database/prisma/schema.prisma — runs the full migrate cycle
---

# Prisma Schema Change

## Step 1: Read current schema
- Open `packages/database/prisma/schema.prisma`
- Understand the existing models before making any change

## Step 2: Apply the change
- Add/modify models, fields, or relations
- Always include `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` on new models
- Use `@neondatabase/serverless` compatible types only

## Step 3: Migrate
```bash
bun run migrate
```
This runs: `prisma format` → `prisma generate` → `prisma migrate dev`

## Step 4: Verify
- Confirm `packages/database/prisma/generated/` was updated
- Check for TypeScript errors in files that import from `@repo/database`

## Warning
Never run `prisma migrate reset` without explicit user confirmation — it drops all data.
