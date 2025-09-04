/**
 * 通用组件 Props 类型定义
 * 集中管理项目中常用的组件 Props 类型，避免重复定义
 */

import type { ReactNode } from "react";

// ==================== 通用 UI 组件 Props ====================

/**
 * 通用卡片组件 Props
 */
export interface CardProps {
  /** 卡片标题 */
  title?: string;
  /** 卡片内容 */
  children: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否有边框 */
  bordered?: boolean;
}

/**
 * 通用按钮 Props
 */
export interface ButtonProps {
  /** 按钮文本 */
  children: ReactNode;
  /** 点击事件处理函数 */
  onClick?: () => void;
  /** 按钮变体 */
  variant?: "default" | "outline" | "ghost" | "destructive";
  /** 按钮大小 */
  size?: "sm" | "md" | "lg";
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

// ==================== 布局组件 Props ====================

/**
 * 页面标题组件 Props
 */
export interface PageHeaderProps {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 搜索过滤组件 Props
 */
export interface SearchFilterProps<T> {
  /** 当前搜索词 */
  searchTerm: string;
  /** 搜索词变化回调 */
  onSearchChange: (value: string) => void;
  /** 当前选中的分类 */
  selectedCategory: string;
  /** 分类变化回调 */
  onCategoryChange: (value: string) => void;
  /** 可选的分类列表 */
  categories: T[];
}

// ==================== 数据展示组件 Props ====================

/**
 * 数据表格列配置
 */
export interface DataTableColumn<T> {
  /** 列对应的键 */
  key: keyof T;
  /** 列标题 */
  title: string;
  /** 列宽度 */
  width?: string | number;
  /** 文本对齐方式 */
  align?: "left" | "center" | "right";
  /** 自定义渲染函数 */
  render?: (value: unknown, record: T, index: number) => ReactNode;
}

/**
 * 数据表格操作项
 */
export interface DataTableAction<T> {
  /** 操作标签 */
  label: string;
  /** 操作图标 */
  icon?: React.ComponentType<{ className?: string }>;
  /** 点击事件处理函数 */
  onClick: (record: T, index: number) => void;
  /** 是否禁用 */
  disabled?: (record: T) => boolean;
  /** 按钮变体 */
  variant?: "default" | "outline" | "ghost" | "destructive";
}

/**
 * 数据表格分页配置
 */
export interface DataTablePagination {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
  /** 页码变化回调 */
  onChange: (page: number) => void;
}

/**
 * 数据表格 Props
 */
export interface DataTableProps<T> {
  /** 表格标题 */
  title?: string;
  /** 表格数据 */
  data: T[];
  /** 列配置 */
  columns: DataTableColumn<T>[];
  /** 操作项 */
  actions?: DataTableAction<T>[];
  /** 分页配置 */
  pagination?: DataTablePagination;
  /** 自定义类名 */
  className?: string;
}

// ==================== 用户相关组件 Props ====================

/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username?: string | null;
  /** 名字 */
  firstName?: string | null;
  /** 姓氏 */
  lastName?: string | null;
  /** 头像URL */
  imageUrl?: string | null;
  /** 主要邮箱地址 */
  primaryEmailAddress?: {
    /** 邮箱地址 */
    emailAddress?: string | null;
  } | null;
  /** 创建时间 */
  createdAt?: Date | null;
  /** 主要邮箱地址ID */
  primaryEmailAddressId?: string | null;
  /** 邮箱地址列表 */
  emailAddresses?: {
    /** 邮箱ID */
    id: string;
    /** 邮箱地址 */
    emailAddress: string;
    /** 验证信息 */
    verification?: {
      /** 验证状态 */
      status: string | null;
    } | null;
  }[];
  /** 外部账户列表 */
  externalAccounts?: {
    /** 账户ID */
    id: string;
    /** 提供商 */
    provider: string;
    /** 邮箱地址 */
    emailAddress?: string | null;
  }[];
}

/**
 * 用户信息卡片 Props
 */
export interface UserInfoCardProps {
  /** 用户信息 */
  user: UserInfo;
  /** 用户全名 */
  fullName: string;
  /** 用户姓名首字母 */
  initials: string;
}

/**
 * 账户详情卡片 Props
 */
export interface AccountDetailsCardProps {
  /** 用户信息 */
  user: UserInfo;
}

// ==================== 导航组件 Props ====================

/**
 * 目录标题
 */
export interface TocHeading {
  /** 标题ID */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题级别 */
  level: number;
}

/**
 * 目录 Props
 */
export interface TocProps {
  /** 标题列表 */
  headings: TocHeading[];
  /** 自定义类名 */
  className?: string;
  /** 卡片标题 */
  title?: string;
  /** 是否自适应高度 */
  adaptive?: boolean;
  /** 自适应偏移量 */
  adaptiveOffset?: number;
}

/**
 * 目录卡片 Props
 */
export interface TableOfContentsCardProps {
  /** 标题列表 */
  headings: TocHeading[];
  /** 自定义类名 */
  className?: string;
  /** 卡片标题 */
  title?: string;
}
