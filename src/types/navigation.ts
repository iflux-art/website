/**
 * 网址导航相关类型定义
 * @module types/navigation
 */

/**
 * 导航分类
 * 
 * @interface Category
 */
export interface Category {
  /**
   * 分类唯一标识
   */
  id: string;
  
  /**
   * 分类标题
   */
  title: string;
  
  /**
   * 分类描述
   */
  description: string;
  
  /**
   * 分类图标（emoji）
   */
  icon: string;
  
  /**
   * 分类背景颜色（Tailwind CSS 类名）
   */
  color: string;
}

/**
 * 资源项
 * 
 * @interface Resource
 */
export interface Resource {
  /**
   * 资源标题
   */
  title: string;
  
  /**
   * 资源描述
   */
  description: string;
  
  /**
   * 资源链接
   */
  url: string;
  
  /**
   * 资源分类
   */
  category: string;
  
  /**
   * 资源图标（emoji）
   */
  icon: string;
  
  /**
   * 资源作者/提供方
   */
  author: string;
  
  /**
   * 是否免费
   */
  free: boolean;
}

/**
 * 导航项
 * 
 * @interface NavigationItem
 */
export interface NavigationItem {
  /**
   * 导航项标题
   */
  title: string;
  
  /**
   * 导航项列表
   */
  items: NavigationLink[];
}

/**
 * 导航链接
 * 
 * @interface NavigationLink
 */
export interface NavigationLink {
  /**
   * 链接名称
   */
  name: string;
  
  /**
   * 链接地址
   */
  url: string;
  
  /**
   * 链接描述
   */
  description: string;
}
