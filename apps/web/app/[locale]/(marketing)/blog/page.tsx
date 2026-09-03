import { blog } from "@repo/cms";
import { createMetadata } from "@repo/seo/metadata";
import type { Blog, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

interface BlogProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({ params }: BlogProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "web.blog.meta" });
  return createMetadata({ title: t("title"), description: t("description") });
};

const BlogIndex = async ({ params }: BlogProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "web.blog" });

  // Returns [] when the CMS is not configured — the empty state renders.
  const posts = await blog.getPosts();

  const jsonLd: WithContext<Blog> = {
    "@type": "Blog",
    "@context": "https://schema.org",
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <main className="min-h-screen bg-bb-cream">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
          <div className="mb-12 max-w-2xl">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso lg:text-5xl">
              {t("meta.title")}
            </h1>
          </div>

          {posts.length === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-[1.75rem] border-2 border-dashed border-bb-cream-border bg-white p-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-bb-gold-muted">
                <span className="material-symbols-outlined text-3xl text-bb-espresso-gold">
                  edit_note
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-bb-espresso">
                {t("emptyTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-bb-on-surface-muted">
                {t("emptyText")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {posts.map((post, index) => (
                <Link
                  key={post._slug}
                  href={`/${locale}/blog/${post._slug}`}
                  className={
                    index === 0
                      ? "group flex flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-bb-cream-border bg-white p-6 transition-shadow hover:shadow-[var(--bb-shadow-onboarding)] md:col-span-2"
                      : "group flex flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-bb-cream-border bg-white p-6 transition-shadow hover:shadow-[var(--bb-shadow-onboarding)]"
                  }
                >
                  {post.image?.url && (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                      <Image
                        src={post.image.url}
                        alt={post.image.alt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <p className="text-sm text-bb-on-surface-muted">
                    {post.date
                      ? new Date(post.date).toLocaleDateString(locale, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-bb-espresso group-hover:text-bb-espresso-gold">
                    {post._title}
                  </h2>
                  <p className="text-sm leading-relaxed text-bb-on-surface-muted">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default BlogIndex;
