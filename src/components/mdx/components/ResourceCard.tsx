
'use client';

import React, { memo } from 'react';
import type { ResourceCardProps } from '../types/components';
import { STYLE_CONFIG } from '../utils/config';
import { isValidUrl } from '../utils/helpers';

// 资源卡片组件
export const ResourceCard = memo(({
  title,
  description,
  url,
  icon,
  tags = [],
  featured = false
}: ResourceCardProps) => {
  if (!isValidUrl(url)) {
    console.error(`Invalid URL: ${url}`);
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div className={`${STYLE_CONFIG.BASE_CLASSES.card} ${featured ? STYLE_CONFIG.BASE_CLASSES.cardFeatured : ''}`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-start mb-3">
            <div className="text-3xl">
              <span className="text-primary">{icon}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm flex-grow">{description}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {featured && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                精选
              </span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
});

ResourceCard.displayName = 'ResourceCard';

export default ResourceCard;