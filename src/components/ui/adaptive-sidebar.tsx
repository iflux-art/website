'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TableOfContents } from '@/components/ui/table-of-contents';
import { cn } from '@/lib/utils';

export interface AdaptiveSidebarProps {
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
  className?: string;
}

export function AdaptiveSidebar({ headings, className }: AdaptiveSidebarProps) {
  const tocRef = useRef<HTMLDivElement>(null);
  // TODO: 这些状态变量将用于实现侧边栏的自适应定位功能：
  // - isFixed: 控制侧边栏是否固定定位
  // - tocHeight: 跟踪目录实际高度以适应内容
  // - viewportHeight: 监控视口高度以调整显示方式
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [isFixed, setIsFixed] = useState(false);
  const [tocHeight, setTocHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  useEffect(() => {
    if (!tocRef.current) return;

    // 初始化视口高度
    setViewportHeight(window.innerHeight);

    // 计算目录高度
    const updateTocHeight = () => {
      if (tocRef.current) {
        const height = tocRef.current.scrollHeight;
        setTocHeight(height);
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
    <div ref={tocRef} className={cn("relative w-full", className)}>
      <TableOfContents headings={headings} />
    </div>
  );
}