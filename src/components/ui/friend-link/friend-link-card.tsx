'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cardInteractions } from '@/lib/interactions';

export interface FriendLinkCardProps {
  /**
   * 网站名称
   */
  name: string;

  /**
   * 网站描述
   */
  description: string;

  /**
   * 网站链接
   */
  url: string;

  /**
   * 网站图标
   * 可以是图片URL或表情符号
   */
  avatar?: string;

  /**
   * 图标类型
   * @default "emoji"
   */
  iconType?: 'emoji' | 'image';

  /**
   * 索引，用于动画延迟
   */
  index?: number;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 友情链接网格组件属性
 */
export interface FriendLinkGridProps {
  /**
   * 友情链接列表（可选）
   */
  links?: FriendLinkCardProps[];

  /**
   * 子组件
   */
  children?: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 友情链接网格组件
 *
 * 用于在 MDX 文件中显示友情链接网格
 * 支持两种使用方式：
 * 1. 通过 links 属性传递友情链接列表
 * 2. 通过子组件方式传递 FriendLinkCard 组件
 */
export function FriendLinkGrid({ links, children, className }: FriendLinkGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8', className)}>
      {links &&
        links.map((link, index) => <FriendLinkCard key={link.url} {...link} index={index} />)}
      {children}
    </div>
  );
}

/**
 * 友情链接卡片组件
 *
 * 用于在 MDX 文件中显示友情链接卡片
 */
export function FriendLinkCard({
  name,
  description,
  url,
  avatar,
  iconType = 'emoji',
  index = 0,
  className,
}: FriendLinkCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card
        className={cn(
          'h-full overflow-hidden hover:shadow-lg transition-all border border-border',
          cardInteractions.base,
          cardInteractions.hover.shadow,
          cardInteractions.hover.scale,
          className
        )}
      >
        <CardContent className="p-6 flex items-start gap-4">
          <div className="flex-shrink-0">
            {iconType === 'emoji' ? (
              <div className="w-12 h-12 text-3xl flex items-center justify-center bg-primary/10 rounded-full">
                {avatar}
              </div>
            ) : (
              <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
            )}
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate">{name}</h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
