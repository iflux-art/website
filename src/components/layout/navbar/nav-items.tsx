'use client';

import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * 导航项组件
 * 负责渲染导航链接列表
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function NavItems() {
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

  return (
    <ul className="flex lg:items-center lg:flex-row flex-col items-start gap-6 lg:text-sm text-base font-medium text-muted-foreground">
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
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
