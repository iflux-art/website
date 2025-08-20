'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, NAV_PATHS } from '@/features/layout/navbar/nav-config';
import { useActiveSection } from '@/features/layout/navbar/hooks/use-active-section';

type NavProps = {
  /**
   * 点击后的回调函数（用于关闭移动菜单）
   */
  onClose?: () => void;

  /**
   * 自定义类名
   */
  className?: string;
};

function NavList({ onClose, className }: NavProps) {
  const isActiveSection = useActiveSection(NAV_ITEMS.map(item => item.key));

  return (
    <div className={cn('flex flex-row gap-6', className)}>
      {NAV_ITEMS.map(item => (
        <Link
          key={item.key}
          href={NAV_PATHS[item.key]}
          onClick={onClose}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isActiveSection === item.key ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function NavListMenu({ onClose, className }: NavProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <NavList onClose={onClose} />
    </div>
  );
}
