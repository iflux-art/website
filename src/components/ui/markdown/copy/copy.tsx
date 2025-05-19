"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CopyProps } from "./copy.types";

/**
 * 复制按钮组件
 * 用于将指定内容复制到剪贴板
 */
export default function Copy({ content }: CopyProps) {
  // 定义状态变量 isCopied，用于记录内容是否已复制
  const [isCopied, setIsCopied] = useState(false);

  /**
   * 处理复制操作的函数
   */
  async function handleCopy() {
    // 将内容写入剪贴板
    await navigator.clipboard.writeText(content);
    // 设置复制状态为 true
    setIsCopied(true);

    // 2 秒后将复制状态重置为 false
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    // 渲染按钮组件，点击时触发 handleCopy 函数
    <Button
      variant="ghost"
      className="h-6 w-6 p-0 rounded-md hover:bg-background/30 hover:text-foreground"
      size="icon"
      onClick={handleCopy}
      title="复制代码"
    >
      {/* 根据复制状态显示不同的图标 */}
      {isCopied ? (
        <CheckIcon className="w-3.5 h-3.5" />
      ) : (
        <CopyIcon className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}
