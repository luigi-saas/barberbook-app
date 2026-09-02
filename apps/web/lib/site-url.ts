/**
 * Canonical deployment host, platform-agnostic (Vercel, Render, anywhere):
 * prefers the legacy VERCEL_PROJECT_PRODUCTION_URL, then NEXT_PUBLIC_WEB_URL,
 * then localhost.
 */
export const getSiteUrl = (): string => {
  const raw =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.NEXT_PUBLIC_WEB_URL ??
    "http://localhost:3001";
  return raw.startsWith("http") ? raw : `https://${raw}`;
};
