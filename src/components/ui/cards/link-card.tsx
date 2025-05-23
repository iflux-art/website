'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { handleImageError, getFirstLetter } from '@/lib/image';

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
 * 链接卡片组件属性
 */
export interface LinkCardProps {
  /**
   * 链接数据
   */
  link: LinkData;

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
 *   index={0}
 * />
 * ```
 */
export function LinkCard({ link, index = 0, className = '' }: LinkCardProps) {
  return (
    <div className={`h-full ${className}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-4">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition-colors duration-200 hover:text-primary"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold overflow-hidden">
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
              <div className="font-medium">{link.name}</div>
              <div className="text-sm text-muted-foreground">{link.desc}</div>
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
