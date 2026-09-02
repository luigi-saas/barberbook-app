---
name: write-test
description: Triggered when writing unit or integration tests in apps/app using Vitest
---

# Write a Test

## Step 1: Locate the test file
- Tests live in `apps/app/__tests__/` or co-located as `<file>.test.ts` / `<file>.test.tsx`
- Config: `apps/app/vitest.config.ts` — uses jsdom environment

## Step 2: File structure
```ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName prop="value" />);
    expect(screen.getByText('expected text')).toBeInTheDocument();
  });
});
```

## Step 3: Mocking
- Mock `@repo/*` imports with `vi.mock('@repo/database', () => ({ database: { page: { findMany: vi.fn() } } }))`
- Mock `next/navigation` hooks as needed
- Never mock at the network level — mock at the module boundary

## Step 4: Run
```bash
cd apps/app && bun run test
```

## Rules
- Test behavior, not implementation — assert what the user sees, not how the code works internally
- One `describe` block per component or function
- Keep tests deterministic — no real network calls, no real database connections
