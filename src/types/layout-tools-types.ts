// layout-tools-types.ts

import type { LucideIcon } from "lucide-react";

export interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  disabled?: boolean;
}

export interface ToolActionsProps {
  actions: ActionButton[];
  className?: string;
}

export interface ToolLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  helpContent?: React.ReactNode;
  showBackButton?: boolean;
}

export interface ProcessResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
  tags: string[];
  isInternal: boolean;
}
