---
name: create-server-action
description: Triggered when a form submission or mutation needs a server action in apps/app
---

# Create Server Action

## Step 1: Determine location
- Actions for a specific route go in `apps/app/app/<route>/actions/<name>.ts`
- Shared actions go in `apps/app/app/actions/<name>.ts`

## Step 2: File structure
```ts
'use server';

import { auth } from '@repo/auth/server';
import { database } from '@repo/database';

export async function actionName(input: InputType) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // logic here
}
```

## Step 3: Validate input
- Use Zod for all user input validation at the top of the action
- Never trust raw FormData without parsing

## Step 4: Wire up
- Call from a Client Component using the action directly or via `useTransition`
- Never expose server actions as API routes
