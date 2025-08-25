'use client';

import Link from 'next/link';
import { cn } from '@/utils';
import { ADMIN_MENU_ITEMS, NAV_ITEMS, NAV_PATHS } from '@/components/layout/navbar/nav-config';
import { useActiveSection } from '@/hooks/navbar/use-active-section';
import { useUser } from '@clerk/nextjs';

interface NavProps {
  /**
   * 点击后的回调函数（用于关闭移动菜单）
   */
  onClose?: () => void;

  /**
   * 自定义类名
   */
  className?: string;
}

const NavList = ({ onClose, className }: NavProps) => {
  const isActiveSection = useActiveSection(
    NAV_ITEMS.map((item: (typeof NAV_ITEMS)[number]) => item.key)
  );

  return (
    <div className={cn('flex flex-row gap-6', className)}>
      {NAV_ITEMS.map((item: (typeof NAV_ITEMS)[number]) => (
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
};

const AdminMenu = ({ onClose }: NavProps) => {
  const { isSignedIn } = useUser();
  const isActiveSection = useActiveSection(
    ADMIN_MENU_ITEMS.map((item: (typeof ADMIN_MENU_ITEMS)[number]) => item.key)
  );

  if (!isSignedIn) return null;

  return (
    <>
      {ADMIN_MENU_ITEMS.filter(item => item.key === 'admin').map(
        (item: (typeof ADMIN_MENU_ITEMS)[number]) => (
          <Link
            key={item.key}
            href={`/${item.key}`}
            onClick={onClose}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActiveSection === item.key ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {item.label}
          </Link>
        )
      )}
    </>
  );
};

export const NavListMenu = ({ onClose, className }: NavProps) => (
  <div className={cn('flex flex-row items-center gap-6', className)}>
    <NavList onClose={onClose} />
    <AdminMenu onClose={onClose} />
  </div>
);
