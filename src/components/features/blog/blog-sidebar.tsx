import React from "react";
import { TableOfContentsClientWrapper } from "@/components/features/content/toc/toc-client-wrapper";
import { BackToTopButton } from "@/components/features/content/back-to-top-button";
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
    <div className="space-y-2 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto scrollbar-hide pr-1">
      {/* 目录 - 只在有标题时显示 */}
      {headings.length > 0 && (
        <div>
          <TableOfContentsClientWrapper headings={headings} />
        </div>
      )}

      <AdvertisementCard />

      {/* 回到顶部按钮 */}
      <div className="flex justify-left mt-4">
        <BackToTopButton title="回到顶部" />
      </div>
    </div>
  );
}
