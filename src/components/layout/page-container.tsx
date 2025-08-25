import React from 'react';
import { cn } from '@/utils';
import { getContainerClassName } from '@/lib/layout/layout-utils';
import type { PageContainerProps } from '@/types';
import { ThreeColumnGrid } from './three-column-grid';

/**
 * 通用页面容器组件
 * 支持两种布局类型：
 * 1. three-column: 导航、博客列表/详情页、文档详情页的3栏布局
 * 2. full-width: 首页、友链、关于和管理后台的全屏内容区
 */
export const PageContainer = ({
  children,
  config = {},
  sidebars = [],
  className = '',
}: PageContainerProps) => {
  const { layout = 'full-width' } = config;
  const containerClassName = getContainerClassName(config);

  // 全屏布局：适用于首页、友链、关于和管理后台
  if (layout === 'full-width') {
    return (
      <div className={cn(containerClassName, 'w-full', className)}>
        <div className="container mx-auto px-4 py-6 lg:py-8">{children}</div>
      </div>
    );
  }

  // 三栏布局：适用于导航、博客列表/详情页、文档详情页
  if (layout === 'three-column' && sidebars.length > 0) {
    return (
      <div className={cn(containerClassName, className)}>
        <div className="container mx-auto px-4">
          <ThreeColumnGrid sidebars={sidebars}>{children}</ThreeColumnGrid>
        </div>
      </div>
    );
  }

  // 回退到全屏布局
  return (
    <div className={cn(containerClassName, 'w-full', className)}>
      <div className="container mx-auto px-4 py-6 lg:py-8">{children}</div>
    </div>
  );
};

export type { PageContainerProps } from '@/types';

export default PageContainer;
