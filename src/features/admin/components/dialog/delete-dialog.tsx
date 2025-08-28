"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DeleteDialogProps } from "@/features/admin/types";
import { useState } from "react";

interface DeleteDialogItem {
  id: string;
  title: string;
}

export const DeleteDialog = ({ item, onOpenChange, onSuccess, onError }: DeleteDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/links?id=${(item as DeleteDialogItem).id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData: { error?: string } = (await response.json()) as {
          error?: string;
        };
        throw new Error(errorData.error ?? "Failed to delete item");
      }

      onSuccess((item as DeleteDialogItem).id);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError("An unknown error occurred");
      }
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
            确定要删除网址 &quot;{(item as DeleteDialogItem)?.title}&quot; 吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={() => void handleDelete()} disabled={isLoading}>
            {isLoading ? "删除中..." : "删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
