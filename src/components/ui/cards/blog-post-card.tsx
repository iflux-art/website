'use client';

import Link from 'next/link';

/**
 * 博客文章卡片组件属性
 */
export interface BlogPostCardProps {
  /**
   * 文章 slug
   */
  slug: string;

  /**
   * 文章标题
   */
  title: string;

  /**
   * 文章摘要
   */
  excerpt: string;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 博客文章卡片组件
 *
 * 用于显示博客文章的卡片，包含标题、摘要和阅读链接
 *
 * @example
 * ```tsx
 * <BlogPostCard
 *   slug="hello-world"
 *   title="Hello World"
 *   excerpt="This is my first blog post"
 * />
 * ```
 */
export function BlogPostCard({ slug, title, excerpt, className }: BlogPostCardProps) {
  return (
    <article
      className={`border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.05] active:scale-[0.98] ${
        className || ''
      }`}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{excerpt}</p>
        <Link href={`/blog/${slug}`} className="text-primary hover:underline">
          阅读全文 →
        </Link>
      </div>
    </article>
  );
}

/**
 * @deprecated 请使用 BlogPostCard 替代 PostCard，PostCard 将在未来版本中移除
 */
export { BlogPostCard as PostCard };
