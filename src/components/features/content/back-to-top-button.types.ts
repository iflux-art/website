/**
 * back-to-top-button 组件类型定义
 */

/**
 * 回到顶部按钮组件属性
 */
export interface BackToTopButtonProps {
  /**
   * 按钮标题（用于 title 属性和屏幕阅读器）
   */
  title: string;
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 滚动行为
   * @default 'smooth'
   */
  behavior?: ScrollBehavior;
  
  /**
   * 滚动到的位置
   * @default 0
   */
  top?: number;
}
