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
  onSuccess: (item: any) => void;
  onError: (msg?: string) => void;
}

export interface EditDialogProps {
  open: boolean;
  item: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: (item: LinksItem) => void;
  onError: (msg?: string) => void;
}

export interface DeleteDialogProps {
  item: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: (id: string) => void;
  onError: (msg?: string) => void;
}
