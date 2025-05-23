'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cardInteractions } from '@/lib/interactions';

export interface ResourceCardProps {
  /**
   * 资源标题
   */
  title: string;

  /**
   * 资源描述
   */
  description: string;

  /**
   * 资源链接
   */
  url: string;

  /**
   * 资源图标
   */
  icon?: string | React.ReactNode;

  /**
   * 资源标签
   * 可以是字符串数组或逗号分隔的字符串
   */
  tags?: string[] | string;

  /**
   * 是否为精选资源
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
}

/**
 * 资源卡片组件
 *
 * 用于在 MDX 文件中显示资源卡片
 */
export function ResourceCard({
  title,
  description,
  url,
  icon,
  tags = [],
  featured = false,
  index = 0,
  className,
}: ResourceCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card
        className={cn(
          'h-full overflow-hidden hover:shadow-lg transition-all border border-border',
          featured && 'border-primary/30',
          cardInteractions.base,
          cardInteractions.hover.shadow,
          cardInteractions.hover.scale,
          className
        )}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">
              {typeof icon === 'string' ? <span className="text-primary">{icon}</span> : icon}
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm flex-grow">{description}</p>

          {(() => {
            // 处理标签，可以是字符串数组或逗号分隔的字符串
            const tagArray =
              typeof tags === 'string'
                ? tags
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean)
                : Array.isArray(tags)
                ? tags
                : [];

            return tagArray.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {tagArray.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null;
          })()}

          {featured && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                精选
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
