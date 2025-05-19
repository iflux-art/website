/**
 * 文档相关类型定义
 * @module types/docs
 */

/**
 * 文档分类
 *
 * @interface DocCategory
 */
export interface DocCategory {
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
   * 分类下的文档数量
   */
  count: number;
}

/**
 * 文档项
 *
 * @interface DocItem
 */
export interface DocItem {
  /**
   * 文档唯一标识（URL 路径）
   */
  slug: string;

  /**
   * 所属分类
   */
  category: string;

  /**
   * 文档标题
   */
  title: string;

  /**
   * 文档描述
   */
  description: string;

  /**
   * 发布日期
   */
  date?: string;
}

/**
 * 文档元数据项
 *
 * @interface DocMetaItem
 */
export interface DocMetaItem {
  /**
   * 自定义标题
   */
  title?: string;

  /**
   * 外部链接
   */
  href?: string;

  /**
   * 是否默认折叠
   */
  collapsed?: boolean;

  /**
   * 子项目
   * 可以是字符串数组（文件名列表）或嵌套对象（子文件夹）
   */
  items?: string[] | Record<string, DocMetaItem | string>;

  /**
   * 项目类型
   * - separator: 分隔符
   * - page: 页面
   * - menu: 菜单
   */
  type?: 'separator' | 'page' | 'menu';

  /**
   * 显示模式
   * - hidden: 隐藏
   * - normal: 正常显示
   */
  display?: 'hidden' | 'normal';
}

/**
 * 文档元数据
 *
 * @interface DocMeta
 */
export interface DocMeta {
  /**
   * 分类名称作为键，分类元数据作为值
   */
  [key: string]: string | DocMetaItem;
}

/**
 * 文档侧边栏项（用于侧边栏）
 *
 * @interface DocSidebarItem
 */
export interface DocSidebarItem {
  /**
   * 文档标题
   */
  title: string;

  /**
   * 文档链接
   */
  href?: string;

  /**
   * 子文档列表
   */
  items?: DocSidebarItem[];

  /**
   * 是否默认折叠
   */
  collapsed?: boolean;

  /**
   * 项目类型
   */
  type?: 'separator' | 'page' | 'menu';

  /**
   * 是否为外部链接
   */
  isExternal?: boolean;

  /**
   * 文件路径（用于匹配当前页面）
   */
  filePath?: string;
}

/**
 * 文档列表项（用于侧边栏）
 *
 * @interface DocListItem
 */
export interface DocListItem {
  /**
   * 文档唯一标识
   */
  slug: string;

  /**
   * 文档标题
   */
  title: string;

  /**
   * 文档路径
   */
  path: string;
}

/**
 * 标题（用于目录）
 *
 * @interface Heading
 */
export interface Heading {
  /**
   * 标题 ID
   */
  id: string;

  /**
   * 标题文本
   */
  text: string;

  /**
   * 标题级别（1-6）
   */
  level: number;
}
