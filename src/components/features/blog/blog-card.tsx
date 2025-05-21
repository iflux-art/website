"use client";

import React from "react";
import Link from "next/link";
import { BlogCardProps } from "./blog-card.types";
import { AnimatedCard } from "@/components/ui/animated-card";

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
    <AnimatedCard
      delay={index * 0.05}
      duration={0.7}
      variant="fade"
      className="h-full"
    >
      <article className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full max-h-[500px]">
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
          {post.date && (
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(post.date).toLocaleDateString('zh-CN')}
            </p>
          )}
          <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 max-h-[40px] overflow-hidden">
              {post.tags.slice(0, 5).map((tag, tagIndex) => (
                <Link
                  key={tagIndex}
                  href={`/blog/tags/${encodeURIComponent(tag)}`}
                  className="px-1.5 py-0.5 bg-muted rounded text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={(e) => handleTagClick(e, tag)}
                >
                  {tag}
                </Link>
              ))}
              {post.tags.length > 5 && (
                <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  +{post.tags.length - 5}
                </span>
              )}
            </div>
          )}
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary hover:underline mt-auto"
          >
            阅读全文 →
          </Link>
        </div>
      </article>
    </AnimatedCard>
  );
}
