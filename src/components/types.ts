/**
 * 基础导航项属性
 */
export interface BaseNavItemProps {
  /**
   * 链接地址
   */
  href: string;

  /**
   * 显示文本
   */
  label: string;

  /**
   * 是否激活
   */
  isActive?: boolean;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 点击事件处理函数
   */
  onClick?: () => void;
}
