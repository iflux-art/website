"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { handleImageError, getFirstLetter } from "@/lib/image";
import { AnimatedCard } from "@/components/ui/animated-card";

/**
 * 友情链接数据接口
 *
 * @interface FriendLink
 */
export interface FriendLink {
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
 * 友情链接卡片组件属性
 *
 * @interface FriendLinkCardProps
 */
interface FriendLinkCardProps {
  /**
   * 友情链接数据
   */
  link: FriendLink;

  /**
   * 索引，用于动画延迟
   */
  index: number;
}

/**
 * 友情链接卡片组件
 *
 * 用于显示友情链接页面中的友链卡片，支持 emoji 和图片两种图标类型
 *
 * @param {FriendLinkCardProps} props - 组件属性
 * @returns {JSX.Element} 友情链接卡片组件
 *
 * @example
 * ```tsx
 * <FriendLinkCard
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
export function FriendLinkCard({ link, index }: FriendLinkCardProps) {
  return (
    <AnimatedCard
      delay={index * 0.05}
      duration={0.7}
      variant="fade"
      className="h-full"
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold overflow-hidden">
              {link.icon.type === 'emoji' ? (
                <span className="text-lg">{link.icon.value}</span>
              ) : (
                <img
                  src={link.icon.value}
                  alt={`${link.name} icon`}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, getFirstLetter(link.name))}
                />
              )}
            </div>
            <div>
              <div className="font-medium">{link.name}</div>
              <div className="text-sm text-muted-foreground">
                {link.desc}
              </div>
            </div>
          </a>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}