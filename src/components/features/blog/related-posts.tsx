import Link from 'next/link';
import { FileText } from 'lucide-react';
import { RelatedPost } from '@/types/blog';

/**
 * 相关文章组件属性
 *
 * @interface RelatedPostsProps
 */
interface RelatedPostsProps {
  /**
   * 相关文章列表
   */
  posts: RelatedPost[];
}

/**
 * 相关文章组件
 *
 * 用于显示博客文章的相关文章列表，支持点击导航到相关文章
 *
 * @param {RelatedPostsProps} props - 组件属性
 * @returns {JSX.Element | null} 相关文章组件，如果没有相关文章则返回 null
 *
 * @example
 * ```tsx
 * <RelatedPosts
 *   posts={[
 *     { slug: "hello-world", title: "Hello World", excerpt: "This is my first blog post" }
 *   ]}
 * />
 * ```
 */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="bg-card border-b border-b-primary/20 pb-4 overflow-hidden">
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
        {posts.length === 0 && (
          <span className="text-sm text-muted-foreground">
            暂无相关文章
          </span>
        )}
      </div>
    </div>
  );
}
