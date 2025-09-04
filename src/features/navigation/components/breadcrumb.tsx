"use client";

import { cn } from "@/utils";
import Link from "next/link";
import type { BreadcrumbProps } from "@/features/navigation/types";

/**
 * 面包屑导航组件
 * 用于显示当前页面在网站层级结构中的位置
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: '首页', href: '/' },
 *     { label: '文档', href: '/docs' },
 *     { label: '组件' }
 *   ]}
 * />
 */
export const Breadcrumb = ({ items, separator = "/", className }: BreadcrumbProps) => (
  <nav className={cn("text-sm font-medium text-muted-foreground", className)}>
    <ol className="flex flex-wrap items-center">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        // 目录 label 优先 _meta.json title
        const { label } = item;
        // 目录 href 跳转到第一篇文档
        let { href } = item;
        if (!(isLast || href)) {
          // 移除 getDirectoryTitle, getFirstDocInDirectory 的 import
          // 不再做任何 Node API 调用
          href = ""; // 或者根据实际需求设置一个默认值
        }
        return (
          <li key={item.label} className="flex items-center">
            {index > 0 && <span className="mx-2 text-muted-foreground/70">{separator}</span>}
            {isLast || !href ? (
              <span className="text-foreground">{label}</span>
            ) : (
              <Link href={href} className="text-muted-foreground hover:text-foreground">
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
