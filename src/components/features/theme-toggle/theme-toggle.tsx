"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { ThemeToggleProps } from "./theme-toggle.types";
import { ThemeIconAnimation } from "./theme-icon-animation";

/**
 * 主题切换组件
 * 用于切换明暗主题模式
 *
 * 增强版本：
 * - 更丰富的动画效果
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

  // 确保组件在客户端渲染
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 处理主题切换
  const toggleTheme = React.useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);

    // 使用 requestAnimationFrame 确保在下一帧切换主题
    // 这样可以避免在同一帧内进行多次状态更新
    requestAnimationFrame(() => {
      // 简单地在亮色和暗色主题之间切换
      // 无论当前是系统主题还是用户选择的主题
      const newTheme = resolvedTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });

    // 动画完成后重置状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, [resolvedTheme, setTheme, isAnimating]);

  // 获取当前主题图标和标签
  const getThemeInfo = () => {
    if (!mounted) return { icon: null, label: "加载中..." };

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
    <Button
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
  );
}