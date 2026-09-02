import fs from "node:fs";
import { blog, legal } from "@repo/cms";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Root-level sitemap (canonical). The [locale] variant was moved here:
 * the intl middleware no longer redirects /sitemap.xml, and search
 * engines expect a single sitemap at the host root.
 */
export const GET = async () => {
  const appFolders = fs.readdirSync("app", { withFileTypes: true });
  const pages = appFolders
    .filter((file) => file.isDirectory())
    .filter((folder) => !folder.name.startsWith("_"))
    .filter((folder) => !folder.name.startsWith("("))
    .map((folder) => folder.name);

  const blogs = (await blog.getPosts().catch(() => [])) as { _slug?: string }[];
  const legals = (await legal.getPosts().catch(() => [])) as {
    _slug?: string;
  }[];

  const base = getSiteUrl();
  const now = new Date().toISOString();

  const entries: string[] = [`<url><loc>${new URL("/", base).href}</loc><lastmod>${now}</lastmod></url>`];

  for (const page of pages) {
    entries.push(
      `<url><loc>${new URL(page, base).href}</loc><lastmod>${now}</lastmod></url>`
    );
  }
  for (const slug of blogs) {
    if (!slug) continue;
    entries.push(
      `<url><loc>${new URL(`blog/${slug}`, base).href}</loc><lastmod>${now}</lastmod></url>`
    );
  }
  for (const slug of legals) {
    if (!slug) continue;
    entries.push(
      `<url><loc>${new URL(`legal/${slug}`, base).href}</loc><lastmod>${now}</lastmod></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
    "\n"
  )}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
