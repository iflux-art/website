import { useState } from 'react';
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
import type { LinksItem } from '@/types/links-types';

interface DeleteDialogProps {
  item: LinksItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (deletedId: string) => void;
  onError: (message: string) => void;
}

export function DeleteDialog({ item, onOpenChange, onSuccess, onError }: DeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/links?id=${item.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('删除网址失败');
      onSuccess(item.id);
      onOpenChange(false);
    } catch {
      onError('删除网址失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={!!item} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除网址 "{item?.title}" 吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? '删除中...' : '删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
