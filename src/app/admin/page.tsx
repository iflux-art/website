"use client";

import React, { useState, useEffect } from "react";
import { useDebouncedValue } from "@/hooks/ui/use-debounced-value";
import { useCategories } from "@/hooks/use-categories";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type AdminAction = {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  loading?: boolean;
};

function AdminActions({
  actions,
  className = "",
}: {
  actions: AdminAction[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <Button
            key={index}
            variant={action.variant || "default"}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            className="flex items-center gap-2"
            type="button"
          >
            {action.loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              IconComponent && <IconComponent className="h-4 w-4" />
            )}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
import { DataTable } from "@/components/links/data-table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { AddDialog } from "@/components/admin/dialog/add-dialog";
import { EditDialog } from "@/components/admin/dialog/edit-dialog";
import { DeleteDialog } from "@/components/admin/dialog/delete-dialog";
import {
  getTableColumns,
  getTableActions,
  getPageActions,
} from "@/components/links/table-config";
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

export default function LinksAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);

  // 使用共享的分类数据 hook
  const { categories, getCategoryName } = useCategories();

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
    const linksData = await fetchLinksData();
    setItems(linksData);
  };

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
        <h1 className="text-3xl font-bold tracking-tight"></h1>
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
        <CardContent className="py-6">
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
                <SelectContent className="z-50 max-h-[300px]">
                  <SelectItem value="all">所有分类</SelectItem>
                  {categories.map((category) => (
                    <div key={category.id}>
                      {/* 主分类 */}
                      <SelectItem value={category.id} className="font-medium">
                        {category.name}
                      </SelectItem>
                      {/* 子分类 */}
                      {category.children &&
                        category.children.map((subCategory) => (
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
