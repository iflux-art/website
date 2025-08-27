import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";

// 最新文章类型定义
export interface LatestPost {
  title: string;
  href: string;
  date?: string;
  category?: string;
}

export interface LatestPostsCardProps {
  posts: LatestPost[];
  currentSlug: string[];
}

/**
 * 最新发布文章卡片组件
 */
export const LatestPostsCard = ({ posts, currentSlug }: LatestPostsCardProps) => {
  if (!posts?.length) return null;

  const currentPath = `/blog/${currentSlug.join("/")}`;

  return (
    <Card className="w-full">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          最新发布
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {posts.slice(0, 5).map(post => {
          const isActive = currentPath === post.href;
          return (
            <Link
              key={post.href}
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
                {post.date && (
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    {new Date(post.date).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
};
