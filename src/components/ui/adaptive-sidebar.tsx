'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TableOfContents } from '@/components/ui/table-of-contents';
import { cn } from '@/lib/utils';

/**
 * 自适应侧边栏组件属性
 */
export interface AdaptiveSidebarProps {
  /**
   * 标题项数组
   */
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 自适应侧边栏组件
 *
 * 显示文档目录，自适应视口高度
 *
 * @example
 * ```tsx
 * <AdaptiveSidebar
 *   headings={[{ id: "intro", text: "Introduction", level: 2 }]}
 * />
 * ```
 */
export function AdaptiveSidebar({ headings, className }: AdaptiveSidebarProps) {
  const tocRef = useRef<HTMLDivElement>(null);
</edit>

<origin>
  // 检测目录高度和视口高度
  useEffect(() => {
    if (!tocRef.current) return;

    // 初始化视口高度
    setViewportHeight(window.innerHeight);

    // 计算目录高度
    const updateTocHeight = () => {
      if (tocRef.current) {
        const height = tocRef.current.scrollHeight;
        setTocHeight(height);

        // 不再需要判断是否固定广告卡片，因为已经移除了广告卡片
        setIsFixed(false);
      }
    };

    // 监听窗口大小变化
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      updateTocHeight();
    };

    // 初始计算
    updateTocHeight();

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [headings]);
</origin>
<edit>
  useEffect(() => {
    // 组件更新时刷新目录
  }, [headings]);

  // 检测目录高度和视口高度
  useEffect(() => {
    if (!tocRef.current) return;

    // 初始化视口高度
    setViewportHeight(window.innerHeight);

    // 计算目录高度
    const updateTocHeight = () => {
      if (tocRef.current) {
        const height = tocRef.current.scrollHeight;
        setTocHeight(height);

        // 不再需要判断是否固定广告卡片，因为已经移除了广告卡片
        setIsFixed(false);
      }
    };

    // 监听窗口大小变化
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      updateTocHeight();
    };

    // 初始计算
    updateTocHeight();

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [headings]);

  return (
    <div className={cn('flex flex-col max-h-[calc(100vh-5rem)]', className)}>
      {/* 目录容器 */}
      <div ref={tocRef} className="overflow-y-auto scrollbar-hide flex-grow">
        {headings.length > 0 && <TableOfContents headings={headings} />}
      </div>
    </div>
  );
}