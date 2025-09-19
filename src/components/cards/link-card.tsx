/**
 * 链接卡片组件
 * 通用链接卡片组件，可用于友链、导航链接等场景
 * 样式与 LinkCard 保持一致
 */

"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  /** 链接标题 */
  title: string;
  /** 链接描述 */
  description?: string;
  /** 链接URL */
  href: string;
  /** 链接图标 */
  icon?: React.ReactNode;
  /** 图标类型 */
  iconType?: "image" | "text";
  /** 是否为外部链接 */
  isExternal?: boolean;
  /** 主题色 */
  color?: string;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 链接卡片组件
 * 通用链接卡片组件，可用于友链、导航链接等场景
 */
export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  (
    {
      title,
      description,
      href,
      isExternal = true,
      icon,
      color,
      className,
      children,
    },
    ref,
  ) => {
    // 图标渲染逻辑
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

    // 样式处理逻辑
    const cardStyle = color?.startsWith("#")
      ? {
          background: `linear-gradient(to bottom right, ${color}10, ${color}30)`,
        }
      : {};

    const cardContent = (
      <Card
        className={cn(
          "group transition-all duration-300 hover:scale-[1.01] hover:border-primary/50",
          className,
        )}
        style={cardStyle}
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
              <p
                className="truncate text-sm text-muted-foreground"
                title={description}
              >
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
      className: "block",
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
