import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "packages/ui/components/shared-ui/dialog";
import { LinksForm } from "./links-form";
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
// 内联 AddDialogProps 类型定义
interface AddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (item: any) => void;
  onError: (msg?: string) => void;
}

export function AddDialog({
  open,
  onOpenChange,
  onSuccess,
  onError,
}: AddDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: LinksFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add item");
      }

      const newItem = await response.json();
      onSuccess(newItem);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding item:", error);
      if (error instanceof Error && error.message === "URL already exists") {
        onError("该网址已存在");
      } else {
        onError("添加网址失败");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl space-y-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            添加新网址
          </DialogTitle>
        </DialogHeader>
        <LinksForm
          submitAction={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
