---
name: add-analytics-event
description: Triggered when a new user action needs to be tracked with PostHog
---

# Add Analytics Event

## Step 1: Name the event
Follow the convention: `"<Entity> <Past-tense verb>"` (e.g. `"Booking Created"`, `"Plan Upgraded"`)

## Step 2: Choose server vs client

**Server (webhook handler, server action):**
```ts
import { analytics } from '@repo/analytics/server';
analytics?.capture({ event: 'Booking Created', distinctId: userId, properties: { plan } });
await analytics?.shutdown(); // required in serverless handlers
```

**Client (browser interaction):**
```ts
import { useAnalytics } from '@repo/analytics';
const { capture } = useAnalytics();
capture('Booking Created', { plan });
```

## Step 3: Identify the user first (if new context)
```ts
analytics?.identify({ distinctId: userId, properties: { email, name } });
```

## Step 4: Verify
- Use optional chaining — PostHog may not be configured in all environments
- Never put PII (raw email, phone) directly in event properties unless explicitly required
