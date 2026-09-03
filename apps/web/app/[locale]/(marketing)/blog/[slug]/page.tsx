import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { blog } from "@repo/cms";
import { Body } from "@repo/cms/components/body";
import { CodeBlock } from "@repo/cms/components/code-block";
import { Feed } from "@repo/cms/components/feed";
import { Image } from "@repo/cms/components/image";
import { TableOfContents } from "@repo/cms/components/toc";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { getSiteUrl } from "@/lib/site-url";

const url = new URL(getSiteUrl());

interface BlogPostProperties {
  readonly params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: BlogPostProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = await blog.getPost(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post._title ?? "",
    description: post.description ?? "",
    image: post.image?.url,
  });
};

const BlogPostPage = async ({ params }: BlogPostProperties) => {
  const { slug } = await params;

  // Tokenless deployments have no CMS content — 404 instead of letting the
  // BaseHub Pump throw "Token not found" during render.
  const exists = await blog.getPost(slug);
  if (!exists) {
    notFound();
  }

  return (
    <Feed queries={[blog.postQuery(slug)]}>
      {async ([data]) => {
        "use server";

        const post = data.blog.posts.item;

        if (!post) {
          notFound();
        }

        const jsonLd = {
          "@type": "BlogPosting",
          "@context": "https://schema.org",
          absoluteUrl: `${url}blog/${slug}`,
          headline: post._title,
          datePublished: post.date,
          author: {
            "@type": "Person",
            givenName: post.authors[0]?._title,
            url: post.authors[0]?.xUrl,
          },
          image: post.image?.url,
        } as any; // CMS boundary: post fields are untyped passthroughs

        return (
          <div className="container max-w-5xl py-16">
            <JsonLd code={jsonLd} />
            <Link
              className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
              href="/blog"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Blog
            </Link>
            <h1 className="scroll-m-20 text-balance font-extrabold text-4xl tracking-tight lg:text-5xl">
              {post._title}
            </h1>
            <p className="text-balance leading-7 [&:not(:first-child)]:mt-6">
              {post.description}
            </p>
            <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row">
              <div className="sm:flex-1">
                <div className="prose prose-neutral dark:prose-invert">
                  <Body
                    components={{
                      pre: ({ code, language }) => (
                        <CodeBlock
                          snippets={[{ code, language }]}
                          theme="vesper"
                        />
                      ),
                    }}
                    content={post.body.json.content}
                  />
                </div>
              </div>
              <div className="sticky top-24 hidden shrink-0 md:block">
                <Sidebar
                  date={new Date(post.date)}
                  readingTime={`${post.body.readingTime} min read`}
                  toc={<TableOfContents data={post.body.json.toc} />}
                />
              </div>
            </div>
          </div>
        );
      }}
    </Feed>
  );
};

export default BlogPostPage;
