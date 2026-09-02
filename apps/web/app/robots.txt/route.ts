import { getSiteUrl } from "@/lib/site-url";

/**
 * Root-level robots.txt. (Next 16 silently drops the robots.ts metadata
 * route inside the [locale] segment — a plain route handler is reliable,
 * and robots.txt needs no locale variants anyway.)
 */
export const GET = async () => {
  const body = `User-Agent: *\nAllow: /\n\nSitemap: ${new URL(
    "/sitemap.xml",
    getSiteUrl()
  ).href}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
