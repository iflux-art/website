'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * 资源数据接口
 */
export interface ResourceData {
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
   * 资源分类
   */
  category: string;

  /**
   * 资源图标（emoji）
   */
  icon: string;

  /**
   * 资源作者/提供方
   */
  author: string;

  /**
   * 是否免费
   */
  free: boolean;
}

/**
 * 资源卡片组件属性
 */
export interface ResourceCardProps {
  /**
   * 资源数据
   */
  resource: ResourceData;

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
 * 用于显示导航页面中的资源卡片，包括标题、描述、分类、作者和是否免费等信息
 *
 * @example
 * ```tsx
 * <ResourceCard
 *   resource={{
 *     title: "GitHub",
 *     description: "代码托管平台",
 *     url: "https://github.com",
 *     category: "开发",
 *     icon: "🐙",
 *     author: "GitHub, Inc.",
 *     free: true
 *   }}
 *   index={0}
 * />
 * ```
 */
export function ResourceCard({ resource, index = 0, className = '' }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`h-full ${className}`}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              {resource.icon && <span className="text-2xl mr-2">{resource.icon}</span>}
              <h3 className="text-lg font-semibold">{resource.title}</h3>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-muted">{resource.category}</span>
          </div>
          <p className="text-muted-foreground mb-4">{resource.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{resource.author}</span>
            {resource.free ? (
              <span className="px-2 py-0.5 rounded-full bg-success/10 text-success dark:bg-success/20 dark:text-success-foreground">
                免费
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground">
                付费
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
