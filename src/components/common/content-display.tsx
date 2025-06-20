import React from 'react';
import { Calendar, Calculator, FolderKanban, Tag as TagIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils';

/**
 * 内容显示组件的类型
 */
export type ContentType = 'blog' | 'docs';

/**
 * 内容显示组件属性
 */
export interface ContentDisplayProps {
  /**
   * 内容类型：博客或文档
   */
  contentType: ContentType;

  /**
   * 文章标题
   */
  title: string;

  /**
   * 发布日期
   */
  date?: string | null;

  /**
   * 分类
   */
  category?: string;

  /**
   * 标签
   */
  tags?: string[];

  /**
   * 字数统计
   */
  wordCount?: number;

  /**
   * 渲染后的 MDX 内容
   */
  children?: React.ReactNode;

  /**
   * 自定义根元素类名
   */
  className?: string;
}

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
    const base = contentType === 'blog' ? '/blog' : '/docs';
    return `${base}?tag=${encodeURIComponent(tag)}`;
  };

  // 获取分类链接
  const getCategoryLink = () => {
    const base = contentType === 'blog' ? '/blog' : '/docs';
    return `${base}?category=${encodeURIComponent(category || '')}`;
  };

  return (
    <article className={cn('prose-container', className)}>
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">{title}</h1>
        <div className="flex flex-wrap items-center gap-y-2 text-sm text-muted-foreground font-medium">
          {/* 发布日期 */}
          {date && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <time>{date}</time>
            </div>
          )}

          {/* 分类 */}
          {category && (
            <>
              <div className="mx-2 text-muted-foreground/50">|</div>
              <Link
                href={getCategoryLink()}
                className="flex items-center hover:text-primary transition-colors"
              >
                <FolderKanban className="h-4 w-4 mr-1" />
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
                    className="px-3 py-1.5 bg-muted rounded-xl text-xs font-medium 
                             hover:bg-primary/10 hover:text-primary transition-all 
                             shadow-sm hover:shadow-md"
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
                <Calculator className="h-4 w-4 mr-1" />
                <span>{wordCount} 字</span>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none prose-img:rounded-xl">
        {children}
      </div>
    </article>
  );
}
