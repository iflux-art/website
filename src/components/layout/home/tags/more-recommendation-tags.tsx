"use client";

import React from "react";
import Link from "next/link";
import { RECOMMENDATION_TAGS } from "@/components/layout/home/data/constants"; // Assuming constants are in the same dir or adjust path

/**
 * Displays the "more" section of recommendation tags.
 */
export function MoreRecommendationTags() {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 flex w-full flex-wrap justify-center gap-2.5 duration-300">
      {RECOMMENDATION_TAGS.more.map((tag, index) => {
        const IconComponent = tag.icon;
        return (
          <Link href={tag.href} key={index}>
            <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/80 px-3.5 py-2 text-sm whitespace-nowrap text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-accent/30 hover:text-foreground">
              <IconComponent className="size-4" />
              <span>{tag.text}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
