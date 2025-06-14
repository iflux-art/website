'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * 滚动区域组件
 * 提供自定义滚动条样式和行为
 */
const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="scroll-area"
        className={cn('relative overflow-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScrollArea.displayName = 'ScrollArea';

/**
 * 滚动区域视口组件
 */
const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }
>(({ className, orientation = 'vertical', ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="scroll-area-scrollbar"
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
        orientation === 'horizontal' && 'h-2.5 border-t border-t-transparent p-[1px]',
        className
      )}
      {...props}
    />
  );
});
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
