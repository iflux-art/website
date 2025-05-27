'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  PenTool,
  Code,
  Palette,
  FileText,
  Smile,
  Search,
  ExternalLink,
} from 'lucide-react';

// 工具分类
const TOOL_CATEGORIES = [
  { id: 'all', name: '全部', icon: Wrench },
  { id: 'development', name: '开发工具', icon: Code },
  { id: 'design', name: '设计工具', icon: Palette },
  { id: 'text', name: '文本工具', icon: PenTool },
  { id: 'conversion', name: '转换工具', icon: FileText },
  { id: 'utility', name: '实用工具', icon: Wrench },
  { id: 'life', name: '生活工具', icon: Wrench },
  { id: 'business', name: '商务工具', icon: Wrench },
  { id: 'creative', name: '创意工具', icon: Palette },
  { id: 'education', name: '学习工具', icon: PenTool },
  { id: 'entertainment', name: '娱乐工具', icon: Smile },
  { id: 'ai', name: 'AI工具', icon: Code },
];

// 工具数据 - 优化后的工具集
const TOOLS = [
  // 开发工具
  {
    id: 'code-toolkit',
    name: '代码处理工具集',
    description: '全面的代码处理工具，包括格式化、压缩、JSON/CSV转换、HTML编解码',
    category: 'development',
    path: '/tools/code-formatter',
    tags: ['代码', '格式化', '压缩', 'JSON', 'CSV', 'HTML'],
    isInternal: true,
  },
  {
    id: 'regex-toolkit',
    name: '正则表达式工具集',
    description: '正则表达式工具，包括测试验证、生成器、模式构建、匹配分析',
    category: 'development',
    path: '/tools/regex-tester',
    tags: ['正则', '测试', '生成器', '匹配'],
    isInternal: true,
  },

  // 设计工具
  {
    id: 'photography-toolkit',
    name: '摄影工具集',
    description: '摄影辅助工具，包括曝光计算、景深计算、构图指导、后期处理',
    category: 'design',
    path: '/tools/photography-toolkit',
    tags: ['摄影', '曝光', '构图', '后期'],
    isInternal: true,
  },

  // 文本工具
  {
    id: 'text-toolkit',
    name: '文字统计工具',
    description: '全面的文本处理工具，包括文字统计、文本比较、排序、大小写转换、格式化',
    category: 'text',
    path: '/tools/text-counter',
    tags: ['文字统计', '字数', '分析', '时间估算'],
    isInternal: true,
  },
  {
    id: 'markdown-toolkit',
    name: 'Markdown工具集',
    description: 'Markdown编辑工具，包括实时预览、语法高亮、导出功能、表格编辑',
    category: 'text',
    path: '/tools/markdown-editor',
    tags: ['Markdown', '编辑器', '预览', '语法高亮', '导出'],
    isInternal: true,
  },
  {
    id: 'document-toolkit',
    name: '文档生成工具集',
    description: '文档工具，包括README生成、API文档、项目文档、技术规范、更新日志',
    category: 'text',
    path: '/tools/document-generator',
    tags: ['文档', '生成', 'README', 'API', '规范'],
    isInternal: true,
  },
  {
    id: 'content-toolkit',
    name: '内容创作工具集',
    description: '内容创作工具，包括标题生成、创意灵感、内容大纲、占位文本、废话文学',
    category: 'text',
    path: '/tools/content-creator',
    tags: ['内容', '创作', '标题', '灵感', '大纲'],
    isInternal: true,
  },

  // 转换工具
  {
    id: 'encoding-toolkit',
    name: '编码工具集',
    description: '编码转换工具，包括Base64、URL、HTML编解码、字符编码转换',
    category: 'conversion',
    path: '/tools/base64-encoder',
    tags: ['编码', 'Base64', '解码', '转换'],
    isInternal: true,
  },
  {
    id: 'time-toolkit',
    name: '时间工具集',
    description: '时间处理工具，包括时间戳转换、时区转换、格式化、日期计算',
    category: 'conversion',
    path: '/tools/timestamp-converter',
    tags: ['时间戳', '转换', '日期', '时间'],
    isInternal: true,
  },
  {
    id: 'unit-toolkit',
    name: '单位转换工具',
    description: '全面的单位转换工具，支持长度、重量、温度、面积、体积、进制等多种单位转换',
    category: 'conversion',
    path: '/tools/unit-converter',
    tags: ['单位', '转换', '进制', '长度', '重量', '温度'],
    isInternal: true,
  },

  {
    id: 'data-toolkit',
    name: 'JSON格式化工具',
    description: '专业JSON数据处理工具，支持JSON美化、压缩、验证、格式化等功能',
    category: 'conversion',
    path: '/tools/json-formatter',
    tags: ['数据', 'JSON', '格式化', '验证', '美化'],
    isInternal: true,
  },
  {
    id: 'base64-simple',
    name: 'Base64编码工具',
    description: '简洁的Base64编码解码工具，支持中文字符和一键复制',
    category: 'conversion',
    path: '/tools/base64-simple',
    tags: ['Base64', '编码', '解码', '转换'],
    isInternal: true,
  },
  {
    id: 'url-encoder',
    name: 'URL编码工具',
    description: 'URL编码解码工具，处理特殊字符和中文，支持一键复制',
    category: 'conversion',
    path: '/tools/url-encoder',
    tags: ['URL', '编码', '解码', '特殊字符'],
    isInternal: true,
  },
  {
    id: 'text-processor',
    name: '文本处理工具',
    description: '文本格式转换和统计工具，支持大小写转换、字符统计等',
    category: 'text',
    path: '/tools/text-processor',
    tags: ['文本', '转换', '统计', '格式化'],
    isInternal: true,
  },
  {
    id: 'timestamp-simple',
    name: '时间戳转换工具',
    description: '时间戳与日期时间相互转换，支持多种格式',
    category: 'conversion',
    path: '/tools/timestamp-simple',
    tags: ['时间戳', '日期', '转换', '格式化'],
    isInternal: true,
  },
  {
    id: 'hash-generator',
    name: '哈希生成器',
    description: '生成文本的 MD5、SHA-256 等哈希值',
    category: 'security',
    path: '/tools/hash-generator',
    tags: ['哈希', 'MD5', 'SHA256', '加密'],
    isInternal: true,
  },
  {
    id: 'color-simple',
    name: '颜色工具',
    description: '颜色选择、格式转换和随机生成工具',
    category: 'design',
    path: '/tools/color-simple',
    tags: ['颜色', '设计', '转换', 'HEX', 'RGB'],
    isInternal: true,
  },

  // 实用工具
  {
    id: 'calculator-toolkit',
    name: '计算器',
    description: '多功能计算器，包括简单计算器和科学计算器，支持基础运算和高级数学函数',
    category: 'utility',
    path: '/tools/calculator',
    tags: ['计算器', '数学', '科学', '运算', '简单'],
    isInternal: true,
  },
  {
    id: 'network-toolkit',
    name: '网络诊断工具',
    description: '专业网络诊断测试工具，包括Ping连通性测试、DNS解析查询、端口扫描、网速测试',
    category: 'utility',
    path: '/tools/network-diagnostics',
    tags: ['网络', '诊断', 'Ping', 'DNS', '端口', '网速'],
    isInternal: true,
  },

  {
    id: 'generator-toolkit',
    name: '生成器工具集',
    description: '全能生成器工具，包括随机生成器、UUID生成器、二维码生成器、哈希生成器、密码生成器',
    category: 'utility',
    path: '/tools/random-generator',
    tags: ['生成器', '随机', 'UUID', '二维码', '哈希', '密码'],
    isInternal: true,
  },
  {
    id: 'symbol-collection',
    name: '符号大全',
    description: '完整的符号集合，包括Emoji、颜文字、特殊符号、数学符号，点击即可复制',
    category: 'utility',
    path: '/tools/symbol-collection',
    tags: ['符号', 'Emoji', '颜文字', '特殊符号', '数学'],
    isInternal: true,
  },

  // 生活服务
  {
    id: 'lifestyle-toolkit',
    name: '生活服务工具集',
    description:
      '综合生活服务工具，包括健康管理、旅行助手、烹饪工具、购物助手、宠物护理、天气查询、时间管理',
    category: 'life',
    path: '/tools/lifestyle-toolkit',
    tags: ['生活', '健康', '旅行', '烹饪', '购物', '宠物', '天气', '时间'],
    isInternal: true,
  },

  // 商务工具
  {
    id: 'office-toolkit',
    name: '办公效率工具集',
    description: '办公效率工具，包括发票生成、费用计算、合同模板、项目跟踪',
    category: 'business',
    path: '/tools/office-toolkit',
    tags: ['办公', '效率', '发票', '合同'],
    isInternal: true,
  },
  {
    id: 'business-toolkit',
    name: '商务工具集',
    description: '商务管理工具，包括客户管理、营销推广、数据分析、财务计算',
    category: 'business',
    path: '/tools/crm-toolkit',
    tags: ['商务', '客户', '营销', '财务'],
    isInternal: true,
  },
  {
    id: 'ecommerce-toolkit',
    name: '电商工具集',
    description: '电商运营工具，包括利润计算、定价策略、库存管理、数据分析',
    category: 'business',
    path: '/tools/ecommerce-toolkit',
    tags: ['电商', '利润', '定价', '库存'],
    isInternal: true,
  },

  // 创意工具
  {
    id: 'design-css-toolkit',
    name: '设计工具集',
    description: '前端设计必备工具，包括颜色选择器、CSS生成器、阴影效果、动画预览、布局工具',
    category: 'creative',
    path: '/tools/css-toolkit',
    tags: ['设计', '颜色', 'CSS', '动画', '布局', '前端'],
    isInternal: true,
  },
  {
    id: 'content-creator',
    name: '内容创作工具',
    description: 'AI驱动的内容创作工具，包括标题生成、创意灵感、内容大纲、开头钩子、占位文本生成',
    category: 'creative',
    path: '/tools/content-creator',
    tags: ['内容', '创作', '文案', 'SEO', '标题', 'AI'],
    isInternal: true,
  },
  {
    id: 'social-media-toolkit',
    name: '社交媒体工具集',
    description: '社交媒体工具，包括内容创作、短视频脚本、直播话术、私域运营',
    category: 'creative',
    path: '/tools/social-media-toolkit',
    tags: ['社交', '短视频', '直播', '私域'],
    isInternal: true,
  },

  // 学习工具
  {
    id: 'study-toolkit',
    name: '学习工具集',
    description: '学习效率工具，包括闪卡记忆、番茄钟、学习计划、成绩分析',
    category: 'education',
    path: '/tools/study-toolkit',
    tags: ['学习', '记忆', '番茄钟', '计划'],
    isInternal: true,
  },

  // 娱乐工具
  {
    id: 'entertainment-toolkit',
    name: '废话文学生成器',
    description: '废话文学生成器，支持多种风格的废话文学创作，包括学术风、商业风、哲学风',
    category: 'entertainment',
    path: '/tools/nonsense-generator',
    tags: ['娱乐', '废话文学', '创作', '文案'],
    isInternal: true,
  },
  {
    id: 'payment-voice',
    name: '支付到账语音生成器',
    description: '生成支付宝、微信等平台的到账语音提示，支持自定义金额和平台类型',
    category: 'entertainment',
    path: '/tools/payment-voice',
    tags: ['语音', '支付', '到账', '提示音'],
    isInternal: true,
  },

  // AI工具
  {
    id: 'ai-toolkit',
    name: 'AI工具集',
    description: 'AI辅助工具，包括文本生成、图像识别、语音转换、智能分析',
    category: 'ai',
    path: '/tools/ai-toolkit',
    tags: ['AI', '智能', '生成', '识别'],
    isInternal: true,
  },
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

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
  const displayTags = showAllTags ? tagsWithCount : tagsWithCount.slice(0, 10);

  // 过滤工具
  const filteredTools = TOOLS.filter(tool => {
    const tagMatch = selectedTag === '' || tool.tags.includes(selectedTag);
    const searchMatch =
      searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return tagMatch && searchMatch;
  });

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
    setSearchQuery('');
  };

  // 清除所有筛选
  const clearFilters = () => {
    setSelectedTag('');
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Wrench className="h-8 w-8" />
          在线工具
        </h1>
        <p className="text-muted-foreground mt-2">实用的在线工具集合，提升工作和学习效率</p>
      </div>

      {/* 标签筛选 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {displayTags.map(({ tag, count }) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTagClick(tag)}
                  className="text-xs h-8"
                >
                  {tag}
                  <span
                    className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                      selectedTag === tag
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </Button>
              ))}

              {!showAllTags && tagsWithCount.length > 10 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllTags(true)}
                  className="text-xs h-8"
                >
                  更多 ({tagsWithCount.length - 10})
                </Button>
              )}

              {showAllTags && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllTags(false)}
                  className="text-xs h-8"
                >
                  收起
                </Button>
              )}
            </div>

            {/* 当前筛选状态 */}
            {selectedTag && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-sm text-muted-foreground">当前筛选:</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  标签: {selectedTag}
                </span>
                <Button onClick={clearFilters} variant="ghost" size="sm" className="text-xs">
                  清除筛选
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 工具网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTools.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">没有找到匹配的工具</p>
          </div>
        ) : (
          filteredTools.map(tool => (
            <Card
              key={tool.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => {
                if (tool.isInternal) {
                  window.location.href = tool.path;
                } else {
                  window.open(tool.path, '_blank');
                }
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTagClick(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        {searchQuery || selectedTag ? (
          <p>显示 {filteredTools.length} 个工具</p>
        ) : (
          <p>共收录 {TOOLS.length} 个实用工具</p>
        )}
      </div>
    </div>
  );
}
