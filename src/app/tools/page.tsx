'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, PenTool, Code, Palette, FileText, Smile, ExternalLink } from 'lucide-react';

// 工具分类
const TOOL_CATEGORIES = [
  { id: 'all', name: '全部', icon: Wrench },
  { id: 'development', name: '开发工具', icon: Code },
  { id: 'design', name: '设计工具', icon: Palette },
  { id: 'text', name: '文本工具', icon: PenTool },
  { id: 'conversion', name: '转换工具', icon: FileText },
  { id: 'utility', name: '实用工具', icon: Wrench },
  { id: 'entertainment', name: '娱乐工具', icon: Smile },
];

// 工具数据 - 优化后的工具集
const TOOLS = [
  // 开发工具
  {
    id: 'code-toolkit',
    name: '代码工具箱',
    description: '一站式代码处理工具，支持代码格式化、压缩、JSON/CSV转换、HTML编解码等功能',
    category: 'development',
    path: '/tools/code-toolkit',
    tags: ['代码', '格式化', '压缩', 'JSON', 'CSV', 'HTML'],
    isInternal: true,
  },
  {
    id: 'regex-tester',
    name: '正则表达式工具',
    description: '强大的正则表达式测试工具，支持实时匹配、模式验证、语法高亮、常用模式库',
    category: 'development',
    path: '/tools/regex-tester',
    tags: ['正则', '测试', '匹配', '验证', '模式'],
    isInternal: true,
  },

  // 设计工具
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '专业的颜色选择工具，支持HEX、RGB、HSL格式转换，提供配色方案和调色板',
    category: 'design',
    path: '/tools/color-picker',
    tags: ['颜色', '配色', '调色板', 'HEX', 'RGB'],
    isInternal: true,
  },
  {
    id: 'css-toolkit',
    name: 'CSS工具箱',
    description: '前端开发必备的CSS工具集，包含阴影生成器、渐变编辑器、动画预览、布局工具',
    category: 'design',
    path: '/tools/css-toolkit',
    tags: ['CSS', '设计', '动画', '布局', '前端'],
    isInternal: true,
  },

  // 文本工具
  {
    id: 'text-counter',
    name: '文本统计工具',
    description: '专业的文本分析工具，支持字数统计、字符分析、阅读时间估算、关键词提取',
    category: 'text',
    path: '/tools/text-counter',
    tags: ['文本', '统计', '分析', '字数', '阅读时间'],
    isInternal: true,
  },
  {
    id: 'markdown-editor',
    name: 'Markdown编辑器',
    description: '在线Markdown编辑器，支持实时预览、语法高亮、导出PDF、图片上传',
    category: 'text',
    path: '/tools/markdown-editor',
    tags: ['Markdown', '编辑器', '预览', '导出', 'PDF'],
    isInternal: true,
  },
  {
    id: 'content-creator',
    name: '内容创作助手',
    description: '智能内容创作工具，支持标题生成、创意灵感、内容大纲、文案优化',
    category: 'text',
    path: '/tools/content-creator',
    tags: ['创作', '文案', '标题', '大纲', '优化'],
    isInternal: true,
  },

  // 转换工具
  {
    id: 'base64-encoder',
    name: '编码转换工具',
    description: '多格式编码转换工具，支持Base64、URL、HTML编解码，字符编码转换',
    category: 'conversion',
    path: '/tools/base64-encoder',
    tags: ['编码', 'Base64', 'URL', 'HTML', '转换'],
    isInternal: true,
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换器',
    description: '时间格式转换工具，支持时间戳转换、时区转换、日期格式化、时间计算',
    category: 'conversion',
    path: '/tools/timestamp-converter',
    tags: ['时间', '时间戳', '时区', '日期', '转换'],
    isInternal: true,
  },
  {
    id: 'unit-converter',
    name: '单位换算工具',
    description: '全面的单位换算工具，支持长度、重量、温度、面积、体积、进制等多种单位转换',
    category: 'conversion',
    path: '/tools/unit-converter',
    tags: ['单位', '换算', '长度', '重量', '温度'],
    isInternal: true,
  },

  // 实用工具
  {
    id: 'calculator',
    name: '计算器',
    description: '多功能计算器，支持基础运算、科学计算、单位换算、历史记录',
    category: 'utility',
    path: '/tools/calculator',
    tags: ['计算', '数学', '科学', '单位', '换算'],
    isInternal: true,
  },
  {
    id: 'random-generator',
    name: '随机生成器',
    description: '全能随机生成工具，支持随机数、UUID、密码、颜色、名字等多种生成',
    category: 'utility',
    path: '/tools/random-generator',
    tags: ['随机', '生成', 'UUID', '密码', '颜色'],
    isInternal: true,
  },
  {
    id: 'symbol-collection',
    name: '符号大全',
    description: '完整的符号集合，包含Emoji、颜文字、特殊符号、数学符号，支持一键复制',
    category: 'utility',
    path: '/tools/symbol-collection',
    tags: ['符号', 'Emoji', '颜文字', '特殊符号', '数学'],
    isInternal: true,
  },

  // 娱乐工具
  {
    id: 'nonsense-generator',
    name: '废话文学生成器',
    description: '智能废话文学创作工具，支持多种风格生成，包括学术风、商业风、哲学风',
    category: 'entertainment',
    path: '/tools/nonsense-generator',
    tags: ['娱乐', '废话文学', '创作', '文案', '生成'],
    isInternal: true,
  },
];

