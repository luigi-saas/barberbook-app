import { authMiddleware } from "@repo/auth/proxy";
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
    "/((?!_next/static|_next/image|ingest|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
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
    // Keep the Location relative so redirects survive hosts/CDNs/proxies
    // that do not forward the original Host (sandbox previews, etc.)
    const location = intlResponse.headers.get("location");
    if (location) {
      try {
        const url = new URL(location);
        intlResponse.headers.set("location", `${url.pathname}${url.search}`);
      } catch {
        // already relative
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

// Clerk only wraps the chain when it is fully configured (server key present).
// The guest experience is public: clerkMiddleware never invokes its callback
// without a publishable key, and a publishable-only setup misbehaves in
// production — both left every unprefixed route 404-ing.
export default (process.env.CLERK_SECRET_KEY
  ? authMiddleware(async (_auth, request, event) =>
      publicChain(request as unknown as NextRequest, event)
    )
  : publicChain) as unknown as NextProxy;
