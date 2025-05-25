'use client';

import { useStickyPosition } from '@/hooks/use-sticky-position';
import { cn } from '@/lib/utils';

interface StickyLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 粘性布局组件
 * 
 * 为 sidebar 和 toc 提供统一的粘性定位
 */
export function StickyLayout({ children, className }: StickyLayoutProps) {
  const { stickyStyle } = useStickyPosition();

  return (
    <div 
      className={cn('scrollbar-hide', className)}
      style={stickyStyle}
    >
      {children}
    </div>
  );
}
