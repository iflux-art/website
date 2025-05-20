"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface HeadingWithAnchorProps {
  level: 1 | 2 | 3 | 4;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * 带锚点的标题组件
 * 鼠标悬停时显示 # 符号，便于分辨标题和正文
 */
export function HeadingWithAnchor({
  level,
  id,
  className,
  children,
  ...props
}: HeadingWithAnchorProps & React.HTMLAttributes<HTMLHeadingElement>) {
  const [isHovered, setIsHovered] = useState(false);

  // 根据标题级别生成ID
  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);

  // 根据标题级别选择合适的样式
  const styles = {
    1: "text-4xl font-bold tracking-tight mt-8 mb-4 scroll-m-20",
    2: "text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b scroll-m-20",
    3: "text-xl font-semibold tracking-tight mt-8 mb-3 scroll-m-20",
    4: "text-lg font-semibold tracking-tight mt-8 mb-3 scroll-m-20",
  };

  // 根据标题级别渲染不同的标题元素
  const renderHeading = () => {
    const headingContent = (
      <div
        className="group relative flex items-center hover:text-primary transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          className={cn(
            "absolute opacity-0 group-hover:opacity-70 transition-opacity -left-5 text-primary",
            {
              "text-4xl": level === 1,
              "text-2xl": level === 2,
              "text-xl": level === 3,
              "text-lg": level === 4,
            }
          )}
          aria-hidden="true"
        >
          #
        </span>
        {children}
      </div>
    );

    switch (level) {
      case 1:
        return <h1 id={headingId} className={cn(styles[1], className)} {...props}>{headingContent}</h1>;
      case 2:
        return <h2 id={headingId} className={cn(styles[2], className)} {...props}>{headingContent}</h2>;
      case 3:
        return <h3 id={headingId} className={cn(styles[3], className)} {...props}>{headingContent}</h3>;
      case 4:
        return <h4 id={headingId} className={cn(styles[4], className)} {...props}>{headingContent}</h4>;
      default:
        return <h2 id={headingId} className={cn(styles[2], className)} {...props}>{headingContent}</h2>;
    }
  };

  return renderHeading();
}
