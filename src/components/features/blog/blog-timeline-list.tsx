'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTimelinePosts } from '@/hooks/use-blog';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 博客时间轴列表组件属性
 */
export interface BlogTimelineListProps {
  /**
   * 最大显示年份数量
   * @default Infinity
   */
  limit?: number;
}

/**
 * 按月份分组的文章类型
 */
export interface PostsByMonth {
  [month: string]: {
    date: Date;
    posts: any[];
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
  const { postsByYear, loading, error } = useTimelinePosts();
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});

  // 切换年份展开/折叠状态
  const toggleYearExpand = (year: string) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  // 加载状态
  if (loading) {
    return (
      <div className="col-span-full text-center py-10">
        <p>加载中...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-destructive">加载失败: {error.message}</p>
      </div>
    );
  }

  // 空状态
  const years = Object.keys(postsByYear);
  if (years.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p>暂无博客文章</p>
      </div>
    );
  }

  // 按年份排序（从新到旧）
  const sortedYears = years.sort((a, b) => parseInt(b) - parseInt(a));

  // 限制显示年份数量
  const displayYears = limit < Infinity ? sortedYears.slice(0, limit) : sortedYears;

  // 按月份分组文章（暂时未使用，但保留以备将来按月份显示文章）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupPostsByMonth = (posts: any[]) => {
    const postsByMonth: PostsByMonth = {};

    posts.forEach(post => {
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
  const getPostCountByYear = (year: string) => {
    return postsByYear[year].length;
  };

  // 格式化日期为 MM-DD 格式
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '未知日期';

    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  };

  return (
    <div className="relative flex justify-center">
      <div className="relative w-full max-w-[600px]">
        {/* 时间轴线 */}
        <div className="absolute left-[120px] top-0 bottom-0 w-[2px] bg-border opacity-70"></div>

        {displayYears.map(year => {
          const isExpanded = expandedYears[year] !== false; // 默认展开
          const postCount = getPostCountByYear(year);

          // 注意：这里暂时不使用按月份分组的功能，但保留代码以备将来使用
          // const postsByMonth = groupPostsByMonth(postsByYear[year]);

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

                <div className="absolute left-[120px] -translate-x-1/2 w-4 h-4 rounded-full border-[3px] border-primary bg-background z-10 group-hover:scale-125 transition-transform"></div>

                <div className="ml-10 flex items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {postCount}篇文章
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-5">
                  {postsByYear[year].map((post, postIndex) => {
                    const date = formatDate(post.date);

                    return (
                      <div
                        key={post.slug}
                        className="flex items-start group hover:bg-muted/30 rounded-md py-1 px-2 -mx-2"
                      >
                        {/* 日期 */}
                        <div className="w-[100px] text-right mr-10 relative group-hover:text-primary">
                          <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary">
                            {date}
                          </span>
                          <div className="absolute left-[120px] -translate-x-1/2 top-[10px] w-1.5 h-1.5 rounded-full border border-primary bg-background"></div>
                        </div>

                        {/* 文章标题 */}
                        <div className="flex-1">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-sm sm:text-base font-medium hover:text-primary"
                          >
                            {post.title}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
