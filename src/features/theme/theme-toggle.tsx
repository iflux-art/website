"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "./theme-store";

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
export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { mounted, setMounted } = useThemeStore();

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  if (!mounted) {
    return null; // Let Next.js loading.tsx handle loading states
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
};
