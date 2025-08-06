/**
 * 文档卡片组件
 * 用于展示文档分类和文档条目
 * 内联所有相关类型和逻辑，避免过度抽象
 */

"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils";

// 内联文档卡片相关类型定义
interface DocCardProps {
  title: string;
  description?: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 文档分类卡片组件
 * 完整的独立实现，包含所有必要的样式和交互逻辑
 */
export const DocCard = forwardRef<HTMLAnchorElement, DocCardProps>(
  ({ title, description, href, className, children }, ref) => {
    return (
      <Link ref={ref} href={href} className="block h-full">
        <Card
          className={cn(
            "group h-full transition-all duration-300 hover:scale-[1.01] hover:border-primary/50",
            className,
          )}
        >
          <CardContent className="flex h-full flex-col p-4">
            <h3 className="mb-1 text-xl font-semibold">{title}</h3>
            {description && (
              <p className="flex-grow text-sm whitespace-pre-wrap text-muted-foreground">
                {description}
              </p>
            )}
            {children && <div className="mt-4">{children}</div>}
          </CardContent>
        </Card>
      </Link>
    );
  },
);

DocCard.displayName = "DocCard";
