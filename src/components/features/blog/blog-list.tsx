"use client";

import React from 'react';
import { useBlogPosts } from '@/hooks/use-blog';
import { BlogCard } from './blog-card';

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
  onTagClick?: (tag: string) => void;


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
export function BlogList({
  limit = Infinity,
  filterTag = null,
  onTagClick
}: BlogListProps) {
  const { posts, loading, error } = useBlogPosts();

  // 加载状态
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[300px] bg-muted/30 animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">加载失败: {error.message}</p>
      </div>
    );
  }

  // 空状态
  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p>暂无博客文章</p>
      </div>
    );
  }

  // 筛选文章
  const filteredPosts = filterTag
    ? posts.filter(post => post.tags && post.tags.includes(filterTag))
    : posts;

  // 限制显示数量
  const displayPosts = limit < Infinity
    ? filteredPosts.slice(0, limit)
    : filteredPosts;

  // 筛选后没有文章
  if (displayPosts.length === 0) {
    return (
      <div className="text-center py-10">
        <p>没有找到包含标签 "{filterTag}" 的文章</p>
      </div>
    );
  }

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    // 如果当前已经在筛选这个标签，就不做任何操作
    if (filterTag === tag) return;

    // 如果父组件提供了标签点击处理函数，则调用它
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  // 导入动画容器组件
  const { AnimatedContainer } = require("@/components/ui/animated-container");

  // 预先创建博客卡片列表
  const blogCards = displayPosts.map((post, index) => (
    <BlogCard
      key={post.slug}
      post={post}
      index={index}
      onTagClick={handleTagClick}
    />
  ));

  return (
    <AnimatedContainer
      baseDelay={0.1}
      staggerDelay={0.15}
      variant="fade"
      autoWrap={false}
      threshold={0.1}
      rootMargin="0px"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogCards}
      </div>
    </AnimatedContainer>
  );
}
