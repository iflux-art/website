"use client";

import { useCallback } from "react";
import Link from "next/link";

const TRANSITION_STYLE = {
  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

const LOGO_CLASSES = [
  "text-sm sm:text-md md:text-lg",
  "font-bold tracking-wide",
  "hover:text-primary",
  "transition-all duration-400",
  "animate-in fade-in zoom-in-90",
  "hover:scale-105",
].join(" ");

interface LogoProps {
  /** Logo文本内容 */
  text?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * Logo 组件
 *
 * 网站 Logo 组件，支持：
 * 1. 点击时硬刷新导航到首页
 * 2. 自定义Logo文本
 * 3. 响应式设计
 * 4. 平滑过渡动画
 * 5. 无障碍访问支持
 */
export function Logo({
  text = "iFluxArt",
  className = "inline-block",
}: LogoProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = "/";
  }, []);

  return (
    <Link
      href="/"
      className={className}
      onClick={handleClick}
      aria-label={`${text} - 返回首页`}
    >
      <h2 className={LOGO_CLASSES} style={TRANSITION_STYLE}>
        {text}
      </h2>
    </Link>
  );
}
