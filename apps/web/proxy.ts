import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/proxy";
import { createNEMO } from "@rescale/nemo";
import createIntlMiddleware from "next-intl/middleware";
import { type NextFetchEvent, type NextProxy, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

const intlMiddleware = createIntlMiddleware({
  locales: ["fr", "en", "ar"],
  defaultLocale: "fr",
});

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  matcher: [
    "/((?!_next/static|_next/image|ingest|favicon.ico|robots.txt|sitemap.xml|api/bookings|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Custom middleware for Arcjet security checks
const arcjetMiddleware = async (request: NextRequest) => {
  if (!env.ARCJET_KEY) {
    return;
  }

  try {
    await secure(
      [
        // See https://docs.arcjet.com/bot-protection/identifying-bots
        "CATEGORY:SEARCH_ENGINE", // Allow search engines
        "CATEGORY:PREVIEW", // Allow preview links to show OG images
        "CATEGORY:MONITOR", // Allow uptime monitoring services
      ],
      request
    );
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
};

// Compose non-Clerk middleware with Nemo
const composedMiddleware = createNEMO(
  {},
  {
    before: [arcjetMiddleware],
  }
);

// Public chain: i18n redirect, security headers, Arcjet
const publicChain = async (request: NextRequest, event: NextFetchEvent) => {
  // i18n: redirect / → /fr (or detected locale) before anything else
  const intlResponse = intlMiddleware(request as unknown as Parameters<typeof intlMiddleware>[0]);
  if (intlResponse) {
    // Rebuild the redirect URL when the request passed through a proxy that
    // forwards the original host (sandbox previews, CDNs). next-intl derives
    // the URL from the Host header, which behind such proxies is the internal
    // one. Stays absolute: relative Locations crash the Next dev server.
    const location = intlResponse.headers.get("location");
    const forwardedHost = request.headers.get("x-forwarded-host");
    if (location && forwardedHost) {
      try {
        const url = new URL(location, request.url);
        if (url.host !== forwardedHost) {
          url.protocol = request.headers.get("x-forwarded-proto") ?? "https";
          url.host = forwardedHost;
          url.port = "";
          intlResponse.headers.set("location", url.toString());
        }
      } catch {
        // keep original location
      }
    }
    return intlResponse;
  }

  // Run security headers
  const headersResponse = securityHeaders();

  // Run composed middleware (arcjet)
  const middlewareResponse = await composedMiddleware(request, event);

  return middlewareResponse || headersResponse;
};

// The proxy chain runs standalone: every page is currently public (guest
// booking flow). Wrapping it in clerkMiddleware is only correct when Clerk is
// fully configured AND its callback actually runs — on Vercel deployments with
// a publishable key but no/invalid secret, clerkMiddleware never invokes the
// callback and every unprefixed route 404s. Re-introduce Clerk here only when
// building authenticated features, and verify `/` redirects on a real
// deployment before promoting it.
export default publicChain as unknown as NextProxy;
