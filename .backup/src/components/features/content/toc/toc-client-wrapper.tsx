"use client";

import { TableOfContentsImproved } from "./toc-improved";
import { FileText } from "lucide-react";

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
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="py-2 px-4 font-medium text-sm border-b flex items-center gap-1.5">
        <FileText className="h-4 w-4" />
        目录
      </div>
      <TableOfContentsImproved headings={headings} />
    </div>
  );
}