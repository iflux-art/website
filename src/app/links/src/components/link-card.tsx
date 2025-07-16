"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "packages/src/ui/components/shared-ui/card";
import { cn } from "packages/src/lib/utils";

export interface LinkCardProps {
  title: string;
  description?: string;
  href: string;
  isExternal?: boolean;
  icon?: React.ReactNode; // 支持字符串或React元素
  iconType?: "image" | "text";
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 链接卡片组件
 * 用于显示外部或内部链接，如资源、导航、友链等。
 * 图标显示规则：
 * 1. 优先显示icon图片
 * 2. 图片无效时显示标题首个汉字或字母
 */
export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  (
    {
      title,
      description,
      href,
      isExternal = false,
      icon,
      color,
      className,
      children,
    },
    ref,
  ) => {
    const renderIcon = () => {
      // 获取标题首个字符
      const firstChar = title.charAt(0);

      // 如果没有icon，直接返回标题首个字符
      if (!icon) {
        return (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-lg font-medium text-primary">
              {firstChar}
            </span>
          </div>
        );
      }

      // 如果是React元素，直接渲染
      if (typeof icon !== "string") {
        return icon;
      }

      // 尝试显示图片
      return (
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={icon}
            alt={title}
            width={40}
            height={40}
            className="object-cover"
            unoptimized
            loading="lazy"
            onError={(e) => {
              // 图片加载失败时显示标题首个字符
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-lg font-medium text-primary">${firstChar}</span></div>`;
              }
            }}
          />
        </div>
      );
    };

    const cardContent = (
      <Card
        className={cn(
          "group h-full transition-all duration-300 hover:scale-[1.01] hover:border-primary/50",
          className,
        )}
        style={{
          ...(color && color.startsWith("#")
            ? {
                background: `linear-gradient(to bottom right, ${color}10, ${color}30)`,
              }
            : {}),
        }}
      >
        <CardContent className="flex h-full items-center p-4">
          <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {renderIcon()}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold">{title}</h3>
              {isExternal && (
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            {description && (
              <p className="truncate text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {children && <div className="mt-2">{children}</div>}
          </div>
        </CardContent>
      </Card>
    );

    const commonProps = {
      ref,
      className: "block h-full",
      href,
    };

    if (isExternal) {
      return (
        <a {...commonProps} target="_blank" rel="noopener noreferrer">
          {cardContent}
        </a>
      );
    }

    return <Link {...commonProps}>{cardContent}</Link>;
  },
);

LinkCard.displayName = "LinkCard";
