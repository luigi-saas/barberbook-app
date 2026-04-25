# Add Feature Flag

Add a new feature flag using the Vercel Flags SDK.

Steps:
1. Ask for the flag name in camelCase (e.g. `showNewBookingFlow`)
2. Open `packages/feature-flags/index.ts`
3. Add: `export const showNewBookingFlow = createFlag('showNewBookingFlow')`
4. Use the flag in a server component only:
   ```ts
   import { showNewBookingFlow } from '@repo/feature-flags';
   const enabled = await showNewBookingFlow();
   ```
5. Never evaluate flags in client components or middleware
6. Remind the user to add the flag key in the Vercel dashboard under the project's Flags configuration

Note: Flags are boolean by default. The `createFlag` utility handles graceful fallback to `false` when not configured.
