'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AuthButtons } from '@/features/auth';
import { GitHubButton, TravelButton } from './';

/**
 * 底栏组件
 * 版权信息左对齐，右侧显示登录、GitHub 和开往按钮
 */
export const Footer = () => (
  <footer
    role="contentinfo"
    className={cn('w-full py-4 md:py-6', 'border-t border-border/30', 'bg-transparent')}
  >
    <div className="container mx-auto flex items-center justify-between px-4">
      <div className="text-sm text-muted-foreground">© 2025 iFluxArt 保留所有权利</div>
      <div className="flex items-center gap-1">
        <AuthButtons />
        <GitHubButton />
        <TravelButton />
      </div>
    </div>
  </footer>
);
