import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { cn } from "@/utils";

export interface TagCloudCardProps {
  allTags?: string[];
  currentTags?: string[];
}

/**
 * 标签云卡片组件
 */
export function TagCloudCard({
  allTags = [],
  currentTags = [],
}: TagCloudCardProps) {
  if (!allTags?.length) return null;

  return (
    <Card className="w-full">
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Tag className="h-3.5 w-3.5 text-primary" />
          标签
        </CardTitle>
      </CardHeader>
      <CardContent className="mb-4 flex flex-wrap gap-1.5">
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
      </CardContent>
    </Card>
  );
}
