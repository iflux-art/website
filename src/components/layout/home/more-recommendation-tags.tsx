'use client';

import React from 'react';
import Link from 'next/link';
import { RECOMMENDATION_TAGS } from './constants'; // Assuming constants are in the same dir or adjust path

/**
 * Displays the "more" section of recommendation tags.
 */
export function MoreRecommendationTags() {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 w-full animate-in fade-in slide-in-from-top-2 duration-300">
      {RECOMMENDATION_TAGS.more.map((tag, index) => {
        const IconComponent = tag.icon;
        return (
          <Link href={tag.href} key={index}>
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/30 hover:border-primary/20 transition-all text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
              <IconComponent className="size-4" />
              <span>{tag.text}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}