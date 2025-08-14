"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/features/blog/types";

/**
 * 简化文章列表组件属性
 */
interface SimpleArticleListProps {
  /** 要显示的文章列表 */
  posts: BlogPost[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 简化的文章列表组件
 *
 * 专门用于模态对话框中的文章展示
 * 功能特性：
 * - 只显示标题和描述
 * - 宽屏两列，窄屏一列布局
 * - 简洁的卡片设计
 * - 悬浮效果
 */
export function SimpleArticleList({
  posts,
  className,
}: SimpleArticleListProps) {
  return (
    <div
      className={cn(
        // 基础网格样式
        "grid gap-4",
        // 响应式列数：窄屏1列，宽屏2列
        "grid-cols-1 lg:grid-cols-2",
        // 自定义类名
        className,
      )}
    >
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group block"
        >
          <div className="rounded-lg border border-border bg-card p-4 transition-colors duration-200 hover:bg-accent/50">
            {/* 文章标题 */}
            <h3 className="mb-2 line-clamp-2 text-base font-semibold transition-colors group-hover:text-primary">
              {post.title}
            </h3>

            {/* 文章描述 */}
            {post.description && (
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {post.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
