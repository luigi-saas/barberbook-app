---
name: add-ai-feature
description: Triggered when building an AI-powered feature using the Vercel AI SDK or OpenAI
---

# Add AI Feature

## Step 1: Choose the pattern
- **Streaming chat UI**: use `useChat` from `@repo/ai` (re-exports `ai/react`)
- **One-shot generation**: use `generateText` or `generateObject` from `@repo/ai` in a server action
- **Embeddings**: use `models.embeddings` from `packages/ai/lib/models.ts`

## Step 2: Import correctly
```ts
// Server action or route handler
import { generateText, streamText } from '@repo/ai';
import { models } from '@repo/ai/lib/models';

// Client component
import { useChat } from '@repo/ai/lib/react';
```

## Step 3: Build a streaming route (if needed)
Create `apps/app/app/api/ai/<feature>/route.ts`:
```ts
import { streamText } from '@repo/ai';
import { models } from '@repo/ai/lib/models';

export const POST = async (req: Request) => {
  const { messages } = await req.json();
  const result = streamText({ model: models.chat, messages });
  return result.toDataStreamResponse();
};
```

## Step 4: Add auth guard
All AI routes must check auth — `await auth()` before calling any model.

## Step 5: Rate limit
Wrap the route with `@repo/rate-limit` to prevent abuse.
