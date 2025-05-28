'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavigationCardProps {
  title: string;
  description: string;
  url: string;
  icon?: string;
  iconType?: 'emoji' | 'image' | 'text';
  featured?: boolean;
  className?: string;
}

export function NavigationCard({
  title,
  description,
  url,
  icon,
  iconType = 'emoji',
  featured = false,
  className,
}: NavigationCardProps) {
  const renderIcon = () => {
    if (!icon) {
      return (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">
            {title.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    switch (iconType) {
      case 'image':
        return (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-8 h-8 object-contain"
              onError={e => {
                // 如果图片加载失败，显示首字母
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-muted-foreground font-semibold">${title
                    .charAt(0)
                    .toUpperCase()}</span>`;
                }
              }}
            />
          </div>
        );
      case 'text':
        return (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-semibold text-sm">{icon}</span>
          </div>
        );
      case 'emoji':
      default:
        return (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-xl">{icon}</span>
          </div>
        );
    }
  };

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md',
        featured, className
      )}
    >
      <div className="flex items-start gap-3">
        {/* 图标 */}
        <div className="shrink-0">{renderIcon()}</div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* 特色标识 */}
      {featured && (
        <div className="flex justify-end">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            推荐
          </span>
        </div>
      )}
    </Link>
  );
}
