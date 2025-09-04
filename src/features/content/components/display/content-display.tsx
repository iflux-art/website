import { Breadcrumb } from "@/features/navigation";
import { cn } from "@/utils";
import { Calculator, Calendar, Clock } from "lucide-react";
import React from "react";

/** 内容显示类型 */
export type ContentType = "blog" | "docs";

export interface ContentDisplayProps {
  contentType: ContentType;
  title: string;
  date?: string | null;
  updatedAt?: string | null;
  wordCount?: number;
  children?: React.ReactNode;
  className?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

/**
 * 计算预计阅读时间
 * 基于中文阅读速度约 300-400 字/分钟，英文约 200-250 词/分钟
 * 这里采用保守估计 250 字/分钟
 */
function calculateReadingTime(wordCount: number): string {
  if (wordCount === 0) return "0 分钟";

  const wordsPerMinute = 250;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) return "1 分钟";
  if (minutes < 60) return `${minutes} 分钟`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours} 小时`;
  return `${hours} 小时 ${remainingMinutes} 分钟`;
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
 *   wordCount={1000}
 * >
 *   <MDXContent />
 * </ContentDisplay>
 * ```
 */
export const ContentDisplay = ({
  title,
  date,
  updatedAt,
  wordCount = 0,
  children,
  className,
  breadcrumbs,
}: ContentDisplayProps) => {
  const readingTime = calculateReadingTime(wordCount);

  return (
    <article
      className={cn(
        "prose-container",
        // 添加卡片样式，与博客列表页的文章卡片保持一致
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        // 响应式内边距，与博客卡片保持一致
        "p-3 sm:p-4 md:p-5 lg:p-6",
        className
      )}
    >
      {/* 面包屑导航 */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-6">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <header className="mb-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <div className="flex flex-wrap items-center gap-y-2 text-sm font-medium text-muted-foreground">
          {/* 发布日期和更新日期 */}
          {(date || updatedAt) && (
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <time>
                {date && `发布于 ${date}`}
                {date && updatedAt && " · "}
                {updatedAt && `更新于 ${updatedAt}`}
              </time>
            </div>
          )}

          {/* 字数统计 */}
          {wordCount > 0 && (
            <>
              <div className="mx-2 text-muted-foreground/50">|</div>
              <div className="flex items-center">
                <Calculator className="mr-1 h-4 w-4" />
                <span>全文共计 {wordCount} 字</span>
              </div>
            </>
          )}

          {/* 预计阅读时间 */}
          {wordCount > 0 && (
            <>
              <div className="mx-2 text-muted-foreground/50">|</div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>预计阅读 {readingTime}</span>
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
};
