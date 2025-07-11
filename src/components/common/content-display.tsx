import React from "react";
import {
  Calendar,
  Calculator,
  FolderKanban,
  Tag as TagIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ContentDisplayProps } from "@/types";

export type { ContentType } from "@/types";

/**
 * 内容显示组件
 *
 * 用于显示博客文章或文档的主要内容，包括标题、元数据和正文
 *
 * @example
 * ```tsx
 * <ContentDisplay
 *   contentType="blog"
 *   title="Hello World"
 *   date="2023-01-01"
 *   category="技术"
 *   tags={["JavaScript", "React"]}
 *   wordCount={1000}
 * >
 *   <MDXContent />
 * </ContentDisplay>
 * ```
 */
export function ContentDisplay({
  contentType,
  title,
  date,
  category,
  tags = [],
  wordCount = 0,
  children,
  className,
}: ContentDisplayProps) {
  // 获取标签链接基础路径
  const getTagLink = (tag: string) => {
    const base = contentType === "blog" ? "/blog" : "/docs";
    return `${base}?tag=${encodeURIComponent(tag)}`;
  };

  // 获取分类链接
  const getCategoryLink = () => {
    const base = contentType === "blog" ? "/blog" : "/docs";
    return `${base}?category=${encodeURIComponent(category || "")}`;
  };

  return (
    <article className={cn("prose-container", className)}>
      <header className="mb-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-y-2 text-sm font-medium text-muted-foreground">
          {/* 发布日期 */}
          {date && (
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <time>{date}</time>
            </div>
          )}

          {/* 分类 */}
          {category && (
            <>
              <div className="mx-2 text-muted-foreground/50">|</div>
              <Link
                href={getCategoryLink()}
                className="flex items-center transition-colors hover:text-primary"
              >
                <FolderKanban className="mr-1 h-4 w-4" />
                <span>{category}</span>
              </Link>
            </>
          )}

          {/* 标签 */}
          {tags.length > 0 && (
            <>
              <div className="mx-2 text-muted-foreground/50">|</div>
              <div className="flex flex-wrap items-center gap-2">
                <TagIcon className="h-4 w-4" />
                {tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={getTagLink(tag)}
                    className="rounded-xl bg-muted px-3 py-1.5 text-xs font-medium transition-all hover:bg-primary/10 hover:text-primary hover:shadow-md"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* 字数统计 */}
          {wordCount > 0 && (
            <>
              <div className="mx-2 text-muted-foreground/50">|</div>
              <div className="flex items-center">
                <Calculator className="mr-1 h-4 w-4" />
                <span>{wordCount} 字</span>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="prose max-w-none prose-zinc dark:prose-invert prose-img:rounded-xl">
        {children}
      </div>
    </article>
  );
}
