---
name: add-shadcn-component
description: Triggered when a shadcn/ui component is needed that doesn't exist yet in @repo/design-system
---

# Add shadcn/ui Component

## Step 1: Check if it already exists
- Look in `packages/design-system/components/ui/` for the component
- If it exists, import from `@repo/design-system` — do not reinstall

## Step 2: Install the component
```bash
npx shadcn@latest add <component-name> -c packages/design-system
```

## Step 3: Verify the output
- Confirm the file was created in `packages/design-system/components/ui/`
- Check that it exports correctly from `packages/design-system/index.ts`

## Step 4: Use it
- Import: `import { ComponentName } from '@repo/design-system'`
- Never import directly from `packages/design-system/components/ui/` in apps
