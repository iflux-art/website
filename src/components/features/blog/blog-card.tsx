'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/hooks/use-blog';

/**
 * 博客卡片组件属性
 */
export interface BlogCardProps {
  /**
   * 博客文章数据
   */
  post: BlogPost;

  /**
   * 索引，用于动画延迟
   */
  index: number;

  /**
   * 标签点击处理函数
   * 如果提供，则标签点击时调用此函数而不是导航到标签页面
   */
  onTagClick?: (tag: string) => void;
}

/**
 * 博客卡片组件
 *
 * 用于显示博客列表中的文章卡片，包括标题、日期、摘要和标签
 * 使用 AnimatedCard 组件实现动画效果
 *
 * @param {BlogCardProps} props - 组件属性
 * @returns {JSX.Element} 博客卡片组件
 *
 * @example
 * ```tsx
 * <BlogCard
 *   post={{
 *     slug: "hello-world",
 *     title: "Hello World",
 *     excerpt: "This is my first blog post",
 *     date: "2023-01-01",
 *     tags: ["blog", "intro"]
 *   }}
 *   index={0}
 * />
 * ```
 */
export function BlogCard({ post, index, onTagClick }: BlogCardProps) {
  // 处理标签点击
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    if (onTagClick) {
      e.preventDefault(); // 阻止默认链接行为
      onTagClick(tag);
    }
  };

  return (
    <article className="border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full max-h-[500px] bg-card">
      <div className="p-8 h-full flex flex-col">
        <h2 className="text-xl font-bold tracking-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        {post.date && (
          <p className="text-sm text-muted-foreground mb-3">
            {new Date(post.date).toLocaleDateString('zh-CN')}
          </p>
        )}
        <p className="text-muted-foreground mb-4 flex-grow line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-[40px] overflow-hidden">
            {post.tags.slice(0, 5).map((tag, tagIndex) => (
              <Link
                key={tagIndex}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-muted rounded-lg text-xs hover:bg-primary/10 hover:text-primary transition-all shadow-sm hover:shadow-md"
                onClick={e => handleTagClick(e, tag)}
              >
                {tag}
              </Link>
            ))}
            {post.tags.length > 5 && (
              <span className="px-3 py-1.5 bg-muted rounded-lg text-xs shadow-sm">
                +{post.tags.length - 5}
              </span>
            )}
          </div>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary hover:underline mt-auto font-semibold transition-all hover:text-primary/80 flex items-center"
        >
          阅读全文 →
        </Link>
      </div>
    </article>
  );
}
