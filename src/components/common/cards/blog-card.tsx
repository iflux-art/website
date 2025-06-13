'use client';

import React from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/components/features/blog/blog-types';

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
  _index: number;

  /**
   * 标签点击处理函数
   * 如果提供，则标签点击时调用此函数而不是导航到标签页面
   */
  onTagClick?: (tag: string) => void;
}

/**
 * 博客卡片组件
 */
export function BlogCard({ post, _index, onTagClick }: BlogCardProps) {
  // 处理标签点击
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    if (onTagClick) {
      e.preventDefault(); // 阻止默认链接行为
      onTagClick(tag);
    }
  };

  return (
    <article className="border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-card">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        {post.date && (
          <p className="text-sm text-muted-foreground mb-3">
            {new Date(post.date).toLocaleDateString('zh-CN')}
          </p>
        )}
        <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag: string, tagIndex: number) => (
              <Link
                key={tagIndex}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/30 hover:border-primary/20 text-muted-foreground hover:text-foreground rounded-md text-xs transition-all"
                onClick={e => handleTagClick(e, tag)}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary hover:underline font-semibold transition-all hover:text-primary/80 flex items-center"
        >
          阅读全文 →
        </Link>
      </div>
    </article>
  );
}
