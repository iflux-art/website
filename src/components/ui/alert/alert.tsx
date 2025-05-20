"use client"

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { AlertProps, AlertTitleProps, AlertDescriptionProps } from "./alert.types";

/**
 * Alert 组件变体定义
 * 定义了警告框的不同样式变体
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive [&>svg]:text-destructive",
        success:
          "border-success/50 text-success [&>svg]:text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

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
  )
);
Alert.displayName = "Alert";

/**
 * AlertTitle 组件
 * 用于显示警告框的标题
 */
const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

/**
 * AlertDescription 组件
 * 用于显示警告框的详细描述
 */
const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
