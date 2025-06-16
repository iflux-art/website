/**
 * 工具页面配置
 * @module config/tools
 */

import { Wrench, PenTool, Code, Palette, FileText, Smile } from 'lucide-react';
import type { ToolCategory, Tool } from '@/components/layout/tools/pages';

/**
 * 工具分类配置
 * @see src/app/tools/page.tsx - 工具页面使用此配置展示分类
 */
export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: 'development', name: '开发工具', icon: Code },
  { id: 'design', name: '设计工具', icon: Palette },
  { id: 'text', name: '文本工具', icon: PenTool },
  { id: 'conversion', name: '转换工具', icon: FileText },
  { id: 'utility', name: '实用工具', icon: Wrench },
  { id: 'entertainment', name: '娱乐工具', icon: Smile },
];

/**
 * 工具列表配置
 * @see src/app/tools/page.tsx - 工具页面使用此配置展示工具列表
 */
export const TOOLS: Tool[] = [
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
    description: '一站式CSS工具集合，包括Flexbox生成器、Grid生成器、渐变生成器等',
    category: 'development',
    path: '/tools/css-toolkit',
    tags: ['CSS', 'Flexbox', 'Grid', '渐变', '工具箱'],
    isInternal: true,
  },
  {
    id: 'text-counter',
    name: '文本统计',
    description: '多功能文本统计工具，支持字数、字符数、段落数统计，并提供阅读时间估算',
    category: 'text',
    path: '/tools/text-counter',
    tags: ['文本', '统计', '字数', '字符数'],
    isInternal: true,
  },
  {
    id: 'markdown-editor',
    name: 'Markdown编辑器',
    description: '在线Markdown编辑器，支持实时预览、自定义主题、导出多种格式',
    category: 'text',
    path: '/tools/markdown-editor',
    tags: ['Markdown', '编辑器', '预览', '导出'],
    isInternal: true,
  },
  {
    id: 'content-creator',
    name: '内容生成器',
    description: '快速生成示例文本、标题、段落等内容，支持自定义规则和模板',
    category: 'text',
    path: '/tools/content-creator',
    tags: ['内容', '生成器', '文本', '模板'],
    isInternal: true,
  },
  {
    id: 'base64-encoder',
    name: 'Base64编解码',
    description: '支持文本、图片、文件的Base64编码和解码，支持批量处理',
    category: 'conversion',
    path: '/tools/base64-encoder',
    tags: ['Base64', '编码', '解码', '转换'],
    isInternal: true,
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: '时间戳与日期时间互转工具，支持多种格式和时区设置',
    category: 'conversion',
    path: '/tools/timestamp-converter',
    tags: ['时间戳', '日期', '转换', '时区'],
    isInternal: true,
  },
  {
    id: 'unit-converter',
    name: '单位转换器',
    description: '支持长度、面积、体积、重量等多种单位的相互转换',
    category: 'conversion',
    path: '/tools/unit-converter',
    tags: ['单位', '转换', '计量'],
    isInternal: true,
  },
  {
    id: 'calculator',
    name: '科学计算器',
    description: '功能强大的在线计算器，支持基础运算、科学计算、单位换算等',
    category: 'utility',
    path: '/tools/calculator',
    tags: ['计算器', '科学', '数学', '换算'],
    isInternal: true,
  },
  {
    id: 'random-generator',
    name: '随机生成器',
    description: '生成随机数字、字符串、密码、颜色等，支持自定义规则',
    category: 'utility',
    path: '/tools/random-generator',
    tags: ['随机', '生成器', '密码'],
    isInternal: true,
  },
  {
    id: 'symbol-collection',
    name: '符号收藏夹',
    description: '常用符号、特殊字符、表情符号集合，支持快速复制和收藏',
    category: 'utility',
    path: '/tools/symbol-collection',
    tags: ['符号', '字符', '表情', '收藏'],
    isInternal: true,
  },
  {
    id: 'nonsense-generator',
    name: '废话生成器',
    description: '一键生成各种风格的废话文章，支持自定义模板和关键词',
    category: 'entertainment',
    path: '/tools/nonsense-generator',
    tags: ['废话', '生成器', '娱乐'],
    isInternal: true,
  },
];
