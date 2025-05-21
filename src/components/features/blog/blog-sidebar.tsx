import React from "react";
import { TableOfContentsClientWrapper } from "@/components/features/content/toc/toc-client-wrapper";
import { AdvertisementCard } from "@/components/features/content/advertisement-card";
import { BlogSidebarProps } from "./blog-sidebar.types";

/**
 * 博客侧边栏组件
 *
 * 用于显示博客文章的侧边栏，包括目录和广告
 *
 * @param {BlogSidebarProps} props - 组件属性
 * @returns {JSX.Element} 博客侧边栏组件
 *
 * @example
 * ```tsx
 * <BlogSidebar
 *   headings={[{ id: "intro", text: "Introduction", level: 2 }]}
 * />
 * ```
 */
export function BlogSidebar({ headings }: BlogSidebarProps) {
  return (
    <div className="space-y-2 flex flex-col h-[calc(100vh-5rem)] pr-1">
      {/* 目录 - 只在有标题时显示，占用可用空间但可滚动 */}
      {headings.length > 0 && (
        <div className="flex-grow overflow-y-auto scrollbar-hide">
          <TableOfContentsClientWrapper headings={headings} />
        </div>
      )}

      {/* 广告卡片 - 固定在底部 */}
      <div className="flex-shrink-0">
        <AdvertisementCard />
      </div>
    </div>
  );
}
