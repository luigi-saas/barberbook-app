import { legal } from "@repo/cms";
import { Body } from "@repo/cms/components/body";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface LegalPageProperties {
  readonly params: Promise<{ locale: string; slug: string }>;
}

const FALLBACK_SLUGS = ["privacy", "terms"] as const;
type FallbackSlug = (typeof FALLBACK_SLUGS)[number];

export const generateMetadata = async ({
  params,
}: LegalPageProperties): Promise<Metadata> => {
  const { locale, slug } = await params;

  // CMS content wins when configured; otherwise the local fallback titles.
  const post = await legal.getPost(slug).catch(() => null);
  if (post?._title) {
    return createMetadata({
      title: post._title,
      description: post.description ?? "",
    });
  }
  if ((FALLBACK_SLUGS as readonly string[]).includes(slug)) {
    const t = await getTranslations({ locale, namespace: `web.legal.${slug}` });
    return createMetadata({ title: t("title"), description: t("description") });
  }
  return {};
};

const LegalPage = async ({ params }: LegalPageProperties) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "web.legal" });

  const cmsPost = await legal.getPost(slug).catch(() => null);

  // CMS-backed page (BaseHub configured + slug exists there)
  if (cmsPost?.body?.json?.content) {
    return (
      <main className="min-h-screen bg-bb-cream">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href={`/${locale}`}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-bb-on-surface-muted transition hover:text-bb-espresso"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            {t("back")}
          </Link>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
            {cmsPost._title}
          </h1>
          <p className="mt-3 text-bb-on-surface-muted">{cmsPost.description}</p>
          <div className="mt-10 rounded-[1.75rem] border border-bb-cream-border bg-white p-8 leading-relaxed text-bb-espresso/85 lg:p-10">
            {/* CMS boundary: content shape is validated by the CMS schema */}
            <Body content={cmsPost.body.json.content as any} />
          </div>
        </div>
      </main>
    );
  }

  // Local fallback (privacy / terms) — no CMS required
  if ((FALLBACK_SLUGS as readonly string[]).includes(slug)) {
    const content = t.raw(`${slug}.body`) as string[];
    return (
      <main className="min-h-screen bg-bb-cream">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href={`/${locale}`}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-bb-on-surface-muted transition hover:text-bb-espresso"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            {t("back")}
          </Link>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
            {t(`${slug}.title`)}
          </h1>
          <p className="mt-3 text-bb-on-surface-muted">{t(`${slug}.description`)}</p>
          <div className="mt-10 flex flex-col gap-5 rounded-[1.75rem] border border-bb-cream-border bg-white p-8 leading-relaxed text-bb-espresso/85 lg:p-10">
            {content.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </main>
    );
  }

  notFound();
};

export default LegalPage;
