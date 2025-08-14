"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { BlogPost } from "../types";

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
}

/**
 * 加载状态组件
 */
function LoadingState() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="text-sm text-muted-foreground">加载中...</span>
      </div>
    </div>
  );
}

/**
 * 空状态组件
 */
function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
      <div className="mb-4 text-4xl opacity-50">📝</div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
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
 * 简单文章列表组件
 */
function SimpleArticleList({
  posts,
  className,
}: {
  posts: BlogPost[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", className)}>
      {posts.map((post) => (
        <div
          key={post.slug}
          className="group cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent"
          onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
        >
          <h3 className="mb-2 font-medium group-hover:text-primary">
            {post.title}
          </h3>
          {post.description && (
            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {post.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <time>
              {typeof post.date === "string"
                ? post.date
                : post.date?.toLocaleDateString()}
            </time>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <span>{post.tags.slice(0, 2).join(", ")}</span>
              </>
            )}
          </div>
        </div>
      ))}
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
          // 覆盖默认的固定宽度，使用动态宽度
          "w-auto max-w-[95vw] min-w-[320px]",
          // 基础样式
          "flex max-h-[95vh] flex-col overflow-hidden p-0",
          // 响应式最小和最大宽度
          "sm:max-h-[90vh] sm:max-w-[90vw] sm:min-w-[400px]",
          "md:max-h-[85vh] md:max-w-[85vw] md:min-w-[500px]",
          "lg:max-h-[80vh] lg:max-w-[80vw] lg:min-w-[600px]",
          "xl:max-h-[80vh] xl:max-w-[85vw] xl:min-w-[700px]",
          "2xl:max-h-[80vh] 2xl:max-w-[80vw] 2xl:min-w-[800px]",
          // 动画效果
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "duration-200",
          className,
        )}
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
            <SimpleArticleList posts={posts} className="gap-4" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
