/**
 * mobile-menu 组件类型定义
 */

/**
 * 移动端菜单组件属性
 */
export interface MobileMenuProps {
  /**
   * 菜单是否打开
   */
  isOpen: boolean;
  
  /**
   * 设置菜单打开状态的函数
   */
  setIsOpen: (isOpen: boolean) => void;
}
