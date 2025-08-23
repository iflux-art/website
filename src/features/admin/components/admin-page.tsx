'use client';

import React, { useState, useEffect } from 'react';
import { useDebouncedValue } from '@/features/admin/hooks/use-debounced-value';
import { useCategories } from '@/features/links/hooks/use-categories';
import type {
  LinksSubCategory,
  LinksCategory,
  LinksItem as LinksItemData,
} from '@/features/links/types';
import type { LinksItem as AdminLinksItem, LinksFormData } from '@/features/admin/types';
import { AdminActions } from '@/features/admin/components';
import { DataTable } from '@/features/links/components';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { AddDialog, EditDialog, DeleteDialog } from '@/features/admin/components';
import { getTableColumns, getTableActions, getPageActions } from '@/features/links/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchLinksData } from '@/features/admin/lib';

/**
 * 链接管理页面组件
 * 封装了链接管理的所有业务逻辑和状态管理
 */
export function LinksAdminPage() {
  // 状态管理
  const [items, setItems] = useState<LinksItemData[]>([]);
  const [filteredItems, setFilteredItems] = useState<LinksItemData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // 对话框状态
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<LinksItemData | null>(null);
  const [deletingItem, setDeletingItem] = useState<LinksItemData | null>(null);

  // 使用共享的分类数据 hook
  const { categories, getCategoryName } = useCategories();

  // 加载数据
  useEffect(() => {
    void loadData();
  }, []);

  // 过滤数据
  useEffect(() => {
    const filterItems = () => {
      if (!debouncedSearchTerm && !selectedCategory) {
        setFilteredItems(items);
        return;
      }

      const searchLower = debouncedSearchTerm.toLowerCase();

      setFilteredItems(
        items.filter(item => {
          const matchesSearch =
            !debouncedSearchTerm ||
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.url.toLowerCase().includes(searchLower) ||
            item.tags.some((tag: string) => tag.toLowerCase().includes(searchLower));

          const matchesCategory = !selectedCategory || item.category === selectedCategory;

          return matchesSearch && matchesCategory;
        })
      );
    };

    filterItems();
  }, [items, debouncedSearchTerm, selectedCategory]);

  const loadData = async () => {
    const linksData = await fetchLinksData();
    setItems(linksData.flat());
  };

  // 事件处理器
  const handleAddSuccess = (_item: LinksFormData) => {
    void loadData();
    setShowAddDialog(false);
  };

  const handleEditSuccess = () => {
    void loadData();
    setEditingItem(null);
  };

  const handleDeleteSuccess = () => {
    void loadData();
    setDeletingItem(null);
  };

  const handleAddError = () => {
    // 可以在这里添加错误处理逻辑
  };

  const handleEditError = () => {
    // 可以在这里添加错误处理逻辑
  };

  const handleDeleteError = () => {
    // 可以在这里添加错误处理逻辑
  };

  return (
    <>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">网址管理</h1>
        <p className="mt-2 text-muted-foreground">
          管理网站导航中的所有网址，当前共有 {items.length} 个网址
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6">
        <AdminActions actions={getPageActions(() => setShowAddDialog(true))} />
      </div>

      {/* 搜索和过滤 */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="搜索网址、标题、描述或标签..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={selectedCategory || 'all'}
                onValueChange={value => setSelectedCategory(value === 'all' ? '' : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="所有分类" />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-[300px]">
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

      {/* 网址表格 */}
      <DataTable
        data={filteredItems}
        columns={getTableColumns((categoryId: string) => getCategoryName(categoryId) ?? '')}
        actions={getTableActions(
          (record: LinksItemData) => setEditingItem(record),
          (record: LinksItemData) => setDeletingItem(record)
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
}

export default LinksAdminPage;
