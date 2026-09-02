# Add Cron Job

Add a new scheduled cron job to `apps/api`.

Steps:
1. Ask for the job name and schedule (e.g. `daily-reminders`, every day at 9am)
2. Create `apps/api/app/cron/<job-name>/route.ts` as a GET handler:
   ```ts
   export const GET = async () => {
     // job logic
     return NextResponse.json({ ok: true });
   };
   ```
3. Open `apps/api/vercel.json` and add the cron entry:
   ```json
   { "path": "/cron/<job-name>", "schedule": "0 9 * * *" }
   ```
4. Use `@repo/observability/log` to log job start and completion
5. Protect the route from unauthorized calls by checking the `Authorization` header matches `CRON_SECRET`

Note: Vercel cron jobs only run in production. Test locally by calling the route directly with `curl`.
