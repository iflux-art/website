/**
 * 文档数据相关类型定义
 */

import { BaseContent, BaseCategory, BaseMeta } from './base';

/**
 * 文档分类
 */
export interface DocCategory extends BaseCategory {
  // 继承自BaseCategory已包含所有必要字段
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
  // 继承自BaseMeta已包含所有必要字段
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

// 重新导出组件类型
export * from './docs-components';