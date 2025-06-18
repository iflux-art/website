import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LinksForm } from '@/components/layout/links/admin/links-form';
import type { LinksItem, LinksFormData } from '@/types/links-types';

interface EditDialogProps {
  item: LinksItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LinksFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function EditDialog({ item, onOpenChange, onSubmit, isSubmitting }: EditDialogProps) {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑网址</DialogTitle>
        </DialogHeader>
        {item && (
          <LinksForm
            submitAction={onSubmit}
            onCancel={() => onOpenChange(false)}
            initialData={item}
            isLoading={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
