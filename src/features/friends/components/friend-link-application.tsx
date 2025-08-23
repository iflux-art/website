'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, HandHeart, Globe, Users, Heart, MessageCircle } from 'lucide-react';
import type { FriendsPageConfig } from '../types';

interface FriendLinkApplicationProps {
  /** 友链页面配置 */
  config: FriendsPageConfig;
  /** 自定义类名 */
  className?: string;
}

/**
 * 友链申请卡片组件
 *
 * 从原始 friends 页面中提取的友链申请表单UI组件，
 * 包含申请要求展示和申请按钮功能。
 */
export function FriendLinkApplication({ config, className = '' }: FriendLinkApplicationProps) {
  const { application, requirements } = config;

  const handleApplyClick = () => {
    window.open(application.formUrl, '_blank', 'noopener,noreferrer');
  };

  // 图标映射
  const iconMap = {
    Globe,
    Users,
    Heart,
  };

  return (
    <div className={`mt-16 mb-12 ${className}`}>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <CardContent className="p-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* 头部图标 */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30">
              <HandHeart className="h-8 w-8 text-primary" />
            </div>

            {/* 标题和描述 */}
            <h2 className="mb-4 text-2xl font-bold">{application.title}</h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">{application.description}</p>

            {/* 申请要求网格 */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {requirements.map((requirement, index) => {
                const IconComponent = iconMap[requirement.icon as keyof typeof iconMap];

                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{requirement.title}</div>
                      <div className="text-sm text-muted-foreground">{requirement.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 申请按钮 */}
            <Button size="lg" className="group" onClick={handleApplyClick}>
              <MessageCircle className="mr-2 h-4 w-4" />
              申请友情链接
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
