import Link from 'next/link';
import { FileText } from 'lucide-react';
import { RelatedPost } from '@/hooks/use-blog';

/**
 * 相关文章列表组件属性
 */
export interface RelatedPostsListProps {
  /**
   * 相关文章列表
   */
  posts: RelatedPost[];

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 相关文章列表组件
 *
 * 用于显示博客文章的相关文章列表，支持点击导航到相关文章
 *
 * @example
 * ```tsx
 * <RelatedPostsList
 *   posts={[
 *     { slug: "hello-world", title: "Hello World", excerpt: "This is my first blog post" }
 *   ]}
 * />
 * ```
 */
export function RelatedPostsList({ posts, className }: RelatedPostsListProps) {
  if (posts.length === 0) return null;

  return (
    <div className={`bg-card border-b border-b-primary/20 pb-4 overflow-hidden ${className || ''}`}>
      <div className="py-2 font-medium text-sm flex items-center gap-1.5 mb-1">
        <FileText className="h-4 w-4" />
        相关文章
      </div>
      <div className="space-y-2">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-2 rounded-md hover:bg-muted text-sm hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        ))}
        {posts.length === 0 && <span className="text-sm text-muted-foreground">暂无相关文章</span>}
      </div>
    </div>
  );
}

/**
 * @deprecated 请使用 RelatedPostsList 替代 RelatedPosts，RelatedPosts 将在未来版本中移除
 */
export { RelatedPostsList as RelatedPosts };
