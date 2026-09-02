---
name: add-notification
description: Triggered when adding an in-app notification using Knock Labs
---

# Add In-App Notification

## Step 1: Understand the trigger
- Notifications are sent from server actions or webhook handlers
- Import: `import { trigger } from '@repo/notifications'`

## Step 2: Trigger the notification
```ts
import { trigger } from '@repo/notifications';

await trigger({
  workflow: 'booking-confirmed',
  recipients: [{ id: userId }],
  data: { bookingId, date, barberName },
});
```

## Step 3: Add the Knock provider (if not already present)
- `packages/notifications/components/provider.tsx` wraps the client app
- Already present in `apps/app` — do not add a second provider

## Step 4: Create the workflow in Knock dashboard
- Log into Knock, create a workflow with the matching key
- Add the notification channels (in-app feed, email, push)
- Map the `data` fields to the template variables

Note: `KNOCK_SECRET_API_KEY` lives in `apps/app/.env.local`. The public key `NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY` is safe to expose to the client.
