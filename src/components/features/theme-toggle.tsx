'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

type Theme = 'dark' | 'light' | 'system';

const ICON_SIZE = {
  height: '1rem',
  width: '1rem',
} as const;

const THEME_ICONS = {
  dark: () => <Sun style={ICON_SIZE} />,
  light: () => <Moon style={ICON_SIZE} />,
  system: () => <Sun style={ICON_SIZE} />,
} as const;

const THEME_LABELS = {
  dark: '切换到浅色模式',
  light: '切换到暗黑模式',
  system: '切换主题',
} as const;

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
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // 获取当前主题信息
  const themeInfo = React.useMemo(() => {
    if (!mounted || !resolvedTheme) {
      return {
        icon: null,
        label: '加载中...',
      };
    }

    const currentTheme = (resolvedTheme || 'system') as Theme;
    const IconComponent = THEME_ICONS[currentTheme];

    return {
      icon: <IconComponent />,
      label: THEME_LABELS[currentTheme],
    };
  }, [mounted, resolvedTheme]);
  // 服务端渲染或未加载完成时显示占位符
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="sr-only">加载中...</span>
        <div className="h-[1.2rem] w-[1.2rem] rounded-full bg-muted" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={showLabel ? 'default' : 'icon'}
      className={
        showLabel
          ? 'gap-2 text-muted-foreground hover:text-foreground'
          : 'h-9 w-9 text-muted-foreground hover:text-foreground'
      }
      title={themeInfo.label}
      aria-label={themeInfo.label}
      onClick={toggleTheme}
    >
      <div className="flex items-center justify-center">{themeInfo.icon}</div>

      {showLabel && <span className="hidden sm:inline-block">{themeInfo.label}</span>}
    </Button>
  );
}

/**
 * @deprecated 请使用 ThemeToggle 替代 ModeToggle，ModeToggle 将在未来版本中移除
 */
export { ThemeToggle as ModeToggle };
