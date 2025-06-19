'use client';

import React from 'react';
import { useBlogPosts } from '@/hooks/use-blog';
import type { BlogPost } from '@/types/blog-types';
import { UnifiedCard } from '@/components/common/unified-card';
import { UnifiedGrid } from '@/components/layout/unified-grid';
/**
 * 博客列表组件属性
 *
 * @interface BlogListProps
 */
interface BlogListProps {
  /**
   * 最大显示文章数量
   * @default Infinity
   */
  limit?: number;

  /**
   * 按标签筛选
   * 如果提供，只显示包含该标签的文章
   */
  filterTag?: string | null;

  /**
   * 标签点击处理函数
   * 当用户点击文章卡片中的标签时调用
   */
  onTagClickAction?: (tag: string) => void;
}

/**
 * 博客列表组件
 *
 * 用于显示博客文章列表，支持加载状态和错误处理
 *
 * @param {BlogListProps} props - 组件属性
 * @returns {JSX.Element} 博客列表组件
 *
 * @example
 * ```tsx
 * <BlogList limit={10} />
 * ```
 */
export function BlogList({ limit = Infinity, filterTag = null, onTagClickAction }: BlogListProps) {
  const { posts } = useBlogPosts();

  // 筛选文章
  const filteredPosts = filterTag
    ? posts.filter((post: BlogPost) => post.tags && post.tags.includes(filterTag))
    : posts;

  // 限制显示数量
  const displayPosts = limit < Infinity ? filteredPosts.slice(0, limit) : filteredPosts;

  // 筛选后没有文章
  if (displayPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground font-medium text-lg">
          没有找到包含标签 "<span className="text-primary font-semibold">{filterTag}</span>" 的文章
        </p>
      </div>
    );
  }

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    // 如果当前已经在筛选这个标签，就不做任何操作
    if (filterTag === tag) return;

    // 如果父组件提供了标签点击处理函数，则调用它
    if (onTagClickAction) {
      onTagClickAction(tag);
    }
  };

  return (
    <UnifiedGrid columns={4}>
      {displayPosts.map((post: BlogPost) => (
        <UnifiedCard
          key={post.slug}
          type="blog"
          variant="default"
          title={post.title}
          description={post.description}
          href={`/blog/${post.slug}`}
          date={post.date ? new Date(post.date).toLocaleDateString('zh-CN') : undefined}
          tags={post.tags}
          featured={post.featured ?? false}
          onTagClick={handleTagClick}
          image={post.image}
        />
      ))}
    </UnifiedGrid>
  );
}
