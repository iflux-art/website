"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface MDXAccordionProps {
  items: AccordionItem[];
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  className?: string;
  variant?: "default" | "bordered" | "separated";
  iconPosition?: "left" | "right";
  onChange?: (expandedItems: string[]) => void;
}

/**
 * MDX 手风琴组件
 * - 支持单个或多个面板展开
 * - 多种样式变体
 * - 可自定义图标位置
 * - 支持禁用状态
 * - 支持展开状态回调
 */
export const MDXAccordion = ({
  items,
  defaultExpanded = [],
  allowMultiple = false,
  className = "",
  variant = "default",
  iconPosition = "right",
  onChange,
}: MDXAccordionProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  // 变体样式配置
  const variantStyles = {
    default: {
      wrapper: "divide-y divide-gray-200 dark:divide-gray-700",
      item: "",
    },
    bordered: {
      wrapper:
        "border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700",
      item: "first:rounded-t-lg last:rounded-b-lg",
    },
    separated: {
      wrapper: "space-y-2",
      item: "border border-gray-200 dark:border-gray-700 rounded-lg",
    },
  };

  // 处理面板切换
  const toggleItem = (itemId: string) => {
    let newExpanded: string[];

    if (allowMultiple) {
      newExpanded = expandedItems.includes(itemId)
        ? expandedItems.filter((id) => id !== itemId)
        : [...expandedItems, itemId];
    } else {
      newExpanded = expandedItems.includes(itemId) ? [] : [itemId];
    }

    setExpandedItems(newExpanded);
    onChange?.(newExpanded);
  };

  return (
    <div className={`my-6 ${variantStyles[variant].wrapper} ${className} `}>
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <div key={item.id} className={variantStyles[variant].item}>
            {/* 标题按钮 */}
            <button
              className={`flex w-full items-center justify-between px-4 py-4 text-left text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:hover:bg-gray-800`}
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div
                className={`flex items-center gap-3 ${iconPosition === "right" ? "flex-1" : ""} `}
              >
                {iconPosition === "left" && (
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200 dark:text-gray-400 ${isExpanded ? "rotate-180 transform" : ""} `}
                  />
                )}
                <span className="flex-1 font-medium">{item.title}</span>
                {iconPosition === "right" && (
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200 dark:text-gray-400 ${isExpanded ? "rotate-180 transform" : ""} `}
                  />
                )}
              </div>
            </button>

            {/* 内容面板 */}
            <div
              id={`accordion-content-${item.id}`}
              className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-screen" : "max-h-0"} `}
            >
              <div className="px-4 pb-4">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
