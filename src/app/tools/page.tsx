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
  { id: 'ai', name: 'AI工具', icon: Code },
  { id: 'development', name: '开发', icon: Code },
  { id: 'design', name: '设计', icon: Palette },
  { id: 'writing', name: '写作', icon: PenTool },
  { id: 'conversion', name: '转换', icon: FileText },
  { id: 'utility', name: '实用', icon: Wrench },
  { id: 'emoji', name: 'Emoji', icon: Smile },
];

// 工具数据 - 只包含已实现的工具
const TOOLS = [
  // 开发工具
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化、压缩和验证 JSON 数据',
    category: 'development',
    path: '/tools/json-formatter',
    tags: ['JSON', '格式化', '开发'],
    isInternal: true,
  },
  {
    id: 'base64-encoder',
    name: 'Base64 编解码',
    description: 'Base64 编码和解码工具',
    category: 'development',
    path: '/tools/base64-encoder',
    tags: ['Base64', '编码', '解码'],
    isInternal: true,
  },
  {
    id: 'url-encoder',
    name: 'URL 编解码',
    description: 'URL 编码和解码工具',
    category: 'development',
    path: '/tools/url-encoder',
    tags: ['URL', '编码', '解码'],
    isInternal: true,
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成安全的随机密码',
    category: 'development',
    path: '/tools/password-generator',
    tags: ['密码', '安全', '生成器'],
    isInternal: true,
  },
  {
    id: 'uuid-generator',
    name: 'UUID 生成器',
    description: '生成各种版本的 UUID',
    category: 'development',
    path: '/tools/uuid-generator',
    tags: ['UUID', '生成器', '开发'],
    isInternal: true,
  },
  {
    id: 'hash-generator',
    name: '哈希生成器',
    description: '生成 MD5、SHA1、SHA256 等哈希值',
    category: 'development',
    path: '/tools/hash-generator',
    tags: ['哈希', 'MD5', 'SHA'],
    isInternal: true,
  },
  {
    id: 'regex-tester',
    name: '正则表达式测试',
    description: '测试和验证正则表达式',
    category: 'development',
    path: '/tools/regex-tester',
    tags: ['正则', '测试', '验证'],
    isInternal: true,
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: '时间戳与日期时间互相转换',
    category: 'development',
    path: '/tools/timestamp-converter',
    tags: ['时间戳', '日期', '转换'],
    isInternal: true,
  },
  {
    id: 'qr-generator',
    name: '二维码生成器',
    description: '生成自定义二维码',
    category: 'development',
    path: '/tools/qr-generator',
    tags: ['二维码', 'QR', '生成器'],
    isInternal: true,
  },
  {
    id: 'barcode-generator',
    name: '条形码生成器',
    description: '生成多种格式的条形码',
    category: 'development',
    path: '/tools/barcode-generator',
    tags: ['条形码', '生成器', '编码'],
    isInternal: true,
  },
  {
    id: 'code-formatter',
    name: '代码格式化',
    description: '格式化和压缩多种编程语言的代码',
    category: 'development',
    path: '/tools/code-formatter',
    tags: ['代码', '格式化', '压缩'],
    isInternal: true,
  },
  {
    id: 'api-tester',
    name: 'API测试工具',
    description: '测试REST API接口，支持多种HTTP方法',
    category: 'development',
    path: '/tools/api-tester',
    tags: ['API', '测试', 'HTTP'],
    isInternal: true,
  },
  {
    id: 'regex-generator',
    name: '正则表达式生成器',
    description: '快速生成常用正则表达式，支持实时测试',
    category: 'development',
    path: '/tools/regex-generator',
    tags: ['正则', '生成器', '测试'],
    isInternal: true,
  },
  {
    id: 'code-obfuscator',
    name: '代码混淆工具',
    description: '混淆代码以保护源码，防止逆向工程',
    category: 'development',
    path: '/tools/code-obfuscator',
    tags: ['混淆', '保护', '安全'],
    isInternal: true,
  },

  // 设计工具
  {
    id: 'color-palette',
    name: '颜色库',
    description: '精选颜色库，支持一键复制色值',
    category: 'design',
    path: '/tools/color-palette',
    tags: ['颜色', '色值', '设计'],
    isInternal: true,
  },

  // 写作工具
  {
    id: 'text-counter',
    name: '文字统计',
    description: '统计文本字数、段落数、阅读时间等信息',
    category: 'writing',
    path: '/tools/text-counter',
    tags: ['文字统计', '字数', '写作'],
    isInternal: true,
  },
  {
    id: 'lorem-generator',
    name: 'Lorem 文本生成器',
    description: '生成占位文本，支持中文和英文',
    category: 'writing',
    path: '/tools/lorem-generator',
    tags: ['占位文本', 'Lorem', '生成器'],
    isInternal: true,
  },
  {
    id: 'markdown-editor',
    name: 'Markdown 编辑器',
    description: '在线 Markdown 编辑器，支持实时预览',
    category: 'writing',
    path: '/tools/markdown-editor',
    tags: ['Markdown', '编辑器', '写作'],
    isInternal: true,
  },
  {
    id: 'text-diff',
    name: '文本比较',
    description: '比较两段文本的差异，支持多种比较模式',
    category: 'writing',
    path: '/tools/text-diff',
    tags: ['文本比较', '差异', '对比'],
    isInternal: true,
  },
  {
    id: 'text-encrypt',
    name: '文本加密解密',
    description: '使用多种算法对文本进行加密和解密',
    category: 'writing',
    path: '/tools/text-encrypt',
    tags: ['加密', '解密', '密码'],
    isInternal: true,
  },
  {
    id: 'text-sort',
    name: '文本排序',
    description: '对文本行进行多种方式的排序',
    category: 'writing',
    path: '/tools/text-sort',
    tags: ['排序', '文本', '整理'],
    isInternal: true,
  },

  // 格式转换
  {
    id: 'case-converter',
    name: '大小写转换',
    description: '转换文本大小写格式',
    category: 'conversion',
    path: '/tools/case-converter',
    tags: ['大小写', '转换', '文本'],
    isInternal: true,
  },
  {
    id: 'html-encoder',
    name: 'HTML 编解码',
    description: 'HTML 实体编码和解码',
    category: 'conversion',
    path: '/tools/html-encoder',
    tags: ['HTML', '编码', '转换'],
    isInternal: true,
  },
  {
    id: 'csv-json-converter',
    name: 'CSV/JSON 转换',
    description: 'CSV 和 JSON 格式互相转换',
    category: 'conversion',
    path: '/tools/csv-json-converter',
    tags: ['CSV', 'JSON', '转换'],
    isInternal: true,
  },
  {
    id: 'image-converter',
    name: '图片格式转换',
    description: '在线转换图片格式，支持多种格式',
    category: 'conversion',
    path: '/tools/image-converter',
    tags: ['图片', '格式转换', '压缩'],
    isInternal: true,
  },
  {
    id: 'audio-converter',
    name: '音频格式转换',
    description: '在线转换音频格式，支持多种音频格式',
    category: 'conversion',
    path: '/tools/audio-converter',
    tags: ['音频', '格式转换', '音乐'],
    isInternal: true,
  },
  {
    id: 'encoding-converter',
    name: '编码转换',
    description: '在不同字符编码之间进行转换',
    category: 'conversion',
    path: '/tools/encoding-converter',
    tags: ['编码', '字符集', '转换'],
    isInternal: true,
  },

  // 实用工具
  {
    id: 'calculator',
    name: '科学计算器',
    description: '支持基础和科学计算功能',
    category: 'utility',
    path: '/tools/calculator',
    tags: ['计算器', '数学', '科学'],
    isInternal: true,
  },
  {
    id: 'unit-converter',
    name: '单位转换器',
    description: '长度、重量、温度等单位转换',
    category: 'utility',
    path: '/tools/unit-converter',
    tags: ['单位', '转换', '计算'],
    isInternal: true,
  },
  {
    id: 'random-generator',
    name: '随机生成器',
    description: '生成随机数字、字符串、列表选择和颜色',
    category: 'utility',
    path: '/tools/random-generator',
    tags: ['随机', '生成器', '数字'],
    isInternal: true,
  },
  {
    id: 'base-converter',
    name: '进制转换器',
    description: '二进制、八进制、十进制、十六进制转换',
    category: 'utility',
    path: '/tools/base-converter',
    tags: ['进制', '转换', '二进制'],
    isInternal: true,
  },
  {
    id: 'stopwatch',
    name: '秒表计时器',
    description: '精确的秒表和倒计时功能',
    category: 'utility',
    path: '/tools/stopwatch',
    tags: ['秒表', '计时器', '倒计时'],
    isInternal: true,
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '选择颜色并获取各种格式的色值',
    category: 'utility',
    path: '/tools/color-picker',
    tags: ['颜色', '选择器', '色值'],
    isInternal: true,
  },
  {
    id: 'ip-lookup',
    name: 'IP 地址查询',
    description: '查询 IP 地址的地理位置和网络信息',
    category: 'utility',
    path: '/tools/ip-lookup',
    tags: ['IP', '查询', '网络'],
    isInternal: true,
  },
  {
    id: 'geometry-calculator',
    name: '几何计算器',
    description: '计算各种几何图形的面积、周长、体积',
    category: 'utility',
    path: '/tools/geometry-calculator',
    tags: ['几何', '计算器', '数学'],
    isInternal: true,
  },
  {
    id: 'statistics-calculator',
    name: '统计计算器',
    description: '计算数据集的各种统计指标',
    category: 'utility',
    path: '/tools/statistics-calculator',
    tags: ['统计', '数学', '分析'],
    isInternal: true,
  },
  {
    id: 'url-shortener',
    name: '网址缩短器',
    description: '将长网址转换为简短链接',
    category: 'utility',
    path: '/tools/url-shortener',
    tags: ['网址', '缩短', '链接'],
    isInternal: true,
  },
  {
    id: 'file-hash',
    name: '文件哈希校验',
    description: '计算文件的多种哈希值进行完整性验证',
    category: 'utility',
    path: '/tools/file-hash',
    tags: ['哈希', '校验', '安全'],
    isInternal: true,
  },
  {
    id: 'domain-lookup',
    name: '域名查询',
    description: '查询域名的注册信息和DNS记录',
    category: 'utility',
    path: '/tools/domain-lookup',
    tags: ['域名', '查询', 'WHOIS'],
    isInternal: true,
  },
  {
    id: 'port-scanner',
    name: '端口扫描器',
    description: '扫描目标主机的开放端口',
    category: 'utility',
    path: '/tools/port-scanner',
    tags: ['端口', '扫描', '网络'],
    isInternal: true,
  },
  {
    id: 'date-calculator',
    name: '日期计算器',
    description: '计算日期差、日期加减、年龄计算',
    category: 'utility',
    path: '/tools/date-calculator',
    tags: ['日期', '计算器', '时间'],
    isInternal: true,
  },
  {
    id: 'todo-manager',
    name: '待办事项管理',
    description: '管理任务和待办事项，提高工作效率',
    category: 'utility',
    path: '/tools/todo-manager',
    tags: ['待办', '任务', '管理'],
    isInternal: true,
  },
  {
    id: 'notes',
    name: '笔记工具',
    description: '创建、编辑和管理笔记，支持标签分类',
    category: 'utility',
    path: '/tools/notes',
    tags: ['笔记', '记录', '管理'],
    isInternal: true,
  },
  {
    id: 'table-editor',
    name: '表格处理工具',
    description: '在线编辑表格，支持多种格式导入导出',
    category: 'utility',
    path: '/tools/table-editor',
    tags: ['表格', '编辑', 'CSV'],
    isInternal: true,
  },
  {
    id: 'pdf-tools',
    name: 'PDF工具集',
    description: 'PDF文件处理，支持合并、分割、压缩',
    category: 'utility',
    path: '/tools/pdf-tools',
    tags: ['PDF', '合并', '分割'],
    isInternal: true,
  },
  {
    id: 'image-editor',
    name: '图片处理工具',
    description: '在线图片编辑，支持调整大小、裁剪、滤镜',
    category: 'utility',
    path: '/tools/image-editor',
    tags: ['图片', '编辑', '滤镜'],
    isInternal: true,
  },
  {
    id: 'password-strength',
    name: '密码强度检测',
    description: '检测密码强度，提供安全建议',
    category: 'utility',
    path: '/tools/password-strength',
    tags: ['密码', '安全', '检测'],
    isInternal: true,
  },
  {
    id: 'system-info',
    name: '系统信息检测',
    description: '检测浏览器、系统、硬件信息',
    category: 'utility',
    path: '/tools/system-info',
    tags: ['系统', '检测', '信息'],
    isInternal: true,
  },
  {
    id: 'speed-test',
    name: '网络测速工具',
    description: '测试网络下载速度、上传速度和延迟',
    category: 'utility',
    path: '/tools/speed-test',
    tags: ['网络', '测速', '延迟'],
    isInternal: true,
  },
  {
    id: 'qr-decoder',
    name: '二维码解析器',
    description: '上传图片或使用摄像头扫描二维码',
    category: 'utility',
    path: '/tools/qr-decoder',
    tags: ['二维码', '扫描', '解析'],
    isInternal: true,
  },
  {
    id: 'file-compressor',
    name: '文件压缩工具',
    description: '压缩文件以减小存储空间',
    category: 'utility',
    path: '/tools/file-compressor',
    tags: ['压缩', '文件', '存储'],
    isInternal: true,
  },
  {
    id: 'image-compressor',
    name: '图片压缩优化',
    description: '压缩图片文件大小，优化网页加载速度',
    category: 'utility',
    path: '/tools/image-compressor',
    tags: ['图片', '压缩', '优化'],
    isInternal: true,
  },

  // Emoji 工具
  {
    id: 'emoji-picker',
    name: 'Emoji 选择器',
    description: '浏览和复制 Emoji 表情符号',
    category: 'emoji',
    path: '/tools/emoji-picker',
    tags: ['Emoji', '表情', '复制'],
    isInternal: true,
  },
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤工具
  const filteredTools = TOOLS.filter(tool => {
    const categoryMatch = selectedCategory === 'all' || tool.category === selectedCategory;
    const searchMatch =
      searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && searchMatch;
  });

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

      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索工具..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* 分类选择 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {TOOL_CATEGORIES.map(category => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* 工具网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">没有找到匹配的工具</p>
          </div>
        ) : (
          filteredTools.map(tool => (
            <Card
              key={tool.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{tool.name}</span>
                  {tool.isInternal ? (
                    <Link href={tool.path}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(tool.path, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
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
        {searchQuery || selectedCategory !== 'all' ? (
          <p>显示 {filteredTools.length} 个工具</p>
        ) : (
          <p>共收录 {TOOLS.length} 个实用工具</p>
        )}
      </div>
    </div>
  );
}
