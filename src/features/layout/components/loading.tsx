'use client';

import { useEffect, useState } from 'react';

interface LoadingProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 加载进度条的颜色主题
   */
  variant?: 'default' | 'primary' | 'secondary';
  /**
   * 是否显示加载进度百分比
   */
  showProgress?: boolean;
}

/**
 * 通用的页面加载组件
 * 提供渐进式加载进度条和可自定义的样式
 */
export function Loading({
  className = '',
  variant = 'primary',
  showProgress = false,
}: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    // 初始快速增长阶段
    const initialProgress = setTimeout(() => {
      setProgress(30);
    }, 100);

    // 渐进增长阶段
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        // 进度越高，增长越慢
        const increment = Math.max(0.5, (100 - prev) / 15);
        return Math.min(90, prev + increment);
      });
    }, 300);

    // 透明度闪烁效果
    const opacityInterval = setInterval(() => {
      setOpacity(prev => (prev === 0.8 ? 1 : 0.8));
    }, 800);

    return () => {
      clearTimeout(initialProgress);
      clearInterval(progressInterval);
      clearInterval(opacityInterval);
    };
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary dark:bg-secondary';
      case 'default':
        return 'bg-foreground dark:bg-foreground';
      default:
        return 'bg-primary dark:bg-primary';
    }
  };

  return (
    <div className={`fixed top-16 right-0 left-0 z-50 ${className}`}>
      <div className="h-1 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
        <div
          className={`h-full ${getVariantStyles()}`}
          style={{
            width: `${progress}%`,
            opacity,
            transition: 'width 300ms ease-out',
            transform: 'translateZ(0)',
            boxShadow: '0 0 12px color-mix(in srgb, var(--color-primary) 70%, transparent)',
          }}
        />
      </div>
      {showProgress && (
        <div className="absolute top-2 right-4 text-xs text-muted-foreground">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}

export default Loading;
