import type { Command } from "@/types/search";

export const COMMANDS: Command[] = [
  {
    id: "theme",
    title: "切换主题",
    description: "在亮色和暗色主题之间切换",
    action: () => document.documentElement.classList.toggle("dark"),
  },
  {
    id: "docs",
    title: "查看文档",
    description: "跳转到文档首页",
    action: () => (window.location.href = "/docs"),
  },
];

export const SEARCH_HISTORY_KEY = "iflux-search-history";

export const TYPE_LABELS = {
  tool: "工具",
  link: "网址导航",
  docs: "文档",
  blog: "博客",
  command: "命令",
  navigation: "网址导航",
  doc: "文档",
  history: "历史记录",
} as const;
