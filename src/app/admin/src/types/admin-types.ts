// admin-types.ts
// 归档 admin 相关所有 props/type/interface 类型

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// AdminMenu 组件 props（NavProps 已在 nav-types 归档，这里不重复）
// AdminLayout 组件 props
export interface AdminLayoutProps {
  children: ReactNode;
}

// AdminPageContentLayout 组件 props
export interface AdminPageContentLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  backUrl?: string;
  backLabel?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

// LoginDialog 组件 props
export interface LoginDialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// AdminActions 组件 props
export interface AdminAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  loading?: boolean;
}
export interface AdminActionsProps {
  actions: AdminAction[];
  className?: string;
}

// 管理后台统计卡片类型归档
export interface AdminStatItem {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
}
