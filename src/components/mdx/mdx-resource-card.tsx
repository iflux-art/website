'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface MDXResourceCardProps {
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
  icon?: string;
  
  /**
   * 资源标签
   */
  tags?: string[];
  
  /**
   * 是否为特色资源
   */
  featured?: boolean;
}

/**
 * MDX 资源卡片组件
 * 
 * 专门用于在 MDX 文件中显示资源卡片
 */
export function MDXResourceCard({
  title,
  description,
  url,
  icon,
  tags,
  featured,
}: MDXResourceCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className={cn(
        "h-full overflow-hidden hover:shadow-md transition-all",
        featured && "border-primary/50 bg-primary/5"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="flex-shrink-0 text-2xl w-8 h-8 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold truncate">{title}</h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
            </div>
          </div>
        </CardContent>
        
        {tags && tags.length > 0 && (
          <CardFooter className="p-3 pt-0 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        )}
      </Card>
    </a>
  );
}
