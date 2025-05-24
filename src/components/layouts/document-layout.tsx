'use client';

import React, { ReactNode, Suspense } from 'react';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { DocSidebar } from '@/components/features/docs/sidebar/doc-sidebar';
import { AdaptiveSidebar } from '@/components/ui/adaptive-sidebar';

/**
 * 文档布局组件属性
 */
export interface DocumentLayoutProps {
  /**
   * 面包屑导航项
   */
  breadcrumbItems: BreadcrumbItem[];

  /**
   * 文档分类（用于左侧边栏）
   */
  category: string;

  /**
   * 当前文档名称（用于左侧边栏高亮）
   */
  currentDoc?: string;

  /**
   * 标题项（用于右侧目录）
   */
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;

  /**
   * 主要内容
   */
  children: ReactNode;
}

/**
 * 文档布局组件
 *
 * 提供统一的文档页面布局，包括面包屑、左侧导航和右侧目录
 */
export function DocumentLayout({
  breadcrumbItems,
  category,
  currentDoc,
  headings,
  children,
}: DocumentLayoutProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* 左侧边栏 - 文档列表 */}
        <div className="lg:w-64 shrink-0 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
            <Suspense fallback={<div className="h-[500px] bg-muted rounded-xl shadow-sm"></div>}>
              <div className="no-animation">
                <DocSidebar category={category} currentDoc={currentDoc} />
              </div>
            </Suspense>
          </div>
        </div>

        {/* 中间内容区 */}
        <div className="lg:flex-1 min-w-0 order-1 lg:order-2 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* 面包屑导航 */}
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* 主要内容 */}
            {children}
          </div>
        </div>

        {/* 右侧边栏 - 目录 */}
        <div className="lg:w-64 shrink-0 order-3">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
            <Suspense fallback={<div className="h-[300px] bg-muted rounded-xl shadow-sm"></div>}>
              <AdaptiveSidebar headings={headings} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
