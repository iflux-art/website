'use client';

import React from 'react';

/**
 * 底栏组件
 * 简洁样式，文字居中
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 bg-background/50 backdrop-blur-sm border-t border-border/30">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-center">
        <div className="text-sm text-muted-foreground text-center">
          © {currentYear} iFluxArt. 保留所有权利。
        </div>
      </div>
    </footer>
  );
}
