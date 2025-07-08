import { notFound } from "next/navigation";
import { ContentLoader } from "@/lib/content-loader";
import { Breadcrumb } from "@/components/common/breadcrumb/breadcrumb";
import { createBlogBreadcrumbs } from "@/components/common/breadcrumb/breadcrumb-utils";
import { ContentDisplay } from "@/components/common/content-display";
import { RelatedPosts } from "@/components/layout/blog/related-posts";
import { TableOfContents } from "@/components/layout/toc/table-of-contents";
import { extractHeadings } from "@/components/layout/toc/extract-headings";
import { NAVBAR_HEIGHT } from "@/config/layout";
import { BlogContent } from "@/components/layout/blog/BlogContent";
import { countWords } from "@/lib/utils";
import { MDXCodeEnhance } from "@/components/mdx/mdx-code-enhance";

import type { Metadata } from "next";

interface BlogFrontmatter {
  title?: string;
  description?: string;
  date?: string | Date;
  category?: string;
  tags?: string[];
}

interface RelatedPost {
  title: string;
  href: string;
  category?: string;
}

export async function generateMetadata({ params }: any) {
  const contentLoader = ContentLoader.getInstance();
  const metadata: Metadata = {};

  try {
    const resolvedParams = await params;
    const { frontmatter } = await contentLoader.getContent([
      "blog",
      ...resolvedParams.slug,
    ]);
    const safeFrontmatter = frontmatter as BlogFrontmatter;

    metadata.title = safeFrontmatter.title || "Blog Post";
    metadata.description = safeFrontmatter.description || "Blog post page";
  } catch {
    metadata.title = "Blog Post";
    metadata.description = "Blog post page";
  }

  return metadata;
}

export default async function BlogPostPage({
  params,
  searchParams: _searchParams,
}: any) {
  const contentLoader = ContentLoader.getInstance();

  try {
    // 获取主内容
    const resolvedParams = await params;
    const { slug, content, frontmatter, type } = await contentLoader.getContent(
      ["blog", ...resolvedParams.slug],
    );
    const safeFrontmatter = frontmatter as BlogFrontmatter;
    const { headings } = extractHeadings(content);

    // 获取相关文章
    const relatedItems = await contentLoader.getRelatedContent(
      slug.slice(1),
      type,
    );
    const relatedPosts: RelatedPost[] = relatedItems
      .slice(0, 5)
      .map((item) => ({
        title:
          (item.frontmatter as BlogFrontmatter).title ||
          item.slug[item.slug.length - 1],
        href: `/blog/${item.slug.join("/")}`,
        category: (item.frontmatter as BlogFrontmatter).category,
      }));

    const title = safeFrontmatter.title || slug.join("/");
    const date = safeFrontmatter.date
      ? new Date(safeFrontmatter.date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;

    return (
      <div className="min-h-screen bg-background">
        <MDXCodeEnhance />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center gap-12">
            <aside className="sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto px-4 lg:block">
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
                  category={safeFrontmatter.category}
                  tags={safeFrontmatter.tags || []}
                  wordCount={countWords(content)}
                >
                  <BlogContent content={content} frontmatter={frontmatter} />
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
