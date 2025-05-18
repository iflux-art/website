/**
 * 组件类型定义
 */
import { ReactNode } from 'react';
import { Language } from './common';

// 按钮组件属性
export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

// 导航栏组件属性
export interface NavbarProps {
  className?: string;
}

// 页脚组件属性
export interface FooterProps {
  className?: string;
}

// 语言切换组件属性
export interface LanguageToggleProps {
  className?: string;
}

// 主题切换组件属性
export interface ThemeToggleProps {
  className?: string;
}

// 搜索对话框组件属性
export interface SearchDialogProps {
  className?: string;
}

// 卡片组件属性
export interface CardProps {
  className?: string;
  children: ReactNode;
}

// 对话框组件属性
export interface DialogProps {
  trigger?: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// 输入框组件属性
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

// 折叠面板组件属性
export interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}