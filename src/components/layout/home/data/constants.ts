/**
 * 首页相关常量配置
 * 统一管理首页的各种配置数据
 */

import {
  Code,
  Palette,
  Lightbulb,
  Pencil,
  BookOpen,
  FileText,
  Compass,
  Github,
} from 'lucide-react';

// 根据时间段的问候语数据
// 推荐标签数据
export const RECOMMENDATION_TAGS = {
  initial: [
    { icon: Code, text: '网页开发', href: '/docs/web-development' },
    { icon: Palette, text: '深入研究', href: '/docs/research' },
    { icon: Lightbulb, text: '项目模式', href: '/docs/project-patterns' },
    { icon: Pencil, text: '图像生成', href: '/docs/image-generation' },
  ],
  more: [
    { icon: BookOpen, text: '文档中心', href: '/docs' },
    { icon: FileText, text: '博客文章', href: '/blog' },
    { icon: Compass, text: '网址导航', href: '/navigation' },
    { icon: Github, text: 'GitHub', href: 'https://github.com/iflux-art/web' },
  ],
} as const;

// 搜索引擎配置
export const SEARCH_ENGINES = [
  { id: 'local', name: '本地搜索' },
  { id: 'web', name: '联网搜索' },
] as const;

// AI模型配置
export const AI_MODELS = [
  {
    id: 'none',
    name: '仅搜索',
    description: '只进行搜索，不使用AI回答',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    description: '强大的中文对话模型',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: '快速响应的轻量级模型',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: '平衡性能与速度的模型',
  },
] as const;

// 背景样式类型
export const BACKGROUND_STYLES = [
  'wave',
] as const;

// 背景样式类型
export type BackgroundStyle = (typeof BACKGROUND_STYLES)[number];

// 搜索引擎类型
export type SearchEngineId = (typeof SEARCH_ENGINES)[number]['id'];

// AI模型类型
export type AIModelId = (typeof AI_MODELS)[number]['id'];

// 工具数据
export const TOOLS = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化和验证JSON数据',
    path: '/tools/json-formatter',
    tags: ['JSON', '格式化', '验证'],
  },
  {
    id: 'base64-encoder',
    name: 'Base64 编解码',
    description: 'Base64编码和解码工具',
    path: '/tools/base64-encoder',
    tags: ['Base64', '编码', '解码'],
  },
  {
    id: 'url-encoder',
    name: 'URL 编解码',
    description: 'URL编码和解码工具',
    path: '/tools/url-encoder',
    tags: ['URL', '编码', '解码'],
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成安全的随机密码',
    path: '/tools/password-generator',
    tags: ['密码', '生成器', '安全'],
  },
  {
    id: 'uuid-generator',
    name: 'UUID 生成器',
    description: '生成各种版本的UUID',
    path: '/tools/uuid-generator',
    tags: ['UUID', '生成器', '唯一标识'],
  },
  {
    id: 'hash-generator',
    name: '哈希生成器',
    description: '生成MD5、SHA等哈希值',
    path: '/tools/hash-generator',
    tags: ['哈希', 'MD5', 'SHA'],
  },
  {
    id: 'regex-tester',
    name: '正则表达式测试',
    description: '测试和验证正则表达式',
    path: '/tools/regex-tester',
    tags: ['正则', '测试', '验证'],
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: '时间戳与日期时间相互转换',
    path: '/tools/timestamp-converter',
    tags: ['时间戳', '转换', '日期'],
  },
  {
    id: 'qr-generator',
    name: '二维码生成器',
    description: '生成各种类型的二维码',
    path: '/tools/qr-generator',
    tags: ['二维码', '生成器', 'QR'],
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '选择和转换颜色格式',
    path: '/tools/color-picker',
    tags: ['颜色', '选择器', '转换'],
  },
] as const;

// 网址导航数据
export const NAVIGATION_SITES = [
  {
    name: 'GitHub',
    description: '全球最大的代码托管平台',
    url: 'https://github.com',
    category: '开发工具',
  },
  {
    name: 'Stack Overflow',
    description: '程序员问答社区',
    url: 'https://stackoverflow.com',
    category: '开发工具',
  },
  {
    name: 'MDN Web Docs',
    description: 'Web开发文档和教程',
    url: 'https://developer.mozilla.org',
    category: '文档',
  },
  {
    name: 'Can I Use',
    description: '浏览器兼容性查询',
    url: 'https://caniuse.com',
    category: '开发工具',
  },
  {
    name: 'CodePen',
    description: '在线代码编辑器',
    url: 'https://codepen.io',
    category: '开发工具',
  },
  {
    name: 'Figma',
    description: '在线设计协作工具',
    url: 'https://figma.com',
    category: '设计工具',
  },
  {
    name: 'Dribbble',
    description: '设计师作品展示平台',
    url: 'https://dribbble.com',
    category: '设计工具',
  },
  {
    name: 'Unsplash',
    description: '免费高质量图片库',
    url: 'https://unsplash.com',
    category: '素材',
  },
] as const;