"use client"

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Copy from "@/components/ui/markdown/copy";
import { CodeGroupProps, CodeTabProps } from "./code-group.types";

/**
 * 代码标签组件
 * 用于在代码组中显示单个代码标签
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function CodeTab({ children, title, language, className }: CodeTabProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  );
}

/**
 * 代码组组件
 * 用于在文档中显示多个代码标签，支持切换和复制功能
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function CodeGroup({ children, className }: CodeGroupProps) {
  // 提取子元素中的标题和内容
  const childrenArray = React.Children.toArray(children);
  const tabs = childrenArray.map((child) => {
    if (React.isValidElement(child) && child.type === CodeTab) {
      return {
        title: child.props.title,
        language: child.props.language,
        content: child.props.children,
      };
    }
    return null;
  }).filter(Boolean);

  // 如果没有有效的标签，直接返回子元素
  if (tabs.length === 0) {
    return <>{children}</>;
  }

  // 状态管理
  const [activeTab, setActiveTab] = useState(0);

  // 提取所有代码内容，用于复制按钮
  const getAllCode = () => {
    return tabs.map(tab => {
      const content = tab?.content;
      if (React.isValidElement(content)) {
        return String(content.props?.children || '');
      }
      return String(content || '');
    }).join('\n\n');
  };

  return (
    <div className={cn("relative my-6 rounded-lg border bg-muted overflow-hidden shadow-sm", className)}>
      {/* macOS 风格的标题栏 */}
      <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-muted border-b">
        {/* 三个圆点 */}
        <div className="flex space-x-1.5 sm:space-x-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 opacity-90 dark:opacity-80"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 opacity-90 dark:opacity-80"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 opacity-90 dark:opacity-80"></div>
        </div>

        {/* 标签列表 */}
        <div className="flex-1 ml-4">
          <div className="inline-flex h-10 items-center justify-start rounded-md bg-transparent p-1 text-muted-foreground">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                  activeTab === index
                    ? "bg-background/50 text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                {tab?.title}
                {tab?.language && (
                  <span className="ml-1.5 text-xs text-muted-foreground hidden sm:inline-block">
                    ({tab.language})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 复制按钮 */}
        <div className="ml-auto">
          <Copy content={getAllCode()} />
        </div>
      </div>

      {/* 代码内容 */}
      <div className="w-full">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={cn(
              "mt-0 transition-opacity duration-200",
              activeTab === index ? "block" : "hidden"
            )}
          >
            <div className="relative">
              {tab?.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
