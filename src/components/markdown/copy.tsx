// 声明为客户端组件
"use client";

// 从 lucide-react 库导入检查图标和复制图标
import { CheckIcon, CopyIcon } from "lucide-react";
// 从 ../ui/button 导入按钮组件
import { Button } from "../ui/button";
// 从 react 导入 useState 钩子
import { useState } from "react";

/**
 * 复制按钮组件，用于将指定内容复制到剪贴板
 * @param content - 需要复制到剪贴板的内容
 */
export default function Copy({ content }: { content: string }) {
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
      variant="secondary"
      className="border"
      size="xs"
      onClick={handleCopy}
    >
      {/* 根据复制状态显示不同的图标 */}
      {isCopied ? (
        <CheckIcon className="w-3 h-3" />
      ) : (
        <CopyIcon className="w-3 h-3" />
      )}
    </Button>
  );
}
