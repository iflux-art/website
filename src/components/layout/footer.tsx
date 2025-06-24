'use client';

import React from 'react';
import { cn } from '@/utils';
import dynamic from 'next/dynamic';

const LoginDialog = dynamic(
  () =>
    import('@/components/layout/admin/login-dialog').then(mod => ({ default: mod.LoginDialog })),
  { ssr: false }
);

const COPYRIGHT_TEXT = '保留所有权利。';
const BRAND_NAME = 'iFluxArt';

/**
 * 底栏组件
 * 简洁样式，文字居中，点击iFluxArt弹出登录面板
 */
export function Footer() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  return (
    <footer
      role="contentinfo"
      className={cn('w-full py-4 md:py-6', 'border-t border-border/30', 'bg-transparent')}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-center">
        <div className="text-sm text-muted-foreground text-center">
          © 2025{' '}
          <button
            onClick={() => setIsLoginOpen(true)}
            className={cn('link-hover hover:text-primary', 'transition-colors cursor-pointer')}
            aria-label="打开登录面板"
          >
            {BRAND_NAME}
          </button>{' '}
          {COPYRIGHT_TEXT}
        </div>
      </div>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <span />
      </LoginDialog>
    </footer>
  );
}
