'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * 卡片类型
 */
export type CardType = 'blog' | 'category' | 'resource' | 'link' | 'navigation' | 'friend';

/**
 * 统一卡片组件属性
 */
export interface UnifiedCardProps {
  /**
   * 卡片类型
   * @default "link"
   */
  type?: CardType;

  /**
   * 卡片标题
   */
  title: string;

  /**
   * 卡片描述
   */
  description?: string;

  /**
   * 卡片链接
   */
  href: string;

  /**
   * 是否为外部链接
   * @default false
   */
  isExternal?: boolean;

  /**
   * 卡片图标
   * 可以是字符串、图片URL或React节点
   */
  icon?: string | React.ReactNode;

  /**
   * 图标类型
   * @default "emoji"
   */
  iconType?: 'emoji' | 'image' | 'component';

  /**
   * 卡片标签
   * 可以是字符串数组或逗号分隔的字符串
   */
  tags?: string[] | string;

  /**
   * 卡片图片
   */
  image?: string;

  /**
   * 卡片日期
   */
  date?: string;

  /**
   * 卡片作者
   */
  author?: string;

  /**
   * 卡片颜色
   */
  color?: string;

  /**
   * 是否为精选卡片
   * @default false
   */
  featured?: boolean;

  /**
   * 索引，用于动画延迟
   */
  index?: number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 卡片样式变体
   * - default: 默认样式，图标在左上角
   * - compact: 紧凑样式，图标和标题在一行
   * - horizontal: 水平样式，图标在左侧
   */
  variant?: 'default' | 'compact' | 'horizontal';

  /**
   * 子元素
   */
  children?: React.ReactNode;
}

/**
 * 统一卡片组件
 *
 * 一个通用的卡片组件，可以根据类型显示不同的卡片样式
 *
 * @example
 * ```tsx
 * // 博客卡片
 * <UnifiedCard
 *   type="blog"
 *   title="博客标题"
 *   description="博客描述"
 *   href="/blog/post"
 *   date="2023-01-01"
 *   tags={["标签1", "标签2"]}
 * />
 *
 * // 资源卡片
 * <UnifiedCard
 *   type="resource"
 *   title="资源标题"
 *   description="资源描述"
 *   href="https://example.com"
 *   icon="🚀"
 *   isExternal
 * />
 *
 * // 友情链接卡片
 * <UnifiedCard
 *   type="friend"
 *   title="朋友网站"
 *   description="朋友网站描述"
 *   href="https://friend.com"
 *   icon="https://friend.com/avatar.png"
 *   iconType="image"
 *   isExternal
 * />
 * ```
 */
/**
 * 卡片交互效果
 */
const cardInteractions = {
  // 基础交互效果
  base: '',

  // 悬停效果
  hover: {
    // 默认悬停效果
    default: 'hover:shadow-lg',
    // 边框高亮效果
    border: 'hover:border-primary/20',
    // 背景高亮效果
    background: 'hover:bg-accent/50',
    // 阴影效果
    shadow: 'hover:shadow-lg',
    // 缩放效果
    scale: 'hover:scale-[1.02]',
  },
};

export function UnifiedCard({
  type = 'link',
  title,
  description,
  href,
  isExternal = false,
  icon,
  iconType = 'emoji',
  tags = undefined,
  image,
  date,
  author,
  color,
  featured = false,
  index = 0,
  className,
  variant = 'default',
  children,
}: UnifiedCardProps) {
  // 处理标签，可以是字符串数组或逗号分隔的字符串
  const tagArray = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
    ? tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
    : [];

  // 处理图标
  const renderIcon = () => {
    if (!icon) return null;

    if (iconType === 'image') {
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={icon as string} alt={title} width={40} height={40} className="object-cover" />
        </div>
      );
    } else if (iconType === 'emoji') {
      return <div className="text-3xl text-primary">{icon}</div>;
    } else {
      return icon;
    }
  };

  // 卡片内容
  const cardContent = (
    <Card
      className={cn(
        'h-full overflow-hidden transition-all border border-border',
        featured && 'border-primary/30',
        cardInteractions.base,
        cardInteractions.hover.shadow,
        cardInteractions.hover.scale,
        type === 'category' && 'bg-gradient-to-br',
        color &&
          `from-${color}-50 to-${color}-100 dark:from-${color}-950/20 dark:to-${color}-900/30`,
        className
      )}
      style={{
        ...(color && !color.startsWith('#')
          ? {}
          : {
              background: `linear-gradient(to bottom right, ${color}10, ${color}30)`,
            }),
      }}
    >
      {variant === 'default' && (
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">{renderIcon()}</div>
            {isExternal && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          {description && <p className="text-muted-foreground text-sm flex-grow">{description}</p>}

          {tagArray.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tagArray.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {date && (
            <div className="mt-4 text-xs text-muted-foreground">
              {date}
              {author && ` · ${author}`}
            </div>
          )}

          {featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="text-xs">
                精选
              </Badge>
            </div>
          )}

          {children}
        </CardContent>
      )}

      {variant === 'compact' && (
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="flex-shrink-0 text-2xl w-8 h-8 flex items-center justify-center">
                {renderIcon()}
              </div>
            )}
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold truncate">{title}</h3>
                {isExternal && (
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                )}
              </div>
              {description && (
                <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
              )}
            </div>
          </div>

          {tagArray.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tagArray.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {children}
        </CardContent>
      )}

      {variant === 'horizontal' && (
        <div className="flex h-full">
          {image && (
            <div className="w-1/3 relative">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          )}
          <div className={cn('flex flex-col', image ? 'w-2/3' : 'w-full')}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{title}</CardTitle>
                {isExternal && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              {description && (
                <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
              )}
            </CardContent>
            {(tagArray.length > 0 || date) && (
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                {tagArray.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tagArray.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tagArray.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tagArray.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                {date && <div className="text-xs text-muted-foreground">{date}</div>}
              </CardFooter>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  // 包装链接
  if (href) {
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {cardContent}
        </a>
      );
    } else {
      return (
        <Link href={href} className="block h-full">
          {cardContent}
        </Link>
      );
    }
  }

  // 无链接
  return cardContent;
}
