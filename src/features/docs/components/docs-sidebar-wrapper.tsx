/**
 * 文档侧边栏包装组件
 *
 * 处理数据获取和加载状态，为 DocsSidebar 提供数据
 */

"use client";

import { cn } from "@/utils";
import { DocsSidebar } from "./docs-sidebar";
import { useGlobalDocs } from "./use-global-docs";

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
import { memo } from "react";

const DocsSidebarWrapperComponent = ({ currentDoc, className }: DocsSidebarWrapperProps) => {
  const { structure, error } = useGlobalDocs();

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
  return <DocsSidebar structure={structure} currentDoc={currentDoc} className={className} />;
};

const arePropsEqual = (prevProps: DocsSidebarWrapperProps, nextProps: DocsSidebarWrapperProps) =>
  prevProps.currentDoc === nextProps.currentDoc && prevProps.className === nextProps.className;

export const DocsSidebarWrapper = memo(DocsSidebarWrapperComponent, arePropsEqual);
