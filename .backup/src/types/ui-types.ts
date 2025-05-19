/**
 * UI 组件类型定义
 */
import { ReactNode } from 'react';

// 按钮组件属性
export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
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

// 头像组件属性
export interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
}

// 折叠面板组件属性
export interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

// Markdown相关组件属性
export interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  language?: string;
}

export interface CopyButtonProps {
  value: string;
  className?: string;
}

export interface MarkdownImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export interface MarkdownLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}