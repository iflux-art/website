"use client";

import { Sidebar } from "@/components/layout/sidebar";
import type { LinksCategory } from "@/features/links/types";
import type { SidebarItem } from "@/types";
import { Folder } from "lucide-react";
import { useMemo } from "react";

export interface LinksSidebarProps {
  categories: LinksCategory[];
  selectedCategory?: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

/**
 * 链接侧边栏组件
 *
 * 显示分类导航，支持分类筛选功能
 * 基于基础 Sidebar 组件构建
 */
export const LinksSidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: LinksSidebarProps) => {
  // 将 LinksCategory 转换为 SidebarItem 格式
  const sidebarItems = useMemo(() => {
    // 过滤掉友链和个人主页分类
    const filteredCategories = categories.filter(
      cat => cat.id !== "friends" && cat.id !== "profile"
    );

    // 按 order 排序分类
    const sortedCategories = filteredCategories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // 转换为 SidebarItem 格式
    const items: SidebarItem[] = sortedCategories.map(category => ({
      id: category.id,
      title: category.name,
      description: category.description,
      icon: <Folder className="h-4 w-4 text-muted-foreground" />,
      children: category.children?.map(child => ({
        id: child.id,
        title: child.name,
        description: child.description,
      })),
    }));

    return items;
  }, [categories]);

  return (
    <Sidebar
      items={sidebarItems}
      currentItem={selectedCategory}
      onItemClick={onCategoryChange}
      className={className}
      storageKey="links-sidebar-open-categories"
      showAllOption
      allOptionTitle="全部分类"
    />
  );
};
