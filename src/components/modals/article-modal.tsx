"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArticleGrid } from "./article-grid";
import { EmptyState } from "./empty-state";
import { LoadingState } from "./loading-state";
import { cn } from "@/utils";
import type { BlogPost } from "@/features/blog/types";

// 内联相关类型定义
interface ArticleModalProps {
  /** 模态对话框是否打开 */
  isOpen: boolean;
  /** 关闭模态对话框的回调函数 */
  onClose: () => void;
  /** 模态对话框标题 */
  title: string;
  /** 要显示的文章列表 */
  posts: BlogPost[];
  /** 是否正在加载 */
  isLoading?: boolean;
  /** 错误信息 */
  error?: string;
  /** 自定义类名 */
  className?: string;
  /** 标签点击回调 */
  onTagClick?: (tag: string) => void;
}

/**
 * 错误状态组件
 */
function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
      <div className="mb-4 text-4xl opacity-50">⚠️</div>
      <h3 className="mb-2 text-lg font-medium">加载失败</h3>
      <p className="mb-4 text-sm text-muted-foreground">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          重试
        </button>
      )}
    </div>
  );
}

/**
 * 文章模态对话框组件
 *
 * 功能特性：
 * - 基于 Radix UI Dialog 实现
 * - 支持 ESC 键关闭和点击外部关闭
 * - 平滑的淡入淡出动画效果
 * - 响应式网格布局
 * - 焦点管理和可访问性支持
 * - 加载状态、错误状态和空状态处理
 */
export function ArticleModal({
  isOpen,
  onClose,
  title,
  posts,
  isLoading = false,
  error,
  className,
  onTagClick,
}: ArticleModalProps) {
  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          // 基础样式 - 改进移动端体验
          "flex max-h-[95vh] w-[98vw] max-w-[1200px] flex-col overflow-hidden p-0",
          // 响应式宽度 - 更好的移动端适配
          "sm:max-h-[90vh] sm:w-[90vw]",
          "md:max-h-[85vh] md:w-[85vw]",
          "lg:max-h-[80vh] lg:w-[80vw]",
          // 动画效果
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "duration-200",
          className,
        )}
        showCloseButton={true}
      >
        {/* 标题区域 - 固定高度，不参与滚动 */}
        <DialogHeader className="flex-shrink-0 border-b px-4 py-3 sm:px-6 sm:py-4">
          <DialogTitle className="text-lg font-semibold sm:text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isLoading
              ? "正在加载文章列表"
              : error
                ? `加载失败: ${error}`
                : `${title}包含 ${posts.length} 篇文章`}
          </DialogDescription>
        </DialogHeader>

        {/* 内容区域 - 可滚动，占据剩余空间，隐藏滚动条 */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : posts.length === 0 ? (
            <EmptyState
              title="暂无文章"
              description={`${title}暂时没有相关文章`}
            />
          ) : (
            <ArticleGrid
              posts={posts}
              onTagClick={onTagClick}
              className="gap-3 sm:gap-4"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
