"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddDialog, AdminActions, DeleteDialog, EditDialog } from "@/features/admin/components";
import { useDebouncedValue } from "@/features/admin/hooks/use-debounced-value";
import { fetchLinksData } from "@/features/admin/lib";
import type { LinksItem as AdminLinksItem } from "@/features/admin/types";
import {
  DataTable,
  getPageActions,
  getTableActions,
  getTableColumns,
} from "@/features/links/components";
import { useCategories } from "@/features/links/hooks/use-categories";
import type { LinksCategory, LinksItem, LinksSubCategory } from "@/features/links/types";
import type { SearchFilterProps } from "@/types/props-types";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useAdminStore } from "@/stores";

/**
 * 页面标题组件 Props
 * 显示页面标题和项目计数
 */
interface PageHeaderProps {
  /** 项目总数 */
  itemCount: number;
}

const PageHeader = ({ itemCount }: PageHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold tracking-tight">网址管理</h1>
    <p className="mt-2 text-muted-foreground">
      管理网站导航中的所有网址，当前共有 {itemCount} 个网址
    </p>
  </div>
);

/**
 * 搜索和过滤组件 Props (已移除，使用通用类型)
 */

const SearchFilter = (
  {
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
  }: SearchFilterProps<LinksCategory> // 使用通用类型
) => (
  <Card className="mb-6">
    <CardContent className="py-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="搜索网址、标题、描述或标签..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <Select
            value={selectedCategory || "all"}
            onValueChange={value => onCategoryChange(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="所有分类" />
            </SelectTrigger>
            <SelectContent className="z-50 max-h-[300px] bg-popover/100">
              <SelectItem value="all">所有分类</SelectItem>
              {categories.map((category: LinksCategory) => (
                <div key={category.id}>
                  {/* 主分类 */}
                  <SelectItem value={category.id} className="font-medium">
                    {category.name}
                  </SelectItem>
                  {/* 子分类 */}
                  {category?.children &&
                    Array.isArray(category.children) &&
                    category.children.map((subCategory: LinksSubCategory) => (
                      <SelectItem
                        key={subCategory.id}
                        value={subCategory.id}
                        className="pl-6 text-sm text-muted-foreground"
                      >
                        └ {subCategory.name}
                      </SelectItem>
                    ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * 过滤链接项的自定义 hook
 * 根据搜索词和分类筛选链接项
 *
 * @param items 链接项数组
 * @param searchTerm 搜索词
 * @param selectedCategory 选中的分类
 * @returns 过滤后的链接项数组
 */
const useFilteredItems = (items: LinksItem[], searchTerm: string, selectedCategory: string) => {
  /** 防抖后的搜索词 */
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  /** 过滤后的链接项 */
  const filteredItems = useMemo(() => {
    // 如果没有搜索条件和分类筛选，直接返回原数据
    if (!(debouncedSearchTerm || selectedCategory)) {
      return items;
    }

    /** 小写搜索词，用于不区分大小写的匹配 */
    const searchLower = debouncedSearchTerm.toLowerCase();

    return items.filter(item => {
      /** 检查是否匹配搜索词 */
      const matchesSearch =
        !debouncedSearchTerm ||
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.url.toLowerCase().includes(searchLower) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchLower));

      /** 检查是否匹配分类 */
      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, debouncedSearchTerm, selectedCategory]);

  return filteredItems;
};

/**
 * 事件处理器 hook
 */
const useEventHandlers = (
  loadData: () => Promise<void>,
  setShowAddDialog: (show: boolean) => void,
  setEditingItem: (item: LinksItem | null) => void,
  setDeletingItem: (item: LinksItem | null) => void
) => {
  const handleAddSuccess = useCallback(
    (_item: import("@/features/admin/types").LinksFormData) => {
      void loadData();
      setShowAddDialog(false);
    },
    [loadData, setShowAddDialog]
  );

  const handleEditSuccess = useCallback(() => {
    void loadData();
    setEditingItem(null);
  }, [loadData, setEditingItem]);

  const handleDeleteSuccess = useCallback(() => {
    void loadData();
    setDeletingItem(null);
  }, [loadData, setDeletingItem]);

  const handleAddError = useCallback(() => {
    // 可以在这里添加错误处理逻辑
  }, []);

  const handleEditError = useCallback(() => {
    // 可以在这里添加错误处理逻辑
  }, []);

  const handleDeleteError = useCallback(() => {
    // 可以在这里添加错误处理逻辑
  }, []);

  return {
    handleAddSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleAddError,
    handleEditError,
    handleDeleteError,
  };
};

/**
 * 链接管理页面组件
 * 封装了链接管理的所有业务逻辑和状态管理
 */
export const LinksAdminPage = () => {
  // 使用 Zustand 管理状态
  const {
    items,
    searchTerm,
    selectedCategory,
    showAddDialog,
    editingItem,
    deletingItem,
    setItems,
    setSearchTerm,
    setSelectedCategory,
    setShowAddDialog,
    setEditingItem,
    setDeletingItem,
    setLoading,
    setError,
  } = useAdminStore();

  // 使用共享的分类数据 hook
  const { categories, getCategoryName } = useCategories();

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const linksData = await fetchLinksData();
      setItems(linksData.flat());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading, setError]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // 过滤数据
  const filteredItems = useFilteredItems(items, searchTerm, selectedCategory);

  // 事件处理器
  const {
    handleAddSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleAddError,
    handleEditError,
    handleDeleteError,
  } = useEventHandlers(loadData, setShowAddDialog, setEditingItem, setDeletingItem);

  return (
    <>
      {/* 页面标题 */}
      <PageHeader itemCount={items.length} />

      {/* 操作按钮 */}
      <div className="mb-6">
        <AdminActions actions={getPageActions(() => setShowAddDialog(true))} />
      </div>

      {/* 搜索和过滤 */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* 网址表格 */}
      <DataTable
        data={filteredItems}
        columns={getTableColumns((categoryId: string) => getCategoryName(categoryId) ?? "")}
        actions={getTableActions(
          (record: LinksItem) => setEditingItem(record),
          (record: LinksItem) => setDeletingItem(record)
        )}
      />

      {/* 对话框组件 */}
      <AddDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleAddSuccess}
        onError={handleAddError}
      />

      <EditDialog
        open={!!editingItem}
        item={editingItem as AdminLinksItem}
        onOpenChange={(open: boolean) => !open && setEditingItem(null)}
        onSuccess={handleEditSuccess}
        onError={handleEditError}
      />

      <DeleteDialog
        item={deletingItem as AdminLinksItem}
        onOpenChange={(open: boolean) => !open && setDeletingItem(null)}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />
    </>
  );
};

export default LinksAdminPage;
