'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin/admin-layout';
import { AdminActions } from '@/components/layout/admin/admin-actions';
import { DataTable } from '@/components/layout/links/admin/data-table';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import { AddDialog } from '@/components/layout/links/admin/dialogs/add-dialog';
import { EditDialog } from '@/components/layout/links/admin/dialogs/edit-dialog';
import { DeleteDialog } from '@/components/layout/links/admin/dialogs/delete-dialog';
import {
  getTableColumns,
  getTableActions,
  getPageActions,
} from '@/components/layout/links/admin/table-config';
import type { LinksItem, LinksFormData, LinksCategory } from '@/types/links-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export default function LinksAdminPage() {
  const [items, setItems] = useState<LinksItem[]>([]);
  const [categories, setCategories] = useState<LinksCategory[]>([]);
  const [filteredItems, setFilteredItems] = useState<LinksItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<LinksItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<LinksItem | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 过滤数据
  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory]);

  const loadData = async () => {
    try {
      const [linksData, categoriesData] = await Promise.all([
        fetch('/api/links').then((res) => res.json()),
        fetch('/api/links?type=categories').then((res) => res.json()),
      ]);

      setItems(linksData.items || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showAlert('error', '加载数据失败');
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleAddItem = async (formData: LinksFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add item');
      }

      const newItem = await response.json();
      setItems((prev) => [...prev, newItem]);
      setShowAddDialog(false);
      showAlert('success', '网址添加成功');
    } catch (error) {
      console.error('Error adding item:', error);
      if (error instanceof Error && error.message === 'URL already exists') {
        showAlert('error', '该网址已存在');
      } else {
        showAlert('error', '添加网址失败');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async (formData: LinksFormData) => {
    if (!editingItem) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/links?id=${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update item');
      }

      const updatedItem = await response.json();
      setItems((prev) => prev.map((item) => (item.id === editingItem.id ? updatedItem : item)));
      setEditingItem(null);
      showAlert('success', '网址更新成功');
    } catch (error) {
      console.error('Error updating item:', error);
      if (error instanceof Error && error.message === 'URL already exists') {
        showAlert('error', '该网址已存在');
      } else {
        showAlert('error', '更新网址失败');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    try {
      const response = await fetch(`/api/links?id=${deletingItem.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
      setDeletingItem(null);
      showAlert('success', '网址删除成功');
    } catch (error) {
      console.error('Error deleting item:', error);
      showAlert('error', '删除网址失败');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // Delete this block

  // 配置已移至 table-config.ts

  return (
    <AdminLayout>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Globe className="h-8 w-8" />
          网址管理
        </h1>
        <p className="text-muted-foreground mt-2">
          管理网站导航中的所有网址，当前共有 {items.length} 个网址
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6">
        <AdminActions actions={getPageActions(() => setShowAddDialog(true), loadData)} />
      </div>
      {/* 提示信息 */}
      {alert && (
        <Alert
          className={`mb-6 ${alert.type === 'error' ? 'border-destructive' : 'border-green-500'}`}
        >
          {alert.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* 搜索和过滤 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                value={selectedCategory || 'all'}
                onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}
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
      <DataTable<LinksItem>
        data={filteredItems}
        columns={getTableColumns(getCategoryName)}
        actions={getTableActions(
          (record) => setEditingItem(record),
          (record) => setDeletingItem(record)
        )}
        loading={false}
        emptyText={searchTerm || selectedCategory ? '没有找到匹配的网址' : '还没有添加任何网址'}
      />

      {/* 对话框组件 */}
      <AddDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddItem}
        isSubmitting={isSubmitting}
      />

      <EditDialog
        item={editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        onSubmit={handleEditItem}
        isSubmitting={isSubmitting}
      />

      <DeleteDialog
        item={deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        onConfirm={handleDeleteItem}
      />
    </AdminLayout>
  );
}
