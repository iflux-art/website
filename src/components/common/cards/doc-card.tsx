"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
          "group h-full transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 hover:bg-accent/30",
          className,
        )}
      >
        <CardContent className="flex h-full flex-col p-4">
          <h3 className="mb-1 text-xl font-semibold">{title}</h3>
          {description && (
            <p className="flex-grow text-sm whitespace-pre-wrap text-muted-foreground">
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
  },
);

DocCard.displayName = "DocCard";
