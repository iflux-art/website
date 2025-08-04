import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, FileText, Tag } from "lucide-react";
import { cn } from "@/utils";

// 内联 RelatedPost 和 RelatedPostsProps 类型定义
export interface RelatedPost {
  title: string;
  href: string;
  category?: string;
}

export interface RelatedPostsProps {
  posts: RelatedPost[];
  currentSlug: string[];
}

export interface BlogSidebarProps {
  posts: RelatedPost[];
  currentSlug: string[];
  currentTags?: string[];
  allTags?: string[];
}

/**
 * 相关文章卡片组件
 */
export function RelatedPostsCard({ posts, currentSlug }: RelatedPostsProps) {
  if (!posts?.length) return null;

  const currentPath = `/blog/${currentSlug.join("/")}`;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
          相关文章
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {posts.slice(0, 6).map((post) => {
          const isActive = currentPath === post.href;
          return (
            <Link
              key={post.href}
              href={post.href}
              className={cn(
                "group flex items-start gap-2 rounded-md p-2 text-xs transition-all duration-200 hover:bg-muted/60",
                isActive && "bg-muted font-medium text-primary",
              )}
            >
              <FileText className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/70 group-hover:text-foreground/80" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 leading-relaxed text-muted-foreground group-hover:text-foreground">
                  {post.title}
                </p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

/**
 * 标签云卡片组件
 */
export function TagCloudCard({
  allTags = [],
  currentTags = [],
}: {
  allTags?: string[];
  currentTags?: string[];
}) {
  if (!allTags?.length) return null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Tag className="h-3.5 w-3.5 text-primary" />
          标签
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {allTags.slice(0, 24).map((tag) => {
            const isActive = currentTags.includes(tag);
            return (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "h-5 cursor-pointer text-[10px] font-normal transition-all duration-200",
                    "hover:scale-105 hover:shadow-sm",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border-0 bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  {tag}
                </Badge>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 博客侧边栏组件 - 整合所有卡片
 */
export function BlogSidebar({
  posts,
  currentSlug,
  currentTags = [],
  allTags = [],
}: BlogSidebarProps) {
  return (
    <div className="hide-scrollbar space-y-4 overflow-y-auto">
      <RelatedPostsCard posts={posts} currentSlug={currentSlug} />
      <TagCloudCard allTags={allTags} currentTags={currentTags} />
    </div>
  );
}

// 保持向后兼容
export { RelatedPostsCard as RelatedPosts };
