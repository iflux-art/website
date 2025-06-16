'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useTimelinePosts } from '@/hooks/use-blog';
import type { BlogPost } from '@/types/blog-types';

export interface BlogTimelineListProps {
  limit?: number;
}

/**
 * 按月份分组的文章类型
 */
export interface PostsByMonth {
  [month: string]: {
    date: Date;
    posts: BlogPost[];
  };
}

/**
 * 博客时间轴列表组件
 *
 * 用于显示按年份和月份分组的博客文章列表，支持加载状态和错误处理
 *
 * @param {BlogTimelineListProps} props - 组件属性
 * @returns {JSX.Element} 博客时间轴列表组件
 *
 * @example
 * ```tsx
 * <BlogTimelineList limit={5} />
 * ```
 */
export function BlogTimelineList({ limit = Infinity }: BlogTimelineListProps) {
  const { postsByYear } = useTimelinePosts();

  const initialExpandedState = useMemo(() => {
    if (!postsByYear) return {};
    return Object.keys(postsByYear).reduce(
      (acc, year) => {
        acc[year] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
  }, [postsByYear]);

  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>(initialExpandedState);

  const toggleYearExpand = useCallback((year: string) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  }, []);

  const sortedYears = useMemo(() => {
    if (!postsByYear) return [];
    return Object.keys(postsByYear).sort((a: string, b: string) => parseInt(b) - parseInt(a));
  }, [postsByYear]);

  const displayYears = useMemo(() => {
    return limit < Infinity ? sortedYears.slice(0, limit) : sortedYears;
  }, [sortedYears, limit]);

  // 按月份分组文章（暂时未使用，但保留以备将来按月份显示文章）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupPostsByMonth = (posts: BlogPost[]) => {
    const postsByMonth: PostsByMonth = {};

    posts.forEach((post) => {
      if (post.date) {
        const date = new Date(post.date);
        const month = date.getMonth() + 1; // 月份从0开始，所以+1
        const monthKey = month < 10 ? `0${month}` : `${month}`;

        if (!postsByMonth[monthKey]) {
          postsByMonth[monthKey] = {
            date,
            posts: [],
          };
        }

        postsByMonth[monthKey].posts.push(post);
      }
    });

    return postsByMonth;
  };

  // 获取指定年份的文章总数

  const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  });

  const formatDate = useCallback((dateString: string | undefined) => {
    if (!dateString) return '';
    return dateFormatter.format(new Date(dateString));
  }, []);

  if (!postsByYear) {
    return null;
  }

  return (
    <div className="relative flex justify-center">
      <div className="relative w-full max-w-[600px]">
        {/* 时间轴线 */}
        <div className="absolute left-[120px] top-0 bottom-0 w-[2px] bg-border opacity-70" />

        {displayYears.map((year) => {
          const isExpanded = expandedYears[year];
          const posts = postsByYear[year];

          return (
            <div key={year} className="mb-10 relative">
              {/* 年份标记 */}
              <button
                onClick={() => toggleYearExpand(year)}
                className="flex items-center mb-6 group w-full"
              >
                <div className="w-[100px] text-right">
                  <span className="text-xl sm:text-2xl font-bold text-foreground/80">{year}</span>
                </div>

                <div className="absolute left-[120px] -translate-x-1/2 w-4 h-4 rounded-full border-[3px] border-primary bg-background z-10 group-hover:scale-125 transition-transform" />

                <div className="ml-10">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {posts.length}篇文章
                  </span>
                </div>
              </button>

              <div
                className={
                  isExpanded
                    ? 'space-y-5 transition-all duration-300 opacity-100 max-h-[5000px]'
                    : 'space-y-5 transition-all duration-300 opacity-0 max-h-0 overflow-hidden'
                }
              >
                {posts.map((post) => {
                  const date = formatDate(post.date);

                  return (
                    <div
                      key={post.slug}
                      className="flex items-start group hover:bg-muted/30 rounded-md py-1 px-2 -mx-2 transition-colors"
                    >
                      {/* 日期 */}
                      <div className="w-[100px] text-right mr-10 relative group-hover:text-primary">
                        <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary">
                          {date}
                        </span>
                        <div className="absolute left-[120px] -translate-x-1/2 top-[10px] w-1.5 h-1.5 rounded-full border border-primary bg-background" />
                      </div>

                      {/* 文章标题 */}
                      <div className="flex-1">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm sm:text-base font-medium hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
