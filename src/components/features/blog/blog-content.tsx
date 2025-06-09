import React from 'react';
import { Calendar, Calculator } from 'lucide-react';
import Link from 'next/link';

import { countWords } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';

/**
 * 博客内容组件属性
 */
export interface BlogContentProps {
  /**
   * 文章标题
   */
  title: string;

  /**
   * 发布日期
   */
  date: string | null;

  /**
   * 文章内容（MDX 格式）- 已弃用，使用 mdxContent 代替
   */
  content?: string;

  /**
   * 渲染后的 MDX 内容
   */
  mdxContent?: React.ReactNode;

  /**
   * 文章标签
   */
  tags?: string[];

  /**
   * 文章路径，用于评论系统区分不同文章
   */
  path?: string;
}

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
  _path,
}: BlogContentProps) {
  return (
    <article>
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight mb-8">{title}</h1>
        <div className="flex flex-wrap items-center text-sm text-muted-foreground font-medium">
          {date && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <time>{date}</time>
            </div>
          )}

          {/* 分隔符 */}
          {date && tags && tags.length > 0 && (
            <div className="mx-2 text-muted-foreground/50">|</div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-muted rounded-xl text-xs font-medium hover:bg-primary/10 hover:text-primary transition-all shadow-sm hover:shadow-md"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* 分隔符 */}
          {(date || (tags && tags.length > 0)) && (
            <div className="mx-2 text-muted-foreground/50">|</div>
          )}

          {/* 字数统计 */}
          <div className="flex items-center">
            <Calculator className="h-4 w-4 mr-1" />
            <span>{content ? countWords(content) : 0} 字</span>
          </div>
        </div>
      </header>

      {mdxContent}
    </article>
  );
}