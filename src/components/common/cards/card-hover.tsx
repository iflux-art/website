'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/shared/utils/utils';

interface CardHoverProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  isExternal?: boolean;
  style?: React.CSSProperties;
}

/**
 * 统一的卡片悬停效果组件
 *
 * 提供一致的卡片样式和悬停动画：
 * - 轻微放大效果
 * - 阴影变化
 * - 适配不同主题模式
 */
export const CardHover = forwardRef<HTMLDivElement, CardHoverProps>(
  ({ children, className, href, onClick, disabled = false, isExternal = false, style }, ref) => {
    const baseClasses = cn(
      // 基础样式
      'group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm',
      // 过渡动画 - 只对阴影和边框进行过渡，避免与transform动画冲突
      'transition-shadow duration-300 ease-out',
      // 悬停效果 - 移除transform相关的悬停效果，避免与交错动画冲突
      !disabled && ['hover:shadow-lg hover:shadow-black/10', 'dark:hover:shadow-white/5'],
      // 交互状态
      !disabled && 'cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    );

    if (href) {
      if (isExternal) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
            style={style}
            onClick={disabled ? undefined : onClick}
          >
            {children}
          </a>
        );
      } else {
        // 对于内部链接，我们需要使用 Next.js Link
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={baseClasses}
            style={style}
            onClick={disabled ? undefined : onClick}
          >
            {children}
          </a>
        );
      }
    }

    return (
      <div ref={ref} className={baseClasses} onClick={disabled ? undefined : onClick}>
        {children}
      </div>
    );
  }
);

CardHover.displayName = 'CardHover';
