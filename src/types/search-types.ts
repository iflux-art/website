/**
 * 搜索相关类型定义
 */

import { ReactNode } from "react";
import { BaseSearchResult } from "./data-types";
import { ID } from "./base-types";

/** 搜索对话框属性 */
export interface SearchDialogProps {
  /** 是否打开 */
  open: boolean;
  /** 打开状态变化回调 */
  onOpenChangeAction: (open: boolean) => void;
}

/** 搜索结果 */
export interface SearchResult extends BaseSearchResult {
  /** 结果类型 */
  type: "doc" | "blog" | "navigation" | "tool" | "command" | "history" | "link";
  /** 图标 */
  icon: ReactNode;
  /** 是否为外部链接 */
  isExternal?: boolean;
  /** 点击动作 */
  action?: () => void;
  /** 兼容旧用法：url 字段，等价于 path */
  url?: string;
}

/** 命令接口 */
export interface Command {
  /** 命令ID */
  id: ID;
  /** 命令标题 */
  title: string;
  /** 命令描述 */
  description: string;
  /** 执行动作 */
  action: () => void;
  /** 快捷键 */
  shortcut?: string;
  /** 命令分组 */
  group?: string;
}

export interface SearchDialogContentProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onSelect: (result: SearchResult) => void;
  onClearHistory: () => void;
  searchHistory: string[];
}

export interface SearchHistoryProps {
  searchHistory: string[];
  onClear: () => void;
}

/** API 搜索结果 */
export interface APISearchResult extends BaseSearchResult {
  /** 结果类型 */
  type: "doc" | "blog" | "tool" | "link";
}

export interface SearchRequest {
  q: string;
  type?: "doc" | "blog" | "tool" | "link";
  limit?: number;
}

export interface SearchResponse {
  success: boolean;
  results: APISearchResult[];
  count: number;
  error?: string;
}

/** 搜索输入框属性 */
export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  onClear?: () => void;
}

/** 搜索结果列表属性 */
export interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onSelect: (result: SearchResult) => void;
  onClearHistory: () => void;
  searchHistory: string[];
  onHistoryClick: (query: string) => void;
}
