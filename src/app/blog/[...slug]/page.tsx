import { notFound } from 'next/navigation';
import { createBlogBreadcrumbs, getBlogContent } from '@/features/blog/lib';
import { ContentDisplay, TableOfContentsCard } from '@/features/content';
import {
  BlogCategoryCard,
  LatestPostsCard,
  RelatedPostsCard,
  TagCloudCard,
} from '@/features/blog/components';
import { ThreeColumnLayout } from '@/features/layout';
import ClientMDXRenderer from '@/components/mdx/ClientMDXRenderer';
import { TwikooComment } from '@/features/comment';
import { handleContentError } from '@/lib/error-utils';

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
    const title = frontmatter.title ?? slug.join('/');
    const date = frontmatter.date
      ? new Date(frontmatter.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : undefined;
    const updatedAt = frontmatter.update
      ? new Date(frontmatter.update).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : undefined;
    // 左侧边栏内容
    const leftSidebar = (
      <>
        <BlogCategoryCard
          categories={allCategories}
          selectedCategory={frontmatter.category}
          enableRouting
        />
        <TagCloudCard allTags={allTags} selectedTag={undefined} useDefaultRouting />
      </>
    );

    // 右侧边栏内容
    const rightSidebar = (
      <>
        <TableOfContentsCard headings={headings} className="prose-sm" />
        <RelatedPostsCard posts={relatedPosts} currentSlug={slug.slice(1)} />
        <LatestPostsCard posts={latestPosts} currentSlug={slug.slice(1)} />
      </>
    );

    return (
      <div className="min-h-screen bg-background">
        <ThreeColumnLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
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
    handleContentError(error, 'blog', slugParam.join('/'));

    // 统一使用 notFound() 处理所有 404 错误
    return notFound();
  }
}
