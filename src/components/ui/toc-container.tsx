'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Toc, type Heading } from '@/components/ui/toc';
import { cn } from '@/lib/utils';

/**
 * 目录容器组件属性
 */
export interface TocContainerProps {
  /**
   * 标题项数组
   */
  headings: Heading[];

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 目录容器组件
 *
 * 显示文档目录，自适应视口高度
 */
export function TocContainer({ headings, className }: TocContainerProps) {
  const tocRef = useRef<HTMLDivElement>(null);
  // TODO: 实现目录固定和高度自适应功能
  const [_isFixed, setIsFixed] = useState(false);
  const [_tocHeight, setTocHeight] = useState(0);
  const [_viewportHeight, setViewportHeight] = useState(0);

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
    <div className={cn('flex flex-col', className)}>
      {/* 目录容器 */}
      <div ref={tocRef} className="scrollbar-hide">
        {headings.length > 0 && <Toc headings={headings} />}
      </div>
    </div>
  );
}