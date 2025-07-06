'use client';

import React, { useState } from 'react';
import { MDXStyles } from '@/config/mdx/styles';

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

  // 处理标签切换
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={`${MDXStyles.tabs.base} ${className}`}>
      {/* 标签导航 */}
      <nav
        className={`
          ${MDXStyles.tabs.nav}
          ${fullWidth ? 'w-full' : ''}
          ${MDXStyles.tabs.variants[variant].nav}
          ${MDXStyles.tabs.sizes[size]}
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
              ${MDXStyles.tabs.tab}
              ${fullWidth ? 'flex-1 text-center' : ''}
              ${MDXStyles.tabs.variants[variant].tab}
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
            ${MDXStyles.tabs.panel}
            ${activeTab === tab.id ? 'block' : 'hidden'}
          `}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};
