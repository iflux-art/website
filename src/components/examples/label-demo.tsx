"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/**
 * Label 组件示例
 * 展示了如何使用 Label 组件创建不同类型的表单标签
 */
export function LabelDemo() {
  return (
    <div className="space-y-8">
      {/* 基本用法 */}
      <div>
        <h3 className="text-lg font-medium mb-2">基本用法</h3>
        <Label htmlFor="basic">基本标签</Label>
      </div>

      {/* 与输入框一起使用 */}
      <div>
        <h3 className="text-lg font-medium mb-2">与输入框一起使用</h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">电子邮箱</Label>
          <Input type="email" id="email" placeholder="输入您的电子邮箱" />
        </div>
      </div>

      {/* 与文本域一起使用 */}
      <div>
        <h3 className="text-lg font-medium mb-2">与文本域一起使用</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">消息</Label>
          <Textarea id="message" placeholder="输入您的消息..." />
        </div>
      </div>

      {/* 与复选框一起使用 */}
      <div>
        <h3 className="text-lg font-medium mb-2">与复选框一起使用</h3>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <Label htmlFor="terms">接受条款和条件</Label>
        </div>
      </div>

      {/* 必填标签 */}
      <div>
        <h3 className="text-lg font-medium mb-2">必填标签</h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-red-500">
            姓名
          </Label>
          <Input id="name" placeholder="输入您的姓名" required />
        </div>
      </div>

      {/* 禁用状态 */}
      <div>
        <h3 className="text-lg font-medium mb-2">禁用状态</h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="disabled">禁用标签</Label>
          <Input id="disabled" disabled />
        </div>
      </div>

      {/* 完整表单示例 */}
      <div>
        <h3 className="text-lg font-medium mb-2">完整表单示例</h3>
        <form className="space-y-4 border p-4 rounded-md">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="full-name" className="after:content-['*'] after:ml-0.5 after:text-red-500">
              姓名
            </Label>
            <Input id="full-name" placeholder="输入您的姓名" required />
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="full-email">
              电子邮箱
            </Label>
            <Input type="email" id="full-email" placeholder="输入您的电子邮箱" />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="full-message">
              消息
            </Label>
            <Textarea id="full-message" placeholder="输入您的消息..." />
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="full-terms" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <Label htmlFor="full-terms">接受条款和条件</Label>
          </div>
          
          <Button type="submit">提交</Button>
        </form>
      </div>
    </div>
  );
}
