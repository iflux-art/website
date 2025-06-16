/**
 * 页面特有的类型定义
 * @module types/pages
 */

import type { LucideIcon } from 'lucide-react';

/**
 * 工具分类接口
 * @see src/app/tools/page.tsx - 工具页面使用此类型
 */
export interface ToolCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

/**
 * 工具接口
 * @see src/app/tools/page.tsx - 工具页面的工具列表使用此类型
 * @see src/hooks/use-tools.ts - 工具状态管理hook使用此类型
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
  tags: string[];
  isInternal: boolean;
}