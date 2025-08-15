"use client";

import { TagCloud } from "@/features/blog/components";
import { ArticleModal } from "@/features/blog";
import { useBlogPosts } from "@/features/blog/hooks";
import { useModal } from "@/hooks/use-modal";
import { useArticleFilter } from "@/hooks/use-article-filter";
import { useMemo } from "react";

// 内联类型定义
interface TagWithCount {
  name: string;
  count: number;
  isPopular: boolean;
}

export default function TagsPage() {
  const { posts } = useBlogPosts();
  const { modalState, openModal, closeModal } = useModal();
  const { filterByTag } = useArticleFilter();

  // 计算标签统计信息
  const tagsWithCount = useMemo<TagWithCount[]>(() => {
    const tagStats = new Map<string, number>();

    // 统计每个标签的文章数量
    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          tagStats.set(tag, (tagStats.get(tag) || 0) + 1);
        });
      }
    });

    // 转换为数组并排序（按使用频率降序）
    const tagsArray = Array.from(tagStats.entries()).map(([name, count]) => ({
      name,
      count,
      isPopular: count >= 3, // 3篇及以上文章的标签视为热门
    }));

    return tagsArray.sort((a, b) => b.count - a.count);
  }, [posts]);

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    const filterResult = filterByTag(posts, tag);
    const title = `${tag} 标签 (${filterResult.posts.length}篇)`;
    openModal(title, filterResult.posts);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight">文章标签</h1>
          <p className="text-muted-foreground">
            通过标签发现相关文章，探索更多主题
          </p>
        </div>

        {/* 标签云区域 */}
        <div className="mb-8">
          <h2 className="mb-6 text-xl font-semibold">热门标签</h2>
          <TagCloud
            tags={tagsWithCount}
            onTagClick={handleTagClick}
            className="min-h-[200px]"
          />
        </div>

        {/* 文章模态对话框 */}
        <ArticleModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={modalState.title}
          posts={modalState.posts}
          isLoading={modalState.isLoading}
          error={modalState.error}
        />
      </div>
    </div>
  );
}
