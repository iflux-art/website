"use client";

import React, { useState } from "react";
import { MDXCodeBlock } from "@/components/mdx/mdx-code-block";

interface CodeTab {
  label: string;
  language: string;
  code: string;
  filename?: string;
}

interface MDXCodeGroupProps {
  tabs: CodeTab[];
  defaultTab?: number;
  className?: string;
}

/**
 * MDX 代码组组件
 * - 支持多个代码块切换
 * - 保持选中状态
 * - 自动语法高亮
 * - 共享复制按钮
 */
export const MDXCodeGroup = ({
  tabs,
  defaultTab = 0,
  className = "",
}: MDXCodeGroupProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div
      className={`my-6 rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}
    >
      {/* 标签栏 */}
      <div className="flex overflow-x-auto rounded-t-lg border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === index
                ? "text-primary-600 border-primary-500 border-b-2"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            } `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 代码内容 */}
      <div className="relative">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`${activeTab === index ? "block" : "hidden"}`}
          >
            <MDXCodeBlock
              className={`language-${tab.language}`}
              filename={tab.filename}
            >
              {tab.code}
            </MDXCodeBlock>
          </div>
        ))}
      </div>
    </div>
  );
};
