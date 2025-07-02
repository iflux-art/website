'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils';

export interface DocCardProps {
  title: string;
  description?: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 文档分类卡片组件
 */
export const DocCard = forwardRef<HTMLAnchorElement, DocCardProps>(
  ({ title, description, href, className, children }, ref) => {
    const cardContent = (
      <Card
        className={cn(
          'group h-full transition-all duration-300 hover:bg-accent/30 hover:border-primary/50 hover:scale-[1.01]',
          className
        )}
      >
        <CardContent className="p-4 flex flex-col h-full">
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm flex-grow whitespace-pre-wrap">
              {description}
            </p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </CardContent>
      </Card>
    );

    return (
      <Link ref={ref} href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }
);

DocCard.displayName = 'DocCard';
