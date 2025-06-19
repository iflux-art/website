import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LinksForm } from '@/components/layout/links/admin/links-form';
import type { LinksFormData } from '@/types/links-types';

interface AddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LinksFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function AddDialog({ open, onOpenChange, onSubmit, isSubmitting }: AddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">添加新网址</DialogTitle>
        </DialogHeader>
        <LinksForm
          submitAction={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
