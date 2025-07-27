"use client";

import React, { useState, useEffect } from "react";
import { useDebouncedValue } from "@/hooks/ui/use-debounced-value";
import { AdminLayout } from "@/components/links/admin/admin-layout";
import { AdminActions } from "@/components/links/admin/admin-actions";
import { DataTable } from "@/components/links/data-table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Globe } from "lucide-react";
import { AddDialog } from "@/components/links/admin/add-dialog";
import { EditDialog } from "@/components/links/admin/edit-dialog";
import { DeleteDialog } from "@/components/links/admin/delete-dialog";
import {
  getTableColumns,
  getTableActions,
  getPageActions,
} from "@/components/links/admin/table-config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 客户端使用的函数
const fetchLinksData = async (): Promise<any[]> => {
  const res = await fetch("/api/links", { cache: "no-store" });
  const config = await res.json();
  return Array.isArray(config) ? config : config.items || [];
};

const fetchLinksCategories = async (): Promise<any[]> => {
  const res = await fetch("/api/links/categories", { cache: "no-store" });
  return await res.json();
};

export default function LinksAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);

  // 加载数据
  useEffect(() => {
    loadData();
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
        items.filter((item) => {
          const matchesSearch =
            !debouncedSearchTerm ||
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.url.toLowerCase().includes(searchLower) ||
            item.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchLower),
            );

          const matchesCategory =
            !selectedCategory || item.category === selectedCategory;

          return matchesSearch && matchesCategory;
        }),
      );
    };

    filterItems();
  }, [items, debouncedSearchTerm, selectedCategory]);

  const loadData = async () => {
    const [linksData, categoriesData] = await Promise.all([
      fetchLinksData(),
      fetchLinksCategories(),
    ]);
    setItems(linksData);
    setCategories(categoriesData);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // Delete this block

  // 配置已移至 table-config.ts

  const handleAddSuccess = (_item: any) => {
    loadData();
    setShowAddDialog(false);
  };
  const handleAddError = () => {};

  // 编辑成功/失败回调
  const handleEditSuccess = () => {
    loadData();
    setEditingItem(null);
  };
  const handleEditError = () => {};

  // 删除成功/失败回调
  const handleDeleteSuccess = () => {
    loadData();
    setDeletingItem(null);
  };
  const handleDeleteError = () => {};

  return (
    <AdminLayout>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Globe className="h-8 w-8" />
          网址管理
        </h1>
        <p className="mt-2 text-muted-foreground">
          管理网站导航中的所有网址，当前共有 {items.length} 个网址
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6">
        <AdminActions
          actions={getPageActions(() => setShowAddDialog(true), loadData)}
        />
      </div>

      {/* 搜索和过滤 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="搜索网址、标题、描述或标签..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) =>
                  setSelectedCategory(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="所有分类" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all">所有分类</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 网址表格 */}
      <DataTable<any>
        data={filteredItems}
        columns={getTableColumns(getCategoryName)}
        actions={getTableActions(
          (record) => setEditingItem(record),
          (record) => setDeletingItem(record),
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
        item={editingItem}
        onOpenChange={(open: boolean) => !open && setEditingItem(null)}
        onSuccess={handleEditSuccess}
        onError={handleEditError}
      />

      <DeleteDialog
        item={deletingItem}
        onOpenChange={(open: boolean) => !open && setDeletingItem(null)}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />
    </AdminLayout>
  );
}
