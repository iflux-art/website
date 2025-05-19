import React from "react";
import { TableOfContentsClientWrapper } from "@/components/features/content/toc/toc-client-wrapper";
import { BackToTopButton } from "@/components/features/content/back-to-top-button";
import { TagCloud } from "./tag-cloud";
import { RelatedPosts } from "./related-posts";
import { AdvertisementCard } from "@/components/features/content/advertisement-card";
import { Heading, RelatedPost } from "@/types/blog";

/**
 * 博客侧边栏组件属性
 *
 * @interface BlogSidebarProps
 */
interface BlogSidebarProps {
  /**
   * 文章标题列表，用于生成目录
   */
  headings: Heading[];

  /**
   * 文章标签列表
   */
  tags: string[];

  /**
   * 相关文章列表
   */
  relatedPosts: RelatedPost[];
}

/**
 * 博客侧边栏组件
 *
 * 用于显示博客文章的侧边栏，包括目录、标签云、相关文章和广告
 *
 * @param {BlogSidebarProps} props - 组件属性
 * @returns {JSX.Element} 博客侧边栏组件
 *
 * @example
 * ```tsx
 * <BlogSidebar
 *   headings={[{ id: "intro", text: "Introduction", level: 2 }]}
 *   tags={["React", "Next.js"]}
 *   relatedPosts={[{ slug: "hello-world", title: "Hello World", excerpt: "..." }]}
 * />
 * ```
 */
export function BlogSidebar({ headings, tags, relatedPosts }: BlogSidebarProps) {
  return (
    <div className="space-y-6">
      {/* 目录 - 只在有标题时显示 */}
      {headings.length > 0 && (
        <div>
          <TableOfContentsClientWrapper headings={headings} />
        </div>
      )}

      <TagCloud tags={tags} />

      <RelatedPosts posts={relatedPosts} />

      <AdvertisementCard />

      {/* 回到顶部按钮 */}
      <div className="flex justify-left">
        <BackToTopButton title="回到顶部" />
      </div>
    </div>
  );
}
