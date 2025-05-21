"use client";

import { TableOfContentsImproved } from "./toc-improved";
import { Text } from "lucide-react";
import { TableOfContentsClientWrapperProps } from "./toc-client-wrapper.types";
import { cn } from "@/lib/utils";

/**
 * 客户端包装组件，用于在服务器组件中使用TableOfContentsImproved
 */
export function TableOfContentsClientWrapper({
  headings,
  className,
  title = "目录"
}: TableOfContentsClientWrapperProps) {
  // 如果没有标题，不渲染目录组件
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn("pb-4", className)}>
      <div className="py-2 font-medium text-sm flex items-center gap-1.5 mb-1 pl-0">
        <Text className="h-4 w-4" />
        {title}
      </div>
      <TableOfContentsImproved headings={headings} />
    </div>
  );
}