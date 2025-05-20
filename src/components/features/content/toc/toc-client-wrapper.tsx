"use client";

import { TableOfContentsImproved } from "./toc-improved";
import { Text } from "lucide-react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

interface TableOfContentsClientWrapperProps {
  headings: Heading[];
}

/**
 * 客户端包装组件，用于在服务器组件中使用TableOfContentsImproved
 */
export function TableOfContentsClientWrapper({ headings }: TableOfContentsClientWrapperProps) {
  // 如果没有标题，不渲染目录组件
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="pb-4 overflow-hidden">
      <div className="py-2 font-medium text-sm flex items-center gap-1.5 mb-1">
        <Text className="h-4 w-4" />
        目录
      </div>
      <TableOfContentsImproved headings={headings} />
    </div>
  );
}