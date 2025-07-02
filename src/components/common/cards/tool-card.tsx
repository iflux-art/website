'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ToolCardProps {
  title: string;
  description?: string;
  href: string;
  isExternal?: boolean;
  tags?: string[];
  onTagClick?: (tag: string) => void;
}

/**
 * 工具卡片组件
 */
export const ToolCard = forwardRef<HTMLAnchorElement, ToolCardProps>(
  ({ title, description, href, isExternal = false, tags = [], onTagClick }, ref) => {
    const cardContent = (
      <Card className="group h-full transition-all duration-300 hover:bg-accent/30 hover:border-primary/50 hover:scale-[1.01]">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            {isExternal && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
          </div>
          {description && (
            <p className="text-muted-foreground text-sm flex-grow whitespace-pre-wrap">
              {description}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-primary/10"
                  onClick={e => {
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
        </CardContent>
      </Card>
    );

    const commonProps = {
      ref,
      className: 'block h-full',
      href,
    };

    if (isExternal) {
      return (
        <a {...commonProps} target="_blank" rel="noopener noreferrer">
          {cardContent}
        </a>
      );
    }

    return <Link {...commonProps}>{cardContent}</Link>;
  }
);

ToolCard.displayName = 'ToolCard';
