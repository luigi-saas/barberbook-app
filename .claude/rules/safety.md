# Safety Rules

- Never commit `.env`, `.env.local`, or any file containing secrets
- Never run `prisma migrate reset` without explicit user confirmation — it drops all data
- Never run `git push --force` or `git reset --hard` without explicit user confirmation
- Never edit files in `node_modules/`, `.next/`, or `prisma/generated/`
- Never edit `packages/typescript-config/` or `packages/next-config/` without asking first
- Never delete files that may be in use by multiple apps — check imports first with `grep`
- Always run `bun run lint` before committing
- Always run `bun run migrate` after editing `packages/database/prisma/schema.prisma`
