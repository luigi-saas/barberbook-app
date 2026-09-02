import { withCMS } from "@repo/cms/next-config";
import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config, withAnalyzer } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { env } from "@/env";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

let nextConfig: NextConfig = withToolbar(withLogging(config));

// Allow the sandbox preview host in dev
nextConfig.allowedDevOrigins = ["*.e2b.app"];

nextConfig.images?.remotePatterns?.push({
  protocol: "https",
  hostname: "assets.basehub.com",
});

const redirects: NextConfig["redirects"] = async () => [
  {
    source: "/legal",
    destination: "/legal/privacy",
    statusCode: 301,
  },
  {
    // Safety net for the localeless root: middleware normally redirects `/`
    // to the detected locale, but if the middleware chain is not active on
    // some deployment, this keeps the root page alive instead of 404-ing.
    // (A real root page in app/page.tsx backs this up.)
    source: "/",
    destination: "/fr",
    statusCode: 307,
  },
];

nextConfig.redirects = redirects;

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default withNextIntl(withCMS(nextConfig));
