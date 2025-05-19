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
export function BlogList({ limit = Infinity }: BlogListProps) {
  const { posts, loading, error } = useBlogPosts();
  
  // 加载状态
  if (loading) {
    return (
      <div className="col-span-full text-center py-10">
        <p>加载中...</p>
      </div>
    );
  }
  
  // 错误状态
  if (error) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-destructive">加载失败: {error.message}</p>
      </div>
    );
  }
  
  // 空状态
  if (posts.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p>暂无博客文章</p>
      </div>
    );
  }
  
  // 限制显示数量
  const displayPosts = limit < Infinity ? posts.slice(0, limit) : posts;
  
  return (
    <>
      {displayPosts.map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} />
      ))}
    </>
  );
}
