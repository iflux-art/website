'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';

export interface BlogCardProps {
  title: string;
  description?: string;
  href: string;
  tags?: string[];
  image?: string;
  date?: string;
  author?: string;
  className?: string;
  onTagClick?: (tag: string) => void;
}

/**
 * 博客卡片组件
 * 用于在列表页或首页展示博客文章摘要。
 */
export const BlogCard = forwardRef<HTMLAnchorElement, BlogCardProps>(
  ({ title, description, href, tags = [], image, date, author, className, onTagClick }, ref) => {
    const cardContent = (
      <Card
        className={cn(
          'group h-full transition-all duration-300 hover:bg-accent/30 hover:border-primary/50 hover:scale-[1.01] p-5 border border-muted-foreground/10',
          className
        )}
      >
        {image && (
          <div className="relative h-40 w-full mb-3 overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-bold leading-tight mb-1 line-clamp-2">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{description}</p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-muted-foreground/20"
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
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          {date && <span>{date}</span>}
          {author && <span className="ml-2 truncate">· {author}</span>}
        </div>
      </Card>
    );

    return (
      <Link ref={ref} href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }
);

BlogCard.displayName = 'BlogCard';
