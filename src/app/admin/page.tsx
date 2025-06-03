'use client';

import React from 'react';
import { AdminPageContentLayout } from '@/components/layout/AdminPageContentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: '网址管理',
      description: '添加、编辑、删除网址信息。',
      icon: Globe,
      color: 'text-blue-600',
    },
  ];

  return (
    <AdminPageContentLayout
      title="管理仪表板"
      description="欢迎回来！这里是系统管理概览"
      icon={BarChart3}
      backUrl="/"
      backLabel="返回首页"
    >
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <a href="/admin/navigation" key={stat.title}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </AdminPageContentLayout>
  );
}
