'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, NAV_DESCRIPTIONS } from '@/components/layout/navbar/nav';
import { useActiveSection } from '@/hooks/use-active-section';
import type { NavProps } from '../../layout/navbar/types';

/**
 * 导航卡片组件
 * 以卡片形式展示主要导航选项
 */
export function NavCards({ onClose, className }: NavProps) {
  const isActiveSection = useActiveSection();

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
