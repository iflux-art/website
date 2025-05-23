/**
 * 交互效果系统
 * 提供统一的交互效果，确保按钮、链接和卡片的悬停效果一致
 */

/**
 * 交互效果持续时间
 */
export const durations = {
  fast: 'duration-200',
  normal: 'duration-300',
  slow: 'duration-500',
};

/**
 * 交互效果缓动函数
 */
export const easings = {
  default: 'ease-[cubic-bezier(0.4,0,0.2,1)]',
  inOut: 'ease-in-out',
  nonLinear: 'ease-[cubic-bezier(0.19,1,0.22,1)]',
};

/**
 * 按钮交互效果
 */
export const buttonInteractions = {
  // 基础交互效果
  base: 'transition-all duration-300',
  
  // 悬停效果
  hover: {
    // 主要按钮悬停效果
    primary: 'hover:bg-primary/90 hover:shadow-md',
    // 次要按钮悬停效果
    secondary: 'hover:bg-secondary/80 hover:shadow-md',
    // 轮廓按钮悬停效果
    outline: 'hover:bg-accent hover:text-accent-foreground hover:shadow-md',
    // 幽灵按钮悬停效果
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    // 链接按钮悬停效果
    link: 'hover:underline',
    // 破坏性按钮悬停效果
    destructive: 'hover:bg-destructive/90 hover:shadow-md',
    // 成功按钮悬停效果
    success: 'hover:bg-success/90 hover:shadow-md',
  },
  
  // 激活效果
  active: {
    // 缩放效果
    scale: 'active:scale-[0.98]',
  },
};

/**
 * 卡片交互效果
 */
export const cardInteractions = {
  // 基础交互效果
  base: 'transition-all duration-200',
  
  // 悬停效果
  hover: {
    // 默认悬停效果
    default: 'hover:shadow-lg',
    // 边框高亮效果
    border: 'hover:border-primary/20',
    // 背景高亮效果
    background: 'hover:bg-accent/50',
    // 阴影效果
    shadow: 'hover:shadow-lg',
    // 缩放效果
    scale: 'hover:scale-[1.02]',
    // 组合效果
    combined: 'hover:shadow-lg hover:border-primary/20',
  },
};

/**
 * 链接交互效果
 */
export const linkInteractions = {
  // 基础交互效果
  base: 'transition-colors duration-300',
  
  // 悬停效果
  hover: {
    // 颜色变化效果
    color: 'hover:text-primary',
    // 下划线效果
    underline: 'hover:underline',
    // 背景高亮效果
    background: 'hover:bg-accent/50',
  },
  
  // 下划线动画效果 - 从中心向两侧扩散
  underlineAnimation: {
    container: 'relative group',
    line: 'absolute bottom-0 left-[50%] right-[50%] h-[1.5px] bg-primary opacity-80 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:left-0 group-hover:right-0',
  },
};

/**
 * 获取交互效果类名
 * 
 * @param baseClasses 基础类名
 * @param hoverClasses 悬停类名
 * @param activeClasses 激活类名
 * @param focusClasses 焦点类名
 * @returns 组合后的类名
 */
export function getInteractionClasses(
  baseClasses: string,
  hoverClasses?: string,
  activeClasses?: string,
  focusClasses?: string
): string {
  return [
    baseClasses,
    hoverClasses,
    activeClasses,
    focusClasses,
  ].filter(Boolean).join(' ');
}
