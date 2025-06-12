'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/input/button';
import { Sun, Moon } from 'lucide-react';

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
export function ThemeToggle({ showLabel = false }: ThemeToggleProps = {}) {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  // 确保组件在客户端渲染
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 处理主题切换
  const toggleTheme = React.useCallback(() => {
    if (!setTheme) return;

    // 简单地在亮色和暗色主题之间切换
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // 强制重新渲染以确保主题切换生效
    setTimeout(() => {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }, 0);
  }, [resolvedTheme, setTheme]);

  // 获取当前主题图标和标签
  const getThemeInfo = () => {
    if (!mounted || !resolvedTheme) return { icon: null, label: '加载中...' };

    // 获取当前解析的主题（实际显示的主题）
    const currentTheme = resolvedTheme || 'system';

    // 根据当前解析的主题显示相应的图标和标签
    switch (currentTheme) {
      case 'dark':
        return {
          icon: <Sun className="h-[1.2rem] w-[1.2rem]" />,
          label: '切换到亮色模式',
        };
      case 'light':
        return {
          icon: <Moon className="h-[1.2rem] w-[1.2rem]" />,
          label: '切换到暗色模式',
        };
      default:
        return {
          icon: <Sun className="h-[1.2rem] w-[1.2rem]" />,
          label: '切换主题',
        };
    }
  };

  // 服务端渲染时返回占位符
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="sr-only">加载中...</span>
        <div className="h-[1.2rem] w-[1.2rem] rounded-full bg-muted" />
      </Button>
    );
  }

  const { icon, label } = getThemeInfo();

  return (
    <Button
      variant="ghost"
      size={showLabel ? 'default' : 'icon'}
      className={
        showLabel
          ? 'gap-2 text-muted-foreground hover:text-foreground'
          : 'h-9 w-9 text-muted-foreground hover:text-foreground'
      }
      title={label}
      aria-label={label}
      onClick={toggleTheme}
    >
      <div className="flex items-center justify-center">{icon}</div>

      {showLabel && <span className="hidden sm:inline-block">{label}</span>}
    </Button>
  );
}

/**
 * @deprecated 请使用 ThemeToggle 替代 ModeToggle，ModeToggle 将在未来版本中移除
 */
export { ThemeToggle as ModeToggle };
