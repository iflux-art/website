/**
 * 文档数据相关类型定义
 */

import { BaseContent, BaseCategory, BaseMeta } from './base';

/**
 * 文档元数据项接口 (_meta.json)
 */
export interface DocMetaItem {
  /** 标题 */
  title?: string;
  /** 链接地址,用于外部链接或自定义内部路径 */
  href?: string;
  /** 分类/菜单是否折叠 */
  collapsed?: boolean;
  /** 嵌套结构项 */
  items?: string[] | Record<string, DocMetaItem | string>;
  /** 项目类型 */
  type?: 'separator' | 'page' | 'menu';
  /** 显示模式 */
  display?: 'hidden' | 'normal';
  /** 显式排序序号 */
  order?: number;
  /** 分类描述 */
  description?: string;
  /** 是否为索引页 */
  index?: boolean;
  /** 是否隐藏 */
  hidden?: boolean;
}

/**
 * 标题数据类型
 */
export interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * 文档分类
 */
export interface DocCategory extends BaseCategory {
  // 这是一个声明性接口,仅用于文档分类类型标记
  // 所有必要字段都从BaseCategory继承
  _brand?: never;
}

/**
 * 文档项
 */
export interface DocItem extends BaseContent {
  /** 所属分类 */
  category: string;
}

/**
 * 文档列表项（用于侧边栏）
 */
export interface DocListItem extends BaseContent {
  /** 文档路径 */
  path: string;
}

/**
 * 文档元数据
 */
export interface DocMeta extends BaseMeta {
  // 这是一个声明性接口,仅用于文档元数据类型标记
  // 所有必要字段都从BaseMeta继承
  _brand?: never;
}

/**
 * 文档树节点
 */
export interface DocTreeNode {
  /** 标题 */
  title: string;
  /** URL路径 */
  path?: string;
  /** 子节点 */
  children?: DocTreeNode[];
}

/**
 * 文档导航项
 */
export interface DocNavItem {
  /** 标题 */
  title: string;
  /** URL路径 */
  path: string;
  /** 是否是下一篇 */
  isNext?: boolean;
}

/**
 * 侧边栏项目
 */
export interface SidebarItem {
  /** 文档标题 */
  title: string;
  /** 文档链接（可选） */
  href?: string;
  /** 子文档列表 */
  items?: SidebarItem[];
  /** 是否默认折叠 */
  collapsed?: boolean;
  /** 项目类型 */
  type?: 'separator' | 'page' | 'menu';
  /** 是否为外部链接 */
  isExternal?: boolean;
  /** 文件路径（用于匹配当前页面） */
  filePath?: string;
  /** 显示标签（可选） */
  label?: string;
}

/**
 * useDocSidebar hook的返回值类型
 */
export interface UseDocSidebarResult {
  /** 侧边栏项目列表 */
  items: SidebarItem[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 刷新侧边栏数据的方法 */
  refetch: () => Promise<void>;
}

// 重新导出组件类型
