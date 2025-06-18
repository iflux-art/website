/**
 * 导航相关类型定义
 */

/**
 * 导航链接组件属性
 */
export interface NavLinkProps {
  /**
   * 链接地址
   */
  href: string;

  /**
   * 链接内容
   */
  children: React.ReactNode;

  /**
   * 当前文档标识符，用于更灵活的匹配
   */
  currentDoc?: string;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 活动状态的类名
   */
  activeClassName?: string;

  /**
   * 非活动状态的类名
   */
  inactiveClassName?: string;

  /**
   * 点击事件处理函数
   */
  onClick?: () => void;

  /**
   * 鼠标进入事件处理函数
   */
  onMouseEnter?: () => void;

  /**
   * 鼠标离开事件处理函数
   */
  onMouseLeave?: () => void;

  /**
   * 链接目标
   */
  target?: string;

  /**
   * 链接关系
   */
  rel?: string;

  /**
   * 是否为导航类型链接
   * 如果为 true，则不会自动添加 /docs 前缀
   */
  _isNavigation?: boolean;
}
