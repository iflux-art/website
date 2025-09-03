"use client";

import { ThreeColumnLayout } from "@/components/layout";
import { LinksContent, LinksSidebarCard } from "@/features/links/components";
import { useLinksData } from "@/features/links/hooks";
import { useEffect, useState } from "react";
import { loadAllLinksData } from "@/features/links/lib";
import type { LinksItem } from "@/features/links/types";

/**
 * 链接导航页面容器组件（客户端）
 * 处理链接数据获取和交互逻辑
 */
export const LinksPageContainer = () => {
  const {
    categories,
    selectedCategory,
    filteredItems,
    handleCategoryClick,
    loading,
    error,
    allItems, // 确保我们能看到所有项目
    refreshData, // 使用刷新函数
  } = useLinksData();

  // 添加状态来跟踪数据加载尝试
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [directLoadResult, setDirectLoadResult] = useState<{
    success: boolean;
    data?: LinksItem[];
    error?: string;
  }>({ success: false });

  // 添加调试信息
  useEffect(() => {
    console.log("=== LinksPageContainer mounted ===");
    console.log("Categories count:", categories?.length || 0);
    console.log("FilteredItems count:", filteredItems?.length || 0);
    console.log("AllItems count:", allItems?.length || 0);
    console.log("Loading state:", loading);
    console.log("Error state:", error);
    console.log("Load attempts:", loadAttempts);

    // 尝试直接加载数据以验证功能
    async function testDirectLoad() {
      try {
        console.log("=== 直接尝试加载链接数据 ===");
        const data = await loadAllLinksData(`direct-test-${Date.now()}`);
        console.log("直接加载成功, 数据长度:", data.length);
        setDirectLoadResult({ success: true, data });

        if (data.length === 0) {
          console.warn("警告: 直接加载返回了空数组!");
        } else {
          console.log("前5个数据项:", data.slice(0, 5));
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error("直接加载失败:", errorMsg);
        setDirectLoadResult({ success: false, error: errorMsg });
      }
    }

    // 如果filteredItems为空且未超过最大尝试次数，尝试刷新数据
    if ((filteredItems?.length === 0 || !filteredItems) && !loading && loadAttempts < 3) {
      console.log("没有数据，尝试刷新... (尝试次数:", loadAttempts + 1, ")");
      setLoadAttempts(prev => prev + 1);
      refreshData();
      // 同时尝试直接加载
      testDirectLoad();
    }
  }, [
    filteredItems, // 修复：使用完整的filteredItems而不是filteredItems?.length
    loading,
    loadAttempts,
    categories?.length,
    refreshData,
    allItems?.length,
    error,
  ]); // 简化依赖数组，只包含必要的依赖

  // 左侧边栏内容
  const leftSidebar = (
    <LinksSidebarCard
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryClick}
      showHeader={false}
    />
  );

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">加载中...</p>
            <p className="text-sm text-muted-foreground mt-2">正在加载链接数据</p>
          </div>
        </div>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md">
            <h3 className="mb-2 text-lg font-medium text-destructive">加载失败</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <div className="mb-4 text-left bg-muted p-3 rounded text-xs">
              <p className="font-medium">调试信息:</p>
              <p>分类数量: {categories?.length || 0}</p>
              <p>过滤项数量: {filteredItems?.length || 0}</p>
              <p>所有项数量: {allItems?.length || 0}</p>
              <p>
                直接加载: {directLoadResult.success ? "成功" : directLoadResult.error || "未尝试"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoadAttempts(0);
                refreshData();
              }}
              className="mt-2 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有数据，显示空状态
  if (!filteredItems || filteredItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md">
            <h3 className="mb-2 text-lg font-medium text-muted-foreground">暂无链接数据</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedCategory
                ? `没有找到关于 "${selectedCategory}" 的链接`
                : "没有找到任何链接数据"}
            </p>
            <div className="mb-4 text-left bg-muted p-3 rounded text-xs">
              <p className="font-medium">调试信息:</p>
              <p>分类数量: {categories?.length || 0}</p>
              <p>过滤项数量: {filteredItems?.length || 0}</p>
              <p>所有项数量: {allItems?.length || 0}</p>
              <p>
                直接加载:{" "}
                {directLoadResult.success
                  ? `成功 (${directLoadResult.data?.length || 0} 项)`
                  : directLoadResult.error || "未尝试"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoadAttempts(0);
                refreshData();
              }}
              className="mt-2 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              刷新数据
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ThreeColumnLayout leftSidebar={leftSidebar} layout="single-sidebar">
        <LinksContent items={filteredItems} selectedCategory={selectedCategory} />
      </ThreeColumnLayout>
    </div>
  );
};
