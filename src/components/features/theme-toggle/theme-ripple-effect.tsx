"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";

interface ThemeRippleEffectProps {
  /**
   * 是否激活动画
   */
  active: boolean;

  /**
   * 动画完成后的回调
   */
  onAnimationComplete: () => void;

  /**
   * 触发点的位置
   */
  position: {
    x: number;
    y: number;
  } | null;
}

/**
 * 主题切换涟漪效果组件
 *
 * 实现从点击位置向外扩散的圆形动画效果
 */
export function ThemeRippleEffect({
  active,
  onAnimationComplete,
  position
}: ThemeRippleEffectProps) {
  const { resolvedTheme } = useTheme();
  const rippleRef = useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // 在客户端渲染时设置 portal 容器
  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  // 处理动画效果
  useEffect(() => {
    if (!active || !position || !rippleRef.current || !portalContainer) return;

    const ripple = rippleRef.current;

    // 计算动画起始位置
    const posX = position.x;
    const posY = position.y;

    // 计算最大半径（屏幕对角线长度）
    const maxRadius = Math.sqrt(
      Math.pow(Math.max(posX, window.innerWidth - posX), 2) +
      Math.pow(Math.max(posY, window.innerHeight - posY), 2)
    );

    // 设置起始位置
    ripple.style.top = `${posY}px`;
    ripple.style.left = `${posX}px`;

    // 设置动画起始状态
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '1';

    // 触发重排以确保初始状态被应用
    ripple.getBoundingClientRect();

    // 应用动画
    ripple.style.transform = `scale(${maxRadius / 20})`; // 除以20是因为我们设置了40px的初始大小

    // 动画完成后的处理
    const animationDuration = 1000; // 1秒

    // 监听过渡结束事件
    const handleTransitionEnd = () => {
      ripple.removeEventListener('transitionend', handleTransitionEnd);
      onAnimationComplete();
    };

    ripple.addEventListener('transitionend', handleTransitionEnd);

    // 作为备份，如果过渡事件没有触发，使用定时器
    const timer = setTimeout(() => {
      ripple.removeEventListener('transitionend', handleTransitionEnd);
      onAnimationComplete();
    }, animationDuration + 100);

    return () => clearTimeout(timer);
  }, [active, position, portalContainer, onAnimationComplete]);

  // 如果没有 portal 容器或动画未激活，则不渲染
  if (!portalContainer || !active) return null;

  // 确定背景颜色（与目标主题相反）
  // 使用目标主题的背景色，这样扩散效果更自然
  const bgColor = resolvedTheme === 'dark' ? 'var(--foreground)' : 'var(--background)';

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={rippleRef}
        className="absolute rounded-full w-[40px] h-[40px]"
        style={{
          backgroundColor: bgColor,
          transformOrigin: 'center center',
          transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1.4), opacity 0.2s ease-out',
          willChange: 'transform, opacity',
          opacity: 0,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>,
    portalContainer
  );
}
