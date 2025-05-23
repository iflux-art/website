'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Toast 组件变体定义
 * 定义了不同样式的 Toast 变体
 *
 * 已更新为 Tailwind CSS v4 兼容版本，符合 New York 风格
 */
const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-5 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success: 'success group border-success bg-success text-success-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Toast 组件属性
 */
export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {}

/**
 * Toast 组件
 * 用于显示临时通知消息
 */
const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Root>, ToastProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <ToastPrimitives.Root
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Toast.displayName = ToastPrimitives.Root.displayName;

/**
 * ToastAction 组件
 * 用于在 Toast 中添加操作按钮
 */
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg border bg-transparent px-4 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive group-[.success]:border-muted/40 group-[.success]:hover:border-success/30 group-[.success]:hover:bg-success group-[.success]:hover:text-success-foreground group-[.success]:focus:ring-success',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

/**
 * ToastClose 组件
 * 用于关闭 Toast
 */
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-lg p-1.5 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-[oklch(0.8_0.15_20)] group-[.destructive]:hover:text-[oklch(0.95_0.05_20)] group-[.destructive]:focus:ring-[oklch(0.7_0.15_20)] group-[.destructive]:focus:ring-offset-[oklch(0.6_0.15_20)] group-[.success]:text-[oklch(0.8_0.15_140)] group-[.success]:hover:text-[oklch(0.95_0.05_140)] group-[.success]:focus:ring-[oklch(0.7_0.15_140)] group-[.success]:focus:ring-offset-[oklch(0.6_0.15_140)]',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-5 w-5" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

/**
 * ToastTitle 组件
 * 用于显示 Toast 的标题
 */
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-lg font-semibold tracking-tight', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

/**
 * ToastDescription 组件
 * 用于显示 Toast 的详细描述
 */
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm leading-relaxed mt-1', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

/**
 * ToastProvider 组件
 * 用于提供 Toast 上下文
 */
type ToastProviderProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Provider>;

const ToastProvider = ({ ...props }: ToastProviderProps) => {
  return <ToastPrimitives.Provider {...props} />;
};

/**
 * ToastViewport 组件
 * 用于定义 Toast 的显示区域
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toastVariants,
};
