"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * 文本域组件属性
 * 继承自 HTML textarea 元素的所有属性
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea 组件
 * 用于多行文本输入
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 *
 * @example
 * <Textarea placeholder="请输入..." />
 *
 * @example
 * // 带标签的文本域
 * <div className="grid w-full gap-1.5">
 *   <Label htmlFor="message">消息</Label>
 *   <Textarea placeholder="请输入消息..." id="message" />
 * </div>
 *
 * @example
 * // 禁用状态
 * <Textarea disabled placeholder="禁用状态" />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
