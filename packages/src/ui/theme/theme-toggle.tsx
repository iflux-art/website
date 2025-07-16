"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "packages/src/ui/components/shared-ui/button";
import { Sun, Moon } from "lucide-react";

/**
 * 主题切换组件属性
 */
export interface ThemeToggleProps {
  /**
   * 是否显示文本标签
   * 在移动设备上标签会被隐藏
   * @default false
   */
  showLabel?: boolean;
}

/**
 * 主题切换组件
 * 用于切换明暗主题模式
 *
 * 简化版本：
 * - 移除所有动画效果
 * - 保留基础功能
 * - 支持系统主题
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="sr-only">加载中...</span>
        <div className="h-[1.2rem] w-[1.2rem] rounded-full bg-muted" />
      </Button>
    );
  }

  const handleToggle = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const isDark = resolvedTheme === "dark";
  const icon = isDark ? (
    <Sun className="h-[1.2rem] w-[1.2rem]" />
  ) : (
    <Moon className="h-[1.2rem] w-[1.2rem]" />
  );
  const label = isDark ? "切换到浅色模式" : "切换到深色模式";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={handleToggle}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  );
}

/**
 * @deprecated 请使用 ThemeToggle 替代 ModeToggle，ModeToggle 将在未来版本中移除
 */
export { ThemeToggle as ModeToggle };
