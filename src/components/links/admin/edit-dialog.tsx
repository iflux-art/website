import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LinksForm } from "./links-form";
// 内联 LinksItem 类型定义
interface LinksItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  iconType?: "image" | "text";
  tags: string[];
  featured?: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  visits?: number;
  isActive?: boolean;
}
// 内联 LinksFormData 类型定义
interface LinksFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: "image" | "text";
  tags: string[];
  featured: boolean;
  category: string;
}
// 内联 EditDialogProps 类型定义
interface EditDialogProps {
  open: boolean;
  item: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: (item: LinksItem) => void;
  onError: (msg?: string) => void;
}

export function EditDialog({
  item,
  onOpenChange,
  onSuccess,
  onError,
}: EditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (formData: LinksFormData) => {
    if (!item) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/links?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update item");
      }

      const updatedItem: LinksItem = await response.json();
      onSuccess(updatedItem);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating item:", error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑网址</DialogTitle>
        </DialogHeader>
        {item && (
          <LinksForm
            submitAction={handleSubmit}
            onCancel={() => onOpenChange(false)}
            initialData={item}
            isLoading={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
