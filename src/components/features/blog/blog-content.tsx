import React from "react";
import { Calendar, Calculator } from "lucide-react";
import Link from "next/link";

import { countWords } from "@/lib/utils";
import { BlogContentProps } from "./blog-content.types";
import { MDXContent } from "@/components/features/content/mdx-content";

/**
 * 博客内容组件
 *
 * 用于显示博客文章的主要内容，包括标题、日期和正文
 *
 * @param {BlogContentProps} props - 组件属性
 * @returns {JSX.Element} 博客内容组件
 *
 * @example
 * ```tsx
 * <BlogContent
 *   title="Hello World"
 *   date="2023-01-01"
 *   content="# Hello World\n\nThis is my first blog post"
 * />
 * ```
 */
export function BlogContent({
  title,
  date,
  content,
  mdxContent,
  tags = [],
}: BlogContentProps) {
  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <div className="flex flex-wrap items-center text-sm text-muted-foreground">
          {date && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <time>{date}</time>
            </div>
          )}

          {/* 分隔符 */}
          {date && (tags && tags.length > 0) && (
            <div className="mx-2 text-muted-foreground/50">|</div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-2 py-0.5 bg-muted rounded-md text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* 分隔符 */}
          {((date || (tags && tags.length > 0))) && (
            <div className="mx-2 text-muted-foreground/50">|</div>
          )}

          {/* 字数统计 */}
          <div className="flex items-center">
            <Calculator className="h-4 w-4 mr-1" />
            <span>{content ? countWords(content) : 0} 字</span>
          </div>
        </div>
      </header>

      <MDXContent>
        {mdxContent}
      </MDXContent>
    </article>
  );
}