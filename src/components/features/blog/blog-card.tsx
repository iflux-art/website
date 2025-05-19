"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

/**
 * 博客卡片组件属性
 *
 * @interface BlogCardProps
 */
interface BlogCardProps {
  /**
   * 博客文章数据
   */
  post: BlogPost;

  /**
   * 索引，用于动画延迟
   */
  index: number;
}

/**
 * 博客卡片组件
 *
 * 用于显示博客列表中的文章卡片，包括标题、日期、摘要和标签
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
export function BlogCard({ post, index }: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      // 添加淡入动画
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';

      const timeout = setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100); // 延迟时间与索引相关

      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        {post.date && (
          <p className="text-sm text-muted-foreground mb-2">
            {new Date(post.date).toLocaleDateString('zh-CN')}
          </p>
        )}
        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag, tagIndex) => (
              <Link
                key={tagIndex}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className="px-1.5 py-0.5 bg-muted rounded text-xs hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary hover:underline"
        >
          阅读全文 →
        </Link>
      </div>
    </article>
  );
}
