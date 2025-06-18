'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type CardType = 'blog' | 'category' | 'resource' | 'link' | 'navigation' | 'friend' | 'docs';

export interface UnifiedCardProps {
  type?: CardType;
  title: string;
  description?: string;
  href: string;
  isExternal?: boolean;
  icon?: string | React.ReactNode;
  iconType?: 'emoji' | 'image' | 'component';
  tags?: string[] | string;
  image?: string;
  date?: string;
  author?: string;
  color?: string;
  featured?: boolean;
  _index?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'horizontal';
  /**
   * 标签点击处理函数
   */
  onTagClick?: (tag: string) => void;
  children?: React.ReactNode;
}

/**
 * 统一卡片组件
 *
 * 一个通用的卡片组件，可以根据类型显示不同的卡片样式
 *
 * @example
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
 */
export const UnifiedCard = forwardRef<HTMLDivElement, UnifiedCardProps>(
  (
    {
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
      _index = 0,
      className,
      variant = 'default',
      onTagClick,
      children,
    },
    ref
  ) => {
    const tagArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
        ? tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

    const renderIcon = () => {
      if (!icon) return null;

      if (iconType === 'image') {
        return (
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={icon as string}
              alt={title}
              width={40}
              height={40}
              className="object-cover"
              unoptimized
              loading="lazy"
            />
          </div>
        );
      } else if (iconType === 'emoji') {
        return <div className="text-3xl text-primary">{icon}</div>;
      } else {
        return icon;
      }
    };

    const baseClasses = cn(
      'group relative overflow-hidden rounded-lg border text-card-foreground',
      'transition-all duration-300 ease-out',
      'hover:border-primary/50',
      'hover:bg-muted/50',
      'hover:shadow-lg hover:shadow-black/10',
      'dark:hover:shadow-white/5',
      'border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-card break-inside-avoid mb-4 h-full',
      featured && 'border-primary/30',
      type === 'category' && 'bg-gradient-to-br',
      color && `from-${color}-50 to-${color}-100 dark:from-${color}-950/20 dark:to-${color}-900/30`,
      className
    );

    const cardContent = (
      <>
        {variant === 'default' && (
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-2">
              <div className="text-3xl">{renderIcon()}</div>
              {isExternal && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
            </div>
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            {description && (
              <p className="text-muted-foreground text-sm flex-grow whitespace-pre-wrap">
                {description}
              </p>
            )}

            {tagArray.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tagArray.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary/10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onTagClick?.(tag);
                    }}
                  >
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
          <CardContent className="px-5 py-5">
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
                  <p className="text-muted-foreground text-sm line-clamp-1">{description}</p>
                )}
              </div>
            </div>

            {tagArray.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tagArray.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary/10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onTagClick?.(tag);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {children}
          </CardContent>
        )}

        {variant === 'horizontal' && (
          <CardContent className="flex p-4 gap-4">
            {image && (
              <div className="flex-shrink-0">
                <Image
                  src={image}
                  alt={title}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover"
                  unoptimized
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold truncate">{title}</h3>
                {isExternal && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
              </div>
              {description && (
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{description}</p>
              )}
              {tagArray.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tagArray.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-primary/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onTagClick?.(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {children}
            </div>
          </CardContent>
        )}
      </>
    );
    if (href) {
      if (isExternal) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
            style={{
              ...(color && !color.startsWith('#')
                ? {}
                : {
                    background: `linear-gradient(to bottom right, ${color}10, ${color}30)`,
                  }),
            }}
          >
            {cardContent}
          </a>
        );
      }
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseClasses}
          style={{
            ...(color && !color.startsWith('#')
              ? {}
              : {
                  background: `linear-gradient(to bottom right, ${color}10, ${color}30)`,
                }),
          }}
        >
          {cardContent}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={{
          ...(color && !color.startsWith('#')
            ? {}
            : {
                background: `linear-gradient(to bottom right, ${color}10, ${color}30)`,
              }),
        }}
      >
        {cardContent}
      </div>
    );
  }
);

UnifiedCard.displayName = 'UnifiedCard';
