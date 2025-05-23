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
 * 友情链接卡片组件
 *
 * 用于在 MDX 文件中显示友情链接卡片
 * 
 * @example
 * ```tsx
 * <FriendLinkCard
 *   name="示例博客"
 *   description="一个示例博客网站"
 *   url="https://example.com"
 *   avatar="🌟"
 * />
 * ```
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

/**
 * @deprecated 使用 FriendLinkCard 替代，MDXFriendLinkCard 将在未来版本中移除
 */
export const MDXFriendLinkCard = FriendLinkCard;
