/**
 * 文档侧边栏包装组件
 *
 * 处理数据获取和加载状态，为 DocsSidebar 提供数据
 */

"use client";

import { DocsSidebar } from "./docs-sidebar";
import { useGlobalDocs } from "@/components/sidebar/use-global-docs";
import { cn } from "@/utils";

export interface DocsSidebarWrapperProps {
  /** 当前打开的文档路径 */
  currentDoc?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 文档侧边栏包装组件
 *
 * 负责获取全局文档结构数据并渲染侧边栏
 */
export function DocsSidebarWrapper({
  currentDoc,
  className,
}: DocsSidebarWrapperProps) {
  const { structure, loading, error } = useGlobalDocs();

  // 加载状态
  if (loading) {
    return (
      <div className={cn("hide-scrollbar", className)}>
        <div className="space-y-3 p-3">
          {/* 加载骨架屏 */}
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 animate-pulse rounded bg-muted" />
                <div className="ml-4 space-y-1">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted/60" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={cn("hide-scrollbar", className)}>
        <div className="p-3">
          <div className="text-sm text-destructive">加载文档结构失败</div>
          <div className="mt-1 text-xs text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!structure) {
    return (
      <div className={cn("hide-scrollbar", className)}>
        <div className="p-3 text-sm text-muted-foreground">暂无文档数据</div>
      </div>
    );
  }

  // 正常渲染
  return (
    <DocsSidebar
      structure={structure}
      currentDoc={currentDoc}
      className={className}
    />
  );
}
