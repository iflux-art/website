import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LinksForm } from '@/components/layout/links/admin/links-form';
import type { LinksItem, LinksFormData } from '@/types';

interface EditDialogProps {
  item: LinksItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedItem: LinksItem) => void;
  onError: (message: string) => void;
}

export function EditDialog({ item, onOpenChange, onSuccess, onError }: EditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (formData: LinksFormData) => {
    if (!item) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/links?id=${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item');
      }

      const updatedItem: LinksItem = await response.json();
      onSuccess(updatedItem);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating item:', error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
