import Link from 'next/link';
import { Tag as TagIcon } from 'lucide-react';

/**
 * 标签云组件属性
 */
export interface TagCloudProps {
  /**
   * 标签列表
   */
  tags: string[];
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 点击标签时的回调函数
   */
  onTagClick?: (tag: string) => void;
}

/**
 * 标签云组件
 *
 * 用于显示博客文章的标签列表，支持点击导航到标签页面
 *
 * @example
 * ```tsx
 * <TagCloud tags={["React", "Next.js", "TypeScript"]} />
 * ```
 */
export function TagCloud({ tags, className, onTagClick }: TagCloudProps) {
  return (
    <div className={`bg-card border-b border-b-primary/20 pb-5 overflow-hidden rounded-lg shadow-sm ${className || ''}`}>
      <div className="flex flex-wrap gap-3 mt-3 px-4">
        {(tags || []).map((tag: string, index: number) => (
          <Link
            key={index}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium hover:bg-primary/10 hover:text-primary transition-all shadow-sm hover:shadow-md"
            onClick={(e) => {
              if (onTagClick) {
                e.preventDefault();
                onTagClick(tag);
              }
            }}
          >
            {tag}
          </Link>
        ))}
        {(!tags || tags.length === 0) && (
          <span className="text-sm text-muted-foreground font-medium px-3 py-1.5">暂无标签</span>
        )}
      </div>
    </div>
  );
}
