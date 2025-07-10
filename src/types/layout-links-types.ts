// layout-links-types.ts

import type { LinksItem, LinksFormData } from "@/types/links-types";
import type { LucideIcon } from "lucide-react";

export interface TableColumn<T extends object> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableAction<T extends object> {
  label: string;
  onClick: (record: T, index: number) => void;
  icon?: LucideIcon;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: (record: T) => boolean;
}

export interface DataTableProps<T extends object> {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
}

export interface AddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newItem: LinksItem) => void;
  onError: (message: string) => void;
}

export interface EditDialogProps {
  item: LinksItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedItem: LinksItem) => void;
  onError: (message: string) => void;
}

export interface DeleteDialogProps {
  item: LinksItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (deletedId: string) => void;
  onError: (message: string) => void;
}

export interface LinksFormProps {
  submitAction: (data: LinksFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<LinksFormData>;
  isLoading?: boolean;
}
