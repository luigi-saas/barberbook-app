# Database Migrate

Run a safe database migration cycle after schema changes.

Steps:
1. Read `packages/database/prisma/schema.prisma` and summarize the changes
2. Run `bun run migrate` (format + generate + db push)
3. If the command fails, show the exact error and suggest a fix
4. After success, confirm that `packages/database/prisma/generated/` was updated
5. Remind the user to restart any running `bun run dev` processes

Warning: Never run `prisma migrate reset` without explicit user confirmation — it drops all data.
