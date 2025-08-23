'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocsSidebarWrapper } from './docs-sidebar-wrapper';

export interface DocsSidebarCardProps {
  /** 当前打开的文档路径 */
  currentDoc?: string;
  /** 自定义类名 */
  className?: string;
  /**
   * 是否显示标题栏
   * @default true
   */
  showHeader?: boolean;
}

/**
 * 文档侧边栏卡片组件
 *
 * 以卡片形式显示文档导航，包装 DocsSidebarWrapper 组件
 */
export function DocsSidebarCard({
  currentDoc,
  className,
  showHeader = true,
}: DocsSidebarCardProps) {
  return (
    <Card className={cn('w-full', className)}>
      {showHeader && (
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="h-3.5 w-3.5 text-primary" />
            文档导航
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showHeader ? 'pt-0 pb-4' : 'py-4'}>
        <div className="hide-scrollbar max-h-[400px] overflow-y-auto sm:max-h-[450px]">
          <DocsSidebarWrapper currentDoc={currentDoc} />
        </div>
      </CardContent>
    </Card>
  );
}
