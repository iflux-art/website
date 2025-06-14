'use client';

import React from 'react';
import AdminPageContentLayout from '@/components/admin/admin-page-content-layout';
import { UnifiedCard } from '@/components/common/cards/unified-card';
import { Globe, BarChart3 } from 'lucide-react';
import { UnifiedGrid } from '@/components/common/cards/unified-grid';

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
      <UnifiedGrid columns={4} className="mb-8">
        {stats.map(stat => (
          <UnifiedCard
            key={stat.title}
            type="navigation"
            variant="compact"
            title={stat.title}
            description={stat.description}
            href="/admin/navigation"
            icon={<stat.icon className={stat.color} />}
            iconType="component"
          />
        ))}
      </UnifiedGrid>
    </AdminPageContentLayout>
  );
}