export default function ToolsPage() {
  const [searchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAllTags, setShowAllTags] = useState(false);
  const [visibleTagCount, setVisibleTagCount] = useState(10); // 默认显示10个标签
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  // 获取所有标签并按使用数量排序
  const getTagsWithCount = () => {
    const tagCounts: { [key: string]: number } = {};
    TOOLS.forEach(tool => {
      tool.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  };

  const tagsWithCount = getTagsWithCount();

  // 计算可见标签数量
  useEffect(() => {
    if (!tagsContainerRef.current) return;

    // 重置为显示所有标签
    if (showAllTags) {
      setVisibleTagCount(tagsWithCount.length);
      return;
    }

    const calculateVisibleTags = () => {
      const containerWidth = tagsContainerRef.current?.clientWidth || 0;
      const tagElements = tagsContainerRef.current?.querySelectorAll('.tag-item');

      if (!tagElements || tagElements.length === 0) {
        setVisibleTagCount(tagsWithCount.length); // 默认显示所有标签
        return;
      }

      let totalWidth = 0;
      let visibleCount = 0;

      // 计算"更多"按钮的宽度 (大约100px)
      const moreButtonWidth = 100;
      const maxWidth = containerWidth - moreButtonWidth;

      // 计算每个标签的宽度并确定可见数量
      for (let i = 0; i < tagElements.length; i++) {
        const tagWidth = tagElements[i].getBoundingClientRect().width + 8; // 加上间距
        if (totalWidth + tagWidth <= maxWidth) {
          totalWidth += tagWidth;
          visibleCount++;
        } else {
          break;
        }
      }

      // 至少显示1个标签
      setVisibleTagCount(Math.max(1, visibleCount));
    };

    calculateVisibleTags();

    // 添加窗口大小变化监听
    window.addEventListener('resize', calculateVisibleTags);
    return () => window.removeEventListener('resize', calculateVisibleTags);
  }, [tagsWithCount, showAllTags]);

  const displayTags = showAllTags ? tagsWithCount : tagsWithCount.slice(0, visibleTagCount);

  // 检查是否需要显示"更多"按钮
  const shouldShowMoreButton = !showAllTags && tagsWithCount.length > visibleTagCount;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">工具箱</h1>
        <p className="text-muted-foreground">好用的工具都在这里</p>
      </div>

      {/* 分类导航 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {TOOL_CATEGORIES.map(category => {
            const CategoryIcon = category.icon;
            return (
              <Button
                key={category.id}
                variant={category.id === selectedCategory ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedTag('');
                }}
              >
                <CategoryIcon className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* 标签过滤 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">按标签筛选</h2>
        <div ref={tagsContainerRef} className="flex flex-wrap gap-2">
          {displayTags.map(({ tag, count }) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'primary' : 'default'}
              className={`cursor-pointer tag-item ${
                selectedTag === tag ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
            >
              {tag} ({count})
            </Badge>
          ))}
          {shouldShowMoreButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllTags(true)}
              className="ml-1"
            >
              更多
            </Button>
          )}
          {showAllTags && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllTags(false)}
              className="ml-1"
            >
              收起
            </Button>
          )}
        </div>
      </div>

      {/* 工具列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.filter(tool => {
          // 搜索过滤
          const matchesSearch = searchQuery
            ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;

          // 标签过滤
          const matchesTag = selectedTag ? tool.tags.includes(selectedTag) : true;

          // 分类过滤
          const matchesCategory =
            selectedCategory === 'all' ? true : tool.category === selectedCategory;

          return matchesSearch && matchesTag && matchesCategory;
        }).map(tool => (
          <Link href={tool.path} key={tool.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>{tool.name}</span>
                  {tool.isInternal ? null : (
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.slice(0, 3).map(tag => (
                    <Badge key={`${tool.id}-${tag}`} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tool.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tool.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
