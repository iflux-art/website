"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

/**
 * 高亮文本组件
 * 用于在文本中高亮显示搜索关键词
 * 
 * @example
 * <HighlightText text="这是一段文本" query="文本" />
 */
export function HighlightText({ text, query, className }: HighlightTextProps) {
  // 如果没有查询词或文本为空，直接返回原文本
  if (!query.trim() || !text) {
    return <span className={className}>{text}</span>;
  }

  // 转义正则表达式特殊字符
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // 创建正则表达式，不区分大小写
  const regex = new RegExp(`(${escapeRegExp(query.trim())})`, 'gi');
  
  // 分割文本
  const parts = text.split(regex);

  // 如果没有匹配项，直接返回原文本
  if (parts.length === 1) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // 检查当前部分是否匹配查询词（不区分大小写）
        const isMatch = part.toLowerCase() === query.toLowerCase();
        
        return isMatch ? (
          <span key={index} className="bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 rounded px-0.5">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}
