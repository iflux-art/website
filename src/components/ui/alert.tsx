'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Alert 组件变体定义
 * 定义了警告框的不同样式变体
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const alertVariants = cva(
  'relative w-full rounded-xl border p-5 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-5 [&>svg]:top-5 [&>svg]:text-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground hover:shadow-md transition-all',
        destructive:
          'border-destructive/50 text-destructive [&>svg]:text-destructive hover:shadow-md transition-all',
        success:
          'border-success/50 text-success [&>svg]:text-success hover:shadow-md transition-all',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * 警告框组件属性
 */
export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

/**
 * 警告框标题组件属性
 */
export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * 警告框描述组件属性
 */
export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * Alert 组件
 * 用于显示提示、警告或错误信息
 *
 * @example
 * <Alert>
 *   <AlertTitle>提示</AlertTitle>
 *   <AlertDescription>这是一条提示信息</AlertDescription>
 * </Alert>
 *
 * @example
 * <Alert variant="destructive">
 *   <AlertTitle>错误</AlertTitle>
 *   <AlertDescription>这是一条错误信息</AlertDescription>
 * </Alert>
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  )
);
Alert.displayName = 'Alert';

/**
 * AlertTitle 组件
 * 用于显示警告框的标题
 */
const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-2 font-semibold leading-none tracking-tight text-lg', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

/**
 * AlertDescription 组件
 * 用于显示警告框的详细描述
 */
const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed mt-1', className)} {...props} />
  )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
