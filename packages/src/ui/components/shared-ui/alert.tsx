"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "packages/src/lib/utils";

/**
 * Alert 组件变体定义
 * 定义了警告框的不同样式变体
 */
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-success/50 text-success dark:border-success [&>svg]:text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
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
export type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/**
 * 警告框描述组件属性
 */
export type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

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
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

/**
 * AlertTitle 组件
 * 用于显示警告框的标题
 */
const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        "mb-2 text-lg leading-none font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

/**
 * AlertDescription 组件
 * 用于显示警告框的详细描述
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-1 text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
