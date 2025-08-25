import React from 'react';
import { cn } from '@/utils';
import type { ThreeColumnGridProps } from '@/types';
export type { ThreeColumnGridProps } from '@/types';
import { getMainContentClasses, getSidebarClasses } from '@/lib/layout/layout-utils';
import { SidebarWrapper } from '@/components/layout/sidebar';

/**
 * 三栏网格布局组件
 * 只支持双侧边栏（3+6+3）和无侧边栏（12）两种布局
 */
export const ThreeColumnGrid = ({ children, sidebars }: ThreeColumnGridProps) => {
  const leftSidebars = sidebars.filter(s => s.position === 'left');
  const rightSidebars = sidebars.filter(s => s.position === 'right');
  const hasBothSidebars = leftSidebars.length > 0 && rightSidebars.length > 0;

  return (
    <div className="grid grid-cols-1 gap-4 py-6 sm:gap-6 md:grid-cols-12 md:gap-6 lg:gap-8 lg:py-8 xl:gap-10">
      {/* 左侧边栏区域 - 只在双侧边栏模式下显示 */}
      {hasBothSidebars && leftSidebars.length > 0 && (
        <div className={getSidebarClasses('left', hasBothSidebars)}>
          {leftSidebars.map((sidebar, index) => (
            <SidebarWrapper key={sidebar.id || `left-${index}`} config={sidebar}>
              {sidebar.content}
            </SidebarWrapper>
          ))}
        </div>
      )}

      {/* 主内容区域 */}
      <main
        className={cn(getMainContentClasses(leftSidebars.length > 0, rightSidebars.length > 0))}
      >
        {children}
      </main>

      {/* 右侧边栏区域 - 只在双侧边栏模式下显示 */}
      {hasBothSidebars && rightSidebars.length > 0 && (
        <div className={getSidebarClasses('right', hasBothSidebars)}>
          {rightSidebars.map((sidebar, index) => (
            <SidebarWrapper key={sidebar.id || `right-${index}`} config={sidebar}>
              {sidebar.content}
            </SidebarWrapper>
          ))}
        </div>
      )}
    </div>
  );
};
