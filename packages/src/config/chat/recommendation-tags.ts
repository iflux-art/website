/**
 * 推荐标签数据
 * 包含常用工具链接
 */

import {
  BotMessageSquare,
  Paintbrush,
  Presentation,
  Search,
  Languages,
  Sparkles,
  Github,
} from "lucide-react";

export interface RecommendationTag {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  href: string;
}

export const RECOMMENDATION_TAGS = {
  initial: [
    {
      icon: BotMessageSquare,
      text: "ChatGPT",
      href: "https://chat.openai.com",
    },
    {
      icon: Paintbrush,
      text: "Midjourney",
      href: "https://www.midjourney.com",
    },
    { icon: Presentation, text: "Gamma", href: "https://gamma.app" },
    { icon: Search, text: "Perplexity", href: "https://www.perplexity.ai" },
  ],
  more: [
    { icon: Sparkles, text: "Poe", href: "https://poe.com" },
    {
      icon: Languages,
      text: "DeepL",
      href: "https://www.deepl.com/translator",
    },
    { icon: BotMessageSquare, text: "Claude", href: "https://claude.ai/" },
    {
      icon: Github,
      text: "GitHub Copilot",
      href: "https://github.com/features/copilot",
    },
  ],
} as const;

export type TagCategory = keyof typeof RECOMMENDATION_TAGS; 