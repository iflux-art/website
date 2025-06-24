'use client';

import React, { useState } from 'react';

export interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface MDXTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: 'line' | 'pill' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (tabId: string) => void;
}

/**
 * MDX 标签页组件
 * - 支持多种样式变体
 * - 可自定义尺寸
 * - 支持禁用状态
 * - 可控制宽度
 * - 支持自定义渲染
 */
export const MDXTabs = ({
  tabs,
  defaultTab,
  className = '',
  variant = 'line',
  size = 'md',
  fullWidth = false,
  onChange,
}: MDXTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  // 尺寸样式配置
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // 变体样式配置
  const variantStyles = {
    line: {
      nav: 'border-b border-gray-200 dark:border-gray-700',
      tab: `
        border-b-2 border-transparent
        hover:border-gray-300 dark:hover:border-gray-600
        data-[state=active]:border-primary-500
      `,
    },
    pill: {
      nav: 'space-x-2',
      tab: `
        rounded-full
        hover:bg-gray-100 dark:hover:bg-gray-800
        data-[state=active]:bg-primary-500 data-[state=active]:text-white
      `,
    },
    enclosed: {
      nav: 'space-x-1',
      tab: `
        rounded-t-lg border-t border-l border-r border-transparent
        hover:bg-gray-50 dark:hover:bg-gray-800
        data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700
        data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900
      `,
    },
  };

  // 处理标签切换
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={`my-6 ${className}`}>
      {/* 标签导航 */}
      <nav
        className={`
          flex ${fullWidth ? 'w-full' : ''}
          ${variantStyles[variant].nav}
          ${sizeStyles[size]}
        `}
        role="tablist"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            className={`
              px-4 py-2 font-medium transition-colors
              ${fullWidth ? 'flex-1 text-center' : ''}
              ${variantStyles[variant].tab}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            data-state={activeTab === tab.id ? 'active' : 'inactive'}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 内容面板 */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={tab.id}
          hidden={activeTab !== tab.id}
          className={`
            mt-4 focus:outline-none
            ${activeTab === tab.id ? 'block' : 'hidden'}
          `}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};
