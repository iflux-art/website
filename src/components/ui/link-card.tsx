'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { handleImageError, getFirstLetter } from '@/lib/image';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 链接数据接口
 */
export interface LinkData {
  /**
   * 网站名称
   */
  name: string;

  /**
   * 网站地址
   */
  url: string;

  /**
   * 网站描述
   */
  desc: string;

  /**
   * 网站图标
   */
  icon: {
    /**
     * 图标类型
     * - emoji: 使用 emoji 表情作为图标
     * - image: 使用图片 URL 作为图标
     */
    type: 'emoji' | 'image';

    /**
     * 图标值
     * - 当 type 为 'emoji' 时，为 emoji 表情
     * - 当 type 为 'image' 时，为图片 URL
     */
    value: string;
  };
}

/**
 * 链接卡片变体
 */
const linkCardVariants = cva(
  "h-full",
  {
    variants: {
      variant: {
        default: "",
        interactive: "",
        compact: "",
        featured: "",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        size: "default",
        className: "",
      },
      {
        variant: "interactive",
        size: "default",
        className: "",
      },
      {
        variant: "compact",
        size: "default",
        className: "",
      },
      {
        variant: "featured",
        size: "default",
        className: "",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * 链接卡片组件属性
 */
export interface LinkCardProps extends VariantProps<typeof linkCardVariants> {
  /**
   * 链接数据
   */
  link: LinkData;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 卡片类名
   */
  cardClassName?: string;

  /**
   * 内容类名
   */
  contentClassName?: string;

  /**
   * 图标类名
   */
  iconClassName?: string;

  /**
   * 文本类名
   */
  textClassName?: string;

  /**
   * 标题类名
   */
  titleClassName?: string;

  /**
   * 描述类名
   */
  descriptionClassName?: string;

  /**
   * 点击事件处理函数
   */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * 链接卡片组件
 *
 * 用于显示链接卡片，支持 emoji 和图片两种图标类型
 *
 * @example
 * ```tsx
 * <LinkCard
 *   link={{
 *     name: "示例网站",
 *     url: "https://example.com",
 *     desc: "示例网站描述",
 *     icon: {
 *       type: "emoji",
 *       value: "🌟"
 *     }
 *   }}
 *   variant="interactive"
 * />
 * ```
 */
export function LinkCard({
  link,
  variant,
  size,
  className,
  cardClassName,
  contentClassName,
  iconClassName,
  textClassName,
  titleClassName,
  descriptionClassName,
  onClick,
}: LinkCardProps) {
  // 根据变体设置卡片样式
  const getCardClassName = () => {
    switch (variant) {
      case 'interactive':
        return 'transition-shadow duration-200 hover:shadow-md';
      case 'featured':
        return 'shadow-md border-primary/20';
      default:
        return '';
    }
  };

  // 根据变体设置内容样式
  const getContentClassName = () => {
    switch (size) {
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-5';
      default:
        return 'p-4';
    }
  };

  // 根据变体设置图标样式
  const getIconClassName = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  return (
    <div className={cn(linkCardVariants({ variant, size }), className)}>
      <Card className={cn(getCardClassName(), cardClassName)}>
        <CardContent className={cn(getContentClassName(), contentClassName)}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 transition-colors duration-200 hover:text-primary",
              textClassName
            )}
            onClick={onClick}
          >
            <div className={cn(
              "rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold overflow-hidden",
              getIconClassName(),
              iconClassName
            )}>
              {link.icon.type === 'emoji' ? (
                <span className="text-lg">{link.icon.value}</span>
              ) : (
                <img
                  src={link.icon.value}
                  alt={`${link.name} icon`}
                  className="w-full h-full object-cover"
                  onError={e => handleImageError(e, getFirstLetter(link.name))}
                />
              )}
            </div>
            <div>
              <div className={cn("font-medium", titleClassName)}>{link.name}</div>
              <div className={cn("text-sm text-muted-foreground", descriptionClassName)}>{link.desc}</div>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * @deprecated 请使用 LinkCard 替代 FriendLinkCard，FriendLinkCard 将在未来版本中移除
 */
export { LinkCard as FriendLinkCard };

/**
 * @deprecated 请使用 LinkData 替代 FriendLink，FriendLink 将在未来版本中移除
 */
export type { LinkData as FriendLink };
