'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { AdaptiveContainerProps } from '@/types/docs';

/**
 * 自适应容器高阶组件
 * 
 * 为子组件提供自适应定位功能，包括：
 * 1. 监听视口大小变化
 * 2. 计算内容高度
 * 3. 根据滚动位置自动调整定位
 */
export function AdaptiveContainer({
  children,
  className,
  adaptiveOffset = 80,
}: AdaptiveContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // 处理滚动事件
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const shouldBeFixed = rect.top <= adaptiveOffset;
      
      if (shouldBeFixed !== isFixed) {
        setIsFixed(shouldBeFixed);
      }
    };

    // 监听窗口大小变化
    const handleResize = () => {
      handleScroll();
    };

    // 初始化
    handleScroll();

    // 添加事件监听
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [adaptiveOffset, isFixed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        isFixed && 'fixed top-20 max-h-[calc(100vh-5rem)] overflow-auto pb-8',
        className
      )}
      style={{
        width: isFixed ? containerRef.current?.offsetWidth : 'auto',
      }}
    >
      {children}
    </div>
  );
}