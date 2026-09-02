/**
 * Benign service-worker response. The Vercel Toolbar (and PWA-aware browsers)
 * probe /sw.js; without this route the request falls into [locale] and used
 * to crash the i18n message loader.
 */
export const GET = async () =>
  new Response("// BarberBook: no service worker installed", {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
