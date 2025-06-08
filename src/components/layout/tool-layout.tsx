import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
  helpContent?: React.ReactNode;
}

export function ToolLayout({
  title,
  description,
  icon: Icon,
  children,
  actions,
  helpContent,
}: ToolLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
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

      {/* 操作按钮区域 */}
      {actions && <div className="mb-6">{actions}</div>}

      {/* 主要内容区域 */}
      {children}

      {/* 使用说明 */}
      {helpContent && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>{helpContent}</CardContent>
        </Card>
      )}
    </div>
  );
}
