"use client";

import { ContentCard, type ContentCardProps } from "./content-card";
import type { ContentItem } from "@/features/content/types";

export interface ContentListProps {
  /** 内容项数组 */
  items: ContentItem[];
  /** 内容卡片属性 */
  cardProps?: Partial<ContentCardProps>;
  /** 自定义类名 */
  className?: string;
}

export function ContentList({ items, cardProps = {}, className }: ContentListProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ContentCard key={item.slug} item={item} {...cardProps} />
        ))}
      </div>
    </div>
  );
}
