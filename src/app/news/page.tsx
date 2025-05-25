'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ExternalLink, RefreshCw } from 'lucide-react';

// 平台配置
const PLATFORMS = [
  { id: 'weibo', name: '微博', color: 'bg-red-500' },
  { id: 'douyin', name: '抖音', color: 'bg-black' },
  { id: 'xiaohongshu', name: '小红书', color: 'bg-red-400' },
  { id: 'bilibili', name: '哔哩哔哩', color: 'bg-pink-500' },
  { id: 'github', name: 'GitHub', color: 'bg-gray-800' },
  { id: 'juejin', name: '掘金', color: 'bg-blue-500' },
];

// 模拟热搜数据
const mockHotSearchData = {
  weibo: [
    { id: 1, title: '春节档电影票房创新高', heat: '2.1亿', trend: 'up' },
    { id: 2, title: '新能源汽车销量突破千万', heat: '1.8亿', trend: 'up' },
    { id: 3, title: '人工智能技术新突破', heat: '1.5亿', trend: 'up' },
    { id: 4, title: '全国多地迎来降雪', heat: '1.2亿', trend: 'down' },
    { id: 5, title: '科技公司发布新产品', heat: '980万', trend: 'up' },
  ],
  douyin: [
    { id: 1, title: '春节回家路上的温暖瞬间', heat: '5000万', trend: 'up' },
    { id: 2, title: '年夜饭制作教程', heat: '4200万', trend: 'up' },
    { id: 3, title: '新年健身挑战', heat: '3800万', trend: 'up' },
    { id: 4, title: '宠物过年趣事', heat: '3500万', trend: 'down' },
    { id: 5, title: '传统文化传承', heat: '3200万', trend: 'up' },
  ],
  xiaohongshu: [
    { id: 1, title: '春节穿搭分享', heat: '800万', trend: 'up' },
    { id: 2, title: '年货好物推荐', heat: '650万', trend: 'up' },
    { id: 3, title: '新年护肤攻略', heat: '580万', trend: 'up' },
    { id: 4, title: '居家收纳技巧', heat: '520万', trend: 'down' },
    { id: 5, title: '美食制作分享', heat: '480万', trend: 'up' },
  ],
  bilibili: [
    { id: 1, title: '2024年度游戏盘点', heat: '1200万', trend: 'up' },
    { id: 2, title: '编程学习路线分享', heat: '980万', trend: 'up' },
    { id: 3, title: '动漫新番推荐', heat: '850万', trend: 'up' },
    { id: 4, title: '科技产品评测', heat: '720万', trend: 'down' },
    { id: 5, title: '音乐创作教程', heat: '680万', trend: 'up' },
  ],
  github: [
    { id: 1, title: 'React 19 正式发布', heat: '15k stars', trend: 'up' },
    { id: 2, title: 'AI 代码生成工具', heat: '12k stars', trend: 'up' },
    { id: 3, title: 'Vue 3.5 新特性', heat: '10k stars', trend: 'up' },
    { id: 4, title: '开源设计系统', heat: '8k stars', trend: 'down' },
    { id: 5, title: 'TypeScript 工具库', heat: '7k stars', trend: 'up' },
  ],
  juejin: [
    { id: 1, title: '前端性能优化实战', heat: '2.5万', trend: 'up' },
    { id: 2, title: 'React Hooks 最佳实践', heat: '2.1万', trend: 'up' },
    { id: 3, title: 'Node.js 微服务架构', heat: '1.8万', trend: 'up' },
    { id: 4, title: 'CSS 新特性解析', heat: '1.5万', trend: 'down' },
    { id: 5, title: 'Vue 3 组件设计', heat: '1.3万', trend: 'up' },
  ],
};

export default function NewsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('weibo');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const currentData = mockHotSearchData[selectedPlatform as keyof typeof mockHotSearchData] || [];

  const handleRefresh = async () => {
    setIsLoading(true);
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '📈' : '📉';
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-8 w-8" />
              热搜资讯
            </h1>
            <p className="text-muted-foreground mt-2">
              实时聚合各大平台热搜榜单，掌握最新动态
            </p>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      {/* 平台选择 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <Button
              key={platform.id}
              variant={selectedPlatform === platform.id ? 'default' : 'outline'}
              onClick={() => setSelectedPlatform(platform.id)}
              className="rounded-full"
            >
              <div className={`w-2 h-2 rounded-full ${platform.color} mr-2`} />
              {platform.name}
            </Button>
          ))}
        </div>
      </div>

      {/* 更新时间 */}
      <div className="mb-6 text-sm text-muted-foreground">
        最后更新：{lastUpdate.toLocaleString()}
      </div>

      {/* 热搜列表 */}
      <div className="grid grid-cols-1 gap-4">
        {currentData.map((item, index) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* 排名 */}
                  <div className="flex-shrink-0">
                    <Badge 
                      variant={index < 3 ? 'default' : 'secondary'}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' : ''
                      }`}
                    >
                      {index + 1}
                    </Badge>
                  </div>

                  {/* 标题 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {item.title}
                    </h3>
                  </div>

                  {/* 热度 */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className={getTrendColor(item.trend)}>
                      {getTrendIcon(item.trend)}
                    </span>
                    <span className="text-muted-foreground">{item.heat}</span>
                  </div>

                  {/* 外链图标 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => {
                      // 这里可以添加跳转到具体平台的逻辑
                      console.log(`跳转到${selectedPlatform}查看: ${item.title}`);
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 底部说明 */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>数据来源于各平台公开API，仅供参考</p>
        <p className="mt-1">点击右侧图标可跳转到对应平台查看详情</p>
      </div>
    </div>
  );
}
