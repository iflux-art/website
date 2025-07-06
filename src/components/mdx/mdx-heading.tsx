"use client";

import React from "react";
import { Link } from "lucide-react";
import { slugify } from "@/lib/utils";

interface MDXHeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  id?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * MDX 标题锚点组件
 * - 仅处理自动生成锚点链接功能
 * - 样式由tailwindcss/typography处理
 */
export const MDXHeading = ({
  as: Component = "h2",
  children,
  className = "",
  ...props
}: MDXHeadingProps) => {
  // 生成标题ID
  const id = props.id || slugify(React.Children.toArray(children).join(""));

  return (
    <Component id={id} className={`group relative ${className}`} {...props}>
      {children}
      <a
        href={`#${id}`}
        className="absolute top-1/2 -left-5 hidden -translate-y-1/2 text-gray-400 group-hover:block"
        aria-label="锚点链接"
      >
        <Link className="h-4 w-4" />
      </a>
    </Component>
  );
};
