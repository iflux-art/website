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
  const [_isFixed, setIsFixed] = useState(false);
  const [_tocHeight, setTocHeight] = useState(0);
  const [_viewportHeight, setViewportHeight] = useState(0);

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