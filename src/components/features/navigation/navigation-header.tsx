interface NavigationHeaderProps {
  totalItems: number;
  filteredCount: number;
  selectedCategory?: string;
  selectedTag?: string | null;
  getCategoryName: (categoryId: string) => string;
}

export function NavigationHeader({
  totalItems,
  filteredCount,
  selectedCategory,
  selectedTag,
  getCategoryName,
}: NavigationHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">导航</h1>
      {selectedCategory || selectedTag ? (
        <p>
          显示 {filteredCount} 个网址
          {selectedCategory && ` · ${getCategoryName(selectedCategory)}`}
          {selectedTag && ` · ${selectedTag}`}
        </p>
      ) : (
        <p className="text-muted-foreground">
          共收录 {totalItems} 个优质网站，欢迎
          <a
            href="https://ocnzi0a8y98s.feishu.cn/share/base/form/shrcnB0sog9RdZVM8FLJNXVsFFb"
            target="_blank"
            rel="noreferrer"
          >
            互换友链
          </a>
        </p>
      )}
    </div>
  );
}
