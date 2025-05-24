import { BlogTagFilter } from '@/components/features/blog/blog-tag-filter';

interface BlogLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showTagFilter?: boolean;
  allTags?: string[];
  selectedTag?: string | null;
  onTagChange?: (tag: string | null) => void;
  extraContent?: React.ReactNode;
}

export function BlogLayout({
  children,
  title,
  description,
  showTagFilter = false,
  allTags = [],
  selectedTag = null,
  onTagChange,
  extraContent,
}: BlogLayoutProps) {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* 主要内容区 - 与 docs 页面保持一致的宽度 */}
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
          {description && <p className="text-xl text-muted-foreground">{description}</p>}
        </div>

        {/* 额外内容（如全部文章和时间轴按钮） */}
        {extraContent}

        {/* 标签筛选器 */}
        {showTagFilter && allTags.length > 0 && onTagChange && (
          <div className="mb-8">
            <BlogTagFilter
              allTags={allTags}
              selectedTag={selectedTag}
              setSelectedTag={onTagChange}
            />
          </div>
        )}

        {/* 主要内容 */}
        {children}
      </div>
    </div>
  );
}
