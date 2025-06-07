import React from 'react';
import { Button } from '@/components/ui/button';

import { ArrowLeft, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface AdminPageContentLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
  backUrl?: string;
  backLabel?: string;
}

export function AdminPageContentLayout({
  title,
  description,
  icon: Icon,
  children,
  actions,
  backUrl = '/admin',
  backLabel = '返回管理后台',
}: AdminPageContentLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href={backUrl}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
        </Link>
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Icon className="h-8 w-8" />
          {title}
        </h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      {/* 操作按钮 */}
      {actions && <div className="mb-6">{actions}</div>}

      {/* 主要内容 */}
      {children}
    </div>
  );
}