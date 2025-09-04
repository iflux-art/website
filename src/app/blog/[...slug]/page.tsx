import { ThreeColumnLayout } from "@/components/layout";
import { TableOfContentsCard } from "@/features/navigation";
import ClientMDXRenderer from "@/features/content/components/mdx/client-mdx-renderer";
import {
  BlogCategoryCard,
  LatestPostsCard,
  RelatedPostsCard,
  TagCloudCard,
} from "@/features/blog/components";
import { createBlogBreadcrumbs, getBlogContent } from "@/features/blog/lib";
import { TwikooComment } from "@/features/comment";
import { ContentDisplay } from "@/features/content/components/display";
import { handleContentError } from "@/lib/error/error-utils";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug: slugParam } = await params;

  // Validate slug parameter
  if (!Array.isArray(slugParam) || slugParam.length === 0) {
    return notFound();
  }

  try {
    const resolvedParams = { slug: slugParam };
    const {
      slug,
      content,
      frontmatter,
      headings,
      relatedPosts,
      latestPosts,
      allTags,
      allCategories,
    } = await getBlogContent(resolvedParams.slug);
    const title = frontmatter.title ?? slug.join("/");
    const date = frontmatter.date
      ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
    const updatedAt = frontmatter.update
      ? new Date(frontmatter.update).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
    // 左侧边栏内容
    const leftSidebar = (
      <>
        <BlogCategoryCard
          categories={allCategories}
          selectedCategory={frontmatter.category}
          enableRouting
          showHeader={false}
        />
        <TagCloudCard allTags={allTags} selectedTag={undefined} useDefaultRouting />
      </>
    );

    // 右侧边栏内容
    const rightSidebar = (
      <>
        <TableOfContentsCard headings={headings} className="prose-sm" />
        <LatestPostsCard posts={latestPosts} currentSlug={slug.slice(1)} />
        <RelatedPostsCard posts={relatedPosts} currentSlug={slug.slice(1)} />
      </>
    );

    return (
      <div className="min-h-screen bg-background">
        <ThreeColumnLayout
          leftSidebar={leftSidebar}
          rightSidebar={rightSidebar}
          layout="double-sidebar"
        >
          <ContentDisplay
            contentType="blog"
            title={title}
            date={date}
            updatedAt={updatedAt}
            wordCount={content.length}
            breadcrumbs={createBlogBreadcrumbs({
              slug: slug.slice(1),
              title,
            })}
          >
            <ClientMDXRenderer content={content} />
          </ContentDisplay>
          <TwikooComment />
        </ThreeColumnLayout>
      </div>
    );
  } catch (error: unknown) {
    // 使用统一的错误处理工具记录错误信息
    handleContentError(error, "blog", slugParam.join("/"));

    // 统一使用 notFound() 处理所有 404 错误
    return notFound();
  }
}
