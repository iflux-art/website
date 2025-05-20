import Link from 'next/link';
import { Tag as TagIcon } from 'lucide-react';

/**
 * 标签云组件属性
 *
 * @interface TagCloudProps
 */
interface TagCloudProps {
  /**
   * 标签列表
   */
  tags: string[];
}

/**
 * 标签云组件
 *
 * 用于显示博客文章的标签列表，支持点击导航到标签页面
 *
 * @param {TagCloudProps} props - 组件属性
 * @returns {JSX.Element} 标签云组件
 *
 * @example
 * ```tsx
 * <TagCloud tags={["React", "Next.js", "TypeScript"]} />
 * ```
 */
export function TagCloud({ tags }: TagCloudProps) {
  return (
    <div className="bg-card border-b border-b-primary/20 pb-4 overflow-hidden">
      <div className="flex flex-wrap gap-2 mt-2">
        {(tags || []).map((tag: string, index: number) => (
          <Link
            key={index}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="px-2 py-1 bg-muted rounded-md text-xs hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {tag}
          </Link>
        ))}
        {(!tags || tags.length === 0) && (
          <span className="text-sm text-muted-foreground">
            暂无标签
          </span>
        )}
      </div>
    </div>
  );
}