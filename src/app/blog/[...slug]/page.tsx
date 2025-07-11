import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb/breadcrumb";
import { createBlogBreadcrumbs } from "@/components/common/breadcrumb/breadcrumb-utils";
import { ContentDisplay } from "@/components/common/content-display";
import { RelatedPosts } from "@/components/layout/common/related-posts";
import { TableOfContents } from "@/components/layout/toc/table-of-contents";
import { NAVBAR_HEIGHT } from "@/config/layout";
import { ContentRenderer } from "@/components/layout/common/ContentRenderer";
import { MDXCodeEnhance } from "@/components/mdx/mdx-code-enhance";
import { getBlogContent } from "@/lib/content/get-blog-content";
import React from "react";

// 如需 generateMetadata，可用 getBlogContent 获取 frontmatter

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  try {
    const resolvedParams = await params;
    const { slug, content, frontmatter, headings, relatedPosts } =
      await getBlogContent(resolvedParams.slug);
    const title = frontmatter.title || slug.join("/");
    const date = frontmatter.date
      ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
    return (
      <div className="min-h-screen bg-background">
        <MDXCodeEnhance />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center gap-10">
            <aside className="sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto lg:block">
              <RelatedPosts posts={relatedPosts} currentSlug={slug.slice(1)} />
            </aside>

            <main className="max-w-4xl min-w-0 flex-1">
              <div>
                <div className="mb-6">
                  <Breadcrumb
                    items={createBlogBreadcrumbs({
                      slug: slug.slice(1),
                      title,
                    })}
                  />
                </div>
                <ContentDisplay
                  contentType="blog"
                  title={title}
                  date={date}
                  category={frontmatter.category}
                  tags={frontmatter.tags || []}
                  wordCount={content.length}
                >
                  <ContentRenderer content={content} />
                </ContentDisplay>
              </div>
            </main>

            <aside className="sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto px-4 [overflow-wrap:break-word] [word-break:break-all] [white-space:normal] xl:block">
              <TableOfContents
                headings={headings}
                adaptive={true}
                adaptiveOffset={NAVBAR_HEIGHT}
              />
            </aside>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
