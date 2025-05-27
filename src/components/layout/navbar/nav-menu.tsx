'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import { Home, Globe, Mail, Settings } from 'lucide-react';

// 导航项描述
const NAV_DESCRIPTIONS = {
  blog: '阅读最新的博客文章，了解行业动态和技术趋势',
  docs: '查看详细的文档和指南，了解如何使用我们的产品和服务',
  tools: '发现实用的在线工具，提升工作和学习效率',
  navigation: '发现精选的网站和工具，提高您的工作效率',
};

// 管理菜单项
const ADMIN_MENU_ITEMS = [
  {
    key: 'admin',
    label: '仪表板',
    icon: Home,
    description: '查看系统概览和统计信息',
  },
  {
    key: 'admin/navigation',
    label: '网址管理',
    icon: Globe,
    description: '管理网站导航中的所有网址',
  },
  {
    key: 'admin/email',
    label: '邮箱管理',
    icon: Mail,
    description: '管理多个邮箱账户，统一收发邮件',
  },
  {
    key: 'admin/settings',
    label: '系统设置',
    icon: Settings,
    description: '配置系统参数和选项',
  },
];

interface NavMenuProps {
  /**
   * 显示模式：links 为链接列表，cards 为卡片模式
   */
  mode: 'links' | 'cards';

  /**
   * 点击后的回调函数（用于关闭移动菜单）
   */
  onClose?: () => void;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 统一的导航菜单组件
 * 支持链接列表和卡片两种显示模式
 */
export function NavMenu({ mode, onClose, className }: NavMenuProps) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      const loginTime = localStorage.getItem('loginTime');

      if (loggedIn === 'true' && loginTime) {
        // 检查登录是否过期（24小时）
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const isExpired = now - loginTimestamp > 24 * 60 * 60 * 1000;

        if (!isExpired) {
          setIsLoggedIn(true);
        }
      }
    };

    checkAuth();

    // 监听存储变化
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 判断当前路径是否属于某个版块
  const isActiveSection = (key: string) => {
    // 检查路径是否以版块名称开头
    if (pathname.startsWith(`/${key}`)) {
      return true;
    }
    // 首页特殊处理 - 当路径为根路径时，不高亮任何导航项
    return false;
  };

  if (mode === 'links') {
    return (
      <ul
        className={cn(
          'flex lg:items-center lg:flex-row flex-col items-start gap-6 lg:text-sm text-base font-medium text-muted-foreground',
          className
        )}
      >
        {NAV_ITEMS.map(item => (
          <li
            key={item.key}
            className="w-full lg:w-auto transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Link
              href={`/${item.key}`}
              className={cn(
                'block py-2 lg:py-0 px-1 rounded-md hover:bg-accent/20 transition-colors duration-300',
                isActiveSection(item.key)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
              onClick={onClose}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // cards 模式
  return (
    <div className={cn('space-y-6', className)}>
      {/* 主导航 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.key}
            href={`/${item.key}`}
            onClick={onClose}
            className={cn(
              'group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
              isActiveSection(item.key)
                ? 'border-primary/50 bg-primary/5'
                : 'border-border hover:border-primary/30'
            )}
          >
            <div className="space-y-2">
              <h3
                className={cn(
                  'font-semibold text-lg transition-colors',
                  isActiveSection(item.key)
                    ? 'text-primary'
                    : 'text-foreground group-hover:text-primary'
                )}
              >
                {item.label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {NAV_DESCRIPTIONS[item.key as keyof typeof NAV_DESCRIPTIONS]}
              </p>
            </div>

            {/* 装饰性元素 - 修复小屏显示问题 */}
            <div
              className={cn(
                'absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-10 transition-all duration-300 group-hover:scale-110',
                isActiveSection(item.key) ? 'bg-primary' : 'bg-primary group-hover:opacity-20'
              )}
            />
          </Link>
        ))}
      </div>

      {/* 管理菜单 - 仅登录后显示 */}
      {isLoggedIn && (
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">管理后台</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADMIN_MENU_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={`/${item.key}`}
                  onClick={onClose}
                  className={cn(
                    'group relative overflow-hidden rounded-xl border bg-card p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
                    isActiveSection(item.key)
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <h4
                        className={cn(
                          'font-medium transition-colors',
                          isActiveSection(item.key)
                            ? 'text-primary'
                            : 'text-foreground group-hover:text-primary'
                        )}
                      >
                        {item.label}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
