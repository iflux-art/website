import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils";
import { ArrowRightLeft, FileText } from "lucide-react";
import Link from "next/link";

// 相关文章类型定义
export interface RelatedPost {
  title: string;
  href: string;
  category?: string;
  slug: string[];
}

export interface RelatedPostsCardProps {
  posts: RelatedPost[];
  currentSlug: string[];
}

/**
 * 相关文章卡片组件
 */
export const RelatedPostsCard = ({ posts, currentSlug }: RelatedPostsCardProps) => {
  if (!posts?.length) return null;

  const currentPath = `/blog/${currentSlug.join("/")}`;

  return (
    <Card className="w-full">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
          相关文章
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {posts.slice(0, 5).map((post, index) => {
          const isActive = currentPath === post.href;
          // 使用索引和href的组合作为唯一key，避免重复
          const uniqueKey = `${post.href}-${index}`;
          return (
            <Link
              key={uniqueKey}
              href={post.href}
              className={cn(
                "group flex items-start gap-2 rounded-md p-2 text-xs transition-all duration-200 hover:bg-muted/60",
                isActive && "bg-muted font-medium text-primary"
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
};
