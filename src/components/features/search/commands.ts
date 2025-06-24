import { Command } from '@/types';

// 快捷命令列表
export const COMMANDS: Command[] = [
  {
    id: 'theme',
    title: '切换主题',
    description: '在亮色和暗色主题之间切换',
    action: () => document.documentElement.classList.toggle('dark'),
  },
  {
    id: 'docs',
    title: '查看文档',
    description: '跳转到文档首页',
    action: () => (window.location.href = '/docs'),
  },
];

// 本地存储键
export const SEARCH_HISTORY_KEY = 'search-history';

// 搜索结果分类显示文本
export const TYPE_LABELS = {
  tool: '工具',
  navigation: '网址导航',
  doc: '文档',
  blog: '博客',
  command: '命令',
  history: '历史记录',
} as const;
