'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 搜索按钮组件
 * 仅显示搜索图标，不包含搜索功能
 */
export function SearchButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="搜索"
      className="rounded-lg transition-all hover:bg-accent/50"
    >
      <Search className="h-5 w-5" />
      <span className="sr-only">搜索</span>
    </Button>
  );
}
