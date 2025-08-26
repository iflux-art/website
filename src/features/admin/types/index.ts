import type { ComponentType } from "react";

/**
 * Admin 功能相关类型定义
 */

// Links 相关类型
export interface LinksItem {
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

export interface LinksFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: "image" | "text";
  tags: string[];
  featured: boolean;
  category: string;
}

// Dialog 组件 Props 类型
export interface AddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (item: LinksFormData) => void;
  onError: (msg?: string) => void;
}

export interface EditDialogProps {
  open: boolean;
  item: LinksItem;
  onOpenChange: (open: boolean) => void;
  onSuccess: (item: LinksItem) => void;
  onError: (msg?: string) => void;
}

export interface DeleteDialogProps {
  item: LinksItem;
  onOpenChange: (open: boolean) => void;
  onSuccess: (id: string) => void;
  onError: (msg?: string) => void;
}

export interface AdminAction {
  label: string;
  onClick: () => void;
  icon?: ComponentType<{ className?: string }>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
  loading?: boolean;
}
