'use client';

import React, { useState } from 'react';
import { LoginDialog } from '@/components/admin/auth/login-dialog';

/**
 * 底栏组件
 * 简洁样式，文字居中，点击iFluxArt弹出登录面板
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <footer className="w-full py-4 md:py-6 border-t border-border/30 bg-transparent">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-center">
        <div className="text-sm text-muted-foreground text-center">
          © {currentYear}{' '}
          <button
            onClick={() => setIsLoginOpen(true)}
            className="link-hover hover:text-primary transition-colors cursor-pointer"
          >
            iFluxArt
          </button>
          . 保留所有权利。
        </div>
      </div>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <span />
      </LoginDialog>
    </footer>
  );
}
