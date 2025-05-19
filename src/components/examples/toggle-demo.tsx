"use client";

import React, { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

/**
 * Toggle 组件示例
 * 展示了如何使用 Toggle 组件创建不同类型的开关
 */
export function ToggleDemo() {
  const [boldPressed, setBoldPressed] = useState(false);
  const [italicPressed, setItalicPressed] = useState(false);
  const [underlinePressed, setUnderlinePressed] = useState(false);
  
  const [alignment, setAlignment] = useState<string>("left");
  
  return (
    <div className="space-y-8">
      {/* 基本用法 */}
      <div>
        <h3 className="text-lg font-medium mb-2">基本用法</h3>
        <Toggle>切换</Toggle>
      </div>

      {/* 变体 */}
      <div>
        <h3 className="text-lg font-medium mb-2">变体</h3>
        <div className="flex flex-wrap gap-4">
          <Toggle>默认</Toggle>
          <Toggle variant="outline">轮廓</Toggle>
        </div>
      </div>

      {/* 尺寸 */}
      <div>
        <h3 className="text-lg font-medium mb-2">尺寸</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Toggle size="sm">小</Toggle>
          <Toggle size="default">默认</Toggle>
          <Toggle size="lg">大</Toggle>
        </div>
      </div>

      {/* 禁用状态 */}
      <div>
        <h3 className="text-lg font-medium mb-2">禁用状态</h3>
        <Toggle disabled>禁用</Toggle>
      </div>

      {/* 默认按下状态 */}
      <div>
        <h3 className="text-lg font-medium mb-2">默认按下状态</h3>
        <Toggle defaultPressed>默认按下</Toggle>
      </div>

      {/* 受控组件 */}
      <div>
        <h3 className="text-lg font-medium mb-2">受控组件</h3>
        <div className="space-y-2">
          <Toggle 
            pressed={boldPressed} 
            onPressedChange={setBoldPressed}
          >
            {boldPressed ? "开启" : "关闭"}
          </Toggle>
          <div className="text-sm text-muted-foreground">
            当前状态: {boldPressed ? "开启" : "关闭"}
          </div>
        </div>
      </div>

      {/* 带图标 */}
      <div>
        <h3 className="text-lg font-medium mb-2">带图标</h3>
        <div className="flex flex-wrap gap-4">
          <Toggle aria-label="加粗">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="斜体">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="下划线">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      {/* 文本格式工具栏 */}
      <div>
        <h3 className="text-lg font-medium mb-2">文本格式工具栏</h3>
        <div className="flex flex-wrap gap-2 border rounded-md p-1 w-fit">
          <Toggle 
            aria-label="加粗" 
            pressed={boldPressed} 
            onPressedChange={setBoldPressed}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle 
            aria-label="斜体" 
            pressed={italicPressed} 
            onPressedChange={setItalicPressed}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle 
            aria-label="下划线" 
            pressed={underlinePressed} 
            onPressedChange={setUnderlinePressed}
          >
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
        <div className="mt-2 p-4 border rounded-md">
          <p style={{
            fontWeight: boldPressed ? 'bold' : 'normal',
            fontStyle: italicPressed ? 'italic' : 'normal',
            textDecoration: underlinePressed ? 'underline' : 'none'
          }}>
            这是一段示例文本，用于展示文本格式效果。
          </p>
        </div>
      </div>

      {/* 对齐方式选择器 */}
      <div>
        <h3 className="text-lg font-medium mb-2">对齐方式选择器</h3>
        <div className="flex flex-wrap gap-2 border rounded-md p-1 w-fit">
          <Toggle 
            aria-label="左对齐" 
            pressed={alignment === "left"} 
            onPressedChange={() => setAlignment("left")}
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle 
            aria-label="居中对齐" 
            pressed={alignment === "center"} 
            onPressedChange={() => setAlignment("center")}
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle 
            aria-label="右对齐" 
            pressed={alignment === "right"} 
            onPressedChange={() => setAlignment("right")}
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle 
            aria-label="两端对齐" 
            pressed={alignment === "justify"} 
            onPressedChange={() => setAlignment("justify")}
          >
            <AlignJustify className="h-4 w-4" />
          </Toggle>
        </div>
        <div className="mt-2 p-4 border rounded-md">
          <p style={{ textAlign: alignment as any }}>
            这是一段示例文本，用于展示不同的对齐方式效果。这是一段示例文本，用于展示不同的对齐方式效果。这是一段示例文本，用于展示不同的对齐方式效果。
          </p>
        </div>
      </div>
    </div>
  );
}
