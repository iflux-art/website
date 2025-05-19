import React from "react";
import { TableOfContentsClientWrapper } from "@/components/features/content/toc/toc-client-wrapper";
import { BackToTopButton } from "@/components/features/content/back-to-top-button";
import { TagCloud } from "./tag-cloud";
import { RelatedPosts } from "./related-posts";
import { AdvertisementCard } from "@/components/features/content/advertisement-card";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogSidebarProps {
  headings: Heading[];
  tags: string[];
  relatedPosts: Array<{
    slug: string;
    title: string;
    excerpt: string;
  }>;
}

/**
 * 博客侧边栏组件
 * 用于显示博客文章的目录、标签云、相关文章和广告
 */
export function BlogSidebar({ headings, tags, relatedPosts }: BlogSidebarProps) {
  return (
    <div className="lg:w-64 shrink-0">
      <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] space-y-6">
        {/* 目录 */}
        <div>
          <TableOfContentsClientWrapper headings={headings} />
        </div>
        
        <TagCloud tags={tags} />
        
        <RelatedPosts posts={relatedPosts} />
        
        <AdvertisementCard />
        
        {/* 回到顶部按钮 */}
        <div className="flex justify-left">
          <BackToTopButton title="回到顶部" />
        </div>
      </div>
    </div>
  );
}