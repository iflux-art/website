'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

// 导航项描述
const NAV_DESCRIPTIONS = {
  docs: '查看详细的文档和指南，了解如何使用我们的产品和服务',
  blog: '阅读最新的博客文章，了解行业动态和技术趋势',
  navigation: '发现精选的网站和工具，提高您的工作效率',
  friends: '查看我们的合作伙伴和友情链接',
};

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
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4', className)}>
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
  );
}
