'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin/admin-layout';
import { AdminActions } from '@/components/layout/admin/admin-actions';
import { DataTable, type TableColumn } from '@/components/layout/navigation/admin/data-table';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  AlertCircle,
  CheckCircle,
  Globe,
} from 'lucide-react';
import { NavigationForm } from '@/components/layout/navigation/admin/navigation-form';
import {
  NavigationItem,
  NavigationFormData,
  NavigationCategory,
} from '@/components/layout/navigation/common/navigation-types';

export default function NavigationAdminPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const [filteredItems, setFilteredItems] = useState<NavigationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<NavigationItem | null>(null);
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
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [navigationData, categoriesData] = await Promise.all([
        fetch('/api/navigation').then(res => res.json()),
        fetch('/api/navigation?type=categories').then(res => res.json()),
      ]);

      setItems(navigationData.items || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showAlert('error', '加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleAddItem = async (formData: NavigationFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add item');
      }

      const newItem = await response.json();
      setItems(prev => [...prev, newItem]);
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

  const handleEditItem = async (formData: NavigationFormData) => {
    if (!editingItem) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/navigation?id=${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update item');
      }

      const updatedItem = await response.json();
      setItems(prev => prev.map(item => (item.id === editingItem.id ? updatedItem : item)));
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
      const response = await fetch(`/api/navigation?id=${deletingItem.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setItems(prev => prev.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
      showAlert('success', '网址删除成功');
    } catch (error) {
      console.error('Error deleting item:', error);
      showAlert('error', '删除网址失败');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  const actions = [
    {
      label: '添加网址',
      onClick: () => setShowAddDialog(true),
      icon: Plus,
    },
    {
      label: '刷新数据',
      onClick: loadData,
      icon: Search,
      variant: 'outline' as const,
    },
  ];

  const tableColumns: TableColumn<NavigationItem>[] = [
    {
      key: 'icon',
      title: '图标',
      width: '60px',
      render: (value, record, _index) => (
        <div className="text-lg">
          {record.iconType === 'emoji' ? (
            record.icon
          ) : record.iconType === 'image' ? (
            <img src={record.icon} alt="" className="w-6 h-6" />
          ) : (
            <span className="text-sm font-bold">{record.icon}</span>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      title: '标题',
      render: (value, record, _index) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{record.url}</div>
        </div>
      ),
    },
    {
      key: 'category',
      title: '分类',
      render: (value, _record, _index) => (value ? getCategoryName(value as string) : '-'),
    },
    {
      key: 'tags',
      title: '标签',
      render: (value, _record, _index) => {
        const tags = value as string[];
        if (!tags?.length) return null;
        return (
          <div className="flex gap-1 flex-wrap">
            {tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'featured',
      title: '状态',
      render: (value, _record, _index) =>
        (value as boolean) ? (
          <Badge variant="default">精选</Badge>
        ) : (
          <Badge variant="outline">普通</Badge>
        ),
    },
  ];

  const tableActions = [
    {
      label: '访问',
      onClick: (record: NavigationItem) => window.open(record.url, '_blank'),
      icon: ExternalLink,
      variant: 'outline' as const,
    },
    {
      label: '编辑',
      onClick: (record: NavigationItem) => setEditingItem(record),
      icon: Edit,
      variant: 'outline' as const,
    },
    {
      label: '删除',
      onClick: (record: NavigationItem) => setDeletingItem(record),
      icon: Trash2,
      variant: 'destructive' as const,
    },
  ];

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
        <AdminActions actions={actions} />
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
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">所有分类</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 网址表格 */}
      <DataTable<NavigationItem>
        data={filteredItems}
        columns={tableColumns}
        actions={tableActions}
        loading={isLoading}
        emptyText={searchTerm || selectedCategory ? '没有找到匹配的网址' : '还没有添加任何网址'}
      />

      {/* 添加对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>添加新网址</DialogTitle>
          </DialogHeader>
          <NavigationForm
            submitAction={handleAddItem}
            onCancel={() => setShowAddDialog(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* 编辑对话框 */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑网址</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <NavigationForm
              submitAction={handleEditItem}
              onCancel={() => setEditingItem(null)}
              initialData={editingItem}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除网址 "{deletingItem?.title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
