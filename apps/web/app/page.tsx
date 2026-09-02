import { redirect } from "next/navigation";

/**
 * Localeless root: `/` has no page of its own (all pages live under
 * `[locale]`). Middleware normally redirects `/` to the detected locale,
 * but if the middleware chain is inert (e.g. Clerk partially configured on
 * a deployment), this real route guarantees the root never 404s.
 */
export default function RootPage() {
  redirect("/fr");
}
