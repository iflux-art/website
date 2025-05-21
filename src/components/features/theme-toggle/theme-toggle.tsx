"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { ThemeToggleProps } from "./theme-toggle.types";
import { ThemeIconAnimation } from "./theme-icon-animation";
import { ThemeRippleEffect } from "./theme-ripple-effect";

/**
 * 主题切换组件
 * 用于切换明暗主题模式
 *
 * 增强版本：
 * - 更炫酷的涟漪动画效果
 * - 更好的可访问性
 * - 支持系统主题
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle({ showLabel = false }: ThemeToggleProps = {}) {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [ripplePosition, setRipplePosition] = React.useState<{ x: number; y: number } | null>(null);
  const [showRipple, setShowRipple] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // 确保组件在客户端渲染
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 处理主题切换
  const toggleTheme = React.useCallback(() => {
    if (isAnimating) return;
    if (!setTheme || !resolvedTheme) return;

    setIsAnimating(true);

    // 获取按钮的位置信息
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (buttonRect) {
      // 使用按钮中心点作为涟漪起始点
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      setRipplePosition({ x: centerX, y: centerY });
      setShowRipple(true);
    }

    // 延迟切换主题，等待动画开始
    setTimeout(() => {
      // 简单地在亮色和暗色主题之间切换
      // 无论当前是系统主题还是用户选择的主题
      const newTheme = resolvedTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    }, 200); // 延迟200ms切换主题，让动画先开始
  }, [resolvedTheme, setTheme, isAnimating]);

  // 处理涟漪动画完成
  const handleRippleComplete = React.useCallback(() => {
    setShowRipple(false);
    setRipplePosition(null);
    setIsAnimating(false);
  }, []);

  // 获取当前主题图标和标签
  const getThemeInfo = () => {
    if (!mounted || !resolvedTheme) return { icon: null, label: "加载中..." };

    // 获取当前解析的主题（实际显示的主题）
    const currentTheme = resolvedTheme || "system";

    // 根据当前解析的主题显示相应的图标和标签
    switch (currentTheme) {
      case "dark":
        return {
          icon: <Sun className="h-[1.2rem] w-[1.2rem]" />,
          label: "切换到亮色模式"
        };
      case "light":
        return {
          icon: <Moon className="h-[1.2rem] w-[1.2rem]" />,
          label: "切换到暗色模式"
        };
      default:
        return {
          icon: <Sun className="h-[1.2rem] w-[1.2rem]" />,
          label: "切换主题"
        };
    }
  };

  // 服务端渲染时返回占位符
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="sr-only">加载中...</span>
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse rounded-full bg-muted" />
      </Button>
    );
  }

  const { icon, label } = getThemeInfo();

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size={showLabel ? "default" : "icon"}
        className={showLabel ? "gap-2" : ""}
        title={label}
        aria-label={label}
        onClick={toggleTheme}
        disabled={isAnimating}
      >
        <ThemeIconAnimation
          theme={resolvedTheme}
          isAnimating={isAnimating}
          icon={icon}
        />

        {showLabel && (
          <span className="hidden sm:inline-block">{label}</span>
        )}
      </Button>

      {/* 涟漪效果 */}
      <ThemeRippleEffect
        active={showRipple}
        position={ripplePosition}
        onAnimationComplete={handleRippleComplete}
      />
    </>
  );
}