"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";

/**
 * Textarea 组件示例
 * 展示了如何使用 Textarea 组件创建不同类型的文本输入区域
 */
export function TextareaDemo() {
  return (
    <div className="space-y-8">
      {/* 基本用法 */}
      <div>
        <h3 className="text-lg font-medium mb-2">基本用法</h3>
        <Textarea placeholder="在此输入您的消息..." />
      </div>

      {/* 禁用状态 */}
      <div>
        <h3 className="text-lg font-medium mb-2">禁用状态</h3>
        <Textarea disabled placeholder="禁用状态" />
      </div>

      {/* 带标签 */}
      <div>
        <h3 className="text-lg font-medium mb-2">带标签</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">消息</Label>
          <Textarea id="message" placeholder="在此输入您的消息..." />
        </div>
      </div>

      {/* 自定义大小 */}
      <div>
        <h3 className="text-lg font-medium mb-2">自定义大小</h3>
        <Textarea rows={10} placeholder="大文本域..." />
      </div>

      {/* 带描述 */}
      <div>
        <h3 className="text-lg font-medium mb-2">带描述</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message-2">消息</Label>
          <Textarea id="message-2" placeholder="在此输入您的消息..." />
          <p className="text-sm text-muted-foreground">
            您的消息将被发送到我们的团队。
          </p>
        </div>
      </div>

      {/* 带验证 */}
      <div>
        <h3 className="text-lg font-medium mb-2">带验证</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message-3" className="text-red-500">
            错误消息
          </Label>
          <Textarea
            id="message-3"
            placeholder="在此输入您的消息..."
            className="border-red-500"
          />
          <p className="text-sm text-red-500">
            请输入有效的消息。
          </p>
        </div>
      </div>

      {/* 带表单 */}
      <div>
        <h3 className="text-lg font-medium mb-2">带表单</h3>
        <form className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message-4">反馈</Label>
            <Textarea id="message-4" placeholder="请分享您的反馈..." />
          </div>
          <Button type="submit">提交</Button>
        </form>
      </div>
    </div>
  );
}
