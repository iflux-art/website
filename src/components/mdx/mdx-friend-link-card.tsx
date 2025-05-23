'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface MDXFriendLinkCardProps {
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
   */
  avatar?: string;
}

/**
 * MDX 友情链接卡片组件
 * 
 * 专门用于在 MDX 文件中显示友情链接卡片
 */
export function MDXFriendLinkCard({
  name,
  description,
  url,
  avatar,
}: MDXFriendLinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mb-4"
    >
      <Card className="overflow-hidden hover:shadow-md transition-all">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="flex-shrink-0">
            {avatar && (
              <div className="w-10 h-10 text-2xl flex items-center justify-center bg-primary/10 rounded-full">
                {avatar}
              </div>
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
