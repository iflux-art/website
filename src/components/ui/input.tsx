'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * 输入框组件属性
 * 继承自 HTML input 元素的所有属性
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input 组件
 * 用于创建文本输入框
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 *
 * @example
 * // 基本用法
 * <Input placeholder="请输入..." />
 *
 * @example
 * // 带标签的输入框
 * <div className="grid w-full max-w-sm items-center gap-1.5">
 *   <Label htmlFor="email">邮箱</Label>
 *   <Input type="email" id="email" placeholder="请输入邮箱..." />
 * </div>
 *
 * @example
 * // 禁用状态
 * <Input disabled placeholder="禁用状态" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
