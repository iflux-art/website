'use client';

import React from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Mail, Settings, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: '网址总数',
      value: '156',
      description: '已收录的网址数量',
      icon: Globe,
      color: 'text-blue-600',
    },
    {
      title: '邮件数量',
      value: '23',
      description: '未读邮件数量',
      icon: Mail,
      color: 'text-green-600',
    },
    {
      title: '系统状态',
      value: '正常',
      description: '所有服务运行正常',
      icon: Activity,
      color: 'text-emerald-600',
    },
    {
      title: '配置项',
      value: '12',
      description: '系统配置项数量',
      icon: Settings,
      color: 'text-purple-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground">
            欢迎回来！这里是系统管理概览。
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/admin/navigation"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">网址管理</div>
                    <div className="text-sm text-muted-foreground">管理网址</div>
                  </div>
                </a>
                <a
                  href="/admin/email"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">邮箱管理</div>
                    <div className="text-sm text-muted-foreground">查看邮件</div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系统信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">系统版本</span>
                  <span className="text-sm font-medium">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">运行时间</span>
                  <span className="text-sm font-medium">2天 3小时</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">最后更新</span>
                  <span className="text-sm font-medium">2024-01-15</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">添加了新网址</div>
                  <div className="text-xs text-muted-foreground">2小时前</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">收到新邮件</div>
                  <div className="text-xs text-muted-foreground">4小时前</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">更新了系统配置</div>
                  <div className="text-xs text-muted-foreground">1天前</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
